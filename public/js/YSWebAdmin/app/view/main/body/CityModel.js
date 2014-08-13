'use strict';

Ext.define('YSWebAdmin.view.main.body.CityModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.city',

    data: {
        title   : 'Cities/Municipalities',
        code    : 'Code',
        name    : 'Name',
        addState  : 'Add City/Municipality',
        addStateMultiple  : 'Add Multiple Cities/Municipalities',
        delBtn : 'Delete'
    }

    //TODO - add data, formulas and/or methods to support your view
});