var Main = Class({
	constatManager : null,
    clientManager  : null,
    adminManager   : null,

    initialize : function () { 
    	this.constatManager = new ConstatManager();
        this.clientManager  = new ClientManager();
        this.adminManager   = new AdminManager();
    },

    openConstats : function () {
    	this.constatManager.openConstats();
    },

    editConstat : function ( id) {
    	this.constatManager.editConstat( id);
    },

    openClientsList : function () {
        this.clientManager.openClientsList();
    },

    openAdmin : function () {
        this.adminManager.openAdmin();
    },

    buildMap : function (type, elt) {
        var that = this;
        setTimeout( function(){ that.constatManager.buildMap(type);}, 500);
        elt.setAttribute("onclick", "")
    },

    deleteUser : function(id){
        this.adminManager.deleteUser(id);
    },

    saveMarkdown : function(){
        this.constatManager.saveMarkdown();
    }
});
var main = new Main();
