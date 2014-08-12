'use strict';

Ext.define('YSWebAdmin.store.Country', {
	extend 	: 'Ext.data.Store',

	storeId	: 'country',

	model  : 'YSWebAdmin.model.Country',

    remoteSort      : false,
    remoteFilter    : true,

    autoLoad    : true,

    proxy     : {
        type         : 'ajax',
        url          : YSConfig.url + '/application/location/getCountry',
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