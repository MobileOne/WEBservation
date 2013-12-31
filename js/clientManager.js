var ClientManager = Class({
    container : config.container,
    clients : null,
    /*[ // : Array
    	{ id : 1, name : "Nono", 
            constats : [
                {id : 1, name : "test1" },
                {id : 2, name : "test2" },
                {id : 23, name : "test23" }
            ] 
        },
    	{ id : 2, name : "Fred" },
        { id : 3, name : "Sainto" },
        { id : 4, name : "Sapin" }




        [{  id : 2, 
            date : "2013-12-28T14:38:36-0500", 
            description : "Description A", 
            user : {
                id:1, 
                first_name: "testFqsdqsdqsdirstName", 
                last_name : "qsdqtestLaqsdqsdstName",
                email     : "testEmail",
                password  : "testPdqsdass"
            }
        },
        {   id : 1, 
            date : "2013-12-28T14:38:11-0500",
            description : "Description B",
            user : {
                id : 1,
                first_name : "testFqsdqsdqsdirstName",
                last_name  :"qsdqtestLaqsdqsdstName",
                email : "testEmail",
                password : "testPdqsdass"
            }
        }]
    ], */

    initialize : function () { 
    },

    openClientsList : function(){
        $(this.container).empty();
        this.buildAddClientForm();
        this.getClientsList();
        //this.buildClientsList();
    },

    getClientsList : function(){
        //var d = { name : corp };
        var clientList = new Ajax( "customers.json", null, "get"); 
        clientList.onSuccess = function( data){ 
            main.buildClientsList( data.customers); 
        };
        clientList.onError = function( data){  main.addAlert("Une erreur s'est produite", "danger"); };
        clientList.call();
    },

    buildAddClientForm : function(){
        var form = ''
        +' <h2>Ajouter un nouveau client</h2>'
        +' <form class="form-horizontal" role="form">'
        +'   <div class="form-group col-sm-12">'
        +'     <input type="text"     class="form-control" id="create_client"  placeholder="Identité du nouveau client">'
        +'   </div>'        
        +'   <div class="form-group">'
        +'     <div class="col-sm-12">'
        +'       <button type="submit" class="btn btn-success">Valider création</button>'
        +'     </div>'
        +'   </div>'
        +' </form>'
        $(this.container).append( form);
    },

    buildClientsList : function( clients){
        this.clients = clients;
        $(this.container).append( '<h2>Liste des clients</h2>');


/*****************************************************

Problème d'asynchrone, une fois qu'on a tous les clients, 
il faut faire un get report from client id qui nous retourne 
tous les report d'un client avec aussi les infos du clients 
( et de l'user créateur)

******************************************************/



        for (var i = 0; i < clients.length; i++){
            var a   ='  <div class="panel-group" id="clientCollapse">'
                +'      <div class="panel panel-default">'
                +'          <div class="panel-heading">'
                +'              <h4 class="panel-title">'
                +'                  <a data-toggle="collapse" data-parent="buildCollapse_' + clients[i].id +'" href="#buildCollapseOne_' + clients[i].id +'"> ' + clients[i].first_name + ' </a>'
                +'              </h4>'
                +'          </div>'
                +'      <div id="buildCollapseOne_' + clients[i].id +'" class="panel-collapse collapse out">';
                a += main.buildConstatsForAClient( clients[i].id);
                a +='      </div>'
                +'  </div>'
            $(this.container).append( a);
            console.log( main.buildConstatsForAClient( clients[i].id))
        }
    },

    buildConstatsForAClient : function( id){
        //var client = this.getClientById(id);         
        

        var reportList = new Ajax( "customers/"+id+"/report.json", null, "get"); 
        reportList.onSuccess = function( data){ 
            //console.log( data[0]);
            var constat ="";
            for (var i = 0; i < data.length; i++){
                //console.log( data[i].id);
                //debugger
            constat +='<div class="panel-body">'
                     +' <div onclick="main.editConstat('+data[i].id+')">'+data[i].id+'</div> '
                     +'  '
                     +'  '
                     +'</div>'  
                     
            }
            console.log( constat)
            return constat;
        };
        reportList.onError = function( data){  main.addAlert("Une erreur s'est produite", "danger"); };
        reportList.call();

       /* if(!client.constats) return constat;
        for (var i = 0; i < client.constats.length; i++){
            constat +='<div class="panel-body">'
                     +' <div onclick="main.editConstat('+client.constats[i].id+')">'+client.constats[i].name+'</div> '
                     +'  '
                     +'  '
                     +'</div>'  
        }
        return constat;*/
    },

    getClientById : function (id) { 
        for (var i = 0; i < this.clients.length; i++) 
            if (this.clients[i].id == id)
                return this.clients[i];
    }
});
