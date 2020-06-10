<template>
  <div class="audio"></div>
</template>

<script lang="ts">
import Vue from "vue";
import fs from "fs";
const fsPromises = fs.promises;
export default Vue.extend({
  props: {
    // 音频路径
    path: {
      type: String,
      default: ""
    },
    // 播放状态
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      audioContext: new AudioContext(),
      audioSource: "" as any,
      audioGain: "" as any,
      volPercent: 0,
      intervalId: "" as any,
      timeIntervalId: "" as any,
      readyFlag: false
    };
  },
  computed: {
    volume() {
      return (this as any).volPercent * 0.01 * 0.2;
    }
  },
  watch: {
    async path(val) {
      this.fadeOut();
      const data = await this.initAudio(val);
      this.playAudio(data);
      this.fadeIn();
    },
    status(val) {
      if (val) {
        if (this.readyFlag) {
          this.fadeIn();
          this.audioContext.resume();
        }
      } else {
        this.fadeOut(() => {
          this.audioContext.suspend();
        });
      }
    }
  },
  methods: {
    changeCurrentTime(offsetTime) {
      if (this.audioContext) {
        const audioContext = new AudioContext();
        const audioSource = audioContext.createBufferSource();
        const audioGain = audioContext.createGain();
        audioSource.buffer = this.audioSource.buffer;
        audioSource.connect(audioGain);
        audioGain.connect(audioContext.destination);
        this.volPercent = 0;
        this.fadeIn();
        this.playAudio({
          audioContext,
          audioSource,
          audioGain,
          offsetTime
        });
      }
    },
    async initAudio(path) {
      clearInterval(this.timeIntervalId);
      this.$emit("musicUpdateTime", 0);
      this.readyFlag = false;
      const data = await this.readAudioFile(path);
      const audioContext = new AudioContext();
      const audioSource = audioContext.createBufferSource();
      const audioGain = audioContext.createGain();
      return audioContext.decodeAudioData(data.buffer).then(value => {
        this.readyFlag = true;
        audioSource.buffer = value;
        audioSource.connect(audioGain);
        audioGain.connect(audioContext.destination);
        return {
          audioContext,
          audioSource,
          audioGain,
          offsetTime: 0
        };
      });
    },
    playAudio(data) {
      clearInterval(this.timeIntervalId);
      this.audioContext.close();
      this.audioContext = data.audioContext;
      this.audioSource = data.audioSource;
      this.audioGain = data.audioGain;
      this.audioGain.gain.setValueAtTime(this.volume, 0);
      this.audioSource.start(0, data.offsetTime);
      this.$emit("musicUpdateTime", data.offsetTime + this.audioContext.currentTime);
      this.timeIntervalId = setInterval(() => {
        if (!this.status) {
          return;
        }
        // musicmeta读出来的duration 比转成audioSoure格式的duration大，稍作兼容
        if (data.offsetTime + this.audioContext.currentTime > this.audioSource.buffer.duration + 0.1) {
          this.$emit("musicUpdateTime", this.audioSource.buffer.duration);
          setTimeout(() => {
            clearInterval(this.timeIntervalId);
            this.$emit("musicEnd", true);
          }, 200);
          return;
        }
        this.$emit("musicUpdateTime", data.offsetTime + this.audioContext.currentTime);
      }, 500);
    },
    fadeIn(fn?: Function) {
      if (!this.audioGain || !this.audioContext) {
        fn && fn();
        return;
      }
      this.fadeInterval("in", fn);
    },
    fadeOut(fn?: Function) {
      if (!this.audioGain || !this.audioContext) {
        fn && fn();
        return;
      }
      this.fadeInterval("out", fn);
    },
    fadeInterval(type, fn?) {
      // 重复20次
      clearInterval(this.intervalId);
      this.audioGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      this.intervalId = setInterval(() => {
        type == "in" ? (this.volPercent += 5) : (this.volPercent -= 5);
        if (this.volPercent > 100) {
          this.volPercent = 100;
        } else if (this.volPercent < 0) {
          this.volPercent = 0;
        }
        this.audioGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        if (this.volPercent >= 100 || this.volPercent <= 0) {
          clearInterval(this.intervalId);

          fn && fn();
        }
      }, 25);
    },
    async readAudioFile(path: string): Promise<any> {
      return fsPromises.readFile(path);
    }
  }
});
</script>
