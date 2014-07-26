'use strict';

Ext.define('YSWeb.view.main.footer.FooterController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.footer',

    init : function() {
    	this._me = this;
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
    }
});
