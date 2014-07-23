'use strict';

Ext.define('YSWeb.view.main.body.widget.Invite', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-widget-invite',

    viewModel: {
        type: 'invite'
    },

    bind        : {
        title   : '{invite}'
    },
    border      : true,
    layout      : 'hbox',
    bodyPadding : 10,
    items       : [
        {
            xtype   : 'button',
            icon     : YSConfig.url + '/img/admin/icons/facebook-icon_50x50.png',
            margin   : '0 5 0 0',
            scale   : 'large',
            autoWidth : true,
            autoHeight : true,
        }, {
            xtype   : 'image',
            src     : YSConfig.url + '/img/admin/icons/twitter-icon_50x50.png',
            margin   : '0 5 0 0'
        }
    ]
});
