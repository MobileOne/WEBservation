var ConstatManager = Class({
    container      : config.container,
    markdownEditor : null,
    constats       : null,

    initialize : function () { 
    },

    openConstats : function ( userName) { 
        main.buildNavBar( false, userName);
        main.vider();
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
        if (!constat) return "";
        main.vider();
        $(this.container).append( "<h2>" + constat.title + "</h2>");
        $(this.container).append( "<h3>" + constat.customer.first_name + " " + constat.customer.last_name +  "</h3>");
        $(this.container).append( '<iframe id="printPdf" srcdoc="" style="display:none"></iframe>');
        $(this.container).append( '<div id="input_editor"></div>');

        if (constat.songs.length == 0 && constat.pictures.length == 0 && constat.position_x == null && constat.position_y == null){
            $(this.container).append("Ce constat ne contient aucune pièce jointe");
            $(this.container).append('<br/><button type="button" class="btn btn-success" onclick="main.saveMarkdown()">Imprimer</button>');
            $(this.container).append('<button type="button" onclick="main.saveReport('+constat.id+')" class="btn btn-success">Sauvegarder le constat</button>');
            main.createEditor(constat.description);
            return;
        }
        
        if (constat.songs.   length > 0)                              $(this.container).append(this.buildCollapse("Audio", constat, "audio"));
        if (constat.pictures.length > 0)                              $(this.container).append(this.buildCollapse("Photos", constat, "img"));
        if (constat.position_x != null && constat.position_y != null) $(this.container).append(this.buildCollapse("Position", constat, "gps"));
        $(this.container).append('<br/><button type="button" class="btn btn-success" onclick="main.saveMarkdown()">Imprimer</button>');
        $(this.container).append('<button type="button" onclick="main.saveReport('+constat.id+')" class="btn btn-success">Sauvegarder le constat</button>');
        main.createEditor(constat.description);
    },


    buildPJ : function( constat, type){
        var content = "";
        if (type=="img")   for (var i = 0; i < constat.pictures.length; i++) content +='<div class="panel-body"> <div class="col-sm-12"> <input class="form-control" type="text" value="' + constat.pictures[i].data + '"/> </div> <img style="width:100%;"  src="' + constat.pictures[i].data + '"/> </div>'; 
        if (type=="audio") for (var i = 0; i < constat.songs.length; i++)    content +='<div class="panel-body"> <audio style="width:100%;" controls="controls" src="file.mp3"/> </div>'; 
        if (type=="gps")   content +='<div class="panel-body"> <div id="address"></div> <div id="map-canvas" style="height:500px; width:100%; display:block" x="'+constat.position_x+'" y="'+constat.position_y+'"></div> </div>';
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
        // x = 44.8
        // y = -0.6

        var request = $.get( "http://maps.googleapis.com/maps/api/geocode/json?latlng="+x+","+y+"&sensor=false"); 
        request.done(function( data ) { $("#address").append( data.results[0].formatted_address); });
       
        var markerOptions = {
            position: new google.maps.LatLng(x, y)
        };
        var marker = new google.maps.Marker(markerOptions);
        var map    = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        marker.setMap( map);
    },

    saveReport : function( constatId){
        console.log( constatId);
        var desc = main.editor.getData();
        var data = { userId: 1, customerId: 1, description : desc, positionX : 45, positionY : 45 };
        var req = new Ajax( "reports/"+constatId+".json", data, "put"); 
        req.onSuccess = function( data){ main.addAlert("Constat sauvegardé avec succès", "success", "main.openConstats()"); };
        req.onError   = function( data){ console.log( data); main.addAlert("Constat non sauvegardé", "danger"); };
        req.call();
    },

    saveMarkdown : function(){
        $("#printPdf").attr("srcdoc", main.editor.getData());
        setTimeout( function(){ window.frames["printPdf"].print(); }, 1000);

    }
});