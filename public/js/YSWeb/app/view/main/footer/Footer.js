'use strict';

Ext.define('YSWeb.view.main.footer.Footer', {
    extend: 'Ext.panel.Panel',

    xtype: 'app-footer',
    cls: 'app-footer',
    
   /* controller: 'main',*/
    viewModel: {
        type: 'footer'
    },

    layout: 'column',

    border  : false,

    items   : [
        {
            xtype   : 'panel',
            id      : 'app-footer-container',
            header  : false,
            columnWidth : .8,
            layout  : 'column',
            items   : [
                {
                    xtype   : 'panel',
                    border  : false,
                    bind    : {
                        title   : '{aboutYardsale}'
                    },
                    layout  : 'vbox',
                    bodyPadding : 5,
                    columnWidth : .25,
                    items   : [
                        {
                            xtype   : 'tbtext',
                            bind    : {
                                text    : '{companyInfo}'
                            }
                        }, {
                            xtype   : 'tbtext',
                            bind    : {
                                text    : '{news}'
                            }
                        }, {
                            xtype   : 'tbtext',
                            bind    : {
                                text    : '{policies}'
                            }
                        }, {
                            xtype   : 'tbtext',
                            bind    : {
                                text    : '{suggestions}'
                            }
                        }
                    ]
                }, {
                    xtype   : 'panel',
                    border  : false,
                    bind    : {
                        title   : '{paymentMethod}'
                    },
                    layout  : 'vbox',
                    bodyPadding : 5,
                    columnWidth : .25,
                    items   : [
                        {
                            xtype   : 'tbtext',
                            bind    : {
                                text    : '{paypal}'
                            }
                        }, {
                            xtype   : 'tbtext',
                            bind    : {
                                text    : '{cod}'
                            }
                        }
                    ]
                }, {
                    xtype   : 'panel',
                    border  : false,
                    bind    : {
                        title   : '{mediaConnection}'
                    },
                    layout  : 'vbox',
                    bodyPadding : 5,
                    columnWidth : .25,
                    items   : [
                        {
                            xtype   : 'button',
                            itemId  : 'fbPost',
                            bind    : {
                                text    : '{fb}'
                            },
                            icon    : YSConfig.url + '/img/admin/icons/facebook-icon_20x20.png',
                            href    : YSConfig.url,
                            hrefTarget: '_parent',
                            cls     : 'shareBtn'
                        }, {
                            xtype   : 'button',
                            itemId  : 'twPost',
                            bind    : {
                                text    : '{tw}'
                            },
                            icon    : YSConfig.url + '/img/admin/icons/twitter-icon_20x20.png',
                            href    : YSConfig.url,
                            hrefTarget: '_parent',
                            cls     : 'shareBtn'
                        }
                    ]
                }, {
                    xtype   : 'panel',
                    border  : false,
                    bind    : {
                        title   : '{download}'
                    },
                    layout  : 'vbox',
                    bodyPadding : 5,
                    columnWidth : .25,
                    items   : [
                        
                    ]
                }
            ]   
        }, {
            xtype   : 'toolbar',
            border  : 'false',
            id      : 'app-footer-container-copyright',
            columnWidth : .8,
            bodyPading : 10,
            dock    : 'bottom',
            items   : [
                '->',
                {
                    xtype   : 'tbtext',
                    bind    : {
                        text    : '{copyright}'
                    }
                }, {
                    xtype   : 'tbtext',
                    bind    : {
                        text    : '{powered}'
                    }
                },
                '->'
            ]
        }
    ]
});
