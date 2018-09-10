<template>
  <div>
    <!--part和倒计时-->
    <div class="title">Part -  {{curtitlenum+1}}&nbsp;{{currenttitle}}</div>
    <div class="formattime">{{formattedTime}}</div>

    <!--跑马灯-->
    <el-carousel trigger="click" :autoplay="false" height="9rem" ref="carousel" arrow="never" indicator-position="none">
      <el-carousel-item v-for="(item,index) in allList" name ='index' :key="index">
        <!--小喇叭和问题-->
        <div class="content">
          <div class="sound">
            <img :src="item.sound" v-for="(item,index) in soundsList" :key='index' @click="changesound(index)" id="img" style="width: 100%;height: 100%;">
            <audio :src="allList[nowIndex].mp3" id="audio" @timeupdate="shu(index)" preload="auto"></audio>
          </div>

          <div class="question">{{item.question}}</div>
        </div>

        <!--选项图片-->
        <ul class="answerbox">
          <li class="picture" :class="{cur:index == num}" v-for="(item2,index) in item.picturesList" :key='index' @click="addbgcolor(index);getValue(index+1)">
            <div class="answerimg">
              <img :src="item2.picture" width="100%" height="100%">
            </div>
            <img v-show="true" :src="getAnswerSrc(0)" width="100%" height="100%">
          </li>
        </ul>
      </el-carousel-item>
    </el-carousel>

    <div class="bottombox">
      <!--进度条-->
      <div class="progressContainer">
        <div class="progress" :style="{left:progress+'%'}"></div>
      </div>

      <!--答题比例-->
      <div class="numbi"></div>

      <!--下一题按钮-->
      <div class="nextbtn " @click="nextQuestion(tihao); setActiveItem(tihao);">
        <img class="NextButton" src="static/img/nextbtn_0.png" width="100%" height="100%">
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
import NoDialog from "../components/summaryComponet/NoDialog.vue";
import Url from "../components/distjs/Url.js";
export default {
  name: "ListenPart",
  components: {
    NoDialog
  },
  data() {
    return {
      // 默认part的title
      currenttitle: "listen and choice",
      // 听力变化图
      soundsList: [
        {
          sound: "static/img/ico-sound-l-0.png"
        },
        {
          sound: "static/img/ico-sound-l-1.png"
        },
        {
          sound: "static/img/ico-sound-l-2.png"
        }
      ],
      // 选项图片高亮
      num: -1,
      // 默认第几part
      curtitlenum: 0,
      // 倒计时时间
      passedTime: 1800,
      // 进度条
      progress: 0,
      // 小喇叭默认不播放
      status: false,
      // 分数
      score: 0,
      // 默认第一题
      tihao: 0,
      // 所有数据
      allList: [],
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
      LeftStyleNo: "-10px",
      Score: []
    };
  },
  created() {
    // 换题
    var self = this;
    this.axios.get("static/data.json").then(response => {
      // 获取所有数据
      self.allList = response.data.listenPart;
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
    setActiveItem(tihao) {
      if (tihao < this.allList.length) {
        this.$refs.carousel.setActiveItem(tihao);
      } else {
        this.NoDialogShow = true; //iron90添加
      }
    },
    // 获取当前答案的索引值
    getValue(index) {
      this.answer = index;
    },
    getAnswerSrc(index) {
      if (index == 0) {
        return "static/img/btn_img_0.png";
      }
      if (index == 1) {
        return "static/img/btn_img_1.png";
      }
      if (index == 2) {
        return "static/img/btn_img_2.png";
      }
    },
    // 选项图片高亮
    addbgcolor(index) {
      this.num = index;

      if (this.pro == true) {
        // 按照题目数量等比例滑动
        var bi = Math.floor(100 / this.allList.length);
        this.progress += bi;
        this.pro = false;
        this.isChoose = true;
        this.tihao += 1;
      }
    },
    // 点击小喇叭 切换图 并且播放
    changesound(index) {
      var self = this;
      let soundnum = 0;
      var audio = document.getElementsByTagName("audio");

      // 小喇叭初始状态未播放 点击播放
      if (self.status == false) {
        audio[index].play();
        self.status = true;
        // 换图
        this.soundtime = setInterval(function() {
          self.soundsList[0].sound =
            "static/img/ico-sound-l-" + soundnum + ".png";
          soundnum += 1;
          if (soundnum > 2) {
            soundnum = 0;
          }
        }, 400);
      } else {
        // 小喇叭已经在播放 点击暂停
        audio[index].pause();
        self.status = false;
        self.soundnum = 0;
        clearInterval(this.soundtime);
      }
    },
    // 播放完暂停 图片还原
    shu(index) {
      var self = this;
      var CurrentTime = audio[index].currentTime;
      var Duration = audio[index].duration;
      if (CurrentTime >= Duration) {
        self.soundnum = 0;
        self.status = false;
        clearInterval(self.soundtime);
      }
    },
    nextQuestion() {
      // 如果没选答案将不能回答下一题
      if (this.isChoose == true) {
        this.nowIndex++;
        this.isChoose = false;
        this.status = false;
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
        console.log("回答正确"); ///////iron90修改这部分
        this.Score.push(ascore);
      } else {
        console.log("回答错误");
        this.Score.push(0); ////////iron90修改这部分
      }

      if (this.tihao == this.allList.length) {
        alert("分数是" + this.score);
        this.nowIndex = 0;
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
        index: 1
      });
      this.$store.commit("gotoSkip");
    }
  },
  destroyed() {}
};
</script>
<style scoped>
.title,
.formattime {
  z-index: 99;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  line-height: 150px;
  margin: 0;
}
/***iron90修改***/
.current {
  position: relative;
}
.picture.cur {
  border: 5px solid red;
  z-index: 1000;
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
  width: 0.6rem;
  transform: translateX(-100%);
  position: absolute;
  background-color: #1c8de0;
  border-radius: 2rem;
  height: 0.6rem;
  line-height: 0.6rem;
  overflow: hidden;
}

div.progressContainer {
  position: relative;
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

.bottombox {
  display: flex;
  flex-direction: row;
  justify-content: normal;
  position: relative;
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

.question {
  /**iron90修改这部分**/
  /* position: relative; */
  margin-left: 0.625rem;
  /*****iron90修改这部分********/
  text-align: left;
  word-break: break-all;
}

.sound img:nth-child(1) {
  z-index: 222;
}

.sound img {
  position: absolute;
  top: 0;
  left: 0;
}

.sound {
  position: relative;
  width: 1.8rem;
  height: 1.8rem;
  overflow: hidden;
  cursor: pointer;
  background-size: cover;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
}

.content {
  position: relative;
  height: 1.8rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 1.1rem;
  color: #5f2c20;
  font-size: 0.48rem;
  max-width: 12rem;
  /**iron90修改这部分**/
  margin: 0 auto;
  left: 0;
  right: 0;
  margin-top: 1.3rem;
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

.answerimg {
  position: absolute;
  width: 3.5rem;
  height: 3.5rem;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.picture {
  cursor: pointer;
  position: relative;
  display: flex;
  width: 4.4rem;
  height: 4.4rem;
  flex-glow: 1;
  font-size: 0.35rem;
  color: blue;
  margin-bottom: 0.2rem;
  margin: 0 0.3rem;
  transform-origin: center center;
  border-radius: 0.4rem;
}

.answerbox {
  /* iron90修改了这部分 */
  /* position: relative; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
  width: 16rem;
  margin: 0 auto;
  top: 0.7rem;
}
</style>
