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
            height  : 50,
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
                                    name    : 'searchBox'
                                }, {
                                    xtype   : 'label',
                                    text    : 'category'
                                }, {
                                    xtype   : 'label',
                                    text    : 'location'
                                }, {
                                    xtype   : 'button',
                                    text    : 'Seach'
                                }
                            ]
                        },
                        '->',
                        {
                            xtype   : 'label',
                            text    : 'login'
                        }
                    ]
                }
            ]
        }
    ]
});
