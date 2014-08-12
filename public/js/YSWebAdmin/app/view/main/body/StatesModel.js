'use strict';

Ext.define('YSWebAdmin.view.main.body.StatesModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.states',

    data: {
        title   : 'States/Province',
        code    : 'Code',
        name    : 'Name',
        addState  : 'Add State/Province',
        addStateMultiple  : 'Add Multiple States/Provinces',
        city     : 'Cities',
        delBtn : 'Delete'
    }

    //TODO - add data, formulas and/or methods to support your view
});