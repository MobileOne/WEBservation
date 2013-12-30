var ConstatManager = Class({
    container      : config.container,
    markdownEditor : null,
    constats       : [ // : Array
    	{ id : 1, clientId : 1, clientName : "Constat1", 
            content : [
                {id : 1, type : "img",   value : "data:image/jpg;base64,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" },
                {id : 2, type : "audio", value : "test.mp3" },
                {id : 2, type : "gps",   x : 44.8, y : -0.59 } // Bordeaux
            ] 
        },
    	{ id : 2, clientId : 2, clientName : "Constat2" , 
            content : [
                {id : 2, type : "audio", value : "test.mp3" },
                {id : 2, type : "gps",   x : 44.8, y : -0.59 } // Bordeaux
            ] 
        },
    	{ id : 3, clientId : 3, clientName : "Constat3" },
    	{ id : 4, clientId : 4, clientName : "Constat4" },
    	{ id : 5, clientId : 5, clientName : "Constat5" },
    	{ id : 6, clientId : 6, clientName : "Constat6" },
    	{ id : 7, clientId : 7, clientName : "Constat7" },
    	{ id : 8, clientId : 8, clientName : "Constat8" },
    	{ id : 9, clientId : 9, clientName : "Constat9" }
    ],

    initialize : function () { 
    },

    openConstats : function () { 
        $(this.container).empty();

        var Dpost = { firstName: "Geoffrey", lastName: "Noel", email: "nono@test.com", password: "coucou" };

        var req = new Ajax( "users.json", Dpost, "post");
        //var req = new Ajax( "users/"+2+".json", null, "get"); 
        req.onSuccess = function( data){
            console.log( "Success");
            console.log( data);
        };

        req.onError = function( data){
            console.log( "Error");
            console.log( data);
        };

        req.onAlways = function( data){
            console.log( "Always");
            console.log( data);
        }
        //req.call();

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
        if (!constat){
            $('#alert_text').text("Erreur : Constat indisponible")
           $('#alert').modal()
            return "";
        }
        $(this.container).empty();
        $(this.container).append( "<h2>" + constat.clientName + "</h2>");

        $(this.container).append( '<form class="form-horizontal" role="form">');

        var textArea    = '<label for="constat_text">Texte</label>'
                        + '<iframe id="printPdf" srcdoc="" style="display:none"></iframe>'
                        + '<textarea id="constat_text" class="form-control" rows="10" style="display:none;"> </textarea>'
        
        var epiceditor = '<div id="epiceditor" style="height:px; width:px; background-color: grey;"></div>'

        $(this.container).append( textArea);
        $(this.container).append( epiceditor);

        var editorText = $("#constat_text").val();

        var opts = {
          container: 'epiceditor',
          textarea: 'constat_text',
          clientSideStorage: false,
          localStorageName: 'epiceditor',
          useNativeFullscreen: false,
          parser: marked,
          file: {
            name: 'epiceditor',
            defaultContent: editorText || '',
            autoSave: 100
          },
          theme: {
            base: '/themes/base/epiceditor.css',
            preview: '/themes/preview/preview-dark.css',
            editor: '/themes/editor/epic-dark.css'
          },
          button: {
            preview: true,
            fullscreen: false,
            bar: "auto"
          },
          focusOnLoad: true,
          shortcut: {
            modifier: 18,
            fullscreen: 70,
            preview: 80
          },
          string: {
            togglePreview: 'Activer prévisualisation',
            toggleEdit: 'Activer édition',
            toggleFullscreen: 'FullScreen'
          },
          autogrow: true
        }
        this.markdownEditor = new EpicEditor(opts).load();

        if (!constat.content){
            $(this.container).append( "Ce constat ne contient aucune pièce jointe");
            $(this.container).append( '<br/><button type="submit" class="btn btn-success" onclick="main.saveMarkdown()">Imprimer</button>');
            $(this.container).append( '</form>');
            return;
        }

        $(this.container).append(this.buildCollapse("Audio", constat, "audio"));
        $(this.container).append(this.buildCollapse("Photo", constat, "img"));
        $(this.container).append(this.buildCollapse("Position", constat, "gps"));
        $(this.container).append( '<br/><button type="submit" class="btn btn-success" onclick="main.saveMarkdown()">Imprimer</button>');
        $(this.container).append( '</form>');
    },

    saveMarkdown : function(){
        var html = this.markdownEditor.exportFile( null, "html");
        $("#printPdf").attr("srcdoc", html);

        setTimeout( function(){
            
            window.frames["printPdf"].print();
        }, 1000);

    },

    buildPJ : function( constat, type, balise){
        var content = "";
        for (var i = 0; i < constat.content.length; i++){ 
            if ( constat.content[i].type == type){ 
                content +='<div class="panel-body">'
                        if (type == "img")   content +=' <div class="col-sm-12"> <input class="form-control" type="text" value="![Image](' + constat.content[i].value + ')"/> </div> <img style="width:100%;"  src="' + constat.content[i].value + '"/>'
                        if (type == "audio") content +='<audio style="width:100%;" controls="controls" src="data/audio/' + constat.content[i].value + '"/>'
                        if (type == "gps")   {
                            content +='<div id="map-canvas" style="height:500px; width:100%; display:block" x="'+constat.content[i].x+'" y="'+constat.content[i].y+'"></div>'
                        }
                content +='</div>' 
            }
        }      
        return content;
    },

    buildMap : function( type){
        if (!$("#map-canvas") || type != "gps") return;
        var x = $("#map-canvas").attr("x");
        var y = $("#map-canvas").attr("y");
        
        var mapOptions = {
            center: new google.maps.LatLng(x, y),
            zoom: 15,
            streetViewControl : true
        };

        var markerOptions = {
            position: new google.maps.LatLng(x, y)
        };
        var marker = new google.maps.Marker(markerOptions);
        var map    = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        marker.setMap( map);
    },
      
    buildCollapse : function( title, constats, type){
        var a   ='  <div class="panel-group" id="buildCollapse_' + title +'" onClick="main.buildMap(\''+type+'\', this)">'
                +'      <div class="panel panel-default">'
                +'          <div class="panel-heading">'
                +'              <h4 class="panel-title">'
                +'                  <a data-toggle="collapse" data-parent="buildCollapse_' + title +'" href="#buildCollapseOne_' + title +'"> ' + title + ' </a>'
                +'              </h4>'
                +'          </div>'
                +'      <div id="buildCollapseOne_' + title +'" class="panel-collapse collapse out">';

        if(type == "img")   a += this.buildPJ( constats, "img");
        if(type == "audio") a += this.buildPJ( constats, "audio");
        if(type == "gps")   a += this.buildPJ( constats, "gps");

            a  +='      </div>'
                +'  </div>'
        return a;
    },

    getConstatById : function (id) {
        for (var i = 0; i < this.constats.length; i++) if (this.constats[i].id == id) return this.constats[i];
    }
});


