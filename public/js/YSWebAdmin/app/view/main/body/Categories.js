'use strict';

Ext.define('YSWebAdmin.view.main.body.Categories', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-categories',
    itemId:'app-categories',
    cls     : 'app-categories',
    
    controller: 'categories',
    viewModel: {
        type: 'categories'
    },

    columnWidth : .95,
    layout: 'hbox',
    border  : false,

    items   : [
        {
            xtype       : 'treepanel',
            itemId      : 'categoryPanel',
            reference   : 'categoryPanel',
            bind        : {
                title   : '{categories}'
            },
            border      : true,
            rootVisible : false,
            store       : Ext.create('YSCommon.store.CategoryTree'),
            lines       : false,
            width       : 300,

            tbar        : [
                {
                    xtype   : 'button',
                    itemId  : 'addRootCategory',
                    bind    : {
                        text    : '{addRootCategory}'
                    }
                }, {
                    xtype   : 'button',
                    itemId  : 'addSubCategory',
                    reference:'addSubCategoryBtn',
                    disabled: true,
                    bind    : {
                        text    : '{addSubCategory}'
                    }
                }
            ]
        }, {
            xtype       : 'app-category',
            flex        : 1,
            reference   : 'categoryInfo',
            padding     : 5
        }
    ]
});
