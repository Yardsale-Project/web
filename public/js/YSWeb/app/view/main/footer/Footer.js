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
                            /*href    : YSConfig.url,
                            hrefTarget: '_parent',*/
                            cls     : 'shareBtn',
                            handler : function() {
                                window.fbAsyncInit = function() {
                                    FB.init(
                                        {
                                            appId      : '266620273529963',
                                            xfbml      : false,
                                            version    : 'v2.0',
                                            redirect_uri    : 'http://yardsale.druidinc.com/' 
                                        }
                                    );

                                    FB.getLoginStatus(function(response) {
                                        if (response.status === 'connected') {
                                          // Logged into your app and Facebook.
                                            FB.ui({
                                                method        : 'share_open_graph',
                                                action_type   : 'og.share',
                                                action_properties: JSON.stringify({
                                                    object  : 'http://yardsale.druidinc.com/',
                                                    message : 'this is a message',
                                                    scrape  : 'true',
                                                    image   : 'http://yardsale.druidinc.com/img/admin/logo/logo_1.png'
                                                })
                                            }, function(response){});
                                        } else if (response.status === 'not_authorized') {
                                          // The person is logged into Facebook, but not your app.
                                          //document.getElementById('status').innerHTML = 'Please log ' +
                                            //'into this app.';

                                        } else {
                                          // The person is not logged into Facebook, so we're not sure if
                                          // they are logged into this app or not.
                                            FB.login(function(response) {
                                                FB.ui({
                                                    method        : 'share_open_graph',
                                                    action_type   : 'og.share',
                                                    action_properties: JSON.stringify({
                                                        object  : 'http://yardsale.druidinc.com/',
                                                        message : 'this is a message',
                                                        scrape  : 'true',
                                                        image   : 'http://yardsale.druidinc.com/img/admin/logo/logo_1.png'
                                                    })
                                                }, function(response){});
                                            });
                                        }
                                    });
                                };

                                (   
                                    function(d, s, id) {
                                        var js, 
                                            fjs = d.getElementsByTagName(s)[0];
                                 
                                        if ( d.getElementById(id) ) {
                                            return;
                                        }
                                 
                                        js      = d.createElement(s); 
                                        js.id   = id;
                                        js.src  = "//connect.facebook.net/en_US/sdk.js";
                                        fjs.parentNode.insertBefore(js, fjs);
                                    }   (document, 'script', 'facebook-jssdk')
                                );
                            }
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
