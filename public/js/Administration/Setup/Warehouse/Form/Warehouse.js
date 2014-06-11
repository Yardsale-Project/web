(function(){
	var me, origUsername, finalUsername;
	var url = 'application/warehouse/getWarehouseList',
		submit_url = 'application/warehouse/saveWarehouse',
		deleteUrl = 'application/warehouse/deleteStore';
	var warehouseFields = [
		'id', 'code', 'name', 'deactivated', 'warehouse'
	];

	var warehouseStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-warehouse-list',
		proxy	: proxy(url,{}),
		
		autoLoad: true ,
	    fields: warehouseFields
	});

	function populateFields(data)
	{
		Ext.getCmp('id').setValue(data.id);
		Ext.getCmp('txt-code-warehouse').setValue(data.code);
		Ext.getCmp('txt-name-warehouse').setValue(data.name);

		if(data.deactivated == 'Y')
		{
			Ext.getCmp('chk-deactivate-warehouse').setValue(true);
		}
		else
		{
			Ext.getCmp('chk-deactivate-warehouse').setValue(false);
		}
	}

	Ext.define('Checkup.Administration.Setup.Warehouse.Form.Warehouse',
	{
		extend 		: 'Ext.form.Panel',


		layout 		: 'column',
		border 		: true,

		width 		: 830,
		
		title 		: 'Warehouse/Store',

		defaultType : 'textfield',

		initComponent : function(){
			me = this;

			this.superclass.initComponent.call(this);
		},

		items 		: [
			{
				xtype 	: 'grid',
				id 		: 'grid-warehouse-list',
				width 	: 500,
				height 	: 275,
				padding : '10 5 10 10 ',
				store 	: warehouseStore,
				columns : [
					{ text : 'Code', dataIndex : 'code', flex : 1},
					{ text : 'Name', dataIndex : 'name', flex : 1}
				],
				listeners : {
					selectionchange : function(grid, selected, eOpts) {
						if(selected[0] != null && selected[0] != 'undefined')
						{
							populateFields(selected[0].raw);

							var warehouse = selected[0].raw.warehouse;
							if(warehouse != null && warehouse != 'undefined' && warehouse.length > 0)
							{
								Ext.getCmp('btn-delete-warehouse').disable();
							}
							else
							{
								Ext.getCmp('btn-delete-warehouse').enable();
							}
						}
					}
				}
			}, {
				xtype 	: 'fieldset',
				title 	: 'Store Information',
				width 	: 310,
				height 	: 265,
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
								name 		: 'id',
								id 			: 'id'
							}, {
								fieldLabel 	: 'Code',
								name 		: 'code',
								id 			: 'txt-code-warehouse',
								columnWidth : 1
							}, {
								fieldLabel 	: 'Name',
								name 		: 'name',
								id 			: 'txt-name-warehouse',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'checkbox',
								boxLabel 	: 'Deactivate',
								name 		: 'deactivate',
								id 			: 'chk-deactivate-warehouse',
								margin 		: '5 0 0 0',
								columnWidth : 1
							}, 
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
					Ext.getCmp('btn-delete-warehouse').disable();
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
                                	warehouseStore.load();
                                	me.getForm().reset(); 
                                	Ext.getCmp('grid-warehouse-list').getSelectionModel().deselectAll();
                               	});
                            },
                            failure : function(response, responseText) {
                                Ext.MessageBox.alert(
                                    'Failed',
                                    responseText.result.errorMessage
                                );
                            }
                        });

						Ext.getCmp('btn-delete-warehouse').disable();
                    }
				}
			}, {
				text 	: 'Delete',
				id 		: 'btn-delete-warehouse',
				disabled: true,
				handler : function()
				{
					var grid = Ext.getCmp('grid-warehouse-list');
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
										id : record.raw.id
									},
									success : function(response, opt)
									{
										result = Ext.JSON.decode(response.responseText);
										Ext.Msg.alert('Success', result.message,  function() { 
		                                	warehouseStore.load();
		                                	me.getForm().reset();
		                                	Ext.getCmp('grid-warehouse-list').getSelectionModel().deselectAll();
		                               	});
									},
									failure : function(response, opt)
									{
										result = Ext.JSON.decode(response.responseText);
										Ext.Msg.alert('Failed', result.errorMessage);
									}
								});

								Ext.getCmp('btn-delete-warehouse').disable();
							}
						});
					}
					else
					{
						Ext.Msg.alert('Delete', 'Please select a row to delete');
					}
				}
			}, {
				text 	: 'Close',
				handler : function()
				{
					me.getForm().reset();
					me.up('window').close();
				}
			}
		]

	});

	function abortRead() {
		reader.abort();
	}

	function errorHandler(evt) {
		switch(evt.target.error.code) {
		  	case evt.target.error.NOT_FOUND_ERR:
		    	alert('File Not Found!');
		    	break;
		  	case evt.target.error.NOT_READABLE_ERR:
		    	alert('File is not readable');
		    	break;
		  	case evt.target.error.ABORT_ERR:
		    	break; // noop
		  	default:
		  	  	alert('An error occurred reading this file.');
		};
	}

	function updateProgress(evt) {
		// evt is an ProgressEvent.
		if (evt.lengthComputable) {

			var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
			// Increase the progress bar length.
			if (percentLoaded < 100) {
				progress.style.width = percentLoaded + '%';
				progress.textContent = percentLoaded + '%';

			}
		}
	}

	function handleFileSelect(sourceID, targetID) {
		// Reset progress indicator on new file selection.


	    var files = Ext.getCmp(sourceID).getEl().down('input[type=file]').dom.files;

	    // Loop through the FileList and render image files as thumbnails.
	    for (var i = 0, f; f = files[i]; i++) {

	      	// Only process image files.
	      	if (!f.type.match('image.*')) {
	        	alert('Invalid image');
	      	}

	      	reader = new FileReader();

	      	reader.onerror = errorHandler;
	    	reader.onprogress = updateProgress;
	    	reader.onabort = function(e) {
	      		alert('File read cancelled');
	    	};
			reader.onloadstart = function(e) {
	      		//document.getElementById('progress_bar').className = 'loading';
	    	};
	    	//$('#overlap').val(f.name);

	    	reader.onload = function(e){
	    		/*progress.style.width = '100%';
	  			progress.textContent = '100%';*/
	  			
	 			setTimeout(function(){hideProgressBar(e, targetID)}, 2000);
	    	}

	      // Read in the image file as a data URL.
	      reader.readAsDataURL(f);
	    }
	}

	function hideProgressBar(e, targetID){
		Ext.getCmp(targetID).setSrc(e.target.result);
	}

})();