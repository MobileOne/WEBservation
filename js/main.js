var Main = Class({
	constatManager : null,
    clientManager  : null,

    initialize : function () { 
    	this.constatManager = new ConstatManager();
        this.clientManager  = new ClientManager();
    },

    openConstats : function () {
    	this.constatManager.openConstats();
    },

    editConstat : function ( id) {
    	this.constatManager.editConstat( id);
    },

    openClientsList : function () {
        this.clientManager.openClientsList();
    }
});
var main = new Main();
