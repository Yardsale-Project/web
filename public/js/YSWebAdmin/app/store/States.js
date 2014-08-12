'use strict';

Ext.define('YSWebAdmin.store.States', {
	extend 	: 'Ext.data.Store',

	storeId	: 'states',

	model  : 'YSWebAdmin.model.Country',

    remoteSort      : false,
    remoteFilter    : true,

    autoLoad    : false,

    proxy     : {
        type         : 'ajax',
        url          : YSConfig.url + '/application/location/getStates',
        extraParams  : {
            filter: ''
        },
        actionMethods: {
            create : 'POST',
            read   : 'POST',
            update : 'POST',
            destroy: 'POST'
        },
        reader       : {
            rootProperty   : 'result',
            totalProperty  : 'totalRecords',
            messageProperty: 'message',
            successProperty: 'success'
        }
    }
});