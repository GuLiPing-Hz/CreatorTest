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

        //如果你想你的资源(resources以外的目录)发布到build，就得给他加依赖
        manifestUrl: cc.RawAsset,

        _failCount: {
            default: 0
        },

        _assetManager: {
            default: null,
        }

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
        cc.log("onLoad test");

        var that = this;
        this.label.string = "检查版本";

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

        //cc.loader.load()
        this.checkUpdate();
    },

    start: function () {

    },

    // update (dt) {},

    onDestroy: function () {
        if (this.assetListener) {
            cc.eventManager.removeListener(this.assetListener);
            this.assetListener = null;
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
            this.loadGame();
            return;
        }

        var that = this;

        //热更新路径
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");

        // var tempDelete = jsb.fileUtils.getWritablePath() + "delete/";
        // jsb.fileUtils.createDirectory(tempDelete);
        // jsb.fileUtils.removeDirectory(tempDelete);

        Log.i("storagePath is " + storagePath + ",this.manifestUrl=" + this.manifestUrl);
        // jsb.fileUtils.addSearchPath("res/");
        // jsb.fileUtils.addSearchPath(storagePath + "update/", true);//所有数据包都需要存放到一个update的热更新目录中

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
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
        };

        this._assetManager = new jsb.AssetsManager(this.manifestUrl, storagePath, this.versionCompareHandle);
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
                cc.log("Verification passed : " + relativePath);
                return true;
            }
            else {
                cc.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        if (/*cc.sys.os === cc.sys.OS_ANDROID*/true) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._assetManager.setMaxConcurrentTask(1);
            cc.log("Max concurrent tasks count have been limited to 2");
        }

        if (!this._assetManager.getLocalManifest().isLoaded()) {
            Log.e("Fail to update assets, step skipped.");
            this.loadGame();
        } else {
            this.assetListener = new jsb.EventListenerAssetsManager(this._assetManager, function (event) {

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

                        setTimeout(function () {
                            that.button.active = true;
                        }, 1000);

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
                        that.loadGame();

                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION://更新进度条
                        Log.i("SceneUpdateScene : UPDATE_PROGRESSION event.getPercent()=" + event.getPercent()
                            + ",event.getPercentByFile()" + event.getPercentByFile()
                            + ",event.getDownloadedFiles()" + event.getDownloadedFiles()
                            + ",event.getTotalFiles()" + event.getTotalFiles()
                            + ",event.getDownloadedFiles()" + event.getDownloadedFiles()
                            + ",event.getTotalBytes()" + event.getTotalBytes()
                            + ",event.getMessage()" + event.getMessage());

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
                        that.loadGame(true);

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
                        that.loadGame();
                        break;

                }

            });
            cc.eventManager.addListener(this.assetListener, 1);

            //Log.i("call this._assetManager =" + this._assetManager);
            //Log.i("call this._assetManager.checkUpdate =" + this._assetManager.checkUpdate);
            this._assetManager.checkUpdate();//检查一下是否有更新
            //this._assetManager.update();//这里是强制更新
            Log.i("SceneUpdateScene 5");
        }

    },

    doUpdate: function (event, customEventData) {
        cc.log("event=", event.type, " data=", customEventData);
        this.showProgress();
        this._assetManager.update();
    },

    showProgress: function () {//显示进度条
        //进度条
        this.loadingBar.active = true;
        this.loadingBar.progress = 0;
    },

    setProgress: function (percent) {//更新进度条
        if (isNaN(percent))
            percent = 0;

        if (this.loadingBar)
            this.loadingBar.progress = percent / 100.0;
    },

    showUpdateError: function (code) {
        // GameUtil.hideLoading();
        // if (DebugConfig.isTest) {
        //     var that = this;
        //     new DialogTip(GetCurLanTip("assetUpdatError") + ",code=" + code).withBtnType(1, function () {
        //         that.loadGame();
        //     }).show(true);
        // } else {
        //     this.loadGame();
        // }

        cc.log("showUpdateError code=" + code);
        this.loadGame();
    },

    loadGame: function (needRestart) {//加载完成或失败的回调

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._assetManager.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }

        //return;
        // GameUtil.hideLoading();
        // var that = this;
        // //jsList是jsList.js的变量，记录全部js。
        // //动态加载
        // cc.loader.loadJs("", ["src/platformList.js"], function (error) {
        //     if (error)
        //         Log.i("load js src/platformList.js error=" + error);
        //     else {
        //         Log.i("load js src/platformList.js success");
        //
        //         for (var i in PlatformCleanListJs) {//清理已经加载的脚本文件,我们需要重新加载一次
        //             cc.sys.cleanScript(PlatformCleanListJs[i]);
        //         }
        //
        //         var allListJs = [];//PlatformCleanListJs.concat(PlatformListJs);
        //
        //         //根据当前语言环境加载指定的文本提示文件
        //         Log.i("cur language = " + cc.sys.language);
        //         if (cc.sys.language === cc.sys.LANGUAGE_CHINESE)//中文
        //             allListJs.push("src/tips.js");
        //         else//英文
        //             allListJs.push("src/tips_en.js");
        //         allListJs = allListJs.concat(PlatformCleanListJs);
        //         allListJs = allListJs.concat(PlatformListJs);
        //
        //         cc.loader.loadJs("", allListJs, function (error) {
        //             if (error)
        //                 Log.i("load js list error=" + error);
        //             else {
        //                 Log.i("load js list success! res version = " + Ver.version);
        //
        //                 //AudioModule.getInstance().initAudio();
        //                 //热更新完成后，进入我们的登录场景
        //                 //AppPresenter.getInstance().initFirstIntoLogin();
        //             }
        //         });
        //     }
        // });
    }
});
