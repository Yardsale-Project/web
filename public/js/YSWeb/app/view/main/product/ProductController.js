'use strict';

Ext.define('YSWeb.view.main.product.ProductController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.product',

    init : function () {
        this.control({
            
        });

        this.reader = null;
    },

    onFileFieldChange : function() {
        this.handleFileSelect('photopath', 'imguserpicture');
    },

    abortRead :  function() {
        this.reader.abort();
    },

    errorHandler    : function(evt) {
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
    },

    updateProgress  : function (evt) {
        // evt is an ProgressEvent.
        if (evt.lengthComputable) {

            var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            // Increase the progress bar length.
            if (percentLoaded < 100) {
                progress.style.width = percentLoaded + '%';
                progress.textContent = percentLoaded + '%';

                Ext.MessageBox.updateProgress(percentLoaded, percentLoaded + '% completed');

            }
        }
    },

    handleFileSelect : function(sourceReference, targetReference) {
        // Reset progress indicator on new file selection.


        var files = this.lookupReference(sourceReference).getEl().down('input[type=file]').dom.files;
        var me = this;

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                alert('Invalid image');
            }

            this.reader = new FileReader();

            this.reader.onerror = this.errorHandler;
            this.reader.onprogress = this.updateProgress;
            this.reader.onabort = function(e) {
                alert('File read cancelled');
            };
            this.reader.onloadstart = function(e) {
                Ext.MessageBox.show({
                    title: 'Please wait',
                    msg: 'Loading items...',
                    progressText: 'Initializing...',
                    width:300,
                    progress:true,
                    closable:false,
                    animateTarget: me.lookupReference(sourceReference)
                });
                //document.getElementById('progress_bar').className = 'loading';
            };
            //$('#overlap').val(f.name);

            this.reader.onload = function(e){
                /*progress.style.width = '100%';
                progress.textContent = '100%';*/
                
                setTimeout(function(){me.hideProgressBar(e, targetReference)}, 2000);
            }

            // Read in the image file as a data URL.
            this.reader.readAsDataURL(f);
        }
    },

    hideProgressBar : function (e, targetReference){
        Ext.MessageBox.hide();
        //this.showToast('Your fake items were loaded', 'Done');
        this.lookupReference(targetReference).setSrc(e.target.result);
    },

    onSaveBtnClick : function() {
        var form = this.view.getForm();
        var me = this;

        if(form.isValid()) {
            form.submit({
                url     : YSConfig.url + '/application/product/saveProduct',
                waitMsg : 'Saving data...',
                success : function( frm, action ) {
                    
                    Ext.Msg.show({
                        title       : 'Add new product',
                        msg         : action.result.message,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();
                                me.lookupReference('imguserpicture').setSrc('');
                                me.view.up('window').close();
                                
                            }
                        }, 
                        icon        : Ext.MessageBox.INFO
                    });

                },
                failure : function( frm, action ) {
                    YSDebug.log(action);
                    Ext.Msg.show({
                        title       : 'Add new product',
                        msg         : action.result.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();
                                me.lookupReference('imguserpicture').setSrc('');
                            }
                        }, 
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            });
        }
    },

    onResetBtnClick : function() {
        var form = this.view.getForm();

        form.reset();

        this.lookupReference('imguserpicture').setSrc('');
    }
});
