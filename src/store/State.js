var State = {
    begin: "gameBegin",

    lessonPartPage: 0, //每道大题的索引;

    allLessonPartsArr: [],

    startButton: true,
    lock: [ //修改为对象 这个是舔砖路由用的
        {
            lock5: true
        },
        {
            lock5: false,
        },
        {
            lock5: false
        },
        {
            lock5: false,
        }
    ],
    scorePartListen: [5, 5, 5, 5, 5], //听力
    scorePartGrammar: [5, 5, 5, 5, 0], //词汇,
    scorePartReading: [5, 5, 5, 5, 0], //阅读
    scorePartSentences: [5, 5, 5, 5, 5], //完型

    ScoreAll: [50, 60, 80, 55, 55, 15, 58, 25, 28, 29, 15, 16, 18, 80, , 100, 25, 90, 90, 65, 70, 85, 0, 0, ], //总个数
    //修改路由的需要的参数
    ShowSkip: true,
    //组件顺序
    ComponentIndex: 0,

}
export default State;