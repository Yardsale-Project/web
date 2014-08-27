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
        extraParams  : {
            filter: Ext.encode({
                "op": "AND",
                "set": [
                    {
                        "table": "user",
                        "field": "country",
                        "bitOp": "EQ",
                        "value": 170
                    }
                ]
            })
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