<template>
  <div class="aside">
    <ul v-for="(item, index) in list" :key="index" class="list">
      <div class="title">{{ item.name }}</div>
      <li v-for="(subItem, subIndex) in item.list" :key="subIndex" class="subList" :class="{ isPath: subItem.path }" @click="goPath(subItem.path)">
        {{ subItem.name }}
      </li>
    </ul>
    <UserInfo v-if="!userReady" class="loginTips">
      <div class="login">登 录</div>
      <div class="tips">以解锁FM、云盘、歌单</div>
    </UserInfo>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UserInfo from "./UserInfo.vue";
export default Vue.extend({
  components: {
    UserInfo
  },
  data() {
    return {
      list: [
        {
          name: "推荐",
          list: [
            {
              name: "发现音乐",
              path: "/findMusic"
            }
          ]
        },
        {
          name: "我的音乐",
          list: [
            {
              name: "本地音乐",
              path: "/localMusic"
            },
            {
              name: "下载管理",
              path: "/download"
            }
          ]
        },
        {
          name: "",
          list: []
        }
      ],
      userReady: false
    };
  },
  watch: {
    "$store.state.userInfo"(val) {
      if (val && val.code == 200) {
        this.list[0].list.push({
          name: "私人FM",
          path: "/privateFM"
        });
        this.list[1].list.push({
          name: "音乐云盘",
          path: "/musicCloud"
        });
        this.list[2] = {
          name: "我的歌单",
          list: [
            {
              name: "我喜欢的音乐",
              path: "/favoriteMusic"
            },
            {
              name: "ACG",
              path: "/list?id=12323"
            }
          ]
        };
        this.userReady = true;
      }
    }
  },
  methods: {
    goPath(path) {
      if (path) {
        this.$router.push(path);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.aside {
  width: 220px;
  padding: 10px 0 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .title {
    margin-top: 10px;
    padding: 20px 24px 10px;
    font-size: 12px;
    color: #666;
  }
  .subList {
    font-size: 14px;
    padding: 8px 24px;
    height: 36px;
  }
  .isPath {
    cursor: pointer;
    transition: all 0.1s ease;
    &:hover {
      background-color: #cee9ef;
    }
  }
  .list {
    transition: all 0.5s ease;
    overflow: hidden;
  }
  .loginTips {
    // cursor: pointer;
    margin: auto 0 0;
    padding: 4px;
    text-align: center;
    transition: all 0.2s ease;
    background-color: rgba($color: #cfedf5, $alpha: 0.8);
    &:hover {
      background-color: rgba($color: #b7facd, $alpha: 0.8);
    }
    .login {
      font-size: 16px;
    }
    .tips {
      font-size: 12px;
    }
  }
}
</style>
