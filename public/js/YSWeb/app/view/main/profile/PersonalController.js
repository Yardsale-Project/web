'use strict';

Ext.define('YSWeb.view.main.profile.PersonalController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.personal',

    init : function () {
        this.control({
            'app-personal' : {
                activate    : 'onFormActivate',
                deactivate  : 'onFormDeactivate'
            },
            'app-clientpaypalsetting' : {
                activate    : 'onPaypalSettingActivate',
                deactivate  : 'onPaypalSettingDectivate'
            }
        });
    },

    onPaypalSettingActivate : function() {
        var form = this.view.getForm();

        form.load({
            url     : YSConfig.url + '/application/user/getPaymentSettings'
        });
    },

    onPaypalSettingDectivate : function() {
        var form = this.view.getForm();

        if(form.isValid()) {
            form.submit({
                url : YSConfig.url + '/application/payment/savePPSetting',
                params  : {
                    saveOnly : 1
                }
            });
        }
        YSDebug.log('paypal form deactivate');
    },

    onFormActivate : function() {
        YSDebug.log('form activate');

        var form = this.view.getForm();

        form.load({
            url     : YSConfig.url + '/application/user/getUserInfo'
        });

       /* Ext.Ajax.request({
            url     : YSConfig.url + '/application/user/getUserInfo',
            success : function(response) {
                var rsp = Ext.JSON.decode(response.responseText);

                form.loadData(rsp.result);
            }
        });*/
    },

    onFormDeactivate : function() {

        var form = this.view.getForm();

        if(form.isValid()) {
            form.submit({
                url : YSConfig.url + '/application/user/saveUserInfo'
            });
        }
        YSDebug.log('form deactivate');
    }, 

    onResetBtnClick : function() {
        this.view.getForm().reset();
    },

    onCheckBoxChange : function(chkBox, newValue) {
        var pppassword = this.lookupReference('pppassword');

        if(newValue) {
            pppassword.allowBlank = false;
            pppassword.show();
        } else {
            pppassword.allowBlank = true;
            pppassword.hide();
        }
    },

    onSaveBtnClick : function() {
        var form = this.view.getForm();
        var me = this;

        var object  = this.view._obj,
            itmId = object.view._itmId,
            price = object.lookupReference('price'),
            quantity = object.lookupReference('quantity');

        if(form.isValid()) {
            form.submit( {
                url     : YSConfig.url + '/application/payment/savePPSetting',
                waitMsg : 'Saving setting...',
                params  : {
                    itmId       : itmId,
                    price       : price.getValue(),
                    quantity    : quantity.getValue()
                },
                success : function( frm, action ) {

                    var payKey = action.result.payKey;
                    var submitBtn = document.getElementById('submitBtn');
                    var paykeyEl = document.getElementById('paykey');
                    //

                    paykeyEl.value = payKey;
                    submitBtn.click();

                    form.reset();
                    me.view.up('window').close();


                },
                failure : function( frm, action ) {
                    YSDebug.log(action.result);
                    Ext.Msg.show({
                        title       : 'Setting',
                        msg         : action.result.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();
                            }
                        }, 
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            });
        }
    },

    onCountrySelect : function(cbo, records) {
        var store = this.lookupReference('state').getStore();

        var newValue = records[0].data.id;

        store.on('beforeload', function(str, op) {
            var filter = {
                "op": "AND",
                "set": [
                    {
                        "field": "country_id",
                        "bitOp": "EQ",
                        "value": newValue
                    }
                ]
            }

            op.setParams( {
                filter: Ext.encode( filter )
            } );
        });

        store.load();

        this.lookupReference('state').enable();
    },

    onStateSelect : function(cbo, records) {
        var store = this.lookupReference('city').getStore();
        var newValue = records[0].data.id;

        store.on('beforeload', function(str, op) {
            var filter = {
                "op": "AND",
                "set": [
                    {
                        "field": "state_id",
                        "bitOp": "EQ",
                        "value": newValue
                    }
                ]
            }

            op.setParams( {
                filter: Ext.encode( filter )
            } );
        });

        store.load();

        this.lookupReference('city').enable();
    }

});
