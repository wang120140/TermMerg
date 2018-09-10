var Mutations = {
    gotoLessonPartPage(state, $num) {
        state.lessonPartPage = $num;
    },
    suo(state, payload) {
        (state.lock[payload.index].lock5) ? (state.lock[payload.index].lock5 = false) : (state.lock[payload.index].lock5 = true);
    },
    gotoSkip(state) {
        //跳转到了主页面
        state.ShowSkip = true;
    },
    gotoComponent(state) {
        state.ShowSkip = false;
        //跳转到组件页面
    },
    gotoComponentIndex(state, payload) {
        state.ComponentIndex = payload

    },
    startButtonControl(state) {
        state.startButton = false;
    }
}
export default Mutations;