<template>
  <div id="app">
      <div ref="startBtn"  v-if='startButton' @click="startButtonControl(),startEvent()">start</div>
      <!-- <component v-if='!startButton' :is='Startpage0'> </component> -->
    <router-view/>
  </div>
</template>

<script>
import Startpage from "../components/Startpage.vue"; //开始页面
import { mapState, mapMutations } from "vuex";
export default {
  name: "boot",
  components: {
    Startpage
  },
  data() {
    return {
      showAni: false,
      Startpage0: Startpage, //添加了这部分
      comShow: false //添加了这部分
    };
  },
  computed: {
    ...mapState(["startButton"])
  },
  methods: {
    ...mapMutations(["startButtonControl"]),
    // onStartGame() {
    //   //修改了这部分
    //   //this.$router.push('/Startpage')
    //   // this.$router.push("/main");
    //   this.comShow = true;
    // }
    //iron90 修改这部分
    startEvent() {
      console.log(1);
      this.$router.push({
        path: "/main"
      });
    }
  },

  mounted() {
    //修改了这部分
    //let startbtn = this.$refs.startBtn;
  }
};
</script>

<style>
html,
body {
  overflow: hidden;
  background: black;
}
html,
body,
div {
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: transparent;
  -tap-highlight-color: transparent;
  -webkit-text-size-adjust: none;
  -moz-text-size-adjust: none;
  user-select: none;
  outline: none;
  box-sizing: border-box !important;
}

#app {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19.2rem;
  height: 10.8rem;
  margin: 0 auto;
  left: 0;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  transform-origin: center center;
  background: white;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
