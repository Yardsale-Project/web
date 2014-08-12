Ext.define('YSWebAdmin.controller.Main', {
    extend: 'Ext.app.Controller',

    refs    : [
       	{
       		ref 	: 'appBody',
       		selector : 'app-body'
       	}
    ],

    views : [
    	'main.header.Navigation',
        'main.body.Country'
    ],

    init 	: function(){
    	this.control({
    		'app-navigation #btn-categories' : {
    			click : 'onClickCategoriesBtn'
    		},
            'app-navigation #btn-country' : {
                click : 'onClickCountryBtn'
            }
    	});

        this.panel = null;
    },

    onClickCategoriesBtn : function() {

        if(this.panel != null) {
            this.panel.destroy();
        }
    	
        this.panel = Ext.create('YSWebAdmin.view.main.body.Categories');

    	this.getAppBody().removeAll();

    	this.getAppBody().add(this.panel);
    	this.getAppBody().doLayout();
    	YSDebug.log('body', this.getAppBody());
    },

    onClickCountryBtn : function() {

        YSDebug.log('country');
        if(this.panel != null) {
            this.panel.destroy();
        }

        this.panel = Ext.create('YSWebAdmin.view.main.body.Country');

        this.getAppBody().removeAll();
        this.getAppBody().add(this.panel);
        this.getAppBody().doLayout();
    }
});
