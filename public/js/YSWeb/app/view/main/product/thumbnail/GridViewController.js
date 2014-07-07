'use strict';

Ext.define('YSWeb.view.main.product.thumbnail.GridViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-gridView',

    init : function () {
        this.control({
            'app-view-grid' : {
                beforerender    : 'onGridViewBeforeRender',
                afterrender     : 'onGridViewAfterRender'
            }
        });

        this.layoutCount = 0;
    },

    onGridViewAfterRender   : function() {
        console.log('After render');

        var viewGridControllerGridWidth = this.view.panelWidth;
        var numOfProductPanels  = parseInt(viewGridControllerGridWidth / 145);
        var offset = (viewGridControllerGridWidth - (numOfProductPanels * 145)) / ( numOfProductPanels + 1);

        console.log('offset', parseInt(offset));
        
        var i, panel;


        for(i = 1; i <= 20; i++) {
            panel = {
                xtype   : 'app-view-grid-panel',
                layout  : 'column',
                margin  : '0 0 0 ' + parseInt(offset) + ' !important',
                items   : [
                    {
                        xtype   : 'image',
                        src     : 'http://www.sencha.com/img/20110215-feat-html5.png',
                        //src     : YSCommon.config.Config.url + '/img/userPic/2014_03_15_admin2.jpg',
                        margin  : '20 0 10 4',
                        columnWidth : 1
                    }, {
                        xtype   : 'tbtext',
                        cls     : 'thumbnail-prod-name',
                        text    : 'Canon Digital Camera ' + i,
                        columnWidth : 1
                    }, {
                        xtype   : 'panel',
                        border  : true,
                        cls     : 'thumb-price-panel',
                        bodyPadding : 10,
                        items   : [
                            {
                                xtype   : 'tbtext',
                                cls     : 'thumb-price',
                                text    : 'Php 16,000.00'
                            }
                        ],
                        columnWidth : 1
                    }
                ]
            };
            this.getView().add(panel);
        }
        console.log('grid view render');
    },

    onGridViewBeforeRender : function() {

        

    }
});
