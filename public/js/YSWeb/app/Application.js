/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('YSWeb.Application', {
    extend: 'Ext.app.Application',
    
    name: 'YSWeb',

    requires : [
        'YSCommon.config.Config',
        'YSCommon.util.Debug',
        'YSCommon.helper.User',
        'YSCommon.helper.Paypal',
        'YSCommon.helper.Setting',
        'YSCommon.validation.Validation'
    ],

    views: [
        // TODO: add views here
        /*'main.header.Header'*/
        'main.product.thumbnail.GridView',
        'main.profile.Personal',
        'main.setting.ClientPaypalSetting'
    ],

    defaultToken : 'home',

    controllers: [
        'Root',
        'Facebook',
        'Product',
        'Search'
        // TODO: add controllers here
    ],

    stores: [
        // TODO: add stores here
        'Product',
        'LocationTree',
        'Country',
        'States',
        'City',
        'YSCommon.store.Category',
        'YSCommon.store.States',
        'YSCommon.store.CategoryTree'
    ],
    
    launch: function () {
        
    }
});
