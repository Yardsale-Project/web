'use strict';

Ext.define('YSCommon.util.Debug', {
	singleton			: true,
	alternateClassName	: ['YSDebug'],

	log	: function(message, data) {
		if( YSConfig.debug ) {
			console.log( message, data);
		}
	}
});