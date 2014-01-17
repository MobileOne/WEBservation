var Ajax = Class({
    apiUrl : config.wsAPI,
    url    : null,
    data   : null,
    type   : null,
    basic  : null,

    initialize : function ( serviceName, data, type, mail, password) { 
        this.url  = this.apiUrl + serviceName;
        if (data) this.data = JSON.stringify(data);
        this.type = type || "post";
        if (mail && password) config.userTok = this.buildAuth( mail, password);
        this.basic = config.userTok;
    },

    buildAuth : function(user, password){
        if (!user || !password) return null;
        var tok = user + ':' + password;
        var hash = btoa(tok);
        return "Basic " + hash;
    },

    call : function ( special) { 
        if ( !special && main.hasInvalidChar(this.data.toLowerCase())) {  main.addAlert("Caractère(s) dangereux détecté(s) - Accès refusé", "danger"); return;}
        this.startLoading();
        var self = this;
        if (this.type != "post" && this.type != "get" && this.type != "put" && this.type != "delete") throw 'Type de requête "' + this.type + '" non valide';

        var request = $.ajax({  type   : this.type, 
                                url    : this.url, 
                                data   : this.data, 
                                timeout: config.timeout,
                                headers: {"Authorization": this.basic}
         });
        request.done(function( data )   { self.stopLoading(); self.onSuccess( data) });
        request.fail(function( data )   { self.stopLoading(); self.onError( data)   });
        request.always(function( data ) { self.stopLoading(); self.onAlways( data)  });
    },

    startLoading : function(){
        var load = '<div class="loadingBack" id="loadingBack"></div><div id="loading" class="loading"><img src="img/loading.png"/><br/>Chargement</div>';
        $(config.container).append(load);
    },

    stopLoading : function(){
        $("#loadingBack").remove();
        $("#loading").remove();
    },

    onSuccess : function ( data) {}, // A implémenter selon besoin
    onError   : function ( data) { main.addAlert("Une erreur s'est produite", "danger"); }, // A implémenter selon besoin
    onAlways  : function ( data) {}  // A implémenter selon besoin
});
