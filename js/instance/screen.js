function screen(map,w,h,ctx,dom,endCall){
    this.stoge = []; //不能移动的砖头
    this.moveBg = []; //可以移动的背景
    this.endPoint = []; //终点
    this.box = []; //箱子
    this.posInfo = [];
    this.user = null;
    this.mapW = w;
    this.mapH = h;
    this.maxBox = new sprite(null,0,0,0,0);//场景最大容器
    this.bg = null;
    this.imgObj = {
        endImg:null,
        boxImg:null,
        bgImg:null,
        stogeImg:null,
        moveImg:null,
        userImg:null
    };
    this.map = map;
    this.ctx = ctx;
    this.dom = dom;
    this.paddingX = document.documentElement.clientWidth/10*30/75;
    this.paddingY = 0;
    this.verticalAlign = "middle";
    this.tkInfo = null;
    this.tk = null;
    this.gs = 0;
    this.endCall=endCall;
}
screen.prototype = {
    init:function(){
        this.initMap();
    },
    initMap:function(){
        this.resize();//初始化canvas的大小
        this.initBg();//初始化背景
        this.initSprite();//初始化地形

    },
    initBox:function(boxArr){
        var len = boxArr.length;
        var i;
        var box = null;
        var w = (this.dom.width-this.paddingX*2)/this.mapW;
        var posInfo = null;
        for(i = 0;i<len;i++){
            posInfo = this.posInfo[utils.axisToNum(boxArr[i],this.mapW,this.mapH)];
            box = new sprite(this.imgObj.boxImg,posInfo.x,posInfo.y,w,w);
            box.posInfo = posInfo;
            box.axisPos = boxArr[i];
            this.box.push(box);
            this.maxBox.addChild(box);
        }
    },
    initEnd:function(endArr){
        var len = endArr.length;
        var i;
        var box = null;
        var w = (this.dom.width-this.paddingX*2)/this.mapW;
        var posInfo = null;
        for(i = 0;i<len;i++){
            posInfo = this.posInfo[utils.axisToNum(endArr[i],this.mapW,this.mapH)];
            box = new sprite(this.imgObj.endImg,posInfo.x,posInfo.y,w,w);
            box.posInfo = posInfo;
            box.axisPos = endArr[i];
            this.endPoint.push(box);
            this.maxBox.addChild(box);
        }
    },
    initUser:function(userInfo){
        var posInfo = this.posInfo[utils.axisToNum(userInfo,this.mapW,this.mapH)];
        var w = (this.dom.width-this.paddingX*2)/this.mapW;
        this.user = new user(this.imgObj.userImg,posInfo.x,posInfo.y,w,w);
        this.maxBox.addChild(this.user.view);

        this.user.view.srcBlock = new block(0,0,this.imgObj.userImg.width,this.imgObj.userImg.height/4);
        this.user.posInfo = userInfo;
        this.user.screen = this;
    },
    initBg:function(){
        this.bg = new sprite(this.imgObj.bgImg,0,0,this.dom.width,this.dom.height);
        this.maxBox.addChild(this.bg);
    },
    resize:function(){
        var w = document.documentElement.clientWidth>640?640:document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
        this.dom.width = w;
        this.dom.height = h;
    },
    initSprite:function(){
        var x = this.paddingX;
        var y = this.paddingY;
        var w = (this.dom.width-x*2)/this.mapW;
        var spr = null;
        if(this.verticalAlign=="middle"){
            this.paddingY =this.dom.height/2 -  w*this.mapH/2 ;
        }
        for(var i = 0;i<this.map.length;i++){
            x=this.paddingX+w*(i%this.mapW);
            y =this.paddingY + w*parseInt(i/this.mapH);

            if(this.map[i] == 1){
                spr = new sprite(this.imgObj.stogeImg,x,y,w,w);
                this.stoge.push(spr);
                this.maxBox.addChild(spr);
            }else if(this.map[i] == 0){
                spr = new sprite(this.imgObj.moveImg,x,y,w,w);
                this.moveBg.push(spr);
                this.maxBox.addChild(spr);
            }
            this.posInfo.push({
                x:x,y:y
            });
        }
    },
    initImg:function(bgImg,stogeImg,moveImg,endImg,userImg,boxImg){
        this.imgObj.endImg = endImg;
        this.imgObj.boxImg = boxImg;
        this.imgObj.bgImg = bgImg;
        this.imgObj.stogeImg = stogeImg;
        this.imgObj.moveImg = moveImg;
        this.imgObj.userImg = userImg
    },
    dispose:function(){
        this.stoge = []; //不能移动的砖头
        this.moveBg = []; //可以移动的背景
        this.endPoint = []; //终点
        this.box = []; //箱子
        this.posInfo = [];
        if(this.tk){
            this.tk.removeFun(this.tkInfo.id);
        }
    },
    frame:function(){
        this.ctx.clearRect(0,0,this.width,this.height);
        this.maxBox.render(this.ctx);
        if(this.user&&this.user.timmer){
            this.user.frame.call(this.user);
        }
        var i ;
        var len = this.box.length;
        var q;
        var e = 0;
        for(i=0;i<len;i++){
            for(q=0;q<len;q++){
                if(this.box[i].axisPos.x==this.endPoint[q].axisPos.x&&this.endPoint[q].axisPos.y==this.box[i].axisPos.y){
                    e++;
                    break;
                }
            }
        }
        if(e == len&&e!=0){

            if(!data.map[this.gs+1]){
                if(!this.user.timmer){
                    this.dispose();
                    console.log("winner");
                    alert("我机器人推完毕啦");
                }
            }else{
                if(!this.user.timmer){
                    this.dispose();
                    this.endCall(this);
                }

            }

        }
    }
};