Ext.define('Debug', {
    statics : {
        log : function(message, type )
        {
            if(config.debug)
            {
                if(typeof type == undefined || type == null)
                {
                    this.logMessage(message);
                }
                else
                {
                    switch(type)
                    {
                        case 0 : // message
                            this.logMessage(message);
                            break;
                        case 1 : // info
                            this.logInfo(message);
                            break;
                        case 2 : // warn
                            this.logWarning(message);
                            break;
                        case 3 : // error
                            this.logError(message);
                            break;
                        default : 
                            this.logMessage(message);
                            break;
                    }
                }
            }
        },
        logError : function(message)
        {
            console.error(message);
        },
        logMessage : function(message)
        {
            console.debug(message);
        },
        logInfo : function(message)
        {
            console.info(message);
        },
        logWarning : function(message)
        {
            console.warning(message);
        }
    }
});