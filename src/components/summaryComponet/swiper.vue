<style>
.swiper-container img {
  width: 100%;
}
</style>
<template>
    <div>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in swiper" :key='index'>
                    <p class="title">{{myIcads.title}}</p>
                    <ul>
                        <li :key="index" v-for="(item,index) in myIcads.options">
                            <p class="choics">{{item.choice}}</p>
                        </li>
                    </ul>
                    <div class="swiper-scrollbar"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Swiper from "./libs/swiper";
export default {
  props: ["swiper"],
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(function() {
      var mySwiper = new Swiper(".swiper-container", {
        loop: true,
        // 如果需要分页器
        pagination: ".swiper-pagination"
      });
    });
  }
};
</script>
