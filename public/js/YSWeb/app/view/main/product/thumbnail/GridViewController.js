'use strict';

Ext.define('YSWeb.view.main.product.thumbnail.GridViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-gridView',

    init : function () {

        this.control({
            '#' : {
                beforerender    : function(){
                    console.log('before rendedin grid');
                },
                afterrender     : 'onGridViewAfterRender'
            }
        });

    },

    onGridViewAfterRender   : function() {
        
    },

    onGridViewBeforeRender : function() {

       /* var store = this.view.getStore();
        var viewGridControllerGridWidth = this.view.panelWidth;

        this.view.setWidth(viewGridControllerGridWidth);

        store.load();*/

        console.log('grid view render');

        /* var numOfProductPanels  = parseInt(viewGridControllerGridWidth / 145);
        var offset = (viewGridControllerGridWidth - (numOfProductPanels * 145)) / ( numOfProductPanels + 1);
        var me  = this;

        store.load(function(records) {
            console.log('records', records);
            Ext.each(records, function(record) {

                console.log('record', record);

                var id      = record.data.id,
                    image   = record.data.image,
                    prodName= record.data.productName,
                    cPrice  = record.data.currentPrice,
                    panel   = null;

                panel = {
                    xtype   : 'app-view-grid-panel',
                    layout  : 'column',
                    margin  : '0 0 0 ' + parseInt(offset) + ' !important',
                    _id     : id,
                    items   : [
                        {
                            xtype   : 'image',
                            //src     : 'http://www.sencha.com/img/20110215-feat-html5.png',
                            src     : YSCommon.config.Config.url + '/img/userPic/' + image,
                            margin  : '20 0 10 4',
                            columnWidth : 1
                        }, {
                            xtype   : 'tbtext',
                            cls     : 'thumbnail-prod-name',
                            text    : prodName,
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
                                    text    : cPrice
                                }
                            ],
                            columnWidth : 1
                        }
                    ]
                };
                me.getView().add(panel);
            });
        });

        console.log('grid view render');*/

    }
});
