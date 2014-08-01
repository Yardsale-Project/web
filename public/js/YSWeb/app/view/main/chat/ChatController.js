'use strict';

Ext.define('YSWeb.view.main.chat.ChatController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.chat',


    init : function () {

        this.control({
            'app-chat' : {
                afterrender      : 'onAfterRender'
            }
        });

        this.socket = io.connect('http://192.168.1.36:3555');
    },

    onAfterRender : function() {
        
        var me = this;

        this.socket.on('connect', function(){
        // call the server-side function 'adduser' and send one parameter (value of prompt)
            me.socket.emit('adduser', 'buyer');
        });

        // listener, whenever the server emits 'updatechat', this updates the chat body
        this.socket.on('updatechat', function (username, data) {
            var main = me.lookupReference('messageContent');
            var isTyping = me.lookupReference('isTyping');
            isTyping.hide();

            main.update({
                data: username + ' : ' + data
            });

            main.getTargetEl().scroll('b', 100000, true);
        });

        this.socket.on('userIsTyping', function (username) {

            if(username != 'buyer') {
                var isTyping = me.lookupReference('isTyping');

                console.log('user is typing', isTyping);

                isTyping.setText('<i>' + username + ' is typing...</i>');

                isTyping.show();
            }
        });

        // listener, whenever the server emits 'updateusers', this updates the username list
        this.socket.on('updateusers', function(data) {
            //$('#users').empty();
            //$.each(data, function(key, value) {
                //$('#users').append('<div>' + key + '</div>');
            //});
        });
    },

    onEnterPress : function(field, event) {
        if (event.getKey() === event.ENTER) {

            this.socket.emit('sendchat', field.getValue());

            
            field.setValue('');
            console.log(field.getValue());
        }
    },

    onKeyPress : function() {
        this.socket.emit('isTyping');
    }
});
