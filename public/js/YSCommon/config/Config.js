'use strict';

Ext.define('YSCommon.config.Config', {
	singleton 			: true,
	alternateClassName  : ['YSConfig'],
	localUrl 			: 'http://local.main.yardsale:8181',
	serverUrl 			: 'http://yardsale.druidinc.com',

	debug 				: true,
	loggedin 			: false,

	constructor : function () {
		var host = window.location.host;

		if(host.indexOf('local') >= 0) {
			this.url 	= this.localUrl;
			this.debug 	= true;
		} else {
			this.url 	= this.serverUrl;
			this.debug  = false;
		}
	}
});