var Main = Class({
	container      : config.container,
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
    },

    submitNewUser : function(){
        this.adminManager.submitNewUser();
    },

    submitModifUser : function( e){
        this.adminManager.submitModifUser(e);
    },

    addAlert : function( text, type, onClose){
        var text    = text    || "";
        var type    = type    || "success"
        var onClose = onClose || ""
        var alert = '   <div class="col-xs-10 alert alert-'+type+' alert-dismissable overflowAlert">'
                    +'      <button type="button" class="close" data-dismiss="alert" aria-hidden="true" onclick="'+onClose+'">&times;</button>'
                    +'      <strong>' + text + '</strong>'
                    +'  </div>'
        $(this.container).append( alert);            
    },

    isEmail : function( email){
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if(!emailReg.test(email)) return false;
        else return true;
    }
});
var main = new Main();
