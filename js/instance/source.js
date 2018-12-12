//资源对象
function source(){
    this.sourceArr = [];
    this.nameArr = [];
}
source.prototype = {
    constructor:source,
    getSource:function(str,f,err){
        var index = this.nameArr.indexOf(str);
        if(index == -1){
            var img = new Image();
            var THIS = this;
            img.src = str;
            if(img.complete){
                THIS.sourceArr.push(img);
                THIS.nameArr.push(str);
                f&&f(img,THIS);
            }else{
                img.onload = function(){
                    THIS.sourceArr.push(img);
                    THIS.nameArr.push(str);
                    f&&f(img,THIS);
                };
            }

            img.onerror = function(){
                err&&err(THIS);
            };
        }else{
            f&&f(this.sourceArr[index],this);
        }

    },
    load:function(arr,f,err){
        var int = 0;
        var nowSource = [];
        var THIS = this;
        for(var i=0;i<arr.length;i++){
            (function(bufI){
                THIS.getSource(arr[i],function(img){
                    int++;
                    nowSource[bufI] = img;
                    if(int == arr.length){
                        f&&f(nowSource,THIS)
                    }
                },function(){
                    console.log("load error!!");
                });
            })(i);
        }
    }
};
