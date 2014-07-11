'use strict';

Ext.define('YSWeb.view.main.login.RegisterModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.register',

    data: {
        email	: 'Email',
        password: 'Password',
        confirmPassword:'Confirm Password',
        submit 	: 'Submit',
        cancel	: 'Cancel'
    }

    //TODO - add data, formulas and/or methods to support your view
});