//计时器对象
function tick(){
    /*
    * {
    *   call:f,
    *   inter:1000,
    *   nowInter:0,
    *   start:true,
    *   id:1
    * }
    * */
    var start = false;
    this.callArr = [];
    this.start = false;
    this.tickerInt = 0;
    Object.defineProperty(this,"start",{
        get:function(){
            return start;
        },
        set:function(v){
            start = v;
            if(v==true){
                this.loop.call(this);
            }else{
                this.cancel();
            }
        }
    });
}
tick.prototype = {
    constructor:tick,
    addFun:function(f,inter){
        var id = Date.now()+""+parseInt(Math.random()*100000);
        var o = {
            call:f,
            inter:(inter?inter:0),
            nowInter:0,
            start:true,
            id:id
        };
        this.callArr.push(o);
        return o;
    },
    removeFun:function(id){
        var int = -1;
        for(var i = 0;i<this.callArr.length;i++){
            if(id == this.callArr[i].id){
                int = i;
            }
        }
        if(int!=-1){

            this.callArr.splice(int,1);
        }
    },
    loop:function(){
        if(!this.start){
            this.cancel();
        }
        var i = 0;
        for(i=0;i<this.callArr.length;i++){
            if(this.callArr[i].start){
                if(this.callArr[i].nowInter>=this.callArr[i].inter){
                    this.callArr[i].nowInter=0;
                    this.callArr[i].call&&this.callArr[i].call.call(this,this.callArr[i]);
                }else{
                    this.callArr[i].nowInter+=16.666666666666668;
                }
            }

        }
        this.tickerInt = requestAnimationFrame(this.loop.bind(this));
        if(!this.start){
            this.cancel();
        }
    },
    cancel:function () {
        cancelAnimationFrame(this.tickerInt);
    }
};