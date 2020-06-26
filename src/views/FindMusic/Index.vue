<template>
  <div class="main">
    <el-button @click="getSongUrl">获取URL</el-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import api from "../../utils/api";
export default Vue.extend({
  methods: {
    getSongUrl() {
      api.getSongUrl({ id: 2001472 }).then(res => {
        const playList = this.$store.state.playList;
        playList[0].path = res.data.data[0].url;
        this.$store.commit("SET_PLAYLIST", playList);
        // this.$store.state.playList[0].path = res.data.data[0].url;
        // console.log(res);
      });
    }
  }
});
</script>
