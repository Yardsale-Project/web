'use strict';

Ext.define('YSWebAdmin.view.main.body.CityController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.city',

    init 	: function(){
    	this.control({
    		'app-city' : {
                beforerender : 'onGridBeforeRender',
                edit        : 'onGridEdit',
                itemclick   : 'onItemClick'
            }
    	});
    },

    onGridBeforeRender : function() {
        var store = this.view.getStore();
        var stateId = this.view._stateId;

        store.on('beforeload', function(str, op) {
            var filter = {
                "op": "AND",
                "set": [
                    {
                        "field": "state_id",
                        "bitOp": "EQ",
                        "value": stateId
                    }
                ]
            }

            op.setParams( {
                filter: Ext.encode( filter )
            } );
        });

        store.load();

    },

    onAddCityClick : function() {
        var plugins = this.view.getPlugins();
        var rowEditing = plugins[0];
        var store = this.view.getStore();

        rowEditing.cancelEdit();
        // Create a model instance

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/location/getLastCityId',
            method  : 'POST',
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);
                

                if(rsp.success)
                {
                    YSDebug.log('id', rsp.id);

                    var model = Ext.create('YSWebAdmin.model.Country', {
                        id  : rsp.id + 1,
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

    onAddCityMultipleClick : function() {
        var me = this;

        Ext.create('Ext.window.Window',{
            modal       : true,
            resizable   : false,
            closeAction : 'destory',

            title       : 'Cities/Municipalities',
            layout      : 'fit',
            items       : [
                {
                    xtype   : 'form',
                    border  : false,
                    frame   : false,
                    layout  : 'column',
                    bodyPadding : 10,
                    width   : 400,

                    controller : 'city',

                    _me     : me,

                    items   : [
                        {
                            xtype   : 'label',
                            columnWidth : 1,
                            text    : 'Comma separated list of cities/municipalities with respected state abbreviation. (E.g CC-Cebu City)'
                        }, {
                            xtype   : 'textareafield',
                            name    : 'cities',
                            columnWidth : 1,
                            height  : 400
                        }
                    ],

                    buttons     : [
                        {
                            text    : 'Save',
                            handler : 'onSaveBtnClick'
                        }, {
                            text    : 'Cancel',
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
                url     : YSConfig.url + '/application/location/saveMultipleCity',
                waitMsg : 'Saving data',
                params  : {
                    stateId  : me.view._me.view._stateId
                },
                success : function( frm, action ) {
                    YSDebug.log(action.result);
                    Ext.Msg.show({
                        title       : 'Cities/Municipalities',
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
                        title       : 'Cities/Municipalities',
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

    onGridEdit : function(editor, context) {
        YSDebug.log('context', context);
        YSDebug.log('onGridEdit', context.record);

        var plugins = this.view.getPlugins();
        var rowEditing = plugins[0];

        var id = context.record.data.id,
            code = context.record.data.code,
            name = context.record.data.name,
            stateId = this.view._stateId,
            me = this;

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/location/saveSingleCity',
            method  : 'POST',
            waitMsg : 'Saving data',
            params  : {
                id      : id,
                code    : code,
                name    : name,
                stateId : stateId
            },
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);
                

                if(rsp.success)
                {
                    this.done = 1;
                    me.view.getStore().load();
                    Ext.Msg.show({
                        title       : 'City/Municipality',
                        msg         : rsp.message,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.INFO
                    });
                } else {
                    YSDebug.log('failed', rsp.success);

                    rowEditing.startEdit(context.rowIdx, 0);

                    Ext.Msg.show({
                        title       : 'City/Municipality',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            }
        });
    },

    onSearchChange : function(field, newValue) {
        var store = this.view.getStore();
        var countryId = this.view._countryId;
        YSDebug.log(store);


        store.on('beforeload', function(str, op) {
            var filter = '';
            if(newValue.length > 0) {
                filter = {
                    "op": "AND",
                    "set": [
                        {
                            "field": "country_id",
                            "bitOp": "EQ",
                            "value": countryId
                        }, {
                            "op": "OR",
                            "set": [
                                {
                                    "field": "code",
                                    "bitOp": "LIKE",
                                    "value": newValue
                                }, {
                                    "field": "name",
                                    "bitOp": "LIKE",
                                    "value": newValue
                                }
                            ]
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

        deleteBtn.enable();

    },

    onDeleteBtnClik : function() {
        var sm = this.view.getSelectionModel();
        var store = this.view.getStore();
        var deleteBtn = this.lookupReference('deleteBtn');

        if(sm.hasSelection()) {
            var selection = sm.getSelection();
            var record = selection[0];
            var id = record.data.id;

            Ext.Msg.confirm(
                'City/Municipality',
                'Are you sure you want to delete this record?',
                function(btn) {
                    
                    if(btn == 'yes') {
                        Ext.Ajax.request({
                            url     : YSConfig.url + '/application/location/deleteCity',
                            method  : 'POST',
                            params  : {
                                id  : id
                            },
                            success : function(response) {

                                var rsp = Ext.JSON.decode(response.responseText);
                                

                                if(rsp.success)
                                {
                                    Ext.Msg.show({
                                        title       : 'City/Municipality',
                                        msg         : rsp.message,
                                        icon        : Ext.MessageBox.INFO,
                                        buttons     : Ext.MessageBox.OK
                                    });

                                    sm.deselectAll();
                                    deleteBtn.disable();
                                    store.load();
                                } else {
                                    Ext.Msg.show({
                                        title       : 'City/Municipality',
                                        msg         : rsp.errorMessage,
                                        icon        : Ext.MessageBox.ERROR,
                                        buttons     : Ext.MessageBox.OK
                                    });
                                }
                            }
                        });
                    }
                }
            );
        } else {
            Ext.Msg.show({
                title       : 'City/Municpality',
                msg         : 'Please select a City/Municipality to delete',
                icon        : Ext.MessageBox.ERROR,
                buttons     : Ext.MessageBox.OK
            });
        }
    }
});