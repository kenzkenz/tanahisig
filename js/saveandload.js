$(function() {
    //------------------------------------------------------------------------------------------------------------------
    //geojsonで保存
    $("#drawContextmenu-save-ul a").click(function(){
        console.log($(this).text());
        /*
        drawSourceChangeFlg = false;
        var selectedFeatures = featureSelect.getFeatures();
        var features;
        if(selectedFeatures.getLength()===0) {
            features = drawSource.getFeatures();
        }else{//地物選択があるとき
            //features = selectedFeatures["a"];
            features = selectedFeatures.getArray();
            alert("選択された地物だけ保存します。");
        }
        if(!features.length) {
            alert("データがありません。");
            return;
        }
        */
        var features = drawLayer.getSource().getFeatures();
        var drawnGeojson = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        drawnGeojson = JSON.stringify(JSON.parse(drawnGeojson),null,1);
        //$("#geojson-text").html("<pre>" + drawnGeojson + "</pre>");
        var type = "text/plain";
        var blob = new Blob([drawnGeojson], {type: type});
        $(".save-a").remove();
        $("body").append("<a class='save-a'></a>");
        $(".save-a").attr({
            "href": window.URL.createObjectURL(blob),
            "download":"edit.geojson"
        });
        $(".save-a")[0].click();//[0]が肝
    });

})