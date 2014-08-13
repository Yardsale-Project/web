'use strict';

Ext.define('YSCommon.store.City', {
	extend 	: 'Ext.data.Store',

	storeId	: 'city',

	model  : 'YSCommon.model.Country',

    remoteSort      : false,
    remoteFilter    : true,

    autoLoad    : false,

    proxy     : {
        type         : 'ajax',
        url          : YSConfig.url + '/application/location/getCities',
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