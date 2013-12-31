var Ajax = Class({
    apiUrl : config.wsAPI,
    url    : null,
    data   : null,
    type   : null,

    initialize : function ( url, data, type) { 
        this.url  = this.apiUrl + url;
        if (data) this.data = JSON.stringify(data);
        this.type = type || "post";
    },

    call : function () { 
        if (this.type != "post" && this.type != "get") throw 'Type de requête "' + this.type + '" non valide';
        var self = this;
        var request = this.type == "post" ? $.post( this.url , this.data) : $.get( this.url , this.data);
        request.done(function( data )   { self.onSuccess( data) });
        request.fail(function( data )   { self.onError( data)   });
        request.always(function( data ) { self.onAlways( data)  });
    },

    onSuccess : function ( data) {}, // A implémenter selon besoin
    onError   : function ( data) { main.addAlert("Une erreur s'est produite", "danger"); }, // A implémenter selon besoin
    onAlways  : function ( data) {}  // A implémenter selon besoin
});
