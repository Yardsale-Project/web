Ext.define('YSCommon.model.Product', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', 			type: 'int'},
        {name: 'image',  		type: 'string'},
        {name: 'productName', 	type: 'string'},
        {name: 'currentPrice', 	type: 'string'}
    ]
 });