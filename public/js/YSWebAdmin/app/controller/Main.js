Ext.define('YSWebAdmin.controller.Main', {
    extend: 'Ext.app.Controller',

    refs    : [
       	{
       		ref 	: 'appBody',
       		selector : 'app-body'
       	}
    ],

    views : [
    	'main.header.Navigation'
    ],

    init 	: function(){
    	this.control({
    		'app-navigation #btn-categories' : {
    			click : this.onClickCategoriesBtn
    		}
    	});
    },

    onClickCategoriesBtn : function() {

    	var categories = Ext.create('YSWebAdmin.view.main.body.Categories');

    	this.getAppBody().removeAll();

    	this.getAppBody().add(categories);
    	this.getAppBody().doLayout();
    	YSDebug.log('body', this.getAppBody());
    }
});
