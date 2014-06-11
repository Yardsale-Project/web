(function(){
	var me, origUsername, finalUsername;
	var url = 'application/BusinessPartner',
		submit_url = 'application/BusinessPartner/saveBusinessPartner',
		deleteUrl = 'application/BusinessPartner/deleteBusinessPartner';
	var businessPartnerFields = [
		'BPType', 'code', 'BPName', 'address',
		'tel1', 'tel2', 'fax', 'email',
		'website', 'contactP', 'deactivated', 'remarks',
		'trans'
	];

	var businessPartnerStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-businessPartner-list',
		proxy	: proxy(url,{}),
		
		autoLoad: true ,
	    fields: businessPartnerFields
	});

	var bpTypeStore = Ext.create('Ext.data.Store',
	{
		fields : ['code', 'name'],
		data 	: [
			{ 'code' : '0', 'name' : 'Supplier'},
			{ 'code' : '1', 'name' : 'Customer'}
		]
	});

	function populateFields(data)
	{
		Ext.getCmp('txt-code-businessPartner').setValue(data.code);
		Ext.getCmp('txt-code-businessPartner').setReadOnly(true);
		Ext.getCmp('txt-name-businessPartner').setValue(data.BPName);
		Ext.getCmp('cbo-type-businessPartner').setValue(data.BPType);
		Ext.getCmp('txt-address-businessPartner').setValue(data.address);
		Ext.getCmp('txt-tel1-businessPartner').setValue(data.tel1);
		Ext.getCmp('txt-tel2-businessPartner').setValue(data.tel2);
		Ext.getCmp('txt-fax-businessPartner').setValue(data.fax);
		Ext.getCmp('txt-email-businessPartner').setValue(data.email);
		Ext.getCmp('txt-website-businessPartner').setValue(data.website);
		Ext.getCmp('txt-contactperson-businessPartner').setValue(data.contactP);
		Ext.getCmp('txtarea-remarks-businessPartner').setValue(data.remarks);

		if(data.deactivated == 'N')
		{
			Ext.getCmp('chk-deactivated-businessPartner').setValue(false);
		}
		else
		{
			Ext.getCmp('chk-deactivated-businessPartner').setValue(true);
		}

		Ext.getCmp('action').setValue('edit');
	}

	// custom Vtype for vtype:'time'
	var bpCodeTest = /\'/i;
	Ext.apply(Ext.form.field.VTypes, {
	    //  vtype validation function
	    bpCode: function(val, field) {
	        return !bpCodeTest.test(val);
	    },
	    // vtype Text property: The error text to display when the validation function returns false
	    bpCodeText: 'Not a valid code.  Must have no apostrophe(\')',
	    // vtype Mask property: The keystroke filter mask
	    /*timeMask: /[\d\s:amp]/i*/
	});

	Ext.define('Checkup.BusinessPartners.BusinessPartners.Form.BusinessPartners',
	{
		extend 		: 'Ext.form.Panel',


		layout 		: 'column',
		border 		: true,

		width 		: 830,
		
		title 		: 'Business Partners',

		defaultType : 'textfield',

		initComponent : function(){
			me = this;

			this.superclass.initComponent.call(this);
		},

		items 		: [
			{
				xtype 	: 'grid',
				id 		: 'grid-businessPartner-list',
				width 	: 500,
				height 	: 420,
				padding : '10 5 10 10 ',
				store 	: businessPartnerStore,
				columns : [
					{ text : 'Code', dataIndex : 'code', flex : 1},
					{ text : 'Name', dataIndex : 'BPName', flex : 1},
					{ text : 'Type', dataIndex : 'BPType', flex : 1, renderer : function(value) {
						if(value == '0')
						{
							return 'Supplier';
						}
						else if(value == '1')
						{
							return 'Customer'
						}
					}}
				],
				listeners : {
					selectionchange : function(grid, selected, eOpts) {
						if(selected[0] != null && selected[0] != 'undefined')
						{
							populateFields(selected[0].raw);

							Ext.getCmp('btn-delete-businessPartner').enable();
						}
					}
				}
			}, {
				xtype 	: 'fieldset',
				title 	: 'Business Partner Information',
				width 	: 310,
				//height 	: 265,
				margin : '0 10 10 5',
				layout 	: 'column',
				items 	: [
					{
						xtype 		: 'panel',
						columnWidth : 1,
						border 		: false,
						layout 		: 'column',
						defaultType : 'textfield',
						items 		: [
							{
								xtype 		: 'hidden',
								name 		: 'action',
								id 			: 'action',
								value 		: 'add'
							}, {
								fieldLabel 	: 'BP Code',
								name 		: 'code',
								id 			: 'txt-code-businessPartner',
								columnWidth : 1,
								allowBlank  : false,
								vtype 		: 'bpCode',
								readOnly 	: false
							}, {
								fieldLabel 	: 'Name',
								name 		: 'name',
								id 			: 'txt-name-businessPartner',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'combo',
								fieldLabel 	: 'Type',
								name 		: 'type',
								id 			: 'cbo-type-businessPartner',
								store 		: bpTypeStore,
								valueField 	: 'code',
								displayField: 'name',
								margin 		: '5 0 0 0',
								columnWidth : 1,
								allowBlank 	: false
							}, {
								fieldLabel 	: 'Address',
								name 		: 'address',
								id 			: 'txt-address-businessPartner',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								fieldLabel 	: 'Tel 1',
								name 		: 'tel1',
								id 			: 'txt-tel1-businessPartner',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								fieldLabel 	: 'Tel 2',
								name 		: 'tel12',
								id 			: 'txt-tel2-businessPartner',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								fieldLabel 	: 'Fax no',
								name 		: 'fax',
								id 			: 'txt-fax-businessPartner',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								fieldLabel 	: 'Email',
								name 		: 'email',
								id 			: 'txt-email-businessPartner',
								vtype 		: 'email',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								fieldLabel 	: 'Website',
								name 		: 'website',
								id 			: 'txt-website-businessPartner',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								fieldLabel 	: 'Contact Person',
								name 		: 'contactperson',
								id 			: 'txt-contactperson-businessPartner',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'textarea',
								fieldLabel 	: 'Remarks',
								name 		: 'remarks',
								id 			: 'txtarea-remarks-businessPartner',
								columnWidth : 1,
								margin 		: '5 0 10 0'
							}, {
								xtype 		: 'checkbox',
								boxLabel 	: 'Deactivated',
								name 		: 'deactivated',
								id 			: 'chk-deactivated-businessPartner',
								columnWidth : 1,
								margin 		: '5 0 10 0'
							}
						]
					}
				]
			}
		],

		buttons 	: [
			{
				text 	: 'New',
				handler : function()
				{
					me.getForm().reset();
					Ext.getCmp('grid-businessPartner-list').getSelectionModel().deselectAll();
					Ext.getCmp('btn-delete-businessPartner').disable();
					Ext.getCmp('action').setValue('add');
					Ext.getCmp('txt-code-businessPartner').setReadOnly(false);
				}
			}, {
				text 	: 'Save',
				handler : function()
				{
					var form = me.getForm();

                    if(form.isValid())
                    {
                        form.submit({
                            url     : submit_url,
                            waitMsg : 'Saving data...',
                            success : function(response, responseText) {
                                msg = Ext.Msg.alert('Success', responseText.result.message, function() { 
                                	businessPartnerStore.load();
                                	me.getForm().reset(); 
                                	Ext.getCmp('grid-businessPartner-list').getSelectionModel().deselectAll();
                               	});
                            },
                            failure : function(response, responseText) {
                                Ext.MessageBox.alert(
                                    'Failed',
                                    responseText.result.errorMessage
                                );
                            }
                        });

						Ext.getCmp('btn-delete-businessPartner').disable();
                    }
				}
			}, {
				text 	: 'Delete',
				id 		: 'btn-delete-businessPartner',
				disabled: true,
				handler : function()
				{
					var grid = Ext.getCmp('grid-businessPartner-list');
					var selectionModel = grid.getSelectionModel();

					if(selectionModel.hasSelection())
					{
						var selection = selectionModel.getSelection();
						var record = selection[0];

						Ext.Msg.confirm('Delete', 'Are you sure you want to delete this record?', function(btn){
							if(btn == 'yes')
							{
								Ext.Ajax.request({
									url  : deleteUrl,
									method : 'POST',
									params : {
										code : record.raw.code
									},
									success : function(response, opt)
									{
										result = Ext.JSON.decode(response.responseText);
										Ext.Msg.alert('Success', result.message,  function() { 
		                                	businessPartnerStore.load();
		                                	me.getForm().reset();
		                                	Ext.getCmp('grid-businessPartner-list').getSelectionModel().deselectAll();
		                               	});
									},
									failure : function(response, opt)
									{
										result = Ext.JSON.decode(response.responseText);
										Ext.Msg.alert('Failed', result.errorMessage);
									}
								});

								Ext.getCmp('btn-delete-businessPartner').disable();
							}
						});
					}
					else
					{
						Ext.Msg.alert('Delete', 'Please select a row to delete');
					}
				}
			}
		]

	});

})();