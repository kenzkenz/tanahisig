(function() {
    //------------------------------------------------------------------------------------------------------------------
    //各種計測
    //------------------------------------------------------------------------------------------------------------------
    //線の長さを計算
    var funcTDistance = function(feature){
        if(!$("#drawContextmenu-measure-btn").hasClass("btn-primary")) return;
        var tDistance = 0;
        var fromCoord,toCoord;
        var coordAr = feature.getGeometry().getCoordinates();
        var geomType = feature.getGeometry().getType();
        switch (geomType) {
            case "Point":
                return;//描き初めは１点でありPoint。そのときは抜ける。
                break;
            case "LineString":
                for(var i = 0; i <coordAr.length-1; i++){
                    fromCoord = turf.toWgs84(coordAr[i]);
                    toCoord = turf.toWgs84(coordAr[i+1]);
                    tDistance = tDistance + turf.distance(fromCoord,toCoord);
                }
                break;
            case "Polygon":
                for(var i = 0; i <coordAr[0].length-1; i++){
                    fromCoord = turf.toWgs84(coordAr[0][i]);
                    toCoord = turf.toWgs84(coordAr[0][i+1]);
                    tDistance = tDistance + turf.distance(fromCoord,toCoord);
                }
                break;
            case "MultiPolygon":
                //マルチポリゴンのときは計算しない。0を送る。
                tDistance = null;
                return tDistance;
            default:
        }
        if(tDistance===0) {
            tDistance = "";
        }else if(tDistance<1) {
            tDistance = String((Math.round(tDistance*1000)/1000*1000).toLocaleString()) + "m";//1m単位で四捨五入
        }else{
            tDistance = String((Math.round(tDistance*100)/100).toLocaleString()) + "km";//10m単位で四捨五入
        }
        //console.log(tDistance)
        return tDistance;
    };
    //------------------------------------------------------------------------------------------------------------------
    //地物の面積を計算
    var funcTArea = function(feature){
        if(!$("#drawContextmenu-measure-btn").hasClass("btn-primary")) return;
        var coordAr = feature.getGeometry().getCoordinates();
        var geomType = feature.getGeometry().getType();
        var tPolygon;
        switch (geomType) {
            case "Polygon":
                tPolygon = turf.polygon(coordAr);
                break;
            case "MultiPolygon":
                tPolygon = turf.multiPolygon(coordAr);
                break;
            default:
        }
        tPolygon = turf.toWgs84(tPolygon);
        var tArea = turf.area(tPolygon);//面積計算
        if(tArea<1000000) {
            tArea = String((Math.floor(tArea*100)/100).toLocaleString()) + "m2";
        }else{
            tArea = String((Math.floor(tArea/1000000*100)/100).toLocaleString()) + "km2";
        }
        return tArea;
    };
    measure = function(type,feature){
        switch (type) {
            case "area":
                return funcTArea(feature);
                break;
            case "distance":
                return funcTDistance(feature);
                break;
            default:
        }
    }

})();