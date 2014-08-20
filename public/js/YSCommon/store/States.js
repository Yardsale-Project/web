'use strict';

Ext.define('YSCommon.store.States', {
    extend  : 'Ext.data.Store',

    storeId : 'states',

    model  : 'YSCommon.model.State',

    remoteSort      : false,
    remoteFilter    : true,

    autoLoad    : true,

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