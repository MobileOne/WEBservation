var Main = Class({
	constatManager : null,

    initialize : function () { 
    	this.constatManager = new ConstatManager();
    },

    openConstats : function () {
    	this.constatManager.openConstats();
    },

    editConstat : function ( id) {
    	this.constatManager.editConstat( id);
    }
});
var main = new Main();
