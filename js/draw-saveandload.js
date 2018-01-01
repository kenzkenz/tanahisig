$(function() {
    //ドラッグアンドドロップのインタラクション-----------------------------
    var dragAndDrop = new ol.interaction.DragAndDrop({
        formatConstructors: [ol.format.GeoJSON]
    });
    map1.addInteraction(dragAndDrop);
    //------------------------------------------------------------------------------------------------------------------
    //ドラッグアンドドロップ
    dragAndDrop.on('addfeatures', function(evt) {
        var fileExtension = evt["file"]["name"].split(".")[evt["file"]["name"].split(".").length - 1]
        switch (fileExtension) {
            case "geojson":
                geojsonLoad(evt.file);
                break;
            case "csv":
                csvLoad(evt.file);
                break;
            default:
                return;
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //ファイル　トグル
    $("#drawContextmenu-file-ul a").click(function(){
        switch ($(this).text()) {
            case "ファイル読込":
                fileLoad();
                break;
            case "geojson保存":
                geojsonSave();
                break;
            case "gist保存":
                gistSave();
                break;
            case "csv保存":
                csvSave();
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
        var file = fileList[0];
        console.log(fileList);
        var fileExtension = fileList[0]["name"].match(/([^.]+)$/)[0];
        console.log(fileExtension);
        switch (fileExtension) {
            case "json":
            case "geojson":
                geojsonLoad(file);
                break;
            case "csv":
                csvLoad(file);
                break;
            default:
                alert("対応していません。")
        }
    });
    function fileLoad(){
        $(".input-file").remove();
        $("body").append("<input type='file' class='input-file' accept='.csv,.geojson'>");
        $(".input-file")[0].click();
    }
    //------------------------------------------------------------------------------------------------------------------
    //csv読込
    function csvLoad(file){
        var reader = new FileReader();
        reader.readAsBinaryString(file);//ここ超重要。文字コード変換のために必要
        reader.onload = function(e){
            var result = e.target.result;
            //-----------------------------
            //エンコード処理
            var sjisArray = str2Array(result);
            var uniArray = Encoding.convert(sjisArray, 'UNICODE', 'SJIS');
            result = Encoding.codeToString(uniArray);
            //-----------------------------
            var csvAr = $.csv()(result);
            //先頭行------------------------
            var topRow = csvAr[0];
            var geocodingColumun;
            for(var i = 0; i <topRow.length; i++){
                console.log(topRow[i]);
                if(topRow[i]==="変換元住所") {
                    geocodingColumun = i;
                    break;
                }
            }
            //----------------------------
            var geocodPromise = [];
            for (var i=1; i < csvAr.length; i++) {//行頭を飛ばすので１から
                var target = csvAr[i][geocodingColumun];
                if(!target) break;
                geocodPromise[i-1] =//行頭を飛ばしたので１引いて調整
                    new Promise(function(resolve){
                        $.ajax({
                            type: "get",
                            url: "https://msearch.gsi.go.jp/address-search/AddressSearch",
                            dataType: "json",
                            data:{
                                "q":target
                            }
                        }).done(function (json) {
                            if(json.length) {
                                resolve(json);
                            }else{
                                resolve("nomatch");
                            }
                        }).fail(function () {
                            resolve("fail");
                        });
                    });
            }
            //-----------------------
            //プロミスオール
            Promise.all(geocodPromise).then(function(result) {
                for(var i = 0; i < result.length; i++){
                    var getCoord = result[i];
                    if(getCoord!=="nomatch" && getCoord!=="fail") {
                        var feature = result[i][0];
                        var coord = feature["geometry"]["coordinates"];
                        coord = ol.proj.transform(coord, "EPSG:4326", "EPSG:3857");
                        var geometry = new ol.geom.Point(coord);
                        var newFeature = new ol.Feature({
                            geometry: geometry,
                            "_fillColor": "blue",
                            "取得住所":feature["properties"]["title"]
                        });
                        for (var j = 0; j < topRow.length; j++) {
                            if (topRow[j].substr(0, 1) !== "_") newFeature["D"][topRow[j]] = csvAr[i + 1][j].replace(/"/gi, "");
                        }
                        drawLayer.getSource().addFeature(newFeature);
                    }else{
                        var msg = "<i class='fa fa-exclamation-triangle fa-fw' style='color:rgba(0,0,0,1.0);'></i>";
                        msg += (i + 2) + "行目の座標を取得できませんでした。";
                        msg +=  topRow[0] + "/" + csvAr[i + 1][0];
                        $.notify({//options
                            message: msg
                        }, {//settings
                            type: "danger",
                            z_index: 999999,
                            placement: {
                                from: "bottom",
                                align: "center"
                            },
                            animate: {
                                enter: "animated fadeInDown",
                                exit: "animated fadeOutUp"
                            },
                            timer: 0,
                            offset:$(window).height()/2
                        });
                    }
                }
                map1.getView().fit(drawLayer.getSource().getExtent());
            });
        };
    }
    //------------------------------------------------------------------------------------------------------------------
    //geojson読込
    function geojsonLoad(file){
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e){
            var geojsonObject = JSON.parse(e["target"]["result"]);
            var features = (new ol.format.GeoJSON()).readFeatures(geojsonObject,{featureProjection:'EPSG:3857'})
            drawLayer.getSource().addFeatures(features);
        };
    }
    //------------------------------------------------------------------------------------------------------------------
    //blob保存
    function blobSave(content,fileName) {
        var type = "text/plain";
        var blob = new Blob([content], {type: type});
        $(".save-a").remove();
        $("body").append("<a class='save-a'></a>");
        $(".save-a").attr({
            "href": window.URL.createObjectURL(blob),
            "download": fileName
        });
        $(".save-a")[0].click();
        drawSourceChangeFlg = false;
    }
    //------------------------------------------------------------------------------------------------------------------
    //geojson保存
    function geojsonSave(){
        var features = drawLayer.getSource().getFeatures();
        var drawnGeojson = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        drawnGeojson = JSON.stringify(JSON.parse(drawnGeojson),null,1);
        blobSave(drawnGeojson,"draw.geojson")
    }
    //------------------------------------------------------------------------------------------------------------------
    //csv
    function exportcsv(content) {
        /*
        var finalVal = '';
        for (var i = 0; i < content.length; i++) {
            var value = content[i];
            console.log(value)
            for (var j = 0; j < value.length; j++) {
                console.log(value[j])
                var innerValue = value[j] === null ? '' : value[j].toString();
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            finalVal += '\n';
        }
        */


        var finalVal = '';
        for (var i = 0; i < content.length; i++) {
            var value = content[i];
            for (var j = 0; j < value.length; j++) { var innerValue = value[j]===null?'':value[j].toString(); var result = innerValue.replace(/"/g, '""'); if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            finalVal += '\n';
        }


        return finalVal;
    }
    //------------------------------------------------------------------------------------------------------------------
    //csv保存
    function csvSave(){
        alert("作成中！！！！")
        var features = drawLayer.getSource().getFeatures();
        console.log(features);
        if(!features.length) {
            alert("データがありません。");
            return;
        }
        var headerAr = [];
        var header = "";
        var content = "";
        var contentAr = [];
        for(var i = 0; i <features.length; i++) {
            var prop = features[i].getProperties();
            for(key in prop){
                console.log(key);
                if(key!=="geometry" && key.substr(0,1)!=="_" && key!=="移動") {
                    PushArray(headerAr, key)
                }
            }
        }
        //console.log(headerAr);
        /*
        for(var i = 0; i <features.length; i++) {
            var coord = features[i].getGeometry().getCoordinates();
            console.log(coord);
            var lonlat = ol.proj.transform(coord, "EPSG:3857", "EPSG:4326");
            content += lonlat + "\n"
        }
        */
        for(var i = 0; i <features.length; i++) {
            var coord = features[i].getGeometry().getCoordinates();
            console.log(coord);
            var lonlat = ol.proj.transform(coord, "EPSG:3857", "EPSG:4326");
            //contentAr.push(JSON.stringify(lonlat).replace(/,/gi,"zzz"));
            contentAr.push("aaaaaa");
        }
        console.log(contentAr);
        var csv = exportcsv([contentAr]);
        console.log(csv);


        //----------------------------------------------------------
        // Unicodeコードポイントの配列に変換する
        var unicode_array = str_to_unicode_array(csv);
        // SJISコードポイントの配列に変換
        var sjis_code_array = Encoding.convert(
            unicode_array, // ※文字列を直接渡すのではない点に注意
            'SJIS',  // to
            'UNICODE' // from
        );
        // 文字コード配列をTypedArrayに変換する
        var uint8_array = new Uint8Array( sjis_code_array );
        //-----------------------------------------------------------
        blobSave(uint8_array,"draw.csv")
    }
    //------------------------------------------------------------------------------------------------------------------
    //gist保存
    function gistSave(){
        $("#loading-fa2").show(0);
        var features = drawLayer.getSource().getFeatures();
        var drawnGeojson = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        drawnGeojson = JSON.stringify(JSON.parse(drawnGeojson),null,1);
        var data = {
            //"description": "anonymous gist",
            "description": "hinatagis",
            "public": false,
            "files": {
                "hinatagis.geojson": {
                    "content": drawnGeojson
                }
            }
        };
        var xhr = new XMLHttpRequest();
        xhr.open("post", "https://api.github.com/gists", true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function(e) {
            var gistUrl = JSON.parse(e.target.response).html_url;
            console.log(gistUrl);
            $("#geojson-gist-a").remove();
            var html = "<a href='' id='geojson-gist-a' class='btn btn-xxs btn-warning btn-block'><i class='fa fa-github-alt fa-fw' style='color:rgba(255,255,255,1.0);'></i>GISTを開く<i class='fa fa-github fa-fw' style='color:rgba(255,255,255,1.0);'></a>";
            $("#drawContextmenuOverlay-div").append(html);
            $("#geojson-gist-a").attr({
                "href": gistUrl,
                "target":"_blank"
            });
            var href = location["href"].split("#")[0];
            var urlHash = location.hash;
            var hashAr = urlHash.split("&");
            var zxy = hashAr[0];
            var gistId = gistUrl.split("/")[gistUrl.split("/").length-1];
            console.log(gistId);
            var newUrl = href + zxy + "&g=" + gistId;
            console.log(newUrl);
            history.replaceState(null, null, newUrl);
            var msg = "<i class='fa fa-github-alt fa-fw' style='color:rgba(0,0,0,1.0);'></i>gistに保存しました。";
            msg += "<br>gistを削除するときはgist画面の右上のDeleteで！";
            $.notify({//options
                message: msg
            }, {//settings
                type: "info",
                z_index: 999999,
                placement: {
                    from: "bottom",
                    align: "center"
                },
                animate: {
                    enter: "animated fadeInDown",
                    exit: "animated fadeOutUp"
                },
                timer: 2000,
                offset:$(window).height()/2
            });
            $("#loading-fa2").hide(500);
        };
        xhr.send(JSON.stringify(data));
        drawSourceChangeFlg = false;
    }
});