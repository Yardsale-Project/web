'use strict';

Ext.define('YSWebAdmin.view.main.body.StatesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.states',

    init 	: function(){
    	this.control({
    		'app-states' : {
                beforerender : 'onGridBeforeRender',
                edit        : 'onGridEdit',
            }
    	});
    },

    onGridBeforeRender : function() {
        var store = this.view.getStore();
        var countryId = this.view._countryId;

        store.on('beforeload', function(str, op) {
            var filter = [
                { 
                    'field' : 'country_id',
                    'value' : countryId
                }
            ];

            op.setParams( {
                filter: Ext.encode( filter )
            } );
        });

        store.load();

    },

    onAddStateClick : function() {
        var plugins = this.view.getPlugins();
        var rowEditing = plugins[0];
        var store = this.view.getStore();

        rowEditing.cancelEdit();
        // Create a model instance

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/location/getLastStateId',
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

    onAddStateMultipleClick : function() {

    },

    onCitiesBtnClik : function() {

    },

    onDeleteBtnClik : function() {

    },

    onGridEdit : function(editor, context) {
        YSDebug.log('context', context);
        YSDebug.log('onGridEdit', context.record);

        var plugins = this.view.getPlugins();
        var rowEditing = plugins[0];

        var id = context.record.data.id,
            code = context.record.data.code,
            name = context.record.data.name,
            countryId = this.view._countryId,
            me = this;

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/location/saveSingleState',
            method  : 'POST',
            waitMsg : 'Saving data',
            params  : {
                id      : id,
                code    : code,
                name    : name,
                countryId : countryId
            },
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);
                

                if(rsp.success)
                {
                    this.done = 1;
                    me.view.getStore().load();
                    Ext.Msg.show({
                        title       : 'State/Province',
                        msg         : rsp.message,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.INFO
                    });
                } else {
                    YSDebug.log('failed', rsp.success);

                    rowEditing.startEdit(context.rowIdx, 0);

                    Ext.Msg.show({
                        title       : 'State/Province',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            }
        });
    },
});