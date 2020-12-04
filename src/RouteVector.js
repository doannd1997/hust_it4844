/**
 * Created by duydoan on 12/4/2020.
 */
var RouteVector = cc.Class.extend({
    ctor: function(id, s, t){
        this.id = id

        // {_x: 1, _y: 2}
        this.s = s
        this.t = t

        var dX = t._x - s._x
        var dY = t._y - s._y
        this.angle = Math.acos((dX*1+dY*0)/(Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2))*1))
        if (dY < 0)
            this.angle = 2*Math.PI - this.angle
    },

    getAngle: function(){
        return this.angle
    },

    getSource: function(){
        return this.s
    },

    getTarget: function(){
        return this.t
    }
})