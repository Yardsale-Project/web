'use strict';

Ext.define('YSWeb.controller.Search', {
    extend: 'Ext.app.Controller',

    views : [
    	'main.body.left.Left',
        //'main.body.toolbar.Breadcrumb'
    ],

    refs    : [
        {
            ref : 'breadcrumb',
            selector : 'app-bodyCenter #breadcrumb'
        }
    ],

    init    : function(){
        this.control({
            'app-bodyLeft #categoryPanel' : {
                itemclick  : 'onItemClick'
            }
        });

        this.breadCrumbsArr = [];
        this.breadcrumbItems = [];
    },

    onItemClick : function(grid, record) {
        YSDebug.log('record', record);

        this.breadCrumbsArr = [];

        var catId = record.data.id;
        var catTest = record.data.text;
        var store = Ext.getStore('app-productStore');
        var breadcrumb = this.getBreadcrumb();
        var bIndex = 0;

        this.breadcrumbItems = [
            {
                xtype   : 'tbtext',
                text    : 'Home'
            }
        ];

        breadcrumb.removeAll();

        this.getParent(record);
        this.breadCrumbsArr.reverse();

        this.breadcrumbItems = this.breadcrumbItems.concat(this.breadCrumbsArr);

        YSDebug.log('bc', this.breadCrumbsArr);
        YSDebug.log('breadcrumbItems', this.breadcrumbItems);

        for(bIndex in this.breadcrumbItems) {
            breadcrumb.add(this.breadcrumbItems[bIndex])
        }
        //breadcrumbItems.add(breadcrumbItems)

        YSDebug.log('breadcrumb', breadcrumb);

        store.on('beforeload', function(str, op) {
            var filter = {
                'op': 'AND',
                'set': [
                    {
                        "table": "user",
                        "field": "country",
                        "bitOp": "EQ",
                        "value": 170
                    }, {
                        'table': 'parent',
                        'field': 'category_id',
                        'bitOp': 'EQ',
                        'value': catId
                    },
                ]
            };

            op.setParams( {
                filter: Ext.encode( filter )
            } );
        });

        store.load();

    },

    getParent : function(node) {

        var arr = [];

        if(node.parentNode == null) {
            return;
        } else if(node.data.depth == 0) {
            return;
        } else if(node.data.depth == 1) {
            var obj = {
                xtype   : 'tbtext',
                text    : node.data.text
            };

            var separator = {
                xtype   : 'tbtext',
                text    : '>'
            };

            this.breadCrumbsArr.push(obj);
            this.breadCrumbsArr.push(separator);

            return;
        } else {
            var obj = {
                xtype   : 'tbtext',
                text    : node.data.text
            };

            var separator = {
                xtype   : 'tbtext',
                text    : '>'
            };

            this.breadCrumbsArr.push(obj);
            this.breadCrumbsArr.push(separator);

            this.getParent(node.parentNode);
        }

        return;
    }
});
