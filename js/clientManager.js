var ClientManager = Class({
    container : "#container",
    clients : [ // : Array
    	{ id : 1, name : "Nono", 
            constats : [
                {id : 1, name : "test1" },
                {id : 2, name : "test2" },
                {id : 23, name : "test3" }
            ] 
        },
    	{ id : 2, name : "Fred" },
        { id : 3, name : "Sainto" },
        { id : 4, name : "Sapin" }
    ],

    initialize : function () { 
    },

    openClientsList : function(){
        $(this.container).empty();
        this.buildClientsList();
    },

    buildClientsList : function(){
        $(this.container).append( '<h2>Liste des clients</h2>');

        for (var i = 0; i < this.clients.length; i++){
            var a   ='  <div class="panel-group" id="clientCollapse">'
                +'      <div class="panel panel-default">'
                +'          <div class="panel-heading">'
                +'              <h4 class="panel-title">'
                +'                  <a data-toggle="collapse" data-parent="buildCollapse_' + this.clients[i].id +'" href="#buildCollapseOne_' + this.clients[i].id +'"> ' + this.clients[i].name + ' </a>'
                +'              </h4>'
                +'          </div>'
                +'      <div id="buildCollapseOne_' + this.clients[i].id +'" class="panel-collapse collapse out">';
                a += this.buildConstatsForAClient( this.clients[i].id);
                a +='      </div>'
                +'  </div>'
            $(this.container).append( a);
        }
    },

    buildConstatsForAClient : function( id){
        var client = this.getClientById(id);         
        var constat ="";
        if(!client.constats) return constat;
        for (var i = 0; i < client.constats.length; i++){
            constat +='<div class="panel-body">'
                     +' <div onclick="main.editConstat('+client.constats[i].id+')">'+client.constats[i].name+'</div> '
                     +'  '
                     +'  '
                     +'</div>'  
        }
        return constat;
    },

    getClientById : function (id) { 
        for (var i = 0; i < this.clients.length; i++) 
            if (this.clients[i].id == id)
                return this.clients[i];
    }
});


/*
buildPJ : function( constat, type, balise){
        var content = "";
        for (var i = 0; i < constat.content.length; i++){ 
            if ( constat.content[i].type == type){
                content +=' <div class="panel-body">'
                        +'      <'+type+' style="width:100%;" controls="controls" src="data/'+type+'/' + constat.content[i].value + '"/>'
                        +'  </div>'  
            }
        }      
        return content;
    },
*/