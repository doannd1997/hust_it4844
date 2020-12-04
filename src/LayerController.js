/**
 * Created by duydoan on 12/2/2020.
 */
var LayerController = cc.Layer.extend({
    ctor: function(){
        this._super();

        var json = ccs.load(res.layerController, res.CONTENT_PREFIX)
        var mainLayer = json.node
        ccui.helper.doLayout(mainLayer)
        mainLayer.setContentSize(cc.winSize)
        this.addChild(mainLayer)

        this.mainLayer = mainLayer
        this.mainLayer.retain()

        this.initNode()
    },

    initNode: function(){
        this.btnGo = this.mainLayer.getChildByName("btn_go")
        this.btnGo.addClickEventListener(function(){
            gv.layerMapsource.go()
        })

        this.btnStop = this.mainLayer.getChildByName("btn_stop")
        this.btnStop.addClickEventListener(function(){
            gv.layerMapsource.stop()
        })

        this.btnClear = this.mainLayer.getChildByName("btn_clear")
        this.btnClear.addClickEventListener(function(){
            gv.layerMapsource.clear()
        })

        this.btnToggleEdge = this.mainLayer.getChildByName("btn_toggle_edge")
        this.btnToggleEdge.addClickEventListener(function(){
            gv.layerMapsource.toggleEdges()
        })

        this.infoContainer = this.mainLayer.getChildByName("infoContainer")

        this.lbls = []
        for (var i=1; i<4; i++){
            var lbl = this.infoContainer.getChildByName("txt_" + i)
            this.lbls.push(lbl)
            lbl.retain()
        }

        this.setPanelInfo(0, "Nhóm số 4")
    },

    setPanelInfo: function(index, lbl){
        this.lbls[index].setString(lbl)
    }
})