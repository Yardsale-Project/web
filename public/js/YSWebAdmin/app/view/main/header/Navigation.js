'use strict';

Ext.define('YSWebAdmin.view.main.header.Navigation', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-navigation',
    cls: 'app-navigation',
    
   /* controller: 'header',
    viewModel: {
        type: 'header-admin'
    },*/

    layout: 'column',

    items   : [
        {
            xtype       : 'panel',
            columnWidth : 1,
            tbar        : [
                {
                    xtype   : 'button',
                    itemId  : 'btn-categories',
                    text    : 'Categories',
                    cls     : 'linkBtn'
                }
            ]
        }
    ]
});
