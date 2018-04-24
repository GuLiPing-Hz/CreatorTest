cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = "这里是游戏 1";//this.text;
    },

    // called every frame
    update: function (dt) {

    },

    clickBack: function (event, data) {
        console.log("clickBack");

        // cc.log("cc.isBackFromGame = " + cc.isBackFromGame);
        // cc.isBackFromGame = true;
        // require("" + "main.js");
    },
});
