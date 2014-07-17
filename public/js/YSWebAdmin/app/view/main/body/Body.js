'use strict';

Ext.define('YSWebAdmin.view.main.body.Body', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-body',
    itemId:'app-body',
    cls     : 'app-body',
    
   /* controller: 'header',
    viewModel: {
        type: 'header-admin'
    },*/

    layout: 'column',

    items   : [
        {
            xtype       : 'panel',
            columnWidth : .95,
            html        : 'body'
        }
    ]
});
