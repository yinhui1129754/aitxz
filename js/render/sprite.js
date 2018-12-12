//块对象
function block(x,y,width,height){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
}
//精灵对象
function sprite(img,x,y,w,h){
    block.call(this,x,y,w,h);
    this.img = img;
    this.g_x = 0;
    this.g_y = 0;
    this.children = [];
    this.parent = null;
    this.initX();
    this.initY();
    this.srcBlock = null;
}
sprite.prototype = {
    constructor:sprite,
    render:function(ctx){
        if(this.img){
            if(this.srcBlock){
                ctx.drawImage(this.img,this.srcBlock.x,this.srcBlock.y,this.srcBlock.width,this.srcBlock.height,this.g_x,this.g_y,this.width,this.height);
            }else{
                ctx.drawImage(this.img,0,0,this.img.width,this.img.height,this.g_x,this.g_y,this.width,this.height);
            }

        }
        if(this.children.length){
            for(var i = 0;i<this.children.length;i++){
                this.children[i].render(ctx);
            }
        }
    },
    setX:function(val){
        this.g_x = val;
        if(this.children.length){
            for(var i = 0;i<this.children.length;i++){
                this.children[i].initX();
            }
        }
    },
    setY:function(val){
        this.g_y = val;
        if(this.children.length){
            for(var i = 0;i<this.children.length;i++){
                this.children[i].initY();
            }
        }
    },
    initX:function(){
        if(this.parent){
            this.g_x = this.parent.g_x + this.x;
        }
    },
    initY:function(){
        if(this.parent){
            this.g_y = this.parent.g_y + this.y;
        }
    },
    addChild:function(sp){
        sp.parent = this;
        sp.initX();
        sp.initY();
        this.children.push(sp);
    }
};