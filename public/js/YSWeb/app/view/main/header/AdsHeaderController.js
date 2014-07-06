'use strict';

Ext.define('YSWeb.view.main.header.AdsHeaderController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.adsheader',

    refs    : [
        {
            ref     : 'adsHeader',
            selector: 'app-adsheader #adsHeader'
        }
    ],

    init : function () {
        this.control({
            'app-adsheader #adsHeader' : {
                render  : 'onTextAdsRender'
            }
        });
    },

    onTextAdsRender : function(el) {

        var element = this.view.down('#adsHeader');
        console.log('Text ads render', element);
    }
});
