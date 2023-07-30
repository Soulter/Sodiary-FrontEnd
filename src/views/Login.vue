<template>
  <div id="app" data-app="true">
    <v-main id="vue_main">
      <template>
        <v-card id="login_cv">
          <v-card-text>
            <p id="login_cv_title">
              {{ title }}
            </p>
          </v-card-text>
          <form id="login_form">
            <v-text-field
                v-model="loginFormData.username"
                :counter="10"
                label="用户名"
                required
            ></v-text-field>
            <v-text-field
                v-model="loginFormData.password"
                label="密码"
                required
            ></v-text-field>
            <v-btn
                id="login_btn"
                :loading="loading"
                :disabled="loading"
                style="margin-right: 20px;"

                @click="loader = 'loading'">
              {{ title }}
            </v-btn>

            <v-btn
                id="login_btn"
                :loading="loading"
                :disabled="loading"

                @click="reg">
                去{{ title2 }}
            </v-btn>

          </form>
        </v-card>

        <v-row justify="center">
          <v-dialog
              v-model="login_msg_dialog"
              max-width="290">
            <v-card>
              <v-card-title class="headline">提示</v-card-title>

              <v-card-text>
                {{login_msg}}
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    text
                    @click="login_msg_dialog = false">
                  好的
                </v-btn>
              </v-card-actions>

              
            </v-card>
          </v-dialog>
        </v-row>

      </template>

    </v-main>

  </div>
</template>

<script>

import axios from 'axios'
import router from "@/router";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login.vue",
  data(){
    return{
      loginFormData: {},
      loading: false,
      loader: null,
      login_msg_dialog: false,
      login_msg: "",
      in_login: false,
      title: "登录",
      title2: "注册"
    }
  },
  watch: {
    loader () {
      if (!this.in_login){
        this.in_login = true
        const l = this.loader
        this[l] = !this[l]

        console.log(this.loginFormData)
        //发送ajax请求

        if (this.title === "注册"){
          axios.post("/register",this.loginFormData).then((res)=>{
            console.log(res.data);
            if (res.data.code !== 200102){
              this.login_msg = res.data.msg
              this.login_msg_dialog = true
            }else{
              this.login_msg = "注册成功！"
              this.login_msg_dialog = true
              this.title = "登录"
              this.title2 = "注册"
            }
          }).finally(()=>{
            this[l] = false
            this.in_login = false
          });
          return
        } else{

          axios.post("/login",this.loginFormData).then((res)=>{
            console.log(res.data);
            if (res.data.code !== 200101){
              this.login_msg = res.data.msg
              this.login_msg_dialog = true
            }else{
              // this.login_msg = "登录成功！"
              // this.login_msg_dialog = true
              // window.location.href='../admin.html'
              router.push({path: '/admin'})
            }
          }).finally(()=>{
            this[l] = false
            this.in_login = false
          });

        }
        
        // setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      }

    },
  },
  methods: {
    clear () {
      this.username = ''
      this.email = ''
      this.select = null
      this.checkbox = false
    },
    reg(){
      if (this.title === "登录"){
        this.title = "注册"
        this.title2 = "登录"
      }else{
        this.title = "登录"
        this.title2 = "注册"
      }
    }
  },
}
</script>

<style scoped>
#app{
  width: 500px;
  height: 280px;
  position: relative;
  margin: 0 auto;
  vertical-align: middle;
  text-align: center;
}
#vue_main{
  margin-top: 250px;
}
#login_cv_title{
  font-size: 30px;
  color: black;
  text-align: left;
  margin-top: 32px;
  margin-left: 24px;
}
#login_form{
  margin-left: 64px;
  margin-right: 64px;
}
#login_cv{
  width: 500px;
}
#login_btn{
  width: 100px;
  margin-top: 30px;
  margin-bottom: 50px;
}
</style>