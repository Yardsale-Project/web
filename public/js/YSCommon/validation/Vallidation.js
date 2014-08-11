'use strict';

Ext.define('YSCommon.validation.Validation', {
	override: 'Ext.form.field.VTypes',

	password 	: function(val) {
		var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}/;

		return val.match(pattern);
	},

	passwordText : 'Password does not match condition. Password should be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character - See more at: http://www.w3resource.com/javascript/form/password-validation.php#sthash.6HMwVLgn.dpuf',

	mobile 		: function(val) {
		var pattern = /^[0-9]{1,11}$/;

		return val.match(pattern);
	},

	mobileText : 'Invalid mobile number. Please put the 11-digit mobile number.'
});