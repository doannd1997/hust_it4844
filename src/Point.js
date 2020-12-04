/**
 * Created by duydoan on 12/3/2020.
 */
var Point = cc.Class.extend({
    ctor: function(id, _rawPoint){
        this.id = id
        this.x = Number(_rawPoint._x)
        this.y = Number(_rawPoint._y)
    },
    getId: function(){
        return this.id
    },
    getX: function(){
        return this.x
    },
    getY: function(){
        return this.y
    }
})