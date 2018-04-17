var Log = {
    i: function (msg) {//信息
        // if (DebugConfig.isLogAll)
        cc.log(/*new Date().getTime() + " : " + */msg);
    },
    w: function (msg) {//警告
        // console.warn(msg);
    },
    e: function (msg) {//错误
        cc.log("ERROR : " + msg);
        //console.error(msg);
    }
};