'use strict';

Ext.define('YSWeb.controller.Facebook', {
    extend: 'Ext.app.Controller',

    views : [
    	'main.footer.Footer'
    ],

    refs 	: [
    	{
    		ref 	: 'fbShareBtn',
    		selector: '#fbPost'
    	}
    ],

    init 	: function(){
    	this.control({
            '#fbPost' : {
                render 	: 'onFbPostBtnRender'
            }
    	});
    },

    onFbPostBtnRender : function() {

    	console.log('check');

    	var fbSharBtn = this.getFbShareBtn();
    	var me = this;

    	Ext.Ajax.request({
            url     : YSConfig.url + '/application/facebook/getShareLink',
            method  : 'POST',
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);

                if(rsp.success)
                {

                    if(rsp.hasOwnProperty('url')) {
                    	YSDebug.log('rsp.success', rsp.success);
                    	YSDebug.log('rsp.url', rsp.url);

                    	fbSharBtn.setHref(rsp.url);
                    	fbSharBtn.hrefTarget = '_parent';

                    }
                } else {
                    YSDebug.log('failed', rsp.success);

                    Ext.Msg.show({
                        title       : 'User Account Info',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            }
        });
    }
});
