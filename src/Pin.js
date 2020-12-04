/**
 * Created by duydoan on 12/2/2020.
 */
var Pin = cc.Node.extend({
    ctor: function(title, pinSrc){
        this._super()

        this.attr({
            x: 500*Math.random(),
            y: 400*Math.random()
        })

        this.img = ccui.ImageView(pinSrc)
        this.img.attr({
            anchorX: 0.5,
            anchorY: 0,
            scale: 0.4
        })
        this.addChild(this.img)
        this.img.retain()

        this.lbl = ccui.Text(title, "Arial", 18)
        this.lbl.attr({
            x: 0,
            y: 30
        })
        this.lbl.enableOutline(cc.color(255, 255, 255), 20)
        this.lbl.setTextColor(cc.color(0, 0, 0))
        this.addChild(this.lbl)

        this.hide()
    },

    isShown: function(){
        return this.isVisible()
    },

    show: function(pos){
        this.setVisible(true)
        if (pos != null)
            this.setPosition(pos.x, pos.y)
    },

    hide: function(){
        this.setVisible(false)
    }
})