(function(){

    var me;
    var submitUrl = 'application/index/login',
        warehouseStoreUrl = 'application/warehouse/getTerminalStores';

    var warehouseStoreFields = [
        'terminalId'
    ];

    var warehouseStore = Ext.create('Ext.data.Store',
    {
        id      : 'store-warehouseStore',
        proxy   : proxy(warehouseStoreUrl, {}),
        autoLoad: true ,
        fields: warehouseStoreFields
    });

    Ext.define('Checkup.Login.Form.Login',
    {
        extend  : 'Ext.form.Panel',

        layout  : 'column',
        frame       : false,
        width   : 300,
        border      : true,
        title   : 'Checkup Motor Parts Admin Panel Login',
        renderTo    : Ext.getBody(),

        initComponent : function()
        {

            me = this;

            this.items = [
                {
                    xtype       : 'panel',
                    columnWidth : 1,
                    layout      : 'column',
                    padding     : 10,
                    frame       : false,
                    border      : false,

                    items       : [
                        {
                            xtype       : 'textfield',
                            columnWidth : 1,
                            fieldLabel  : 'Username',
                            id          : 'txt-username',
                            name        : 'username',
                            allowBlank  : false,
                            margin      : 5
                        }, {
                            xtype       : 'textfield',
                            columnWidth : 1,
                            inputType   : 'password',
                            fieldLabel  : 'Password',
                            id          : 'txt-password',
                            name        : 'password',
                            allowBlank  : false,
                            margin      : 5
                        }, {
                            xtype       : 'hiddenfield',
                            name        : 'token',
                            id          : 'csrf-token'
                        }, {
                            xtype       : 'combo',
                            fieldLabel  : 'Store',
                            width : 263,
                            name        : 'store',
                            id          : 'cbo-store-login',
                            queryMode   : 'local',
                            triggerAction: 'all',
                            forceSelection:false,
                            displayField: 'terminalId',
                            valueField  : 'terminalId',
                            store       : warehouseStore,
                            margin      : 5,
                            allowBlank  : false
                        }
                    ]
                }
            ];

            this.superclass.initComponent.call(this);

            Ext.getCmp('csrf-token').setValue(this.token);
        },

        buttons     : [
            {
                text    : 'Login',
                action  : 'Login',
                handler : function()
                {
                    var form = me.getForm();

                    if(form.isValid())
                    {
                        form.submit({
                            url     : submitUrl,
                            waitMsg : 'Logging in',
                            success : function(response, responseText) {

                                msg = Ext.Msg.wait('Redirecting');
                                window.location = responseText.result.redirect;
                            },
                            failure : function(response, responseText) {
                                Ext.MessageBox.alert(
                                    'Failed',
                                    responseText.result.errorMessage,
                                    function(){
                                        window.location = responseText.result.redirect;
                                    }
                                );
                            }
                        });
                    }
                }
            }, {
                text    : 'Cancel',
                handler : function() 
                {
                    me.getForm().reset();
                }
            }
        ],
        listeners: {
            afterrender: function(b) {
                b.down('button[action=Login]').focus(false, 100);  
            }
        }
    });

})();