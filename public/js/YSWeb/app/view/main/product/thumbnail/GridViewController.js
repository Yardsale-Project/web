'use strict';

Ext.define('YSWeb.view.main.product.thumbnail.GridViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-gridView',

    init : function () {
        this.control({
            'app-view-grid' : {
                beforerender  : 'onGridViewBeforeRender'
            }
        });
    },

    onGridViewBeforeRender : function() {
        
        var i, panel;

        for(i = 1; i <= 10; i++) {
            panel = {
                xtype   : 'app-view-grid-panel',
                columnWidth : .25,
                layout  : 'column',
                items   : [
                    {
                        xtype   : 'image',
                        src     : 'http://www.sencha.com/img/20110215-feat-html5.png',
                        //src     : YSCommon.config.Config.url + '/img/userPic/2014_03_15_admin2.jpg',
                        margin  : '20 0 10 13',
                        columnWidth : 1
                    }, {
                        xtype   : 'tbtext',
                        cls     : 'thumbnail-prod-name',
                        text    : 'Canon Digital Camera',
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

    }
});
