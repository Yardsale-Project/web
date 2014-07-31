'use strict';

Ext.define('YSWeb.view.main.header.Navigation', {
    extend: 'Ext.panel.Panel',

    xtype   : 'app-navigation',
    itemId  : 'navigation',
    hidden  : true,
    cls     : 'app-adsheader app-accountheader',
    
    controller: 'navigation',
    
    viewModel: {
        type: 'navigation'
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
            tbar        : [
                {
                    xtype   : 'button',
                    itemId  : 'btn-categories',
                    bind    : {
                        text    : '{sell}'
                    },
                    cls     : 'linkBtn',
                    menu    : [
                        {
                            bind    : {
                                text    : '{fromInv}'
                            }
                        }, {
                            bind    : {
                                text    : '{addNew}'
                            }
                        }
                    ]
                }
            ]   
        }
    ]
});
