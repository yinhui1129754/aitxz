;(function(){
    //utils



    //屏幕对象

    function initGs(index,tk){
        var i = index||0;
        screenEx = new screen(data.map[i],data.mapInfo[i].w,data.mapInfo[i].h,document.getElementById("canvas").getContext("2d"),document.getElementById("canvas"),
            function(){
                screenEx=initGs(screenEx.gs+1,tk);
                robotEx.upDataScreen(screenEx);
            });
        window.test =screenEx;
        var sourceEx = new source();
        screenEx.tkInfo = tk.addFun(screenEx.frame.bind(screenEx));
        screenEx.tk = tk;
        screenEx.gs = i;
        sourceEx.load(data.source[i],function(arr){
            screenEx.initImg(arr[0],arr[1],arr[2],arr[3],arr[4],arr[5]);
            screenEx.init();
            screenEx.initBox(data.box[i]);
            screenEx.initEnd(data.end[i]);
            screenEx.initUser(data.user[i]);

        });
        return screenEx;
    }
    var tk = new tick();
    tk.start = true;
    var screenEx = null;

    screenEx=initGs(0,tk);
    var robotEx  = new robot(screenEx);
    if("ontouchend" in document){
        document.getElementById("clickRobot").addEventListener("touchend",function(){
            robotEx.start=!robotEx.start;
            if(!robotEx.start){
                this.innerHTML = "点击启动机器人"
            }else{
                this.innerHTML = "点击关闭机器人"
            }
        });
    }else{
        document.getElementById("clickRobot").addEventListener("click",function(){
            robotEx.start=!robotEx.start;
            if(!robotEx.start){
                this.innerHTML = "点击启动机器人"
            }else{
                this.innerHTML = "点击关闭机器人"
            }
        });
    }

    window.onkeydown = function(e){
       // console.log(e.keyCode);
        switch (e.keyCode){
            case 37:{
                screenEx.user.sedMsg("moveLeft");
                break;
            }
            case 38:{
                screenEx.user.sedMsg("moveTop");
                break;
            }
            case 39:{
                screenEx.user.sedMsg("moveRight");
                break;
            }
            case 40:{
                screenEx.user.sedMsg("moveBottom");
                break;
            }
        }
    }
    // 开始按下手机的起点坐标
    var startPoint = null;
    document.addEventListener("touchstart",function(e){
        e = e||window.event;
        e.preventDefault();
        e.stopPropagation();
        startPoint = e.touches[0];
    }, { passive: false });

    document.addEventListener("touchend",function(e){
        e=e||window.event;
        e.stopPropagation();
        e.preventDefault();
        //e.changedTouches能找到离开手机的手指，返回的是一个数组
        var endPoint = e.changedTouches[0];
        //计算终点与起点的差值
        var x = endPoint.clientX - startPoint.clientX;
        var y = endPoint.clientY - startPoint.clientY;
        //设置滑动距离的参考值
        var d = 30;
        if(Math.abs(x)>d){
            if(x>0){
                screenEx.user.sedMsg("moveRight");
            }else{
                screenEx.user.sedMsg("moveLeft");
            }
        }
        if(Math.abs(y)>d){
            if(y>0){
                screenEx.user.sedMsg("moveBottom");
            }else{
                screenEx.user.sedMsg("moveTop");
            }
        }

    }, { passive: false })
})();