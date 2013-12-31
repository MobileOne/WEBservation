var AdminManager = Class({
    container : config.container,
    users     : null,
    corp      : { id : 1, name : "Nono Corporation"},

    initialize : function () {},

    openAdmin : function () { 
        var self = this;
        $(this.container).empty();
        this.buildNewUsherForm();
        this.buildCorpStat();

        var userList = new Ajax( "users.json", null, "get"); 
        userList.onSuccess = function( data){ 
            self.users = data.users;
            self.buildUsersList();
        };

        userList.onError = function( data){
            $(this.container).append( '<h2>Liste des utilisateurs</h2>');
            $(this.container).append( 'Erreur de chargement');
        };
        userList.call();
    },

    buildNewUsherForm : function(){
        var form = ''
        +'  <h2>Ajouter un utilisateur</h2>'
        +'  <form class="form-inline" role="form" method="post" id="form_new_user">'
        +       main.buildInput("first_name", "", "Prénom",       true)
        +       main.buildInput("last_name",  "", "Nom",          true)
        +       main.buildInput("email",      "", "Email",        true, "email")
        +       main.buildInput("pass",       "", "Mot de passe", true, "password")
        +'      <div class="form-group col-sm-12">'
        +'          <div class="col-sm-12">'
        +               main.buildButton("button", "success", "Valider création", "main.submitNewUser('#form_new_user')")
        +'          </div>'
        +'      </div>'
        +'  </form>'
        $(this.container).append( form);
    },

    submitNewUser : function(formId, idCorp){
        var self   = this;
        var form   = formId ? $(formId) : $("#form_new_user");
        var idCorp = idCorp ? idCorp : 1;

        prenom = form.find( "input[name='first_name']" ).val();
        nom    = form.find( "input[name='last_name']" ).val();
        mail   = form.find( "input[name='email']" ).val();
        pwd    = form.find( "input[name='pass']" ).val();

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
        this.corp.email = this.corp.email || "";
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
        +'              <form class="form-horizontal" role="form">'
        +                   main.buildInput("name",  this.corp.name,  "Nom de la société", true)
        +'                  <div class="btn-group">'
        +                       main.buildButton("submit", "success", "Valider modification")
        +                       main.buildButton("reset", "primary", "Annuler")
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
        id     = form.find( "input[name='id']" ).val();
        prenom = form.find( "input[name='first_name']" ).val();
        nom    = form.find( "input[name='last_name']" ).val();
        mail   = form.find( "input[name='email']" ).val();
        pwd    = form.find( "input[name='pass']" ).val();

        if (!prenom || !nom || !mail || !id || !pwd) {
            main.addAlert("Formulaire non complet", "danger");
            return;
        }

        if ( !main.isEmail( mail)){
            main.addAlert("Adresse email non valide", "danger");
            return;
        } 

        var data = { id : id, firstName : prenom, lastName : nom, email : mail, password : pwd};
        var newUser = new Ajax( "users.json", data, "post"); 
        newUser.onSuccess = function( data){ main.addAlert("Utilisateur modifié avec succès", "success", "main.openAdmin()"); };
        newUser.onError = function( data){  main.addAlert("Utilisateur non modifié", "danger"); };
        newUser.call();
    },

    getUserById : function (id) { 
        for (var i = 0; i < this.users.length; i++) 
            if (this.users[i].id == id)
                return this.users[i];
    },

    deleteUser : function (id) { 
        if (!id || !confirm("Vraiment supprimer ?")) return;
        console.warn( id + " 'deleteError' non implémentée");
    }
});

