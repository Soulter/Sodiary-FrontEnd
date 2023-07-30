<template>
  <div class="site-main" id="site-main">
    <div class="site-header">
      <a id="site-title" @click="gotoAdmin" class="pointer">
        🥰Soulter's Diary
      </a>
    </div>



    <div class="site-content" v-if="refresh_diaries">

      <v-progress-circular
        indeterminate
        v-if="loading"
        color="primary"
      ></v-progress-circular>

      <div class="diary" id="diary-wrap" v-for="(diary, i) in diaries" :key="i">
        <div id="div-diary-title">
          <a id="diary-title" class="pointer" @click="detail(diary)">
            {{diary.title}}
          </a>
        </div>
        <div id="div-diary-time">
                <span id="diary-time">
                    {{diary.time}}
                </span>
        </div>
        <div id="div-diary-content" style="margin-bottom: 16px;">
                <span id="diary-content">
                    {{diary.content}}
                </span>
        </div>
      </div>
    </div>

    <div class="site-foot">
      <a id="pre-page" @click="prePage" v-show="showPre" class="pointer">
        上一页
      </a>
      <a id="next-page" @click="nextPage" v-show="showNext" class="pointer">
        下一页
      </a>
    </div>

    <v-dialog v-model="lockDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card class="lock-card">

          <div class="key-container">
            <div class="input-form">
              <input v-model="diaryKey" class="input" name="text" type="text" required="">
              <label class="textUser">已被加密</label>
            </div>
            <v-btn @click="verifyLock" style="margin-top: 16px; border-radius: 9px; width: 130px;">
              确定
            </v-btn>
          </div>

      </v-card>
    </v-dialog>

    <v-snackbar
        v-model="openMessage"
    >
      {{message}}
    </v-snackbar>


  </div>
</template>

<script>

