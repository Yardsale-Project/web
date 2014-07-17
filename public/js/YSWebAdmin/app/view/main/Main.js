'use strict';

Ext.define('YSWebAdmin.view.main.Main', {
    extend: 'Ext.container.Container',

    xtype: 'app-main',
    itemId : 'app-main',
    
    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },

    items   : [
        {
            xtype   : 'app-header',
            itemId  : 'app-header',
            region  : 'north'
        }, {
            xtype   : 'app-body',
            region  : 'center'
        }, {
            xtype   : 'app-footer',
            itemId  : 'app-footer',
            region  : 'south',
            border  : true
        }
    ]
});
