<template>
<div class="SceneClozePart">
  <div class="SceneClozePart_box">
    <div class="SceneClozePart_title">{{baseTitle}}</div>
      <div class="SceneClozePart_content">
        <span v-for="(item,index) in tempArray" :key="item.text" :style="{zIndex:tempArray.length-index,position:'relative'}">
          <span v-text="item.text"></span>
          <selection @selectionToggle="selectionToggle" @selected="selected"  v-if="item.blank" :blank="item.blank" :selectedIndex="index+1"></selection>
        </span>
      </div>
      <div class="SceneClozePart_button"><button @click="submit" :style="{backgroundColor:btnColor}">submit</button></div>
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
import Selection from "../components/summaryComponet/Selection.vue";
import NoDialog from "../components/summaryComponet/NoDialog.vue";
import Url from "../components/distjs/Url.js";
export default {
  name: "SceneClozePart",
  components: {
    Selection,
    NoDialog
  },
  data() {
    return {
      baseTitle: "",
      baseContent: "",
      btnColor: "gray",
      selection: [],
      tempArray: [],
      itemArray: [],
      selectedArray: [],
      //iron90添加
      NoDialogShow: false,
      imgbgNo: Url.Url3 + "dialogNobg.jpg", //这个地址相对于对话框的相对位置来查找建议使用@
      TopStyleNo: "-10px",
      LeftStyleNo: "-10px"
    };
  },
  mounted() {
    var self = this;
    this.axios
      .get("static/data.json")
      .then(response => {
        self.baseTitle = response.data.clozePart.levels.title;
        self.baseContent = response.data.clozePart.levels.content;
        return this.axios.get("static/data.json");
      })
      .then(response => {
        self.selection = response.data.selection;

        this.contents.map((val, index) => {
          if (index === this.contents.length - 1) {
            this.tempArray.push({
              text: val,
              blank: null
            });
          } else {
            this.tempArray.push({
              text: val,
              blank: self.selection[index]
            });
          }
        });
      });
  },
  computed: {
    contents() {
      return this.baseContent.split("&&&");
    }
  },
  methods: {
    selectionToggle(selectionObject) {
      // debugger
      // console.log(selectionObject)
      let status = selectionObject.status;
      let el = selectionObject.el;
      this.$children.map(child => {
        if (child === el) {
          child.showStatus = child.showStatus === 1 ? 0 : 1;
        } else {
          child.showStatus = 0;
          //  child.listHeight = 0
        }
      });
    },
    selected(item) {
      //
      this.itemArray.push({ id: item.index, label: item.label });
      if (this.itemArray.length >= 2) {
        this.itemArray.splice(0, 1);
      }
      console.log(this.itemArray);
      //各选项存放到一个大数组里的操作 ---未实现
      this.selectedArray.push(this.itemArray);
      console.log(this.selectedArray);

      // 控制submit按钮的背景色
      // if(this.selectedArray.length ==5){
      //   this.btnColor = "skyblue"
      // }
    },
    submit() {
      if (this.selectedArray.length == 5) {
        this.NoDialogShow = true;
      } else {
        alert("还有题目未答完！");
      }
    },
    //iron90添加
    NoDialogClose() {
      //子组件事件
      this.NoDialogShow = false;
      this.$store.commit({
        type: "suo",
        index: 3
      });
      this.$store.commit("gotoSkip");
    }
  }
};
</script>
<style scoped>
.SceneClozePart {
  position: relative;
  margin: 2rem auto;
  width: 12.3rem;
  height: 6.7rem;
  border: 0.01rem solid gray;
}
.SceneClozePart_box {
  margin: 0.4rem;
}
.SceneClozePart .SceneClozePart_title {
  margin: 0.2rem auto;
  width: 5rem;
  line-height: 0.5rem;
  font-size: 0.2rem;
  text-align: center;
  border: 0.01rem solid gray;
}
.SceneClozePart_content {
  padding: 0.1rem;
  width: 11.45rem;
  height: 4rem;
  overflow: hidden;
  overflow-y: scroll;
  font-size: 18px;
  line-height: 0.5rem;
  text-indent: 0.6rem;
  border: 0.01rem solid #903;
}
.SceneClozePart_content div {
  display: inline-block;
}
.SceneClozePart_button {
  position: absolute;
  right: 0.5rem;
  bottom: 0.2rem;
}
.SceneClozePart_button button {
  padding: 0.1rem;
  color: white;
  border-radius: 0.1rem;
}
/* 滚动条设置 */
::-webkit-scrollbar {
  width: 0.2rem;
  height: 0.2rem;
  /* background-color: pink; */
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(238, 2, 2, 0.3);
  border-radius: 0.1rem;
  background-color: #f5f5f5;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 0.1rem;
  /* -webkit-box-shadow: inset 0 0 6px rgba(189, 93, 93, 0.3); */
  background-color: #903;
}
</style>

