'use strict';


Ext.define('YSWeb.view.main.header.CenterHeader', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-centerheader',
    cls: 'app-centerheader',

    requires : [
        'YSCommon.ux.TreePicker'
    ],
    
   /* controller: 'main',*/
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
            columnWidth : .8,
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
                            margin  : '0 0 0 10'
                        }, {
                            xtype   : 'combobox',
                            store : {
                                type: 'states'
                            },
                            reference   : 'states',
                            displayField: 'state',
                            valueField  : 'abbr',
                            filterPickList: true,
                            queryMode   : 'local',
                            multiSelect : true,
                            emptyText   : '--All Locations--',
                            margin  : '0 0 0 10'
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
