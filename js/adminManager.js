var AdminManager = Class({
    container : "#container",
    users : [ // : Array
        { id : 1, firstName : "Geoffrey",  name : "Noel", email : "nono@nono.fr"},
        { id : 2, firstName : "Fred",      name : "Baraillon"},
        { id : 3, firstName : "Jérémy",    name : "Duval"},
        { id : 4, firstName : "Guillaume", name : "Roy"},
        { id : 5, firstName : "Bastien",   name : "Poidevain"}
    ],

    corp : { id : 1, name : "Nono Corporation",  discUsage : 50, email : "nono@nonocorp.com"},

    initialize : function () { 
    },

    openAdmin : function () { 
        $(this.container).empty();
        this.buildNewUsherForm();
        this.buildCorpStat();
        this.buildUsersList();
    },

    buildNewUsherForm : function(){
        var form = ''
        +'  <h2>Ajouter un utilisateur</h2>'
        +'  <form class="form-inline" role="form">'
        +       this.buildInput("firstName", "", "Prénom", true)
        +       this.buildInput("name", "", "Nom", true)
        +       this.buildInput("email", "", "Email", true)
        +       this.buildInput("pass", "", "Mot de passe", true, "password")
        +'      <div class="form-group col-sm-12">'
        +'          <div class="col-sm-12">'
        +               this.buildButton("submit", "success", "Valider création")
        +'          </div>'
        +'      </div>'
        +'  </form>'
        $(this.container).append( form);
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
                +'                  <a data-toggle="collapse" href="#buildCollapseOne_' + this.users[i].id +'">' + this.users[i].firstName + ' ' + this.users[i].name + ' </a>'
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
                 +'     <form class="form-horizontal" role="form">'
                 +          this.buildInput("firstName", user.firstName, "Prénom", true)
                 +          this.buildInput("name",      user.name,      "Nom",    true)
                 +          this.buildInput("email",     user.email,     "Email",  true)
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

    buildButton : function(type, color, text, onclick){
        var type    = type    || "button";
        var onclick = onclick || "";
        return '<button type="'+type+'" class="btn btn-'+color+'" onclick="'+onclick+'">'+text+'</button>'
    },

    buildInput : function(id, value, placeholder, isFormGroup, type){
        var type = type || "text";
        var input = '<input type="'+type+'" class="form-control" id="'+id+'" value="'+value+'" placeholder="'+placeholder+'">';
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

