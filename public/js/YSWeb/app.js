/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'YSWeb',

    extend: 'YSWeb.Application',
    
    autoCreateViewport: 'YSWeb.view.main.Main',

    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'onUnmatchedRoute'
            }
        }
    },

    onUnmatchedRoute : function(hash) {
        this.redirectTo('home');
    }
	
    //-------------------------------------------------------------------------
    // Most customizations should be made to YSWeb.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
