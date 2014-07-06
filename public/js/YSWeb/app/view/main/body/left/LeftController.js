'use strict';

Ext.define('YSWeb.view.main.body.left.LeftController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.left',


    init : function () {
        this.control({
            'app-bodyLeft #categoryPanel' : {
                itemexpand      : 'onExpand',
                afterlayout  : 'onLeftPanelRender'
            }
        });
    },

    onLeftPanelRender : function() {
        

        var treePanelView = this.view.down('#categoryPanel').getView();
        treePanelView.maxHeight = this.view.up('app-body').getHeight() - 120;

    },

    onExpand    : function() {
        
    }
});
