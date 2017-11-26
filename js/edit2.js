$(function() {
    var drawSource = null;
    var drawLayer = null;
    var drawSourceChangeFlg = true;
    var copyCoord = [];//地物コピペ用
    var geojsonSaveAr = []//取り消し用にgeojsonを保存する
    var selectedFeature = null;
    //------------------------------------------------------------------------------------------------------------------
    //ドロー用ダイアログ作成
    var selectHtml = "";
    selectHtml += "<div id='draw-div'>";
    selectHtml += "選択モード：";
    selectHtml += "<input type='checkbox' data-toggle='toggle' class='select-toggle bs-toggle' data-size='small'>";
    selectHtml += "色、形状変更、項目追加はOn";
    selectHtml += "<h4>step1 形を作る（必須）</h4>";
    selectHtml += "<div class='draw-div2'>";
    selectHtml += "形状 ";
    selectHtml += "<select id='drawType'>";
    selectHtml += "<option value='0' selected>なし</option>";
    selectHtml += "<option value='Point'>点を描く</option>";
    selectHtml += "<option value='LineString'>ラインを描く</option>";
    selectHtml += "<option value='Polygon'>面を描く</option>";
    selectHtml += "<option value='DrawHole'>面に穴を開ける</option>";
    selectHtml += "<option value='Transform'>回転と変形と移動</option>";
    selectHtml += "<option value='Circle'>円を描く</option>";
    selectHtml += "<option value='Dome'>東京ドーム一個分(正確ではありません。)</option>";
    selectHtml += "<option value='Nintoku'>仁徳天皇陵(正確ではありません。)</option>";
    selectHtml += "<option value='Paste'>最後に選択したポリゴンをペースト</option>";
    selectHtml += "<option value='Circle2'>テスト</option>";
    selectHtml += "</select>";
    selectHtml += "</div>";
    selectHtml += "<hr class='my-hr'>";
    selectHtml += "<h4>step2 色を塗る</h4>";
    selectHtml += "<div class='draw-div2'>";
    selectHtml += "　色選択 ";
    selectHtml += "<select id='drawColor'>";
    selectHtml += "<option value='red'>赤</option>";
    selectHtml += "<option value='green'>緑</option>";
    selectHtml += "<option value='blue'>青</option>";
    selectHtml += "<option value='yellow'>黄</option>";
    selectHtml += "<option value='gray'>灰</option>";
    selectHtml += "<option value='silver'>銀</option>";
    selectHtml += "<option value='black'>黒</option>";
    selectHtml += "<option value='maroon'>栗色</option>";
    selectHtml += "<option value='purple'>紫</option>";
    selectHtml += "<option value='olive'>オリーブ</option>";
    selectHtml += "<option value='navy'>濃紺</option>";
    selectHtml += "<option value='teal'>青緑</option>";
    selectHtml += "<option value='fuchsia'>赤紫</option>";
    selectHtml += "<option value='lime'>ライム</option>";
    selectHtml += "<option value='aqua'>水色aqua</option>";
    selectHtml += "</select>";
    selectHtml += "　　<button type='button' id='colorSave-btn' class='btn btn-xs btn-primary'>　反映　</button>";
    selectHtml += "</div>";
    selectHtml += "<hr class='my-hr'>";
    selectHtml += "<h4>step3 項目</h4>";
    selectHtml += "<div class='draw-div2'>";
    selectHtml += "<table id='propTable' class='popup-tbl table table-bordered table-hover'>";
    selectHtml += "<tr><th class='prop-th0'>項目名</th><th class='prop-th1'></th></tr>";
    selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    //selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    //selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    //selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "</table>";
    selectHtml += "<button type='button' id='propSave-btn' class='btn btn-xs btn-primary btn-block'>反映</button>";
    selectHtml += "</div>";
    selectHtml += "<hr class='my-hr'>";
    selectHtml += "<h4>step4 効果</h4>";
    selectHtml += "<div class='draw-div2'>";
    selectHtml += "効果 ";
    selectHtml += "<select id='effectType'>";
    selectHtml += "<option value='0' selected>なし</option>";
    selectHtml += "<option value='voronoi'>ボロノイ</option>";
    selectHtml += "<option value='buffer'>バッファー</option>";
    selectHtml += "</select>";
    selectHtml += "　バッファー半径：<input id='buffer-radius-input' type='text' value='100' size='2'>m";
    selectHtml += "</div>";
    selectHtml += "<hr class='my-hr'>";
    selectHtml += "<h4>step5 保存</h4>";
    selectHtml += "<div class='draw-div2'>";
    selectHtml += "<div class='btn-group btn-group-justified' style='width:300px;'>";
    selectHtml += "<div class='btn-group'><button type='button' id='drawGeojson-btn' class='btn btn-xs btn-primary'>GEOJSON</button></div>";
    selectHtml += "<div class='btn-group'><button type='button' id='drawCsv-btn' class='btn btn-xs btn-primary'>CSV</button></div>";
    selectHtml += "</div>";
    selectHtml += "</div>";
    selectHtml += "</div>";
    var content = selectHtml;
    $(".draw-btn").click(function(){
        mydialog({
            id:"draw-dialog",
            class:"draw-dialog",
            map:"map1",
            title:"ドロー実験中",
            content:content,
            top:"60px",
            left:"10px",
            info:true
            //rmDialog:true
        });
        $(".bs-toggle").bootstrapToggle();
        $("#buffer-radius-input").spinner({
            max:50000, min:0, step:10,
            spin:function(event,ui){
                var radius = ui.value;
                funcBuffer(radius);
            }
        });
    });
    //------------------------------------------------------------------------------------------------------------------
    //geojsonのテキストを見せるダイアログを表示
    $("body").on("click","#mydialog-draw-dialog .dialog-info",function(){
        var content = "<div id='geojson-text' style='width:440px'></div>";
        mydialog({
            id:"draw-dialog-info",
            class:"draw-dialog-info",
            map:"map1",
            title:"geojson",
            content:content,
            top:"60px",
            right:"10px",
            //rmDialog:true
        });
        geojsonText();
    });
    //------------------------------------------------------------------------------------------------------------------
    //オーバーレイ要素作成
    var Overlaycontent = "";
        //Overlaycontent += "<button type='button' class='close' id='drawMenuOverlay-close'>&times;</button>";
        Overlaycontent += "<div>";
        Overlaycontent += "<button type='button' id='draw-remove-btn' class='btn btn-xs btn-primary'>削除</button>";
        Overlaycontent += "<div id='circle-radius-div'>半径：<input id='circle-radius-input' type='text' value='100' size='2'>m</div>";
        Overlaycontent += "</div>";
        //content += "";
        //content += "<div style='margin:10px 0;'>半径：<input type='text' class='kmtext' value='3' size='2'> KM</div>";
        //content += "<button type='button' class='zinkoumesh-btn btn btn-primary btn-block'>500M人口メッシュ</button>";
        //content += "<button type='button' class='zyuugyouinmesh-btn btn btn-primary btn-block'>500M従業員メッシュ</button>";
        //content += "<button type='button' class='circlrdelete-btn btn btn-primary btn-block'>円削除</button>";

    $("#map1").append('<div id="drawMenuOverlay-div" class="drawMenuOverlay-div">' + Overlaycontent + '</div>');
    //------------------------------------------------------------------------------------------------------------------
    //オーバーレイ上のスピンコントロール
    var prevCircleFeature = null;
    $("#circle-radius-input").spinner({
        max:5000, min:1, step:1,
        spin:function(event,ui){
            if(selectedFeature) {
                var extent = selectedFeature.getGeometry().getExtent();
                var extentCenter = ol.extent.getCenter(extent);
                var coord = ol.proj.transform(extentCenter, "EPSG:3857", "EPSG:4326");
            }else{
                var extent = prevCircleFeature.getGeometry().getExtent();
                var extentCenter = ol.extent.getCenter(extent);
                var coord = ol.proj.transform(extentCenter, "EPSG:3857", "EPSG:4326");
            }
            var precisionCircle = ol.geom.Polygon.circular(
                new ol.Sphere(6378137),// WGS84 Sphere //
                coord,//[131.423860, 31.911069]
                ui.value, // Number of verticies //
                32).transform('EPSG:4326', 'EPSG:3857');
            var precisionCircleFeature = new ol.Feature(precisionCircle);
            precisionCircleFeature["D"]["_fillColor"] = "rgba(51,122,255,0.7)";

            if(prevCircleFeature) drawSource.removeFeature(prevCircleFeature);

            if(selectedFeature) {
                drawSource.removeFeature(selectedFeature);
                selectedFeature = null
            }

            drawSource.addFeature(precisionCircleFeature);
            prevCircleFeature = precisionCircleFeature;

            featureSelect.getFeatures().clear();
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //オーバーレイをマップに設定
    var drawMenuOverlay = new ol.Overlay({
        element:$("#drawMenuOverlay-div")[0],
        autoPan:true,
        offset:[0,0]
    });
    map1.addOverlay(drawMenuOverlay);
    //------------------------------------------------------------------------------------------------------------------
    //オーバーレイをクローズ
    $("#drawMenuOverlay-close").click(function(){
        featureSelect.getFeatures().clear();
        drawMenuOverlay.setPosition(null);
    });
    //------------------------------------------------------------------------------------------------------------------
    //地物を一つ削除
    $("#draw-remove-btn").click(function(){
        if(confirm("削除しますか？")) {
            drawSource.removeFeature(selectedFeature);
            featureSelect.getFeatures().clear();
            drawMenuOverlay.setPosition(null);
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //ドロー用のソース、レイヤーを設置
    drawSource = new ol.source.Vector();
    drawLayer = new ol.layer.Vector({
        source:drawSource,
        name:"drawLayer",
        style:drawStyleFunction()
        /*
         style: new ol.style.Style({
         fill: new ol.style.Fill({
         color: 'rgba(255, 255, 255, 0.2)'
         }),
         stroke: new ol.style.Stroke({
         color: '#ffcc33',
         width: 2
         }),
         image: new ol.style.Circle({
         radius: 7,
         fill: new ol.style.Fill({
         color: '#ffcc33'
         })
         })
         })
         */
    });
    //スタイルファンクション---------------------
    function drawStyleFunction() {
        return function(feature, resolution) {
            //console.log(feature);
            var prop = feature.getProperties();
            var geoType = feature.getGeometry().getType();
            var fillColor = prop["_fillColor"];
            //console.log(prop)
            //console.log(fillColor)
            if (resolution > 2445) {//ズーム６
                var pointRadius = 2;
            } else if (resolution > 1222) {//ズーム７
                var pointRadius = 2;
            } else if (resolution > 611) {
                var pointRadius = 2;
            } else if (resolution > 305) {
                var pointRadius = 4;
            } else if (resolution > 152) {
                var pointRadius = 6;
            } else if (resolution > 76) {
                var pointRadius = 8;
            } else if (resolution > 38) {
                var pointRadius = 10;
            } else {
                var pointRadius = 12;
            }
            switch (geoType) {
                case "LineString":
                    var TDistance = funcTDistance(feature);
                    console.log(TDistance);
                    var style = [
                        new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: fillColor ? fillColor : "red",
                                width: 6
                            })
                        }),
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                fill: new ol.style.Fill({
                                    color: "white"
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "white",
                                    width: 1
                                }),
                                points: 6,
                                radius: 8,
                                //radius2: 8,
                                angle: 45
                            }),
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                text: TDistance,
                                fill: new ol.style.Fill({
                                    color: "black"
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "white",
                                    width: 3
                                }),
                                offsetY: 0
                            }),
                            geometry: function (feature) {
                                //var coord = feature.getGeometry().getCoordinates();
                                //console.log(coord);
                                var lastCoord =  feature.getGeometry().getLastCoordinate();
                                return new ol.geom.Point(lastCoord)
                            }
                        })
                    ];
                    break;
                case "Point":
                    var style = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: pointRadius,
                            fill: new ol.style.Fill({
                                color: fillColor ? fillColor : "orange"
                            }),
                            stroke: new ol.style.Stroke({color: "white", width: 1})
                        })
                    });
                    break;
                case "Polygon":
                case "MultiPolygon":
                    var tArea = funcTArea(feature);
                    var style = [
                        new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: fillColor
                            }),
                            stroke: new ol.style.Stroke({
                                color: "gray",
                                width: 1
                            }),
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                text: "面積\n" + tArea,
                                fill: new ol.style.Fill({
                                    color: "white"
                                }),
                                offsetY: 0
                            }),
                            zIndex: 0
                        })
                    ];
                    break;
                default:
            }
            return style;
        };
    }
    map1.addLayer(drawLayer);
    drawLayer.set("selectable",true);
    drawLayer.set("altitudeMode","clampToGround");
    drawLayer.setZIndex(9999);
    //------------------------------------------------------------------------------------------------------------------
    //線の長さを計算
    function funcTDistance(feature){
        var tDistance = 0;
        var fromCoord,toCoord;
        var coordAr = feature.getGeometry().getCoordinates();
        for(var i = 0; i <coordAr.length-1; i++){
            fromCoord = ol.proj.transform(coordAr[i], "EPSG:3857", "EPSG:4326");
            toCoord = ol.proj.transform(coordAr[i+1], "EPSG:3857", "EPSG:4326");
            tDistance = tDistance + turf.distance(fromCoord,toCoord);
        }
        console.log(tDistance);
        if(tDistance<1) {
            tDistance = String((Math.floor(tDistance*10000)/10000*1000).toLocaleString()) + "m";
        }else{
            tDistance = String((Math.floor(tDistance*1000)/1000).toLocaleString()) + "km";
        }
        return tDistance;
    }
    //------------------------------------------------------------------------------------------------------------------
    //地物の面積を計算
    function funcTArea(feature){
        var coordAr = feature.getGeometry().getCoordinates();
        for(var i = 0; i <coordAr.length; i++) {
            for (var j = 0; j < coordAr[i].length; j++) {
                coordAr[i][j] = ol.proj.transform(coordAr[i][j], "EPSG:3857", "EPSG:4326");
            }
        }
        var tPolygon = turf.polygon(coordAr);
        var tArea = turf.area(tPolygon);//面積計算
        if(tArea<1000000) {
            tArea = String((Math.floor(tArea*100)/100).toLocaleString()) + "m2";
        }else{
            tArea = String((Math.floor(tArea/1000000*100)/100).toLocaleString()) + "km2";
        }
        return tArea;
    }
    //------------------------------------------------------------------------------------------------------------------
    //キーボード操作　キーダウン時　ctrl+zで戻す　同時押しはこちらに描く
    var gTargetNum = null;
    var geojsonDeleteAr =[];

    $(window).keydown(function(e){
        if(event.ctrlKey){
            featureSelect.getFeatures().clear();
            console.log(geojsonSaveAr);
            if(e.keyCode === 90){//z
                //alert("ctrl+z");
                console.log(drawPolygon.nbpts);
                console.log(drawLineString.nbpts);
                if(drawPolygon.nbpts>1 || drawLineString.nbpts>1) {
                    drawPolygon.removeLastPoint();
                    drawLineString.removeLastPoint();
                }else{
                    drawSource.clear();

                    geojsonDeleteAr.push(geojsonSaveAr[geojsonSaveAr.length - 2]);

                    geojsonSaveAr.splice(geojsonSaveAr.length - 2, 2);//配列の最後から２番目から２つ削除。つまり後ろ二つを削除
                    var geojsonObject = geojsonSaveAr[geojsonSaveAr.length - 1];

                    console.log(geojsonObject);

                    if(geojsonObject){
                        var targetGeojson = new ol.format.GeoJSON().readFeatures(geojsonObject, {featureProjection: 'EPSG:3857'});
                        console.log(targetGeojson["features"]);
                        drawSource.addFeatures(targetGeojson);
                    }
                }
                return false;
            }
            if(e.keyCode === 89){//y
                drawSource.clear();
                var geojsonObject = geojsonDeleteAr[geojsonDeleteAr.length - 1];
                geojsonDeleteAr.splice(geojsonDeleteAr.length - 1, 1);
                var targetGeojson = new ol.format.GeoJSON().readFeatures(geojsonObject, {featureProjection: 'EPSG:3857'});
                console.log(targetGeojson["features"]);
                drawSource.addFeatures(targetGeojson);
            }
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //キーボード操作 キーアップ時
    $(window).keyup(function(e){
        var keycode = e.keyCode;
        console.log(keycode);
        if($(":focus").val()) return;//input等でvalがあるときは抜ける。
        var features = featureSelect.getFeatures();
        switch (keycode) {
            case 8://mac
            case 46:
                if(!features.item(0)) return;
                if(confirm("選択された地物を削除しますか？")){
                    for (var i=0, f; f=features.item(i); i++) {
                        drawSource.removeFeature(f);
                    }
                    featureSelect.getFeatures().clear();
                }
                break;
            case 27://escキー
                /*
                console.log(drawPolygon.nbpts);
                if (drawPolygon.nbpts>1) drawPolygon.removeLastPoint();
                if (drawLineString.nbpts>1) drawLineString.removeLastPoint();
                */
                break;
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //ソースに変更があった時に発火

    drawSource.on("change", function(e) {
        if(drawSourceChangeFlg) geojsonText();
    });
    //------------------------------------------------------------------------------------------------------------------
    //geojsonの文字を書き出し 同時に元に戻す用に保存する。
    function geojsonText(){
        var features = drawSource.getFeatures();
        var drawSourceGeojson = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        var geojsonT = JSON.stringify(JSON.parse(drawSourceGeojson),null,1);
        var height = $(window).height() - 200;
        $("#geojson-text").html("<pre style='max-height:" + height + "px'>" + geojsonT + "</pre>");
        PushArray(geojsonSaveAr,drawSourceGeojson);
    }
    //------------------------------------------------------------------------------------------------------------------
    //フィーチャーセレクトインタラクション
    var featureSelect = new ol.interaction.Select({
        layers:function(layer){
            return layer.get("selectable") == true;
        },
        style:function(feature, resolution) {
            var prop = feature.getProperties();
            var fillColor = prop["_fillColor"];
            var geoType = feature.getGeometry().getType();
            switch (geoType) {
                case "Point":
                    var styles = [
                        new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: fillColor
                            }),
                            stroke: new ol.style.Stroke({
                                color: 'red',
                                width: 2
                            })
                        }),
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                fill: new ol.style.Fill({
                                    color: "red"
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "white",
                                    width: 1
                                }),
                                points: 5,
                                radius: 16,
                                radius2: 8,
                                angle: 0
                            }),
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                text: "選",
                                fill: new ol.style.Fill({
                                    color: "white"
                                }),
                                offsetY: 0
                            })
                        })
                    ];
                    break;
                case "Polygon":
                    copyCoord = feature.getGeometry().getCoordinates();//ポリゴンを保存
                    var tArea = funcTArea(feature);
                    var styles = [
                        new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: fillColor
                            }),
                            stroke: new ol.style.Stroke({
                                color: 'red',
                                width: 2
                            }),
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                //text: "選択中",
                                text: "選択中\n" + tArea,
                                fill: new ol.style.Fill({
                                    color: "white"
                                }),
                                offsetY: 0
                            }),
                            zIndex: 0
                        }),
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                fill: new ol.style.Fill({
                                    color: "white"
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "red",
                                    width: 1
                                }),
                                points: 6,
                                radius: 8,
                                //radius2: 8,
                                angle: 45
                            }),
                            geometry: function (feature) {
                                var coord = feature.getGeometry().getCoordinates()[0];
                                return new ol.geom.MultiPoint(coord)
                            }
                        })
                    ];
                    break;
                case "LineString":
                    var TDistance = funcTDistance(feature);
                    console.log(TDistance);
                    var styles = [
                        new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: fillColor
                            }),
                            stroke: new ol.style.Stroke({
                                color: 'red',
                                width: 4
                            }),
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                text: TDistance,
                                fill: new ol.style.Fill({
                                    color: "black"
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "white",
                                    width: 3
                                }),
                                offsetY: 0
                            })
                        }),
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                fill: new ol.style.Fill({
                                    color: "white"
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "red",
                                    width: 1
                                }),
                                points: 6,
                                radius: 8,
                                //radius2: 8,
                                angle: 45
                            }),
                            geometry: function (feature) {
                                var coord = feature.getGeometry().getCoordinates();
                                console.log(coord);
                                return new ol.geom.MultiPoint(coord)
                            }
                        })
                    ];
                    break;
                default:
            }
            return styles;
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //フィーチャーセレクト　セレクト時発火
    featureSelect.on("select", function(e) {
        var features = e.selected;
        console.log(features);
        selectedFeature = features[0];
        $(".prop-input-text-name").val("");
        $(".prop-input-text-val").val("");
        $("#circle-radius-div").hide();
        if(features.length) {
            var extent = selectedFeature.getGeometry().getExtent();
            var extentCenter = ol.extent.getCenter(extent);
            var coordAr = selectedFeature.getGeometry().getCoordinates()[0];
            var origin = ol.proj.transform(extentCenter, "EPSG:3857", "EPSG:4326");
            var prevDistance = 0;
            var circleFlg = false;
            for (var i = 0; i < coordAr.length; i++) {
                var to = ol.proj.transform(coordAr[i], "EPSG:3857", "EPSG:4326");
                var tDistance = turf.distance(origin,to);
                tDistance = Math.floor(tDistance*100000)/100000;
                if(prevDistance===0 || prevDistance===tDistance) {
                    circleFlg = true;
                }else{
                    console.log("円ではない");
                    circleFlg = false;
                    break;
                }
                prevDistance = tDistance;
                if(i===10) break;
            }
            console.log(circleFlg);
            if(circleFlg) {
                $("#circle-radius-div").show();
            }else{
                $("#circle-radius-div").hide();
            }
            drawMenuOverlay.setPosition(extentCenter);
        }else{
            drawMenuOverlay.setPosition(null);
            return;
        }
        var prop = features[0].getProperties();
        console.log(prop);
        var i = 0;
        for(key in prop){
            //console.log(prop[key]);
            //console.log(key);
            if(key!=="geometry" && key.substr(0,1)!=="_" && key!=="経度old" && key!=="緯度old" && key!=="移動"){
                console.log(key);
                $(".prop-input-text-name").eq(i).val(key);
                $(".prop-input-text-val").eq(i).val(prop[key]);
                i++
            }
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    var snap = new ol.interaction.Snap({source:drawSource});
    var modify = new ol.interaction.Modify({
        //source:drawSource,
        features:featureSelect.getFeatures(),
        deleteCondition:ol.events.condition.singleClick//削除をシングルクリックのみでできるようにしたｓ
    });
    //map1.addInteraction(modify);
    var modifyFlg = false;
    modify.on("modifystart", function(e) {
        console.log(e);
        modifyFlg = true;
    });
    modify.on("modifyend", function(e) {
        modifyFlg = false;
    });
    var drawPoint = new ol.interaction.Draw({
        source:drawSource,
        type:"Point"
    });
    drawPoint.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        console.log(prop)
        prop["_fillColor"] = "rgba(51,122,255,0.7)";
        featureSelect.getFeatures().clear();
    });
    var drawPolygon = new ol.interaction.Draw({
        snapTolerance:1,
        source:drawSource,
        type:"Polygon",
        geometryFunction:function(coordinates, geometry) {
            this.nbpts = coordinates[0].length;
            if (geometry) geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
            else geometry = new ol.geom.Polygon(coordinates);
            return geometry;
        }
    });
    drawPolygon.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_fillColor"] = "rgba(51,122,255,0.7)";
        featureSelect.getFeatures().clear();
        drawPolygon.nbpts = 0;
    });
    var drawhole  = new ol.interaction.DrawHole ({
        layers:[drawLayer]
    });
    var drawLineString = new ol.interaction.Draw({
        source:drawSource,
        type:"LineString",
        geometryFunction:function(coordinates, geometry) {
            if (geometry) geometry.setCoordinates(coordinates);
            else geometry = new ol.geom.LineString(coordinates);
            this.nbpts = geometry.getCoordinates().length;
            return geometry;
        }
    });
    drawLineString.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_fillColor"] = "rgba(51,122,255,0.7)";
        featureSelect.getFeatures().clear();
        drawLineString.nbpts = 0;
    });
