'use strict';

Ext.define('YSWeb.view.main.Header', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-header',
    cls: 'app-header',
    
   /* controller: 'main',*/
    viewModel: {
        type: 'header'
    },

    layout: 'fit',

    items   : [
        {
            header  : false,
            height  : 70,
            border  : true,
            dockedItems : [
                {
                    xtype   : 'toolbar',
                    dock    : 'top',
                    items   : [,
                        {
                            xtype   : 'image',
                            src     : 'http://www.sencha.com/img/20110215-feat-html5.png',
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
                                    width   : 500,
                                    name    : 'searchBox',
                                    emptyText: 'Seach'
                                }, {
                                    xtype   : 'combobox',
                                    text    : 'category',
                                    store : {
                                        type: 'app-categoryStore'
                                    },
                                    valueField: 'id',
                                    tpl: Ext.create('Ext.XTemplate',
                                        '<tpl for=".">',
                                            '<tpl if="parentId == 0">',
                                                '<div class="x-boundlist-item"><b>{name}</b></div>',
                                            '<tpl else>',
                                                '<div class="x-boundlist-item"><dd>{name}</dd></div>',
                                            '</tpl>',
                                        '</tpl>'
                                    ),
                                    displayTpl: Ext.create('Ext.XTemplate',
                                        '<tpl for=".">',
                                            '{name}',
                                        '</tpl>'
                                    ),
                                    emptyText: '--All Categories--'
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
                                    emptyText   : '--All Locations--'
                                }, {
                                    xtype   : 'button',
                                    margin  : '0 0 0 10',
                                    bind    : {
                                        text : '{searchText}'
                                    }
                                }
                            ]
                        },
                        '->',
                        {
                            xtype   : 'button',
                            bind    : {
                                text : '{loginText}'
                            }
                        }
                    ]
                }
            ]
        }
    ]
});
