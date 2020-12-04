/**
 * Created by duydoan on 12/4/2020.
 */
var Car = cc.Node.extend({
    angle: Math.PI/2,
    curVector: -1,

    sPos: {},
    tPos: {},
    // position of car's hood - mui xe
    hoodX: null,
    hoodY: null,
    s: {},    // position of vector source
    t: {},    // position of vector target

    ctor: function(root, sPos, tPos){
        this._super()
        this.root = root
        this.setPosition(sPos)
        this.sPos = sPos
        this.tPos = tPos
    },

    prepare: function(){
        this.car = new cc.Sprite(res.carIcon)
        this.car.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 0.04
        })
        this.addChild(this.car)
        this.car.retain()
    },

    go: function(){
        //this.stop()
        this.setInitAngle()
        this.scheduleUpdate()
    },

    stop: function(){
        this.unscheduleUpdate()
    },

    update: function(dt){
        var finished = this.reachedFinishPoint()
        if (finished) {
            this.root.stop()
        }
        this.checkNextVector()
        this.displayDeltaAngle()
        this.turn()
        this.x += dt*Car.VELOCITY*Math.cos(this.angle)
        this.y += dt*Car.VELOCITY*Math.sin(this.angle)
    },

    setInitAngle: function(){
        this.angle = this.routeVectors[this.curVector].getAngle() + Math.PI/2
    },

    setDirection: function(){
        this.setRotation((270-this.angle*180/Math.PI)%360+180)
    },
    turnLeft: function(){
        this.angle += Car.TURN_ANGLE.LEFT
    },
    turnExtremeLeft: function(){
        this.angle += Car.TURN_ANGLE.EXTREME_LEFT
    },
    turnRight: function(){
        this.angle += Car.TURN_ANGLE.RIGHT
    },
    turnExtremeRight: function(){
        this.angle += Car.TURN_ANGLE.EXTREME_RIGHT
    },

    drawVector: function(routePoint){
        console.log("#", routePoint.toString())
        this.routeVectors = []
        for (var v=0; v<routePoint.length-2; v++){
            var s = gv.route.points[routePoint[v]]
            var t = gv.route.points[routePoint[v+1]]
            this.routeVectors.push(new RouteVector(v, s, t))
        }

        var s = gv.route.points[routePoint[routePoint.length-2]]
        var t = {
            _x: this.tPos.x,
            _y: this.tPos.y
        }
        this.routeVectors.push(new RouteVector(v+1, s, t))

        this.curVector = 0
    },

    displayDeltaAngle: function(){
        var vectorAngle = this.routeVectors[this.curVector].getAngle()
        this.deltaAngle = this.angle - this.routeVectors[this.curVector].getAngle()
        // normalize deltaAngle
        this.deltaAngle = this.deltaAngle%(2*Math.PI)
        if (this.deltaAngle > Math.PI)
            this.deltaAngle -= 2*Math.PI

        var lbl = (this.angle * 180/Math.PI).toFixed(2)
            + " : " + (vectorAngle * 180/Math.PI).toFixed(2)
            + " = " + (this.deltaAngle * 180/Math.PI).toFixed(2)
        gv.layerController.setPanelInfo(2, lbl)
    },

    // cur position relevant to current route vector (between or over)
    getRelative: function(){
        var s = this.routeVectors[this.curVector].getSource()
        this.s = {
            x: s._x,
            y: s._y
        }
        var t = this.routeVectors[this.curVector].getTarget()
        this.t = {
            x: t._x,
            y: t._y
        }

        return gv.relativePosition(this.getPosition(), this.s, this.t)
    },

    checkNextVector: function(){
        var over = this.getRelative() == 1
        if (over){
            this.step()
        }
    },

    turn: function(){
        this.hoodX = this.x + Car.CAR_HEIGHT_ROOT * this.car.getScale() * Math.cos(this.angle)
        this.hoodY = this.y + Car.CAR_HEIGHT_ROOT * this.car.getScale() * Math.sin(this.angle)

        var dist2Mid = gv.distancePoint2Line(
            {
                x: this.hoodX,
                y: this.hoodY
            },
            this.s,
            this.t
        )

        var distNear = Math.max(Edge.EDGE_WIDTH - dist2Mid, 0)
        var ratio = this.getRatio(distNear, Edge.EDGE_WIDTH)
        switch (true){
            case this.deltaAngle >= 0:
                switch (ratio){
                    case Car.DIST_TYPE.HIGH:
                        this.turnRight()
                        break
                    case Car.DIST_TYPE.EXTREME_HIGH:
                        this.turnExtremeRight()
                        break
                }
                break
            case this.deltaAngle < 0:
                switch (ratio){
                    case Car.DIST_TYPE.HIGH:
                        this.turnLeft()
                        break
                    case Car.DIST_TYPE.EXTREME_HIGH:
                        this.turnExtremeLeft()
                        break
                }
                break
        }

        this.setDirection()
    },

    step: function(){
        if (this.curVector < this.routeVectors.length-1)
            this.curVector ++
    },

    reachedFinishPoint: function(){
        if (this.curVector != this.routeVectors.length-1)
            return false
        return this.getRelative() == 1
    },

    getRatio: function(dS, dL){
        var ratio = dS/dL
        if (ratio <= Car.DIST_VALUE.EXTREME_HIGH)
            return Car.DIST_TYPE.EXTREME_HIGH
        if (ratio <= Car.DIST_VALUE.HIGH)
            return Car.DIST_TYPE.HIGH
        return Car.DIST_TYPE.NONE
    }
})

Car.VELOCITY = 30
Car.CAR_HEIGHT_ROOT = 745 // size of car picture
Car.TURN_ANGLE = {
    LEFT: Math.PI/20,
    EXTREME_LEFT: Math.PI/12,
    RIGHT: -Math.PI/20,
    EXTREME_RIGHT: -Math.PI/12
}


// deltaX/(deltaX + deltaY)
Car.DIST_VALUE = {
    HIGH: 0.25,
    EXTREME_HIGH: 0.15
}
Car.DIST_TYPE = {
    NONE: 0,
    HIGH: 1,
    EXTREME_HIGH: 2
}