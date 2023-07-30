<template>
    <div>
        <div>

            <div class="navbar">
                <a>🥰Soulter's Diary</a>
                <div style="display: flex; gap: 24px;">
                    <a href="/" style="text-decoration: none;">首页</a>
                    <a href="https://blog.soulter.top" style="text-decoration: none;">博客</a>
                    <a href="/login" style="text-decoration: none;">登录</a>
                </div>

            </div>
            <!-- banner和title和时间(时间小一点 灰色) 采用relative布局-->
            <div class="banner">
                <div style="height: 550px; text-align: center;">
                    <div style="height: 50%; "></div>
                    <h1 style="margin: 0px; letter-spacing:3px ; color: #ddd; font-size: 36px; margin-bottom: 8px;" >{{ diary.title }}</h1>
                    <a style="margin: 8px; letter-spacing:3px ; color: rgb(181, 181, 181);">{{ diary.time }}</a>
                </div>
            </div>


            <div class="content-wrap">
                <!-- 内容 -->
                <div class="markdown"  v-html="markedHTML">
                </div>
            </div>
        </div>

    </div>
  </template>
  
  <script>
  
//   import axios from 'axios'
//   import router from "@/router";
import axios from 'axios'
import { marked } from 'marked'
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Post.vue",
    data() {
      return {
        // diary: {},
        diary:{"title": "你好呀",
            "time": "2023/6/22 22:33",
            "bg": "https://soulter.top/images/day.jpg",
            "content": `
# 你好
> 示例内容，示例内容。示例内容，示例内容。示例内容，示例内容。很长的示例
\`\`\`js
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
console.log('hello world')
\`\`\`
![](https://soulter.top/images/dn1.jpg)
- nihao
- 12dsjkn
- dsnj 
你好
`},
        markedHTML: ''
      }
    },
    watch:{
        contentListener() {
            this.markedHTML = marked(this.diary.content)
        }
    },
    mounted() {
        if (this.diary.bg != null && this.diary.bg != ""){
            document.querySelector('.banner').style.background = "url('"+this.diary.bg+"')"
        }
        else {
            document.querySelector('.banner').style.background = "url('https://soulter.top/images/dn1.jpg')"
        }

        axios.get('/diary/detail?id='+this.$route.params.id).then((res) => {
            this.diary = res.data.msg
            console.log(this.diary)

            if (this.diary != null){
                
                if (this.diary.bg != null && this.diary.bg != ""){
                    document.querySelector('.banner').style.background = "url('"+this.diary.bg+"')"
                }
                else {
                    document.querySelector('.banner').style.background = "url('https://soulter.top/images/dn1.jpg')"
                }
            }
            else {
                this.diary.content = "加载失败辣orz！"
            }
            
            this.markedHTML = marked(this.diary.content)
        }).catch((err) => {
            console.log(err)
            this.diary.content = "加载失败辣orz！"
            document.querySelector('.banner').style.backgroundImage = "url('https://soulter.top/images/dn1.jpg')"
            this.markedHTML = marked(this.diary.content)
        })


        
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
        // this.markedHTML = marked(this.diary.content)
        //   随着滑动，banner的模糊度逐渐变大
        //   window.addEventListener('scroll', function () {
        //     var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //     var banner = document.querySelector('.banner');
        //     banner.style.filter = 'blur(' + scrollTop / 100 + 'px)';
        //   })
    },
    methods: {
    }
  }

  </script>
  
  <style>

    .navbar {
        display: flex;
        position: fixed;
        top:0;
        right:0;
        left:0;
        z-index:0;
        backdrop-filter: blur(10px);
        justify-content:space-between;
        
        background-color: transparent;
        box-sizing: border-box;
        font-size: 24px;
        font-weight: 1000;
        padding-left: 64px;
        padding-right: 64px;
        padding-top: 10px;
        padding-bottom: 10px;
        -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
    }

    .banner {
        background-color: #f5f5f5;
        background-size: cover
        /* background: url('https://soulter.top/images/dn1.jpg'); */
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

    body{
        font-family: "Noto Serif SC",serif;
    }




    @media screen and (min-width: 768px) {

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
    
        body{
        font-family: "Noto Serif SC",serif;
        }

        .navbar {
            display: flex;
            position: fixed;
            top:0;
            right:0;
            left:0;
            z-index:0;
            backdrop-filter: blur(10px);

            justify-content:space-between;
            
            background-color: transparent;
            box-sizing: border-box;
            font-size: 24px;
            font-weight: 1000;
            padding-left: 32px;
            padding-right: 32px;
            padding-top: 10px;
            padding-bottom: 10px;
            -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
        }
    }

    @media screen and (max-width: 768px) {

        .content-wrap {
            /*card*/
            margin-left: 24px;
            margin-right: 24px;
            margin-bottom: 42px;
            margin-top: 64px;
            box-shadow: 0 0 10px rgba(0,0,0,.1);
        }

        .markdown {
            padding: 28px;
            padding-top: 12px;
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
        font-size: 15px;
        }

        .markdown blockquote {
        border-left: 6px solid #ddd;
        color: #999;
        line-height: 1.7;
        letter-spacing: 4px;
        font-size: 15px;
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
        font-size: 13px;
        background-color: transparent;
        }

        body{
        font-family: "Noto Serif SC",serif;
        }

        .navbar {
            display: flex;
            position: fixed;
            top:0;
            right:0;
            left:0;
            z-index:0;
            backdrop-filter: blur(10px);

            justify-content:space-between;
            
            background-color: transparent;
            box-sizing: border-box;
            font-size: 16px;
            font-weight: 1000;
            padding-left: 32px;
            padding-right: 32px;
            padding-top: 10px;
            padding-bottom: 10px;
            -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
        }
        }

  
  </style>