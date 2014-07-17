'use strict';

Ext.define('YSWebAdmin.view.main.footer.Footer', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-footer',
    cls     : 'app-footer',
    
   /* controller: 'header',
    viewModel: {
        type: 'header-admin'
    },*/

    layout: 'column',

    items   : [
        {
            xtype       : 'panel',
            columnWidth : .95,
            html        : 'footer'
        }
    ]
});
