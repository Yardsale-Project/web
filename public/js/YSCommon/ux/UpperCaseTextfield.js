'use stric';

Ext.define('YSCommon.ux.UpperCaseTextfield', {
    extend: 'Ext.form.field.Text',

    xtype 	: 'uppercasetextfield',

    //configuration
    config: {
        uppercaseValue: true //defaults to true
    },

    constructor: function (config) {
        this.initConfig(config);
        this.callParent([config]);
    },

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            fieldStyle: 'text-transform:uppercase',
        });

        me.callParent();
    },

    //overriden function
    getValue: function () {
        var val = this.callParent();
        return this.getUppercaseValue() ? val.toUpperCase() : val;
    }
});