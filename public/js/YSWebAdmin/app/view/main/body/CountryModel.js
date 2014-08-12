'use strict';

Ext.define('YSWebAdmin.view.main.body.CountryModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.country',

    data: {
        title 	: 'Country',
        code 	: 'Code',
        name 	: 'Name',
        addCountry 	: 'Add Country',
        addCountryMultiple	: 'Add Multiple Countries',
        statesProvinces 	: 'States/Provinces',
        delBtn : 'Delete'
    }

    //TODO - add data, formulas and/or methods to support your view
});