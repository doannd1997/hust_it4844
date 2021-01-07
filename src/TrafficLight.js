const TrafficLight = cc.Node.extend({
    ctor: function(id, location){
        this._super()
        this.id = id
        this.location = location
        this.setPosition(location)

        this.indicator = cc.Sprite(res.trafficLight)
        this.indicator.attr({
            scale: 0.25,
            anchorX: 0.5,
            anchorY: 0.5,
            x: 0,
            y: 0
        })
        this.addChild(this.indicator)

        var lbl ="[" + id + "]"
        this.lbl = ccui.Text(lbl, "Arial", 16)
        this.lbl.setTextColor(cc.color(30, 30, 30))
        this.addChild(this.lbl)
        this.lbl.retain()

        this.initialize()
        this.update()
        this.schedule(this.update, 1)
    },
    initialize: function(){
        this.lightId = Math.floor(Math.random()*TF_PERIOD.length)
        this.period = Math.floor(Math.random()*TF_PERIOD[this.lightId].period)
    },
    update: function(){
        this.period -= 1
        if (this.period < 0){
            this.lightId = (this.lightId+1)%TF_PERIOD.length
            this.period = TF_PERIOD[this.lightId].period
        }
        var color = TF_PERIOD[this.lightId].color
        var period = TF_PERIOD[this.lightId].period
        this.indicator.setColor(color)
        this.lbl.setString((this.period) + "/" + (period))
    },
    getStatus: function(){
        var accumulate = 0
        var period = TF_PERIOD[this.lightId].period
        for (var i in TF_PERIOD){
            if (i != this.lightId){
                accumulate += TF_PERIOD[i].period
            }
            else {
                accumulate += period - this.period
                break
            }
        }
        var ratio = accumulate/TF_TOTAL_PERIOD
        return ratio

    }
})

const TF_PERIOD = [
    {
        // green
        color: cc.color(0, 255, 0, 255),
        period: 8
    },
    {
        // yellow
        color: cc.color(255, 255, 0, 255),
        period: 1
    },
    {
        // red
        color: cc.color(255, 0, 0, 255),
        period: 7
    },
]

const TF_TOTAL_PERIOD = TF_PERIOD.reduce(function(accumulator, currentValue){
        return accumulator + currentValue.period
    }, 0)
