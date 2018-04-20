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

                // var newStr =
                //     "(function () { \n" +
                //     "\n" +
                //     "    if (cc.sys.isNative) { \n" +
                //     "        var hotUpdateSearchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths'); \n" +
                //     "        if (hotUpdateSearchPaths) { \n" +
                //     "            jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths)); \n" +
                //     "        }\n" +
                //     "    }" +
                //     "    // 这是为了解决一个重启的 bug 而添加的\n" +
                //     "    cc.director.startAnimation();";
                //
                // var newData = data.replace("(function () {", newStr);

                var newData = "(function () {\n" +
                    "\n" +
                    "    cc.custom = {};\n" +
                    "    cc.custom.isLobby = true;\n" +
                    "    cc.custom.curDir = \"\";\n" +
                    "    console.log(\"cc.custom.curDir=\"+cc.custom.curDir);\n" +
                    "\n" +
                    "    if (cc.sys.isNative && cc.custom.isLobby) {\n" +
                    "        var hotUpdateSearchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths');\n" +
                    "        if (hotUpdateSearchPaths) {\n" +
                    "            jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));\n" +
                    "        }\n" +
                    "    }\n" +
                    "\n" +
                    "    'use strict';\n" +
                    "\n" +
                    "    function boot () {\n" +
                    "\n" +
                    "        var settings = window._CCSettings;\n" +
                    "        window._CCSettings = undefined;\n" +
                    "\n" +
                    "        if ( !settings.debug ) {\n" +
                    "            var uuids = settings.uuids;\n" +
                    "\n" +
                    "            var rawAssets = settings.rawAssets;\n" +
                    "            var assetTypes = settings.assetTypes;\n" +
                    "            var realRawAssets = settings.rawAssets = {};\n" +
                    "            for (var mount in rawAssets) {\n" +
                    "                var entries = rawAssets[mount];\n" +
                    "                var realEntries = realRawAssets[mount] = {};\n" +
                    "                for (var id in entries) {\n" +
                    "                    var entry = entries[id];\n" +
                    "                    var type = entry[1];\n" +
                    "                    // retrieve minified raw asset\n" +
                    "                    if (typeof type === 'number') {\n" +
                    "                        entry[1] = assetTypes[type];\n" +
                    "                    }\n" +
                    "                    // retrieve uuid\n" +
                    "                    realEntries[uuids[id] || id] = entry;\n" +
                    "                }\n" +
                    "            }\n" +
                    "\n" +
                    "            var scenes = settings.scenes;\n" +
                    "            for (var i = 0; i < scenes.length; ++i) {\n" +
                    "                var scene = scenes[i];\n" +
                    "                if (typeof scene.uuid === 'number') {\n" +
                    "                    scene.uuid = uuids[scene.uuid];\n" +
                    "                }\n" +
                    "            }\n" +
                    "\n" +
                    "            var packedAssets = settings.packedAssets;\n" +
                    "            for (var packId in packedAssets) {\n" +
                    "                var packedIds = packedAssets[packId];\n" +
                    "                for (var j = 0; j < packedIds.length; ++j) {\n" +
                    "                    if (typeof packedIds[j] === 'number') {\n" +
                    "                        packedIds[j] = uuids[packedIds[j]];\n" +
                    "                    }\n" +
                    "                }\n" +
                    "            }\n" +
                    "        }\n" +
                    "\n" +
                    "        // init engine\n" +
                    "        var canvas;\n" +
                    "\n" +
                    "        if (cc.sys.isBrowser) {\n" +
                    "            canvas = document.getElementById('GameCanvas');\n" +
                    "        }\n" +
                    "\n" +
                    "        function setLoadingDisplay () {\n" +
                    "            // Loading splash scene\n" +
                    "            var splash = document.getElementById('splash');\n" +
                    "            var progressBar = splash.querySelector('.progress-bar span');\n" +
                    "            cc.loader.onProgress = function (completedCount, totalCount, item) {\n" +
                    "                var percent = 100 * completedCount / totalCount;\n" +
                    "                if (progressBar) {\n" +
                    "                    progressBar.style.width = percent.toFixed(2) + '%';\n" +
                    "                }\n" +
                    "            };\n" +
                    "            splash.style.display = 'block';\n" +
                    "            progressBar.style.width = '0%';\n" +
                    "\n" +
                    "            cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {\n" +
                    "                splash.style.display = 'none';\n" +
                    "            });\n" +
                    "        }\n" +
                    "\n" +
                    "        var onStart = function () {\n" +
                    "            cc.view.resizeWithBrowserSize(true);\n" +
                    "\n" +
                    "            if (!false) {\n" +
                    "                // UC browser on many android devices have performance issue with retina display\n" +
                    "                if (cc.sys.os !== cc.sys.OS_ANDROID || cc.sys.browserType !== cc.sys.BROWSER_TYPE_UC) {\n" +
                    "                    cc.view.enableRetina(true);\n" +
                    "                }\n" +
                    "                if (cc.sys.isBrowser) {\n" +
                    "                    setLoadingDisplay();\n" +
                    "                }\n" +
                    "\n" +
                    "                if (cc.sys.isMobile) {\n" +
                    "                    if (settings.orientation === 'landscape') {\n" +
                    "                        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);\n" +
                    "                    }\n" +
                    "                    else if (settings.orientation === 'portrait') {\n" +
                    "                        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);\n" +
                    "                    }\n" +
                    "                    // qq, wechat, baidu\n" +
                    "                    cc.view.enableAutoFullScreen(\n" +
                    "                        cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU &&\n" +
                    "                        cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT &&\n" +
                    "                        cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ\n" +
                    "                    );\n" +
                    "                }\n" +
                    "\n" +
                    "                // Limit downloading max concurrent task to 2,\n" +
                    "                // more tasks simultaneously may cause performance draw back on some android system / brwosers.\n" +
                    "                // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.\n" +
                    "                if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {\n" +
                    "                    cc.macro.DOWNLOAD_MAX_CONCURRENT = 2;\n" +
                    "                }\n" +
                    "            }\n" +
                    "\n" +
                    "            // init assets\n" +
                    "            cc.AssetLibrary.init({\n" +
                    "                libraryPath: 'res/import',\n" +
                    "                rawAssetsBase: 'res/raw-',\n" +
                    "                rawAssets: settings.rawAssets,\n" +
                    "                packedAssets: settings.packedAssets,\n" +
                    "                md5AssetsMap: settings.md5AssetsMap\n" +
                    "            });\n" +
                    "\n" +
                    "            var launchScene = settings.launchScene;\n" +
                    "\n" +
                    "            // load scene\n" +
                    "            cc.director.loadScene(launchScene, null,\n" +
                    "                function () {\n" +
                    "                    if (cc.sys.isBrowser) {\n" +
                    "                        // show canvas\n" +
                    "                        canvas.style.visibility = '';\n" +
                    "                        var div = document.getElementById('GameDiv');\n" +
                    "                        if (div) {\n" +
                    "                            div.style.backgroundImage = '';\n" +
                    "                        }\n" +
                    "                    }\n" +
                    "                    cc.loader.onProgress = null;\n" +
                    "                    console.log('Success to load scene: ' + launchScene);\n" +
                    "                }\n" +
                    "            );\n" +
                    "        };\n" +
                    "\n" +
                    "        // jsList\n" +
                    "        var jsList = settings.jsList;\n" +
                    "        var bundledScript = settings.debug ? 'src/project.dev.js' : 'src/project.js';\n" +
                    "        bundledScript = cc.custom.curDir + bundledScript;\n" +
                    "        if (jsList) {\n" +
                    "            jsList = jsList.map(function (x) { return cc.custom.curDir + 'src/' + x; });\n" +
                    "            jsList.push(bundledScript);\n" +
                    "        }\n" +
                    "        else {\n" +
                    "            jsList = [bundledScript];\n" +
                    "        }\n" +
                    "\n" +
                    "        // anysdk scripts\n" +
                    "        if (cc.sys.isNative && cc.sys.isMobile && cc.custom.isLobby) {//大厅才去加载anysdk\n" +
                    "            jsList = jsList.concat(['src/anysdk/jsb_anysdk.js', 'src/anysdk/jsb_anysdk_constants.js']);\n" +
                    "        }\n" +
                    "\n" +
                    "\n" +
                    "        var option = {\n" +
                    "            //width: width,\n" +
                    "            //height: height,\n" +
                    "            id: 'GameCanvas',\n" +
                    "            scenes: settings.scenes,\n" +
                    "            debugMode: settings.debug ? cc.DebugMode.INFO : cc.DebugMode.ERROR,\n" +
                    "            showFPS: !false && settings.debug,\n" +
                    "            frameRate: 60,\n" +
                    "            jsList: jsList,\n" +
                    "            groupList: settings.groupList,\n" +
                    "            collisionMatrix: settings.collisionMatrix,\n" +
                    "            renderMode: 0\n" +
                    "        };\n" +
                    "\n" +
                    "        cc.game.run(option, onStart);\n" +
                    "    }\n" +
                    "\n" +
                    "    if (window.jsb) {\n" +
                    "        require(cc.custom.curDir + 'src/settings.js');\n" +
                    "        require(cc.custom.curDir + 'src/jsb_polyfill.js');\n" +
                    "        boot();\n" +
                    "    }\n" +
                    "    else if (false) {\n" +
                    "        require(window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js');\n" +
                    "        var prevPipe = cc.loader.md5Pipe || cc.loader.assetLoader;\n" +
                    "        cc.loader.insertPipeAfter(prevPipe, wxDownloader);\n" +
                    "        boot();\n" +
                    "    }\n" +
                    "    else if (window.document) {\n" +
                    "        var splash = document.getElementById('splash');\n" +
                    "        splash.style.display = 'block';\n" +
                    "\n" +
                    "        var cocos2d = document.createElement('script');\n" +
                    "        cocos2d.async = true;\n" +
                    "        cocos2d.src = window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js';\n" +
                    "\n" +
                    "        var engineLoaded = function () {\n" +
                    "            document.body.removeChild(cocos2d);\n" +
                    "            cocos2d.removeEventListener('load', engineLoaded, false);\n" +
                    "            window.eruda && eruda.init() && eruda.get('console').config.set('displayUnenumerable', false);\n" +
                    "            boot();\n" +
                    "        };\n" +
                    "        cocos2d.addEventListener('load', engineLoaded, false);\n" +
                    "        document.body.appendChild(cocos2d);\n" +
                    "    }\n" +
                    "\n" +
                    "})();\n";
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