'use strict';


Ext.define('YSWeb.view.main.header.CenterHeader', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-centerheader',
    cls: 'app-centerheader',

    requires : [
        'YSCommon.ux.TreePicker'
    ],
    
    controller: 'centerheader',
    viewModel: {
        type: 'centerheader'
    },

    layout  : 'column',
    border  : false,
    padding : '0 0 5 0',

    items   : [
        {
            xtype   : 'toolbar',
            dock    : 'top',
            columnWidth : .95,
            items   : [,
                {
                    xtype   : 'image',
                    //src     : 'http://www.sencha.com/img/20110215-feat-html5.png',
                    src     : YSConfig.url + '/img/admin/logo/logo_1.png',
                    cls     : 'logo'
                }, 
                '->',
                {
                    xtype   : 'form',
                    layout  : 'hbox',
                    items   : [
                        {
                            xtype   : 'textfield',
                            ref     : 'txt-searchBox',
                            width   : 400,
                            name    : 'searchBox',
                            emptyText: 'Seach'
                        }, {
                            xtype   : 'app-treepicker',
                            cls     : 'app-treepicker',
                            text    : 'category',
                            store   : Ext.create('YSCommon.store.CategoryTree'),
                            displayField: 'text',
                            rootVisible : false,
                            emptyText: '--All Categories--',
                            singleExpand : false,
                            margin  : '0 0 0 10',
                            border  : true,
                            enableKeyEvents : true,
                            listeners : {
                                keyup     : 'onKeyUpCategory'
                            }
                        }, {
                            xtype   : 'app-treepicker',
                            cls     : 'app-treepicker',
                            text    : 'location',
                            store   : Ext.create('YSWeb.store.LocationTree'),
                            displayField: 'text',
                            rootVisible : false,
                            emptyText: '--All Locations--',
                            margin  : '0 0 0 10',
                            border  : true,
                            maxPickerHeight : 200,
                            singleExpand : false,
                            enableKeyEvents : true,
                            listeners : {
                                keyup     : 'onKeyUpLocation'
                            }
                        }, {
                            xtype   : 'button',
                            margin  : '0 0 0 10',
                            bind    : {
                                text : '{searchText}'
                            }
                        }
                    ]
                }
            ]  
        }
    ]
});
