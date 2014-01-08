var Ajax = Class({
    apiUrl : config.wsAPI,
    url    : null,
    data   : null,
    type   : null,

    initialize : function ( serviceName, data, type) { 
        this.url  = this.apiUrl + serviceName;
        if (data) this.data = JSON.stringify(data);
        this.type = type || "post";
    },

    call : function () { 
        this.startLoading();
        if (this.type != "post" && this.type != "get" && this.type != "put" && this.type != "delete") throw 'Type de requête "' + this.type + '" non valide';
        var self = this;
        var request = $.ajax({ type: this.type, url: this.url, data: this.data, timeout:config.timeout });
        request.done(function( data )   { self.stopLoading(); self.onSuccess( data) });
        request.fail(function( data )   { self.stopLoading(); self.onError( data)   });
        request.always(function( data ) { self.stopLoading(); self.onAlways( data)  });
    },

    startLoading : function(){
        var load = '<div id="loading" class="loading"><img src="img/loading.png"/><br/>Chargement</div>';
        $(config.container).append(load);
    },

    stopLoading : function(){
        $("#loading").remove();
    },

    onSuccess : function ( data) {}, // A implémenter selon besoin
    onError   : function ( data) { main.addAlert("Une erreur s'est produite", "danger"); }, // A implémenter selon besoin
    onAlways  : function ( data) {}  // A implémenter selon besoin
});
