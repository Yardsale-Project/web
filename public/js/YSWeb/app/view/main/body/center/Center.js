'use strict';

Ext.define('YSWeb.view.main.body.center.Center', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-bodyCenter',
    cls: 'app-bodyCenter',

    border  : false,

    layout  : 'column',

    controller: 'center',

    /*requires    : [
        'YSWeb.view.main.product.thumbnail.GridView'
    ],*/

    viewModel: {
        type: 'center'
    },

    shrinkWrap : 2,

    items   : [
        {
            xtype       : 'panel',
            border      : false,
            columnWidth : 1,
            bodyPadding : '0 5 0 5',
            layout      : 'column',
            items       : [
                {
                    xtype   : 'toolbar',
                    dock    : 'top',
                    itemId  : 'breadcrumb',
                    cls     : 'breadcrumb',
                    columnWidth : 1,
                    items   : [
                        {
                            xtype   : 'tbtext',
                            text    : 'Home'
                        }, {
                            xtype   : 'tbtext',
                            text    : '>'
                        }, {
                            xtype   : 'tbtext',
                            text    : 'All Categories'
                        }
                    ] 
                }, {
                    xtype   : 'panel',
                    header  : false,
                    itemId  : 'viewSettings',
                    columnWidth : 1,
                    layout  : 'hbox',
                    border  : true,
                    bodyPadding : 5,
                    items   : [
                        {
                            xtype   : 'combobox',
                            bind    : {
                                fieldLabel : '{order}'
                            }
                        }, {
                            xtype   : 'segmentedbutton',
                            margin  : '0 0 0 5',
                            enableToggle: true,
                            items   : [
                                {
                                    bind    : {
                                        text    : '{grid}'
                                    },
                                    pressed     : true,
                                    enableToggle: true,
                                    listeners   : {
                                        render  : 'onGridViewBtnRender'
                                    }
                                }, {
                                    bind    : {
                                        text    : '{list}'
                                    }
                                }
                            ],
                            listeners   : {
                                toggle  : 'onSegmentedBtnToggle'
                            }
                        }
                    ]
                }, {
                    xtype   : 'panel',
                    itemId  : 'productsViewContainer',
                    id      : 'productsViewContainer',
                    reference    : 'productsViewContainer',
                    border  : false,
                    columnWidth : 1,
                    overflowY : 'auto',
                    overflowX : 'auto',
                    layout  : 'column'
                }
            ]
        }
    ]
});
