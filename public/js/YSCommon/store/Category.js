'use strict';

Ext.define('YSCommon.store.Category', {
	extend 	: 'Ext.data.ArrayStore',

	alias	: 'store.app-categoryStore',
	storeId	: 'app-categoryStore',

	fields: [
        'id',
        'name',
        'parentId'
    ],

	data: [
        [1, 'Category 1', 0],
        [4, 'Sub Category 1 ,1', 1],
        [2, 'Category 2', 0],
        [3, 'Category 3', 0],
        [5, 'Sub Category 1 ,3', 3],
        [6, 'Sub Category 2 ,3', 3]
    ]
});