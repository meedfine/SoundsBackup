<template>
  <header class="header">
    <div class="searchCom no-drag">
      <i class="iconfont i-back" @click="goBack"></i>
      <i class="iconfont i-forward" @click="goForward"></i>
      <el-input v-model="searchText" placeholder="搜索音乐、歌手"> </el-input>
    </div>
    <div class="controlCom no-drag">
      <i class="icon-hide" @click="hideWindow"></i>
      <i
        :class="{
          'icon-minimax': !isMaximized,
          'icon-minimax2': isMaximized
        }"
        @click="minimaxWindow"
      ></i>
      <i class="icon-close" @click="closeWindow"></i>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
export default Vue.extend({
  data() {
    return {
      isMaximized: false,
      searchText: ""
    };
  },
  mounted() {
    ipcRenderer.on("resizeWindow", (event, arg) => {
      this.isMaximized = arg;
    });
  },
  methods: {
    hideWindow() {
      ipcRenderer.send("hideWindow");
    },
    minimaxWindow() {
      ipcRenderer.send("minimaxWindow");
    },
    closeWindow() {
      ipcRenderer.send("closeWindow");
    },
    goBack() {
      this.$router.go(-1);
    },
    goForward() {
      this.$router.go(1);
    }
  }
});
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  .searchCom {
    padding-left: 10px;
    display: flex;
    .iconfont {
      font-size: 20px;
      color: #ccc;
      margin: 4px;
      cursor: pointer;
      &.active {
        color: #666;
      }
    }
    .el-input {
      height: 40px;
      line-height: 36px;
      font-size: 12px;
      margin-left: 10px;
    }
    .el-input__inner {
      height: 26px;
      width: 180px;
      border-radius: 40px;
      background-color: #f1eeed;
      border: 1px solid #f1eeed;
      &:hover,
      &:focus {
        border: 1px solid #e2dfde;
      }
    }
  }
  .controlCom {
    z-index: 10000;
    height: 100%;
  }
}
</style>
