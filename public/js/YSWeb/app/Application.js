/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('YSWeb.Application', {
    extend: 'Ext.app.Application',
    
    name: 'YSWeb',

    views: [
        // TODO: add views here
        /*'main.header.Header'*/
        'main.product.thumbnail.GridView'
    ],

    controllers: [
        'Root'
        // TODO: add controllers here
    ],

    stores: [
        // TODO: add stores here
        'YSCommon.store.Category',
        'YSCommon.store.States',
        'YSCommon.store.CategoryTree',
        'YSCommon.store.Product'
    ],
    
    launch: function () {
        // TODO - Launch the application
    }
});
