/**
 * author:375361172@qq.com
 * 游戏开发交流群:859055710
 * 开源地址:https://github.com/yinhui1129754/aitxz
 * */
//原始的构造函数 (构造~~)
function robot(screen){
    var THIS = this; // 当前的实例
    this.screen = screen; //场景对象
    this.pathArr = []; //想走的路径队列
    this.nowPath = []; //当前所走的路径
    this.boxPath = []; //箱子的路径
    this.nowIndex = 0; //当前的index
    this.tick = new tick(); //计时器
    this.tick.start = false; // 确认计时器是打开的
    this.tick.addFun(this.frame.bind(this)); //绑定每一帧的函数调用
    this.thinking = false;//机器人对象是否在思考。。。(其实就是找路);
    this.bufPoint = null;
    var start = false;
    Object.defineProperty(this,"start",{
        get:function(){
            return start;
        },
        set:function(v){
            start = v;
            this.tick.start = start;
        }
    });
}
;(function(){
    /**
     * 有结构化的构造对象 这里的构造方式只适合为了让人容易看懂对象的方法
     *
     * think 提供机器人的寻路方法
     * beHavior 提供机器人的推箱子方法
     * robot.prototype 提供机器人的扩展方法让机器人可以实现更多的行为
     * */
    //构造对象的思考方法
    var think = {
            //寻路
            findPath:function(endPoint,startPoint,bool){
                //核心函数
                var path = [];
                var openArr = [];
                var closeArr = [];
                var mapArr = this.screen.map;
                var xNum = this.screen.mapW;
                var yNum = this.screen.mapH;
                bool = bool||false;
                startPoint = startPoint||this.screen.user.posInfo;

                //点转化为数组的下标
                function pointToNum(point){
                    return xNum*point.y+point.x;
                }
                //获取当前寻路点的上面的点
                function getTop(point){
                    if(point.y <= 0){
                        return -1;
                    }
                    if(bool){
                        if(point.y+1>=yNum-1){
                            return -1;
                        }
                        if(mapArr[pointToNum({x:point.x,y:point.y+1})]!=0){
                            return -1;
                        }
                    }
                    return {x:point.x,y:point.y-1,val:point.x+"|"+(point.y-1),parent:point};
                }
                //获取当前寻路点的下面的点
                function getBottom(point){
                    if(point.y >=yNum-1){
                        return -1;
                    }
                    if(bool){
                        if(point.y-1<=0){
                            return -1;
                        }
                        if(mapArr[pointToNum({x:point.x,y:point.y-1})]!=0){
                            return -1;
                        }
                    }
                    return {x:point.x,y:point.y+1,val:point.x+"|"+(point.y+1),parent:point};
                }
                //获取当前寻路点的左面的点
                function getLeft(point){
                    if(point.x-1 <= 0){
                        return -1;
                    }
                    if(bool){
                        if(point.x+1 >=xNum-1){
                            return -1;
                        }
                        if(mapArr[pointToNum({x:point.x+1,y:point.y})]!=0){
                            return -1;
                        }
                    }
                    return {x:point.x-1,y:point.y,val:(point.x-1)+"|"+(point.y),parent:point};
                }
                //获取当前寻路点的右面的点
                function getRight(point){
                    if(point.x+1 >=xNum-1){
                        return -1;
                    }
                    if(bool){
                        if(point.x-1 <= 0){
                            return -1;
                        }
                        if(mapArr[pointToNum({x:point.x-1,y:point.y})]!=0){
                            return -1;
                        }
                    }
                    return {x:point.x+1,y:point.y,val:(point.x+1)+"|"+(point.y),parent:point};
                }
                //获取周围的点并将点分配到相应的数组里面 一个是open 一个是已经关闭的数组 close
                function getPointRound(point,obj){
                    var arr = [];
                    var o = {};
                    var p2 = getTop(point);
                    if(p2!=-1){
                        arr.push(p2);
                    }

                    p2 = getBottom(point);
                    if(p2!=-1){
                        arr.push(p2);
                    }
                    p2 = getLeft(point);
                    if(p2!=-1){
                        arr.push(p2);
                    }
                    p2 = getRight(point);
                    if(p2!=-1){
                        arr.push(p2);
                    }
                    fpArr(arr);
                    o.parent=obj;
                    return o;
                }
                //分配点 先判断点是不是在close里面没有在且我们点的值为0表示可以通行的那么就将点放入open数组里面
                function arrIndex(val){
                    for(var i = 0;i<closeArr.length;i++){
                        if(closeArr[i].x == val.x&&closeArr[i].y == val.y){return false}
                    }
                    return true;
                }
                function arrIndex2(val){
                    for(var i = 0;i<openArr.length;i++){
                        if(openArr[i].x == val.x&&openArr[i].y == val.y){return false}
                    }
                    return true;
                }
                function fpArr(arr){
                    for(var i=0;i<arr.length;i++){
                        if(arrIndex(arr[i])&&arrIndex2(arr[i])&&mapArr[pointToNum(arr[i])]==0){
                            openArr.push(arr[i]);
                        }else if(arrIndex(arr[i])){
                            closeArr.push(arr[i]);
                        }
                    }
                }
                //递归查询点 最终查询到终点 到达终点后我们通过我们的递归对象获取路径
                function gteDis(p1,p2){
                    return Math.sqrt(Math.abs(p1.x-p2.x)*Math.abs(p2.y-p1.y));
                }
                function getMinVal(arr){
                    var min = 0;
                    var int = 0;

                    for(var i = 0;i<arr.length;i++){
                        var val = gteDis(endPoint,arr[i]);
                        if(i==0){
                            min = val;
                            int = i;
                        }
                        if(val<min){
                            min = val;
                            int =i;
                        }
                    }
                    return int;
                }
                function open(){
                    var val = openArr.splice(getMinVal(openArr),1)[0];
                    getPointRound(val);
                    closeArr.push(val);
                    if(val.x==endPoint.x&&val.y==endPoint.y){
                        getPath(val);
                        return;
                    }
                    if(openArr.length){
                        open();
                    }
                }
                //过滤掉箱子点
                for(var i = 0;i<this.screen.box.length;i++){
                    closeArr.push(this.screen.box[i].axisPos);
                }
                openArr.push(startPoint);
                if(mapArr[pointToNum(endPoint)]!=0||(mapArr[pointToNum(endPoint)])){
                    return path;
                }
                open();
                //将获取到的路径信息转化为一个数组
                function getPath(val){
                    path.unshift(val);
                    if(val.parent){
                        getPath(val.parent);
                    }
                }
                return path;
            },
            //我想我还能思考一会儿
            getIndex:function(){

                for(var i = 0;i<this.screen.box.length;i++){
                    if(this.screen.box[i].axisPos.x ==this.screen.endPoint[i].axisPos.x&& this.screen.box[i].axisPos.y ==this.screen.endPoint[i].axisPos.y){

                    }else{
                        return this.nowIndex = i;
                    }
                }

            },
            findBoxEnd:function(){
                this.getIndex();
                if(this.nowIndex>this.screen.box.length-1){
                    return console.log("我机器人想可能已经推完毕啦吧");
                }
                this.boxPath = this.findPath(this.screen.endPoint[this.nowIndex].axisPos,this.screen.box[this.nowIndex].axisPos,true);
            },
            mePointToMsg:function(point){
                var posInfo = this.screen.box[this.nowIndex].axisPos;
                var box = this.screen.box[this.nowIndex].axisPos;
                oldLog(box);
                if(point.x === posInfo.x&&point.y === posInfo.y){
                    console.log("我是不会推箱子的");
                }else if(point.x===posInfo.x+1){
                    this.pushRight(box);
                }else if(point.x===posInfo.x-1){
                    this.pushLeft(box);
                }else if(point.y===posInfo.y+1){
                    this.pushBottom(box);
                }else if(point.y===posInfo.y-1){
                    this.pushTop(box);
                }else{
                    console.log("我是不会推箱子的，麻痹的");
                }
            },
            think:function(){
                // if(this.screen.user.timmer){
                //     this.thinking = false;
                //     return;
                // }
                if(this.screen&&this.screen.user&&!this.screen.user.timmer){
                    if(!this.boxPath.length&&!this.nowPath.length&&!this.pathArr.length){
                        this.findBoxEnd();
                    }else if(this.boxPath.length&&!this.nowPath.length&&!this.pathArr.length){
                        var start = this.boxPath.shift();
                        this.mePointToMsg(start);
                    }
                }
                this.thinking = false;


            }
        };
    //构造对象的推箱子行为
    var beHavior = {
        //如果可以推的话就向左推箱子
        pushLeft:function(box){
            if(this.screen.map[utils.axisToNum({x:box.x-1,y:box.y},this.screen.mapW,this.screen.mapH)] ===0){
                var endPoint = this.getEndPoint();
                if(!endPoint){
                    return;
                }
                var path  =this.findPath({x:box.x+1,y:box.y},endPoint);
                if(path.length){
                    this.pathArr.push(path);
                    this.pathArr.push([{x:box.x,y:box.y},{x:box.x-1,y:box.y}]);
                }else {
                    console.log("我机器人认为不能像左推箱子");
                }
            }else{
                console.log("我机器人认为不能像左推箱子");
            }
        },
        //向右推箱子
        getEndPoint:function(){
            var endPoint = this.pathArr.length?this.pathArr[this.pathArr.length-1]:this.nowPath.length?this.nowPath.length:[];
            if(endPoint.length){
                endPoint = endPoint[endPoint.length-1];
            }else{
                if(!this.screen.user.timmer){
                    endPoint = this.screen.user.posInfo;
                }else{
                    return console.log("我机器人还要思考一下~~");
                }
            }
            return endPoint;
        },
        pushRight:function(box){
            if(this.screen.map[utils.axisToNum({x:box.x+1,y:box.y},this.screen.mapW,this.screen.mapH)] ===0){
                var endPoint = this.getEndPoint();
                if(!endPoint){
                    return;
                }
                var path  =this.findPath({x:box.x-1,y:box.y},endPoint);
                if(path.length){
                    this.pathArr.push(path);
                    this.pathArr.push([{x:box.x,y:box.y},{x:box.x+1,y:box.y}]);
                }else {
                    console.log("我机器人认为不能像左推箱子");
                }
            }else{
                console.log("我机器人认为不能像左推箱子");
            }
        },
        //向上推箱子
        pushTop:function(box){
            if(this.screen.map[utils.axisToNum({x:box.x,y:box.y-1},this.screen.mapW,this.screen.mapH)] ===0){
                var endPoint = this.getEndPoint();
                if(!endPoint){
                    return;
                }
                var path  =this.findPath({x:box.x,y:box.y+1},endPoint);
                if(path.length){
                    this.pathArr.push(path);
                    this.pathArr.push([{x:box.x,y:box.y},{x:box.x,y:box.y-1}]);
                }else {
                    console.log("我机器人认为不能像上推箱子");
                }
            }else{
                console.log("我机器人认为不能像上推箱子");
            }
        },
        //向下推箱子
        pushBottom:function(box){
            if(this.screen.map[utils.axisToNum({x:box.x,y:box.y+1},this.screen.mapW,this.screen.mapH)] ===0){
                var endPoint = this.getEndPoint();
                if(!endPoint){
                    return;
                }
                var path  =this.findPath({x:box.x,y:box.y-1},endPoint);
                if(path.length){
                    this.pathArr.push(path);
                    this.pathArr.push([{x:box.x,y:box.y},{x:box.x,y:box.y+1}]);
                }else {
                    console.log("我机器人认为不能像上推箱子");
                }
            }else{
                console.log("我机器人认为不能像上推箱子");
            }
        },
        __proto__:think //继承思考这个行为
    };
    robot.prototype ={
        constructor:robot,
        //更新场景对象
        upDataScreen:function(screen){
            this.screen = screen;
            this.pathArr = []; //想走的路径队列
            this.nowPath = []; //当前所走的路径
            this.boxPath = []; //箱子的路径
            this.nowIndex = 0; //当前的index
        },
        //将点转化为用户对象的消息 让用户对象收到消息进行相对应的移动
        pointToMsg:function(point){
            var posInfo = this.bufPoint;
            if(!posInfo){
                this.bufPoint = point;
                return console.log("我竟然不知道这个点的信息~~");
            }
            if(point.x === posInfo.x&&point.y === posInfo.y){
                console.log("我机器人在原地踏步");
            }else if(point.x===posInfo.x+1){
                this.screen.user.sedMsg("moveRight");
            }else if(point.x===posInfo.x-1){
                this.screen.user.sedMsg("moveLeft");
            }else if(point.y===posInfo.y+1){
                this.screen.user.sedMsg("moveBottom");
            }else if(point.y===posInfo.y-1){
                this.screen.user.sedMsg("moveTop");
            }else{
                console.log("我机器人不知道怎么走了，麻痹的");
            }
            this.bufPoint = point;
        },
        //机器人每一帧所作的动作
        frame:function () {
            if(this.nowPath.length){
                this.thinking = false;
                var startPoint = this.nowPath.shift();
                this.pointToMsg(startPoint);
            }else if(this.pathArr.length){
                this.thinking = false;
                this.nowPath =  this.pathArr.shift();
                if(this.nowPath.length){
                    this.bufPoint = this.pathArr[0];
                }
            }else if(!this.thinking){
                this.thinking = true;
                this.think();
                console.log("我这个机器人要思考啦~~");
            }
        },
        __proto__:beHavior //继承推箱子，思考等行为
    };
})();
