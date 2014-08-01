'use strict';

Ext.define('YSWeb.view.main.product.thumbnail.ListView', {
	extend 	: 'Ext.grid.Panel',

	xtype 	: 'app-view-list',

	store 	: {
		type 	: 'app-productStore'
	},

	controller: 'app-listView',

	width 	: 200,
	height 	: '100%',

	hideHeaders : true,

	columns: [
        { 
        	text: 'Image',  
        	dataIndex: 'image',
        	width 	: 150,
        	renderer : function(value) {
        		var src = YSCommon.config.Config.url + '/img/product/thumbnail/' + value;
        		return '<img src="' + src + '" height="100px"/>';
        	}
        }, { 
        	text: 'Details', 
        	xtype: 'templatecolumn', 
        	flex: 1 , 
        	tpl : '<div class="thumbnail-prod-name">{productName}</div><br/><div class="thumb-price">{currentPrice}</div>'
        }
    ]
});