var ClientManager = Class({
    container : config.container,
    clients : null,

    initialize : function () { 
    },

    openClientsList : function(){
        main.buildNavBar( false, session.getItem("userNameToDisplay"));
        main.vider();
        this.buildAddClientForm();
        this.getClientsList();
    },

    getClientsList : function(){
        var clientList = new Ajax( "customers.json", null, "get"); 
        clientList.onSuccess = function( data){ 
            main.buildClientsList( data.customers); 
        };
        clientList.call();
    },

    buildAddClientForm : function(){
        var form = ''
        +' <h2>Ajouter un nouveau client</h2>'
        +' <form class="form-horizontal" id="addNewClient" role="form" onsubmit="main.submitNewClient(\'#addNewClient\'); return false;">'
        +       main.buildInput("first_name", "", "Prénom nouveau client", true, "text")
        +       main.buildInput("last_name" , "", "Nom nouveau client", true, "text")
        +'   <div class="form-group">'
        +'     <div>'
        +'       <button type="submit" class="btn btn-success">Valider création</button>'
        +'     </div>'
        +'   </div>'
        +' </form>'
        $(this.container).append( form);
    },

    submitNewClient : function(formId){
        var self = this;
        var form = formId ? $(formId) : $("#formLogin");

        prenom = main.getFormData( form, "first_name");
        nom    = main.getFormData( form, "last_name");

        if ( !main.isFormValid([prenom, nom])) return;

        var d = { firstName : prenom, lastName : nom };
        var newCorp = new Ajax( "customers.json", d, "post"); 
        newCorp.onSuccess = function( data){ 
            if (data) main.addAlert("Utilisateur crée", "success", "main.openClientsList()"); 
        };
        newCorp.onError = function( data){ main.addAlert("Une erreur s'est produite lors de la création du client", "danger"); };
        newCorp.call();
    },

    buildClientsList : function( clients){
        this.clients = clients;
        $(this.container).append( '<h2>Liste des clients</h2>');

        for (var i = 0; i < clients.length; i++){
            var a   ='  <div class="panel-group" id="clientCollapse">'
                +'      <div class="panel panel-default">'
                +'          <div class="panel-heading">'
                +'              <h4 class="panel-title">'
                +'                  <a data-toggle="collapse" data-parent="buildCollapse_' + clients[i].id +'" href="#buildCollapseOne_' + clients[i].id +'"> ' + clients[i].last_name + ' ' + clients[i].first_name + ' </a>'
                +'              </h4>'
                +'          </div>'
                +'          <div id="buildCollapseOne_' + clients[i].id +'" class="panel-collapse collapse out">';
                +'          </div>'
                +'  </div>'
            $(this.container).append( a);
            this.buildConstatsForAClient( clients[i].id);
        }
    },

    buildConstatsForAClient : function( id){
        var reportList = new Ajax( "customers/"+id+"/report.json", null, "get"); 
        reportList.onSuccess = function( data){ 
            var constat ="";
            for (var i = 0; i < data.length; i++){
            constat +=' <div class="panel-body">'
                     +'     <div onclick="main.editConstat('+data[i].id+')">'+ data[i].title +'</div> '
                     +' </div>'
            }
            $('#buildCollapseOne_' + id).append( constat);
        };
        reportList.onError = function(data){ console.log(data);}
        reportList.call();
    }
});