/*
    var measureTooltipElement = null;
    createMeasureTooltip();
    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltipElement.innerHTML = "ssssssssssssss";

        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        map1.addOverlay(measureTooltip);
    }
*/
    var drawCircle = new ol.interaction.Draw({
        source:drawSource,
        type:"Circle",
        geometryFunction:ol.interaction.Draw.createRegularPolygon(32)
    });
    drawCircle.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_fillColor"] = "rgba(51,122,255,0.7)";
        featureSelect.getFeatures().clear();
    });
    var drawCircle2 = new ol.interaction.Draw({
        source:drawSource,
        type:"Point",
        geometryFunction:function(coordinates, geometry){
            console.log(coordinates);
            this.coord = coordinates;
        }
    });
    drawCircle2.on("drawend", function(e) {
        console.log(drawCircle2.coord);
        var coord = ol.proj.transform(drawCircle2.coord,"EPSG:3857","EPSG:4326");
        console.log(coord);
        var precisionCircle = ol.geom.Polygon.circular(
            new ol.Sphere(6378137),// WGS84 Sphere //
            coord,//[131.423860, 31.911069]
            100, // Number of verticies //
            32).transform('EPSG:4326', 'EPSG:3857');
        var precisionCircleFeature = new ol.Feature(precisionCircle);
        precisionCircleFeature["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
        drawSource.addFeature(precisionCircleFeature);
    });
    var drawDome = new ol.interaction.Draw({
        source:drawSource,
        type:"Point",
        geometryFunction:function(coordinates, geometry){
            var coord = ol.proj.transform(coordinates,"EPSG:3857","EPSG:4326");
            var circle =
                ol.geom.Polygon.circular(
                    new ol.Sphere(6378137),
                    coord,
                    115,
                    32
                );
            console.log(circle);
            circle.transform('EPSG:4326', 'EPSG:3857');
            geometry = circle;
            return geometry;
        }
    });
    drawDome.on("drawend", function(e) {
        e["feature"]["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
    });
    var drawNintoku = new ol.interaction.Draw({
        source:drawSource,
        type:"Point",
        geometryFunction:function(coordinates, geometry){
            var nintokuPolygon = [[[15082094.774117399,4104609.5068460507],[15082096.900639175,4104606.4857429783],[15082129.36019615,4104587.9136047],[15082158.916738488,4104572.306140754],[15082183.353193704,4104557.322071505],[15082221.886320226,4104536.908816471],[15082240.82597234,4104525.31045447],[15082280.496823255,4104504.5777457976],[15082308.445844315,4104487.6706930636],[15082337.947520278,4104469.779253533],[15082390.09980167,4104440.8386413353],[15082400.883508094,4104435.93976219],[15082411.651620751,4104431.5952606387],[15082414.815917248,4104431.101141366],[15082416.235399486,4104431.4055465586],[15082418.54266863,4104432.608369839],[15082419.937057696,4104434.1806772905],[15082421.521496361,4104436.447800941],[15082427.009965366,4104454.879444051],[15082430.057861516,4104469.987335986],[15082432.76305801,4104497.395223116],[15082436.589521732,4104520.4220090453],[15082453.457944872,4104593.6575348037],[15082455.966293145,4104602.6447479874],[15082462.9474467,4104618.8700968116],[15082469.593465274,4104643.368812974],[15082476.032643614,4104655.791178121],[15082489.172744228,4104668.0491904155],[15082495.15720876,4104677.123115205],[15082500.388640255,4104702.6481256126],[15082499.844445901,4104707.9955029287],[15082491.42598106,4104724.7911858247],[15082490.097177617,4104733.967353733],[15082491.62370374,4104743.213095668],[15082494.47001047,4104750.056926742],[15082499.26063454,4104754.3726565684],[15082519.594241023,4104765.160360975],[15082535.24421257,4104774.77877781],[15082569.723446434,4104798.321254086],[15082574.513390971,4104802.923017857],[15082581.186626643,4104811.0218469477],[15082592.218740754,4104827.143829122],[15082603.202797184,4104849.9334887816],[15082610.70653026,4104870.5350143723],[15082614.23770702,4104899.575604842],[15082612.742333326,4104927.4677995597],[15082610.699768946,4104945.9617093275],[15082606.097076781,4104962.2840096937],[15082599.436096366,4104979.383390734],[15082594.5711201,4104988.428047911],[15082585.392075567,4105001.1993277944],[15082573.50520068,4105013.6449827263],[15082559.487443242,4105026.256633181],[15082555.819094103,4105029.449688042],[15082550.49415403,4105032.3369536605],[15082524.345005738,4105046.8270806298],[15082517.346961377,4105050.06779451],[15082504.86766149,4105053.6034897193],[15082483.043220563,4105058.4288857896],[15082458.068962704,4105058.338669127],[15082433.7395421,4105054.8248715545],[15082402.254035477,4105044.544120258],[15082394.308519885,4105042.6508389693],[15082376.150814196,4105033.6496001976],[15082361.619949661,4105022.992898947],[15082347.029209228,4105008.4210490733],[15082339.432012385,4104999.8714636876],[15082332.553682752,4104989.7453425243],[15082326.74097972,4104978.98683948],[15082319.7685783,4104963.4278181517],[15082312.197944123,4104941.7673923736],[15082305.404411748,4104903.601544872],[15082305.349247223,4104870.2978359447],[15082303.73963396,4104862.783921267],[15082296.2914638,4104845.7051192774],[15082292.096452475,4104840.226593593],[15082266.467592461,4104831.4093341734],[15082253.543322515,4104823.6211601417],[15082243.834028618,4104807.32036678],[15082240.833312675,4104795.03568187],[15082239.872530354,4104779.7700620275],[15082238.361695852,4104775.928960714],[15082231.004781727,4104764.5550692645],[15082219.358568018,4104750.162790346],[15082202.01088199,4104736.5284958654],[15082187.075004881,4104721.896824502],[15082170.57968637,4104695.066375912],[15082131.000579158,4104659.372154799],[15082110.448062543,4104638.741330116],[15082094.744524784,4104612.8413440487],[15082094.774117399,4104609.5068460507]]]
            var origin = ol.proj.transform(nintokuPolygon[0][0],"EPSG:3857","EPSG:4326");
            var target = ol.proj.transform(coordinates,"EPSG:3857","EPSG:4326");
            var coordAr = nintokuPolygon;
            for(var i = 0; i <coordAr.length; i++) {
                for (var j = 0; j < coordAr[i].length; j++) {
                    var to = ol.proj.transform(coordAr[i][j], "EPSG:3857", "EPSG:4326");
                    var tFeature = turf.destination(
                        target,
                        turf.distance(origin,to),
                        turf.bearing(origin,to)
                    );
                    coordAr[i][j] = ol.proj.transform(tFeature["geometry"]["coordinates"],"EPSG:4326","EPSG:3857");
                }
            }
            geometry = new ol.geom.Polygon(nintokuPolygon);
            return geometry;
        }
    });
    drawNintoku.on("drawend", function(e) {
        e["feature"]["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
    });
    //------------------------------------------------------------------------------------------------------------------
    var drawPaste = new ol.interaction.Draw({
        source:drawSource,
        type:"Point",
        geometryFunction:function(coordinates, geometry){
            var origin = ol.proj.transform(copyCoord[0][0],"EPSG:3857","EPSG:4326");
            var target = ol.proj.transform(coordinates,"EPSG:3857","EPSG:4326");
            var coordAr = copyCoord;
            for(var i = 0; i <coordAr.length; i++) {
                for (var j = 0; j < coordAr[i].length; j++) {
                    var to = ol.proj.transform(coordAr[i][j], "EPSG:3857", "EPSG:4326");
                    var tFeature = turf.destination(
                        target,
                        turf.distance(origin,to),
                        turf.bearing(origin,to)
                    );
                    coordAr[i][j] = ol.proj.transform(tFeature["geometry"]["coordinates"],"EPSG:4326","EPSG:3857");
                }
            }
            geometry = new ol.geom.Polygon(copyCoord);
            return geometry;
        }
    });
    drawPaste.on("drawend", function(e) {
        e["feature"]["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
    });
    var transform = new ol.interaction.Transform ({
        translateFeature:false,
        scale:true,
        rotate:true,
        keepAspectRatio:ol.events.condition.always,
        translate:true,
        stretch:true
    });
    /*
    var transformTranslate = new ol.interaction.Transform ({
        translateFeature:false,
        scale:false,
        rotate:false,
        keepAspectRatio:ol.events.condition.always,
        translate:true,
        stretch:false
    });
    */
    var translate = new ol.interaction.Translate ({
        features:featureSelect.getFeatures()
    });

    //------------------------------------------------------------------------------------------------------------------
    function addInteractions() {
        var typeVal = $("#drawType").val();
        console.log(typeVal);
        map1.removeInteraction(drawPoint);
        map1.removeInteraction(drawPolygon);
        map1.removeInteraction(drawhole);
        map1.removeInteraction(drawLineString);
        map1.removeInteraction(drawCircle);
        map1.removeInteraction(drawCircle2);
        map1.removeInteraction(snap);
        map1.removeInteraction(transform);
        //map1.removeInteraction(transformTranslate);
        map1.removeInteraction(translate);
        map1.removeInteraction(drawDome);
        map1.removeInteraction(drawNintoku);
        map1.removeInteraction(drawPaste);
        switch (typeVal) {
            case "Point":
                map1.addInteraction(drawPoint);
                map1.addInteraction(snap);//ドロー系の後でないとうまくどうさしない
                break;
            case "Polygon":
                map1.addInteraction(drawPolygon);
                map1.addInteraction(snap);
                break;
            case "DrawHole":
                console.log("DrawHole");
                map1.addInteraction(drawhole);
                drawhole.setActive(active);
                break;
            case "LineString":
                map1.addInteraction(drawLineString);
                map1.addInteraction(snap);
                break;
            case "Transform":
                map1.addInteraction(transform);
                map1.addInteraction(snap);
                setHandleStyle();
                break;
            case "Translate":
                map1.addInteraction(translate);
                map1.addInteraction(snap);
                break;
            case "Circle":
                map1.addInteraction(drawCircle);
                break;
            case "Circle2":
                map1.addInteraction(drawCircle2);
                break;
            case "Dome":
                map1.addInteraction(drawDome);
                map1.addInteraction(snap);
                break;
            case "Nintoku":
                map1.addInteraction(drawNintoku);
                map1.addInteraction(snap);
                break;
            case "Paste":
                map1.addInteraction(drawPaste);
                map1.addInteraction(snap);
                break;
            default:
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //ハンドルスタイルセット
    function setHandleStyle() {
        if (!transform instanceof ol.interaction.Transform) return;
        var circle = new ol.style.RegularShape({
            fill: new ol.style.Fill({color:[255,255,255,0.01]}),
            stroke: new ol.style.Stroke({width:1, color:[0,0,0,0.01]}),
            radius: 8,
            points: 10
        });
        transform.setStyle ('rotate',
            new ol.style.Style(
                {	text: new ol.style.Text (
                    {	text:'\uf0e2',
                        font:"16px Fontawesome",
                        textAlign: "left",
                        fill:new ol.style.Fill({color:'red'})
                    }),
                    image: circle
                }));
        // Center of rotation
        transform.setStyle ('rotate0',
            new ol.style.Style(
                {	text: new ol.style.Text (
                    {	text:'\uf0e2',
                        font:"20px Fontawesome",
                        fill: new ol.style.Fill({ color:[255,255,255,0.8] }),
                        stroke: new ol.style.Stroke({ width:2, color:'red' })
                    }),
                }));
        // Style the move handle
        transform.setStyle('translate',
            new ol.style.Style(
                {	text: new ol.style.Text (
                    {	text:'\uf047',
                        font:"20px Fontawesome",
                        fill: new ol.style.Fill({ color:[255,255,255,0.8] }),
                        stroke: new ol.style.Stroke({ width:2, color:'red' })
                    })
                }));
        transform.set('translate', transform.get('translate'));
    }
    //------------------------------------------------------------------------------------------------------------------
    //ドロータイプ選択
    $("body").on("change","#drawType",function(){
        featureSelect.getFeatures().clear();
        addInteractions();
        $(".select-toggle").bootstrapToggle("off");
    });
    //------------------------------------------------------------------------------------------------------------------
    //選択モードトグルを押したとき
    $("body").on("change",".select-toggle",function(){
        drawMenuOverlay.setPosition(null);
        featureSelect.getFeatures().clear();
        console.log("作成中");
        var interactions = map1.getInteractions().getArray();
        var DragRotateAndZoomInteraction = interactions.filter(function(interaction) {
            return interaction instanceof ol.interaction.DragRotateAndZoom;
        })[0];
        if($(this).prop("checked")) {
            console.log("checked");
            map1.removeInteraction(drawPoint);
            map1.removeInteraction(drawPolygon);
            map1.removeInteraction(drawhole);
            map1.removeInteraction(drawLineString);
            map1.removeInteraction(drawCircle);
            map1.removeInteraction(drawCircle2);
            map1.removeInteraction(snap);
            map1.removeInteraction(transform);
            //map1.removeInteraction(translate);
            map1.removeInteraction(drawDome);
            map1.removeInteraction(drawNintoku);
            map1.removeInteraction(drawPaste);

            map1.addInteraction(translate);
            map1.addInteraction(featureSelect);
            map1.removeInteraction(modify);
            map1.addInteraction(modify);
            map1.addInteraction(snap);
            $("#drawType").val("0");
            DragRotateAndZoomInteraction.setActive(false);
        }else{
            console.log("off");
            map1.removeInteraction(featureSelect);
            map1.removeInteraction(translate);
            DragRotateAndZoomInteraction.setActive(true);
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //色設定
    $("body").on("change","#cdrawColor",function(){

    });
    //------------------------------------------------------------------------------------------------------------------
    //効果
    $("body").on("change","#effectType",function(){
        var val = $(this).val();
        console.log(val);
        switch (val) {
            case "0":
                funcReset();
                break;
            case "voronoi":
                funcVoronoi();
                break;
            case "buffer":
                funcBuffer(100);
                break;
            default:
        }
    });
    //--------------------------------------------------------------------------------------------------------------
    function funcReset() {
        var features = drawSource.getFeatures();
        for(var i = 0; i <features.length; i++){
            var effet = features[i].getProperties()["_effect"];
            if(effet) drawSource.removeFeature(features[i])
        }
    }
    //--------------------------------------------------------------------------------------------------------------
    //ボロノイ図作成
    function funcVoronoi() {
        var d3Color = d3.scale.category20();
        var mapExtent = map1.getView().calculateExtent(map1.getSize());
        mapExtent = ol.proj.transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326');
        var options = {
            bbox: mapExtent
        };
        var features = drawSource.getFeatures();
        for(var i = 0; i <features.length; i++){
            var effet = features[i].getProperties()["_effect"];
            if(effet==="voronoi") drawSource.removeFeature(features[i])
        }
        features = drawSource.getFeatures();
        var features4326 = [];
        for (var i = 0; i < features.length; i++) {
            var geomType = features[i].getGeometry().getType();
            var point;
            if (geomType === "Point") {
                point = turf.point(ol.proj.transform(features[i].getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326"));
                features4326.push(point);
            }
        }
        var featureCollection = turf.featureCollection(features4326);
        var voronoiPolygons = turf.voronoi(featureCollection, options);
        for (var i = 0; i < voronoiPolygons["features"].length; i++) {
            var vpCoords4326 = voronoiPolygons["features"][i]["geometry"]["coordinates"][0];
            var vpCoordAr = [];
            for (var j = 0; j < vpCoords4326.length; j++) {
                var vpCoord = ol.proj.transform(vpCoords4326[j], "EPSG:4326", "EPSG:3857");
                vpCoordAr.push(vpCoord)
            }
            var geometry = new ol.geom.Polygon([vpCoordAr]);
            var rgb = d3.rgb(d3Color(i));
            var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)";
            var newFeature = new ol.Feature({
                geometry: geometry,
                //"_fillColor": "rgba(51,122,255,0.7)",
                "_fillColor": rgba,
                "_effect": "voronoi"
            });
            drawSource.addFeature(newFeature);
        }
    }
    //--------------------------------------------------------------------------------------------------------------
    //バッファー作成 turf.jsを使う場合。オプションが効かなかったのでol3で実装した。
    /*
    function funcBufferOld(radius) {
        var features = drawSource.getFeatures();
        for(var i = 0; i <features.length; i++){
            var effet = features[i].getProperties()["_effect"];
            if(effet==="buffer") drawSource.removeFeature(features[i])
        }
        features = drawSource.getFeatures();
        radius = radius * 1.179832968;
        console.log(radius);
        for (var i = 0; i < features.length; i++) {
            var geomType = features[i].getGeometry().getType();
            if (geomType === "Point") {
                var point4326 = turf.point(ol.proj.transform(features[i].getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326"));
                //var buffered = turf.buffer(point4326,radius,{"units":"kilometers","steps":64});
                var options = {
                    steps: 64
                };
                var buffered = turf.buffer(point4326,radius,options);
                console.log(buffered["geometry"]["coordinates"]);
                buffered = turf.toMercator(buffered);
                console.log(buffered["geometry"]["coordinates"]);
                var geometry = new ol.geom.Polygon(buffered["geometry"]["coordinates"]);
                var newFeature = new ol.Feature({
                    "_fillColor": "rgba(51,122,255,0.7)",
                    "_effect": "buffer",
                    geometry: geometry
                });
                drawSource.addFeature(newFeature);
            }
        }
    }
    */
    //--------------------------------------------------------------------------------------------------------------
    //バッファー作成
    function funcBuffer(radius) {
        var features = drawSource.getFeatures();
        for(var i = 0; i <features.length; i++){
            var effet = features[i].getProperties()["_effect"];
            if(effet==="buffer") drawSource.removeFeature(features[i])
        }
        features = drawSource.getFeatures();
        for (var i = 0; i < features.length; i++) {
            var geomType = features[i].getGeometry().getType();
            if (geomType === "Point") {
                var coord = ol.proj.transform(features[i].getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
                var precisionCircle = ol.geom.Polygon.circular(
                    new ol.Sphere(6378137),// WGS84 Sphere //
                    coord,//[131.423860, 31.911069]
                    radius, // Number of verticies //
                    64).transform('EPSG:4326', 'EPSG:3857');
                var newFeature = new ol.Feature(precisionCircle);
                newFeature["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
                newFeature["D"]["_effect"] = "buffer";
                drawSource.addFeature(newFeature);
            }
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //色保存
    $("body").on("click","#colorSave-btn",function() {
        var colorVal = $("#drawColor").val();
        var rgb = d3.rgb(colorVal);
        var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)";
        console.log(colorVal);
        console.log(rgba);
        console.log(featureSelect.getFeatures());
        console.log(featureSelect.getFeatures().getProperties());
        console.log(featureSelect.getFeatures().getProperties()["length"]);
        var features = featureSelect.getFeatures()["a"];
        console.log(features);

        if(!features.length){
            alert("選択されていません。選択モードをオンにして地物をクリックしてください。");
            return;
        }
        console.log(features[0].getProperties());

        for(var i = 0; i <features.length; i++){
            features[i].setProperties({
                "_fillColor":rgba
            });
        }
        featureSelect.getFeatures().clear();
        //alert("反映しました。")
    });
    //------------------------------------------------------------------------------------------------------------------
    //属性保存
    $("body").on("click","#propSave-btn",function(){
        console.log(selectedFeature);
        var nameElements = $(".prop-input-text-name");
        var valElements = $(".prop-input-text-val");
        var features = featureSelect.getFeatures()["a"];
        console.log(features);

        if(!features.length){
            alert("選択されていません。選択モードをオンにして地物をクリックしてください。");
            return;
        }
        console.log(features[0].getProperties());

        for(var i = 0; i <nameElements.length; i++) {
            var name = nameElements.eq(i).val();
            var val = valElements.eq(i).val();
            console.log(name,val);
            for (var j = 0; j < features.length; j++) {
                /*
                 features[j].setProperties({
                 //"_fillColor":colorVal
                 "id": "9999"
                 });
                 */
                console.log(features[j]["D"][name])
                if(name) features[j]["D"][name] = val
            }
        }
        featureSelect.getFeatures().clear();
        alert("反映しました。")
    });
    //------------------------------------------------------------------------------------------------------------------
    //属性キャンセル
    $("body").on("click","#propCancel-btn",function(){
        alert("作成中")
    });
    //------------------------------------------------------------------------------------------------------------------
    document.onkeyup=function(e){

    };

    //------------------------------------------------------------------------------------------------------------------
    //geojsonで保存
    $("body").on("click","#drawGeojson-btn",function(){
        var features = drawSource.getFeatures();
        console.log(features);
        if(!features.length) {
            alert("データがありません。");
            return;
        }
        var geojsonChar = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        geojsonChar = JSON.stringify(JSON.parse(geojsonChar),null,1);
        console.log(geojsonChar);
        $("#geojson-text").html("<pre>" + geojsonChar + "</pre>");

        var type = "text/plain";
        var blob = new Blob([geojsonChar], {type: type});
        $(".geojson-save-a").remove();
        $("body").append("<a class='geojson-save-a'></a>");

        $(".geojson-save-a").attr({
            "href": window.URL.createObjectURL(blob),
            "download":"edit.geojson"
        });
        $(".geojson-save-a")[0].click();//[0]が肝
    });
    //------------------------------------------------------------------------------------------------------------------
    //csvで保存
    $("body").on("click","#drawCsv-btn",function(){
        //$("#drawGeojson-btn").click(function(){
        var features = drawSource.getFeatures();
        console.log(features);
        if(!features.length) {
            alert("データがありません。");
            return;
        }
        var headerAr = [];
        var header = "";
        var content = "";
        for(var i = 0; i <features.length; i++) {
            var prop = features[i].getProperties();
            for(key in prop){
                if(key!=="geometry" && key.substr(0,1)!=="_" && key!=="移動") {
                    //console.log(key);
                    switch (key) {
                        case "経度":
                            key = "経度old";
                            break;
                        case "緯度":
                            key = "緯度old";
                            break;
                    }
                    PushArray(headerAr, key)
                }
            }
        }
        console.log(headerAr);
        if(headerAr.length) {
            header = headerAr.join() + ",";
        }
        for(var i = 0; i <features.length; i++){
            var prop = features[i].getProperties();
            for(var j = 0; j <headerAr.length; j++) {
                var val = prop[headerAr[j]];
                var lonOld,latOld;
                switch (headerAr[j]) {
                    case "経度old":
                        val = prop["経度"];
                        lonOld = val;
                        break;
                    case "緯度old":
                        val = prop["緯度"];
                        latOld = val;
                        break;
                    default:
                }
                if(val) {
                    val = val.replace("\n","");
                    content += val + ",";
                }else{
                    content += "-,";
                }
            }
            var coord = features[i].getGeometry().getCoordinates();
            console.log(coord);
            var lonlat = ol.proj.transform(coord,"EPSG:3857","EPSG:4326");
            //content += lonlat;
            var lonDifference = 0;
            var latDifference = 0;
            lonDifference = Number(lonOld)-lonlat[0];
            latDifference = Number(latOld)-lonlat[1];
            var geoType = features[i].getGeometry().getType();
            content += geoType;

            console.log(isNaN(lonlat[0]));
            if(isNaN(lonlat[0])) lonlat = ["",""];

            var coordString = '"' + JSON.stringify(coord) + '"';
            var fillColor = '"' + prop["_fillColor"] + '"';
            if(!fillColor) fillColor = "-";
            if(lonOld) {
                if (Math.abs(lonDifference) > 0.000001 || Math.abs(latDifference) > 0.000001) {
                    content += "," + coordString;
                    content += "," + fillColor;
                    content += "," + lonlat;
                    content += ",移動\n"
                } else {
                    content += "," + coordString;
                    content += "," + fillColor;
                    content += "," + Number(lonOld) + "," + Number(latOld);
                    content += ",-\n";
                }
            }else{
                content += "," + coordString;
                content += "," + fillColor;
                content += "," + lonlat;
                content += ",-\n"
            }
            if(i===0) {
                header = header + "_type,_coord,_fillColor,経度,緯度,移動" + "\n";
                content = header + content;
            }
        }
        // Unicodeコードポイントの配列に変換する
        var unicode_array = str_to_unicode_array(content);
        // SJISコードポイントの配列に変換
        var sjis_code_array = Encoding.convert(
            unicode_array, // ※文字列を直接渡すのではない点に注意
            'SJIS',  // to
            'UNICODE' // from
        );
        // 文字コード配列をTypedArrayに変換する
        var uint8_array = new Uint8Array( sjis_code_array );
        var type = "text/csv";
        //var blob = new Blob([content], {type: type});
        var blob = new Blob([uint8_array], {type: type});

        $(".csv-save-a").remove();
        $("body").append("<a class='csv-save-a'></a>");

        $(".csv-save-a").attr({
            "href": window.URL.createObjectURL(blob),
            "download":"csv.csv"
        });
        $(".csv-save-a")[0].click();//[0]が肝
    });
    //ドラッグアンドドロップのインタラクション-----------------------------
    var dragAndDrop = new ol.interaction.DragAndDrop({
        formatConstructors: [
            //ol.format.GPX,
            ol.format.GeoJSON,
            //ol.format.IGC,
            //ol.format.KML,
            //ol.format.TopoJSON
        ]
    });
    map1.addInteraction(dragAndDrop);
    //------------------------------------------------------------------------------------------------------------------
    //ドラッグアンドドロップでレイヤーを作る
    dragAndDrop.on('addfeatures', function(event) {
        var fileExtension = event["file"]["name"].split(".")[event["file"]["name"].split(".").length - 1]
        //console.log(fileExtension);
        switch (fileExtension) {
            case "geojson":
                geojsonRead(event);
                break;
            case "csv":
                csvRead(event.file);
                break;
            default:
                return;
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //geojson読み込み
    var geojsonRead = function(event) {
        var features = event.features;
        for(var i = 0; i <features.length; i++){
            drawSource.addFeature(features[i])
        }
    };
    //------------------------------------------------------------------------------------------------------------------
    //csv読み込み
    var csvRead = function(file){
        console.log(drawSourceChangeFlg);
        drawSourceChangeFlg = false;

        //drawSource = new ol.source.Vector();
        console.log(file);
        csvarr = [];
        var file_reader = new FileReader();
        file_reader.readAsBinaryString(file);//ここ超重要。文字コード変換のために必要
        file_reader.onload = function(e) {
            //console.log(file_reader.result);
            var result = e.target.result;
            var sjisArray = str2Array(result);
            var uniArray = Encoding.convert(sjisArray, 'UNICODE', 'SJIS');
            var result = Encoding.codeToString(uniArray);
            //console.log(result); //csvデータ(string)

            //console.log(result.match(/\[(.*?)\]/));

            var matches = result.match(/\[.*\]/gi);
            console.log(matches);
            if(matches) {
                for (var i = 0; i < matches.length; i++) {
                    result = result.replace(matches[i], matches[i].replace(/,/gi, "demi"))
                }
                console.log(result);
            }
            var matches = result.match(/rgba.*\)/gi);
            console.log(matches);
            if(matches) {
                for (var i = 0; i < matches.length; i++) {
                    result = result.replace(matches[i], matches[i].replace(/,/gi, "demi"))
                }
                console.log(result);
            }

            // 選択したCSVファイルから２次元配列を生成
            //console.log(result.indexOf("\r\n"));
            //console.log(result.indexOf("\n"));
            //console.log(result.indexOf("\r"));

            if(result.indexOf("\r\n")!==-1) {
                var rows = result.split("\r\n");
            }else if(result.indexOf("\n")!==-1) {
                var rows = result.split("\n");
            }else{
                var rows = result.split("\r");
            }
            //var rows = result.split("\r");
            var max = 0;
            rangemin = 9999999999;

            var headerAr = rows[0].split(",");
            console.log(headerAr);
            console.log(headerAr.length);
            var csvlon,csvlat;
            var csvType = "";
            var columnAr = [];
            var csvGeoType = null;
            var csvCoord = null;
            var csvFillColor = null;
            for(var i = 0; i <headerAr.length; i++){
                //console.log(headerAr[i])

                //headerAr[i] = headerAr[i].replace(/"/gi,"");

                if (headerAr[i] === "経度") csvlon = i;
                if (headerAr[i] === "緯度") csvlat = i;
                if (headerAr[i] === "_type") csvGeoType = i;
                if (headerAr[i] === "_coord") csvCoord = i;
                if (headerAr[i] === "_fillColor") csvFillColor = i;
                if (headerAr[i] === "経度"){
                    csvType = "draw";
                }
                columnAr.push(headerAr[i]);
            }

            $(rows).each(function () {
                var split = this.split(/,|\t/);

                //split = split.replace(/"/gi,"");

                if(split[0]) {//先頭列に何も書いていないときは抜ける。
                    csvarr.push(split);
                }else{
                    return false;
                }
            });
            cityObjAr = [];
            suuti = null;
            iro = null;
            inChar = "";
            valueAr = [];
            console.log(csvarr);
            for (var i=1; i < csvarr.length; i++) {
                var geoType = csvarr[i][csvGeoType];
                //console.log(geoType);
                var lonlat = [Number(csvarr[i][csvlon]),Number(csvarr[i][csvlat])];
                //var lonlat = [Number(csvarr[i][csvlon].replace(/"/gi,"")),Number(csvarr[i][csvlat].replace(/"/gi,""))];
                lonlat = ol.proj.transform(lonlat,"EPSG:4326","EPSG:3857");
                switch (geoType) {
                    case "LineString":
                    case "Polygon":
                        var coord = JSON.parse((JSON.parse(csvarr[i][csvCoord].replace(/demi/gi,","))));//1回目のJSON.parseで"をとって2回目のJSON.parseでパース
                        console.log(coord);
                        switch (geoType) {
                            case "Polygon":
                                var geometry = new ol.geom.Polygon(coord);
                                break;
                            case "LineString":
                                var geometry = new ol.geom.LineString(coord);
                                break;
                            default:
                        }
                        break;
                    default://ポイントのときはデフォルトで処理
                        var geometry = new ol.geom.Point(lonlat);
                }
                var newFeature = new ol.Feature({
                    geometry: geometry,
                    //_fillColor:"red"
                });
                //var fillColor = JSON.parse(csvarr[i][csvFillColor].replace(/demi/gi,","));
                var fillColor = csvarr[i][csvFillColor];
                if(fillColor) {
                    fillColor = fillColor.replace(/demi/gi,",").replace(/"/gi,"");
                    newFeature["D"]["_fillColor"] = fillColor;
                }else{
                    newFeature["D"]["_fillColor"] = "blue";
                }
                for(var j = 0; j <columnAr.length; j++){
                    //console.log(columnAr[j])
                    if(columnAr[j].substr(0,1)!=="_") newFeature["D"][columnAr[j]] = csvarr[i][j];
                    //if(columnAr[j].substr(0,1)!=="_") newFeature["D"][columnAr[j]] = csvarr[i][j].replace(/"/gi,"");
                }
                drawSource.addFeature(newFeature);
            }
        };
        drawSourceChangeFlg = true;
    }
});

