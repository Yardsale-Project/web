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
    _type       : 'invite',
    items       : [
        {
            xtype       : 'button',
            iconCls     : 'fbButton',
            reference   : 'fbButton',
            itemId      : 'fbButton',
            margin      : '0 5 0 0',
            autoWidth   : true,
            autoHeight  : true,
            handler     : 'onFbBtnClck'
        }, {
            xtype       : 'button',
            iconCls     : 'twButton',
            reference   : 'twButton',
            itemId      : 'twButton',
            margin      : '0 5 0 0',
            autoWidth   : true,
            autoHeight  : true
        }
    ]
});
