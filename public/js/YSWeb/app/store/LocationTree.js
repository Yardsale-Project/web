'use strict';

Ext.define('YSWeb.store.LocationTree', {
    extend  : 'Ext.data.TreeStore',

    alias   : 'store.app-locationTreeStore',
    storeId : 'app-locationTreeStore',

    model   : 'YSCommon.model.CategoryTree',

    autoload : true,
    remoteFilter : true,
    remoteSort  : false,
    proxy   : {
        type    : 'ajax',
        url     : YSConfig.url + '/application/location',

        extraParams : { 
            filter : Ext.encode( {
                "op": "AND",
                "set": [
                    {
                        "field": "country_id",
                        "bitOp": "EQ",
                        "value": 170
                    }
                ]
            } )
        },

        actionMethods: {
            create : 'POST',
            read   : 'POST',
            update : 'POST',
            destroy: 'POST'
        },

        reader  : {
            rootProperty    : 'children',
            totalProperty   : 'totalRecords'
        }
    }
});