//用户对象
function user(img,x,y,w,h){
    this.view = new sprite(img,x,y,w,h);
    this.msgDl = [];
    this.posInfo = null;
    this.screen = null;
    this.endObj = null;//移动对象
    this.timmer = false; // 是否启动动画帧
    this.speed = w/5; //移动速度
    this.promoteBox = null; // 推动的箱子
    this.promote  =false; // 是否处于推动
}
user.prototype={
    constructor:user,
    moveLeft:function(){
        this.view.srcBlock.y = 20;
        var posInfo = {
            x:this.posInfo.x-1<=0?0:this.posInfo.x-1,
            y:this.posInfo.y
        };
        var indexForMap =   utils.axisToNum(posInfo,this.screen.mapW,this.screen.mapH);
        var val = this.testInfo(posInfo);
        if(val.str === true){
            this.posInfo = posInfo;
            this.endObj = this.screen.posInfo[indexForMap];
            this.timmer = true;
        }else if(val.str == "box"){
            this.promoteBox = this.screen.box[val.boxIndex];
            var boxPosInfo = {
                x: this.promoteBox.axisPos.x-1<=0?0:this.promoteBox.axisPos.x-1,
                y:this.promoteBox.axisPos.y
            };
            this.boxInfo(val,posInfo,indexForMap,boxPosInfo);
        }else {
            if(this.msgDl.length){
                var val2 = this.msgDl.shift();
                this[val2]();
            }
        }
    },
    boxInfo:function(val,posInfo,indexForMap,boxPosInfo){
        var val2 = this.testInfo(boxPosInfo);
        var indexForMap2 = utils.axisToNum(boxPosInfo,this.screen.mapW,this.screen.mapH);
        if(val2.str == true){
            this.posInfo = posInfo;
            this.promoteBox.axisPos = boxPosInfo;
            this.endObj = this.screen.posInfo[indexForMap];
            this.promote = true;
            this.timmer = true;
            this.promoteBox.endObj = this.screen.posInfo[indexForMap2];
        }else {
            if(this.msgDl.length){
                var val3 = this.msgDl.shift();
                this[val3]();
            }
        }
    },
    testInfo:function(posInfo){
        var returnVal=1;
        var i;
        var indexForMap =   utils.axisToNum(posInfo,this.screen.mapW,this.screen.mapH);
        var indexForBox = 0;
        for( i =0;i<this.screen.box.length;i++){
            indexForBox = utils.axisToNum(this.screen.box[i].axisPos,this.screen.mapW,this.screen.mapH);
            if(indexForMap == indexForBox){
                return {str:"box",index:indexForMap,boxIndex:i};
            }
        }
        if(this.screen.map[indexForMap] == 1){
            return {str:"stoge"};
        }
        return {str:true};
    },
    moveX:function(){
        if(this.endObj.x >this.view.g_x){
            if(this.view.g_x+this.speed>=this.endObj.x){
                this.view.setX(this.endObj.x);
                if(this.promote){

                    this.promoteBox.setX(this.promoteBox.endObj.x);

                }
            }else{
                this.view.setX(this.view.g_x+this.speed);
                if(this.promote){
                    this.promoteBox.setX(this.promoteBox.g_x+this.speed);
                }
            }
        }else if(this.endObj.x<this.view.g_x){
            if(this.view.g_x-this.speed<=this.endObj.x){
                this.view.setX(this.endObj.x);
                if(this.promote){

                    this.promoteBox.setX(this.promoteBox.endObj.x);


                }
            }else{
                this.view.setX(this.view.g_x-this.speed);
            }
            if(this.promote){
                this.promoteBox.setX(this.promoteBox.g_x-this.speed);
            }
        }
    },
    moveY:function(){
        if(this.endObj.y >this.view.g_y){
            if(this.view.g_y+this.speed>=this.endObj.y){
                this.view.setY(this.endObj.y);
                if(this.promote){
                    this.promoteBox.setY(this.promoteBox.endObj.y);
                }

            }else{
                this.view.setY(this.view.g_y+this.speed);
                if(this.promote){
                    this.promoteBox.setY(this.promoteBox.g_y+this.speed);
                }
            }
        }else if(this.endObj.y<this.view.g_y){
            if(this.view.g_y-this.speed<=this.endObj.y){
                this.view.setY(this.endObj.y);
                if(this.promote){
                    this.promoteBox.setY(this.promoteBox.endObj.y);
                }

            }else{
                this.view.setY(this.view.g_y-this.speed);
                if(this.promote){
                    this.promoteBox.setY(this.promoteBox.g_y-this.speed);
                }
            }
        }
    },
    frame:function(){
        if(!this.endObj){
            return;
        }
        this.moveX();
        this.moveY();
        if(this.endObj.x == this.view.g_x&&this.endObj.y == this.view.g_y){
            this.timmer = false;
            if(this.promote){
                this.promoteBox.setY(this.promoteBox.endObj.y);
                this.promoteBox.setX(this.promoteBox.endObj.x);
                this.promoteBox.posInfo = this.promoteBox.endObj;
                this.promote = false;
            }
            if(this.msgDl.length){
                var val = this.msgDl.shift();
                this[val]();
            }
        }
    },

    moveRight:function(){
        this.view.srcBlock.y = 40;
        var posInfo = {
            x:this.posInfo.x+1>=this.screen.mapW-1?this.screen.mapW-1:this.posInfo.x+1,
            y:this.posInfo.y
        };
        var indexForMap =   utils.axisToNum(posInfo,this.screen.mapW,this.screen.mapH);
        var val = this.testInfo(posInfo);
        if(val.str === true){
            this.posInfo = posInfo;
            this.endObj = this.screen.posInfo[indexForMap];
            this.timmer = true;
        }else if(val.str == "box"){
            this.promoteBox = this.screen.box[val.boxIndex];
            var boxPosInfo = {
                x: this.promoteBox.axisPos.x+1>=this.screen.mapW-1?this.screen.mapW-1:this.promoteBox.axisPos.x+1,
                y:this.promoteBox.axisPos.y
            };
            this.boxInfo(val,posInfo,indexForMap,boxPosInfo);
        }else {
            if(this.msgDl.length){
                var val2 = this.msgDl.shift();
                this[val2]();
            }
        }
    },
    moveTop:function(){
        this.view.srcBlock.y = 60;
        var posInfo = {
            y:this.posInfo.y-1<=0?0:this.posInfo.y-1,
            x:this.posInfo.x
        };
        var indexForMap =   utils.axisToNum(posInfo,this.screen.mapW,this.screen.mapH);
        var val = this.testInfo(posInfo);
        if(val.str === true){
            this.posInfo = posInfo;
            this.endObj = this.screen.posInfo[indexForMap];
            this.timmer = true;
        }else if(val.str == "box"){
            this.promoteBox = this.screen.box[val.boxIndex];
            var boxPosInfo = {
                y: this.promoteBox.axisPos.y-1<=0?0:this.promoteBox.axisPos.y-1,
                x:this.promoteBox.axisPos.x
            };
            this.boxInfo(val,posInfo,indexForMap,boxPosInfo);
        }else {
            if(this.msgDl.length){
                var val2 = this.msgDl.shift();
                this[val2]();
            }
        }
    },
    moveBottom:function(){
        this.view.srcBlock.y = 0;
        var posInfo = {
            y:this.posInfo.y+1>=this.screen.mapH-1?this.screen.mapH-1:this.posInfo.y+1,
            x:this.posInfo.x
        };
        var indexForMap =   utils.axisToNum(posInfo,this.screen.mapW,this.screen.mapH);
        var val = this.testInfo(posInfo);
        if(val.str === true){
            this.posInfo = posInfo;
            this.endObj = this.screen.posInfo[indexForMap];
            this.timmer = true;
        }else if(val.str == "box"){
            this.promoteBox = this.screen.box[val.boxIndex];
            var boxPosInfo = {
                y: this.promoteBox.axisPos.y+1>=this.screen.mapH-1?this.screen.mapH-1:this.promoteBox.axisPos.y+1,
                x:this.promoteBox.axisPos.x
            };
            this.boxInfo(val,posInfo,indexForMap,boxPosInfo);
        }else {
            if(this.msgDl.length){
                var val2 = this.msgDl.shift();
                this[val2]();
            }
        }
    },
    sedMsg:function(msg){
        this.msgDl.push(msg);
        if(!this.timmer){
            var val = this.msgDl.shift();
            this[val]();
        }
    }
};