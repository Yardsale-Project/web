'use strict';

Ext.define('YSWeb.view.main.Main', {
    extend: 'Ext.container.Container',

    xtype: 'app-main',
    
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
            region  : 'north'
        }, {
            xtype   : 'panel',
            html    : 'body',
            region  : 'center'
        }, {
            xtype   : 'panel',
            html    : 'footer',
            region  : 'south'
        }
    ]
});
