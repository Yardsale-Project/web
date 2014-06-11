(function(){
	var me, origUsername, finalUsername;
	var url = 'application/user/getUsers',
		submit_url = 'application/user/saveUser',
		deleteUrl = 'application/user/deleteUser';
	var userFields = [
		'user_id', 'username', 'password', 'fName',
		'midName', 'lName', 'email', 'address',
		'gender', 'picLocation', 'deactivated',
		'role'
	];

	var genderStore = Ext.create('Ext.data.Store', {
	    fields: ['code'],
	    data : [
	        {"code":"M"},
	        {"code":"F"}
	    ]
	});

	var roleStore = Ext.create('Ext.data.Store', {
	    fields: ['id', 'type'],
	    data : [
	        {'id' : "0", "type":"Superuser"},
	        {'id' : "1", "type":"User"}
	    ]
	});

	var usersStore = Ext.create('Ext.data.Store',
	{
		id 		: 'store-users',
		proxy	: proxy(url, {}),
		
		autoLoad: true ,
	    fields: userFields
	});

	function populateFields(data)
	{
		Ext.getCmp('user_id').setValue(data.user_id);
		Ext.getCmp('txt-username-users').setValue(data.username);
		Ext.getCmp('txt-firstname-users').setValue(data.fName);
		Ext.getCmp('txt-middlename-users').setValue(data.midName);
		Ext.getCmp('txt-lastname-users').setValue(data.lName);
		Ext.getCmp('txt-email-users').setValue(data.email);
		Ext.getCmp('txt-address-users').setValue(data.address);
		Ext.getCmp('cbo-gender-users').setValue(data.gender);
		Ext.getCmp('cbo-role-users').setValue(data.role);

		if(data.picLocation)
		{
			Ext.getCmp('img-user-picture').setSrc( '/img/userPic/' + data.picLocation);
		}
		else
		{
			Ext.getCmp('img-user-picture').setSrc( '');
		}

		if(data.deactivated == 'Y')
		{
			Ext.getCmp('chk-deactivate-users').setValue(true);
		}
		else
		{
			Ext.getCmp('chk-deactivate-users').setValue(false);
		}

		origUsername = data.username;
	}

	Ext.define('Checkup.Administration.Users.Form.Users',
	{
		extend 		: 'Ext.form.Panel',


		layout 		: 'column',
		border 		: true,
		width 		: 940,
		height 		: 340,
		title 		: 'Users',

		defaultType : 'textfield',

		initComponent : function(){
			me = this;

			this.superclass.initComponent.call(this);
		},

		items 		: [
			{
				xtype 	: 'grid',
				id 		: 'grid-users-list',
				width 	: 500,
				height 	: 275,
				padding : '10 5 10 10 ',
				store 	: usersStore,
				columns : [
					{ text : 'Username', dataIndex : 'username', flex : 1},
					{ text : 'Firstname', dataIndex : 'fName', flex : 1},
					{ text : 'Middle Name', dataIndex : 'midName', flex : 1},
					{ text : 'Last Name', dataIndex : 'lName', flex : 1},
					{ text : 'Email', dataIndex : 'email', flex : 1},
					{ text : 'Gender', dataIndex : 'gender', flex : 1}
				],
				listeners : {
					selectionchange : function(grid, selected, eOpts) {
						if(selected[0] != null && selected[0] != 'undefined')
						{
							populateFields(selected[0].raw);

							Ext.getCmp('txt-password').allowBlank = true;
							Ext.getCmp('btn-delete-users').enable();
						}
					}
				}
			}, {
				xtype 	: 'fieldset',
				title 	: 'User Information',
				columnWidth 	: 1,
				height 	: 265,
				margin : '0 10 10 5',
				layout 	: 'column',
				items 	: [
					{
						xtype 		: 'panel',
						columnWidth : 1,
						layout 		: 'column',
						border 		: false,
						items 		: [
							{
								xtype 		: 'panel',
								columnWidth : 1,
								border 		: false,
								defaultType : 'textfield',
								items 		: [
									{
										fieldLabel 	: 'Username',
										name 		: 'username',
										id 			: 'txt-username-users',
										allowBlank 	: false
									}, {
										fieldLabel 	: 'Password',
										name 		: 'password',
										id 			: 'txt-password',
										inputType 	: 'password',
										allowBlank 	: false
									}, {
										fieldLabel 	: 'Firstname',
										name 		: 'firstname',
										id 			: 'txt-firstname-users',
										allowBlank 	: false
									}, {
										fieldLabel 	: 'Middle Name',
										name 		: 'middlename',
										id 			: 'txt-middlename-users',
										allowBlank 	: false
									}, {
										fieldLabel 	: 'Last Name',
										name 		: 'lastname',
										id 			: 'txt-lastname-users',
										allowBlank 	: false
									}
								]
							}, {
								xtype 		: 'panel',
								layout 		: 'vbox',
								width 		: 130,
								height 		: 130,
								margin 		: '0 0 0 10',
								border 		: false,
								items 		: [
									{
										xtype 		: 'image',
										width 		: 130,
										height 		: 98,
										style 		: 'border : 1px solid #CCC',
										id 			: 'img-user-picture',
										src 		: 'http://www.sencha.com/img/20110215-feat-html5.png'
									}, {
										xtype 		: 'filefield',
										width 		: 130,
										margin 		: '10 0 0 0',
										id 			: 'img-photo',
										name 		: 'img-photo',
										emptyText 	: 'Select Photo',
										buttonText 	: 'Upload',
										listeners 	: {

                                        	'change' 	: function(obj, value, opts) {

                                        		handleFileSelect('img-photo', 'img-user-picture');
                                        	}
                                        }
									}
								]
							}
						]
					}, {
						xtype 		: 'panel',
						columnWidth : 1,
						border 		: false,
						layout 		: 'column',
						defaultType : 'textfield',
						items 		: [
							{
								xtype 		: 'hidden',
								name 		: 'user_id',
								id 			: 'user_id'
							}, {
								fieldLabel 	: 'Email',
								name 		: 'email',
								id 			: 'txt-email-users',
								vtype 		: 'email',
								columnWidth : 1
							}, {
								fieldLabel 	: 'Address',
								name 		: 'address',
								id 			: 'txt-address-users',
								columnWidth : 1,
								margin 		: '5 0 0 0'
							}, {
								xtype 		: 'combo',
								fieldLabel 	: 'Gender',
								name 		: 'gender',
								id 			: 'cbo-gender-users',
							    store 		: genderStore,
							    queryMode 	: 'local',
							    displayField: 'code',
							    valueField 	: 'code',
							    forceSelection : false,
							    triggerAction : 'all',
							    margin 		: '5 0 0 0',
							    allowBlank 	: false
							}, {
								xtype 		: 'checkbox',
								boxLabel 	: 'Deactivate',
								name 		: 'deactivate',
								id 			: 'chk-deactivate-users',
								margin 		: '5 0 0 25'
							}, {
								xtype 		: 'combo',
								fieldLabel 	: 'Role',
								name 		: 'role',
								id 			: 'cbo-role-users',
							    store 		: roleStore,
							    queryMode 	: 'local',
							    displayField: 'type',
							    valueField 	: 'id',
							    forceSelection : false,
							    triggerAction : 'all',
							    margin 		: '5 0 5 0',
							    allowBlank 	: false
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
					Ext.getCmp('txt-password').allowBlank = false;
					Ext.getCmp('btn-delete-users').disable();
				}
			}, {
				text 	: 'Save',
				handler : function()
				{
					var form = me.getForm(),
						usernameEdit = 0;

					finalUsername = Ext.getCmp('txt-username-users').getValue();

					if(origUsername != finalUsername)
					{
						usernameEdit = 1;
					}

                    if(form.isValid())
                    {
                        form.submit({
                            url     : submit_url,
                            waitMsg : 'Saving data...',
                            params 	: {
                            	usernameEdit : usernameEdit
                            },
                            success : function(response, responseText) {
                                msg = Ext.Msg.alert('Success',  responseText.result.message, function() { 
                                	usersStore.load();
                                	me.getForm().reset(); 
                                	finalUsername = "";
                                	origUsername = "";
                                	Ext.getCmp('grid-users-list').getSelectionModel().deselectAll();
                               	});
                            },
                            failure : function(response, responseText) {
                                Ext.MessageBox.alert(
                                    'Failed',
                                    responseText.result.errorMessage
                                );
                            }
                        });

						Ext.getCmp('img-user-picture').setSrc('');
						Ext.getCmp('btn-delete-users').disable();
                    }
				}
			}, {
				text 	: 'Delete',
				id 		: 'btn-delete-users',
				disabled: true,
				handler : function()
				{
					var grid = Ext.getCmp('grid-users-list');
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
										user_id : record.raw.user_id
									},
									success : function(response, opt)
									{
										result = Ext.JSON.decode(response.responseText);
										Ext.Msg.alert('Success', result.message,  function() { 
		                                	usersStore.load();
		                                	me.getForm().reset(); 
		                                	finalUsername = "";
		                                	origUsername = "";
		                                	Ext.getCmp('grid-users-list').getSelectionModel().deselectAll();
		                               	});
									},
									failure : function(response, opt)
									{
										result = Ext.JSON.decode(response.responseText);
										Ext.Msg.alert('Failed', result.errorMessage);
									}
								});

								Ext.getCmp('btn-delete-users').disable();
								Ext.getCmp('img-user-picture').setSrc('');
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
					Ext.getCmp('img-user-picture').setSrc('');
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