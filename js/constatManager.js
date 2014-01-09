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
        $(this.container).append( "<h3>" + constat.customer.first_name +  "</h3>");
        var content     = "";
        /*var textArea    = '<iframe id="printPdf" srcdoc="" style="display:none"></iframe>'
                        + '<textarea id="constat_text"  name="constat_text" class="form-control" rows="10" style="display:none;">'+ constat.description +'</textarea>'
        
        var epiceditor = '<div id="epiceditor" style="height:px; width:px; background-color: grey;"></div>'

        content += textArea + epiceditor;

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
        }*/

        if (constat.songs.length == 0 && constat.pictures.length == 0 && constat.position_x == null && constat.position_y == null){
            content += "Ce constat ne contient aucune pièce jointe";
            content += '<br/><button type="button" class="btn btn-success" onclick="main.saveMarkdown()">Imprimer</button>';
        }
        else{
            if (constat.songs.   length > 0)                              content += this.buildCollapse("Audio", constat, "audio");
            if (constat.pictures.length > 0)                              content += this.buildCollapse("Photos", constat, "img");
            if (constat.position_x != null && constat.position_y != null) content += this.buildCollapse("Position", constat, "gps");
            content += '<br/><button type="button" class="btn btn-success" onclick="main.saveMarkdown()">Imprimer</button>';
            content += '<button type="submit" class="btn btn-success">Sauvegarder le constat</button>';
        }
        $(this.container).append( '<form class="form-horizontal" role="form" onsubmit="main.saveReport(this); return false;">'+content+'</form>');
       // this.markdownEditor = new EpicEditor(opts).load();
    },

    buildPJ : function( constat, type){
        var content = "";
        if (type=="img")   for (var i = 0; i < constat.pictures.length; i++) content +='<div class="panel-body"> <div class="col-sm-12"> <input class="form-control" type="text" value="![Image](' + constat.pictures[i].data + ')"/> </div> <img style="width:100%;"  src="' + constat.pictures[i].data + '"/> </div>'; 
        if (type=="audio") for (var i = 0; i < constat.songs.length; i++)    content +='<div class="panel-body"> <audio style="width:100%;" controls="controls" src="file.mp3"/> </div>'; 
        if (type=="gps")   content +='<div class="panel-body"> <div id="map-canvas" style="height:500px; width:100%; display:block" x="'+constat.position_x+'" y="'+constat.position_y+'"></div> </div>';
        return content;
    },
      
    buildCollapse : function( title, constat, type){
        var txt ='  <div class="panel-group" id="buildCollapse_' + title +'" onClick="main.buildMap(\''+type+'\', this)">'
                +'      <div class="panel panel-default">'
                +'          <div class="panel-heading">'
                +'              <h4 class="panel-title">'
                +'                  <a data-toggle="collapse" data-parent="buildCollapse_' + title +'" href="#buildCollapseOne_' + title +'"> ' + title + ' </a>'
                +'              </h4>'
                +'          </div>'
                +'      <div id="buildCollapseOne_' + title +'" class="panel-collapse collapse out">'
                +           this.buildPJ( constat, type)
                +'      </div>'
                +'  </div>'
        return txt;
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

    saveReport : function( event){
        var form = $(event);
        text  = main.getFormData( form, "constat_text");

alert( text);
        return;

        if ( !main.isFormValid([text])) return;

        var data = { firstName : prenom, lastName : nom, email : mail, password : pwd};
        var newUser = new Ajax( "users/"+id+".json", data, "put"); 
        newUser.onSuccess = function( data){ main.addAlert("Utilisateur modifié avec succès", "success", "main.openAdmin()"); };
        newUser.onError   = function( data){ main.addAlert("Utilisateur non modifié", "danger"); };
        newUser.call();
    },

    saveMarkdown : function(){
        var html = this.markdownEditor.exportFile( null, "html");
        $("#printPdf").attr("srcdoc", html);
        setTimeout( function(){ window.frames["printPdf"].print(); }, 1000);

    }
});


