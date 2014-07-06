'use strict';

Ext.define('YSWeb.view.main.body.left.Left', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-bodyLeft',
    cls: 'app-bodyLeft',

    border  : false,

    layout  : 'column',
    shrinkWrap : 2,

    controller: 'left',

    viewModel: {
        type: 'left'
    },

    items   : [
        {
            xtype       : 'treepanel',
            itemId      : 'categoryPanel',
            bind        : {
                title   : '{categories}'
            },
            border      : true,
            columnWidth : 1,
            rootVisible : false,
            store       : Ext.create('YSCommon.store.CategoryTree'),
            lines       : false
        }, {
            xtype       : 'panel',
            itemId      : 'newsletter',
            bind        : {
                title   : '{newsletter}'
            },
            columnWidth : 1,
            border      : true,
            layout      : 'hbox',
            bodyPadding : 5,
            items       : [
                {
                    xtype   : 'form',
                    layout  : 'column',
                    items   : [
                        {
                            xtype   : 'textfield',
                            name    : 'newsletteremail',
                            emptyText : 'Email',
                            columnWidth   : 100
                        }, {
                            icon: null,
                            glyph: 91,
                            xtype: 'button',
                            margin : '0 0 0 2'
                        }
                    ]
                }
            ]
        }
    ]
});
