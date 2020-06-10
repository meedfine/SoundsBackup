<template>
  <div class="login">
    <div @click="loginVisible = true">
      <slot>登录</slot>
    </div>
    <el-dialog center title="登录" :visible.sync="loginVisible" :modal="true" width="40%">
      <el-form :model="form">
        <el-form-item label="手机号">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="loginVisible = false">取 消</el-button>
        <el-button type="primary" @click="loginByPhone()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import api from "../utils/api";
export default Vue.extend({
  data() {
    return {
      form: {
        phone: "18584863864",
        password: ""
      },
      loginVisible: false
    };
  },
  methods: {
    loginByPhone() {
      this.loginVisible = false;
      api.loginByPhone(this.form).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: "登录成功",
            type: "success",
            offset: 0.1,
            duration: 1500
          });
          this.$store.commit("SET_USERINFO", res.data);
        } else {
          this.$message({
            message: "登录失败，请重试",
            type: "error",
            offset: 0.1,
            duration: 2000
          });
        }
      });
    }
  }
});
</script>
