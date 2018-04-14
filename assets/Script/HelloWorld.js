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
        cc.log("加载 AnimationClip creator动画");
        cc.log("加载 Prefab 预制资源");

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
        cc.log("加载 SpriteAtlas（图集），并且获取其中的一个 SpriteFrame");
        // 注意 atlas 资源文件（plist）通常会和一个同名的图片文件（png）放在一个目录下, 所以需要在第二个参数指定资源类型
        cc.loader.loadRes("PlistBtn", cc.SpriteAtlas, function (err, result) {
            var frame = result.getSpriteFrame('btn_go');
            setTimeout(() => {
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

    // use this for initialization
    onLoad: function () {
        this.label.string = "你好1";//this.text;

        this.testLoadRes();
        return;

        cc.log("onLoad 1");
        var protobufHere = protobuf;//require("protobuf");

        var filename1 = "test1.proto";
        filename1 = "Data/test2.proto";
        // filename1 = "test3.proto";//下面两种都无法正常加载文件
        // filename1 = "Data/test4.proto";
        // filename1 = cc.url.raw(filename1);
        cc.log("cc.loader load 1 filename1=" + filename1);
        // 这里回去加载resources目录下的文件 : "resources/"+ filename1
        // 这里filename一般不用指定扩展名,当然你也可以强制指定
        cc.loader.loadRes(filename1, cc.TextAsset, function (error, result) {//指定加载文本资源
            // cc.log("loadRes error=" + error + ",result = " + result + ",type=" + typeof result);
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

        // protobufHere.load("PbLobby.proto", function (err, root) {//Data/PbLobby.proto
        //     if (err)
        //         throw err;
        //
        //     // Obtain a message type
        //     var AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");
        //
        //     // Exemplary payload
        //     var payload = {awesomeField: "AwesomeString"};
        //
        //     // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
        //     var errMsg = AwesomeMessage.verify(payload);
        //     if (errMsg)
        //         throw Error(errMsg);
        //
        //     // Create a new message
        //     var message = AwesomeMessage.create(payload); // or use .fromObject if conversion is necessary
        //
        //     // Encode a message to an Uint8Array (browser) or Buffer (node)
        //     var buffer = AwesomeMessage.encode(message).finish();
        //     // ... do something with buffer
        //
        //     // Decode an Uint8Array (browser) or Buffer (node) to a message
        //     var message = AwesomeMessage.decode(buffer);
        //     // ... do something with message
        //
        //     // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.
        //
        //     // Maybe convert the message back to a plain object
        //     var object = AwesomeMessage.toObject(message, {
        //         longs: String,
        //         enums: String,
        //         bytes: String,
        //         // see ConversionOptions
        //     });
        // });
        cc.log("onLoad 3");
    },

    // called every frame
    update: function (dt) {

    },
});
