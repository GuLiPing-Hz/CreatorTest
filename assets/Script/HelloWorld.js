cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        sprite: {
            default: null,
            type: cc.Sprite
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = "你好1";//this.text;

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
        // for (var i in this.sprite) {
        //     cc.log("[" + i + "]=" + this.sprite[i]);
        // }

        //单个精灵设置
        var filenameSprite = "resources/weekcard.png";//直接加载出错
        var sprite = this.sprite.getComponent(cc.Sprite);
        cc.log("sprite=" + sprite + ",type=" + typeof sprite + ",sprite instanceof cc.Sprite=" + (sprite instanceof cc.Sprite));
        // sprite.spriteFrame = filename1;//错误
        // cc.loader.loadRes(filenameSprite, cc.SpriteAtlas, function (error, result) {
        //     cc.log("sprite loadRes error=" + error + ",result = " + result + ",type=" + typeof result + "," + (result instanceof cc.TextAsset));
        //     sprite.spriteFrame = result
        // });
        filenameSprite = cc.url.raw(filenameSprite);
        cc.log("filenameSprite=" + filenameSprite + ",ccui=" + typeof ccui);
        cc.loader.load(filenameSprite, function (error, result) {
            cc.log("load error=" + error + ",result = " + result + ",type=" + typeof result + "," + (result instanceof cc.Texture2D));
            for (var i in error) {
                cc.log("error[" + i + "]=" + error[i]);
            }
            // for (var i in result) {
            //     cc.log("result[" + i + "]=" + result[i]);
            // }
            sprite.spriteFrame.setTexture(result, cc.rect(0, 0, 400, 400), true, cc.p(50, 50), cc.size(400, 400));
            sprite.setContentSize(cc.size(400, 400));
        });
        // sprite.spriteFrame.setTexture(filenameSprite);
        // sprite.spriteFrame.ensureLoadTexture();

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
