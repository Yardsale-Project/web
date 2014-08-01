'use strict';

Ext.define('YSWeb.view.main.body.Body', {
    extend  : 'Ext.panel.Panel',

    xtype   : 'app-body',
    cls     : 'app-body',

    layout: 'column',
    border  : false,

    bodyPadding : '5 0 0 0',


    items   : [
        {
            xtype       : 'panel',
            cls         : 'bodyContainer',
            border      : false,
            columnWidth : .95,
            layout      : 'hbox',
            items       : [
                {
                    xtype   : 'app-bodyLeft',
                    width   : 250
                }, {
                    xtype   : 'app-bodyCenter',
                    flex    : 1
                }, {
                    xtype   : 'app-bodyRight',
                    width   : 250
                }
            ]
        }
    ]
});
