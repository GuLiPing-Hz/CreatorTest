require = function() {
  function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = "function" == typeof require && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n || e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = "function" == typeof require && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  }
  return e;
}()({
  HelloWorld: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "280c3rsZJJKnZ9RqbALVwtK", "HelloWorld");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    cc.Class({
      extends: cc.Component,
      properties: {
        label: {
          default: null,
          type: cc.Label
        },
        _canvas: {
          default: null,
          type: cc.Node
        },
        cocos: {
          default: null,
          type: cc.Node
        },
        fang: {
          default: null,
          type: cc.Node
        },
        text: "Hello, World!"
      },
      testLoadRes: function testLoadRes() {
        var that = this;
        cc.log("加载测试...");
        var anim = this.fang.getComponent(cc.Animation);
        anim.play("jump");
        cc.loader.loadRes("run", cc.AnimationClip, function(err, result) {
          cc.log("加载 AnimationClip creator动画");
          if (err) cc.log("err = " + err); else {
            cc.log("load AnimationClip = " + result + "," + (result instanceof cc.AnimationClip));
            result.wrapMode = cc.WrapMode.Loop;
            setTimeout(function() {
              anim.addClip(result);
              anim.play("run");
            }, 2e3);
          }
        });
        cc.loader.loadRes("button", cc.Prefab, function(err, result) {
          cc.log("加载 Prefab 预制资源");
          if (err) cc.log("err = " + err); else {
            cc.log("load Prefab = " + result);
            var newNode = cc.instantiate(result);
            cc.director.getScene().addChild(newNode);
          }
        });
        cc.loader.loadRes("testJs", cc._JavaScript, function(err, result) {
          cc.log("加载 _JavaScript 脚本 1");
          if (err) {
            cc.log("err = " + err);
            for (var i in err) cc.log("error[" + i + "]=" + err[i]);
          } else cc.log("load _JavaScript 1 = " + result + ",type=" + ("undefined" === typeof result ? "undefined" : _typeof(result)));
        });
        cc.loader.loadRes("testJs.jsx", cc.TextAsset, function(err, result) {
          cc.log("加载 TextAsset 文本资源,间接加载js脚本文件");
          if (err) cc.log("err = " + err); else {
            cc.log("load TextAsset JS = " + result);
            var TestJS = eval(result);
            cc.log("eval = " + TestJS);
            for (var i in TestJS) cc.log("TestJS." + i + "=" + TestJS[i]);
            cc.log("load jsx end");
            TestJS.log("Hello Test");
          }
        });
        cc.log("加载 TTFFont TTF 字体资源");
        cc.loader.loadRes("test1", cc.TextAsset, function(err, result) {
          cc.log("加载 TextAsset 文本资源");
          err ? cc.log("err = " + err) : cc.log("load TextAsset = " + result);
        });
        var realUrl = cc.url.raw("resources/weekcard.png");
        var texture = cc.textureCache.addImage(realUrl);
        cc.log("texture = " + (texture instanceof cc.Texture2D));
        cc.loader.loadRes("weekcard", cc.SpriteFrame, function(err, result) {
          cc.log("加载 SpriteFrame 精灵");
          if (err) cc.log("err = " + err); else {
            cc.log("load SpriteFrame = " + result);
            that.cocos.getComponent(cc.Sprite).spriteFrame = result;
          }
        });
        cc.log("加载 AudioClip 音频文件");
        cc.log("加载 BitmapFont 位图字体");
        cc.log("加载 Font 字体资源");
        cc.log("加载 LabelAtlas 艺术数字字体");
        cc.loader.loadRes("PlistBtn", cc.SpriteAtlas, function(err, result) {
          cc.log("加载 SpriteAtlas（图集），并且获取其中的一个 SpriteFrame");
          var frame = result.getSpriteFrame("btn_go");
          setTimeout(function() {
            that.cocos.getComponent(cc.Sprite).spriteFrame = frame;
          }, 1e3);
          var interval = 2;
          var repeat = 3;
          var delay = 10;
          var cnt = 0;
          that.schedule(function() {
            that.cocos.getComponent(cc.Sprite).spriteFrame = cnt % 2 === 0 ? result.getSpriteFrame("btn_get") : result.getSpriteFrame("btn_go");
            cnt++;
          }, 2);
        });
        cc.loader.loadRes("weekcard", cc.Texture2D, function(err, result) {
          cc.log("加载 Texture2D 单个图片");
          if (err) cc.log("err = " + err); else {
            cc.log("load Texture2D = " + result);
            cc.log("result instanceof cc.Texture2D=" + result instanceof cc.Texture2D);
          }
        });
        cc.log("load sync end");
      },
      testProtobuf: function testProtobuf() {
        if (cc.sys.isNative) {
          var wPath = jsb.fileUtils.getWritablePath();
          cc.log("wPath =" + wPath);
          cc.log("jsb.fileUtils=" + jsb.fileUtils);
          jsb.fileUtils.addSearchPath("res/raw-assets/resources", true);
        }
        var that = this;
        var filename1 = "test1.proto";
        var protobufHere = protobuf;
        protobufHere.load(filename1, function(err, root) {
          if (err) throw err;
          cc.log("root=" + JSON.stringify(root));
          for (var i in root) cc.log("root." + i + "=" + root[i]);
          cc.log("加载protobuf完毕，开始测试protobuf...");
          var cmd = root.lookupEnum("PbLobby.Cmd");
          cc.log("cmd = " + JSON.stringify(cmd));
          cc.log("CMD_KEEPALIVED_C2S = " + cmd.values.CMD_KEEPALIVED_C2S);
          var type1 = root.lookup("PbLobby.Cmd1");
          cc.log("type1 = " + type1);
          var type2 = root.lookup("PbLobby.Test1");
          cc.log("type2 = " + type2);
          var Test1Message = root.lookupType("PbLobby.Test1");
          cc.log("Test1Message = " + Test1Message);
          var payload = {
            id: 1,
            name: "hello protobuf"
          };
          cc.log("payload = " + JSON.stringify(payload));
          var message = Test1Message.create(payload);
          cc.log("message = " + JSON.stringify(message));
          var buffer = Test1Message.encode(message).finish();
          cc.log("buffer1 = " + buffer);
          cc.log("buffer2 = " + Array.prototype.toString.call(buffer));
          var decoded = Test1Message.decode(buffer);
          cc.log("decoded1 = " + decoded);
          cc.log("decoded2 = " + JSON.stringify(decoded));
          that.label.string = JSON.stringify(decoded);
          var object = Test1Message.toObject(decoded, {
            longs: String,
            enums: String,
            bytes: String
          });
          cc.log("object = " + JSON.stringify(object));
        });
      },
      onLoad: function onLoad() {
        this.label.string = "你好1";
        this.testProtobuf();
        return;
        var filename1;
        var filenameSprite;
        var sprite;
        var filename2;
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {} ],
  welcome: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2bae8oU3MlGHrjMDV/BalPk", "welcome");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        label: {
          default: null,
          type: cc.Label
        },
        button: {
          default: null,
          type: cc.Node
        },
        loadingBar: {
          default: null,
          type: cc.ProgressBar
        },
        manifestUrl: cc.RawAsset,
        _failCount: {
          default: 0
        },
        _assetManager: {
          default: null
        }
      },
      onLoad: function onLoad() {
        cc.log("onLoad test");
        var that = this;
        this.label.string = "检查版本";
        this.button.on(cc.Node.EventType.TOUCH_END, function() {
          that.showProgress();
          that._assetManager.update();
        }, this.button);
        cc.sys.dump();
        cc.game.setFrameRate(60);
        cc.director.setDisplayStats(true);
        this.checkUpdate();
      },
      start: function start() {},
      onDestroy: function onDestroy() {
        if (this.assetListener) {
          cc.eventManager.removeListener(this.assetListener);
          this.assetListener = null;
        }
        this._assetManager && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS && this._assetManager.release();
      },
      checkUpdate: function checkUpdate() {
        if (!cc.sys.isNative) {
          this.loadGame();
          return;
        }
        var that = this;
        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
        Log.i("storagePath is " + storagePath + ",this.manifestUrl=" + this.manifestUrl);
        this.versionCompareHandle = function(versionA, versionB) {
          cc.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
          var vA = versionA.split(".");
          var vB = versionB.split(".");
          for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) continue;
            return a - b;
          }
          return vB.length > vA.length ? -1 : 0;
        };
        this._assetManager = new jsb.AssetsManager(this.manifestUrl, storagePath, this.versionCompareHandle);
        cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS || this._assetManager.retain();
        this._assetManager.setVerifyCallback(function(path, asset) {
          var compressed = asset.compressed;
          var expectedMD5 = asset.md5;
          var relativePath = asset.path;
          var size = asset.size;
          if (compressed) {
            cc.log("Verification passed : " + relativePath);
            return true;
          }
          cc.log("Verification passed : " + relativePath + " (" + expectedMD5 + ")");
          return true;
        });
        true;
        this._assetManager.setMaxConcurrentTask(1);
        cc.log("Max concurrent tasks count have been limited to 2");
        if (this._assetManager.getLocalManifest().isLoaded()) {
          this.assetListener = new jsb.EventListenerAssetsManager(this._assetManager, function(event) {
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
              that.button.active = true;
              break;

             case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
              Log.i("SceneUpdateScene : ALREADY_UP_TO_DATE " + event.getMessage());
              that.loadGame();
              break;

             case jsb.EventAssetsManager.UPDATE_PROGRESSION:
              Log.i("SceneUpdateScene : UPDATE_PROGRESSION " + event.getPercent() + "," + event.getMessage());
              that.setProgress(event.getPercent());
              break;

             case jsb.EventAssetsManager.ASSET_UPDATED:
              Log.i("SceneUpdateScene : ASSET_UPDATED " + event.getAssetId() + "," + event.getMessage());
              break;

             case jsb.EventAssetsManager.ERROR_UPDATING:
              Log.e("SceneUpdateScene : ERROR_UPDATING " + event.getAssetId() + ", " + event.getMessage());
              break;

             case jsb.EventAssetsManager.UPDATE_FINISHED:
              Log.i("SceneUpdateScene : UPDATE_FINISHED " + event.getMessage());
              that.setProgress(100);
              that.loadGame(true);
              break;

             case jsb.EventAssetsManager.UPDATE_FAILED:
              Log.e("SceneUpdateScene : UPDATE_FAILED " + event.getMessage());
              that.failCount++;
              if (that.failCount < 1) that._assetManager.downloadFailedAssets(); else {
                Log.i("Reach maximum fail count, exit update process");
                that.failCount = 0;
                that.showUpdateError(jsb.EventAssetsManager.UPDATE_FAILED);
              }
              break;

             case jsb.EventAssetsManager.ERROR_DECOMPRESS:
              Log.e("SceneUpdateScene : ERROR_DECOMPRESS " + event.getMessage());
              that.showUpdateError(jsb.EventAssetsManager.ERROR_DECOMPRESS);
              break;

             default:
              Log.i("SceneUpdateScene : unknown Event" + event.getMessage());
              that.loadGame();
            }
          });
          cc.eventManager.addListener(this.assetListener, 1);
          this._assetManager.checkUpdate();
          Log.i("SceneUpdateScene 5");
        } else {
          Log.e("Fail to update assets, step skipped.");
          this.loadGame();
        }
      },
      showProgress: function showProgress() {
        this.loadingBar.setVisible(true);
      },
      setProgress: function setProgress(percent) {
        this.loadingBar && (this.loadingBar.progress = percent / 100);
      },
      showUpdateError: function showUpdateError(code) {
        cc.log("showUpdateError code=" + code);
        this.loadGame();
      },
      loadGame: function loadGame(needRestart) {
        if (needRestart) {
          cc.eventManager.removeListener(this._updateListener);
          this._updateListener = null;
          var searchPaths = jsb.fileUtils.getSearchPaths();
          var newPaths = this._assetManager.getLocalManifest().getSearchPaths();
          console.log(JSON.stringify(newPaths));
          Array.prototype.unshift(searchPaths, newPaths);
          cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(searchPaths));
          jsb.fileUtils.setSearchPaths(searchPaths);
          cc.audioEngine.stopAll();
          cc.game.restart();
        }
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "HelloWorld", "welcome" ]);
//# sourceMappingURL=project.dev.js.map