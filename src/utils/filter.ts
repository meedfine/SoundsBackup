import Vue from "vue";
import dayjs from "dayjs";

Vue.filter("formatDuration", val => {
  if (!val) return "00:00";
  return dayjs(Math.floor(val * 1000)).format("mm:ss");
});

Vue.filter("formatSize", val => {
  if (!val) return "0MB";
  return (val / 1000 / 1000).toFixed(1) + "MB";
});

Vue.filter("formatArtists", val => {
  if (!val) return "";
  return val.join(" / ");
});
