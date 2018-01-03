$(function() {
    var source = drawLayer.getSource();
    $("#drawContextmenu-effect-ul a").click(function(){
        switch ($(this).text()) {
            case "リセット":
                effectReset();
                break;
            case "ボロノイ図":
                voronoiCreate();
                break;
            case "ヒートマップ":
                alert("作成中！");
                break;
            default:
                return;
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //エフェクトリセット
    function effectReset(){
        var features = source.getFeatures();
        for(var i = 0; i <features.length; i++){
            var type = features[i].getProperties()["_type"];
            if(type==="voronoi" || type==="buffer") source.removeFeature(features[i])
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //バッファー図　実際に作ったりする
    function bufferCreate(radius){
        if(!rightClickedFeatyure) return;
        var features = [rightClickedFeatyure];//右クリック地物を対象とする。配列で書いているが今の所右クリック地物は一つ
        //まず右クリック地物の既存のバッファーを消す
        for(var i = 0; i <features.length; i++){
            var geomType = features[i].getGeometry().getType();
            var coord;
            switch (geomType) {
                case "Point":
                    coord = features[i].getGeometry().getCoordinates();
                    break;
                case "LineString":
                    coord = features[i].getGeometry().getCoordinates()[0];
                    break;
                case "Polygon":
                    coord = features[i].getGeometry().getCoordinates()[0][0];
                    break;
                default:
            }
            var pixel = map1.getPixelFromCoordinate(coord);
            var f = [],l = [];
            map1.forEachFeatureAtPixel(pixel,function(feature,layer){
                if(layer){
                    if(layer.getProperties()["name"]==="drawLayer"){
                        f.push(feature);
                        l.push(layer);
                    }
                }
            });
            for(var j = 0; j <f.length; j++){
                if(f[j].getProperties()["_type"]==="buffer") source.removeFeature(f[j]);
            }
        }
        if(radius===0) return;
        radius = radius * 1.179832968;
        //ここからバッファーを作る
        for (var i = 0; i < features.length; i++) {
            var geomType = features[i].getGeometry().getType();
            var coordAr,coord,geojsonFeature;
            switch (geomType) {
                case "Point":
                    geojsonFeature = turf.point(turf.toWgs84(features[i].getGeometry().getCoordinates()));
                    break;
                case "LineString":
                    coordAr = [];
                    coord = features[i].getGeometry().getCoordinates();
                    for (var j = 0; j < coord.length; j++) {
                        coordAr.push(turf.toWgs84(coord[j]));
                    }
                    geojsonFeature = turf.lineString(coordAr);
                    break;
                case "Polygon":
                    coordAr = [];
                    coord = features[i].getGeometry().getCoordinates()[0];
                    for (var j = 0; j < coord.length; j++) {
                        coordAr.push(turf.toWgs84(coord[j]));
                    }
                    geojsonFeature = turf.polygon([coordAr]);
                    break;
                default:
            }
            var options = {
                units:"meters",
                steps: 32
            };
            var buffered = turf.buffer(geojsonFeature,radius,options);
            buffered = turf.toMercator(buffered);
            var geometry = new ol.geom.Polygon(buffered["geometry"]["coordinates"]);
            var newFeature = new ol.Feature({
                "_fillColor": "rgba(0,0,255,0.3)",
                "_color":"rgb(128,128,128)",
                "_weight":"1",
                "_type": "buffer",
                geometry: geometry
            });
            source.addFeature(newFeature);
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //バッファー図　コントロール関係
    $("#drawContextmenu-effect-li-buffer").click(function(){
        var tgtElem = $(this).find("ul");
        tgtElem.toggle(500);
        tgtElem.css({
            left:"102%",
            top:$(this).position()["top"] + "px"
        })
    });
    $("#buffer-input-text").change(function(){
        bufferCreate(Number(zen2han($(this).val())));
    });
    $("#buffer-input-text").spinner({
        max:50000, min:0, step:10,
        spin:function(event,ui){
            bufferCreate(ui.value);
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //ボロノイ図
    function voronoiCreate(){
        var d3Color = d3.scale.category20();
        var mapExtent = map1.getView().calculateExtent(map1.getSize());
        mapExtent = ol.proj.transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326');
        var options = {
            bbox: mapExtent
        };
        var features = source.getFeatures();
        for(var i = 0; i <features.length; i++){
            var effet = features[i].getProperties()["_type"];
            if(effet==="voronoi") source.removeFeature(features[i])
        }
        var features4326 = [];
        for (var i = 0; i < features.length; i++) {
            var geomType = features[i].getGeometry().getType();
            var point;
            if (geomType === "Point") {
                point = turf.point(turf.toWgs84(features[i].getGeometry().getCoordinates()));
                features4326.push(point);
            }
        }
        var featureCollection = turf.featureCollection(features4326);
        var voronoiPolygons = turf.voronoi(featureCollection, options);
        for (var i = 0; i < voronoiPolygons["features"].length; i++) {
            var vpCoords4326 = voronoiPolygons["features"][i]["geometry"]["coordinates"][0];
            var vpCoordAr = [];
            for (var j = 0; j < vpCoords4326.length; j++) {
                var vpCoord = turf.toMercator(vpCoords4326[j]);
                vpCoordAr.push(vpCoord)
            }
            var geometry = new ol.geom.Polygon([vpCoordAr]);
            var rgb = d3.rgb(d3Color(i));
            var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)";
            var newFeature = new ol.Feature({
                geometry: geometry,
                "_fillColor": rgba,
                "_type": "voronoi"
            });
            source.addFeature(newFeature);
        }
    }
});
