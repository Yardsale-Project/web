'use strict';

Ext.define('YSWeb.view.main.body.toolbar.Breadcrumb' , {
	extend : 'Ext.toolbar.Toolbar',

	xtype 	: 'app-breadcrumb',

	items   : [
        {
            xtype   : 'tbtext',
            text    : 'Home'
        }, {
            xtype   : 'tbtext',
            text    : '>'
        }, {
            xtype   : 'tbtext',
            text    : 'All Categories'
        }
    ] 
});