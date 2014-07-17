'use strict';

Ext.define('YSWebAdmin.view.main.body.Categories', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-categories',
    itemId:'app-categories',
    cls     : 'app-categories',
    
   /* controller: 'header',*/
    viewModel: {
        type: 'categories'
    },

    columnWidth : .95,
    layout: 'hbox',
    border  : true,

    items   : [
        {
            xtype       : 'treepanel',
            itemId      : 'categoryPanel',
            bind        : {
                title   : '{categories}'
            },
            border      : true,
            rootVisible : false,
            store       : Ext.create('YSCommon.store.CategoryTree'),
            lines       : false,
            width       : 210
        }, {
            xtype       : 'panel',
            html        : 'add',
            flex        : 1
        }
    ]
});
