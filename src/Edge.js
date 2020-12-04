/**
 * Created by duydoan on 12/3/2020.
 */
var Edge = cc.Node.extend({
    points: [

    ],
    ctor: function(id, points){
        this._super()
        // _edge: "1:3", "4:2", ...
        this.id = id
        this.points = [
            new Point(points[0], gv.route.points[points[0]]),
            new Point(points[1], gv.route.points[points[1]])
        ]
    },
    show: function(color){
        this.removeChildByTag(Edge.TAG.EDGE)
        var edge = new cc.DrawNode()
        edge.setTag(Edge.TAG.EDGE)
        edge.drawSegment(
            cc.p(
                this.points[0].x,
                this.points[0].y
            ),
            cc.p(
                this.points[1].x,
                this.points[1].y
            ),
            Edge.EDGE_WIDTH,
            color
        )

        //edge.drawSegment(cc.p(50,50), cc.p(200,200),2)

        this.addChild(edge)
    },

    contain: function(position){
        var a ={
            x: position.x,
            y: position.y
        }
        var b = {
            x: this.points[0].x,
            y: this.points[0].y
        }
        var c = {
            x: this.points[1].x,
            y: this.points[1].y
        }
        var distance = gv.distancePoint2Line(
            a, b, c
        )
        return distance <= Edge.EDGE_WIDTH && gv.relativePosition(a, b, c) == 0
    },

    highlight: function(){
        this.show(Edge.HIGHLIGHT_COLOR)
        //this.setLocalZOrder(1000)
    },

    normalize: function(){
        this.show(Edge.NORMAL_COLOR)
    },

    get1stPoint: function(){
        return this.points[0]
    },

    get2ndPoint: function(){
        return this.points[1]
    }
})

Edge.EDGE_WIDTH = 17
Edge.NORMAL_COLOR = cc.color(128, 128, 128)
Edge.HIGHLIGHT_COLOR = cc.color(0, 138, 94)
Edge.TAG = {
    EDGE: 23423423423
}
