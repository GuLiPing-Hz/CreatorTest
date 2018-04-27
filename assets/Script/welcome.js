var STRING_GAME_RESTART = "GameRestart";

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            //ATTRIBUTES:
            default: null,        // The default value will be used only when the component attaching to a node for the first time
            type: cc.Label // optional, default is typeof default
        },
        button: {
            //ATTRIBUTES:
            default: null,        // The default value will be used only when the component attaching to a node for the first time
            type: cc.Node // optional, default is typeof default
        },
        loadingBar: {
            //ATTRIBUTES:
            default: null,        // The default value will be used only when the component attaching to a node for the first time
            type: cc.ProgressBar // optional, default is typeof default
            //serializable: true,   // optional, default is true
        },
        btnGame1: {
            default: null,
            type: cc.Node
        },
        barGame: [cc.ProgressBar],

        btnGame2: {
            default: null,
            type: cc.Node
        },

        //如果你想你的资源(resources以外的目录)发布到build，就得给他加依赖
        manifestUrl: cc.RawAsset,
        manifestUrlGame: [cc.RawAsset],//游戏的project通过热更新的方式更新下来

        _failCount: {
            default: 0
        },

        _assetManager: null,
        _assetListener: null,

        _assetManagerGame: null,
        _assetListenerGame: null,

        _reStart: false,
        _updatePath: ""
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        Log.i("onLoad test");

        this._updatePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() + "update/" : "./";

        //检查是否游戏更新重启的
        this._reStart = cc.sys.localStorage.getItem(STRING_GAME_RESTART) === "1";
        Log.i("this._reStart = " + this._reStart + ",type=" + typeof this._reStart);
        cc.sys.localStorage.setItem(STRING_GAME_RESTART, "0");

        this.label.string = "检查版本 2";

        // this.button.on(cc.Node.EventType.TOUCH_END, function () {
        //     that.showProgress();
        //     that._assetManager.update();
        // }, this.button);

        cc.sys.dump();
        //
        // // if(cc.sys.platform === cc.sys.ANDROID){//安卓降帧
        cc.game.setFrameRate(60);//15帧,18,21,24
        // // }
        //
        // // if (DebugConfig.isTest && !DebugConfig.isIOSJT) {
        cc.director.setDisplayStats(true);
        // // }

        this.checkUpdate();
        // this.loadLobby();
    },

    start: function () {

    },

    // update (dt) {},

    onDestroy: function () {
        if (this._assetListenerGame) {
            cc.eventManager.removeListener(this._assetListenerGame);
            this._assetListenerGame = null;
        }

        if (this._assetManagerGame && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._assetManagerGame.release();
        }

        if (this._assetListener) {
            cc.eventManager.removeListener(this._assetListener);
            this._assetListener = null;
        }

        if (this._assetManager && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._assetManager.release();
        }
    },

    /**
     * 检查平台是否有更新
     */
    checkUpdate: function () {
        //GameUtil.showLoadingEx(false);

        if (!cc.sys.isNative) {//h5,不用
            this.loadLobby();
            return;
        }

        var that = this;

        //热更新路径
        var storagePath = this._updatePath;//调整热更新路径

        // var tempDelete = jsb.fileUtils.getWritablePath() + "delete/";
        // jsb.fileUtils.createDirectory(tempDelete);
        // jsb.fileUtils.removeDirectory(tempDelete);

        Log.i("checkUpdate storagePath =" + storagePath + ",this.manifestUrl=" + this.manifestUrl);
        // jsb.fileUtils.addSearchPath("res/");
        // jsb.fileUtils.addSearchPath(storagePath + "update/", true);//所有数据包都需要存放到一个update的热更新目录中

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this._assetManager = new jsb.AssetsManager(this.manifestUrl, storagePath
            , function (versionA, versionB) {
                Log.i("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
                var vA = versionA.split('.');
                var vB = versionB.split('.');
                for (var i = 0; i < vA.length; ++i) {
                    var a = parseInt(vA[i]);
                    var b = parseInt(vB[i] || 0);
                    if (a === b) {
                        continue;
                    }
                    else {
                        return a - b;
                    }
                }
                if (vB.length > vA.length) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._assetManager.retain();
        }

        //this._assetManager.setVerifyCallback(GameUtil.assetVerify);
        this._assetManager.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                Log.i("Verification passed : " + relativePath);
                return true;
            }
            else {
                Log.i("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        if (/*cc.sys.os === cc.sys.OS_ANDROID*/true) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._assetManager.setMaxConcurrentTask(1);
            Log.i("Max concurrent tasks count have been limited to 2");
        }

        if (!this._assetManager.getLocalManifest().isLoaded()) {
            Log.e("Fail to update assets, step skipped.");
            this.loadLobby();
        } else {
            this._assetListener = new jsb.EventListenerAssetsManager(this._assetManager, function (event) {

                Log.i("Lobby EventListenerAssetsManager event=" + event);

                switch (event.getEventCode()) {

                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:

                        Log.e("SceneUpdateScene : ERROR_NO_LOCAL_MANIFEST  " + event.getMessage());
                        that.showUpdateError(jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST);

                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:

                        Log.e("SceneUpdateScene : ERROR_DOWNLOAD_MANIFEST  " + event.getMessage());
                        that.showUpdateError(jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST);

                        break;
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:

                        Log.e("SceneUpdateScene : ERROR_PARSE_MANIFEST  " + event.getMessage());
                        that.showUpdateError(jsb.EventAssetsManager.ERROR_PARSE_MANIFEST);

                        break;
                    case jsb.EventAssetsManager.NEW_VERSION_FOUND:

                        Log.i("SceneUpdateScene : NEW_VERSION_FOUND " + event.getMessage());

                        if (!that._reStart) {
                            setTimeout(function () {
                                that.button.active = true;
                            }, 500);
                        } else {
                            that.doUpdate();
                        }

                        // GameUtil.hideLoading();//隐藏等待框
                        // //我们需要更新。。。
                        // // var size = that._assetManager.getUpdateDownSize();
                        // // var tip = SceneUpdateRes.newVersion.format(GameUtil.formatSize(size));
                        // new DialogTip(GetCurLanTip("newVersion")).withBtnType(4, function (type) {
                        //     if (type === 2) {// then--更新
                        //         that.showProgress();
                        //         that._assetManager.update();
                        //     } else {
                        //         //--退出游戏
                        //         //director:endToLua()
                        //         cc.director.end();
                        //     }
                        // }).show(true);

                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:

                        Log.i("SceneUpdateScene : ALREADY_UP_TO_DATE " + event.getMessage());
                        //我们不需要更新。。。
                        that.loadLobby();

                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION://更新进度条
                        Log.i("SceneUpdateScene : UPDATE_PROGRESSION event.getPercent()=" + event.getPercent()
                            + ",event.getPercentByFile()=" + event.getPercentByFile()
                            + ",event.getDownloadedFiles()=" + event.getDownloadedFiles()
                            + ",event.getTotalFiles()=" + event.getTotalFiles()
                            + ",event.getDownloadedBytes()=" + event.getDownloadedBytes()
                            + ",event.getTotalBytes()=" + event.getTotalBytes()
                            + ",event.getMessage()=" + event.getMessage());

                        that.setProgress(event.getPercent());

                        break;
                    case jsb.EventAssetsManager.ASSET_UPDATED://某一个ASSET已经下载完毕，可能还需要解压缩或第二个ASSET
                        Log.i("SceneUpdateScene : ASSET_UPDATED " + event.getAssetId() + "," + event.getMessage());
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING://更新发生错误

                        Log.e("SceneUpdateScene : ERROR_UPDATING " + event.getAssetId() + ", " + event.getMessage());

                        // that.showUpdateError(jsb.EventAssetsManager.ERROR_UPDATING);

                        break;
                    case jsb.EventAssetsManager.UPDATE_FINISHED://资源更新完毕

                        Log.i("SceneUpdateScene : UPDATE_FINISHED " + event.getMessage());
                        that.setProgress(100);
                        that.loadLobby(true);

                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED://更新失败

                        Log.e("SceneUpdateScene : UPDATE_FAILED " + event.getMessage());

                        that.failCount++;

                        if (that.failCount < 1) {
                            that._assetManager.downloadFailedAssets();
                        } else {
                            Log.i("Reach maximum fail count, exit update process");
                            that.failCount = 0;
                            that.showUpdateError(jsb.EventAssetsManager.UPDATE_FAILED);
                        }

                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS://解压错误
                        Log.e("SceneUpdateScene : ERROR_DECOMPRESS " + event.getMessage());
                        that.showUpdateError(jsb.EventAssetsManager.ERROR_DECOMPRESS);
                        break;
                    default:
                        Log.i("SceneUpdateScene : unknown Event" + event.getMessage());
                        that.loadLobby();
                        break;

                }

            });
            cc.eventManager.addListener(this._assetListener, 1);

            //Log.i("call this._assetManager =" + this._assetManager);
            //Log.i("call this._assetManager.checkUpdate =" + this._assetManager.checkUpdate);
            this._assetManager.checkUpdate();//检查一下是否有更新
            //this._assetManager.update();//这里是强制更新
            Log.i("SceneUpdateScene 5");
        }

    },

    doUpdate: function (event, customEventData) {
        if (event)
            Log.i("doUpdate event=", event.type, " data=", customEventData);

        //显示进度条
        this.loadingBar.active = true;
        this.loadingBar.progress = 0;

        this._assetManager.update();
    },

    setProgress: function (percent) {//更新进度条
        if (isNaN(percent))
            percent = 0;

        if (this.loadingBar)
            this.loadingBar.progress = percent;
    },

    showUpdateError: function (code) {
        // GameUtil.hideLoading();
        // if (DebugConfig.isTest) {
        //     var that = this;
        //     new DialogTip(GetCurLanTip("assetUpdatError") + ",code=" + code).withBtnType(1, function () {
        //         that.loadLobby();
        //     }).show(true);
        // } else {
        //     this.loadLobby();
        // }

        Log.i("showUpdateError code=" + code);
        this.loadLobby();
    },

    loadLobby: function (needRestart) {//加载完成或失败的回调
        Log.i("loadLobby needRestart=" + needRestart);
        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            console.log("searchPaths=" + JSON.stringify(searchPaths));
            var newPaths = this._assetManager.getLocalManifest().getSearchPaths();
            console.log("newPaths=" + JSON.stringify(newPaths));

            //我们暂不支持在更新包里面添加新的搜索路径
            // Array.prototype.unshift(searchPaths, newPaths);
            // // This value will be retrieved and appended to the default search path during game startup,
            // // please refer to samples/js-tests/main.js for detailed usage.
            // // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            // cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            // console.log("setSearchPaths 2");
            // jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();

            //为了更新，我们需要重启，并记录标志
            cc.sys.localStorage.setItem(STRING_GAME_RESTART, "1");
            cc.game.restart();
        } else {//游戏更新检查完毕
            Log.i("游戏更新检查完毕");

            this.btnGame1.active = true;
            this.btnGame2.active = true;
        }
    },

    checkGameUpdate: function (gameId) {
        var that = this;

        var gameManifestUrl = cc.url.raw("resources/project_game_" + gameId + ".manifest");
        Log.i("checkGameUpdate gameManifestUrl = " + gameManifestUrl);
        var gameStoragePath = jsb.fileUtils.getWritablePath() + "Game" + gameId;
        Log.i("checkGameUpdate gameStoragePath = " + gameStoragePath);

        if (this._assetManagerGame) {//如果已经检查过一个游戏
            if (this._assetListenerGame) {
                cc.eventManager.removeListener(this._assetListenerGame);
                this._assetListenerGame = null;
            }

            if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
                this._assetManagerGame.release();
            }
        }

        //新的游戏manifest文件，新的更新地址
        this._assetManagerGame = new jsb.AssetsManager(gameManifestUrl, gameStoragePath
            , function (versionA, versionB) {
                Log.i("Game JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
                var vA = versionA.split('.');
                var vB = versionB.split('.');
                for (var i = 0; i < vA.length; ++i) {
                    var a = parseInt(vA[i]);
                    var b = parseInt(vB[i] || 0);
                    if (a === b) {
                        continue;
                    }
                    else {
                        return a - b;
                    }
                }
                if (vB.length > vA.length) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._assetManagerGame.retain();
        }

        this._assetManagerGame.setMaxConcurrentTask(1);
        this._assetManagerGame.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                Log.i("Verification passed : " + relativePath);
            }
            else {
                Log.i("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
            }

            return true;
        });

        if (!this._assetManagerGame.getLocalManifest().isLoaded()) {
            Log.e("Game Fail to update assets, step skipped.");
            // this.loadLobby();
            this.enterGame("本地游戏文件异常,无法进入游戏");
        } else {
            this._assetListenerGame = new jsb.EventListenerAssetsManager(this._assetManagerGame, function (event) {

                Log.i("Game EventListenerAssetsManager event=" + event);

                switch (event.getEventCode()) {

                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:

                        Log.e("Game SceneUpdateScene : ERROR_NO_LOCAL_MANIFEST  " + event.getMessage());
                        that.enterGameErrorCode(jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST);

                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:

                        Log.e("Game SceneUpdateScene : ERROR_DOWNLOAD_MANIFEST  " + event.getMessage());
                        that.enterGameErrorCode(jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST);

                        break;
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:

                        Log.e("Game SceneUpdateScene : ERROR_PARSE_MANIFEST  " + event.getMessage());
                        that.enterGameErrorCode(jsb.EventAssetsManager.ERROR_PARSE_MANIFEST);

                        break;
                    case jsb.EventAssetsManager.NEW_VERSION_FOUND:

                        Log.i("Game SceneUpdateScene : NEW_VERSION_FOUND " + event.getMessage());
                        that.doGameUpdate(gameId);

                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:

                        Log.i("Game SceneUpdateScene : ALREADY_UP_TO_DATE " + event.getMessage());
                        //我们不需要更新。。。
                        that.enterGame(null, gameId);

                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION://更新进度条
                        Log.i("Game SceneUpdateScene : UPDATE_PROGRESSION event.getPercent()=" + event.getPercent()
                            + ",event.getPercentByFile()=" + event.getPercentByFile()
                            + ",event.getDownloadedFiles()=" + event.getDownloadedFiles()
                            + ",event.getTotalFiles()=" + event.getTotalFiles()
                            + ",event.getDownloadedBytes()=" + event.getDownloadedBytes()
                            + ",event.getTotalBytes()=" + event.getTotalBytes()
                            + ",event.getMessage()=" + event.getMessage());

                        that.setProgressGame(event.getPercent());

                        break;
                    case jsb.EventAssetsManager.ASSET_UPDATED://某一个ASSET已经下载完毕，可能还需要解压缩或第二个ASSET
                        Log.i("Game SceneUpdateScene : ASSET_UPDATED " + event.getAssetId() + "," + event.getMessage());
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING://更新发生错误

                        Log.e("Game SceneUpdateScene : ERROR_UPDATING " + event.getAssetId() + ", " + event.getMessage());
                        // that.showUpdateError(jsb.EventAssetsManager.ERROR_UPDATING);

                        break;
                    case jsb.EventAssetsManager.UPDATE_FINISHED://资源更新完毕

                        Log.i("Game SceneUpdateScene : UPDATE_FINISHED " + event.getMessage());
                        that.setProgress(100);
                        that.enterGame(null, gameId);

                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED://更新失败

                        Log.e("Game SceneUpdateScene : UPDATE_FAILED " + event.getMessage());

                        Log.i("Game Reach maximum fail count, exit update process");
                        that.enterGameErrorCode(jsb.EventAssetsManager.UPDATE_FAILED);

                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS://解压错误
                        Log.e("Game SceneUpdateScene : ERROR_DECOMPRESS " + event.getMessage());
                        that.enterGameErrorCode(jsb.EventAssetsManager.ERROR_DECOMPRESS);
                        break;
                    default:
                        Log.i("Game SceneUpdateScene : unknown Event" + event.getMessage());
                        that.enterGame(null, gameId);
                        break;

                }

            });
            cc.eventManager.addListener(this._assetListenerGame, 1);

            //Log.i("call this._assetManagerGame =" + this._assetManagerGame);
            //Log.i("call this._assetManagerGame.checkUpdate =" + this._assetManagerGame.checkUpdate);
            this._assetManagerGame.checkUpdate();//检查一下是否有更新
            //this._assetManagerGame.update();//这里是强制更新
            Log.i("Game SceneUpdateScene 5");
        }
    },

    doGameUpdate: function (gameId) {
        if (event)
            Log.i("doUpdate event=", event.type, " data=", customEventData);

        var index = gameId - 1;
        //显示进度条
        if (this.barGame[index]) {
            this.barGame[index].active = true;
            this.barGame[index].progress = 0;
        }

        //开始更新子游戏
        this._assetManagerGame.update();
    },

    setProgressGame: function (gameId, percent) {//更新进度条
        if (isNaN(percent))
            percent = 0;

        var index = gameId - 1;
        if (this.barGame[index])
            this.barGame[index].progress = percent;
    },

    enterGameErrorCode: function (code) {
        this.enterGame("进入游戏失败 code = " + code);
    },

    enterGame: function (errorStr, gameId) {
        if (errorStr) {
            Log.i("enterGame errorStr = " + errorStr);
        } else {
            this.clickGoGame(null, gameId);
        }
    },

    clickGoGame: function (event, customEventData) {
        if (event)
            Log.i("clickGoGame event=", event.type, " data=", customEventData);

        if (cc.sys.isNative) {
            require("Game" + customEventData + "/main.js");//前面是为了让creator编译过

            // if (customEventData === "1") {
            //     // var path = "C:/Users/Administrator/AppData/Local/hello_world/";
            //     // require(path + "Game1/main.js");
            //     require("" + "Game1/main.js");//前面是为了让creator编译过
            //
            //     // cc.loader.load(/*path +*/ "Game1/main.js", function (err, result) {
            //     //     if (err) {
            //     //         Log.i("clickGoGame err = " + err);
            //     //     } else {
            //     //         Log.i("clickGoGame load resources/Game1/main.js result = " + result);
            //     //         eval(result);
            //     //     }
            //     // });
            // }
        } else {
            Log.i("网页进入子游戏未实现");
        }
    },
});
