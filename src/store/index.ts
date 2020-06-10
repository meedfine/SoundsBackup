import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    playList: [] as AudioDes[],
    playIndex: -1,
    currentTime: 0,
    playStatus: false,
    volume: 0.3,
    mode: "round" as PlayType, // round random sequence single
    userInfo: {}
  },
  mutations: {
    SET_PLAYLIST(state, value) {
      state.playList = value;
    },
    SET_PLAYINDEX(state, value) {
      state.playIndex = value;
    },
    SET_CURRENTTIME(state, value) {
      state.currentTime = value;
    },
    SET_PLAYSTATUS(state, value) {
      state.playStatus = value;
    },
    SET_VOLUME(state, value) {
      state.volume = value;
    },
    SET_MODE(state, value) {
      if (value) {
        state.mode = value;
      } else {
        switch (state.mode) {
          case "round":
            state.mode = "random";
            break;
          case "random":
            state.mode = "sequence";
            break;
          case "sequence":
            state.mode = "single";
            break;
          case "single":
            state.mode = "round";
            break;
        }
      }
    },
    SET_USERINFO(state, value) {
      state.userInfo = value;
    }
  },
  actions: {},
  modules: {}
});
