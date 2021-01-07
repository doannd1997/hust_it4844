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
        this.schedule(this.update, 1/60)
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
        this.goStep(dt)
        this.focus()
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
        //gv.layerController.setPanelInfo(2, lbl)
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

    getSourcePoint: function(){
        return this.routeVectors[this.curVector].getSource()
    },

    getTargetPoint: function(){
        return this.routeVectors[this.curVector].getTarget()
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
                //x: this.x,
                //y: this.y
            },
            this.s,
            this.t
        )

        var distNear = Math.max(Edge.EDGE_WIDTH/2 - dist2Mid, 0)
        this.dx_dx_dy = distNear/Edge.EDGE_WIDTH
        if (Car.FUZZY_ENABLED){
            this.fuzzySubTurn(distNear)
        }
        else {
            this.normalSubTurn(distNear)
        }

        this.setDirection()
    },

    fuzzySubTurn: function(distNear){
        var radixTurn = this.getRadix()
        var turnRatio = caculateSteering(this.dx_dx_dy)
        gv.layerController.setPanelInfo(1, (this.dx_dx_dy).toFixed(2) + "/" + turnRatio.toFixed(2))
        var _delta = (0.5 - turnRatio)
        var delta = (Math.abs(_delta) < Car.IGNORE_THRESOLD) ? 0 : _delta
        delta = delta*radixTurn*0.3




        var s = this.getSourcePoint()
        var t = this.getTargetPoint()
        var isLeft = this.isLeft(
            {
                x: s._x,
                y: s._y
            },
            {
                x: t._x,
                y: t._y
            },
            {
                x: this.hoodX,
                y: this.hoodY
            }
        )

        this.angle += (!isLeft) ? -delta : delta
    },

    isLeft: function(a, b, c){
        return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0;
    },

    normalSubTurn: function(distNear){
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
    },

    goStep: function(dt){
        var velocityRatio = 1
        if (!this.isAtLastRoute()){
            var target = this.getTargetPoint()
            var lightStatus = gv.layerMapsource.getTrafficLight(target._id).getStatus()
            var dist2TL = gv.distancePoint2Point(this.getPosition(), {
                x: gv.route.points[target._id]._x,
                y: gv.route.points[target._id]._y
            })
            var ratio2Obstacle = this.getRatio2Object()
            var ratio2TF = this.getRatio2TL(dist2TL)
            velocityRatio = caculateSpeed(ratio2Obstacle, lightStatus, ratio2TF, this.dx_dx_dy)
            console.log("#2", ratio2Obstacle, velocityRatio)
        }
        this.x += dt*Car.VELOCITY*velocityRatio*Math.cos(this.angle)
        this.y += dt*Car.VELOCITY*velocityRatio*Math.sin(this.angle)
    },

    getRadix: function(){
        var radix = 1
        var source = this.getSourcePoint()
        var dist2TL = gv.distancePoint2Point(this.getPosition(), {
            x: gv.route.points[source._id]._x,
            y: gv.route.points[source._id]._y
        })
        if (dist2TL <= Car.DIST_2_TL_THRESOLD){
            radix = dist2TL/Car.DIST_2_TL_THRESOLD
        }
        return radix
    },


    step: function(){
        if (this.curVector < this.routeVectors.length-1)
            this.curVector ++
        var dist = gv.distancePoint2Point(
            {
                x: this.getSourcePoint()._x,
                y: this.getSourcePoint()._y
            },
            {
                x: this.getTargetPoint()._x,
                y: this.getTargetPoint()._y
            }
        )
        this.inEdgeWithObstacle = false
        if (dist >= Car.DIST_ROUTE_THRESOLD && !this.isAtLastRoute()){
            this.inEdgeWithObstacle = true
            this.routeVectors[this.curVector].addObstacle()
        }
    },

    getRatio2Object: function(){
        var s = this.getSourcePoint()
        var t = this.getTargetPoint()
        if (this.inEdgeWithObstacle && gv.layerMapsource.findEdgeWithST(s, t).isObstacleExist()){
            var obstacle = gv.layerMapsource.findEdgeWithST(s, t).getObstacle()

            var dist = gv.distancePoint2Point(obstacle.getPosition(), this.getPosition())
            if (dist <= Car.DIST_2_TL_THRESOLD){
                return dist/Car.DIST_2_TL_THRESOLD
            }
        }
        return 1
    },

    getRatio2TL: function(d2l){
        if (d2l <= Car.DIST_2_TL_THRESOLD){
            return d2l/Car.DIST_2_TL_THRESOLD
        }
        return 1
    },

    isAtLastRoute: function(){
        return this.curVector == this.routeVectors.length - 1
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
    },

    focus: function(){
        var rootScale = this.root.getFocusScale()
        var rX =  Car.FOCUS_X - rootScale*this.x
        var rY =  Car.FOCUS_Y - rootScale*this.y
        this.root.attr({
            x: rX,
            y: rY
        })
    }
})

Car.FUZZY_ENABLED = true
Car.VELOCITY = 30
Car.CAR_HEIGHT_ROOT = 745 // size of car picture
Car.TURN_ANGLE = {
    LEFT: Math.PI/20,
    EXTREME_LEFT: Math.PI/12,
    RIGHT: -Math.PI/20,
    EXTREME_RIGHT: -Math.PI/12
}
Car.IGNORE_THRESOLD = 0.08
Car.DIST_2_TL_THRESOLD = 40
Car.DIST_ROUTE_THRESOLD = 60
Car.FOCUS_X = cc.winSize.height/2
Car.FOCUS_Y = cc.winSize.height/2


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