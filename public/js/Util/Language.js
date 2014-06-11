(function() {
    
    /**
     *  Class: Ext.mdbase.Utility.Language
     *  
     *  Available Methods:
     *      Translate english text to any localization that has been set
     *          _(<string>)
     *          E.g. i18n._('Calendar Viewer') - will returns "Kalender" if locale/language id 'nl' has been set.
     *
     *      Get the locale/language id that is currently set
     *          getLocale()
     *          E.g. i18n.getLocale() - will returns for example en, nl, etc...
     */ 
    
    Ext.define('Ext.mdbase.Utility.Language', {
        
        url: 'country.php?m=getLocalization'
            
        ,lang: ''
                   
        ,data: {}
        
        ,loadData: function(params)
        {
            this.lang = params.lang;
            
            var _this = this;
            
            var success = function(response)
            { 
                var response = Ext.JSON.decode( response.responseText);
                
                _this.data = response.success ? response.rows : {};
            };
            
            Ext.Ajax.request({ url: this.url, async: false, params: params, success: success});
            
            return this;
        }
        
        ,getLocale: function()
        {
            return this.lang;
        }
        
        ,_: function(key)
        {   
            data = this.data;

            if (typeof data[key] != 'undefined')
            {
                found_key = data[key];
            }
            else
            {
                found_key = key;
            }
            
            return found_key;
        }       
    }); 
    
})();