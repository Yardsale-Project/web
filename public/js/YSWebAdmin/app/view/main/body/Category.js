'use strict';

Ext.define('YSWebAdmin.view.main.body.Category', {
    extend: 'Ext.tab.Panel',

    xtype: 'app-category',
    itemId:'app-category',
    cls     : 'app-category',
    plain   : true,
    
    controller: 'category',
    viewModel: {
        type: 'category'
    },

    border  : true,

    items   : [
        {
            bind        : {
                title   : '{generalInfo}'
            },
            bodyPadding : 10,
            items       : [
                {
                    xtype   : 'form',
                    layout      : 'form',
                    itemId  : 'generalInfo',
                    items   : [
                        {
                            xtype   : 'textfield',
                            bind        : {
                                fieldLabel   : '{name}'
                            },
                            name    : 'name',
                            allowBlank : false,
                            msgTarget : 'under'
                        }, {
                            xtype   : 'textareafield',
                            bind        : {
                                fieldLabel   : '{description}'
                            },
                            grow    : true,
                            height  : 300,
                            name    : 'description'
                        }, {
                            xtype   : 'hiddenfield',
                            name    : 'cat_id',
                            itemId  : 'hdn-cat-id'
                        }, {
                            xtype   : 'hiddenfield',
                            name    : 'parent_id',
                            itemId: 'hdn-parent-id'
                        }
                    ],

                    tbar    : [
                        {
                            xtype   : 'button',
                            itemId  : 'saveBtn',
                            bind    : {
                                text    : '{saveBtn}'
                            }
                        }, {
                            xtype   : 'button',
                            itemId  : 'deleteBtn',
                            bind    : {
                                text    : '{deleteBtn}'
                            },
                            disabled:true
                        }
                    ]
                }
            ]
        }, {
            title       : 'Category Products',
            bodyPadding : 10,
            html : 'category products'
        }
    ]
});
