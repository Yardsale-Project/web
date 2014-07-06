'use strict';

Ext.define('YSWeb.view.main.header.Header', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-header',
    cls: 'app-header',
    
   /* controller: 'main',*/
    viewModel: {
        type: 'header'
    },

    layout: 'column',

    items   : [
        {
            xtype   : 'app-accountheader',
            columnWidth : 1
        }, {
            xtype   : 'app-centerheader',
            columnWidth : 1
        }, {
            xtype   : 'app-adsheader',
            columnWidth : 1
        }
    ]
});
