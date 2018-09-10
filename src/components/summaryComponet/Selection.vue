<template>
  <div>
    <div class="selection">
      <div class="selection_box" @click="selectionListStatus()">
        <div :style="{backgroundColor:blankBgc,color:fontColor}">{{computedSelectedIndex}}</div>
      </div>
      <div class="selection_list" id="selection_list" ref="selectionList" :style="{opacity:showStatus}">
        <ul>
          <li @click="getselectIndex(item)" v-for="(item) in selection" :key="item.index" >{{item.sel}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Selection",
  data() { 
    return{
      showStatus: 0,
      blankBgc:"gray",
      fontColor:'black',
      computedSelectedIndex:"",
  	}
  },
  props:["blank","selectedIndex"],
  watch:{
    showStatus(o,n){
      setTimeout(()=>{
        this.$refs.selectionList.style.display = n?'none':'block';
      },100)
    }
  },
  mounted() {
    this.computedSelectedIndex = this.selectedIndex;
    // this.listHeight = document.getElementById("selection_list").offsetHeight;
    // console.log(document.getElementById("selection_list").offsetHeight)
  },
  computed: {
    selection(){
      return this.blank;
    }
    
  },
  methods:{
    selectionListStatus() {
      // 更改父组件的值 
      this.$emit("selectionToggle", {el: this, status:this.showStatus})
    },
    getselectIndex(item){
      this.blankBgc="pink"
      this.fontColor="white"
      // 在子组件定义一个私有变量，更改子组件的值；并不是更改父组件的值；
      this.computedSelectedIndex = item.label;
      this.showStatus = 0;
      this.$emit("selected",{label:item.label,index:this.selectedIndex})
    }
  }
}
</script>
<style scoped>
.selection{
  position: relative;
  width: 2rem;
  font-size: 0;
}
.selection .selection_box{
  width: 2rem;
  height: .4rem;
  font-size: .3rem;
  text-align: center;
  border-bottom:1px solid gray;
}
.selection .selection_box div{
  margin: 0 auto;
  width: .3rem;
  line-height: .3rem;
  font-size: .3rem;
  /* color: black; */
  padding: 0;
  text-align: center;
  text-indent: 0;
}
.selection_list{
  position: absolute;
  transition: all 200ms linear;
  display: none;
}
.selection ul{
  overflow: hidden;
  padding: 0;
  margin: 0;
  width: 2.6rem;
  border-radius: .1rem;
  background-color: pink;
}
.selection ul li{
  margin: .1rem;
  width: 2.4rem;
  list-style: none;
  line-height: .4rem;
  border-radius: .1rem;
  font-size:.3rem;
  background-color: skyblue;
}
</style>
