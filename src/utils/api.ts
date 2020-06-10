import axios from "axios";

const baseUrl = "//47.102.99.136:3000";

export default {
  /**
   * 获取用户歌单
   * @param params uid
   */
  getUserPlayList(params: { uid: string }) {
    return axios.get(`${baseUrl}/user/playlist`, { params });
  },
  /**
   * 获取歌单详情
   * @param params id
   */
  getPlayListDetail(params: { id: any }) {
    return axios.get(`${baseUrl}/playlist/detail`, { params });
  },
  /**
   * 获取音乐url
   * @param params id
   */
  getSongUrl(params: { id: any }) {
    return axios.get(`${baseUrl}/song/url`, { params });
  },
  /**
   * 手机号登录
   * @param params phone password
   */
  loginByPhone(params: { phone: string; password: string }) {
    return axios.post(`${baseUrl}/login/cellphone`, params, {
      transformRequest: [
        function(data) {
          let ret = "";
          for (const it in data) {
            ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
          }
          return ret;
        }
      ],
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded" //hearder 很重要，Content-Type 要写对
      }
    });
  },
  /**
   * 取消登录
   */
  logout() {
    return axios.post(`${baseUrl}/logout`);
  },
  /**
   * 获取热门歌单分类
   */
  getHotPlayListTag() {
    return axios.get(`${baseUrl}/playlist/hot`);
  },
  /**
   * 获取热门歌单
   * @param params cat?
   */
  getHotPlayList(params: { cat?: string }) {
    return axios.get(`${baseUrl}/top/playlist`, { params });
  },
  /**
   * 获取歌词
   * @param params id
   */
  getLyric(params: { id: any }) {
    return axios.get(`${baseUrl}/lyric`, { params });
  }
};
