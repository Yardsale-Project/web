'use strict';

Ext.define('YSWeb.view.main.login.RegisterController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.register',

    init : function() {
    	this._me = this;
    },

    onSubmitBtnClick : function() {
    	var me = this;
    	var form = me.view.getForm();

    	if( form.isValid()) {
    		form.submit({
    			url 	: YSConfig.url + '/application/user/registerUser',
    			waitMsg : 'Registering new user...',
    			success : function( frm, action ) {
			    	Ext.Msg.show({
						title      	: 'Register User',
			           	msg        	: action.result.message,
			           	buttons    	: Ext.MessageBox.OK,
			           	fn 			: function(btn) {
			           		if(btn === 'ok') {
			           			form.reset();
			    				me.view.up('window').close();
			           		}
			           	},
			           	icon       	: Ext.MessageBox.INFO
			        });
			    },
    			failure : function( frm, action ) {
			    	Ext.Msg.show({
						title      	: 'Register User',
			           	msg        	: action.result.errorMessage,
			           	buttons    	: Ext.MessageBox.OK,
			           	fn 			: function(btn) {
			           		if(btn === 'ok') {
			           			form.reset();
			           		}
			           	}, 
			           	icon       	: Ext.MessageBox.ERROR
			        });
			    }
    		});
    	}
    },

    onCancelBtnClick : function() {
    	this.view.up('window').close();	
    }
});
