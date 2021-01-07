/**
 * Created by duydoan on 12/2/2020.
 */
gv.scaleFit = function (sizeSource, sizeTarget){
    return 1
}

gv.distancePoint2Line = function(a, b, c){
    var da = gv.distancePoint2Point(b, c)
    var db = gv.distancePoint2Point(a, c)
    var dc = gv.distancePoint2Point(a, b)

    // half circumference
    var hc = (da+db+dc)/2

    return 2/da*Math.sqrt(hc*(hc-da)*(hc-db)*(hc-dc))
}

gv.distancePoint2Point = function(p0, p1){
    return Math.sqrt(Math.pow(p0.x-p1.x, 2) + Math.pow(p0.y-p1.y, 2))
}

gv.addAttr = function(target, source){
    var sk = Object.keys(source)
    for (var k in sk){
        target[sk[k]] = source[sk[k]]
    }
    return target
}

gv.objectValues = function(obj){
    var values = []
    var keys = Object.keys(obj)
    for (var k in keys){
        values[values.length] = obj[keys[k]]
    }
    return values
}


// return -1 if a out-side b; 0 if a between b&c; 1 if a out-size c
gv.relativePosition = function(a, b, c){
    var dAB = gv.distancePoint2Point(a, b)
    var dBC = gv.distancePoint2Point(b, c)
    var dCA = gv.distancePoint2Point(c, a)

    var hA2BC = gv.distancePoint2Line(a, b, c)
    var dProjectH2B = Math.sqrt(Math.pow(dAB, 2) - Math.pow(hA2BC, 2))
    var dProjectH2C = Math.sqrt(Math.pow(dCA, 2) - Math.pow(hA2BC, 2))

    if (dProjectH2B > dBC)
        return 1
    if (dProjectH2C > dBC)
        return -1
    return 0
}

gv.findMinWay = function(pIdSource, pIdTarget){
//get all solutions
    var solutions = solve(gv.graph, pIdSource);

    return {
        dist: solutions[pIdTarget].dist,
        trace: solutions[pIdTarget].concat([])
    }
    console.log("From '"+pIdSource+"' to");
//display solutions
//    for(var s in solutions) {
//        if(!solutions[s]) continue;
//        console.log(" -> " + pIdTarget + ": [" + solutions[pIdTarget].join(", ") + "]   (dist:" + solutions[pIdTarget].dist + ")");
    //}
}

function solve(graph, s) {
    var solutions = {};
    solutions[s] = [];
    solutions[s].dist = 0;

    while(true) {
        var parent = null;
        var nearest = null;
        var dist = Infinity;

        //for each existing solution
        for(var n in solutions) {
            if(!solutions[n])
                continue
            var ndist = solutions[n].dist;
            var adj = graph[n];
            //for each of its adjacent nodes...
            for(var a in adj) {
                //without a solution already...
                if(solutions[a])
                    continue;
                //choose nearest node with lowest *total* cost
                var d = adj[a] + ndist;
                if(d < dist) {
                    //reference parent
                    parent = solutions[n];
                    nearest = a;
                    dist = d;
                }
            }
        }

        //no more solutions
        if(dist === Infinity) {
            break;
        }

        //extend parent's solution path
        solutions[nearest] = parent.concat(nearest);
        //extend parent's cost
        solutions[nearest].dist = dist;
    }

    return solutions;
}
//create graph


gv.initGraph = function(){
    gv.graph = {};
    for(var id in gv.route.edges) {
        var pId0 = gv.route.edges[id].split(":")[0].toString()
        var pId1 = gv.route.edges[id].split(":")[1].toString()

        if(!gv.graph[pId0])
            gv.graph[pId0] = {};
        if(!gv.graph[pId1])
            gv.graph[pId1] = {};

        var p0 = gv.route.points[pId0]
        var p1 = gv.route.points[pId1]

        var dist = gv.distancePoint2Point(
            {
                x: p0._x,
                y: p0._y
            },
            {
                x: p1._x,
                y: p1._y
            }
        )

        gv.graph[pId0][pId1] = gv.graph[pId1][pId0] = dist
    }
}


gv.initGraph()