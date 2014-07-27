'use strict';

Ext.define('YSWeb.view.main.body.widget.InviteController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.invite',



    init : function () {
        this.control({
        });

        this.fbids = [];
        this.fbUserIds = [];
        this.fbIdIndex = 0;
        this.intervalId = 0;
        this.offset = 50;
        this.timeout = 0;
        this.numResponses = 0;
        this.expectedCalls = 0;
        this.expectedIntCalls = 0;

        this.gridStore =  Ext.create('Ext.data.Store', {
            fields  : [
                'id', 'name', 'active'
            ],
            data : [
            ]
        });

        this.gridWindow = Ext.create('Ext.window.Window', {
            modal : true,
            closeAction : 'destroy',
            layout  : 'fit',
            items   : [
                {
                    xtype   : 'grid',
                    columns : [
                        {
                            xtype   : 'checkcolumn',
                            dataIndex : 'active'
                        }, {
                            header  : 'name',
                            dataIndex : 'name'
                        }
                    ],
                    store : Ext.create('Ext.data.Store', {
                        fields  : [
                            'id', 'name', 'active'
                        ],
                        data : [
                        ]
                    }),
                    buttons     : [
                        {
                            text : 'OK'
                        }, {
                            text : 'Cancel'
                        }
                    ]
                }
            ]
        });
    },

    onFbBtnClck : function() {
        UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutCallback);
    },

    loggedInCallback : function(obj, resp) {
        FB.getLoginStatus(function(response) {
            obj.statusChangeCallback(obj, response);
        });
    },

    statusChangeCallback : function(obj, response) {
        if (response.status === 'connected') {

            obj.getFriendsToMessage();
            
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.

            FB.login(
                function(response) {
                    // handle the response
                    if (response.status === 'connected') {
                        obj.getFriendsToMessage();
                    } else if (response.status === 'not_authorized') {
                        // The person is logged into Facebook, but not your app.
                    } else {
                        // The person is not logged into Facebook, so we're not sure if
                        // they are logged into this app or not.
                    }
                }, {scope: 'xmpp_login, user_friends, publish_actions'}
            );
        }
    },

    loggedOutCallback : function(obj, resp) {

        var me = this;

        Ext.create('Ext.window.Window', {
            modal       : true,
            resizable   : false,
            layout      : 'fit',
            closable    : false,
            closeAction : 'destroy',
            draggable   : false,
            width       : 400,
            

            title       : 'Sign in',

            items       : [
                {
                    xtype   : 'app-signin',
                    buttons     : [
                        {
                            text    : 'Login',
                            handler : 'onFbLoginBtnClick'
                        }, {
                            text    : 'Cancel',
                            handler : 'onCancelBtnClick'
                        }
                    ]
                }
            ]
        }).show();
    },

    getFriendsToMessage : function() {
        var me = this;

        FB.api('/me/taggable_friends', function(response) {

            Ext.Msg.show({
                message : 'Getting facebook friends...',
                progressText: 'Saving...',
                width:300,
                wait: {
                    interval:500
                }
            });


            for(index in response.data) {
                var data = response.data[index];
                var picUrl = data.picture.data.url;

                var explodedPicUrl = picUrl.split('/');
                var picName = explodedPicUrl[ explodedPicUrl.length - 1];
                var explodedPicName = picName.split('_');
                var fbid = explodedPicName[1];

                me.fbids.push(fbid);
            }

            me.expectedCalls = me.fbids.length / me.offset;
            me.expectedIntCalls = parseInt(me.expectedCalls);

            FB.ui({
                method: 'send',
                to : ["100005085874306","100005173267977","100005289102411","100005289878861","100005519442212","100005720496042","100005736870052","100005743688671","100005750709582","100005849622044","100005870462854","100005938628638","100006061151415","100006141311550","100006273910523","100006315519775","100006368703067","100006430277556","100006451358964","100006646143592","100006699663250","100006752221763","100006774876147","100006791893496","100007001261527","100007309684644","100007487887245","100007488816666","100007562732794","100007596480886","100008084430390","100008100093635","100008117704784","100008143243071","100008181156591","100008224689688"],
                link: 'http://yardsale.druidinc.com',
            });
            

            /*me.intervalId = setInterval(
                function() {
                    me.getFbFrienduserid(me);
                }, 100
            );*/
        });
    },

    getFbFrienduserid : function(obj) {

        obj.timeout += 60000;
        
        if(obj.fbids.length > 0) {

            var numItems;

            if(obj.fbids.length > obj.offset) {
                numItems = obj.offset;
            } else {
                numItems = obj.fbids.length;
            }

            var fbidArr = obj.fbids.splice(0, numItems);

            Ext.Ajax.request({
                url     : YSConfig.url + '/application/facebook/fbInvite',
                timeout : obj.timeout,
                params  : {
                    fbids : Ext.encode(fbidArr),
                    count : fbidArr.length
                },
                success : function(response) {
                    

                    var result = Ext.JSON.decode(response.responseText);
                    var arrFbUserId = result.fbUserIds;

                    obj.fbUserIds = obj.fbUserIds.concat(arrFbUserId);

                    obj.numResponses++;

                    if(obj.expectedCalls > obj.expectedIntCalls) {
                        if(obj.numResponses > obj.expectedIntCalls) {
                            clearInterval(obj.intervalId);

                            Ext.Msg.hide();
                            FB.ui({
                                method: 'send',
                                to : obj.fbUserIds,
                                link: 'http://yardsale.druidinc.com',
                                display : 'popup'
                            });
                        }
                    } else {
                        if(obj.numResponses >= obj.expectedIntCalls) {
                            clearInterval(obj.intervalId);

                            Ext.Msg.hide();
                            FB.ui({
                                method: 'send',
                                to : obj.fbUserIds,
                                link: 'http://yardsale.druidinc.com',
                                display : 'popup'
                            });
                        }
                    }
                },
                failure : function(response) {
                    
                    obj.numResponses++;

                    if(obj.expectedCalls > obj.expectedIntCalls) {
                        if(obj.numResponses > obj.expectedIntCalls) {
                            clearInterval(obj.intervalId);

                            Ext.Msg.hide();
                            FB.ui({
                                method: 'send',
                                to : obj.fbUserIds,
                                link: 'http://yardsale.druidinc.com',
                            });
                        }
                    } else {
                        if(obj.numResponses >= obj.expectedIntCalls) {
                            clearInterval(obj.intervalId);

                            Ext.Msg.hide();
                            FB.ui({
                                method: 'send',
                                to : obj.fbUserIds,
                                link: 'http://yardsale.druidinc.com',
                            });
                        }
                    }
                }
            });
        } else {
            clearInterval(obj.intervalId);
        }
    }
});
