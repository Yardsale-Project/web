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
            border      : false,
            columnWidth : 1,
            html        : 'right panel'
        }
    ]
});
