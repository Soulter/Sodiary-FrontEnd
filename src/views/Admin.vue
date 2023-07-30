<template>
  <div id="mng-main" class="mng-main">
    <v-card class="header" style="margin-top: 32px; padding-bottom: 28px;  border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,.1);">
      <a v-bind="master" id="welcome-text">
        欢迎回来捏OwO~ {{master}}
      </a>
    </v-card>

    <template id="diary-card">
      
      <v-card style=" padding:32px; margin-top: 26px; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,.1);">
        <div style="display: flex; flex-direction: row; align-items: center;">
          <a style="font-size: 28px; font-weight: bold; margin: 8px;">
            新日记
          </a>
          <v-switch
              v-model="preview"
              label="启用预览"
              color="teal"
              style="margin-left: 8px;"
          ></v-switch>
        </div>

        <div id="diary-field">

          <div style="display: flex; justify-content: space-evenly; align-items: center;">
            <v-text-field
              label="标题"
              solo
              v-model="newDiary.title"
              style=" margin-top: 16px;">
            </v-text-field>

            <v-checkbox v-model="newDiary.isLock" class="mx-2" label="私密"></v-checkbox>

          </div>

          <v-textarea
              color="teal"
              solo
              v-model="previewRawContent"
              rows="10"
          >
            <template v-slot:label>
              <div>
                内容
              </div>
            </template>
          </v-textarea>


        <v-btn class="ma-2" outlined color="green" v-show="editMode" @click="closeEditMode">
          关闭编辑模式
        </v-btn>

        <v-btn color="#F44336" v-show="editMode" @click="deleteDiary">删除</v-btn>

        <v-btn
            :loading="loading"
            :disabled="loading"
            @click="loader = 'loading'">
          {{btnName}}
        </v-btn>


        <v-snackbar
            v-model="openCreatedDiaryTip"
        >
          {{createdDiaryTip}}
        </v-snackbar>
      </div>

      <v-card
          class="mx-auto"
          style="margin: 16px;">

          <v-list three-line>
            <v-subheader>
              之前..
            </v-subheader>
            <template v-for="(diary) in pre_diaries">
              <v-list-item
                  :key="diary.title"
                  @click="diaryOperation(diary)"
              >

                <v-list-item-content>
                  <v-list-item-title v-html="diary.title"></v-list-item-title>
                  <v-list-item-subtitle v-html="diary.time"></v-list-item-subtitle>
                  <v-list-item-subtitle v-html="diary.content"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-card>

      <div class="content-wrap" v-show="preview">
              <!-- 内容 -->
              <div class="markdown"  v-html="markedHTML">
              </div>
      </div>


    </template>

  </div>
</template>

<script>

import axios from "axios";
import { marked } from 'marked'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Admin.vue",
  data() {
    return {

      refresh_diaries: false,
      master: "你目前还没登录~",
      rules: [
        value => !!value || '必填项~.',
        value => (value && value.length >= 3) || '再多写点字~(3)',
      ],
      newDiary: {
        "isLock": false
      },
      in_submit: false,
      createdDiaryTip: "undefined",
      openCreatedDiaryTip: false,
      loading: false,
      loader: null,
      pre_diaries: [{"title": "test", "time": "2020-01-01", "content": "test"}],
      page: 1,
      size: 5,
      btnName: "搞定。",
      editMode: false,
      preview: false,
      previewRawContent: "",
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

    },
    preview() {
      if(!this.preview) return
      this.markedHTML = marked(this.previewRawContent)
    },
    previewRawContent() {
      if(!this.preview) return
      this.markedHTML = marked(this.previewRawContent)
    },
    loader () {
      this.newDiary.content = this.previewRawContent
      if (!this.in_submit){
        this.in_submit = true
        const l = this.loader
        this[l] = !this[l]
        console.log(this.newDiary)
        this.loading = true

        if (this.editMode){

          axios.post('/admin/updateDiary', this.newDiary)
              .then(() => {
                this.createdDiaryTip = "更新成功！"
                this.openCreatedDiaryTip = true
                this.btnName="搞定。"
                this.editMode=false
                this.newDiary= {}
                this.fetchDiaries()

              })
              .catch(() => {
                this.createdDiaryTip = "更新失败！"
                this.openCreatedDiaryTip = true
              }).finally(() => {
          })

        } else {
          //发送ajax请求
          axios.post("/admin/newDiary",this.newDiary).then((res)=>{
            console.log(res.data);
            if (res.data.code === 200401){
              this.openCreatedDiaryTip = true
              this.createdDiaryTip = "日记创建成功。"
              this.fetchDiaries()
            }else{
              this.openCreatedDiaryTip = true
              this.createdDiaryTip = "服务器错误。"
            }
          }).finally(()=>{
            this.in_submit = false
            this.loading = false
            this[l] = false
          });
        }
      }else{
        this.createdDiaryTip= "没有登录，";
        this.openCreatedDiaryTip = true;
      }

    },
  },
  mounted() {
    //发送ajax请求
    this.fetchDiaries()
    axios.post("/admin").then((res)=>{
      console.log(res.data);
      this.master = res.data.msg.username
    }).finally(()=>{
    });
    marked.setOptions({
            renderer: new marked.Renderer(),
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
    })
    this.markedHTML = marked(this.diary.content)
  },
  methods: {
    diaryOperation(diary){
      this.editMode = true;
      this.btnName = "更新。";
      this.newDiary.title = diary.title;
      this.newDiary.content = diary.content;
      this.newDiary.id = diary.id;
    },
    closeEditMode(){
      this.editMode = false;
      this.btnName = "搞定。";
      this.newDiary.title = "";
      this.newDiary.content = "";
    },
    fetchDiaries(){
      axios.get("/diary/fetch?page="+this.page+"&size="+this.size).then((res)=>{
        console.log(res.data);
        this.pre_diaries = res.data;
      }).finally(()=>{
      });
    },
    deleteDiary(){
      axios.post("/admin/deleteDiary",{"id":this.newDiary.id}).then((res)=>{
        console.log(res.data);
        if (res.data.code === 200601){
          this.createdDiaryTip = "日记删除成功。"
          this.openCreatedDiaryTip = true
          this.fetchDiaries()
          this.editMode = false;
          this.newDiary = {};
        }else{
          this.createdDiaryTip = "服务器错误。"
          this.openCreatedDiaryTip = true
        }
      }).finally(()=>{
      });
    },
  }
}
</script>

