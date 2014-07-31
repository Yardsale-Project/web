'use strict';

Ext.define('YSWeb.view.main.product.thumbnail.GridViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.gridView',

    init : function () {

        this.control({
            '#' : {
                beforerender    : function(){
                    YSDebug.log('before rendedin grid');
                },
                afterrender     : 'onGridViewAfterRender'
            }
        });

    },

    onGridViewAfterRender   : function() {
        
    },

    onGridViewBeforeRender : function() {
    }
});
