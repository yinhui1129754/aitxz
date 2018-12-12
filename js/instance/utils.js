var utils = {};
utils.axisToNum = function(o,widthX,heightY){
    return o.y*widthX+o.x;
};
utils.numToAxis = function(num,widthX,heightY){
    return {
        x:num%widthX,
        y:parseInt(num/widthX)
    };
};
