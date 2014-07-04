'use strict';

Ext.define('YSWeb.view.main.header.AccountHeader', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-accountheader',
    cls: 'app-accountheader',
    
   /* controller: 'main',*/
    viewModel: {
        type: 'accountheader'
    },

    layout: 'column',

    border  : true,

    items   : [
        {
            xtype   : 'toolbar',
            dock    : 'top',
            columnWidth : .8,
            items   : [
                '->',
                {
                    xtype   : 'button',
                    cls     : 'linkBtn',
                    bind    : {
                        text    : '{aboutUs}'
                    }
                },
                '-',
                {
                    xtype   : 'tbtext',
                    bind    : {
                        text    : '{hi}'
                    }
                }, {
                    xtype   : 'button',
                    cls     : 'linkBtn',
                    bind    : {
                        text    : '{signIn}'
                    }
                }, {
                    xtype   : 'tbtext',
                    bind    : {
                        text    : '{or}'
                    }
                }, {
                    xtype   : 'button',
                    cls     : 'linkBtn',
                    bind    : {
                        text    : '{register}'
                    }
                }
            ]   
        }
    ]
});
