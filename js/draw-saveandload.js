$(function() {
    //ドラッグアンドドロップのインタラクション-----------------------------
    var dragAndDrop = new ol.interaction.DragAndDrop({
        formatConstructors: [ol.format.GeoJSON]
    });
    map1.addInteraction(dragAndDrop);
    //------------------------------------------------------------------------------------------------------------------
    //ドラッグアンドドロップ
    dragAndDrop.on('addfeatures', function(evt) {
        var fileExtension = evt["file"]["name"].split(".")[evt["file"]["name"].split(".").length - 1];
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
        H_DRAW.drawSourceChangeFlg = false;
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
            //csvを配列化
            result = result.replace(/\r\n?/g,"\n");//改行コードを\nに変換
            var csvAr = $.csv()(result);
            console.log(csvAr);
            //-----------------------------
            //先頭行
            var topRow = csvAr[0];
            var geocodingColumun;
            for(var i = 0; i <topRow.length; i++){
                if(topRow[i]==="変換元住所") {
                    geocodingColumun = i;
                    break;
                }
            }
            if(geocodingColumun) {
                console.log("ジオコーディングする場合");
                geocoding();
            }else{
                console.log("座標がある場合");
                coordAvailable();
            }
            //-------------------------------------------------------------------------------------
            //座標がある場合
            function coordAvailable(){
                var lonColumns = ["画面経度","経度"];
                var latColumns = ["画面緯度","緯度"];
                var lonColumn,latColumn,lon,lat,coord,fillColorColumn,fillColor;
                for(var i = 0; i <topRow.length; i++){//先頭行を全てループするので最後に現れた緯度経度が対象になる
                    if(lonColumns.indexOf(topRow[i])!==-1) {
                        console.log(topRow[i]);
                        lonColumn = i;
                    }
                    if(latColumns.indexOf(topRow[i])!==-1) {
                        console.log(topRow[i]);
                        latColumn = i;
                    }
                    if(topRow[i]==="色") fillColorColumn = i;
                }
                console.log(lonColumn,latColumn);
                //2行目以降の処理
                for (var i = 1; i < csvAr.length-1; i++) {//行頭を飛ばすので１から
                    lon = Number(csvAr[i][lonColumn]);
                    lat = Number(csvAr[i][latColumn]);
                    //
                    // console.log(lon,lat);
                    coord = ol.proj.transform([lon,lat], "EPSG:4326", "EPSG:3857");
                    var geometry = new ol.geom.Point(coord);
                    fillColor = csvAr[i][fillColorColumn];
                    if(!fillColor) fillColor = "blue";
                    var newFeature = new ol.Feature({
                        geometry: geometry,
                        "_fillColor":fillColor,
                        "_h_addTime":$.now()
                    });
                    var keys = [];
                    for (var j = 0; j < topRow.length; j++) {
                        if (topRow[j].substr(0, 1) !== "_" && topRow[j] !== "色"){
                            console.log(topRow[j])
                            newFeature["D"][topRow[j]] = csvAr[i][j];
                            keys.push(topRow[j]);
                        }
                    }
                    //console.log(keys);
                    H_DRAW.drawLayer.getSource().addFeature(newFeature);
                    newFeature["D"]["_h_propOrder"] = keys;
                }
            }
            //座標がある場合　ここまで
            //--------------------------------------------------------------------------------------
            //ジオコーディング　座標がない場合
            function geocoding() {
                var geocodPromise = [];
                for (var i = 1; i < csvAr.length; i++) {//行頭を飛ばすので１から
                    var target = csvAr[i][geocodingColumun];
                    if (!target) break;
                    geocodPromise[i - 1] =//行頭を飛ばしたので１引いて調整
                        new Promise(function (resolve) {
                            $.ajax({
                                type: "get",
                                url: "https://msearch.gsi.go.jp/address-search/AddressSearch",
                                dataType: "json",
                                data: {
                                    "q": target
                                }
                            }).done(function (json) {
                                if (json.length) {
                                    resolve(json);
                                } else {
                                    resolve("nomatch");
                                }
                            }).fail(function () {
                                resolve("fail");
                            });
                        });
                }
                //-----------------------
                //プロミスオール
                Promise.all(geocodPromise).then(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        var getCoord = result[i];
                        if (getCoord !== "nomatch" && getCoord !== "fail") {
                            var feature = result[i][0];
                            var coord = feature["geometry"]["coordinates"];
                            coord = ol.proj.transform(coord, "EPSG:4326", "EPSG:3857");
                            var geometry = new ol.geom.Point(coord);

                            var newFeature = new ol.Feature({
                                geometry: geometry,
                                "_fillColor": "blue",//初期値、値があったら上書きされる。
                                "_h_addTime":$.now()
                                //"_h_propOrder":
                            });
                            var keys = [];
                            for (var j = 0; j < topRow.length; j++) {
                                if(topRow[j] === "色"){
                                    var fillColor = csvAr[i + 1][j];
                                    if(fillColor) {
                                        newFeature["D"]["_fillColor"] = csvAr[i + 1][j];
                                    }else{
                                        newFeature["D"]["_fillColor"] = "blue";
                                    }
                                }else if (topRow[j].substr(0, 1) !== "_" && topRow[j] !== "色") {
                                    newFeature["D"][topRow[j]] = csvAr[i + 1][j].replace(/"/gi, "");
                                    keys.push(topRow[j]);
                                }
                            }
                            newFeature["D"]["取得住所"] = feature["properties"]["title"];
                            keys.push("取得住所");
                            newFeature["D"]["_h_propOrder"] = keys;

                            H_DRAW.drawLayer.getSource().addFeature(newFeature);
                        } else {
                            var msg = "<i class='fa fa-exclamation-triangle fa-fw' style='color:rgba(0,0,0,1.0);'></i>";
                            msg += (i + 2) + "行目の座標を取得できませんでした。";
                            msg += topRow[0] + "/" + csvAr[i + 1][0];
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
                                offset: $(window).height() / 2
                            });
                        }
                    }
                    map1.getView().fit(H_DRAW.drawLayer.getSource().getExtent());
                });
            }
            //ジオコーディングここまで
            //--------------------------------------------------------------------------------------
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
            H_DRAW.drawLayer.getSource().addFeatures(features);
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
        H_DRAW.drawSourceChangeFlg = false;
    }
    //------------------------------------------------------------------------------------------------------------------
    //geojson保存
    function geojsonSave(){
        var features = H_DRAW.drawLayer.getSource().getFeatures();
        var drawnGeojson = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        drawnGeojson = JSON.stringify(JSON.parse(drawnGeojson),null,1);
        blobSave(drawnGeojson,"draw.geojson")
    }
    //------------------------------------------------------------------------------------------------------------------
    //csvエクスポート
    function exportcsv(content) {
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
        var ignoreColumn = ["画面経度","画面緯度"];
        var features = H_DRAW.drawLayer.getSource().getFeatures();
        console.log(features);
        if(!features.length) {
            alert("データがありません。");
            return;
        }
        var headerAr = [],contentAr0 = [],contentAr1 = [];
        var prop;
        //ヘッダー配列------------------------------------------------------------
        for(var i = 0; i <features.length; i++) {
            prop = features[i].getProperties();
            for(key in prop){
                if(key!=="geometry" && key.substr(0,1)!=="_") {
                    if(ignoreColumn.indexOf(key)===-1) {
                        PushArray(headerAr, key)//キー名を全行分重複のないように配列に格納
                    }
                }
            }
        }
        //⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐️
        headerAr.push("_fillColor");
        //⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐️
        //2行目以下（先頭行は含まない）を作成----------------------------------------
        for(var i = 0; i <features.length; i++) {
            var geomType = features[i].getGeometry().getType();
            if(geomType!=="Point") break;
            var coord = features[i].getGeometry().getCoordinates();
            var lonlat = ol.proj.transform(coord, "EPSG:3857", "EPSG:4326");
            var lon = lonlat[0];
            var lat = lonlat[1];
            prop = features[i].getProperties();
            contentAr0 = [];
            for(var j = 0; j <headerAr.length; j++) {//全行分重複無しで取得したキー名でループ
                var header = headerAr[j];
                if(prop[header]) {
                    contentAr0.push(prop[header]);
                }else{
                    contentAr0.push("");
                }
            }
            contentAr0.push(lon);contentAr0.push(lat);//lonとlatを追加
            contentAr0.push(prop["_h_addTime"]);//ソート用に仮追加
            contentAr1.push(contentAr0);
        }
        //ソート処理------------------------------------------------
        var lastColumn = contentAr0.length - 1;//ソート用カラムの連番
        contentAr1.sort(function(a,b){
            if(a[lastColumn]<b[lastColumn]) return -1;
            if(a[lastColumn]>b[lastColumn]) return 1;
            return 0;
        });
        for(var i = 0; i <contentAr1.length; i++){
            contentAr1[i].splice(lastColumn,1);//ソート用カラムを削除
        }
        //ソート処理ここまで
        //----------------------------------------------------------
        //ヘッダーを再構築
        for(var i = 0; i <headerAr.length; i++) {
            if (headerAr[i] === "_fillColor") {
                headerAr[i] = "色"
            }
        }
        headerAr.push("画面経度");headerAr.push("画面緯度");//ヘッダー配列に追加
        //----------------------------------------------------------
        contentAr1.unshift(headerAr);//先頭にヘッダー配列を追加
        console.log(contentAr1);
        var csv = exportcsv(contentAr1);
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
        var features = H_DRAW.drawLayer.getSource().getFeatures();
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

            var gistId = gistUrl.split("/")[gistUrl.split("/").length-1];
            H_COMMON.setHush("g",gistId);

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
        H_DRAW.drawSourceChangeFlg = false;
    }
    //------------------------------------------------------------------------------------------------------------------
});