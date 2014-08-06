'use strict';

Ext.define('YSWeb.view.main.setting.ClientPaypalSettingController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.clientpaypalsetting',

    init : function () {
        this.control({
            
        });
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
    }

});
