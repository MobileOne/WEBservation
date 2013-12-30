var AdminManager = Class({
    container : config.container,
    users     : null,
    corp      : { id : 1, name : "Nono Corporation",  discUsage : 50, email : "nono@nonocorp.com"},

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
        +       this.buildInput("first_name", "", "Prénom",       true)
        +       this.buildInput("last_name",  "", "Nom",          true)
        +       this.buildInput("email",      "", "Email",        true, "email")
        +       this.buildInput("pass",       "", "Mot de passe", true, "password")
        +'      <div class="form-group col-sm-12">'
        +'          <div class="col-sm-12">'
        +               this.buildButton("button", "success", "Valider création", "main.submitNewUser()")
        +'          </div>'
        +'      </div>'
        +'  </form>'
        $(this.container).append( form);
    },

    submitNewUser : function(){
        var self = this;
        var form = $("#form_new_user");
        prenom = form.find( "input[name='first_name']" ).val();
        nom    = form.find( "input[name='last_name']" ).val();
        mail   = form.find( "input[name='email']" ).val();
        pwd    = form.find( "input[name='pass']" ).val();

        if (!prenom || !nom || !mail || !pwd) {
            main.addAlert("Formulaire non complet", "danger");
            return;
        }

        if ( !main.isEmail( mail)){
            main.addAlert("Adresse email non valide", "danger");
            return;
        } 

        var data = { firstName : prenom, lastName : nom, email : mail, password : pwd};
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
        +                   this.buildInput("name",  this.corp.name,  "Nom de la société", true)
        +                   this.buildInput("email", this.corp.email, "Email",             true)
        +'                  <div class="btn-group">'
        +                       this.buildButton("submit", "success", "Valider modification")
        +                       this.buildButton("reset", "primary", "Annuler")
        +                       this.buildButton("button", "warning", "Réinitialiser mot de passe")
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
                 +'         <div style="display:none">' + this.buildInput("id", user.id, "Id", true) + '</div>'
                 +          this.buildInput("first_name", user.first_name, "Prénom", true)
                 +          this.buildInput("last_name",  user.last_name,  "Nom",    true)
                 +          this.buildInput("email",      user.email,      "Email",  true)
                 +'         <div class="btn-group">'
                 +              this.buildButton("submit", "success", "Valider modification")
                 +              this.buildButton("reset",  "primary", "Annuler")
                 +              this.buildButton("button", "warning", "Réinitialiser mot de passe")
                 +              this.buildButton("button", "danger",  "Supprimer utilisateur", 'main.deleteUser('+user.id+')')
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

    buildButton : function(type, color, text, onclick){
        var type    = type    || "button";
        var onclick = onclick || "";
        return '<button type="'+type+'" class="btn btn-'+color+'" onclick="'+onclick+'">'+text+'</button>'
    },

    buildInput : function(id, value, placeholder, isFormGroup, type){
        var type = type || "text";
        var input = '<input type="'+type+'" class="form-control" id="'+id+'" name="'+id+'" value="'+value+'" placeholder="'+placeholder+'">';
        return isFormGroup ? '<div class="form-group">' + input + '</div>' : input;
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

