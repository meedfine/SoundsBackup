<template>
  <div class="commonLayout">
    <div class="commonMain">
      <Aside class="commonAside"></Aside>
      <div class="commonContentWrap">
        <Header class="commonHeader drag"></Header>
        <div class="transitionWrap">
          <keep-alive>
            <transition name="fade"> <router-view class="commonContent"/></transition>
          </keep-alive>
        </div>
      </div>
    </div>
    <Footer class="commonFooter"></Footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Aside from "../Aside.vue";
import Header from "../Header.vue";
import Footer from "../Footer.vue";
export default Vue.extend({
  components: {
    Aside,
    Header,
    Footer
  }
});
</script>

<style lang="scss">
.commonLayout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.commonMain {
  flex: 1 0 100px;
  display: flex;
  overflow: hidden;
}
.commonFooter {
  flex: 0 0 auto;
  background-color: #f3eded;
}
.commonAside {
  flex: 0 0 auto;
  background-image: linear-gradient(to bottom right, #cee9ef, #f3eded);
}
.commonContentWrap {
  overflow: hidden;
  flex: 1 0 100px;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to bottom, #f1eeed, #f6f6f6);
}
.commonHeader {
  flex: 0 0 auto;
}
.commonContent {
  transition: all 0.15s ease-in-out;
  flex: 1 0 100px;
}
.transitionWrap {
  flex: 1 0 100px;
  display: flex;
  position: relative;
}
.fade-enter-active {
  transform: translateX(30%);
  opacity: 0;
}
.fade-leave-active {
  transform: translateX(-15%);
  position: absolute;
  left: 0;
  opacity: 0;
}
</style>
