
<template>
        <div class="startpage">
            <!--倒计时  -->
            <div class="formattime">{{formattedTime}}</div>
            <div class='external' v-for='(val,index) in lock' :key="index">
                <div @click='StartRouter(index)'  v-if="val.lock5">
                    <div>{{index+1}}</div>
                </div>
                <div class='mask' v-if='!val.lock5'>{{index+1}}</div>
            </div>
        </div>
</template>
<script>
import dateFormat from "dateformat";
import { mapState } from "vuex"; //添加了这部分
export default {
  name: "Startpage",
  data() {
    return {
      isShow: false,
      passedTime: 1800
    };
  },
  computed: {
    formattedTime() {
      if (this.passedTime === 0) return "00:00";
      return dateFormat(this.passedTime * 1000, "MM:ss");
    },
    //从这里内容
    // ...mapState(["lock"]) //有疑问
    lock: {
      get: function() {
        return this.$store.state.lock;
      },
      set: function() {}
    }
  },
  methods: {
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
      this.stopClock();
      this.startClock();
    },
    //从这里添加内容
    StartRouter(index) {
      console.log(index + "这是跳转页面产生的...");
      // this.$router.push({
      //   path: "/main",
      //   query: { id: index }
      // });
      this.$emit("componentIndex", { index });
    }
  },
  mounted() {
    this.startClock();
    console.log(this.lock);
  }
};
</script>
<style scoped >
.startpage {
  display: flex;
}
.external {
  position: relative;
  width: 3.5rem;
  height: 3.5rem;
  background: #333;
  margin-right: 0.5rem;
}
.page {
  width: 3.5rem;
  height: 3.5rem;
  background: #333;
}
.mask {
  width: 2.5rem;
  height: 2.5rem;
  background: rgb(233, 233, 94);
  position: absolute;
  top: 0;
  left: 0;
}
.formattime {
  position: absolute;
  top: 0.9rem;
  right: 1rem;
  font-size: 0.6rem;
}
</style>


