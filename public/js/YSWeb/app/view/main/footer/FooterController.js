'use strict';

Ext.define('YSWeb.view.main.footer.FooterController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.footer',

    init : function() {
    	this._me = this;

        this.control({
            'app-footer #fbPost' : {
                beforerender : 'onFbBeforeRender'
            },
            'app-footer #twPost' : {
                beforerender : 'onTwBeforeRender'
            }
        });
    },

    onFbShareBtnClick : function() {
    	//this.redirectTo('home/fbShare');
    	FB.ui(
	    	{
	            method: 'share',
	            href: 'http://yardsale.druidinc.com/',
	            display : 'popup'
	        }, function(response){}
        );
    },

    onFbBeforeRender : function() {
        Setting.getSetting(this, 'sns', 'facebook', this.fbSettingCallback);
    },

    fbSettingCallback : function(obj, rsp) {
        var fbPost = obj.lookupReference('fbPost');

        if(rsp.result.active == 0) {
            fbPost.destroy();
        }
    },

    onTwBeforeRender : function() {
        Setting.getSetting(this, 'sns', 'twitter', this.twSettingCallback);
    },

    twSettingCallback : function(obj, rsp) {
        var twPost = obj.lookupReference('twPost');

        if(rsp.result.active == 0) {
            twPost.destroy();
        }
    }
});
