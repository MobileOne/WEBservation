var ConstatManager = Class({
    container : "#container",
    constats : [ // : Array
    	{ id : 1, clientId : 1, clientName : "ClientName1", 
            content : [
                {id : 1, type : "pic",   txt : "lienToPic" },
                {id : 1, type : "pic",   txt : "lienToPic" },
                {id : 1, type : "sound", txt : "lienToSound" },
                {id : 1, type : "video", txt : "lienToVideo" }
            ] 
        },
    	{ id : 2, clientId : 2, clientName : "ClientName2" },
    	{ id : 3, clientId : 3, clientName : "ClientName3" },
    	{ id : 4, clientId : 4, clientName : "ClientName4" },
    	{ id : 5, clientId : 5, clientName : "ClientName5" },
    	{ id : 6, clientId : 6, clientName : "ClientName6" },
    	{ id : 7, clientId : 7, clientName : "ClientName7" },
    	{ id : 8, clientId : 8, clientName : "ClientName8" },
    	{ id : 9, clientId : 9, clientName : "ClientName9" }
    ],

    initialize : function () { 
    },

    openConstats : function () { 
        $(this.container).empty();
        this.buildConstatList();
    },

    buildConstatList : function () {
        $(this.container).append( "<h2>Constats en attentes</h2>");
        for (var i = 0; i < this.constats.length; i++){
            var text = '<div class="row list-group-item" onclick="main.editConstat(' + this.constats[i].id + ')" >'
                     + this.constats[i].clientName
                     + '</div>'
            $(this.container).append( text);
        }
    },

    editConstat : function (id) {
        var constat = this.getConstatById( id);
        $(this.container).empty();
        $(this.container).append( "<h2>" + constat.clientName + "</h2>");


        for (var i = 0; i < constat.content.length; i++){
            console.log( constat.content)
        }
    },

    getConstatById : function (id) {
        for (var i = 0; i < this.constats.length; i++)
            if (this.constats[i].id == id) return this.constats[i];
    }
});
