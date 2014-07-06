'use strict';

Ext.define('YSWeb.view.main.header.AdsHeader', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-adsheader',
    cls: 'app-adsheader',
    
    controller: 'adsheader',
    viewModel: {
        type: 'adsheader'
    },

    layout: 'column',

    border  : false,

    items   : [
        {
            xtype   : 'panel',
            header  : false,
            frame   : false,
            border  : false,
            layout  : 'hbox',
            columnWidth : .8,
            items   : [
                {
                    xtype   : 'tbtext',
                    bind    : {
                        text    : '{adsHeader}'
                    },
                    itemId  : 'adsHeader'
                }
            ]   
        }
    ]
});
