'use strict';

Ext.define('YSWeb.view.main.product.thumbnail.GridView', {
	extend 	: 'Ext.view.View',
	xtype 	: 'app-view-grid',
    itemId  : 'app-view-grid',
	cls 	: 'app-view-grid',

    controller: 'gridView',

    requires : [
        'Ext.window.Toast'
    ],

    initComponent : function() {

        var viewGridControllerGridWidth = this. panelWidth;

        

        this.setWidth(viewGridControllerGridWidth);

        var numOfProductPanels  = parseInt(viewGridControllerGridWidth / 145);
        var offset = (viewGridControllerGridWidth - (numOfProductPanels * 145)) / ( numOfProductPanels + 1);
        var me  = this;

        YSDebug.log('init grid view controller offset', offset);

        this.tpl  = Ext.create('Ext.XTemplate',
            '<tpl for=".">',
                '<div class="product" style="margin: 5px 0 5px ' + parseInt(offset) + 'px !important">',
                    '<img width="133" height="100" src="' + YSCommon.config.Config.url + '/img/product/thumbnail/{image}" />',
                    '<br/><div class="thumbnail-prod-name">{productName}</div>',
                    '<br/><div class="thumb-price-panel">',
                        '<br/><div class="thumb-price">Php {currentPrice}</div>',
                    '</div>',
                    '<br/><a name="buyNow" class="x-btn x-unselectable  x-btn-default-small" style="margin-top: -5px; text-shadow: none !important; " hidefocus="on" unselectable="on" tabindex="0" >',
                        '<span  data-ref="btnWrap" role="presentation" unselectable="on" style="" class="x-btn-wrap x-btn-wrap-default-small ">',
                            '<span  data-ref="btnEl" role="presentation" unselectable="on" style="" class="x-btn-button x-btn-button-default-small x-btn-button-center  x-btn-text">',
                                '<span  data-ref="btnIconEl" role="presentation" unselectable="on" class="x-btn-icon-el x-btn-icon-el-default-small  " style=""></span>',
                                '<span  data-ref="btnInnerEl" role="presentation" unselectable="on" class="x-btn-inner x-btn-inner-default-small" style="font: 100 10px/14px helvetica,arial,verdana,sans-serif !important;">',
                                    'Buy Now',
                                '</span>',
                            '</span>',
                        '</span>',
                    '</a>',
                    '<a class="x-btn x-unselectable  x-btn-default-small" style="margin-top: -5px; margin-left:5px; text-shadow: none !important; " hidefocus="on" unselectable="on" tabindex="0" >',
                        '<span  data-ref="btnWrap" role="presentation" unselectable="on" style="" class="x-btn-wrap x-btn-wrap-default-small ">',
                            '<span  data-ref="btnEl" role="presentation" unselectable="on" style="" class="x-btn-button x-btn-button-default-small x-btn-button-center  x-btn-text">',
                                '<span  data-ref="btnIconEl" role="presentation" unselectable="on" class="x-btn-icon-el x-btn-icon-el-default-small  " style=""></span>',
                                '<span  data-ref="btnInnerEl" role="presentation" unselectable="on" class="x-btn-inner x-btn-inner-default-small" style="font: 100 10px/14px helvetica,arial,verdana,sans-serif !important;">',
                                    'Add to Cart',
                                '</span>',
                            '</span>',
                        '</span>',
                    '</a>',     
                '</div>',
            '</tpl>', {
                onBuyNow : function(id) {
                     Ext.toast('Id: ' + id);
                }
            }
        );

        this.superclass.initComponent.call(this);
    },

	store  : {
        type    : 'app-productStore'
    },
    
    id: 'phones',

    itemSelector: 'div.product',
    overItemCls : 'phone-hover',
    multiSelect : true,
    autoScroll  : true,

    listeners : {
        beforerender : function() {
            YSDebug.log('grid before view render');
        },
        itemclick : function( obj, record, item, index, e, eOpts ){
            YSDebug.log('click');
            var target = e.getTarget('[name]');
            YSDebug.log('target', target.name);

            if(target.hasOwnProperty('name')) {
                if(target.name == 'buyNow') {
                    YSDebug.log('record', record);
                    YSDebug.log('item', item);

                    this.sample();
                }
            }
            /*if(target.name == "addButton"){
                alert("doStuff");
            }*/
        }
    },

    sample : function() {
        //Ext.create('Ext.window.Toast', { title : 'Title'}).show();
        Ext.toast('sapmle');
    }
});