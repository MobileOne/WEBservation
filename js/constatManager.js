var ConstatManager = Class({
    container      : config.container,
    markdownEditor : null,
    constats       : null,

    initialize : function () { 
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

        if (constat.sounds.length == 0 && constat.pictures.length == 0 && constat.position_x == null && constat.position_y == null){
            $(this.container).append("Ce constat ne contient aucune pièce jointe");
            $(this.container).append('<br/><button type="button" class="btn btn-success" onclick="main.saveMarkdown()">Imprimer</button>');
            $(this.container).append('<button type="button" onclick="main.saveReport('+constat.id+')" class="btn btn-success">Sauvegarder le constat</button>');
            main.createEditor(constat.description);
            return;
        }
        
        if (constat.sounds.  length > 0)                              $(this.container).append(this.buildCollapse("Média", constat, "media"));
        if (constat.pictures.length > 0)                              $(this.container).append(this.buildCollapse("Photos", constat, "img"));
        if (constat.position_x != null && constat.position_y != null) $(this.container).append(this.buildCollapse("Position", constat, "gps"));
        $(this.container).append('<br/><button type="button" class="btn btn-success" onclick="main.saveMarkdown()">Imprimer</button>');
        $(this.container).append('<button type="button" onclick="main.saveReport('+constat.id+')" class="btn btn-success">Sauvegarder le constat</button>');
        main.createEditor(constat.description || config.initText);
    },


    buildPJ : function( constat, type){
        var content = "";
        if (type=="img")   for (var i = 0; i < constat.pictures.length; i++) content +='<div class="panel-body"> <div class="col-sm-12"> <textarea style="width:100%;">' + constat.pictures[i].data + '</textarea> </div> <img style="width:100%;"  src="' + constat.pictures[i].data + '"/> </div>'; 
        if (type=="media") 
            for (var i = 0; i < constat.sounds.length; i++){
                var son = constat.sounds[i].url;
                if ( son.indexOf(".mp3") != -1 || son.indexOf(".ogg") != -1 || son.indexOf(".wav") != -1)
                    content +='<div class="panel-body"> <audio style="width:100%;" controls="controls" src="'+ constat.sounds[i].url +'"/> </div>';

                else if ( son.indexOf(".mp4") != -1 || son.indexOf(".webm") != -1 || son.indexOf(".ogv") != -1)
                    content +='<div class="panel-body"> <video style="width:100%;" controls="controls" src="'+ constat.sounds[i].url +'"/> </div>'; 

                else content +='<div class="panel-body"> Média non compatible </div>'; 
            }
        if (type=="gps")   content +='<div class="panel-body"> <div id="address"></div> <div id="map-canvas" style="height:500px; width:600px; display:block" x="'+constat.position_x+'" y="'+constat.position_y+'"></div> </div>';
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
            zoom: 18,
            streetViewControl : true
        };

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
        var desc = main.editor.getData();
        var data = { description : desc };
        var req = new Ajax( "reports/"+constatId+".json", data, "put"); 
        req.onSuccess = function( data){ main.addAlert("Constat sauvegardé avec succès", "success", "main.openClientsList()"); };
        req.onError   = function( data){ main.addAlert("Constat non sauvegardé", "danger"); };
        req.call( true);
    },

    saveMarkdown : function(){
        var txt = main.editor.getData() + "<div style='width:100%; height : 500px; position : relative; text-align:center;'>" + $("#map-canvas").html() + "</div>";
        $("#printPdf").attr("srcdoc", txt)
        setTimeout( function(){ window.frames["printPdf"].print(); }, 1000);
    }
});