var LoginManager = Class({
    container : config.container,
    navBar    : config.navBar,

    initialize : function () {},

    openLoginPage : function () { 
        var self = this;
        main.vider();
        $(this.container).append( "<h1>Bienvenue sur WEBservation</h1>");
        main.buildNavBar( true);
        this.buildLoginForm();
        this.buildNewCorpForm();
    },

    buildLoginForm : function(){
        var log = ''
        +'  <p>Se connecter</p>'
        +'  <form class="form-inline" role="form" id="formLogin" onsubmit="main.submitLogin(\'#formLogin\'); return false;">'
        +       main.buildInput("email", "", "Email",        true)
        +       main.buildInput("pass",  "", "Mot de passe", true, "password")
        +'      <button type="submit" class="btn btn-success">Connexion</button>'
        +'  </form>'
        $(this.container).append( log);
    },

    buildNewCorpForm : function(){
        var corp = ''
        +'  <hr/>'
        +'  <p>Création d\'une société avec premier compte utilisateur</p>'
        +'  <form class="form-horizontal" role="form" id="formNewCorp" onsubmit="main.submitNewCorp(\'#formNewCorp\'); return false;">'
        +       main.buildInput("new_corp_name", "", "Nom de la nouvelle société", true, "text", "col-sm-12")
        +       main.buildInput("first_name", "", "Prénom utilisateur", true, "text", "col-sm-12")
        +       main.buildInput("last_name", "", "Nom utilisateur", true, "text", "col-sm-12")
        +       main.buildInput("email", "", "Email", true, "text", "col-sm-12")
        +       main.buildInput("pass", "", "Password", true, "password", "col-sm-12")
        +'      <button type="submit" class="btn btn-success" >Valider inscription</button>'
        +'  </form>'

        $(this.container).append( corp);
    },

    submitNewCorp : function(formId){
        var self = this;
        var form = formId ? $(formId) : $("#formNewCorp");

        corp   = main.getFormData( form, "new_corp_name");
        prenom = main.getFormData( form, "first_name");
        nom    = main.getFormData( form, "last_name");
        mail   = main.getFormData( form, "email");
        pwd    = main.getFormData( form, "pass");

        if ( !main.isFormValid([corp, prenom, nom, mail, pwd])) return;
        if ( !main.isEmail( mail)) return;

        var d = { name : corp };
        var newCorp = new Ajax( "companies.json", d, "post"); 
        newCorp.onSuccess = function( data){ 
            var d = { firstName : prenom, lastName : nom, email : mail, password : pwd, companyId  : data.id };
            var newUser = new Ajax( "users.json", d, "post");
            newUser.onSuccess = function( data){ 
                main.addAlert("Société et utilisateur ajoutés avec succès - Veuillez vous connecter", "success"); 
                main.submitLogin( null, mail, pwd);
            };
            newUser.call(); 
        };
        newCorp.call();
    },

    submitLogin : function(formId, autoMail, autoPwd){
        var self = this;
        var form = formId ? $(formId) : $("#formLogin");

        mail = autoMail || main.getFormData( form, "email");
        pwd  = autoPwd  || main.getFormData( form, "pass");

        if ( !main.isFormValid([mail, pwd])) return;
        if ( !main.isEmail( mail)) return;      

        var d = { email : mail, password : pwd };
        var newCorp = new Ajax( "authentifications.json", d, "post", mail, pwd); 
        newCorp.onSuccess = function( data){
            if (data == "Wrong") main.addAlert("Erreur d'identification", "danger"); 
            else {
                console.log( data)
                var userName = data.username + " " + data.last_name;
                config.userId = data.id;
                session.setItem("userNameToDisplay", userName);
                main.openClientsList();
            }
        };
        newCorp.onError = function( data){ main.addAlert("Une erreur s'est produite", "danger"); };
        newCorp.call();
    }

});

