(function(){
	var me, origUsername, finalUsername;
	var businessPartnerStoreUrl = 'application/BusinessPartner/getBusinessPartnersByType',
		salesReturnStoreUrl = 'application/SalesReturn',
		salesReturnItemsStoreUrl = 'application/SalesReturnItem/getSalesItemsByDocId',
		submit_url = 'application/user/saveUser',
		deleteUrl = 'application/user/deleteUser',
		reportSalesReturnUrl = 'application/SalesReturn/printSalesReturn',
		docId;


	var businessPartnerStoreFields = [
		'code', 'BPName'
	];

	var salesReturnStoreFields = [
		'id', 'docId', 'customerCode', 'customerName',
		'postingDate', 'remarks1', 'remarks2', 
		'totalPrcntDscnt', 'totalAmtDscnt',
		'netTotal', 'grossTotal'
	];

	var salesReturnItemStoreFields = [
		'docId','indx','itemCode','description','vatable',
        'saleUoM','qtyPrSaleUoM','netPrchsPrc','grossPrchsPrc',
        'realBsNetSalePrc', 'realBsGrossSalePrc', 'qty',
        'prcntDscnt', 'amtDscnt', 'netSalePrc', 'grossSalePrc',
        'rowNetTotal', 'rowGrossTotal'
	];

	var businessPartnerStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-businessPartnerStore',
		proxy	: proxy(businessPartnerStoreUrl, { type : '1'}),
		autoLoad: true ,
	    fields: businessPartnerStoreFields
	});

	var salesReturnStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-salesReturnStore',
		proxy	: proxy(salesReturnStoreUrl, {}),
		autoLoad: true ,
	    fields: salesReturnStoreFields
	});

	var salesReturnItemsStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-salesReturnItemsStore',
		proxy	: proxy(salesReturnItemsStoreUrl, {}),
		autoLoad: false ,
	    fields: salesReturnItemStoreFields
	});

	function getCurrentDate()
	{
		var date = new Date();
		var day = date.getDate();
		var year = date.getFullYear();
		var month = date.getMonth() + 1

		return year + '-' + month + '-' + day;
	}

	function populateFields(data)
	{
		docId = data.docId;

		Ext.getCmp('txt-salesReturnId-salesReturn').setValue(data.docId);
		Ext.getCmp('txt-postingDate-salesReturn').setValue(data.postingDate);
		Ext.getCmp('cbo-customerCode-salesReturn').setValue(data.customerCode);
		Ext.getCmp('cbo-customerName-salesReturn').setValue(data.customerName);
		Ext.getCmp('txtarea-remarks1-salesReturn').setValue(data.remarks1);
		Ext.getCmp('txtarea-remarks2-salesReturn').setValue(data.remarks2);
		Ext.getCmp('txt-totalDscntInPrcnt-salesReturn').setValue(data.totalPrcntDscnt);
		Ext.getCmp('txt-totalDscntInAmt-salesReturn').setValue(data.totalAmtDscnt);
		Ext.getCmp('txt-netTotal-salesReturn').setValue(data.netTotal);
		Ext.getCmp('txt-grossTotal-salesReturn').setValue(data.grossTotal);

		salesReturnItemsStore.load({params : { docId : data.docId}});
	}

	Ext.define('Checkup.Sales.Return.Form.Return',
	{
		extend 		: 'Ext.form.Panel',


		layout 		: 'column',
		
		border 		: true,
		title 		: 'Sales Return',
		//style 		: 'top : 0px !important',
		width 		: '90%',

		defaultType : 'textfield',

		initComponent : function(){
			me = this;

			this.superclass.initComponent.call(this);
		},

		items 		: [
			{
				xtype 	: 'panel',
				columnWidth : 1,
				layout 	: 'column',
				border  : false,
				items 	: [
					{
						xtype 	: 'fieldset',
						title 	: 'Sales Return Information',
						width 	: 420,
						height 	: 426,
						layout 	: 'column',
						margin 	: '3 5 0 10',
						items 	: [
							{
								xtype 		: 'textfield',
								fieldLabel 	: 'Sales Return #',
								readOnly 	: true,
								name 		: 'salesReturnId',
								id 			: 'txt-salesReturnId-salesReturn',
								columnWidth	: 1,
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'textfield',
								fieldLabel 	: 'Posting Date',
								readOnly 	: true,
								name 		: 'postingDate',
								id 			: 'txt-postingDate-salesReturn',
								columnWidth	: 1,
								margin 		: '5 0 0 0',
								value 		: getCurrentDate()
							}, {
								xtype 		: 'combo',
								fieldLabel 	: 'Customer Code',
								columnWidth : 1,
								name 		: 'customerCode',
								id 			: 'cbo-customerCode-salesReturn',
								queryMode 	: 'local',
								triggerAction: 'all',
								forceSelection:false,
								displayField: 'code',
								valueField 	: 'code',
								columnWidth	: 1,
								store 		: businessPartnerStore,
								margin 		: '5 0 0 0',
								allowBlank 	: false
							}, {
								xtype 		: 'combo',
								fieldLabel 	: 'Customer Name',
								columnWidth : 1,
								name 		: 'customerName',
								id 			: 'cbo-customerName-salesReturn',
								queryMode 	: 'local',
								triggerAction: 'all',
								forceSelection:false,
								displayField: 'BPName',
								valueField 	: 'code',
								columnWidth	: 1,
								store 		: businessPartnerStore,
								margin 		: '5 0 0 0',
								allowBlank 	: false
							}, {
								xtype 		: 'textarea',
								fieldLabel 	: 'Remarks 1',
								columnWidth : 1,
								name 		: 'remarks1',
								id 			: 'txtarea-remarks1-salesReturn',
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'textarea',
								fieldLabel 	: 'Remarks 2',
								columnWidth : 1,
								name 		: 'remarks2',
								id 			: 'txtarea-remarks2-salesReturn',
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'textfield',
								fieldLabel 	: 'Total Discount %',
								readOnly 	: true,
								name 		: 'totalDscntInPrcnt',
								id 			: 'txt-totalDscntInPrcnt-salesReturn',
								columnWidth	: 1,
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'textfield',
								fieldLabel 	: 'Total Discount Amt',
								readOnly 	: true,
								name 		: 'totalDscntInAmt',
								id 			: 'txt-totalDscntInAmt-salesReturn',
								columnWidth	: 1
							}, {
								xtype 		: 'textfield',
								fieldLabel 	: 'Net Total',
								readOnly 	: true,
								name 		: 'netTotal',
								id 			: 'txt-netTotal-salesReturn',
								columnWidth	: 1
							}, {
								xtype 		: 'textfield',
								fieldLabel 	: 'Gross Total',
								readOnly 	: true,
								name 		: 'grossTotal',
								id 			: 'txt-grossTotal-salesReturn',
								columnWidth	: 1,
								margin 		: '5 0 10 0'
							}
						]
					}, {
						xtype 	: 'grid',
						id 		: 'grid-salesReturnList-salesReturn',
						store 	: salesReturnStore,
						columnWidth: 1,
						height 	: 420,
						margin 	: '10 10 10 5',
						columns : [
							{text : 'Sales Return ID', 	dataIndex : 'docId',	width : 88},
							{text : 'Customer Code', 	dataIndex : 'customerCode',	width : 86},
							{text : 'Customer Name', 	dataIndex : 'customerName',	width : 159},
							{text : 'Posting Date', 	dataIndex : 'postingDate',	width : 98},
							{text : 'Remarks 1', 	dataIndex : 'remarks1',	width : 100},
							{text : 'Remakrs 2', 	dataIndex : 'remarks2',	width : 100},
							{text : 'Total Discount %', 	dataIndex : 'totalPrcntDscnt',	width : 96},
							{text : 'Total Discount Amt', 	dataIndex : 'totalAmtDscnt',	width : 102},
							{text : 'Net Total', 	dataIndex : 'netTotal',	width : 87},
							{text : 'Gross Total', 	dataIndex : 'grossTotal',	width : 87}
						],
						listeners : {
							selectionchange : function(grid, selected, eOpts) {
								if(selected[0] != null && selected[0] != 'undefined')
								{
									populateFields(selected[0].raw);

									Ext.getCmp('btn-delete-salesReturn').enable();
									Ext.getCmp('btn-print-salesReturn').enable();
								}
							}
						}
					}
				]
			}, {
				xtype 	: 'grid',
				title 	: 'Items',
				id 		: 'grid-salesReturnItems-salesReturn',
				store 	: salesReturnItemsStore,
				columnWidth: 1,
				height 	: 200,
				margin 	: '0 10 10 10',
				columns : [

					{text : 'Item Code', 	dataIndex : 'itemCode', width : 63},
					{text : 'Description', 	dataIndex : 'description',	width : 170},
					{text : 'Vatable', 	dataIndex : 'vatable',	width : 50},
					{text : 'Net Pur. Price', 	dataIndex : 'netPrchsPrc',	width : 95},
					{text : 'Gross Pur. Price1', 	dataIndex : 'grossPrchsPrc',	width : 95},
					{text : 'Sale UoM', 	dataIndex : 'saleUoM',	width : 55},
					{text : 'Qty/Sale UoM', 	dataIndex : 'qtyPrSaleUoM',	width : 77},
					{text : 'Real Base Net Sale Price', 	dataIndex : 'realBsNetSalePrc',	width : 139},
					{text : 'Real Base Gross Sale Price', 	dataIndex : 'realBsNetSalePrc',	width : 139},
					{text : 'Qty', 	dataIndex : 'qty',	width : 60},
					{text : '% Discount', 	dataIndex : 'prcntDscnt',	width : 80},
					{text : 'Amt Discount', 	dataIndex : 'amtDscnt',	width : 77},
					{text : 'Net Sale Price', 	dataIndex : 'netSalePrc',	width : 90},
					{text : 'Gross Sale Price', 	dataIndex : 'grossSalePrc',	width : 90},
					{text : 'Row Net Total', 	dataIndex : 'rowNetTotal',	width : 90},	
					{text : 'Row Gross Total', 	dataIndex : 'rowGrossTotal',	width : 90}
				],
				tbar 	: [
					{
						xtype 	: 'button',
						text 	: 'Add Item',
						id 		: 'btn-add-item-salesReturn',
						disabled : true,
						handler	: function()
						{

						}
					}, {
						xtype 	: 'button',
						text 	: 'Delete Item',
						id 		: 'btn-delete-item-salesReturn',
						disabled: true,
						handler : function()
						{

						}
					}
				]
			}
		],

		buttons 	: [
			{
				text 	: 'New',
				/*handler : function()
				{
					me.getForm().reset();
					Ext.getCmp('txt-password').allowBlank = false;
					Ext.getCmp('btn-delete-users').disable();
				}*/
			}, {
				text 	: 'Save',
				/*handler : function()
				{
					var form = me.getForm(),
						usernameEdit = 0;

					finalUsername = Ext.getCmp('txt-username-users').getValue();

					if(origUsername != finalUsername)
					{
						usernameEdit = 1;
					}

                    if(form.isValid())
                    {
                        form.submit({
                            url     : submit_url,
                            waitMsg : 'Saving data...',
                            params 	: {
                            	usernameEdit : usernameEdit
                            },
                            success : function(response, responseText) {
                                msg = Ext.Msg.alert('Success',  responseText.result.message, function() { 
                                	usersStore.load();
                                	me.getForm().reset(); 
                                	finalUsername = "";
                                	origUsername = "";
                                	Ext.getCmp('grid-users-list').getSelectionModel().deselectAll();
                               	});
                            },
                            failure : function(response, responseText) {
                                Ext.MessageBox.alert(
                                    'Failed',
                                    responseText.result.errorMessage
                                );
                            }
                        });

						Ext.getCmp('img-user-picture').setSrc('');
						Ext.getCmp('btn-delete-users').disable();
                    }
				}*/
			}, {
				text 	: 'Delete',
				id 		: 'btn-delete-salesReturn',
				disabled: true,
				/*handler : function()
				{
					var grid = Ext.getCmp('grid-users-list');
					var selectionModel = grid.getSelectionModel();

					if(selectionModel.hasSelection())
					{
						var selection = selectionModel.getSelection();
						var record = selection[0];

						Ext.Msg.confirm('Delete', 'Are you sure you want to delete this record?', function(btn){
							if(btn == 'yes')
							{
								Ext.Ajax.request({
									url  : deleteUrl,
									method : 'POST',
									params : {
										user_id : record.raw.user_id
									},
									success : function(response, opt)
									{
										result = Ext.JSON.decode(response.responseText);
										Ext.Msg.alert('Success', result.message,  function() { 
		                                	usersStore.load();
		                                	me.getForm().reset(); 
		                                	finalUsername = "";
		                                	origUsername = "";
		                                	Ext.getCmp('grid-users-list').getSelectionModel().deselectAll();
		                               	});
									},
									failure : function(response, opt)
									{
										result = Ext.JSON.decode(response.responseText);
										Ext.Msg.alert('Failed', result.errorMessage);
									}
								});

								Ext.getCmp('btn-delete-users').disable();
								Ext.getCmp('img-user-picture').setSrc('');
							}
						});
					}
					else
					{
						Ext.Msg.alert('Delete', 'Please select a row to delete');
					}
				}*/
			}, {
				text 	: 'Print',
				id 		: 'btn-print-salesReturn',
				disabled: true,
				handler : function()
				{
					new Ext.Window({
                        height: Ext.getBody().getViewSize().height,
                        width: Ext.getBody().getViewSize().width - 20,
                        html : '<iframe style="width:100%;height:' + (Ext.getBody().getViewSize().height - 30) + 'px;" frameborder="0"  src="' + reportSalesReturnUrl + '?docId=' + docId + '"></iframe>',
                        modal: true
                    }).show();
				}
			}
		]

	});

})();