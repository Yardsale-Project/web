Ext.define('YSWebAdmin.controller.Categories', {
    extend: 'Ext.app.Controller',

    refs    : [
       	{
       		ref 	: 'appCategoryGeneralInfoForm',
       		selector : 'app-category #generalInfo'
       	}, {
            ref     : 'addSubCategoryBtn',
            selector : '#addSubCategory'
        }, {
            ref     : 'deleteCategoryBtn',
            selector : 'app-category #deleteBtn'
        }, {
            ref     : 'categoryTreePanel',
            selector : 'app-categories #categoryPanel'
        }
    ],

    views : [
    	'main.body.Categories',
        'main.body.Category'
    ],

    init 	: function(){
    	this.control({
    		'app-categories #categoryPanel' : {
                itemclick : 'onCategoryItemClick'
            },
            'app-categories #addSubCategory' : {
                click : 'onAddSubCategoryBtnClick'
            },
            'app-category #saveBtn' : {
                click : 'onSaveBtnClick'
            },
            'app-category #deleteBtn' : {
                click : 'onDeleteBtnClick'
            }
    	});

        this.parent_id = 0;
        this.record = {};
    },

    onCategoryItemClick : function(obj, record) {
        var subCatBtn = this.getAddSubCategoryBtn();
        var deleteCatBtn = this.getDeleteCategoryBtn();
        var generalInfoForm = this.getAppCategoryGeneralInfoForm();
        var data = {};
        
        YSDebug.log('record', record);
        subCatBtn.enable();
        deleteCatBtn.enable();

        generalInfoForm.reset();
        data = {
            name        : record.data.text,
            description : record.data.description,
            cat_id      : record.data.id,
            parent_id   : ''
        };

        this.parent_id = record.data.id;
        this.record = record;

        record.data = data;

        generalInfoForm.loadRecord(record);
    },

    onAddSubCategoryBtnClick : function() {
        var generalInfoForm = this.getAppCategoryGeneralInfoForm();

        generalInfoForm.reset();
        data = {
            name        : '',
            description : '',
            cat_id      : '',
            parent_id   : this.parent_id
        };

        this.record.data = data;
        generalInfoForm.loadRecord(this.record);
    },

    onSaveBtnClick : function() {
        var form = this.getAppCategoryGeneralInfoForm().getForm();
        var categoryTreePanel = this.getCategoryTreePanel();
        var addSubCatBtn = this.getAddSubCategoryBtn();
        var deleteCatBtn = this.getDeleteCategoryBtn();

        if(form.isValid()) {
            form.submit({
                url     : YSConfig.url + '/application/category/addCategory',
                waitMsg : 'Saving category...',
                success : function( frm, action ) {
                    YSDebug.log(action.result);
                    Ext.Msg.show({
                        title       : 'Category',
                        msg         : action.result.message,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();

                                addSubCatBtn.disable();
                                deleteCatBtn.disable();
                                categoryTreePanel.getSelectionModel().deselectAll();
                                categoryTreePanel.getStore().load();
                            }
                        }, 
                        icon        : Ext.MessageBox.INFO
                    });
                },
                failure : function( frm, action ) {
                    YSDebug.log(action.result);
                    Ext.Msg.show({
                        title       : 'Sign in',
                        msg         : action.result.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();
                                me.lookupReference('token').setValue(me.token);
                            }
                        }, 
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            });
        }
    },

    onDeleteBtnClick : function() {
        var form = this.getAppCategoryGeneralInfoForm().getForm();
        var categoryTreePanel = this.getCategoryTreePanel();
        var addSubCatBtn = this.getAddSubCategoryBtn();
        var deleteCatBtn = this.getDeleteCategoryBtn();

        Ext.Msg.confirm(
            'Delete',
            'Are you sure you want to delete this category?',
            function(btn) {
                if(btn === 'yes') {
                    if(form.isValid()) {
                        form.submit({
                            url     : YSConfig.url + '/application/category/deleteCategory',
                            waitMsg : 'Deleting category...',
                            success : function( frm, action ) {
                                YSDebug.log(action.result);
                                Ext.Msg.show({
                                    title       : 'Category',
                                    msg         : action.result.message,
                                    buttons     : Ext.MessageBox.OK,
                                    fn          : function(btn) {
                                        if(btn === 'ok') {
                                            form.reset();

                                            addSubCatBtn.disable();
                                            deleteCatBtn.disable();
                                            categoryTreePanel.getSelectionModel().deselectAll();
                                            categoryTreePanel.getStore().load();
                                        }
                                    }, 
                                    icon        : Ext.MessageBox.INFO
                                });
                            },
                            failure : function( frm, action ) {
                                YSDebug.log(action.result);
                                Ext.Msg.show({
                                    title       : 'Sign in',
                                    msg         : action.result.errorMessage,
                                    buttons     : Ext.MessageBox.OK,
                                    fn          : function(btn) {
                                        if(btn === 'ok') {
                                            form.reset();
                                            me.lookupReference('token').setValue(me.token);
                                        }
                                    }, 
                                    icon        : Ext.MessageBox.ERROR
                                });
                            }
                        });
                    }
                }
            }
        );
    }
});
