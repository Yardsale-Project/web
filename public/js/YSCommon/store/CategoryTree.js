'use strict';

Ext.define('YSCommon.store.CategoryTree', {
    extend  : 'Ext.data.TreeStore',

    alias   : 'store.app-categoryTreeStore',
    storeId : 'app-categoryTreeStore',

    root    : {
        expanded: true,

        children: [
            { 
                text        : "Category 1",
                catId       : 1,
                parentId    : 0, 
                leaf        : false,
                children    : [
                    {
                        text    : 'Sub Category 1 ,1',
                        catId   : 4,
                        parentId: 1,
                        leaf   : true
                    }
                ]
            }, { 
                text        : "Category 2",
                parentId    : 0, 
                leaf        : true
            }, { 
                text        : "Category 3",
                catId       : 3,
                parentId    : 0, 
                leaf        : false,
                children    : [
                    {
                        text    : 'Sub Category 1 ,3',
                        catId   : 5,
                        parentId: 3,
                        leaf   : true
                    }, {
                        text    : 'Sub Category 2 ,3',
                        catId   : 6,
                        parentId: 3,
                        leaf   : true
                    }
                ]
            }, { 
                text        : "Category 3",
                catId       : 3,
                parentId    : 0, 
                leaf        : false,
                children    : [
                    {
                        text    : 'Sub Category 1 ,3',
                        catId   : 5,
                        parentId: 3,
                        leaf   : true
                    }, {
                        text    : 'Sub Category 2 ,3',
                        catId   : 6,
                        parentId: 3,
                        leaf   : true
                    }
                ]
            }, { 
                text        : "Category 3",
                catId       : 3,
                parentId    : 0, 
                leaf        : false,
                children    : [
                    {
                        text    : 'Sub Category 1 ,3',
                        catId   : 5,
                        parentId: 3,
                        leaf   : true
                    }, {
                        text    : 'Sub Category 2 ,3',
                        catId   : 6,
                        parentId: 3,
                        leaf   : true
                    }
                ]
            }, { 
                text        : "Category 3",
                catId       : 3,
                parentId    : 0, 
                leaf        : false,
                children    : [
                    {
                        text    : 'Sub Category 1 ,3',
                        catId   : 5,
                        parentId: 3,
                        leaf   : true
                    }, {
                        text    : 'Sub Category 2 ,3',
                        catId   : 6,
                        parentId: 3,
                        leaf   : true
                    }
                ]
            }, { 
                text        : "Category 3",
                catId       : 3,
                parentId    : 0, 
                leaf        : false,
                children    : [
                    {
                        text    : 'Sub Category 1 ,3',
                        catId   : 5,
                        parentId: 3,
                        leaf   : true
                    }, {
                        text    : 'Sub Category 2 ,3',
                        catId   : 6,
                        parentId: 3,
                        leaf   : true
                    }
                ]
            }, { 
                text        : "Category 3",
                catId       : 3,
                parentId    : 0, 
                leaf        : false,
                children    : [
                    {
                        text    : 'Sub Category 1 ,3',
                        catId   : 5,
                        parentId: 3,
                        leaf   : true
                    }, {
                        text    : 'Sub Category 2 ,3',
                        catId   : 6,
                        parentId: 3,
                        leaf   : true
                    }
                ]
            }, { 
                text        : "Category 3",
                catId       : 3,
                parentId    : 0, 
                leaf        : false,
                children    : [
                    {
                        text    : 'Sub Category 1 ,3',
                        catId   : 5,
                        parentId: 3,
                        leaf   : true
                    }, {
                        text    : 'Sub Category 2 ,3',
                        catId   : 6,
                        parentId: 3,
                        leaf   : true
                    }
                ]
            }
        ]
    }
});