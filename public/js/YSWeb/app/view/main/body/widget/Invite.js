'use strict';

Ext.define('YSWeb.view.main.body.widget.Invite', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-widget-invite',
    cls     : 'app-widget-invite',

    controller : 'invite',

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
            xtype       : 'button',
            iconCls     : 'fbButton',
            margin      : '0 5 0 0',
            autoWidth   : true,
            autoHeight  : true,
            handler     : 'onFbBtnClck'
        }, {
            xtype       : 'button',
            iconCls     : 'twButton',
            margin      : '0 5 0 0',
            autoWidth   : true,
            autoHeight  : true
        }
    ]
});
