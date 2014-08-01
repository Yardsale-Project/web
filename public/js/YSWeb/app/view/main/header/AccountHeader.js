'use strict';

Ext.define('YSWeb.view.main.header.AccountHeader', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-accountheader',
    cls: 'app-accountheader',
    
    controller: 'accountheader',
    viewModel: {
        type: 'accountheader'
    },

    layout: 'column',

    border  : true,

    items   : [
        {
            xtype   : 'toolbar',
            dock    : 'top',
            columnWidth : .95,
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
                    itemId  :'accountBtn',
                    reference: 'accountBtn',
                    hidden  : true,
                    text    : '',
                    menu    : [
                        {
                            text    : 'Logout',
                            handler : 'onLogoutMenuClick'
                        }
                    ]
                }, {
                    xtype   : 'hiddenfield',
                    itemId  : 'logoutToken',
                    reference: 'logoutToken'
                }, {
                    xtype   : 'button',
                    cls     : 'linkBtn',
                    itemId  :'signInBtn',
                    reference: 'signInBtn',
                    bind    : {
                        text    : '{signIn}'
                    },
                    handler: 'onClickSigninBtn'
                }, {
                    xtype   : 'tbtext',
                    bind    : {
                        text    : '{or}'
                    },
                    itemId  :'orTbText',
                    reference: 'orTbText'
                }, {
                    xtype   : 'button',
                    cls     : 'linkBtn',
                    bind    : {
                        text    : '{register}'
                    },
                    handler: 'onClickRegisterBtn',
                    itemId  :'registerBtn',
                    reference:'registerBtn'
                }
            ]   
        }
    ]
});
