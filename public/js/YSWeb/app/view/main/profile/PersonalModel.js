'use strict';

Ext.define('YSWeb.view.main.profile.PersonalModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.personal',

    data: {
        title       : 'Personal Information',
        firstname   : 'First Name',
        middlename  : 'Middle Name',
        lastname    : 'Last Name',
        telephone   : 'Telephone',
        mobile      : 'Mobile',
        address1    : 'Address 1',
        address2    : 'Address 2',
        country     : 'Country',
        states      : 'States/Province',
        city        : 'City'
    }

    //TODO - add data, formulas and/or methods to support your view
});