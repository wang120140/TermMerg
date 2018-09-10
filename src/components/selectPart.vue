<template>
  <div>
    <!--part和倒计时-->
    <div class="title">Part -  {{curtitlenum+1}}&nbsp;{{currenttitle}}</div>
    <div class="formattime">{{formattedTime}}</div>

    <!--跑马灯-->
    <el-carousel trigger="click" :autoplay="false" height="8rem" ref="carousel" arrow="never" indicator-position="none">
      <el-carousel-item style='height:100%;' v-for="(item,index) in allList" name ='index' :key="index">

        <div class="middle">
          <!-- 上面的问题 -->
          <div class="question">{{item.question}}</div>

          <!--中间的内容-->
          <div class="contents">
            <!--左边的图片-->
            <div class="textcontent">
              <img :src="item.picture" width="100%" height="100%"
                   style="object-fit: contain;object-position: center center;"/>
            </div>

            <!--右边的问题和选项-->
            <div class="rightbox">
              <ul class="answerStyle">
                <li class="answer" :class="{cur:index==num}" v-for="(item2,index) in item.choiceArr" :key='index' @click="addbgcolor(index);getValue(index+1)">
                  <div class="answerIcon" :style="getAnswerIcon(index)"></div>
                  <div class="answerTEXT">{{item2.value}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div class="bottombox">
      <!--进度条-->
      <div class="progressContainer">
        <div class="progress" :style="{width:progress+'%'}"></div>
      </div>

      <!--答题比例-->
      <div class="numbi">{{tihao}}/{{allList.length}}</div>

      <!--下一题按钮-->
      <div class="nextbtn" @click="nextQuestion(tihao);setActiveItem(tihao)">
        <img class="NextButton" src="static/img/nextbtn_0.png" width="100%" height="100%"/>
      </div>
    </div>
    <no-dialog
      v-if="NoDialogShow"
      :imgbg='imgbgNo'
      :NoTopStyle='TopStyleNo'
      :NoLeftStyle='LeftStyleNo'
      @closeNoDialog='NoDialogClose'
    >
    真棒！已经完成了part1的测试，再接再厉
    </no-dialog>

  </div>
</template>

<script>
import dateFormat from "dateformat";
//iron90添加
import NoDialog from "../components/summaryComponet/NoDialog.vue";
import Url from "../components/distjs/Url.js";

export default {
  name: "selectPart",
  components: {
    NoDialog
  },
  data() {
    return {
      // 默认part的title
      currenttitle: "listen and choice",
      // 选项图片高亮
      num: -1,
      // 默认第几part
      curtitlenum: 1,
      // 倒计时时间
      passedTime: 1800,
      // 进度条
      progress: 0,
      // 默认第一题
      tihao: 0,
      // 所有数据
      allList: [],
      // 分数
      score: 0,
      // 进度条
      pro: true,
      // 当前题号答案的索引值
      answer: null,
      //当前题号
      nowIndex: 0,
      //是否选择答案
      isChoose: false,
      //iron90添加
      NoDialogShow: false,
      imgbgNo: Url.Url3 + "dialogNobg.jpg", //这个地址相对于对话框的相对位置来查找建议使用@
      TopStyleNo: "-10px",
      LeftStyleNo: "-10px"
    };
  },
  created() {
    // 换题
    var self = this;
    this.axios.get("static/data.json").then(response => {
      // 获取所有数据
      self.allList = response.data.selectPart;
    });
  },
  mounted() {
    // 开始计时
    this.startClock();
  },
  computed: {
    // 倒计时
    formattedTime() {
      if (this.passedTime === 0) return "00:00";
      return dateFormat(this.passedTime * 1000, "MM:ss");
    }
  },
  methods: {
    // 跑马灯动画
    //iron 90 修改
    setActiveItem(tihao) {
      if (tihao < this.allList.length) {
        this.$refs.carousel.setActiveItem(tihao);
      } else {
        this.NoDialogShow = true; //iron90添加
        // this.$router.push({
        //   path: "/"
        // });
      }
    },
    // 获取当前答案的索引值
    getValue(index) {
      this.answer = index;
    },
    addbgcolor(index) {
      this.num = index;

      if (this.pro == true) {
        // 按照题目数量等比例滑动
        var bi = Math.round(100 / this.allList.length);
        this.progress += bi;
        this.pro = false;
        this.isChoose = true;
        this.tihao += 1;
      }
    },
    // 答案选项前面的图片
    getAnswerIcon(index) {
      switch (index) {
        case 0:
          return {
            background: 'url("static/img/a.png") no-repeat',
            backgroundSize: "contain"
          };
          break;
        case 1:
          return {
            background: 'url("static/img/b.png") no-repeat',
            backgroundSize: "contain"
          };
          break;
        case 2:
          return {
            background: 'url("static/img/c.png") no-repeat',
            backgroundSize: "contain"
          };
          break;
        default:
          return {};
          break;
      }
    },
    nextQuestion() {
      // 如果没选答案将不能回答下一题
      if (this.isChoose == true) {
        this.nowIndex++;
        this.isChoose = false;
        clearInterval(this.soundtime);
      } else {
        alert("请先选择答案");
        return;
      }

      // 进度条还原 到下一题可以触发点击事件
      this.pro = true;
      this.num = -1;

      // 获取当前答案的索引值
      var v = this.answer;
      // 把当前答案的索引值换为字母
      var alphabet = String.fromCharCode(64 + parseInt(v));

      // 获取当前答案
      var rightanswer = this.allList[this.tihao - 1].rightAnswer;
      var ascore = this.allList[this.tihao - 1].score;
      console.log(rightanswer);

      if (alphabet == rightanswer) {
        this.score += ascore;
        console.log("回答正确");
      } else {
        console.log("回答错误");
      }

      if (this.tihao == this.allList.length) {
        alert("分数是" + this.score);
      }
    },
    // 开始计时
    startClock() {
      const self = this;
      self.clock = setInterval(() => {
        self.passedTime--;
        if (self.passedTime <= 0) {
          self.passedTime = 0;
        }
      }, 1000);
    },
    // 结束计时
    stopClock() {
      const self = this;
      clearInterval(self.clock);
    },
    resetClock() {
      this.passedTime = 0;
      this.stopClock();
      this.startClock();
    },
    //iron90添加
    NoDialogClose() {
      //子组件事件
      this.NoDialogShow = false;
      this.$store.commit({
        type: "suo",
        index: 2
      });
      this.$store.commit("gotoSkip");
    }
  }
};
</script>
<style scoped>
/***iron90修改****/
.current {
  position: relative;
}
.el-carousel-item {
  overflow: visible;
}
/***修改完毕**/
.bottombox {
  display: flex;
  flex-direction: row;
  justify-content: normal;
  position: relative;
}

.middle {
  position: relative;
  top: 1.3rem;
}

.answerTEXT {
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-wrap: wrap;
  top: 0;
  max-width: 5rem;
  font-size: 0.38rem;
  margin-left: 0.5rem;
  word-break: break-all;
  text-align: left;
  line-height: 0.45rem;
  z-index: 20;
}

.answerIcon {
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  width: 0.94rem;
  max-width: 0.94rem;
  height: 0.94rem;
  left: 0.4rem;
}

.answerStyle {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-grow: 0;
  flex-shrink: 0;
  width: 6.84rem;
}

.answer.cur {
  background-color: #eeeeee;
}

.answer {
  cursor: pointer;
  position: relative;
  display: flex;
  flex-glow: 1;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 6.8rem;
  height: 1.2rem;
  margin-bottom: 0.2rem;
  transform-origin: center center;
  font-size: 0.6rem;
  color: #5f2c20;
  border-radius: 0.4rem;
  background-color: white;
}

.question {
  position: relative;
  text-align: left;
  word-break: break-all;
  font-size: 0.56rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.rightbox {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  width: 6.84rem;
  margin-left: 0.5rem;
}

.textcontent {
  position: relative;
  width: 7.02rem;
  height: auto;
}

.contents {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-glow: 1;
  font-size: 0.56rem;
  justify-content: center;
  font-family: MyComicSansMS;
  top: 0.35rem;
}

.picture.cur {
  border: 5px solid red;
  z-index: 100000000000;
}

.numbi {
  float: right;
  margin-right: 3.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 0.3rem;
  color: #666666;
}

.nextbtn {
  cursor: pointer;
  position: absolute;
  width: 2rem;
  height: auto;
  background-size: contain;
  right: 1.5rem;
  font-size: 0.45rem;
}

div.progress {
  float: left;
  width: 50%;
  background-color: #1c8de0;
  border-radius: 2rem;
  height: 0.6rem;
  line-height: 20px;
  overflow: hidden;
  position: relative;
}

div.progressContainer {
  height: 0.6rem;
  width: 65%;
  border-radius: 2rem;
  background-color: #ddd;
  margin-left: 10%;
  margin-top: 0.2rem;
  overflow: hidden;
  flex-direction: row;
  justify-content: center;
}

.formattime {
  position: absolute;
  width: auto;
  height: 0.5rem;
  right: 2.72rem;
  top: 0.28rem;
  font-size: 0.36rem;
  text-align: center;
  line-height: 0.5rem;
  color: black;
}

.title {
  position: absolute;
  width: auto;
  text-align: center;
  color: #666666;
  background-color: white;
  top: 0.2rem;
  margin: 0 auto;
  left: 0;
  right: 0;
  font-size: 0.45rem;
  width: 12.2rem;
  left: -2.22rem;
  line-height: 0.6rem;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
