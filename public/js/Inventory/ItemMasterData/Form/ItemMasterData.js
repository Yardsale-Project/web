(function(){


	var me;
	var businessPartnerStoreUrl = 'application/BusinessPartner/getBusinessPartnersByType',
		itemMasterDataStoreUrl = 'application/ItemMasterData',
		itemMasterDataItemsStoreUrl = 'application/ItemMasterDataItem/getItemMasterDataItemsByDocId',
		submit_url = 'application/ItemMasterDataItem/saveItem',
		deleteUrl = 'application/user/deleteUser',
		barcodesStoreUrl = 'application/ItemMasterData/getBarcodesByItem',
		priceListStoreUrl = 'application/ItemMasterData/getPriceListByItem';


	var businessPartnerStoreFields = [
		'code', 'BPName'
	];

	var itemMasterDataStoreFields = [
		'id', 'itemCode', 'description', 'shortName', 'vatable',
		'vendor', 'qtyPrPrchsUoM', 'qtyPrSaleUoM', 'prchsUoM',
		'saleUoM', 'varWeightItm', 'remarks', 'minStock',
		'maxStock', 'deactivated'
	];

	var itemMasterDataItemStoreFields = [
		'docId', 'indx', 'itemCode', 'description',
		'warehouse', 'vatable', 'realBsNetPrchsPrc',
		'realBsGrossPrchsPrc', 'realNetPrchsPrc',
		'realGrossPrchsPrc', 'qty', 'baseUoM',
		'qtyPrPrchsUoM', 'prcntDscnt', 'amtDscnt',
		'netPrchsPrc', 'grossPrchsPrc', 'rowNetTotal',
		'rowGrossTotal'
	];

	var barcodesStoreFields = [ 'barcode' ];

	var businessPartnerStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-businessPartnerStore',
		proxy	: proxy(businessPartnerStoreUrl, { type : '0'}),
		autoLoad: true ,
	    fields: businessPartnerStoreFields
	});

	var itemMasterDataStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-itemMasterDataStore',
		proxy	: proxy(itemMasterDataStoreUrl, {}),
		autoLoad: true ,
	    fields: itemMasterDataStoreFields
	});

	var itemMasterDataItemsStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-itemMasterDataItemsStore',
		proxy	: proxy(itemMasterDataItemsStoreUrl, {}),
		autoLoad: false ,
	    fields: itemMasterDataItemStoreFields
	});

	var priceListStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-priceListStore',
		proxy	: proxy(priceListStoreUrl, {}),
		autoLoad: false ,
	    fields: ['priceListCode', 'priceListName']
	});

	var barcodesStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-barcodesStore',
		proxy	: proxy(barcodesStoreUrl, {}),
		autoLoad: false ,
	    fields: barcodesStoreFields,
	    autoDestroy: true,
	});

	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
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

		Ext.getCmp('txt-itemCode-itemMasterData').setValue(data.itemCode);
		Ext.getCmp('txt-description-itemMasterData').setValue(data.description);
		Ext.getCmp('txt-shortName-itemMasterData').setValue(data.shortName);
		Ext.getCmp('cbo-vendor-itemMasterData').setValue(data.vendor);
		Ext.getCmp('txtarea-remarks-itemMasterData').setValue(data.remarks);
		Ext.getCmp('txt-purchaseUoM-itemMasterData').setValue(data.prchsUoM);
		Ext.getCmp('txt-qtyPerPurchaseUoM-itemMasterData').setValue(data.qtyPrPrchsUoM);
		Ext.getCmp('txt-saleUoM-itemMasterData').setValue(data.saleUoM);
		Ext.getCmp('txt-qtyPerSaleUoM-itemMasterData').setValue(data.qtyPrSaleUoM);
		Ext.getCmp('txt-minStock-itemMasterData').setValue(data.minStock);
		Ext.getCmp('txt-maxStock-itemMasterData').setValue(data.maxStock);

		if(data.vatable == 'Y')
		{
			Ext.getCmp('chk-vatable-itemMasterData').setValue(true);
		}
		else
		{
			Ext.getCmp('chk-vatable-itemMasterData').setValue(false);
		}

		if(data.varWeightItm == 'Y')
		{
			Ext.getCmp('chk-variableWeightItem-itemMasterData').setValue(true);
		}
		else
		{
			Ext.getCmp('chk-variableWeightItem-itemMasterData').setValue(false);
		}

		if(data.deactivated == 'Y')
		{
			Ext.getCmp('chk-deactivate-itemMasterData').setValue(true);
		}
		else
		{
			Ext.getCmp('chk-deactivate-itemMasterData').setValue(false);
		}

		barcodesStore.load({params : { itemCode : data.itemCode}});
		priceListStore.load({params : { itemCode : data.itemCode}});

		Ext.getCmp('cbo-priceList-itemMasterData').setValue('');
		Ext.getCmp('txt-unitPrice-itemMasterData').setValue('');

	}

	Ext.define('Checkup.Inventory.ItemMasterData.Form.ItemMasterData',
	{
		extend 		: 'Ext.form.Panel',


		layout 		: 'column',
		
		border 		: true,
		title 		: 'Inventory - Item Master Data',
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
						title 	: 'Item Master Data Information',
						width 	: 470,
						//height 	: 426,
						layout 	: 'column',
						margin 	: '3 5 0 10',
						items 	: [
							{
								xtype 		: 'textfield',
								fieldLabel 	: 'Item Code',
								readOnly 	: true,
								name 		: 'itemCode',
								id 			: 'txt-itemCode-itemMasterData',
								columnWidth	: 1,
								margin 		: '5 0 0 0',
								readOnly 	: true
							}, {
								xtype 		: 'textfield',
								fieldLabel 	: 'Description',
								readOnly 	: false,
								name 		: 'description',
								id 			: 'txt-description-itemMasterData',
								columnWidth	: 1,
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'textfield',
								fieldLabel 	: 'Short Name',
								readOnly 	: false,
								name 		: 'shortName',
								id 			: 'txt-shortName-itemMasterData',
								columnWidth	: 1,
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'combo',
								fieldLabel 	: 'Vendor',
								columnWidth : 1,
								name 		: 'vendor',
								id 			: 'cbo-vendor-itemMasterData',
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
								xtype 	: 'grid',
								id 		: 'grid-barcodes-itemMasterData',
								store 	: barcodesStore,
								columnWidth: 1,
								height 	: 150,
								margin 	: '5 0 5 0',
								columns : [
									{
										text : 'Barcodes', 	
										dataIndex : 'barcode',	
										flex : 1, 
										editor: {
							                // defaults to textfield if no xtype is supplied
							                xtype 	: 'textfield',
							                allowBlank: false
							            }
							       	}
								],
								tbar : [
									{
							            text: 'Add Barcode',
							            handler : function() {
							                rowEditing.cancelEdit();

							                // Create a model instance
							                Ext.define('Barcode', {
										        extend: 'Ext.data.Model',
										        fields: [
										            'barcode'
										        ]
										    });
							                var r = Ext.create('Barcode', {
							                    barcode: 'new barcode'
							                });

							                barcodesStore.insert(0, r);
							                rowEditing.startEdit(0, 0);
							            }
							        }
								],
								plugins : [
									rowEditing
								],
								listeners : {
									
								}
							}, {
								xtype 	: 'fieldset',
								columnWidth : 1,
								layout 	: 'column',
								title 	: 'Pricing',
								items 	: [
									{
										xtype 		: 'combo',
										fieldLabel 	: 'Price List',
										columnWidth : 1,
										name 		: 'priceList',
										id 			: 'cbo-priceList-itemMasterData',
										queryMode 	: 'local',
										triggerAction: 'all',
										forceSelection:false,
										displayField: 'priceListName',
										valueField 	: 'priceListCode',
										columnWidth	: 1,
										store 		: priceListStore,
										margin 		: '5 0 0 0',
										allowBlank 	: false,
										listeners 	: {
											'select' : function(combo, records, eOpts)
											{
												var record = records[0];
												var netPrice = record.raw.netPrice;

												Ext.getCmp('txt-unitPrice-itemMasterData').setValue(netPrice);
											}
										}
									}, {
										xtype 		: 'textfield',
										fieldLabel 	: 'Unit Price',
										readOnly 	: false,
										name 		: 'unitPrice',
										id 			: 'txt-unitPrice-itemMasterData',
										columnWidth	: 1,
										margin 		: '5 0 10 0'
									}
								]
							}, {
								xtype 		: 'textarea',
								fieldLabel 	: 'Remarks',
								columnWidth : 1,
								name 		: 'remarks',
								id 			: 'txtarea-remarks-itemMasterData'
							}, {
								xtype 	: 'checkbox',
								boxLabel : 'Deactivate',
								columnWidth : 1,
								id 		: 'chk-deactivate-itemMasterData',
								name 	: 'deactivate',
								margin 		: '5 0 10 0'
							}
						]
					}, {
						xtype 	: 'grid',
						id 		: 'grid-itemMasterDataList-itemMasterData',
						store 	: itemMasterDataStore,
						columnWidth: 1,
						height 	: 482,
						margin 	: '11 10 10 5',
						columns : [
							{text : 'Item Code', 	dataIndex : 'itemCode',	flex : 1},
							{text : 'Description', 	dataIndex : 'description',	flex : 1},
							{text : 'Short Name', 	dataIndex : 'shortName',	flex : 1},
							{text : 'Deactivated', 	dataIndex : 'deactivated',	flex : 1}
						],
						listeners : {
							selectionchange : function(grid, selected, eOpts) {
								if(selected[0] != null && selected[0] != 'undefined')
								{
									populateFields(selected[0].raw);

									Ext.getCmp('btn-delete-itemMasterData').enable();
								}
							}
						}
					}
				]
			}, {
				xtype 		: 'tabpanel',
				columnWidth	: 1,
				margin 	: '0 10 10 10 ',
				height 	: 300,
				items 	: [
					{
						title 	: 'Inventory',
						layout 	: 'column',
						items 	: [
							{
								xtype 	: 'panel',
								columnWidth : 1,
								layout 	: 'column',
								border 	: false,
								frame 	: false,
								items 	: [
									{
										xtype 	: 'grid',
										id 		: 'grid-warehouseItemMasterDataList-itemMasterData',
										store 	: itemMasterDataStore,
										columnWidth: 1,
										height 	: 432,
										margin 	: '11 10 10 5',
										columns : [
											{text : 'Warehouse', 	dataIndex : 'itemCode',	flex : 1},
											{text : 'Warehouse name', 	dataIndex : 'description',	flex : 1},
											{text : 'Locked', 	dataIndex : 'shortName',	flex : 1},
											{text : 'In Stock', 	dataIndex : 'deactivated',	flex : 1}
										],
										listeners : {
											selectionchange : function(grid, selected, eOpts) {
												
											}
										}
									}
								]
							}
						]
					}, {
						title 	: 'Purchasing/Sales',
						//layout 	: 'vbox',
						items 	: [
							{
								xtype 	: 'panel',
								border 	: false,
								frame 	: false,
								padding : 10,
								items 	: [
									{
										xtype 	: 'textfield',
										fieldLabel  :'Purchase UoM',
										name 	: 'purchaseUoM',
										id 		: 'txt-purchaseUoM-itemMasterData',
										value 	: 'PC',
										allowBlank : false
									}, {
										xtype 	: 'numberfield',
										fieldLabel  :'Qty Per Purchase UoM',
										name 	: 'qtyPerPurchaseUoM',
										id 		: 'txt-qtyPerPurchaseUoM-itemMasterData',
										value 	: '0',
										minValue: 0,
										allowBlank : false
									}, {
										xtype 	: 'textfield',
										fieldLabel  :'Sale UoM',
										name 	: 'saleUoM',
										id 		: 'txt-saleUoM-itemMasterData',
										value 	: 'PC',
										allowBlank : false
									}, {
										xtype 	: 'numberfield',
										fieldLabel  :'Qty Per Sale UoM',
										name 	: 'qtyPerSaleUoM',
										id 		: 'txt-qtyPerSaleUoM-itemMasterData',
										value 	: '0',
										minValue: 0,
										allowBlank : false
									}, {
										xtype 	: 'numberfield',
										fieldLabel  :'Min Stock',
										name 	: 'minStock',
										id 		: 'txt-minStock-itemMasterData',
										value 	: '0',
										minValue: 0,
										allowBlank : false
									}, {
										xtype 	: 'numberfield',
										fieldLabel  :'Max Stock',
										name 	: 'maxStock',
										id 		: 'txt-maxStock-itemMasterData',
										value 	: '0',
										minValue: 0,
										allowBlank : false
									}, {
										xtype 	: 'checkbox',
										boxLabel : 'Vatable',
										columnWidth : 1,
										id 		: 'chk-vatable-itemMasterData',
										name 	: 'vatable',
										margin 		: '5 0 10 0'
									}, {
										xtype 	: 'checkbox',
										boxLabel : 'Variable weight item',
										columnWidth : 1,
										id 		: 'chk-variableWeightItem-itemMasterData',
										name 	: 'variableWeightItem',
										margin 		: '5 0 10 0'
									}
								]
							}
						]
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
				handler : function()
				{
					var form = me.getForm();

					var barcodeObj 	= Ext.getCmp('grid-barcodes-itemMasterData').getView().getStore().getRange();
					var barcodes = [];

					for(index = 0; index < barcodeObj.length; index++) 
					{
						barcodes.push(barcodeObj[index].barcode);
					}

					var barcodeJSON = Ext.encode(barcodes);

                    if(form.isValid())
                    {
                        /*form.submit({
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
						Ext.getCmp('btn-delete-users').disable();*/
                    }
				}
			}, {
				text 	: 'Delete',
				id 		: 'btn-delete-itemMasterData',
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
			}
		]

	});

})();