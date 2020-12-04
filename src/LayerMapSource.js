/**
 * Created by duydoan on 12/2/2020.
 */
var LayerMapSource = cc.Layer.extend({
    points: [],
    edges: [],
    eS: -1,       // edge start
    eF: -1,       // edge finish


    ctor: function(){
        this._super()

        this.bg = ccui.ImageView(res.map_source)
        this.bg.attr({
            x: this.bg.width/2,
            y: this.bg.height/2,
            scale: gv.scaleFit(this.bg, cc.winSize)
        })
        this.addChild(this.bg)
        this.bg.retain()

        this.initPin()
        this.addEventTouch()

        this.display()
    },
    initPin: function(){
        this.pinStart = new PinStart()
        this.addChild(this.pinStart)
        this.pinStart.retain()

        this.pinFinish = new PinFinish()
        this.addChild(this.pinFinish)
        this.pinFinish.retain()
    },
    addEventTouch: function(){
        var self = this
        var touchEvent = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event){
                var target = event.getCurrentTarget();

                //Get the position of the current point relative to the button
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                //Check the click area
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    //cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                    return true;
                }
            },
            onTouchMoved: function(event){
                return true
            },
            onTouchEnded: function(touch, event){
                //var target = event.getCurrentTarget();
                console.log("#", touch.getLocationX(), ":", touch.getLocationY())
                self.handleTouch(touch.getLocation())
                //self.handleTouchPoint(touch.getLocation())
            }
        });
        cc.eventManager.addListener(touchEvent, this.bg)
    },

    drawPoint: function(id, location){
        //var lbl = id + "\n" + location.x.toFixed(2) + "\n" + location.y.toFixed(2)
        var lbl ="[" + id + "]"
        var p = ccui.Text(lbl, "Arial", 10)
        p.setTextColor(cc.color(0, 0, 0))
        p.setPosition(location)
        p._id = this.points.length
        p._x = location.x.toFixed(2)
        p._y = location.y.toFixed(2)
        this.bg.addChild(p)
        p.retain()
        this.points.push(p)
    },

    drawEdge: function(_id, _edge){
        this.bg.addChild(_edge)
        _edge.normalize()
        this.edges.push(_edge)
    },

    handleTouch: function(location){
        // touch to set start-finish point
        if (this.pinFinish.isShown()){
            this.pinStart.show(this.pinFinish.getPosition())
        }
        if (this.pinStart.isShown())
            this.pinFinish.show(location)
        else
            this.pinStart.show(location)
    },


    display: function(){
        this.clear()
        this.displayEdges()
        this.displayPoint()
    },

    displayPoint: function(){
        for (var p in gv.route.points){
            var id = gv.route.points[p]._id
            var x = Number(gv.route.points[p]._x)
            var y = Number(gv.route.points[p]._y)
            this.drawPoint(id, {
                x: x,
                y: y
            })
        }
    },

    displayEdges: function(){
        for (var e in gv.route.edges){
            var points = [
                Number(gv.route.edges[e].split(':')[0]),
                Number(gv.route.edges[e].split(':')[1]),
            ]

            var edge = new Edge(e, points)
            edge.retain()
            this.drawEdge(e, edge)
        }
    },

    go: function(){
        // go
        console.log("GO!")

        this.highlightEdge()
        this.findWay()
        this.drive()
    },

    stop: function(){
        // stop
        console.log("STOP!")
        if (cc.sys.isObjectValid(this.car)){
            this.car.removeFromParent()
            delete  this.car
        }

    },

    clear: function(){
        // clear all points, edges, pins
        console.log("CLEAR!")
        this.pinStart.hide()
        this.pinFinish.hide()

        this.clearPoints()
        this.clearEdges()
    },

    clearPoints: function(){
        for (var p in this.points){
            this.points[p].removeFromParent()
        }
        this.points = []
    },

    clearEdges: function(){
        for (var e in this.edges){
            this.edges[e].removeFromParent()
        }
        this.edges = []
    },

    toggleEdges: function(){
        if (this.edges.length > 0)
            this.clear()
        else
            this.display()
    },

    highlightEdge: function(){
        var eS = -1
        var eF = -1
        for (var e in this.edges){
            var edge = this.edges[e]
            if (this.pinStart.isShown() && edge.contain(this.pinStart.getPosition())){
                eS = e
            }
            if (this.pinFinish.isShown() && edge.contain(this.pinFinish.getPosition())){
                eF = e
            }
        }

        //for (var e in this.edges){
        //    if (e == eS || e == eF)
        //        this.edges[e].highlight()
        //    else
        //        this.edges[e].normalize()
        //}

        if (eS != -1)
            this.eS = this.edges[eS]
        if (eF != -1)
            this.eF = this.edges[eF]
    },

    findWay: function(){
        if (!cc.sys.isObjectValid(this.eS) || !cc.sys.isObjectValid(this.eF)){
            console.log("#", "no start-finish")
            return
        }
        //
        var startP0 = this.eS.get1stPoint()
        var startP1 = this.eS.get2ndPoint()
        var finishP0 = this.eF.get1stPoint()
        var finishP1 = this.eF.get2ndPoint()

        var distS0_F0 = gv.findMinWay(startP0.getId(), finishP0.getId())
        var distS0_F1 = gv.findMinWay(startP0.getId(), finishP1.getId())
        var distS1_F0 = gv.findMinWay(startP1.getId(), finishP0.getId())
        var distS1_F1 = gv.findMinWay(startP1.getId(), finishP1.getId())

        var distS_S0 = gv.distancePoint2Point(
            {
                x: this.pinStart.getPositionX(),
                y: this.pinStart.getPositionY()
            },
            {
                x: startP0.getX(),
                y: startP0.getY()
            }
        )
        var distS_S1 = gv.distancePoint2Point(
            {
                x: this.pinStart.getPositionX(),
                y: this.pinStart.getPositionY()
            },
            {
                x: startP1.getX(),
                y: startP1.getY()
            }
        )
        var distF_F0 = gv.distancePoint2Point(
            {
                x: this.pinFinish.getPositionX(),
                y: this.pinFinish.getPositionY()
            },
            {
                x: finishP0.getX(),
                y: finishP0.getY()
            }
        )
        var distF_F1 = gv.distancePoint2Point(
            {
                x: this.pinFinish.getPositionX(),
                y: this.pinFinish.getPositionY()
            },
            {
                x: finishP1.getX(),
                y: finishP1.getY()
            }
        )

        var dist = Number.MAX_VALUE
        var trace = []

        var total_0_0 = distS0_F0.dist + distS_S0 + distF_F0
        var total_0_1 = distS0_F1.dist + distS_S0 + distF_F1
        var total_1_0 = distS1_F0.dist + distS_S1 + distF_F0
        var total_1_1 = distS1_F1.dist + distS_S1 + distF_F1

        if (dist > total_0_0){
            dist = total_0_0
            trace = [startP1.getId(), startP0.getId()].concat(distS0_F0.trace)
        }
        if (dist > total_0_1){
            dist = total_0_1
            trace = [startP1.getId(), startP0.getId()].concat(distS0_F1.trace)
        }
        if (dist > total_1_0){
            dist = total_1_0
            trace = [startP0.getId(), startP1.getId()].concat(distS1_F0.trace)
        }
        if (dist > total_1_1){
            trace = [startP0.getId(), startP1.getId()].concat(distS1_F1.trace)
        }

        if (trace[trace.length-1] == finishP0.getId())
            trace = trace.concat([finishP1.getId()])
        else
            trace = trace.concat([finishP0.getId()])
        this.trace = trace
    },

    drive: function(){
        var tmp = this.trace.slice()
        tmp[0] = "Start"
        tmp[tmp.length-1] = "Finish"
        gv.layerController.setPanelInfo(1, tmp.toString())
        if (!cc.sys.isObjectValid(this.car)){
            this.car = new Car(this, this.pinStart.getPosition(), this.pinFinish.getPosition())
            this.car.prepare()
            this.bg.addChild(this.car)
            this.car.retain()
            this.car.drawVector(this.trace)
            this.car.go()
        }
    }

})