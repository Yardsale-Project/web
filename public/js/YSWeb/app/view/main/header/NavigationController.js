'use strict';

Ext.define('YSWeb.view.main.header.NavigationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.navigation',

    init : function () {
        this.control({
            
        });
    },

    onAddNewBtnClick : function() {
        var items = [],
            item  = {},
            cardNum = 0;

        if(!UserHelper.hasLocation) {
            item = {
                id: 'card-' + cardNum,
                xtype   : 'app-personal'
            };

            cardNum++;

            items.push(item);
        }

        if(!UserHelper.hasPaypal) {
            item = {
                id: 'card-' + cardNum,
                xtype : 'app-clientpaypalsetting',
                controller : 'personal'
            };

            cardNum++;

            items.push(item);
        }

        if(items.length > 0) {
            item = {
                id: 'card-' + cardNum,
                html: '<h1>Congratulations!</h1><p>Information Complete</p>'
            };

            items.push(item);

            Ext.create('Ext.window.Window', {
                modal   : true,
                closable: false,
                resizable: false,
                layout  : 'fit',
                title   : 'Please complete the information',
                bodyPadding : '10',

                items   : [
                    {
                        xtype   : 'panel',
                        requires: [
                            'Ext.layout.container.Card'
                        ],
                        layout  : 'card',

                        width   : 600,

                        border  : false,

                        defaultListenerScope : true,

                        bbar : ['->',
                            {
                                itemId: 'card-prev',
                                text: '&laquo; Previous',
                                handler: 'showPrevious',
                                disabled: true
                            }, {
                                itemId: 'card-next',
                                text: 'Next &raquo;',
                                handler: 'showNext'
                            }, {
                                itemId : 'card-close',
                                text: 'Done',
                                handler: 'close',
                                hidden  : true
                            }
                        ],

                        items: items,

                        showNext: function () {
                            this.doCardNavigation(1);
                        },

                        showPrevious: function (btn) {
                            this.doCardNavigation(-1);
                        },

                        close : function() {
                            this.up('window').destroy();
                        },

                        doCardNavigation: function (incr) {
                            var me = this;
                            var l = me.getLayout();
                            var i = l.activeItem.id.split('card-')[1];
                            var next = parseInt(i, 10) + incr;
                            l.setActiveItem(next);

                            me.down('#card-prev').setDisabled(next===0);
                            me.down('#card-next').setDisabled(next===cardNum);
                            me.down('#card-close').setHidden(next!==cardNum);
                        }
                            
                    }
                ]
            }).show();
        } else {
            Ext.create('Ext.window.Window', {
                modal       : true,
                layout      : 'fit',
                resizable   : false,
                closeAction : 'destroy',
                title       : 'Add New Product',

                items       : [
                    {
                        xtype   : 'app-product'
                    }
                ]
            }).show();
        }
    }
});
