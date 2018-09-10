<template>
    <div class="sceneread">

        <div class="top">
          <!-- 返回 -->
          <div class="back" @click="$router.back()">goback</div>
          <div class="title">
            {{baseTitle}}
            <!-- 倒计时 -->
            <span class="formattime">{{formattedTime}}</span>
          </div>
        </div>

        <div class="reading">
          <!-- tab切换 -->
            <header>
                <ul>
                    <li class="tabnav" v-for="(item,index) in tabNav" :class="{cur : item.click}" @click="tabClick(index)" :key="index">{{item.title}}</li>
                </ul>
            </header>

            <!-- 材料 -->
            <div class="content" v-show="tabIndex == 0">
                <p class="baseContent">{{baseContent}}</p>
            </div>

            <!-- 答题 v-show="tabIndex == 1" -->
            <div class="content" id="content">
              <transition>
                <div ref="viewWrap" class="baseContent" @scroll="scrolleventHander">
                  <div v-for="(itemQuestion, idx) in responseData.listenpartReading.levels" :data-idx="idx" :key="itemQuestion.question">
                    <p class="current_title">{{itemQuestion.question}}</p>
                    <li :key="index.item" v-for="(item,index) in itemQuestion.options" class="change" :class="{changes:rightCol[idx].changeCol == index}" @click="changeIdx(index,idx)">
                      <p class="current_choics"  >{{item.choice}}</p>
                    </li>
                  </div>
                </div>
              </transition>

                <!-- 提交 -->
                <button type="submit" @click="submit">submit</button>
            </div>
        </div>

       <!-- iron90添加 -->
        <one-dialog
                v-if="OneDialogShow"
                :OneTopStyle='TopStyleOne'
                :OneLeftStyle='LeftStyleOne'
                :CenterButtonMsg='CenterButtonMsgOne'
                @OneButtonCenter='OneButtonCenterEvent'
                @closeOneDialog='OneDialogClose'
            >
                <!-- 这里填写头部信息 -->
                <div slot="OneHeader">你真棒</div>
                <!-- 这里填写主题信息 -->
                恭喜你，已经完成了测试的所有的题目快去查看你的测试报告吧!
        </one-dialog>


    </div>
</template>


