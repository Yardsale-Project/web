'use strict';

Ext.define('YSWeb.view.main.header.AccountHeaderModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.accountheader',

    data: {
        aboutUs 	: '<a href="#">About Us</a>',
        hi 			: 'Hi',
        signIn 		: '<a href="#">Sign In</a>',
        or 			: 'or',
        register 	: '<a href="#">Register</a>'
    }

    //TODO - add data, formulas and/or methods to support your view
});