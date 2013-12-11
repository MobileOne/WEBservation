var ConstatManager = Class({
    container : "#container",
    constats : [ // : Array
    	{ id : 1, clientId : 1, clientName : "ClientName1", 
            content : [
                {id : 1, type : "pic",   value : "test.jpg" },
                {id : 2, type : "pic",   value : "test.jpg" },
                {id : 3, type : "sound", value : "test.mp3" },
                {id : 4, type : "sound", value : "test.mp3" },
                {id : 5, type : "video", value : "lienToVideo" }
            ] 
        },
    	{ id : 2, clientId : 2, clientName : "ClientName2" },
    	{ id : 3, clientId : 3, clientName : "ClientName3" },
    	{ id : 4, clientId : 4, clientName : "ClientName4" },
    	{ id : 5, clientId : 5, clientName : "ClientName5" },
    	{ id : 6, clientId : 6, clientName : "ClientName6" },
    	{ id : 7, clientId : 7, clientName : "ClientName7" },
    	{ id : 8, clientId : 8, clientName : "ClientName8" },
    	{ id : 9, clientId : 9, clientName : "ClientName9" }
    ],

    initialize : function () { 
    },

    openConstats : function () { 
        $(this.container).empty();
        this.buildConstatList();
    },

    buildConstatList : function () {
        $(this.container).append( '<h2>Constats en attentes</h2>');
        $(this.container).append( '<ul class="list-group">');
        for (var i = 0; i < this.constats.length; i++){
            var text = '<li class="list-group-item" onclick="main.editConstat(' + this.constats[i].id + ')">'
                     + this.constats[i].clientName
                     + '</li>'
            $(this.container).append( text);
        }
        $(this.container).append( "</ul>");
    },

    editConstat : function (id) {
        var constat = this.getConstatById( id);
        $(this.container).empty();
        $(this.container).append( "<h2>" + constat.clientName + "</h2>");

        $(this.container).append( '<form class="form-horizontal" role="form">');

        var textArea    = '<label for="constat_text">Texte</label>'
                        + '<textarea id="constat_text" class="form-control" rows="10"></textarea>'

       $(this.container).append( textArea);

        if (!constat.content){
            $(this.container).append( "Ce constat ne contient aucune pièce jointe");
            return;
        }

        



        /*for (var i = 0; i < constat.content.length; i++){
            if ( constat.content[i].type == "sound"){
                var audio = this.buildCollapse( constat.content[i]);
                $(this.container).append( audio);
            }
        }*/

        

        $(this.container).append(this.buildCollapse("Audio", constat, "audio"));
        $(this.container).append(this.buildCollapse("Photo", constat, "pic"));
        $(this.container).append( '</form>');
    },

    buildAudioPlayer : function( constat){
        if ( !constat) return "";
        var audio = "";
        for (var i = 0; i < constat.content.length; i++){ 
            if ( constat.content[i].type == "sound"){
                audio  +='<div class="panel-body">'
                        +'  <audio id="audio_' + constat.content[i].id + '" preload="auto" controls>'
                        +'      <source src="data/sound/' + constat.content[i].value + '" />'
                        +'  </audio>'
                        +'</div>'  
                $( 'audio_' + constat.content[i].id).audioPlayer({
                    classPrefix: 'audioplayer',
                    strPlay: 'Play',
                    strPause: 'Pause',
                    strVolume: 'Volume'
                });
            }
        }      
        return audio;
    },

    buildPicture : function( constat){
        if ( !constat) return "";
        var pic = "";
        for (var i = 0; i < constat.content.length; i++){ 
            if ( constat.content[i].type == "pic"){
                pic  +='<div class="panel-body">'
                        +'  <img src="data/pic/' + constat.content[i].value + '"/>'
                        +'      '
                        +'  '
                        +'</div>'  
            }
        }      
        return pic;
    },

    buildCollapse : function( title, constats, type){
        var a   ='  <div class="panel-group" id="buildCollapse_' + title +'">'
                +'      <div class="panel panel-default">'
                +'          <div class="panel-heading">'
                +'              <h4 class="panel-title">'
                +'                  <a data-toggle="collapse" data-parent="buildCollapse_' + title +'" href="#buildCollapseOne_' + title +'"> ' + title + ' </a>'
                +'              </h4>'
                +'          </div>'
                +'      <div id="buildCollapseOne_' + title +'" class="panel-collapse collapse out">';

        if(type == "audio")  a += this.buildAudioPlayer( constats);
        if(type == "pic")    a += this.buildPicture( constats);

            a  +='      </div>'
                +'  </div>'
        return a;
    },

    getConstatById : function (id) {
        for (var i = 0; i < this.constats.length; i++)
            if (this.constats[i].id == id) return this.constats[i];
    }
});
