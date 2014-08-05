'use strict';

Ext.define('YSWeb.view.main.setting.ClientSettingModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.clientsetting',

    data: {
        save            : 'Save',
        reset           : 'Reset',

        ppEmail         : 'Paypal Email',
        ppPassword      : 'Paypal Password'
    }

    //TODO - add data, formulas and/or methods to support your view
});