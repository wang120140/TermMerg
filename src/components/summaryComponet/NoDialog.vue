<template>
    <transition
        enter-active-class="animated flipInX"
        leave-active-class="animated flipOutX"
        :duration="3200"
        name='modle' >
        <!--这是个遮罩层-->
        <div class='modal-mask' :style='{top:NoTopStyle,left:NoLeftStyle}'>
            <!-- 内容部分开始 -->
                <div class='modal-wrapper'>
                        <!-- 头部关闭信息 -->
                    <div  @click='closeDialog'  class='closeImg'></div>
                        <!-- 主题部分盒子 -->
                    <div class='modal-container' >
                        <!-- 头部内容信息 -->
                        <div class='modal-header'>
                            <img :src="imgbg" alt="">
                            <!-- <img src="../../../static/imgs/summary/dialogNobg.jpg" alt=""> -->
                            <slot name ='NoHeader'></slot>
                        </div>
                        <!-- 主题内容部分        -->
                        <div class='modal-body'>
                            <!-- 插入主题内容 -->
                            <slot></slot>
                        </div>
                        <!-- 尾部按钮部分 -->

                    </div>
                </div>
            <!--内容部分结束-->
        </div>
    </transition>
</template>
<script>
import animate from "animate.css";
export default {
  name: "",
  data() {
    return {
      bgcolorHover: true,
      buttonshow: true,
      bgcolor: {
        backgroundColor: "#1BACE6"
      }
      //   topStyle:'-10px',
      //   leftStyle:'-10px',
    };
  },
  props: {
    button0: {
      type: Array
    },
    imgbg: {
      type: String
    },
    NoTopStyle: {
      type: String
    },
    NoLeftStyle: {
      type: String
    }
  },
  methods: {
    quithover() {
      this.bgcolorHover = false;
    },
    closeDialog() {
      this.$emit("closeNoDialog", false);
    },
    buttonEvent(index) {
      let leng = this.button0.length;
      if (leng == 0) {
        this.buttonshow = false;
      } else if (leng == 1) {
        this.$emit("ButtonCenter");
      } else if (leng == 2) {
        index ? this.$emit("ButtonRight") : this.$emit("ButtonLeft");
      } else {
        return;
      }
    }
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  background: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  z-index: 2018;
  /* top:-10px; 这里每个位置都要调整具体位置具体调整 */
}
.modal-wrapper {
  border: 2px solid black;
  text-align: center;
  background-color: white;
  border-radius: 20px;
  width: 50%;
  height: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url(../../../static/img/summary/dialog.png) no-repeat scroll 100%
    100%;
  background-size: cover;
}
.closeImg {
  width: 0.875rem;
  height: 0.875rem;
  float: right;
  margin-right: 0.3125rem;
  margin-top: 0.3125rem;
  cursor: pointer;
  background-image: url(../../../static/img/summary/close.png);
  background-size: cover;
  background-repeat: no-repeat;
}

.modal-container {
  width: 100%;
  height: 100%;
  padding: 0.625rem;
  margin: 0 auto;
  border-radius: 0.225rem;
  font-size: 0.125rem;
  border: 2px solid blue;
}
.modal-header {
  margin-top: 0.3125rem;
  margin-left: 0.3125rem;
  text-align: center;
  font-size: 0.625rem;
  font-weight: 400;
  color: #42b983;
  border: 1px solid blue;
}
.modal-header img {
  width: 100%;
  height: 70%;
}
.modal-body {
  margin-top: 5%;
  font-size: 0.5rem;
}
.modal-footer {
  margin-top: 0.625rem;
}
.modal-footer span {
  cursor: pointer;
  width: 0.825rem;
  height: 0.825rem;
  margin: 0.3125rem;
  font-size: 0.3125rem;
  padding: 0.125rem 0.4125rem;
  border: 1px solid black;
}
.modal-footer span:hover {
  background-color: #1bace6;
  color: #f3fbfe;
}
</style>