import axios from 'axios'
import router from "@/router";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Main.vue",
  data() {
    return {
      loading: false,
      lockDialog: false,
      diaryKey: '',
      openMessage: false,
      message: '',
      diaries: [],
      diariest: [{
        title: "你好呀",
        time: "2022/6/22 22:33",
        id: 1,
        bg: "https://soulter.top/images/dn1.jpg",
        content: "示例内容，示例内容。示例内容，示例内容。示例内容，示例内容。很长的示例内容，很长的示例内容很长的示例内容很长的示例内容很长的示例内容很长的示例内容很长的示例内容，长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长"
      },
        {title: "你好呀", time: "2022/6/22 22:33", content: "示例内容，示例内容。示例内容，示例内容。示例内容，示例内容。"}],
      refresh_diaries: true,
      page: 0,
      size: 5,
      showPre: false,
      showNext: false,
      test111: {
        "UID": "",
        "conditions": {
          "year": 2021
        },
        "order": "id",
        "direction": 1,
        "page_size": 1000,
        "page": 1
      },
      isUnlocked: false
    }
  },
  watch:{
    diaries() {
      console.log("change")
      this.refresh_diaries = false;
      //?
      this.$nextTick(() => {
        this.refresh_diaries = true;
      });

    }
  },

  created() {
    this.loading = true;
  },

  mounted() {
    //发送ajax请求
    this.nextPage();
  },
  methods: {
    nextPage(){
      this.loading = true;
      //发送ajax请求
      this.page++;
      axios.get("/diary/fetch?page="+this.page+"&size="+this.size).then((res)=>{
        console.log(res.data);
        this.diaries = res.data.reverse();
        for (let i = 0; i < this.diaries.length; i++) {
          if(this.diaries[i].brief!=null){
            this.diaries[i].content = this.diaries[i].brief
          } else {
            this.diaries[i].content = this.diaries[i].content.substring(0, 100) + "..."
          }
          if (this.diaries[i].bg!=null && this.diaries[i].bg!=""){

            document.getElementById("diary-wrap").style.background = "url(" + this.diaries[i].bg + ")";
            // 获取图片的主题色，并将div-diary-title字体颜色改为主题色的反色
            // 获取图片
            // let img = new Image();
            // img.src = this.diaries[i].bg;
            
            // img.onload = function () {
            //   // 创建canvas
            //   console.log(img.width, img.height)
            //   let canvas = document.createElement('canvas');
            //   let ctx = canvas.getContext('2d');
            //   canvas.width = img.width;
            //   canvas.height = img.height;
            //   ctx.drawImage(img, 0, 0, img.width, img.height);
            //   // 获取像素点
            //   let data = ctx.getImageData(0, 0, img.width, img.height).data;
            //   let r = 0, g = 0, b = 0;
            //   for (let row = 0; row < img.height; row++) {
            //     for (let col = 0; col < img.width; col++) {
            //       r += data[((img.width * row) + col) * 4];
            //       g += data[((img.width * row) + col) * 4 + 1];
            //       b += data[((img.width * row) + col) * 4 + 2];
            //     }
            //   }
            //   // 求取平均值
            //   r /= (img.width * img.height);
            //   g /= (img.width * img.height);
            //   b /= (img.width * img.height);
            //   // 将最终的值取整
            //   r = Math.round(r);
            //   g = Math.round(g);
            //   b = Math.round(b);
            //   // 将最终的值转化成16进制
            //   let color = ((r << 16) | (g << 8) | b).toString(16);
            //   // 补全
            //   for (let i = 0; i < 6 - color.length; i++) {
            //     color = '0' + color;
            //   }
            //   // 反色
            //   let reverseColor = '';
            //   for (let i = 0; i < 3; i++) {
            //     let temp = color.substr(i * 2, 2);
            //     temp = 255 - parseInt(temp, 16);
            //     temp = Math.round(temp).toString(16);
            //     if (temp.length === 1) {
            //       temp = '0' + temp;
            //     }
            //     reverseColor += temp;
            //   }
            //   // 将div-diary-title字体颜色改为主题色的反色
            //   document.getElementById("diary-title").style.color = "#" + reverseColor;
            // }
            document.getElementById("diary-title").style.color = "#ddd";
            document.getElementById("div-diary-content").style.color = "#ddd";
          } else {
            this.diaries[i].bg = ""
          }
        }
        console.log(this.diaries.reverse())
        this.showPre = this.page > 1;
        this.showNext = true;
      }).finally(()=>{
        this.loading = false;
      });
    },
    prePage(){
      //发送ajax请求
      this.loading = true;
      this.page--;
      axios.get("/diary/fetch?page="+this.page+"&size="+this.size).then((res)=>{
        console.log(res.data);
        this.diaries = res.data.reverse();
        console.log(this.diaries.reverse())
        if (this.page === 0){
          this.showPre = false;
        }else
          this.showPre = true;

        this.showNext = true;
      }).finally(()=>{
        this.loading = false;
      });
    },

    gotoAdmin(){
      console.log("checking...")

      axios.post("/admin").then((res)=>{
        if (res.data.code === 200101){
          // window.location.href = "./admin.html";
          router.push({path: '/admin'});
        }else{
          router.push({path: '/login'});
        }
      }).finally(()=>{
      });
    },

    detail(diary) {
      if (!this.isUnlocked && diary.lock){
        this.lockDialog = true; 
        return
      } 
      router.push({path: '/post/'+diary.id});
    },

    verifyLock(){
      console.log("checking lock...")
      axios.post("/diary/unlock", {
        'username': 'unlock',
        'password': this.diaryKey
      }).then((res)=>{
        if (res.data.code === 200101){
          this.lockDialog = false;
          this.diaryKey = ''

          this.page--
          this.nextPage()

          this.openMessage = true;
          this.message = "解锁成功"
          this.isUnlocked = true

        }else{
          this.openMessage = true;
          this.message = "解锁失败"
        }
      }).finally(()=>{
      });
      this.diaryKey = ''
    }



  }
}
</script>

