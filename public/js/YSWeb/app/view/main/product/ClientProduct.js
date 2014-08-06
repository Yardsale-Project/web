'use strict';

Ext.define('YSWeb.view.main.product.ClientProduct', {
	extend : 'Ext.form.Panel',
	xtype 	: 'app-clientproduct',
	cls 	: 'app-clientproduct',

	layout 	: 'column',

	viewModel: {
        type: 'product'
    },

    controller : 'clientproduct',
    width 	: 900,
    bodyPadding 	: 10,
    autoScroll : true,
    maxHeight 	: 750,

	items 	: [
		{
			xtype 	    : 'hiddenfield',
			name 	    : 'id',
			reference 	: 'id',
			value 	    : '0'
		}, {
			xtype       : 'label',
            columnWidth : 1,
            cls         : 'title',
            reference 	: 'title',
            text        : 'title product sdhfka jshdflaksjhdfk lsdy fekj fkjsdhf kfys yksejfha lsdjfh lku ekwjefhskljdf hsuefskjef ud kdj fe'
		}, {
			xtype 		: 'image',
			columnWidth : .5,
			style 		: 'border : 1px solid #CCC',
			reference	: 'imguserpicture',
			margin 		: '10 0 0 0',
			src 		: 'http://local.main.yardsale:8181/img/product/thumbnail/2014_08_01_101317_12_ghfds.jpg'
		}, {
			xtype 		: 'panel',
			border 		: false,
			frame 		: false,
			columnWidth : .5,
			margin 		: '10 0 0 10',
			layout 		: 'column',
			items 		: [
				{
					xtype 	: 'label',
					cls 	: 'thumb-price',
					columnWidth : 1,
					text 	: 'Php 165151',
					reference : 'thumbPrice'
				}, {
					xtype 	: 'hiddenfield',
					name 	: 'price',
					value 	: '165151',
					reference : 'price'
				}, {
					xtype 	: 'numberfield',
					fieldLabel 	: 'Qty',
					reference : 'quantity',
					hideTrigger : true,
					columnWidth : .25,
					labelWidth 	: 40,
					minValue 	: 1,
					msgTarget 	: 'side',
					value 		: 1,
					margin 		: '0 5 0 0'
				}, {
					xtype 		: 'label',
					columnWidth : .75,
					text 		: '3 item(s) left',
					margin 		: '4 0 0 0'
				},  {
						xtype 	: 'panel',
						border 	: false,
						frame 	: false,
						columnWidth : 1,
						margin 		: '20 0 0 0',
						items 	: [
							{
								xtype       : 'button',
					            iconCls     : 'ppButton',
					            cls 		: 'pp',
					            autoWidth   : true,
					            autoHeight  : true,
					            handler 	: 'onPPBtnClick'
							}
						]
				}, {
					xtype 		: 'panel',
					hidden 		: true,
					margin 		: '10 0 0 0',
					itemId 		: 'payNowBtn',
					columnWidth : 1,
					html		: '<form action="https://www.sandbox.paypal.com/webapps/adaptivepayment/flow/pay" id="paynowform" target="PPDGFrame" class="standard" onsubmit="return onSubmit()">' +
									'<input type="image" id="submitBtn" value="Pay with PayPal" src="https://www.paypalobjects.com/en_US/i/btn/btn_paynowCC_LG.gif">' +
									'<input id="type" type="hidden" name="expType" value="light">' +
									'<input id="paykey" type="hidden" name="paykey" value="insert_pay_key">' +
									'</form>' +
									'<script type="text/javascript" charset="utf-8">' +
									'var embeddedPPFlow = new PAYPAL.apps.DGFlow({trigger: "submitBtn"});' +
									'</script>'
				}, {
		            xtype       : 'app-widget-invite',
		            bind 		: {
		            	title 	: '{sendToFriends}'
		            },
		            columnWidth : 1,
		            margin 		: '80 0 0 0',
		            _type 		: 'send'
		        }
			] 
		}, {
			xtype 		: 'tabpanel',
			border 		: true,
			columnWidth : 1,
			items 		: [
				{
					title 	: 'Description',
					layout 	: 'fit',
					bodyPadding : 10,
					items 	: [
						{
							xtype 	: 'label',
							reference : 'description'
						}
					]
				}, {
					title 	: 'Payment Options'
				}
			]
		}
	],

	buttons 	: [
		{
			bind 	: {
				text 	: '{close}'
			},
			handler : 'onCloseBtnClick'
		}
	]
});