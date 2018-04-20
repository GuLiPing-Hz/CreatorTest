'use strict';

var Fs = require("fire-fs");
var Path = require("fire-path");

module.exports = {
    load() {
        // execute when package loaded
    },

    unload() {
        // execute when package unloaded
    },

    // register your ipc messages here
    messages: {
        'open'() {
            // open entry panel registered in package.json
            Editor.Panel.open('hotupdate_main');
        },
        'say-hello'() {
            Editor.log('Hello World!');
            // send ipc message to panel
            Editor.Ipc.sendToPanel('hotupdate_main', 'hotupdate_main:hello');
        },
        'clicked'() {
            Editor.log('Button clicked!');
        },
        'editor:build-finished': function (event, target) {
            var root = Path.normalize(target.dest);
            var url = Path.join(root, "main.js");
            Fs.readFile(url, "utf8", function (err, data) {
                if (err) {
                    throw err;
                }

                var newStr =
                    "(function () { \n" +
                    "\n" +
                    "    if (cc.sys.isNative) { \n" +
                    "        var hotUpdateSearchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths'); \n" +
                    "        if (hotUpdateSearchPaths) { \n" +
                    "            jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths)); \n" +
                    "        }\n" +
                    "    }" +
                    "    // 这是为了解决一个重启的 bug 而添加的\n" +
                    "    cc.director.startAnimation();";

                var newData = data.replace("(function () {", newStr);
                Fs.writeFile(url, newData, function (error) {
                    if (err) {
                        throw err;
                    }
                    Editor.log("SearchPath updated in built main.js for hot update");
                });
            });
        }
    },
};