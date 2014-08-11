'use strict';

Ext.define('YSWeb.view.main.product.ProductModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.product',

    data: {
        name            : 'Name',
        short_desc      : 'Short Description',
        description     : 'Description',
        fileFieldLabel  : 'Photo',
        category        : 'Category',
        save            : 'Save',
        reset           : 'Reset',
        stock           : 'Stock',
        weight          : 'Weight',
        minPrice        : 'Minimum Price',
        sellPrice       : 'Selling Price',
        close           : 'Close',
        sendToFriends   : 'Send to Friends',
        cancel          : 'Cancel'
    }

    //TODO - add data, formulas and/or methods to support your view
});