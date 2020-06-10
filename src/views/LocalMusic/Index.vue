<template>
  <div class="localMusic">
    <div>
      <el-button type="text" @click="openFolder">选择目录</el-button>
    </div>
    <el-table class="localTable" :data="musicList" style="width: 100%" height="100%" @row-dblclick="playMusic">
      <el-table-column type="index" width="30"> </el-table-column>
      <el-table-column prop="title" label="音乐" width="160"> </el-table-column>
      <el-table-column prop="artists" label="歌手" width="100">
        <template slot-scope="scope">
          {{ scope.row.artists | formatArtists }}
        </template>
      </el-table-column>
      <el-table-column prop="album" label="专辑" width="100"> </el-table-column>
      <el-table-column prop="duration" label="时长" width="60">
        <template slot-scope="scope">
          {{ scope.row.duration | formatDuration }}
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小" width="70">
        <template slot-scope="scope">
          {{ scope.row.size | formatSize }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import nativeUtil from "@/utils/index";
export default Vue.extend({
  data() {
    return {
      musicList: [] as AudioDes[]
    };
  },
  methods: {
    async openFolder() {
      const path = await nativeUtil.chooseFolder();
      const info = await nativeUtil.readFolder(path);
      this.musicList = [];
      for (const file of info.files) {
        let audioDes = await nativeUtil.readMetadata(file.path);
        audioDes && (audioDes = { ...audioDes, ...file }) && this.musicList.push(audioDes);
      }
    },
    playMusic(row) {
      this.$store.commit("SET_PLAYLIST", this.musicList);
      this.$store.commit("SET_PLAYINDEX", this.musicList.indexOf(row));
      this.$store.commit("SET_PLAYSTATUS", true);
    }
  }
});
</script>

<style lang="scss">
.localMusic {
  display: flex;
  flex-direction: column;
}
.el-table,
.el-table__expanded-cell {
  background-color: inherit;
}
.el-table__header {
  th,
  tr {
    background-color: inherit;
  }
}
.el-table th,
.el-table tr {
  background-color: inherit;
}
.el-table__header {
  width: 100% !important;
}
.el-table__body {
  width: 100% !important;
}
.el-table .cell {
  white-space: nowrap;
}
.el-table__empty-block {
  width: 100% !important;
  overflow-y: scroll;
}
.el-table__header {
  table-layout: auto;
}
.el-table__body-wrapper {
  overflow-y: scroll;
}
</style>