<style scoped>
    body{
      font-family: "Noto Serif SC",serif;
    }
    .mng-main{
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
    .header{
      padding-top: 32px;
      padding-left: 32px;
    }
    #welcome-text{
      font-size: 28px;
      font-weight: bold;
    }


    .content-wrap {
        /*card*/
        margin-left: 350px;
        margin-right: 350px;
        margin-bottom: 64px;
        margin-top: 80px;
        box-shadow: 0 0 10px rgba(0,0,0,.1);
        border-radius: 16px;
    }

    .markdown {
        padding-top: 64px; 
        padding-left: 250px; 
        padding-right: 250px; 
        padding-bottom: 200px;  
        letter-spacing:3px;
    }
    .markdown h1 {
        font-size: 32px;
        letter-spacing: 3px;
        margin-top: 32px;
        margin-bottom: 24px;
    }

    .markdown p {
        line-height: 1.7;
        letter-spacing: 3px;
        font-size: 18px;
    }

    .markdown blockquote {
        border-left: 6px solid #ddd;
        color: #999;
        line-height: 1.7;
        letter-spacing: 4px;
        font-size: 18px;
        padding-left: 10px;
        margin-left: 0;
        margin-bottom: 24px;
    }

    .markdown pre {
        background-color: #eeeeee;
        padding: 12px;
        padding-left: 18px; 
        border-radius: 9px;
        margin-top: 16px;
        margin-bottom: 16px;
        box-shadow: 0 0 10px rgba(0,0,0,.1);
    }

    .markdown code {
        background-color: transparent;
        font-family: "Ubuntu Mono",Courier,monospace;
        padding: 0;
        word-wrap: break-word;
        overflow: auto;
        margin: 20px 0;
        
    }

    .markdown img {
        width: 100%;
        height: auto;
        margin: 20px 0;
        border-radius: 12px;
        box-shadow: 0 0 10px rgba(0,0,0,.2);
        loading: "lazy";

    }

    /* 精美的列表 */
    .markdown li::marker {
        color: #999;
        font-size: 16px;
    }

    @media screen and (max-width: 1300px) {

    .content-wrap {
      /*card*/
      margin-left: 64px;
      margin-right: 64px;
      margin-bottom: 64px;
      margin-top: 64px;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
    }

    .markdown {
      padding: 100px;
      padding-top: 32px;
    }


    .markdown h1 {
    font-size: 26px;
    letter-spacing: 3px;
    margin-top: 32px;
    margin-bottom: 24px;
    }

    .markdown p {
    line-height: 1.7;
    letter-spacing: 3px;
    font-size: 17px;
    }

    .markdown blockquote {
    border-left: 6px solid #ddd;
    color: #999;
    line-height: 1.7;
    letter-spacing: 4px;
    font-size: 16px;
    padding-left: 10px;
    margin-left: 0;
    margin-bottom: 24px;
    }

    .markdown pre {
    background-color: #eeeeee;
    padding: 12px;
    padding-left: 18px; 
    border-radius: 9px;
    margin-top: 16px;
    margin-bottom: 16px;
    }

    .markdown code {

    font-family: "Ubuntu Mono",Courier,monospace;
    padding: 0;
    word-wrap: break-word;
    overflow: auto;
    margin: 20px 0;
    }

    }
</style>