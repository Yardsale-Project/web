'use strict';

Ext.define('YSWebAdmin.view.main.header.NavigationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.navigation',

    init : function() {
        this.mainController = YSWebAdmin.app.getController('Main');
    },

    onClickCategoriesBtn : function() {
        this.mainController.onClickCategoriesBtn();
    },

    onClickCountryBtn : function() {
        YSDebug.log('country nav');
        this.mainController.onClickCountryBtn();
    }
});
