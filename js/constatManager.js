var ConstatManager = Class({
    container      : config.container,
    markdownEditor : null,
    constats       : null,

    initialize : function () { 
    },

    openConstats : function ( userName) { 
        main.buildNavBar( false, userName);
        $(this.container).empty();
        var self = this;
        //var getReport = new Ajax( "reports.json", null, "get"); 
        //getReport.onSuccess = function( data){ 
        //    console.log( data);
       //     self.constats = data;
            self.buildConstatList();
       // };
       // getReport.call();
    },

    buildConstatList : function () {
        $(this.container).append( '<h2>Constats</h2>');
        if (!this.constats) { $(this.container).append( 'Pas de constats disponible'); return;}
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
        var getReport = new Ajax( "reports/"+id+".json", null, "get"); 
        getReport.onSuccess = function( data){ 
            if (!data) { main.addAlert("Constat non disponible", "danger"); return; }
            main.openConstat( data);
        };
        getReport.call();
        return;
    },

    openConstat : function ( constat) {
        console.log( constat);
        if (!constat) return "";

        $(this.container).empty();
        $(this.container).append( "<h2>" + constat.title + "</h2>");
        //$(this.container).append( "<h3>" + constat.customer.first_name +  "</h3>");

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

        $(this.container).append(this.buildCollapse("Pictures", constat, "audio"));
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
      
    buildCollapse : function( title, constat, type){
        var a   ='  <div class="panel-group" id="buildCollapse_' + title +'" onClick="main.buildMap(\''+type+'\', this)">'
                +'      <div class="panel panel-default">'
                +'          <div class="panel-heading">'
                +'              <h4 class="panel-title">'
                +'                  <a data-toggle="collapse" data-parent="buildCollapse_' + title +'" href="#buildCollapseOne_' + title +'"> ' + title + ' </a>'
                +'              </h4>'
                +'          </div>'
                +'      <div id="buildCollapseOne_' + title +'" class="panel-collapse collapse out">';

        if(type == "img")   a += this.buildPJ( constat, "img");
        if(type == "audio") a += this.buildPJ( constat, "audio");
        if(type == "gps")   a += this.buildPJ( constat, "gps");

            a  +='      </div>'
                +'  </div>'
        return a;
    },

    getConstatById : function (id) { alert("getConstatById"); return;
        for (var i = 0; i < this.constats.length; i++) if (this.constats[i].id == id) return this.constats[i];
    }
});


