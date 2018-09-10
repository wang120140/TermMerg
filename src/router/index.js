import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/view/main.vue'
import Boot from '@/view/boot.vue'
Vue.use(Router)
export default new Router({
    routes: [{
            path: '/',
            name: 'boot',
            component: Boot
        },
        {
            path: '/main',
            name: 'main',
            component: Main
        },
        //一下文件需要修改
    ]
})