<style scoped>
body{
  font-family: "Noto Serif SC",serif;
}
.key-container{
  /*margin: 0 auto;*/
  /*width: 200px;*/
  /*height: 30px;*/
  /*line-height: 20px;*/
  text-align: center;



  /*display: inline-block;*/

}

.input-form {
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
}

.input {
  border: solid 1.9px #9e9e9e;
  border-radius: 1.3rem;
  background: none;
  padding: 1rem;
  font-size: 1rem;
  color: #000000;
  transition: border 150ms cubic-bezier(0.4,0,0.2,1);
}

.textUser {
  position: absolute;
  left: 15px;
  color: #666666;
  pointer-events: none;
  transform: translateY(1rem);
  transition: 150ms cubic-bezier(0.4,0,0.2,1);
}

.input:focus, input:valid {
  outline: none;
  box-shadow: 1px 2px 5px rgba(133, 133, 133, 0.523);
  background-image: linear-gradient(to top, rgba(182, 182, 182, 0.199), rgba(252, 252, 252, 0));
  transition: background 4s ease-in-out;
}

.input:focus ~ label, input:valid ~ label {
  transform: translateY(-95%) scale(0.9);
  padding: 0 .2em;
  color: #000000be;
  left: 80px;
}

.input:hover {
  border: solid 1.9px #000002;
  transform: scale(1.03);
  box-shadow: 1px 1px 5px rgba(133, 133, 133, 0.523);
  transition: border-color 1s ease-in-out;
}

.lock-card{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
a{
  color: black;
  font-weight: bold;
  font-size: 36px;
  transition: 0.3s;
  text-decoration: none;
}
a:hover{
  color: #006CFF
}
.site-header{
  text-align: center;
  padding-top: 50px;
  padding-bottom: 64px;
}
.site-content{
  text-align: center;
  padding-left: 12%;
  padding-right: 12%;
}
.diary{
  padding-top: 35px;
  margin-bottom: 35px;
  margin-bottom: 32px;border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,.1); padding: 32px;
  
}


#div-diary-time{
  padding-bottom: 12px;
}
#diary-title{
  font-size: 32px;
}
#diary-time{
  color: rgb(181, 181, 181);
  font-size: 12px;
}
#diary-content{
  line-height: 1.62;
  margin-bottom: 1.12em;
  letter-spacing: 0.05em;
  padding-bottom: 32px;
}
.site-main{
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  min-height: 100vh;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  padding: 0 24px;
  margin: 0 auto;
}
.site-foot{
  padding-top: 28px;
  text-align: center;
  margin-bottom: 32px;
}

#pre-page{
  font-size: 16px;
}
#next-page{
  font-size: 16px;
}

.pointer{
  cursor: pointer;
}

@media screen and (min-width: 1200px) {
  .site-content{
    text-align: center;
    padding-left: 20%;
    padding-right: 20%;
  }
  .diary {
    padding: 36px;
    margin-bottom: 32px;
    
  }
}

@media screen and (max-width: 600px) {
  .site-content{
    text-align: center;
    padding-left: 12%;
    padding-right: 12%;
  }
  .diary{
    padding-left: 0;
    padding-right: 0;
  }
  #div-diary-title{
    padding-left: 0;
    padding-right: 0;
  }
  #div-diary-time{
    padding-left: 0;
    padding-right: 0;
  }
  #div-diary-content{
    padding-left: 0;
    padding-right: 0;
  }
  .site-main{
    padding: 0 0;
  }
  .site-header{
    padding-top: 20px;
    padding-bottom: 32px;
  }
  .site-foot{
    padding-top: 16px;
  }
  #site-title{
    font-size: 24px;
  }
  #diary-title{
    font-size: 24px;
  }
  #diary-time{
    font-size: 10px;
  }
  #diary-content{
    font-size: 14px;
  }
  #pre-page{
    font-size: 12px;
  }
  #next-page{
    font-size: 12px;
  }
}


</style>