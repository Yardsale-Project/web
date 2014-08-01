'use strict';

Ext.define('YSWeb.view.main.product.Product', {
	extend : 'Ext.form.Panel',
	xtype 	: 'app-product',

	layout 	: 'column',

	viewModel: {
        type: 'product'
    },

    controller : 'product',

    width 	: 800,
    bodyPadding 	: 10,
    autoScroll : true,

	items 	: [
		{
			xtype 	: 'hiddenfield',
			name 	: 'id',
			value 	: '0'
		}, {
			xtype 	: 'textfield',
			bind 	: {
				fieldLabel : '{name}'
			},
			columnWidth : 1,
			labelWidth 	: 150,
			margin 		: '10 0 0 0',
			allowBlank 	: false,
			msgTarget 	: 'side',
			name 		: 'name'
		}, {
			xtype 	: 'textareafield',
			bind 	: {
				fieldLabel  : '{short_desc}'
			},
			columnWidth : 1,
			labelWidth 	: 150,
			margin 		: '10 0 0 0',
			allowBlank 	: false,
			msgTarget 	: 'side',
			name 		: 'short_desc'
		}, {
			xtype 	: 'textareafield',
			bind 	: {
				fieldLabel 	: '{description}'
			},
			columnWidth : 1,
			labelWidth 	: 150,
			height 		: 150,
			margin 		: '10 0 0 0',
			allowBlank 	: false,
			msgTarget 	: 'side',
			name 		: 'description'
		}, {
            xtype 		: 'filefield',
            emptyText 	: 'Select an image',
            bind 		: {
            	fieldLabel: '{fileFieldLabel}'
            },
            name 		: 'photopath',
            reference 	: 'photopath',
            buttonText 	: 'Upload',
            columnWidth : 1,
            labelWidth  : 150,
            margin 		: '10 0 0 0',
            listeners 	: {
            	change 	: 'onFileFieldChange'
            },
            allowBlank : false,
            msgTarget : 'side'
        }, {
        	xtype 		: 'panel',
        	border 		: false,
        	frame 		: false,
        	columnWidth : 1,
        	layout 		: 'hbox',
        	margin 		: '10 0 0 0',
        	items 		: [
        		{
		        	xtype 		: 'label',
		        	text 		: '',
		        	width 		: 155
		        }, {
					xtype 		: 'image',
					width 		: 235,
					height 		: 220,
					style 		: 'border : 1px solid #CCC',
					reference	: 'imguserpicture',
					//src 		: 'http://www.sencha.com/img/20110215-feat-html5.png'
				}
        	]
        }, {
            xtype   : 'app-treepicker',
            cls     : 'app-treepicker',
            text    : 'category',
            store   : Ext.create('YSCommon.store.CategoryTree'),
            displayField: 'text',
            rootVisible : false,
            emptyText: '--All Categories--',
            margin 		: '10 0 0 0',
            bind 		: {
            	fieldLabel: '{category}'
            },
            columnWidth : 1,
            labelWidth  : 150,
            allowBlank 	: false,
			msgTarget 	: 'side',
			name 		: 'category'
        }, {
        	xtype 	: 'numberfield',
        	columnWidth : 1,
        	name 	: 'stock',
        	bind 	: {
        		fieldLabel : '{stock}'
        	},
        	minValue: 1,
        	hideTrigger: true,
        	allowBlank : false,
        	labelWidth 	: 150,
			margin 		: '10 0 0 0',
			msgTarget 	: 'side'
        }, {
        	xtype 	: 'numberfield',
        	columnWidth : 1,
        	name 	: 'weight',
        	bind 	: {
        		fieldLabel : '{weight}'
        	},
        	minValue: '0.00',
        	hideTrigger: true,
        	allowBlank : true,
        	labelWidth 	: 150,
			margin 		: '10 0 0 0',
			msgTarget 	: 'side'
        }, {
        	xtype 	: 'numberfield',
        	columnWidth : 1,
        	name 	: 'min_price',
        	bind 	: {
        		fieldLabel : '{minPrice}'
        	},
        	minValue: '0.00',
        	hideTrigger: true,
        	allowBlank : false,
        	labelWidth 	: 150,
			margin 		: '10 0 0 0',
			msgTarget 	: 'side'
        }, {
        	xtype 	: 'numberfield',
        	columnWidth : 1,
        	name 	: 'sell_price',
        	bind 	: {
        		fieldLabel : '{sellPrice}'
        	},
        	minValue: '0.00',
        	hideTrigger: true,
        	allowBlank : false,
        	labelWidth 	: 150,
			margin 		: '10 0 0 0',
			msgTarget 	: 'side'
        }
	],

	buttons 	: [
		{
			bind 	: {
				text 	: '{save}'
			},
			handler : 'onSaveBtnClick'
		}, {
			bind 	: {
				text 	: '{reset}'
			},
			handler : 'onResetBtnClick'
		}
	]
});