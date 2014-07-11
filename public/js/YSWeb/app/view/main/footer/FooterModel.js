'use strict';

Ext.define('YSWeb.view.main.footer.FooterModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.footer',

    data: {
        aboutYardsale 	: 'About Yardsale',
        companyInfo     : 'Company Info',
        news 		    : 'News',
        policies 		: 'Policies',
        suggestions 	: 'Tell us what you think',
        paymentMethod   : 'Payment Methods',
        paypal          : 'Paypal',
        cod             : 'Cash on Delivery',
        mediaConnection : 'Stay Connected',
        fb              : 'Facebook',
        tw              : 'Twitter',
        download        : '&nbsp;',
        copyright       : 'Copyright &copy; 2014 ' + YSConfig.url + '. All Rights Reserved.',
        powered         : 'Powerded By : <a href="http://www.druidinc.com" target="new">Druid Solutions, Inc.</a>'
    }

    //TODO - add data, formulas and/or methods to support your view
});