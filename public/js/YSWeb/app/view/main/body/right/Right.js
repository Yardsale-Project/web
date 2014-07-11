'use strict';

Ext.define('YSWeb.view.main.body.right.Right', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-bodyRight',
    cls: 'app-bodyRight',

    border  : false,

    layout  : 'column',

    shrinkWrap : 2,

    viewModel: {
        type: 'right'
    },

    items   : [
        {
            xtype       : 'panel',
            bind        : {
                title   : '{invite}'
            },
            border      : true,
            columnWidth : 1,
            layout      : 'hbox',
            bodyPadding : 10,
            items       : [
                {
                    xtype   : 'image',
                    src     : YSConfig.url + '/img/admin/icons/facebook-icon_20x20.png',
                    margin   : '0 5 0 0'
                }, {
                    xtype   : 'image',
                    src     : YSConfig.url + '/img/admin/icons/twitter-icon_20x20.png',
                    margin   : '0 5 0 0'
                }
            ]
        }
    ]
});
