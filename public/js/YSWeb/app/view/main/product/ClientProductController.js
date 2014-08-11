'use strict';

Ext.define('YSWeb.view.main.product.ClientProductController', {
    extend: 'Ext.app.ViewController',
    alternateClassName  : ['YSClientProductController'],

    alias: 'controller.clientproduct',

    init : function () {
        this.control({
            'app-clientproduct' : {
                beforerender : 'onBeforeRender'
            },
            'app-clientproduct #payNowBtn' : {
                afterrender : 'onAfterRenderForm'
            },

            'app-signin' : {
                beforerender : 'onTokenBeforeRender'
            }
        });

        this.reader = null;
    },

    onTokenBeforeRender : function() {
        YSDebug.log('view', this.lookupReference('token'));

        this.requestCSRFToken(this, this.lookupReference('token'));

        
    },

    requestCSRFToken : function(cmp, field) {

        var me = cmp;

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/user/generateToken',
            success : function(response) {
                var rsp = Ext.JSON.decode(response.responseText);

                if(rsp.success)
                {
                    YSDebug.log('success', rsp);
                    me.token = rsp.token;
                    field.setValue(rsp.token);
                }
            },
            failure : function(response) {

            }
        });
    },

    onBeforeRender : function() {
        YSDebug.log('item id',this.view._itmId);

        this.getProduct(this.view._itmId, this.view._itmCd);
    },

    getProduct : function(id, code) {
        var me = this;

        YSDebug.log('Get Product');
        Ext.Ajax.request({
            url     : YSConfig.url + '/application/product/getProduct',
            params  : {
                id : id,
                code : code
            },
            success : function(response) {
                var rsp = Ext.JSON.decode(response.responseText);

                if(rsp.success)
                {
                    YSDebug.log('success', rsp);

                    var prod = rsp.result;

                    var id              = me.lookupReference('id'),
                        title           = me.lookupReference('title'),
                        imguserpicture  = me.lookupReference('imguserpicture'),
                        thumbPrice      = me.lookupReference('thumbPrice'),
                        price           = me.lookupReference('price'),
                        quantity        = me.lookupReference('quantity'),
                        description     = me.lookupReference('description');

                    YSDebug.log('prod', prod);

                    if(prod.hasOwnProperty('id')) {
                        id.setValue(prod.id);
                        title.setText(prod.productName);
                        imguserpicture.setSrc('http://local.main.yardsale:8181/img/product/' + prod.image);
                        thumbPrice.setText('Php ' + prod.currentPrice);
                        price.setValue(prod.currentPrice);
                        description.setText(prod.description);
                    } else {
                        me.getView().removeAll();
                        me.getView().update('<h1>Sorry. No such product exist.</h1>');
                    }

                }
            },
            failure : function(response) {

            }
        });
    },


    onAfterRenderForm: function() {
        if(YSConfig.loggedin) {
            /*var paykey = Ext.fly('paykey');
            var submitBtn = Ext.fly('submitBtn');

            paykey.dom.value = '1321324';
            YSDebug.log('paykey.value',paykey.dom.value);*/

            //submitBtn.dom.click();
        }
    },

    onPPBtnClick : function() {
        //check if there is paypal account set

        Ext.Msg.show({
            msg         : 'Getting payment information',
            progress    : true
        });
        if(!YSCommon.loggedin) {
            UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutCallback);
        } else {
            Paypal.getPaypalAccount(this, this.withAccountCallback, this.noAccountCallback);
        }
        
    },

    loggedInCallback : function(object,rsp) {
        Paypal.getPaypalAccount(object, object.withAccountCallback, object.noAccountCallback);
    },

    loggedOutCallback : function(object,rsp) {
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
                    controller : 'clientproduct',
                    _obj      : object,
                    buttons     : [
                        {
                            text    : 'Login',
                            handler : 'onLoginBtnClick'
                        }, {
                            text    : 'Cancel',
                            handler : 'onCancelBtnClick'
                        }
                    ]
                }
            ]
        }).show();
    },

    onLoginBtnClick : function() {
        var me = this;
        var form = me.view.getForm();
        var accountBtn,
            signInBtn,
            orTbText,
            registerBtn,
            logoutToken,
            navigation;

        if( form.isValid()) {
            form.submit({
                url     : YSConfig.url + '/application/user/loginUser',
                waitMsg : 'Logging in...',
                success : function( frm, action ) {
                    accountBtn  = Ext.ComponentQuery.query('#accountBtn')[0];
                    signInBtn   = Ext.ComponentQuery.query('#signInBtn')[0];
                    orTbText    = Ext.ComponentQuery.query('#orTbText')[0];
                    registerBtn = Ext.ComponentQuery.query('#registerBtn')[0];
                    logoutToken = Ext.ComponentQuery.query('#logoutToken')[0];
                    navigation = Ext.ComponentQuery.query('#navigation')[0];

                    accountBtn.setText( me.lookupReference('email').getValue() );

                    signInBtn.hide();
                    orTbText.hide();
                    registerBtn.hide();
                    accountBtn.show();
                    navigation.show();

                    me.requestCSRFToken(this, logoutToken);
                    
                    form.reset();
                    me.view.up('window').close();

                    Paypal.getPaypalAccount(me._obj, me.withAccountCallback, me.noAccountCallback);
                },
                failure : function( frm, action ) {
                    YSDebug.log(action.result);
                    Ext.Msg.show({
                        title       : 'Sign in',
                        msg         : action.result.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();
                                me.lookupReference('token').setValue(me.token);
                            }
                        }, 
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            });
        }
    },

    onCancelBtnClick : function() {
        var form = this.view.getForm();

        form.reset();
        this.view.up('window').close();
    },

    withAccountCallback : function(obj, rsp) {

        obj.ppEmail = rsp.email;



        Ext.Ajax.request({
            url     : YSConfig.url + '/application/payment/getPayKey',
            waitMsg : 'Getting paypal info...',
            method  : 'POST',
            params  : {
                itmId       : obj.view._itmId,
                price       : obj.view.lookupReference('price').getValue(),
                quantity    : obj.view.lookupReference('quantity').getValue()
            },
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);

                if(rsp.success)
                {
                    var payKey = rsp.payKey;
                    var submitBtn = document.getElementById('submitBtn');
                    var paykeyEl = document.getElementById('paykey');

                    Ext.Msg.hide();

                    paykeyEl.value = payKey;
                    submitBtn.click();
                } else {
                    YSDebug.log('failed', rsp.success);

                    Ext.Msg.show({
                        title       : 'Paypal Account Info',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            }
        });
    },

    noAccountCallback : function(obj, rsp) {

        Ext.Msg.hide();
        
        Ext.create('Ext.window.Window', {
            modal   : true,
            resizable: false,
            closeAction: 'destroy',
            layout  : 'fit',

            items   : [{
                xtype   : 'app-clientpaypalsetting',
                _obj    : obj,
                buttons     : [
                    {
                        bind    : {
                            text    : '{save}'
                        },
                        handler : 'onSaveBtnClick'
                    }, {
                        bind    : {
                            text    : '{reset}'
                        },
                        handler : 'onResetBtnClick'
                    }
                ]
            }]
        }).show();
    },

    onCloseBtnClick : function() {
        this.view.up('window').close();
    }
});
