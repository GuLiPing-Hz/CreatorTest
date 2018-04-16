cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        _canvas: {//画布节点,在编辑器中隐藏
            default: null,
            type: cc.Node
        },
        cocos: {//这里赋值节点的时候会根据类型赋值，
            default: null,
            type: cc.Node//如果这里是cc.Sprite那么编辑器拖动的时候会自动查找对应类型的组件
        },
        fang: {
            default: null,
            type: cc.Node
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    /**
     * 测试cocos loadRes 只能加载单个资源
     *
     * 注意点:1 所有需要通过脚本动态加载的资源，都必须放置在 resources 文件夹或它的子文件夹下
     *       2 Creator相比之前的Cocos2d-html5，资源动态加载的时都是异步的，需要在回调函数中获得载入的资源
     */
    testLoadRes: function () {
        var that = this;
        //加载测试
        cc.log("加载测试...");

        //测试 Asset

        //测试播放动画
        var anim = this.fang.getComponent(cc.Animation);
        // 如果没有指定播放哪个动画，并且有设置 defaultClip 的话，则会播放 defaultClip 动画
        //anim.play();
        // 指定播放 test 动画
        //anim.play('move');
        // 指定从 1s 开始播放 test 动画
        //anim.play('move', 1);
        // 使用 play 接口播放一个动画时，如果还有其他的动画正在播放，则会先停止其他动画
        anim.play('jump');
        cc.loader.loadRes("run", cc.AnimationClip, function (err, result) {
            cc.log("加载 AnimationClip creator动画");
            if (err) {
                cc.log("err = " + err);
            } else {
                cc.log("load AnimationClip = " + result + "," + (result instanceof cc.AnimationClip));

                //result.name = "run";
                result.wrapMode = cc.WrapMode.Loop;
                setTimeout(function () {
                    anim.addClip(result);
                    anim.play('run');
                }, 2000);
            }
        });

        cc.loader.loadRes("button", cc.Prefab, function (err, result) {
            cc.log("加载 Prefab 预制资源");
            if (err) {
                cc.log("err = " + err);
            } else {
                cc.log("load Prefab = " + result);

                var newNode = cc.instantiate(result);
                cc.director.getScene().addChild(newNode);
            }
        });

        //使用cc.url.raw的时候必须是全路径加后缀名
        //热更新指导http://www.cocoachina.com/bbs/read.php?tid-459562.html

        //由于creator在打包工程的时候会把项目中的js打包成一个project.js文件，
        //所以我们压根不能单独动态加载指定js脚本文件,fuck
        cc.loader.loadRes("testJs", cc._JavaScript, function (err, result) {
            cc.log("加载 _JavaScript 脚本 1");
            if (err) {
                cc.log("err = " + err);
                for (var i in err) {
                    cc.log("error[" + i + "]=" + err[i]);
                }
            } else {
                cc.log("load _JavaScript 1 = " + result + ",type=" + typeof result);
            }
        });
        cc.loader.loadRes("testJs.jsx", cc.TextAsset, function (err, result) {
            cc.log("加载 TextAsset 文本资源,间接加载js脚本文件");
            if (err) {
                cc.log("err = " + err);
            } else {
                cc.log("load TextAsset JS = " + result);
                var TestJS = eval(result);
                cc.log("eval = " + TestJS);
                for (var i in TestJS) {
                    cc.log("TestJS." + i + "=" + TestJS[i]);
                }

                cc.log("load jsx end");
                TestJS.log("Hello Test");
                //TestJS.alert("Hello Test");//测试通过，哈哈
            }
        });
        // cc.loader.load(cc.url.raw("resources/testJs.jsx"),function(err,result){
        //     cc.log("加载 _JavaScript 脚本 2");
        //     if(err){
        //         cc.log("err = "+err);
        //         for (var i in err) {
        //             cc.log("error[" + i + "]=" + err[i]);
        //         }
        //     } else {
        //         cc.log("load _JavaScript 2 = "+result+",type="+typeof result);
        //     }
        // });
        cc.log("加载 TTFFont TTF 字体资源");

        cc.loader.loadRes("test1", cc.TextAsset, function (err, result) {
            cc.log("加载 TextAsset 文本资源");
            if (err) {
                cc.log("err = " + err);
            } else {
                cc.log("load TextAsset = " + result);
            }
        });
        // 加载 test assets 目录下所有资源
        // cc.loader.loadResDir("Data", function (err, results) {
        //     cc.log("加载 Data 目录所有资源");
        //     if(err){
        //         cc.log("err = "+err);
        //     } else {
        //         for(var i in results){
        //             cc.log("load Data dir ["+i+"]="+results[i]);
        //         }
        //     }
        // });

        //这里是预先加载
        // 改用 cc.url.raw，此时需要声明 resources 目录和文件后缀名
        var realUrl = cc.url.raw("resources/weekcard.png");//预先加载文理
        var texture = cc.textureCache.addImage(realUrl);
        cc.log("texture = " + (texture instanceof cc.Texture2D));

        cc.loader.loadRes("weekcard", cc.SpriteFrame, function (err, result) {
            cc.log("加载 SpriteFrame 精灵");
            if (err) {
                cc.log("err = " + err);
            } else {
                cc.log("load SpriteFrame = " + result);
                that.cocos.getComponent(cc.Sprite).spriteFrame = result;
            }
        });

        //RawAsset
        cc.log("加载 AudioClip 音频文件");
        cc.log("加载 BitmapFont 位图字体");
        cc.log("加载 Font 字体资源");
        cc.log("加载 LabelAtlas 艺术数字字体");

        // 注意 atlas 资源文件（plist）通常会和一个同名的图片文件（png）放在一个目录下, 所以需要在第二个参数指定资源类型
        cc.loader.loadRes("PlistBtn", cc.SpriteAtlas, function (err, result) {
            cc.log("加载 SpriteAtlas（图集），并且获取其中的一个 SpriteFrame");

            var frame = result.getSpriteFrame('btn_go');
            setTimeout(function () {
                that.cocos.getComponent(cc.Sprite).spriteFrame = frame;
            }, 1000);

            // 以秒为单位的时间间隔秒
            var interval = 2;
            // 重复次数
            var repeat = 3;
            // 开始延时秒
            var delay = 10;

            var cnt = 0;
            //两秒执行一次，一直执行
            that.schedule(function () {
                // 这里的 this 指向 component
                if (cnt % 2 === 0) {
                    that.cocos.getComponent(cc.Sprite).spriteFrame = result.getSpriteFrame('btn_get');
                } else {
                    that.cocos.getComponent(cc.Sprite).spriteFrame = result.getSpriteFrame('btn_go');
                }
                cnt++;
            }, 2);

            //下面这里指定次数和延迟时间
            // that.schedule(function () {
            //     if (cnt % 2 === 0) {
            //         that.cocos.getComponent(cc.Sprite).spriteFrame = result.getSpriteFrame('btn_get');
            //     } else {
            //         that.cocos.getComponent(cc.Sprite).spriteFrame = result.getSpriteFrame('btn_go');
            //     }
            //     cnt++;
            // }, interval, repeat, delay);
        });

        cc.loader.loadRes("weekcard", cc.Texture2D, function (err, result) {
            cc.log("加载 Texture2D 单个图片");
            if (err) {
                cc.log("err = " + err);
            } else {
                cc.log("load Texture2D = " + result);
                cc.log("result instanceof cc.Texture2D=" + result instanceof cc.Texture2D);
            }
        });
        cc.log("load sync end");

    },

    testProtobuf: function () {
        if (cc.sys.isNative) {//在native上加载失败，是因为没有找到目录，我们在testProtobuf函数里面添加一个搜索目录:
            var wPath = jsb.fileUtils.getWritablePath();
            cc.log("wPath =" + wPath);

            cc.log("jsb.fileUtils=" + jsb.fileUtils);
            //下面这段代码在PC window平台运行没问题，但是在android下面就出问题了
            //jsb.fileUtils.addSearchPath("res\\raw-assets\\resources", true);
            //需要改成这样：
            jsb.fileUtils.addSearchPath("res/raw-assets/resources", true);//坑太多了。。没办法


            // var content = jsb.fileUtils.getStringFromFile("test1.proto");
            // cc.log("content 1 =" + content);
            // return;
        }

        var that = this;
        var filename1 = "test1.proto";
        // cc.loader.loadRes(filename1, cc.TextAsset, function (error, result) {//指定加载文本资源
        //     cc.log("loadRes error=" + error + ",result = " + result + ",type=" + typeof result);
        //     // callback(null, result);
        // });

        var protobufHere = protobuf;//require("protobuf");//导入为插件，直接使用
        protobufHere.load(filename1, function (err, root) {//Data/PbLobby.proto
            if (err)
                throw err;

            cc.log("root=" + JSON.stringify(root));
            for (var i in root) {
                cc.log("root." + i + "=" + root[i]);
            }
            //return;

            cc.log("加载protobuf完毕，开始测试protobuf...");

            var cmd = root.lookupEnum("PbLobby.Cmd");
            cc.log("cmd = " + JSON.stringify(cmd));
            cc.log("CMD_KEEPALIVED_C2S = " + cmd.values.CMD_KEEPALIVED_C2S);

            //lookup 等价于 lookupTypeOrEnum 
            //不同的是 lookup找不到返回null,lookupTypeOrEnum找不到则是抛出异常
            var type1 = root.lookup("PbLobby.Cmd1");
            cc.log("type1 = " + type1);
            var type2 = root.lookup("PbLobby.Test1");
            cc.log("type2 = " + type2);

            // Obtain a message type
            var Test1Message = root.lookupType("PbLobby.Test1");
            cc.log("Test1Message = " + Test1Message);

            // Exemplary payload
            var payload = {id: 1, name: "hello protobuf"};
            //var payload = { ids: 1,name:"hello protobuf" };
            cc.log("payload = " + JSON.stringify(payload));

            //检查数据格式，测试了下发现没什么卵用
            // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
            // var errMsg = Test1Message.verify(payload);
            // if (errMsg){
            //     cc.log("errMsg = "+errMsg);
            //     throw Error(errMsg);
            // }

            //过滤掉一些message中的不存在的字段
            // Create a new message
            var message = Test1Message.create(payload); // or use .fromObject if conversion is necessary
            cc.log("message = " + JSON.stringify(message));

            // Encode a message to an Uint8Array (browser) or Buffer (node)
            var buffer = Test1Message.encode(message).finish();
            cc.log("buffer1 = " + buffer);
            cc.log("buffer2 = " + Array.prototype.toString.call(buffer));
            // ... do something with buffer

            // Decode an Uint8Array (browser) or Buffer (node) to a message
            var decoded = Test1Message.decode(buffer);
            cc.log("decoded1 = " + decoded);
            cc.log("decoded2 = " + JSON.stringify(decoded));
            // ... do something with message

            that.label.string = JSON.stringify(decoded);

            // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.

            //一般情况下，也不需要下面的转换
            // Maybe convert the message back to a plain object
            var object = Test1Message.toObject(decoded, {
                longs: String,
                enums: String,
                bytes: String,
                // see ConversionOptions
            });
            cc.log("object = " + JSON.stringify(object));
        });
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = "你好1";//this.text;

        // this.testLoadRes();
        //cc.log("onLoad 1");

        this.testProtobuf();
        return;


        var filename1 = "test1.proto";
        //filename1 = "Data/test2.proto";
        // filename1 = "test3.proto";//下面两种都无法正常加载文件
        // filename1 = "Data/test4.proto";
        // filename1 = cc.url.raw(filename1);
        cc.log("cc.loader load 1 filename1=" + filename1);
        // 这里回去加载resources目录下的文件 : "resources/"+ filename1
        // 这里filename一般不用指定扩展名,当然你也可以强制指定
        cc.loader.loadRes(filename1, cc.TextAsset, function (error, result) {//指定加载文本资源
            cc.log("loadRes error=" + error + ",result = " + result + ",type=" + typeof result);
            // callback(null, result);
        });
        // for (var i in this.cocos) {
        //     cc.log("[" + i + "]=" + this.cocos[i]);
        // }

        //单个精灵设置
        var filenameSprite = "resources/weekcard.png";//
        cc.log("this.cocos instanceof cc.Sprite = " + (this.cocos instanceof cc.Sprite));
        var sprite = this.cocos.getComponent(cc.Sprite);
        cc.log("sprite instanceof cc.Sprite = " + (sprite instanceof cc.Sprite));
        cc.log("sprite=" + sprite + ",type=" + typeof sprite + ",sprite instanceof cc.Sprite=" + (sprite instanceof cc.Sprite));
        // sprite.spriteFrame = filename1;//错误
        // cc.loader.loadRes(filenameSprite, cc.SpriteAtlas, function (error, result) {
        //     cc.log("sprite loadRes error=" + error + ",result = " + result + ",type=" + typeof result + "," + (result instanceof cc.TextAsset));
        //     sprite.spriteFrame = result
        // });
        filenameSprite = cc.url.raw(filenameSprite);
        cc.log("filenameSprite=" + filenameSprite + ",ccui=" + typeof ccui);
        // cc.loader.load(filenameSprite, function (error, result) {//用于加载网络图片
        //     cc.log("load error=" + error + ",result = " + result + ",type=" + typeof result + "," + (result instanceof cc.Texture2D));
        //     for (var i in error) {
        //         cc.log("error[" + i + "]=" + error[i]);
        //     }
        //     // for (var i in result) {
        //     //     cc.log("result[" + i + "]=" + result[i]);
        //     // }
        //     sprite.spriteFrame.setTexture(result, cc.rect(0, 0, 400, 400), true, cc.p(50, 50), cc.size(400, 400));
        //     sprite.setContentSize(cc.size(400, 400));
        // });
        //sprite.spriteFrame.setTexture(filenameSprite);
        //sprite.spriteFrame.ensureLoadTexture();

        /**
         * 精灵的操作
         */
        //动态修改某个精灵图片,该图片放在 assets/resources，该操作不会影响node节点本身的contentsize
        sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/weekcard.png"));
        // sprite.node.setContentSize(cc.size(400,200));
        this.cocos.setContentSize(cc.size(400, 200));

        //精灵图集

        // var newSprite = cc.loader.getRes(filenameSprite, cc.Asset);
        // cc.log("newSprite=" + newSprite + ",type=" + typeof newSprite + ",newSprite instanceof cc.Sprite=" + (newSprite instanceof cc.Sprite));
        // sprite.spriteFrame = newSprite;//cc.url.raw("resources/" + filenameSprite);//错误

        cc.log("onLoad 2");

        var filename2 = "resources/test1.proto";//在assets中新建resources目录，放在resources下面；调试发布均可用
        /**建议用下面这个方式存放*/
        filename2 = "resources/Data/test2.proto";//在上面的resources目录中再建一个Data目录，放入其中；调试发布均可用
        // filename2 = "test3.proto";//直接放在assets目录下面；调试可以，发布无用。。
        // filename2 = "Data/test4.proto";//在assets目录下新建Data目录，再放入；调试可以，发布无用。。
        /**
         * 这里是必须的一步，加载本地资源
         * @type {string}
         */
        filename2 = cc.url.raw(filename2);
        cc.log("cc.loader load 2 filename2=" + filename2);
        //这里会去加载一个url图片 : "Host"+filename2

        /**
         * web:
         * 使用cc.loader.load的时候
         *      1 如果只是传入文件名  那么是去加载 url文件 "Host"+filename2
         *          实际加载地址 : http://localhost:7456/test3.proto
         *
         *      2 如果cc.url.raw(文件名) 那么是去加载creator中asset中的目录文件，如果有相对目录，请一并带上
         *          实际加载地址 :
         *
         */
        cc.loader.load(filename2, function (error, result) {
            // cc.log("load error=" + error + ",result = " + result + ",type=" + typeof result);
            // for (var i in error) {
            //     cc.log("[" + i + "]=" + error[i]);
            // }
            // callback(null, result);
        });
        cc.log("cc.loader load 3");


        cc.log("onLoad 3");
    },

    // called every frame
    update: function (dt) {

    },
});
