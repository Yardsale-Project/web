'use strict';

Ext.define('YSWeb.view.main.header.CenterHeader', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-centerheader',
    cls: 'app-centerheader',

    requires : [
        'YSCommon.config.Config'
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
                    src     : 'http://www.sencha.com/img/20110215-feat-html5.png',
                    //src     : YSCommon.config.Config.url + '/img/userPic/2014_03_15_admin2.jpg',
                    cls     : 'logo'
                }, {
                    xtype   : 'tbtext',
                    bind    : {
                        text    : '{title}'
                    },
                    cls     : 'title'
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
                            xtype   : 'combobox',
                            text    : 'category',
                            store : {
                                type: 'app-categoryStore'
                            },
                            valueField  : 'id',
                            tpl         :   Ext.create('Ext.XTemplate',
                                                '<tpl for=".">',
                                                    '<tpl if="parentId == 0">',
                                                        '<div class="x-boundlist-item"><b>{text}</b></div>',
                                                    '<tpl else>',
                                                        '<div class="x-boundlist-item"><dd>{text}</dd></div>',
                                                    '</tpl>',
                                                '</tpl>'
                                            ),
                            displayTpl  :   Ext.create('Ext.XTemplate',
                                                '<tpl for=".">',
                                                    '{text}',
                                                '</tpl>'
                                            ),
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