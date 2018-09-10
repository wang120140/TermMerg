<template>
  <div class="main">
    <div ref="pixicanvas"></div>
    <startpage v-if='ShowSkip' @componentIndex='IndexComponent'></startpage>
    <component v-if="!ShowSkip" :is="data_currentComponent"  class="current"></component>
  </div>
</template>
<script>
//听力部分 祁莎莎
//选择部分 祁莎莎
//完型部分 樊盼盼
//阅读部分 王智永
//报告部分 王彦辉

import { SceneManager } from "../components/libs/EasyPIXI";
import PIXISceneClozePart from "../components/distjs/SceneClozePart.js";
import PIXISceneReadingPart from "../components/distjs/SceneReadingPart.js";
import { mapState, mapActions } from "vuex";

//此处是我添加的部分
import Startpage from "../components/Startpage.vue";
//听力部分
import listenPart from "../components/listenPart.vue";
//单选部分
import selectPart from "../components/selectPart.vue";
//完型部分
import SceneClozePart from "../components/SceneClozePart.vue";
//阅读部分
import SceneReadingPart from "@/components/SceneReadingPart.vue";
//报告部分
import Summary from "../components/Summary.vue";

var CanvasApp;
export default {
  name: "main_vue",
  components: {
    SceneClozePart,
    SceneReadingPart,
    SceneClozePart,
    listenPart,
    selectPart,
    Summary,
    Startpage
  },
  data() {
    return {
      data_componentsArr: [
        "listenPart",
        "selectPart",
        "SceneClozePart",
        "SceneReadingPart",
        "Summary"
      ]
    };
  },
  computed: {
    ...mapState({
      lessonPartPage: state => state.lessonPartPage
    }),
    ShowSkip: {
      get() {
        return this.$store.state.ShowSkip;
      },
      set(value) {
        return this.$store.commit("gotoComponent");
      }
    },
    ComponentIndex: {
      get() {
        return this.$store.state.ComponentIndex;
      },
      set() {}
    },
    data_currentComponent() {
      let self = this;
      return this.data_componentsArr[this.ComponentIndex];
    }
  },
  mounted() {
    CanvasApp = new PIXI.Application({
      width: 1920,
      height: 1080,
      transparent: true
    });
    CanvasApp.view.style.position = "absolute";
    CanvasApp.view.style.width = "100%";
    CanvasApp.view.style.height = "100%";
    CanvasApp.view.style.top = "0px";
    CanvasApp.view.style.left = "0px";
    this.$refs.pixicanvas.appendChild(CanvasApp.view);

    SceneManager.stage = CanvasApp.stage;

    SceneManager.pushScene(
      "SceneClozePart",
      new PIXISceneClozePart(CanvasApp.stage)
    );
    SceneManager.pushScene(
      "SceneReadingPart",
      new PIXISceneReadingPart(CanvasApp.stage)
    );

    SceneManager.run("SceneReadingPart");
    this.gotoPage("SceneReadingPart");
    //从此处添加
  },
  destroyed() {
    CanvasApp.destroy(true);
    PixiScene.destroy();
    PixiScene = null;
    CanvasApp = null;
  },
  methods: {
    ...mapActions(["GOTO_LESSONPART"]),
    IndexComponent($e) {
      //首先改变状态
      this.$store.commit("gotoComponent");
      //具体位置
      this.$store.commit("gotoComponentIndex", $e.index);
      console.log(this.$store.state.ComponentIndex);
    },
    gotoPage($name) {
      let indexs = this.data_componentsArr.indexOf($name);
      this.GOTO_LESSONPART(indexs);
      SceneManager.run($name);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: beige;
}
.current {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99999;
}
</style>
