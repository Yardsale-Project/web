'use strict';

Ext.define('YSCommon.store.CategoryTree', {
    extend  : 'Ext.data.TreeStore',

    alias   : 'store.app-categoryTreeStore',
    storeId : 'app-categoryTreeStore',

    model   : 'YSCommon.model.CategoryTree',

    autoload : true,
    remoteFilter : true,
    remoteSort  : true,
    proxy   : {
        type    : 'ajax',
        url     : YSConfig.url + '/application/category',

        extraParams : { isTree : true },

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