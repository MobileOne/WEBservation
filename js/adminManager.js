var AdminManager = Class({
    container : config.container,
    users     : null,
    corp      : null,

    initialize : function () {},

    openAdmin : function () { 
        var self = this;
        $(this.container).empty();
        this.buildNewUsherForm();

        var req = new Ajax( "users/"+session.getItem('userId')+".json", null, "get"); 
        req.onSuccess = function( data){ self.corp = data.company; self.buildCorpStat(); 

            self.aa();

        };
        req.onError   = function( data){ main.addAlert("Problème au chargement de la société", "danger"); };
        req.call();

        
    },

    aa : function(){
        var self = this;
        var userList = new Ajax( "companies/"+this.corp.id+"/user.json", null, "get"); 
        userList.onSuccess = function( data){ self.users = data; console.log( self.users); self.buildUsersList(); };
        userList.onError   = function( data){ main.addAlert("Problème au chargement de la liste des utilisateurs", "danger"); };
        userList.call();
    },

    buildNewUsherForm : function(){
        var form = ''
        +'  <h2>Ajouter un utilisateur</h2>'
        +'  <form class="form-inline" role="form" method="post" id="form_new_user" onsubmit="main.submitNewUser(\'#form_new_user\'); return false;">'
        +       main.buildInput("first_name", "", "Prénom",       true)
        +       main.buildInput("last_name",  "", "Nom",          true)
        +       main.buildInput("email",      "", "Email",        true, "email")
        +       main.buildInput("pass",       "", "Mot de passe", true, "password")
        +'      <div class="form-group col-sm-12">'
        +'          <div class="col-sm-12">'
        +               main.buildButton("submit", "success", "Valider création")
        +'          </div>'
        +'      </div>'
        +'  </form>'
        $(this.container).append( form);
    },

    submitNewUser : function(formId, idCorp){
        var self   = this;
        var form   = formId ? $(formId) : $("#form_new_user");
        var idCorp = this.corp.id;

        prenom = main.getFormData( form, "first_name");
        nom    = main.getFormData( form, "last_name");
        mail   = main.getFormData( form, "email");
        pwd    = main.getFormData( form, "pass");

        if ( !main.isFormValid([prenom, nom, mail, pwd])) return;
        if ( !main.isEmail( mail)) return;

        var data = { firstName : prenom, lastName : nom, email : mail, password : pwd, companyId  : idCorp };
        var newUser = new Ajax( "users.json", data, "post"); 
        newUser.onSuccess = function( data){ main.addAlert("Utilisateur ajouté avec succès", "success", "main.openAdmin()"); };
        newUser.onError = function( data){  main.addAlert("Utilisateur non ajouté", "danger"); };
        newUser.call();
    },

    buildCorpStat : function(){
        this.corp.name  = this.corp.name  || "";
        var stat = ''
        +'  <h2>Information société</h2>'
        +'  <div class="panel-group" id="clientCollapse">'
        +'      <div class="panel panel-default">'
        +'          <div class="panel-heading">'
        +'              <h4 class="panel-title">'
        +'                  <a data-toggle="collapse" href="#corpStat">'+this.corp.name+'</a>'
        +'              </h4>'
        +'          </div>'
        +'      <div id="corpStat" class="panel-collapse collapse out">'
        +'          <div class="panel-body">'
        +'              <form class="form-horizontal" role="form" onsubmit="main.submitModifCompany(this); return false;">'
        +                   main.buildInput("name",  this.corp.name,  "Nom de la société", true)
        +'                  <div class="btn-group">'
        +                       main.buildButton("submit", "success", "Valider modification")
        +                       main.buildButton("reset", "primary", "Annuler")
        +                       main.buildButton("button", "danger",  "Supprimer société", 'main.deleteCompagnie('+this.corp.id+')')
        +'                  </div>'
        +'              </form>'
        +'          </div>'
        +'      </div>' 
        +'  </div>'

        $(this.container).append( stat);
    },

    buildUsersList : function(){
        $(this.container).append( '<h2>Liste des utilisateurs</h2>');
        for (var i = 0; i < this.users.length; i++){
            var list ='  <div class="panel-group" id="clientCollapse">'
                +'      <div class="panel panel-default">'
                +'          <div class="panel-heading">'
                +'              <h4 class="panel-title">'
                +'                  <a data-toggle="collapse" href="#buildCollapseOne_' + this.users[i].id +'">' + this.users[i].first_name + ' ' + this.users[i].last_name + ' </a>'
                +'              </h4>'
                +'          </div>'
                +'      <div id="buildCollapseOne_' + this.users[i].id +'" class="panel-collapse collapse out">';
                list += this.buildInfoForUser( this.users[i].id);
                list +='      </div>'
                +'  </div>'
            $(this.container).append( list);
        }
    },

    buildInfoForUser : function( id){
        var user = this.getUserById(id);         
        var info ="";
        user.firstName = user.firstName || "";
        user.name      = user.name      || "";
        user.email     = user.email     || "";
            info +='<div class="panel-body">'
                 +'     <form class="form-horizontal" method="post" role="form" onsubmit="main.submitModifUser(this); return false;">'
                 +'         <div style="display:none">' + main.buildInput("id", user.id, "Id", true) + '</div>'
                 +          main.buildInput("first_name", user.first_name, "Prénom", true)
                 +          main.buildInput("last_name",  user.last_name,  "Nom",    true)
                 +          main.buildInput("email",      user.email,      "Email",  true)
                 +'         <div class="btn-group">'
                 +              main.buildButton("submit", "success", "Valider modification")
                 +              main.buildButton("reset",  "primary", "Annuler")
                 +              main.buildButton("button", "warning", "Réinitialiser mot de passe")
                 +              main.buildButton("button", "danger",  "Supprimer utilisateur", 'main.deleteUser('+user.id+')')
                 +'         </div>'
                 +'     </form>'
                 +'</div>' 
        return info;
    },

    submitModifUser : function(event){
        var form = $(event);
        id     = main.getFormData( form, "id");
        prenom = main.getFormData( form, "first-name");
        nom    = main.getFormData( form, "last_name");
        mail   = main.getFormData( form, "email");

        if ( !main.isFormValid([prenom, nom, mail, id])) return;
        if ( !main.isEmail( mail)) return;

        var data = { firstName : prenom, lastName : nom, email : mail, password : pwd};
        var newUser = new Ajax( "users/"+id+".json", data, "put"); 
        newUser.onSuccess = function( data){ main.addAlert("Utilisateur modifié avec succès", "success", "main.openAdmin()"); };
        newUser.onError   = function( data){ main.addAlert("Utilisateur non modifié", "danger"); };
        newUser.call();
    },

    submitModifCompany : function(event){
        var form = $(event);
        nom = main.getFormData( form, "name");

        if ( !main.isFormValid([nom])) return;

        var data = { name : nom};
        var req = new Ajax( "companies/"+this.corp.id+".json", data, "put"); 
        req.onSuccess = function( data){ main.addAlert("Société modifié avec succès", "success", "main.openAdmin()"); };
        req.onError   = function( data){ main.addAlert("Société non modifié", "danger"); };
        req.call();
    },

    getUserById : function (id) { 
        for (var i = 0; i < this.users.length; i++) 
            if (this.users[i].id == id)
                return this.users[i];
    },

    deleteUser : function (id) { 
        if (!id || !confirm("Vraiment supprimer ?")) return;
        var newUser = new Ajax( "users/"+id+".json", null, "delete"); 
        newUser.onSuccess = function( data){ main.addAlert("Utilisateur supprimé avec succès", "success", "main.openAdmin()"); };
        newUser.onError   = function( data){ main.addAlert("Utilisateur non supprimé", "danger"); };
        newUser.call();
    },

    deleteCompagnie : function(id){
        if (!id || !confirm("Supprimer la société?")) return;
        if (!id || !confirm("Cela va également supprimer tous utilisateurs ainsi que les constats associés à cette société.\nVoulez-vous vraiment supprimer la société?")) return;
        var newUser = new Ajax( "companies/"+id+".json", null, "delete"); 
        newUser.onSuccess = function( data){ main.addAlert("Société supprimée avec succès", "success", "main.openAdmin()"); };
        newUser.onError   = function( data){ main.addAlert("Société non supprimé", "danger"); };
        newUser.call();
    }
});

