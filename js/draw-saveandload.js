$(function() {
    //------------------------------------------------------------------------------------------------------------------
    //
    $("#drawContextmenu-file-ul a").click(function(){
        switch ($(this).text()) {
            case "geojson保存":
                geojsonSave();
                break;
            case "ファイル読込":
                fileLoad();
                break;
            default:
                alert("作成中！")
        }
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
    });
    //------------------------------------------------------------------------------------------------------------------
    //ファイル読込
    $("body").on("change",".input-file",function(evt){
        var fileList = evt.target.files;
        console.log(fileList);
        var fileExtension = fileList[0]["name"].match(/([^.]+)$/)[0];
        console.log(fileExtension);
    });
    function fileLoad(){
        $(".input-file").remove();
        $("body").append("<input type='file' class='input-file'>");
        $(".input-file")[0].click();
    }
    //------------------------------------------------------------------------------------------------------------------
    //geojson保存
    function geojsonSave(){
        var features = drawLayer.getSource().getFeatures();
        var drawnGeojson = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        drawnGeojson = JSON.stringify(JSON.parse(drawnGeojson),null,1);
        console.log(drawnGeojson)
        //$("#geojson-text").html("<pre>" + drawnGeojson + "</pre>");
        var type = "text/plain";
        var blob = new Blob([drawnGeojson], {type: type});
        $(".save-a").remove();
        $("body").append("<a class='save-a'></a>");
        $(".save-a").attr({
            "href": window.URL.createObjectURL(blob),
            "download":"draw.geojson"
        });
        $(".save-a")[0].click();
    }
});