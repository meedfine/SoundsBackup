<template>
  <div class="trayCom">
    <div class="trayBtn" @click="openWindow">打开程序</div>
    <div class="trayBtn" @click="exit">退出</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
export default Vue.extend({
  methods: {
    openWindow() {
      ipcRenderer.send("showWindow");
    },
    exit() {
      ipcRenderer.send("exitAPP");
    }
  }
});
</script>

<style lang="scss">
.trayCom {
  width: 100%;
  height: 100%;
  grid-row: 1/4;
  grid-column: 1/3;
}
.trayBtn {
  height: 36px;
  line-height: 36px;
  padding-left: 50px;
  cursor: pointer;
  color: rgb(24, 22, 22);
  background-color: #fff;
  &:hover {
    background-color: #eee;
    color: rgb(44, 119, 138);
  }
}
</style>
