/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('YSWebAdmin.Application', {
    extend: 'Ext.app.Application',
    
    name: 'YSWebAdmin',

    requires : [
        'YSCommon.config.Config',
        'YSCommon.util.Debug'
    ],

    views: [
        // TODO: add views here
    ],

    defaultToken : 'home',

    controllers: [
        'Root',
        'Main'
        // TODO: add controllers here
    ],

    stores: [
        // TODO: add stores here
    ],
    
    launch: function () {
        // TODO - Launch the application
    }
});