<script>
import dateFormat from "dateFormat";
import OneDialog from "../components/summaryComponet/OneDialog.vue";
import Url from "../components/distjs/Url.js";
export default {
  name: "SceneReadingPart",
  components: {
    OneDialog
  },
  data() {
    return {
      //tab切换选项
      tabNav: [
        {
          title: "材料",
          click: true
        },
        {
          title: "答题",
          click: false
        }
      ],
      //默认显示0
      tabIndex: 0,
      baseTitle: "",
      baseContent: "",
      //倒计时
      passedTime: 1800,
      //滚动高度
      viewHeight: 0,
      responseData: {
        listenpartReading: {
          levels: []
        }
      },
      //页面总高度
      sumHeight: 0,
      // 上一个历史位置
      prevPos: 0,
      //当前滚动条的位置
      currentPos: 0,
      //当前页面的序号
      currentPage: 0,
      //选择题目时高亮
      changeCol: -1,
      //当前答过的题
      arr: [],
      //当前答过题的颜色
      rightCol: [],
      //数据里的正确答案
      dataAnswer: [],
      //用户答题的答案
      Answer: [],

      OneDialogShow: false,
      TopStyleOne: "-10px",
      LeftStyleOne: "-10px",
      CenterButtonMsgOne: "查看测试报告"
    };
  },
  methods: {
    //切换
    tabClick(index) {
      this.tabNav.forEach(item => {
        item.click = false;
      });
      this.tabNav[index].click = true;
      this.tabIndex = index;

      if (index == 1) {
        setTimeout(() => {
          this.viewHeight = this.viewWrap.getBoundingClientRect().height;
          this.viewScrollHeight = this.viewWrap.scrollHeight;
          console.log(this.viewHeight, this.viewScrollHeight);

          let num = this.viewScrollHeight / this.viewHeight; // 分屏的数目
          this.currentPos = this.viewWrap.scrollTop;
        }, 50);
      } else {
        return;
      }
    },

    //开始计时
    startClock() {
      const self = this;
      self.lock = setInterval(() => {
        self.passedTime--;
        if (self.passedTime <= 0) {
          self.passedTime = 0;
        }
      }, 1000);
    },

    stopClock() {
      const self = this;
      clearInterval(self.clock);
    },

    resetClock() {
      this.passedTime = 0;
      this.startClock();
      this.stopClock();
    },

    //改变选项
    changeIdx(index, id) {
      // console.log(2258);
      var daan = "";
      this.rightCol[id].changeCol = index;
      this.arr[id] = true;

      if (index == 0) {
        daan = "A";
      } else if (index == 1) {
        daan = "B";
      } else if (index == 2) {
        daan = "C";
      } else if (index == 3) {
        daan = "D";
      }
      //获得当前答案
      if (this.dataAnswer[id] == daan) {
        console.log("回答正确");
      } else {
        console.log("回答错误");
      }
      this.Answer[id] = daan;
    },
    //滚动事件
    scrolleventHander(e) {
      this.currentPos = this.viewWrap.scrollTop;

      // if(this.prevPos > this.currentPos) {
      //   this.scrollDerection  = "down"
      // } else if(this.prevPos < this.currentPos) {
      //   this.scrollDerection = "up"
      // } else {
      //   this.scrollDerection = "nomove"
      // }
      if (
        this.scrollDerection === "down" &&
        this.viewWrap.scrollTop >
          this.viewHeight * (this.currentPage + 1) - this.viewHeight / 5
      ) {
        this.currentPage++;
        this.viewWrap.scrollTop = this.viewHeight * this.currentPage;
        return;
      } else {
        return;
      }

      // if(this.scrollDerection === "down" && this.viewWrap.scrollTop > this.viewHeight * (this.currentPage + 1 -this.viewHeight  / 10))

      console.log(
        this.currentPos,
        this.viewHeight,
        this.currentPage,
        this.viewHeight * (this.currentPage + 1) + this.viewHeight / 5,
        this.viewHeight * (this.currentPage + 1) - this.viewHeight / 5
      );

      // if(this.viewWrap.scrollTop > this.viewHeight * (this.currentPage + 1) - this.viewHeight / 5 ) {
      //   // 如果滚动高度大于当前页面位置+滚动视口的10分之一
      //   this.currentPage++;
      //   this.viewWrap.scrollTop = this.viewHeight * this.currentPage
      //   return;
      // } else if(this.viewWrap.scrollTop < this.viewHeight * (this.currentPage + 1) + this.viewHeight / 5){
      //   // 如果滚动高度小于 （前页面位置+滚动视口的10分之一 ）
      //   if(this.currentPage > 0 ){
      //   this.currentPage--;
      //   }
      //   this.viewWrap.scrollTop = this.viewHeight * this.currentPage
      //   return;
      // }else{

      // }
    },

    //提交按钮
    submit() {
      var boo = true;
      for (var i = 0; i < this.arr.length; i++) {
        if (this.arr[i] == false) {
          boo = false;
        } else {
          boo = true;
        }
      }
      //判断题目是否都答完
      if (boo) {
        this.OneDialogShow = !this.OneDialogShow;
        console.log(this.dataAnswer);
        console.log(this.Answer);
      } else {
        alert("你还有题没有答完");
      }
    },

    //一个按钮的对话框的方法开始
    OneDialogClose() {
      this.OneDialogShow = false;
    },
    OneButtonCenterEvent() {
      this.OneDialogShow = false;
      console.log("这里填写你点击鼠标触发的事件");
      this.$store.commit("gotoComponentIndex", 4);
    }
  },
  computed: {
    viewWrap() {
      return this.$refs.viewWrap;
    },
    //获取题目的数量
    pageSumNum() {
      return this.responseData.listenpartReading.levels.length;
    },
    //倒计时
    formattedTime() {
      if (this.passedTime === 0) return "00:00";
      return dateFormat(this.passedTime * 1000, "MM:ss");
    }
  },
  created() {
    //获取所有数据
    this.axios.get("static/data.json").then(response => {
      console.log("responseData  ===> ", response);
      this.responseData = response.data;
      console.log(response.data);
      //获取数据内容
      this.baseContent = response.data.clozePartReading.levels.content;
      //获取数据标题
      this.baseTitle = response.data.clozePartReading.levels.title;

      for (var i = 0; i < response.data.listenpartReading.levels.length; i++) {
        //判断当前题有没有答
        this.arr.push(false);
        //选择题目时高亮
        this.rightCol.push({ changeCol: -1 });
        //获取正确答案
        this.dataAnswer.push(
          response.data.listenpartReading.levels[i].rightAnswer
        );
      }
    });
  },
  mounted() {
    var self = this;
    this.$nextTick(() => {
      //获取滚动的高度
      this.viewHeight = this.viewWrap.getBoundingClientRect().height;
      //获取滚动条距顶边的距离
      this.viewScrollHeight = this.viewWrap.scrollHeight;
      console.log(this.viewHeight, this.viewScrollHeight);
    });
    this.startClock();
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.sceneread {
  width: 100%;
  height: 100%;
  background-color: #d1cfcf;
}
.reading {
  width: 15rem;
  height: 8rem;
  margin: 1.7rem auto;
  overflow: hidden;
}
.title {
  position: absolute;
  width: auto;
  text-align: center;
  color: #666666;
  background-color: white;
  top: 0.3rem;
  margin: 0 auto;
  left: 0;
  right: 0;
  font-size: 0.45rem;
  width: 7rem;
  left: 1.22rem;
  line-height: 0.7rem;
  text-overflow: ellipsis;
  overflow: hidden;
}
.back {
  position: absolute;
  width: auto;
  height: 0.5rem;
  left: 0.72rem;
  top: 0.3rem;
  font-size: 0.36rem;
  text-align: center;
  line-height: 0.5rem;
  color: black;
}
.formattime {
  background-color: #d1cfcf;
}
header {
  width: 13rem;
  height: 1rem;
}
.tabnav {
  font-size: 0.5rem;
  width: 2rem;
  height: 1rem;
  line-height: 1rem;
  float: left;
  text-align: center;
  margin-right: 0.3rem;
  background: #a0a0a0;
}
li.cur {
  background: #fff;
}
.content {
  width: 15rem;
  height: 7rem;
  background: #fff;
  /* margin: 0 auto; */
}
.current_title,
.current_choics {
  padding: 0.3rem;
}
.current_title {
  font-size: 0.6rem;
  text-align: center;
  font-weight: 500;
}
.current_choics {
  width: 6.5rem;
  font-size: 0.3rem;
  border: 1px solid rgb(172, 170, 170);
  margin: 0.3rem auto;
  height: 0.3rem;
  line-height: 0.3rem;
}
button {
  float: right;
  margin-right: 0.8rem;
  margin-bottom: 0.6rem;
  padding: 0.2rem;
}
.change {
  cursor: pointer;
}
.changes {
  color: red;
}
.baseContent {
  height: 5.5rem;
  line-height: 0.85rem;
  overflow-y: scroll;
  font-size: 0.5rem;
  text-indent: 0.7rem;
  padding: 0.3rem;
  transition: all 1s;
}
.baseContent::-webkit-scrollbar {
  width: 0.3rem;
  background: #fff;
}
.baseContent::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.baseContent::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
