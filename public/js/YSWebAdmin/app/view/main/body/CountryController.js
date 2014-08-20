'use strict';

Ext.define('YSWebAdmin.view.main.body.CountryController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.country',

    init 	: function(){
    	this.control({
    		'app-country' : {
    			boxready 	: 'onGridBoxRead',
    			beforeedit 	: 'onGridBeforeEdit',
    			edit 		: 'onGridEdit',
    			cancel 		: 'onCancelEdit',
    			itemclick 	: 'onItemClick'
    		}
    	});

    	this.done = 1;
    },

    onGridBoxRead : function() {
    	var appBodyHeight = this.view.up('app-body').getHeight();

    	this.view.setHeight(appBodyHeight);
    },

    onAddCountryClick : function() {
    	var plugins = this.view.getPlugins();
    	var rowEditing = plugins[0];
    	var store = this.view.getStore();

    	rowEditing.cancelEdit();
    	// Create a model instance

    	Ext.Ajax.request({
            url     : YSConfig.url + '/application/location/getLastCountryId',
            method  : 'POST',
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);
                

                if(rsp.success)
                {
                    YSDebug.log('id', rsp.id);

                    var model = Ext.create('YSCommon.model.Country', {
                    	id 	: rsp.id + 1,
			            code: '',
			            name: ''
			        });

			        store.insert(0, model);
			        rowEditing.startEdit(0, 0);
                } else {
                    YSDebug.log('failed', rsp.success);
                }
            }
        });
    },

    onGridBeforeEdit : function(editor, context) {
    	YSDebug.log('onGridBeforeEdit', context.record);
    },

    onGridEdit : function(editor, context) {
    	YSDebug.log('context', context);
    	YSDebug.log('onGridEdit', context.record);

    	var plugins = this.view.getPlugins();
    	var rowEditing = plugins[0];

    	var id = context.record.data.id,
    		code = context.record.data.code,
    		name = context.record.data.name,
    		me = this;

    	Ext.Ajax.request({
            url     : YSConfig.url + '/application/location/saveSingleCountry',
            method  : 'POST',
            waitMsg : 'Saving data',
            params 	: {
            	id 		: id,
				code 	: code,
				name 	: name
            },
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);
                

                if(rsp.success)
                {
                	this.done = 1;
                	me.view.getStore().load();
                    Ext.Msg.show({
                        title       : 'Country',
                        msg         : rsp.message,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.INFO
                    });
                } else {
                    YSDebug.log('failed', rsp.success);

                    rowEditing.startEdit(context.rowIdx, 0);

                    Ext.Msg.show({
                        title       : 'Country',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            }
        });
    },

    onCancelEdit : function() {
    	this.done = 1;
    },

    onAddCountryMultipleClick : function() {
    	var me = this;

    	Ext.create('Ext.window.Window',{
    		modal 		: true,
    		resizable 	: false,
    		closeAction : 'destory',

    		title 		: 'Countries',
    		layout 		: 'fit',
    		items 		: [
    			{
    				xtype 	: 'form',
    				border 	: false,
    				frame 	: false,
    				layout 	: 'column',
    				bodyPadding : 10,
    				width 	: 400,

    				controller : 'country',

    				_me 	: me,

    				items 	: [
    					{
    						xtype 	: 'label',
	    					columnWidth : 1,
	    					text 	: 'Comma separated list of countries with respected country code. (E.g AU-Australia,PH-Philippines)'
    					}, {
    						xtype 	: 'textareafield',
    						name 	: 'countries',
    						columnWidth : 1,
    						height 	: 400
    					}
    				],

    				buttons 	: [
    					{
    						text 	: 'Save',
    						handler : 'onSaveBtnClick'
    					}, {
    						text 	: 'Cancel',
    						handler : 'onCancelBtnClick'
    					}
    				]
    			}
    		]
    	}).show();
    },

    onSaveBtnClick : function() {
    	var form = this.view.getForm(),
    		me = this;

    	if(form.isValid()) {
    		form.submit({
    			url 	: YSConfig.url + '/application/location/saveMultipleCountry',
    			waitMsg : 'Saving data',
    			success : function( frm, action ) {
                    YSDebug.log(action.result);
                    Ext.Msg.show({
                        title       : 'Country',
                        msg         : action.result.message,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();
                                me.view._me.view.getStore().load();
                                me.view.up('window').close();
                            }
                        }, 
                        icon        : Ext.MessageBox.INFO
                    });
                },
                failure : function( frm, action ) {
                    YSDebug.log(action.result);
                    Ext.Msg.show({
                        title       : 'Country',
                        msg         : action.result.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();
                            }
                        }, 
                        icon        : Ext.MessageBox.ERROR
                    });
                }
    		});
    	}
    },

    onCancelBtnClick : function() {
    	var form = this.view.getForm();
    	form.reset();
    	this.view.up('window').close();
    }, 

    onSearchChange : function(field, newValue) {
    	var store = this.view.getStore();

    	YSDebug.log(store);


    	store.on('beforeload', function(str, op) {
    		var filter = '';
    		if(newValue.length > 0) {
    			filter = {
                    "op": "OR",
                    "set": [
                        {
                            "field": "code",
                            "bitOp": "LIKE",
                            "value": newValue
                        },
                        {
                            "field": "name",
                            "bitOp": "LIKE",
                            "value": newValue
                        }
                    ]
                }

		        filter = Ext.encode( filter );
    		}

	        op.setParams( {
	            filter: filter
	        } );
	    });

        store.load();
    },

    onItemClick : function(grid, record) {

    	var deleteBtn = this.lookupReference('deleteBtn');
    	var stateBtn = this.lookupReference('statProvince');

    	deleteBtn.enable();
    	stateBtn.enable();

    },

    onStateProvinceBtnClik : function() {
    	var sm = this.view.getSelectionModel();

    	if(sm.hasSelection()) {
    		var selection = sm.getSelection();
    		var record = selection[0];
    		var id = record.data.id;

    		Ext.create('Ext.window.Window', {
    			modal 		: true,
    			resizable 	: false,
    			closeAction : 'destroy',
    			layout 		: 'fit',

    			title 		: 'States/Provinces',

    			items 		: [
    				{
    					xtype 		: 'app-states',
    					_countryId 	: id
    				}
    			]
    		}).show();

    	} else {
    		Ext.Msg.show({
                title       : 'Country',
                msg         : 'Please select a country',
                icon        : Ext.MessageBox.ERROR,
                buttons    	: Ext.MessageBox.OK
            });
    	}
    },

    onDeleteBtnClik : function() {
    	var sm = this.view.getSelectionModel();
    	var store = this.view.getStore();
    	var deleteBtn = this.lookupReference('deleteBtn');
    	var stateBtn = this.lookupReference('statProvince');

    	if(sm.hasSelection()) {
    		var selection = sm.getSelection();
    		var record = selection[0];
    		var id = record.data.id;

    		Ext.Msg.confirm(
    			'Country',
    			'Are you sure you want to delete this record?',
    			function(btn) {
    				
    				if(btn == 'yes') {
    					Ext.Ajax.request({
				            url     : YSConfig.url + '/application/location/deleteCountry',
				            method  : 'POST',
				            params 	: {
				            	id 	: id
				            },
				            success : function(response) {

				                var rsp = Ext.JSON.decode(response.responseText);
				                

				                if(rsp.success)
				                {
				                    Ext.Msg.show({
						                title       : 'Country',
						                msg         : rsp.message,
						                icon        : Ext.MessageBox.INFO,
						                buttons    	: Ext.MessageBox.OK
						            });

				                    sm.deselectAll();
				                    deleteBtn.disable();
    								stateBtn.disable();
						            store.load();
				                } else {
				                    Ext.Msg.show({
						                title       : 'Country',
						                msg         : rsp.errorMessage,
						                icon        : Ext.MessageBox.ERROR,
						                buttons    	: Ext.MessageBox.OK
						            });
				                }
				            }
				        });
    				}
    			}
    		);
    	} else {
    		Ext.Msg.show({
                title       : 'Country',
                msg         : 'Please select a country to delete',
                icon        : Ext.MessageBox.ERROR,
                buttons    	: Ext.MessageBox.OK
            });
    	}
    }
});