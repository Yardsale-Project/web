'use strict';

Ext.define('YSWeb.view.main.chat.Chat', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-chat',
    cls: 'app-chat',

    border  : false,

    layout  : 'column',
    width   : 400,

    controller : 'chat',

    items   : [
        {
            xtype       : 'panel',
            itemId      : 'messageContent',
            reference   : 'messageContent',
            hideHeader  : true,
            columnWidth : 1,
            border      : true,
            frame       : true,
            height      : 400,
            tpl         : '<p>{data}</p>',
            tplWriteMode: 'append',
            autoScroll  : true,
            bodyPadding : 5,
            layout      : 'column',
            bbar        : [
                {
                    xtype       : 'textfield',
                    itemId      : 'message',
                    width       : 380,
                    enableKeyEvents : true,
                    listeners: {
                        specialkey: 'onEnterPress',
                        keypress  : 'onKeyPress'
                    }
                }
            ]
        }, {
            xtype   : 'tbtext',
            padding : '0 0 0 10',
            cls     : 'isTyping',
            reference: 'isTyping',
            columnWidth : 1,
        }
    ]
});
