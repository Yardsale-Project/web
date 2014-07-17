'use strict';

Ext.define('YSWebAdmin.view.main.header.Header', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-header',
    cls: 'app-header app-centerheader app-accountheader',
    
    controller: 'header',
    viewModel: {
        type: 'header-admin'
    },

    layout: 'column',

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
                    xtype   : 'tbtext',
                    bind    : {
                        text    : '{hi}'
                    }
                }, {
                    xtype   : 'button',
                    cls     : 'linkBtn',
                    itemId  :'accountBtn',
                    reference: 'accountBtn',
                    hidden  : false,
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
                }
            ]  
        }, {
            xtype       : 'app-navigation',
            columnWidth : .95
        }
    ]
});
