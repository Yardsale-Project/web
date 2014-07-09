'use strict';

Ext.define('YSCommon.store.Product', {
	extend 	: 'Ext.data.Store',

	alias	: 'store.app-productStore',
	storeId	: 'app-productStore',

	model  : 'YSCommon.model.Product',

    remoteSort      : true,
    remoteFilter    : true,

    autoLoad    : true,

    proxy     : {
        type         : 'ajax',
        url          : YSConfig.url + '/application/product',
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