var Main = Class({
	container      : config.container,
    navBar         : config.navBar,
    constatManager : null,
    clientManager  : null,
    adminManager   : null,
    loginManager   : null,

    initialize : function () { 
        this.constatManager = new ConstatManager();
        this.clientManager  = new ClientManager();
        this.adminManager   = new AdminManager();
        this.loginManager   = new LoginManager();
    },

    deconnexion : function () { 
        sessionStorage.clear();
        config.userId  = null;
        config.userTok = null;
        this.openLoginPage();
    },

    openConstat : function ( constat) {
        this.constatManager.openConstat( constat);
    },

    openLoginPage : function(){
        this.loginManager.openLoginPage();
    },

    editConstat : function ( id) {
    	this.constatManager.editConstat( id);
    },

    openClientsList : function () {
        this.clientManager.openClientsList();
    },

    buildClientsList : function( clients){
        this.clientManager.buildClientsList( clients);
    },

    openAdmin : function () {
        this.adminManager.openAdmin();
    },

    vider : function( identifiant){
        this.removeEditor();
        var id = identifiant || this.container;
        $(id).empty();
    },

    submitNewClient : function( that){
        this.clientManager.submitNewClient( that);
    },

    buildMap : function (type, elt) {
        var that = this;
        setTimeout( function(){ that.constatManager.buildMap(type);}, 500);
        elt.setAttribute("onclick", "");
    },

    saveReport : function( constat){
        this.constatManager.saveReport( constat);
    },

    deleteUser : function(id){
        this.adminManager.deleteUser(id);
    },

    deleteCompagnie : function( id){
        this.adminManager.deleteCompagnie(id);
    },

    saveMarkdown : function(){
        this.constatManager.saveMarkdown();
    },

    submitNewUser : function( formId, idCorp){
        this.adminManager.submitNewUser( formId, idCorp);
    },

    submitNewCorp : function( formId){
        this.loginManager.submitNewCorp( formId);
    },

    submitLogin : function( formId, autoMail, autoPwd){
        this.loginManager.submitLogin( formId, autoMail, autoPwd);
    },

    submitModifUser : function( e){
        this.adminManager.submitModifUser(e);
    },

    submitModifCompany : function( e){
        this.adminManager.submitModifCompany(e);
    },

    addAlert : function( text, type, onClose){
        var text    = text    || "";
        var type    = type    || "success";
        var onClose = onClose || "";
        var alert = '   <div class="col-xs-10 alert alert-'+type+' alert-dismissable overflowAlert">'
                    +'      <button type="button" class="close" data-dismiss="alert" aria-hidden="true" onclick="'+onClose+'">&times;</button>'
                    +'      <strong>' + text + '</strong>'
                    +'  </div>'
        $(this.container).append( alert);
    },

    isEmail : function( email){
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if(!emailReg.test(email)) { this.addAlert("Adresse email non valide", "danger");  return false; }
        else return true;
    },

    isFormValid : function( tab){
        var bool = false;
        for(var i = 0; i < tab.length; i++) bool = bool || !tab[i];
        if ( bool) { main.addAlert("Formulaire non complet", "danger"); return false; }
        else return true;
    },

    hasInvalidChar : function( str){
        var reg = new RegExp(/<|>|&|--/);
        return reg.test(str)
    },

    getFormData : function(form, name){
        return form.find( "input[name="+name+"]" ).val().toString();
    },

    buildButton : function(type, color, text, onclick){
        var type    = type    || "button";
        var onclick = onclick || "";
        return '<button type="'+type+'" class="btn btn-'+color+'" onclick="'+onclick+'">'+text+'</button>'
    },

    buildInput : function(id, value, placeholder, isFormGroup, type, classes){
        var type    = type    || "text";
        var classes = classes || "";
        var input = '<input type="'+type+'" class="form-control" id="'+id+'" name="'+id+'" value="'+value+'" placeholder="'+placeholder+'">';
        return isFormGroup ? '<div class="form-group ' + classes + '">' + input + '</div>' : input;
    },

    buildNavBar : function( vider, userName){
        if (vider) { $(this.navBar).empty(); return; }
        if ( !$(this.navBar).is(':empty')  ) return;
        var nav = ''
        +'  <ul class="nav navbar-nav">'
        +'      <li><a href="#clients"  onclick="main.openClientsList()">Clients</a></li>'
        +'      <li><a href="#admin"    onclick="main.openAdmin()"      >Administration</a></li>'
        +'  </ul>'
        +'  <form class="navbar-form navbar-right">'
        +'      <a class="navbar-brand" href="#" style="padding-bottom:0px; padding-top:0px; line-height:30px">'+userName+'</a>'
        +'      <button type="button" class="btn btn-danger" onclick="main.deconnexion(); main.openLoginPage()" >Déconnexion</button>'
        +'  </form>'
        $(this.navBar).append( nav)
    },

    editor : null,

    createEditor : function( txt){
        if ( this.editor ) return;
        var config = {};
        this.editor = CKEDITOR.appendTo( 'input_editor', config, txt );
    },

    removeEditor : function(){
        if ( !this.editor ) return;
        this.editor.destroy();
        this.editor = null;
    },

    getUserId : function(){
        return config.userId;
    }

});
var main = new Main();
