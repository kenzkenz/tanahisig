$(function() {
    var drawSource = null;
    var drawLayer = null;
    var haniSource = null;
    var haniLayer = null;

    var drawLayerHeatmap = null;
    var drawSourceChangeFlg = true;
    var copyCoord = [];//地物コピペ用
    var geojsonSaveAr = [];//取り消し用にgeojsonを保存する
    var selectedFeature = null;
    //------------------------------------------------------------------------------------------------------------------
    //ドロー用ダイアログ作成
    var selectHtml = "";
    selectHtml += "<div id='draw-div'>";
    selectHtml += "<div id='select-toggle-div'>";
    selectHtml += "選択モード：";
    selectHtml += "<input type='checkbox' data-toggle='toggle' class='select-toggle bs-toggle' data-size='mini'>";
    selectHtml += " 色、形状変更、項目追加はOn";
    selectHtml += "</div>";
    selectHtml += "<hr class='my-hr'>";
    //--------------------------------------------------------
    selectHtml += "<h5>step1 形を作る</h5>";
    selectHtml += "<div class='draw-div2'>";
    selectHtml += "形状 ";
    selectHtml += "<select id='drawType'>";
    selectHtml += "<option value='0' selected>リセット</option>";
    //selectHtml += "<optgroup label='<i class=\"fa fa-map-marker fa-fw fa-lg\" style=\"color:rgba(51,122,183,1.0);\"></i>点'>";
    selectHtml += "<optgroup label='<i class=\"fa fa-map-marker fa-lg\"></i>点'>";
    selectHtml += "<option value='Point'>点を設置</option>";
    selectHtml += "</optgroup>";
    selectHtml += "<optgroup label='<i class=\"fa fa-share-alt fa-lg\"></i>線'>";
    selectHtml += "<option value='LineString'>線を描く</option>";
    selectHtml += "<option value='LineStringFree'>線を描く(フリーハンド)</option>";
    selectHtml += "</optgroup>";
    selectHtml += "<optgroup label='<i class=\"fa fa-bookmark-o fa-lg\"></i>面'>";
    selectHtml += "<option value='Polygon'>面を描く</option>";
    selectHtml += "<option value='PolygonFree'>面を描く(フリーハンド)</option>";
    selectHtml += "<option value='DrawHole'>面に穴を開ける</option>";
    selectHtml += "<option value='Transform'>面の回転と変形と移動</option>";
    selectHtml += "</optgroup>";
    selectHtml += "<optgroup label='<i class=\"fa fa fa-circle-o fa-lg\"></i>円'>";
    selectHtml += "<option value='SingleCircle'>円を描く</option>";
    selectHtml += "<option value='DoubleCircle'>円を描く（二重）</option>";
    selectHtml += "</optgroup>";
    selectHtml += "<optgroup label='その他'>";
    selectHtml += "<option value='Dome'>東京ドーム一個分(正確ではありません。)</option>";
    selectHtml += "<option value='Nintoku'>仁徳天皇陵(正確ではありません。)</option>";
    selectHtml += "<option value='Paste'>最後に選択したポリゴンをペースト</option>";
    selectHtml += "<option value='hanisitei'>フリーハンドで範囲指定テスト</option>";
    selectHtml += "</optgroup>";
    selectHtml += "</select>";
    selectHtml += "</div>";
    selectHtml += "<hr class='my-hr'>";
    //--------------------------------------------------------
    selectHtml += "<h5>step2 色を塗る</h5>";
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
    selectHtml += " <button type='button' id='colorSave-btn' class='btn btn-xs btn-primary'>反映</button>";
    selectHtml += "</div>";
    selectHtml += "<hr class='my-hr'>";
    //--------------------------------------------------------
    selectHtml += "<h5>step3 項目<span style='font-size:x-small;'>(作成中)</span></h5>";
    selectHtml += "<div class='draw-div2'>";

    selectHtml += "<div id='draw-div3-koumoku'>";
    selectHtml += "<table id='propTable' class='table table-bordered table-hover'>";
    selectHtml += "<tr><th class='prop-th-num'></th><th class='prop-th0'>項目名</th><th class='prop-th1'></th></tr>";
    selectHtml += "<tr><td class='prop-td-num'>1</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td-num'>2</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td-num'>3</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td-num'>4</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td-num'>5</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td-num'>6</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td-num'>7</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td-num'>8</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td-num'>9</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "<tr><td class='prop-td-num'>10</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    selectHtml += "</table>";
    selectHtml += "</div>";
    selectHtml += "<button type='button' id='propSave-btn' class='btn btn-xs btn-primary center-block' style='margin-bottom:4px;'>項目を反映</button>";
    selectHtml += "</div>";

    selectHtml += "</div>";
    selectHtml += "<hr class='my-hr'>";
    //--------------------------------------------------------
    selectHtml += "<h5>step4 効果</h5>";
    selectHtml += "<div class='draw-div2''>";
    selectHtml += "<div id='draw-div3-select'>";
    selectHtml += "効果 <select id='effectType'>";
    selectHtml += "<option value='0' selected>リセット</option>";
    selectHtml += "<option value='voronoi'>ボロノイ図</option>";
    selectHtml += "<option value='buffer'>バッファー</option>";
    selectHtml += "<option value='heatmap'>ヒートマップ</option>";
    selectHtml += "<option value='simplify'>テスト</option>";
    selectHtml += "</select>";
    selectHtml += "</div>";
    selectHtml += "<div id='draw-div3-effect'>";
    selectHtml += "<div class='draw-div4-buffer' style='margin-bottom:3px;'>バッファー半径：<input id='buffer-radius-input' type='text' value='100' size='3'>m</div>";
    selectHtml += "<div class='draw-div4-simplify'>test1</div>";
    //selectHtml += "<div class='draw-div4'>test2</div>";
    selectHtml += "</div>";
    selectHtml += "</div>";
    selectHtml += "<hr class='my-hr'>";
    //--------------------------------------------------------
    selectHtml += "<h5>step5 作成した図形を保存します</h5>";
    selectHtml += "<div class='draw-div2'>";
    //selectHtml += "作成した図形を保存します";
    selectHtml += "<div class='btn-group btn-group-justified' style='width:300px;'>";
    selectHtml += "<div class='btn-group'><button type='button' id='drawGeojson-btn' class='btn btn-xs btn-primary'><i class='fa fa-download fa-fw' style='color:rgba(255,255,255,1.0);'></i>GEOJSON</button></div>";
    selectHtml += "<div class='btn-group'><button type='button' id='drawCsv-btn' class='btn btn-xs btn-primary'><i class='fa fa-download fa-fw' style='color:rgba(255,255,255,1.0);'></i>CSV</button></div>";
    selectHtml += "<div class='btn-group'><button type='button' id='drawGist-btn' class='btn btn-xs btn-primary'><i class='fa fa-github-alt fa-fw' style='color:rgba(255,255,255,1.0);'></i>GIST</button></div>";
    selectHtml += "</div>";
    selectHtml += "</div>";
    selectHtml += "</div>";
    var content = selectHtml;
    var drawTypeMsDropDown;
    $(".draw-btn").click(function(){
        mydialog({
            id:"draw-dialog",
            class:"draw-dialog",
            map:"map1",
            title:"ドロー<span style='font-size:x-small;'>(作成中)</span>",
            content:content,
            top:"60px",
            left:"10px",
            info:true
            //rmDialog:true
        });
        $(".bs-toggle").bootstrapToggle();
        drawTypeMsDropDown = $("#drawType").msDropDown().data("dd");
        $("#drawColor,#effectType").msDropDown({height:300});
        $("#buffer-radius-input").spinner({
            max:50000, min:0, step:10,
            spin:function(event,ui){
                var radius = ui.value;
                funcBuffer(radius);
            }
        });
        $(window).on('beforeunload', function() {
            //if($("#mydialog-draw-dialog").css("display")==="block") return "";
            if(drawSourceChangeFlg) return "";
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
        Overlaycontent += "<button type='button' class='close' id='drawMenuOverlay-close'>&times;</button>";
        Overlaycontent += "<div>";
        Overlaycontent += "<button type='button' id='draw-remove-btn' class='btn btn-xs btn-primary'>削除</button>";
        Overlaycontent += "<div id='circle-radius-div'>半径：<input id='circle-radius-input' type='text' value='100' size='3'>m</div>";
        Overlaycontent += "<div id='circle-radius2-div'>半径：<input id='circle-radius2-input' type='text' value='50' size='3'>m</div>";
        Overlaycontent += "</div>";
    $("#map1").append('<div id="drawMenuOverlay-div" class="drawMenuOverlay-div">' + Overlaycontent + '</div>');
    //------------------------------------------------------------------------------------------------------------------
    //オーバーレイをマップに設定
    var drawMenuOverlay = new ol.Overlay({
        element:$("#drawMenuOverlay-div")[0],
        autoPan:false,
        offset:[20,-40]//横、縦
    });
    map1.addOverlay(drawMenuOverlay);
    //------------------------------------------------------------------------------------------------------------------
    //オーバーレイ上のスピンコントロール　半径の操作 外円と内円共用
    $("#circle-radius-input,#circle-radius2-input").spinner({
        max:50000, min:0, step:10,
        spin:function(event,ui){
            var extent = selectedFeature.getGeometry().getExtent();
            var center = ol.extent.getCenter(extent);
            var geomType = selectedFeature.getGeometry().getType();
            var options = {
                units:"meters",
                steps: 128
            };
            var radius = ui.value;
            var point = turf.toWgs84(center);
            var tCircle = turf.circle(point,radius,options);
            tCircle = turf.toMercator(tCircle);
            var coordAr = selectedFeature.getGeometry().getCoordinates();
            switch (geomType) {
                case "Polygon":
                    var geometry = new ol.geom.Polygon(tCircle["geometry"]["coordinates"]);
                    break;
                case "MultiPolygon":
                    if($(this).attr("id")==="circle-radius-input") {//外円と内円の判断
                        var geometry = new ol.geom.MultiPolygon([tCircle["geometry"]["coordinates"],coordAr[1]]);//外円
                    }else{
                        var geometry = new ol.geom.MultiPolygon([coordAr[0],tCircle["geometry"]["coordinates"]]);//内円
                    }
                    break;
            }
            selectedFeature.setGeometry(geometry);
        }
    });
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
    //ドロー用（通常）のソース、レイヤーを設置
    drawSource = new ol.source.Vector();
    drawLayer = new ol.layer.Vector({
        source:drawSource,
        name:"drawLayer",
        style:drawStyleFunction()
    });
    map1.addLayer(drawLayer);
    drawLayer.set("selectable",true);
    drawLayer.set("altitudeMode","clampToGround");
    drawLayer.setZIndex(9999);
    //------------------------------------------------------------------------------------------------------------------
    //範囲指定用のソース、レイヤーを設置
    haniSource = new ol.source.Vector();
    haniLayer = new ol.layer.Vector({
        source:haniSource,
        name:"haniLayer",
        style:function(){

        }
    });
    map1.addLayer(haniLayer);
    haniLayer.setZIndex(9999);
    //------------------------------------------------------------------------------------------------------------------
    //ドロー用（ヒートマップ）のレイヤーを設置
    drawLayerHeatmap = new ol.layer.Heatmap({
        source:drawSource,
        name:"drawLayerHeatmap",
        style:drawStyleFunction()
    });
    //スタイルファンクション-----------------------------------------------------------------------------------------------
    function drawStyleFunction() {
        return function(feature, resolution) {
            var prop = feature.getProperties();
            var geoType = feature.getGeometry().getType();
            var fillColor = prop["_fillColor"];
            if(!fillColor) fillColor = "rgba(0,122,255,0.7)";
            var strokeColor = prop["_color"];
            var strokeWidth = prop["_weight"];
            var type = prop["_type"];
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
                //線（ライン）
                case "LineString":
                    var tDistance = funcTDistance(feature);
                    console.log(tDistance);
                    var style = [
                        new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: strokeColor ? strokeColor : "black",
                                width: strokeWidth ? strokeWidth : 6
                            })
                        }),
                        new ol.style.Style({//頂点の六角形
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
                                text: tDistance,
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
                                var lastCoord =  feature.getGeometry().getLastCoordinate();
                                return new ol.geom.Point(lastCoord)
                            }
                        })
                    ];
                    break;
                //点（ポイント）
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
                //面と円（ポリゴンとマルチポリゴン）
                case "Polygon":
                case "MultiPolygon":
                    var text = "";
                    var text2 = "";
                    switch (type) {
                        case "circle":
                        case "buffer":
                            var tRadius = funcTRadius(feature);
                            switch (geoType) {
                                case "Polygon":
                                    text = "半径" + tRadius;
                                    text2 = "";
                                    var lastCoord =  feature.getGeometry().getLastCoordinate();
                                    var returnGeom = new ol.geom.Point(lastCoord);//テキスト用ジオメトリー
                                    break;
                                case "MultiPolygon":
                                    text = "半径" + tRadius[0];
                                    text2 = "半径" + tRadius[1];
                                    var lastCoord =  feature.getGeometry().getCoordinates()[0][0][0];
                                    var lastCoord2 =  feature.getGeometry().getCoordinates()[1][0][0];
                                    var returnGeom = new ol.geom.Point(lastCoord);//テキスト用ジオメトリー
                                    var returnGeom2 = new ol.geom.Point(lastCoord2);//テキスト用ジオメトリー
                                    break;
                            }
                            break;
                        default:
                            var tArea = funcTArea(feature);
                            var tDistance = funcTDistance(feature);
                            if(tDistance) {
                                text = "面積\n" + tArea + "\n周長" + tDistance;
                            }else{
                                text = "面積\n" + tArea;
                            }
                            var returnGeom = feature.getGeometry();//テキスト用ジオメトリー
                    }
                    var style = [
                        new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: fillColor
                            }),
                            stroke: new ol.style.Stroke({
                                color: strokeColor ? strokeColor : "gray",
                                width: strokeWidth ? strokeWidth : 2
                            }),
                            zIndex: 0
                        }),
                        new ol.style.Style({//通常および外円用テキスト用スタイル
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                text: text,
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
                                return returnGeom
                            },
                            zIndex: 0
                        }),
                        new ol.style.Style({//内円用テキスト用スタイル
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                text: text2,
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
                                return returnGeom2
                            },
                            zIndex: 0
                        })
                    ];
                    break;
                default:
            }
            return style;
        };
    }
    //------------------------------------------------------------------------------------------------------------------
    //線の長さを計算
    function funcTDistance(feature){
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
                /*
                console.log(coordAr[0][0]);
                console.log(coordAr[1][0]);
                for(var i = 0; i <coordAr[0][0].length-1; i++){
                    fromCoord = turf.toWgs84(coordAr[0][0][i]);
                    toCoord = turf.toWgs84(coordAr[0][0][i+1]);
                    tDistance = tDistance + turf.distance(fromCoord,toCoord);
                    //console.log(tDistance);
                }
                */
                break;
            default:
        }
        if(tDistance<1) {
            tDistance = String((Math.round(tDistance*1000)/1000*1000).toLocaleString()) + "m";//1m単位で四捨五入
        }else{
            tDistance = String((Math.round(tDistance*100)/100).toLocaleString()) + "km";//10m単位で四捨五入
        }
        return tDistance;
    }
    //------------------------------------------------------------------------------------------------------------------
    //地物の面積を計算
    function funcTArea(feature){
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
    }
    //------------------------------------------------------------------------------------------------------------------
    //円の半径を計算
    function funcTRadius(feature){
        var extent = feature.getGeometry().getExtent();
        var center = ol.proj.transform(ol.extent.getCenter(extent), "EPSG:3857", "EPSG:4326");
        var TRadius = 0;
        var coordAr = feature.getGeometry().getCoordinates();
        var geomType = feature.getGeometry().getType();
        switch (geomType) {
            case "Polygon":
                var to = ol.proj.transform(coordAr[0][0], "EPSG:3857", "EPSG:4326");
                TRadius = TRadius + turf.distance(center,to);
                TRadius = funcMath(TRadius);
                break;
            case "MultiPolygon":
                var TRadiusAr = [];
                for(var i = 0; i <2; i++){
                    var to = ol.proj.transform(coordAr[i][0][0], "EPSG:3857", "EPSG:4326");
                    TRadius = turf.distance(center,to);
                    TRadius = funcMath(TRadius);
                    TRadiusAr.push(TRadius);
                }
                TRadius = TRadiusAr;
                break;
            default:
        }
        //-----------------------------
        function funcMath(TRadius) {
            if(TRadius<1) {
                TRadius = String((Math.round(TRadius*100)/100*1000).toLocaleString()) + "m";//10m単位で四捨五入
            }else{
                TRadius = String((Math.round(TRadius*100)/100).toLocaleString()) + "km";//10m単位で四捨五入
            }
            return TRadius;
        }
        //-----------------------------
        return TRadius;
    }

    document.onclick = function(e){
        console.log(e.button);
    };

    //------------------------------------------------------------------------------------------------------------------
    //キーボード操作　キーダウン時　ctrl+zで戻す　同時押しはこちらに描く
    var geojsonDeleteAr =[];
    var shiftKeyFlg = false;
    $(window).keydown(function(e){
        //----------------------
        if(event.shiftKey) {
            shiftKeyFlg = true;
        }else{
            shiftKeyFlg = false;
        }
        //----------------------
        if(event.ctrlKey){
            featureSelect.getFeatures().clear();
            if(e.keyCode === 90){//z
                if(drawPolygon.nbpts>1 || drawLineString.nbpts>1) {
                    drawPolygon.removeLastPoint();
                    drawLineString.removeLastPoint();
                }else{
                    drawSource.clear();
                    geojsonDeleteAr.push(geojsonSaveAr[geojsonSaveAr.length - 2]);
                    geojsonSaveAr.splice(geojsonSaveAr.length - 2, 2);//配列の最後から２番目から２つ削除。つまり後ろ二つを削除
                    var geojsonObject = geojsonSaveAr[geojsonSaveAr.length - 1];
                    if(geojsonObject){
                        var targetGeojson = new ol.format.GeoJSON().readFeatures(geojsonObject, {featureProjection: 'EPSG:3857'});
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
                drawSource.addFeatures(targetGeojson);
            }
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //キーボード操作 キーアップ時
    $(window).keyup(function(e){
        shiftKeyFlg = false;
        var keycode = e.keyCode;
        console.log(keycode);
        //if($(":focus").val()) return;//input等でvalがあるときは抜ける。
        console.log($(":focus")["length"]);
        if($(":focus")["length"]){
            console.log($(":focus").get(0).tagName);
            if($(":focus").get(0).tagName==="INPUT") return;//inputのときは抜ける。
        }
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
    var drawSourceChangeFlg = false;
    drawSource.on("change", function(e) {
        if(drawSourceChangeFlg) geojsonText();
        drawSourceChangeFlg = true;
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
            if(!fillColor) fillColor = "rgba(0,122,255,0.7)";
            var strokeColor = prop["_color"];
            var strokeWidth = prop["_weight"];
            var type = prop["_type"];
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
                        new ol.style.Style({//
                            image: new ol.style.RegularShape({
                                fill: new ol.style.Fill({
                                    color: fillColor
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "red",
                                    width: 1
                                }),
                                points: 5,
                                radius: 16,
                                radius2: 8,
                                angle: 0
                            }),
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                text: "",
                                fill: new ol.style.Fill({
                                    color: "white"
                                }),
                                offsetY: 0
                            })
                        })
                    ];
                    break;
                case "MultiPolygon":
                case "Polygon":
                    copyCoord = feature.getGeometry().getCoordinates();//ポリゴンを保存
                    var text = "";
                    switch (type) {
                        case "circle":
                        case "buffer":
                            var tRadius = funcTRadius(feature);
                            text = "半径" + tRadius;
                            var lastCoord =  feature.getGeometry().getLastCoordinate();
                            var returnGeom = new ol.geom.Point(lastCoord);//テキスト用ジオメトリー
                            var returnNodeGeom = null;//ノード用ジオメトリー
                            break;
                        default:
                            var tArea = funcTArea(feature);
                            text = "面積\n" + tArea;
                            var returnGeom = feature.getGeometry();//テキスト用ジオメトリー
                            var coord = feature.getGeometry().getCoordinates()[0];
                            var returnNodeGeom = new ol.geom.MultiPoint(coord);//ノード用ジオメトリー
                    }
                    switch (geoType) {
                        case "Polygon":

                            break;
                        case "MultiPolygon":
                            strokeColor = "red";
                            break;
                        default:
                    }
                    var styles = [
                        new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: fillColor
                            }),
                            stroke: new ol.style.Stroke({
                                color: strokeColor ? strokeColor : "gray",
                                width: strokeWidth ? strokeWidth : 1
                            }),
                            zIndex: 0
                        }),
                        new ol.style.Style({//テキスト用スタイル
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                text: text,
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
                                return returnGeom
                            },
                            zIndex: 0
                        }),
                        new ol.style.Style({//頂点の六角形
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
                                return returnNodeGeom;
                            }
                        })
                    ];
                    break;
                case "MultiLineString":
                case "LineString":
                    var tDistance = funcTDistance(feature);
                    console.log(tDistance);
                    var styles = [
                        new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: fillColor
                            }),
                            stroke: new ol.style.Stroke({
                                //color: 'red',
                                color: strokeColor,
                                width: strokeWidth ? strokeWidth : 6
                            }),
                            text: new ol.style.Text({
                                font: "14px sans-serif",
                                text: tDistance,
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
                        new ol.style.Style({//頂点の六角形
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
        console.log("セレクト時発火");
        var features = e.selected;
        console.log(features);
        selectedFeature = features[0];
        console.log(selectedFeature)
        $(".prop-input-text-name").val("");
        $(".prop-input-text-val").val("");
        $("#circle-radius-div").hide();
        $("#circle-radius2-div").hide();
        if(features.length) {
            var extent = selectedFeature.getGeometry().getExtent();
            var extentCenter = ol.extent.getCenter(extent);
            var coordAr = selectedFeature.getGeometry().getCoordinates();
            var geomType = selectedFeature.getGeometry().getType();
            console.log(geomType);
            switch (geomType) {
                case "LineString":
                    console.log(coordAr);
                    //drawMenuOverlay.setOffset([0,0]);//[20,-40]//横、縦
                    //drawMenuOverlay.setPosition(coordAr[0]);//オーバーレイ表示
                    break;
                default:
                    if(selectedFeature.getProperties()["_type"]==="circle") {//円だったとき
                        var tRadiusNum,tRadiusNum2;
                        switch (geomType) {
                            case "Polygon":
                                tRadius = funcTRadius(selectedFeature);
                                if(tRadius.indexOf("km")!==-1) {
                                    tRadiusNum = Number(tRadius.replace("km",""))*1000;
                                }else{
                                    tRadiusNum = Number(tRadius.replace("m",""));
                                }
                                $("#circle-radius-input").val(tRadiusNum);
                                break;
                            case "MultiPolygon":
                                var tRadiusAr = funcTRadius(selectedFeature);
                                if(tRadiusAr[0].indexOf("km")!==-1) {
                                    tRadiusNum = Number(tRadiusAr[0].replace("km",""))*1000;
                                    tRadiusNum2 = Number(tRadiusAr[1].replace("km",""))*1000;
                                }else{
                                    tRadiusNum = Number(tRadiusAr[0].replace("m",""));
                                    tRadiusNum2 = Number(tRadiusAr[1].replace("m",""));
                                }
                                $("#circle-radius-input").val(tRadiusNum);
                                $("#circle-radius2-input").val(tRadiusNum2);
                                break;
                        }
                        $("#circle-radius-div").show();
                        if(geomType==="MultiPolygon") $("#circle-radius2-div").show();
                    }else{
                        $("#circle-radius-div").hide();
                        $("#circle-radius2-div").hide();
                    }
                    //drawMenuOverlay.setOffset([20,-40]);
                    //drawMenuOverlay.setPosition(extentCenter);//オーバーレイ表示
                    break;
            }
        }else{
            drawMenuOverlay.setPosition(null);
            return;
        }
        var prop = features[0].getProperties();
        console.log(prop);
        var i = 0;
        for(key in prop){
            if(key!=="geometry" && key.substr(0,1)!=="_" && key!=="経度" && key!=="緯度" && key!=="経度old" && key!=="緯度old" && key!=="移動"){
                console.log(key);
                $(".prop-input-text-name").eq(i).val(key);
                $(".prop-input-text-val").eq(i).val(prop[key]);
                i++
            }
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //スナップ
    var snap = new ol.interaction.Snap({source:drawSource});
    //------------------------------------------------------------------------------------------------------------------
    //モディファイ
    var modify = new ol.interaction.Modify({
        features:featureSelect.getFeatures(),
        deleteCondition:ol.events.condition.singleClick//頂点の削除をシングルクリックのみでできるようにしたｓ
    });
    //------------------------------------------------------------------------------------------------------------------
    //ポイント
    var drawPoint = new ol.interaction.Draw({
        source:drawSource,
        type:"Point",
        condition:function(e){
            var mouseButton = e["originalEvent"]["button"];
            if(mouseButton===0){//0が左クリック。2が右クリック。
                return ol.events.condition.singleClick
            }
        }
    });
    drawPoint.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        console.log(prop)
        prop["_fillColor"] = "rgba(51,122,255,0.7)";
        featureSelect.getFeatures().clear();
        helpTooltipElement.classList.add('hidden');
        helpTooltipElement.innerHTML = "";
    });
    //------------------------------------------------------------------------------------------------------------------
    //ポリゴンで範囲指定 フリーハンド
    var drawPolygonHanisuteiFree = new ol.interaction.Draw({
        snapTolerance:1,
        source:haniSource,
        type:"Polygon",
        freehand:true
    });
    drawPolygonHanisuteiFree.on("drawend", function(e) {
        var feature = e["feature"];
        var coordAr = feature.getGeometry().getCoordinates();
        //console.log(coordAr);
        var haniPolygon = turf.toWgs84(turf.polygon(coordAr));
        //console.log(haniPolygon);
        featureSelect.getFeatures().clear();
        features = drawSource.getFeatures();
        map1.removeInteraction(featureSelect);
        map1.addInteraction(featureSelect);
        for (var i = 0; i < features.length; i++) {
            var geomType = features[i].getGeometry().getType();
            var bool;
            var point,targetGeom;
            console.log(geomType);
            switch (geomType) {
                case "Point":
                    point = turf.toWgs84(turf.point(features[i].getGeometry().getCoordinates()));
                    bool = turf.booleanPointInPolygon(point, haniPolygon);
                    if (bool) featureSelect.getFeatures().push(features[i]);
                    break;
                default:
                    switch (geomType) {
                        case "MultiPolygon":
                            targetGeom = turf.toWgs84(turf.multiPolygon(features[i].getGeometry().getCoordinates()));
                            var tgtFeatureCollection = turf.flatten(targetGeom);
                            var tgtFeatures = tgtFeatureCollection["features"];
                            console.log(tgtFeatures);
                            for(var j = 0; j <tgtFeatures.length; j++){
                                bool = turf.booleanWithin(tgtFeatures[j],haniPolygon);
                                if(bool) break;
                            }
                            if(!bool){
                                for(var j = 0; j <tgtFeatures.length; j++){
                                    bool = turf.booleanOverlap(tgtFeatures[j],haniPolygon);
                                    if(bool) break;
                                }
                            }
                            console.log(bool);
                            break;
                        case "LineString":
                        case "Polygon":
                            if(geomType==="Polygon") {
                                targetGeom = turf.toWgs84(turf.polygon(features[i].getGeometry().getCoordinates()));
                                bool = turf.booleanWithin(targetGeom,haniPolygon);
                                if(!bool) bool = turf.booleanOverlap(targetGeom,haniPolygon);
                            }else if(geomType==="LineString"){
                                targetGeom = turf.toWgs84(turf.lineString(features[i].getGeometry().getCoordinates()));
                                bool = turf.booleanWithin(targetGeom,haniPolygon);
                                //if(!bool) bool = turf.booleanOverlap(targetGeom,haniPolygon); //ラインのときは同じラインじゃないとエラーになる
                            }
                            console.log(targetGeom);
                            break;
                        default:
                    }
                    if (bool) featureSelect.getFeatures().push(features[i]);
                    break;
            }
            bool = false;
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //ポリゴン フリーハンド
    var drawPolygonFree = new ol.interaction.Draw({
        snapTolerance:1,
        source:drawSource,
        type:"Polygon",
        geometryFunction:polygonGometryFunc(),
        freehand:true
    });
    drawPolygonFree.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_fillColor"] = "rgba(51,122,255,0.7)";
        prop["_color"] = "rgba(51,122,255,0.7)";
        prop["_weight"] = 1;
        featureSelect.getFeatures().clear();
        drawPolygon.nbpts = 0;
        helpTooltipElement.classList.add('hidden');
        helpTooltipElement.innerHTML = "";
        //-------------------------------------------------
        var options = {tolerance: 0.000001, highQuality: false};
        var coordAr = e["feature"].getGeometry().getCoordinates();
        var tPolygon = turf.polygon(coordAr);
        tPolygon = turf.toWgs84(tPolygon);
        var simplefied = turf.simplify(tPolygon, options);
        simplefied = turf.toMercator(simplefied);
        var geometry = new ol.geom.Polygon(simplefied["geometry"]["coordinates"]);
        e["feature"].setGeometry(geometry);
        //-------------------------------------------------
    });
    //------------------------------------------------------------------------------------------------------------------
    //ポリゴン
    var drawPolygon = new ol.interaction.Draw({
        snapTolerance:1,
        source:drawSource,
        type:"Polygon",
        style:polygonStringeStyleFunc(),
        geometryFunction:polygonGometryFunc(),
        condition:function(e){
            var mouseButton = e["originalEvent"]["button"];
            if(mouseButton===0){//0が左クリック。2が右クリック。
                return ol.events.condition.singleClick
            }
        }
    });
    function polygonStringeStyleFunc() {
        return function(feature, resolution) {
            var tDistance = funcTDistance(feature);
            var styles =[
                new ol.style.Style({//ラインの形状
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 255, 0.7)',
                        lineDash: [10, 10],
                        width: 3
                    })
                }),
                new ol.style.Style({//先端の形状
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.7)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(0, 0, 255, 0.3)'
                        })
                    }),
                    text: new ol.style.Text({
                        font: "14px sans-serif",
                        text: tDistance,
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
                        //var coordAr = feature.getGeometry().getCoordinates()[0];
                        //console.log(coordAr);
                        //console.log(feature.getGeometry().getLastCoordinate());
                        //if(coordAr.length) lastCoord =  coordAr[coordAr.length-2];
                        var lastCoord =  feature.getGeometry().getLastCoordinate();
                        return new ol.geom.Point(lastCoord)
                    }
                })
            ];
            return styles;
        };
    }
    function polygonGometryFunc() {
        return function(coordinates, geometry) {
            this.nbpts = coordinates[0].length;
            if (geometry) geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
            else geometry = new ol.geom.Polygon(coordinates);
            return geometry;
        };
    }
    var drawPolygonListener;
    drawPolygon.on("drawstart", function(e) {
        var feature = e.feature;
        drawPolygonListener = feature.getGeometry().on('change', function(evt) {
            if(helpTooltipElement.innerHTML==="") return;//直前にメッセージがないときは、表示しない。
            var coordAr = feature.getGeometry().getCoordinates()[0];
            var coord = coordAr[coordAr.length-2];
            helpTooltipElement.innerHTML = "<span style='color:black;'>方向を変更する時にはシングルクリック<br>確定する時にはダブルクリック<br>ctrl+zで元に戻す</span>";
            helpTooltip.setPosition(coord);
        });
    });
    drawPolygon.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_fillColor"] = "rgba(51,122,255,0.7)";
        prop["_color"] = "rgba(51,122,255,0.7)";
        prop["_weight"] = 1;
        featureSelect.getFeatures().clear();
        drawPolygon.nbpts = 0;
        ol.Observable.unByKey(drawPolygonListener);
        helpTooltipElement.classList.add('hidden');
        helpTooltipElement.innerHTML = "";
    });
    //------------------------------------------------------------------------------------------------------------------
    //穴を開ける
    var drawhole  = new ol.interaction.DrawHole ({
        layers:[drawLayer],
        condition:function(e){
            var mouseButton = e["originalEvent"]["button"];
            if(mouseButton===0){//0が左クリック。2が右クリック。
                return ol.events.condition.singleClick
            }
        }
    });
    var drawholeListener;
    drawhole.on("drawstart", function(e) {
        var feature = e.feature;
        drawholeListener = feature.getGeometry().on('change', function(evt) {
            if(helpTooltipElement.innerHTML==="") return;//直前にメッセージがないときは、表示しない。
            var coordAr = feature.getGeometry().getCoordinates()[0];
            var coord = coordAr[coordAr.length-2];
            helpTooltipElement.innerHTML = "<span style='color:black;'>方向を変更する時にはシングルクリック<br>確定する時にはダブルクリック<br>ctrl+zは使ったらダメ！<br>やめるときはstep1でリセット</span>";
            helpTooltip.setPosition(coord);
        });
    });
    drawhole.on("drawend", function(e) {
        ol.Observable.unByKey(drawholeListener);
        helpTooltipElement.classList.add('hidden');
        helpTooltipElement.innerHTML = "";
    });
    //------------------------------------------------------------------------------------------------------------------
    //線　ライン フリーハンド
    var drawLineStringFree = new ol.interaction.Draw({
        source:drawSource,
        type:"LineString",
        geometryFunction:linStringeGometryFunc(),
        style:linStringeStyleFunc(),
        freehand:true
    });
    drawLineStringFree.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_color"] = "rgba(51,122,255,0.7)";
        prop["_weight"] = 6;
        featureSelect.getFeatures().clear();
        drawLineString.nbpts = 0;
        helpTooltipElement.classList.add('hidden');
        helpTooltipElement.innerHTML = "";
        //-------------------------------------------------
        var options = {tolerance: 0.000001, highQuality: false};
        var coordAr = e["feature"].getGeometry().getCoordinates();
        var tLineString = turf.lineString(coordAr);
        tLineString = turf.toWgs84(tLineString);
        var simplefied = turf.simplify(tLineString, options);
        simplefied = turf.toMercator(simplefied);
        var geometry = new ol.geom.LineString(simplefied["geometry"]["coordinates"]);
        e["feature"].setGeometry(geometry);
        //-------------------------------------------------
    });
    //------------------------------------------------------------------------------------------------------------------
    //線　ライン
    var drawLineString = new ol.interaction.Draw({
        source:drawSource,
        type:"LineString",
        geometryFunction:linStringeGometryFunc(),
        style:linStringeStyleFunc(),
        condition:function(e){
            var mouseButton = e["originalEvent"]["button"];
            if(mouseButton===0){//0が左クリック。2が右クリック。
                return ol.events.condition.singleClick
            }
        }
    });
    function linStringeGometryFunc() {
        return function(coordinates, geometry) {
            if (geometry) geometry.setCoordinates(coordinates);
            else geometry = new ol.geom.LineString(coordinates);
            this.nbpts = geometry.getCoordinates().length;
            return geometry;
        };
    }
    function linStringeStyleFunc() {
        return function(feature, resolution) {
            var tDistance = funcTDistance(feature);
            var styles =[
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 0, 0, 0.7)',
                        lineDash: [10, 10],
                        width: 3
                    })
                }),
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.7)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        })
                    }),
                    text: new ol.style.Text({
                        font: "14px sans-serif",
                        text: tDistance,
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
                        var lastCoord =  feature.getGeometry().getLastCoordinate();
                        return new ol.geom.Point(lastCoord)
                    }
                })
            ];
            return styles;
        };
    }
    var lineStringListener;
    drawLineString.on("drawstart", function(e) {
        var feature = e.feature;
        lineStringListener = feature.getGeometry().on('change', function(evt) {
            if(helpTooltipElement.innerHTML==="") return;//直前にメッセージがないときは、表示しない。
            var geom = evt.target;
            helpTooltipElement.innerHTML = "<span style='color:black;'>方向を変更する時にはシングルクリック<br>確定する時にはダブルクリック<br>ctrl+zで元に戻す</span>";
            helpTooltip.setPosition(geom.getLastCoordinate());
        });
    });
    drawLineString.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_color"] = "rgba(51,122,255,0.7)";
        prop["_weight"] = 6;
        featureSelect.getFeatures().clear();
        drawLineString.nbpts = 0;
        ol.Observable.unByKey(lineStringListener);
        helpTooltipElement.classList.add('hidden');
        helpTooltipElement.innerHTML = "";
    });
    //------------------------------------------------------------------------------------------------------------------
    //ドローのヘルプ
    var helpTooltipElement = null;
    createHelpTooltip();
    function createHelpTooltip() {
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new ol.Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        map1.addOverlay(helpTooltip);
    }
    var drawHelpFlg = false;
    //-------------------
    var pointerMoveHandler = function(evt) {
        if (evt.dragging) {
            return;
        }
        if(drawHelpFlg && helpTooltipElement.innerHTML!=="") {
            helpTooltip.setPosition(evt.coordinate);
            helpTooltipElement.classList.remove('hidden');
        }else{
            helpTooltip.setPosition(null);
            helpTooltipElement.classList.add('hidden');
        }
    };
    map1.on('pointermove', pointerMoveHandler);
    map1.getViewport().addEventListener('mouseout', function() {
        helpTooltipElement.classList.add('hidden');
    });
    //------------------------------------------------------------------------------------------------------------------
    //現在使っていない円
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
    //------------------------------------------------------------------------------------------------------------------
    //円
    var drawSingleCircle = new ol.interaction.Draw({
        source:drawSource,
        type:"Point",
        geometryFunction:function(coordinates, geometry){
            var mapZoom = map1.getView().getZoom();
            var radius = 0;
            if(mapZoom>=15) {
                radius = 300;
            }else if(mapZoom>=13) {
                radius = 600;
            }else if(mapZoom>=11) {
                radius = 3000;
            }else{
                radius = 10000;
            }
            var options = {
                units:"meters",
                steps: 128
            };
            var point = turf.toWgs84(coordinates);
            var tCircle = turf.circle(point,radius,options);
            tCircle = turf.toMercator(tCircle);
            geometry = new ol.geom.Polygon(tCircle["geometry"]["coordinates"]);
            return geometry;
        }
    });
    drawSingleCircle.on("drawend", function(e) {
        e["feature"]["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
        e["feature"]["D"]["_type"] = "circle";
        map1.removeInteraction(featureSelect);
        map1.addInteraction(featureSelect);
        featureSelect.getFeatures().clear();
        featureSelect.dispatchEvent({
            type:"select",
            selected:[e["feature"]],
            deselected:[]
        });
        $(".select-toggle").bootstrapToggle("on");
    });
    //------------------------------------------------------------------------------------------------------------------
    //二重円
    var drawDoubleCircle = new ol.interaction.Draw({
        source:drawSource,
        type:"Point",
        geometryFunction:function(coordinates, geometry){
            var mapZoom = map1.getView().getZoom();
            var radius = 0;
            var radius2 = 0;
            if(mapZoom>=15) {
                radius = 300;
                radius2 = 200;
            }else if(mapZoom>=13) {
                radius = 600;
                radius2 = 200;
            }else if(mapZoom>=11) {
                radius = 3000;
                radius2 = 2000;
            }else{
                radius = 10000;
                radius2 = 7000;
            }
            var options = {
                units:"meters",
                steps: 128
            };
            //外円--------------------------
            //var radius = 200;
            var point = turf.toWgs84(coordinates);
            var tCircle = turf.circle(point,radius,options);
            tCircle = turf.toMercator(tCircle);
            //内円--------------------------
            //var radius2 = 100;
            var point2 = turf.toWgs84(coordinates);
            var tCircle2 = turf.circle(point2,radius2,options);
            tCircle2 = turf.toMercator(tCircle2);
            //-----------------------------
            geometry = new ol.geom.MultiPolygon([tCircle["geometry"]["coordinates"],tCircle2["geometry"]["coordinates"]]);
            return geometry;
        }
    });
    drawDoubleCircle.on("drawend", function(e) {
        e["feature"]["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
        e["feature"]["D"]["_type"] = "circle";
        console.log(e["feature"])
        map1.removeInteraction(featureSelect);
        map1.addInteraction(featureSelect);
        featureSelect.getFeatures().clear();
        featureSelect.dispatchEvent({
            type:"select",
            selected:[e["feature"]],
            deselected:[]
        });
        $(".select-toggle").bootstrapToggle("on");
        console.log(featureSelect.getFeatures().getArray());
    });
    //------------------------------------------------------------------------------------------------------------------
    //ドーム
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
            circle.transform('EPSG:4326', 'EPSG:3857');
            geometry = circle;
            return geometry;
        }
    });
    drawDome.on("drawend", function(e) {
        e["feature"]["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
    });
    //------------------------------------------------------------------------------------------------------------------
    //仁徳天皇陵
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
    //ペースト
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
    //------------------------------------------------------------------------------------------------------------------
    //トランスフォーム
    var transform = new ol.interaction.Transform ({
        translateFeature:false,
        scale:true,
        rotate:true,
        keepAspectRatio:ol.events.condition.always,
        translate:true,
        stretch:true
    });
    //------------------------------------------------------------------------------------------------------------------
    //移動
    var translate = new ol.interaction.Translate ({
        features:featureSelect.getFeatures()
    });
    translate.on("translating", function(e) {
        var extent = e["target"]["f"].getGeometry().getExtent();
        var extentCenter = ol.extent.getCenter(extent);
        drawMenuOverlay.setPosition(extentCenter);
    });
    //------------------------------------------------------------------------------------------------------------------
    //インタラクション追加
    function addInteractions() {

        drawHelpFlg = false;

        var typeVal = $("#drawType").val();
        console.log(typeVal);
        map1.removeInteraction(featureSelect);
        map1.removeInteraction(drawPoint);
        map1.removeInteraction(drawPolygon);
        map1.removeInteraction(drawPolygonFree);
        map1.removeInteraction(drawPolygonHanisuteiFree);
        map1.removeInteraction(drawhole);
        map1.removeInteraction(drawLineString);
        map1.removeInteraction(drawLineStringFree);
        map1.removeInteraction(drawCircle);
        map1.removeInteraction(drawSingleCircle);
        map1.removeInteraction(drawDoubleCircle);
        map1.removeInteraction(snap);
        map1.removeInteraction(transform);
        //map1.removeInteraction(translate);
        map1.removeInteraction(drawDome);
        map1.removeInteraction(drawNintoku);
        map1.removeInteraction(drawPaste);
        map1.removeInteraction(modify);
        switch (typeVal) {
            case "0":
                drawHelpFlg = false;
                break;
            case "Point":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "点＞シングルクリックでポイント設置";
                map1.addInteraction(drawPoint);
                map1.addInteraction(snap);//ドロー系の後でないとうまくどうさしない
                break;
            case "Polygon":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "面＞シングルクリックで描画スタート";
                map1.addInteraction(drawPolygon);
                map1.addInteraction(snap);
                break;
            case "PolygonFree":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "面フリー＞シングルクリック後にそのままドラッグ";
                map1.addInteraction(drawPolygonFree);
                map1.addInteraction(snap);
                break;
            case "DrawHole":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "穴＞面の上でシングルクリック";
                console.log("DrawHole");
                map1.addInteraction(drawhole);
                //drawhole.setActive(active);
                break;
            case "LineString":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "線＞シングルクリックで描画スタート";
                map1.addInteraction(drawLineString);
                map1.addInteraction(snap);
                break;
            case "LineStringFree":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "線フリー＞シングルクリック後にそのままドラッグ";
                map1.addInteraction(drawLineStringFree);
                map1.addInteraction(snap);
                break;
            case "Transform":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "面の上でシングルクリック。その後、□で操作";
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
            case "SingleCircle":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "シングルクリックで円の中心を設定";
                map1.addInteraction(drawSingleCircle);
                break;
            case "DoubleCircle":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "シングルクリックで二重円の中心を設定";
                map1.addInteraction(drawDoubleCircle);
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
            case "hanisitei":
                map1.addInteraction(drawPolygonHanisuteiFree);
                //map1.addInteraction(snap);
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
        $("#select-toggle-div").animate({
            "background-color":"white"
         },1000);
        drawMenuOverlay.setPosition(null);
        featureSelect.getFeatures().clear();
        var interactions = map1.getInteractions().getArray();
        var DragRotateAndZoomInteraction = interactions.filter(function(interaction) {
            return interaction instanceof ol.interaction.DragRotateAndZoom;
        })[0];
        if($(this).prop("checked")) {
            drawHelpFlg = false;
            console.log("checked");
            map1.removeInteraction(drawPoint);
            map1.removeInteraction(drawPolygon);
            map1.removeInteraction(drawPolygonFree);
            map1.removeInteraction(drawhole);
            map1.removeInteraction(drawLineString);
            map1.removeInteraction(drawLineStringFree);
            map1.removeInteraction(drawCircle);
            map1.removeInteraction(drawSingleCircle);
            map1.removeInteraction(drawDoubleCircle);
            map1.removeInteraction(snap);
            map1.removeInteraction(transform);
            map1.removeInteraction(drawDome);
            map1.removeInteraction(drawNintoku);
            map1.removeInteraction(drawPaste);
            //map1.addInteraction(translate);
            map1.addInteraction(featureSelect);
            map1.removeInteraction(modify);
            map1.addInteraction(modify);
            map1.addInteraction(snap);
            //$("#drawType").val("0");
            drawTypeMsDropDown.set("selectedIndex",0);
            DragRotateAndZoomInteraction.setActive(false);
        }else{
            console.log("off");
            map1.removeInteraction(featureSelect);
            //map1.removeInteraction(translate);
            map1.removeInteraction(modify);
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
            case "heatmap":
                funcHeatmap();
                break;
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //レイヤーをリセット
    function funcLayerReset() {
        map1.removeLayer(drawLayerHeatmap);
        map1.removeLayer(drawLayer);
        map1.addLayer(drawLayer);
        drawLayer.set("selectable",true);
        drawLayer.set("altitudeMode","clampToGround");
        drawLayer.setZIndex(9999);
    }
    //------------------------------------------------------------------------------------------------------------------
    //エフェクトをリセット
    function funcReset() {
        funcLayerReset();
        var features = drawSource.getFeatures();
        for(var i = 0; i <features.length; i++){
            var type = features[i].getProperties()["_type"];
            if(type==="voronoi" || type==="buffer") drawSource.removeFeature(features[i])
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //ヒートマップ作成
    function funcHeatmap() {
        map1.removeLayer(drawLayer);
        map1.addLayer(drawLayerHeatmap);
        drawLayerHeatmap.set("selectable",true);
        drawLayerHeatmap.set("altitudeMode","clampToGround");
        drawLayerHeatmap.setZIndex(9999);
    }
    //------------------------------------------------------------------------------------------------------------------
    //ボロノイ図作成
    function funcVoronoi() {
        funcLayerReset();
        var d3Color = d3.scale.category20();
        var mapExtent = map1.getView().calculateExtent(map1.getSize());
        mapExtent = ol.proj.transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326');
        var options = {
            bbox: mapExtent
        };
        var features = drawSource.getFeatures();
        for(var i = 0; i <features.length; i++){
            var effet = features[i].getProperties()["_type"];
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
                "_type": "voronoi"
            });
            drawSource.addFeature(newFeature);
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //バッファー作成（サークル作成） turf.js　結局turf.jsのバッファーはオプションが動作しないので同じturf.jsのcircleを使った。
    function funcBuffer(radius) {
        funcLayerReset();
        var features = drawSource.getFeatures();
        for(var i = 0; i <features.length; i++){
            var effet = features[i].getProperties()["_type"];
            if(effet==="buffer") drawSource.removeFeature(features[i])
        }
        features = drawSource.getFeatures();
        //radius = radius * 1.179832968;
        console.log(radius);
        for (var i = 0; i < features.length; i++) {
            var geomType = features[i].getGeometry().getType();
            if (geomType === "Point") {
                var point4326 = turf.point(ol.proj.transform(features[i].getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326"));
                var options = {
                    units:"meters",
                    steps: 128
                };
                var buffered = turf.circle(point4326,radius,options);
                buffered = turf.toMercator(buffered);
                var geometry = new ol.geom.Polygon(buffered["geometry"]["coordinates"]);
                var newFeature = new ol.Feature({
                    "_fillColor": "rgba(51,122,255,0.7)",
                    "_type": "buffer",
                    geometry: geometry
                });
                drawSource.addFeature(newFeature);
            }
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //バッファー作成
    function funcBufferOLD(radius) {
        var features = drawSource.getFeatures();
        for(var i = 0; i <features.length; i++){
            var effet = features[i].getProperties()["_type"];
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
                    units:"meters",
                    steps: 64
                };
                //var buffered = turf.buffer(point4326,radius,options);
                var buffered = turf.buffer(point4326,radius,options);
                console.log(buffered["geometry"]["coordinates"]);
                buffered = turf.toMercator(buffered);
                console.log(buffered["geometry"]["coordinates"]);
                var geometry = new ol.geom.Polygon(buffered["geometry"]["coordinates"]);
                var newFeature = new ol.Feature({
                    "_fillColor": "rgba(51,122,255,0.7)",
                    "_type": "buffer",
                    geometry: geometry
                });
                drawSource.addFeature(newFeature);
            }
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //バッファー作成
    function funcBufferOL3(radius) {
        var features = drawSource.getFeatures();
        for(var i = 0; i <features.length; i++){
            var effet = features[i].getProperties()["_type"];
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
                    128).transform('EPSG:4326', 'EPSG:3857');
                var newFeature = new ol.Feature(precisionCircle);
                newFeature["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
                newFeature["D"]["_type"] = "buffer";
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
        var features = featureSelect.getFeatures().getArray();
        console.log(features);
        if(!features.length){
            //alert("選択されていません。選択モードをオンにして地物をクリックしてください。");
            $.notify({//options
                message: "選択されていません。選択モードをオンにして地物をクリックしてください。"
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
                timer: 2000,
                offset:$(window).height()/2
            });
            $("#select-toggle-div").animate({
                "background-color":"#FFC0CB"
            },1000);
            return;
        }
        console.log(features[0].getProperties());

        for(var i = 0; i <features.length; i++){
            features[i].setProperties({
                "_fillColor":rgba
            });
        }
        featureSelect.getFeatures().clear();
        drawMenuOverlay.setPosition(null);
        //alert("反映しました。")
    });
    //------------------------------------------------------------------------------------------------------------------
    //属性保存
    $("body").on("click","#propSave-btn",function(){
        console.log(selectedFeature);
        var nameElements = $(".prop-input-text-name");
        var valElements = $(".prop-input-text-val");
        var features = featureSelect.getFeatures().getArray();
        console.log(features);
        if(!features.length){
            $.notify({//options
                message: "選択されていません。選択モードをオンにして地物をクリックしてください。"
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
                timer: 2000,
                offset:$(window).height()/2
            });
            $("#select-toggle-div").animate({
                "background-color":"#FFC0CB"
            },1000);
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
    //geojsonで保存
    $("body").on("click","#drawGeojson-btn",function(){
        drawSourceChangeFlg = false;
        var selectedFeatures = featureSelect.getFeatures();
        var features;
        if(selectedFeatures.getLength()===0) {
            features = drawSource.getFeatures();
        }else{
            //features = selectedFeatures["a"];
            features = selectedFeatures.getArray();
        }
        if(!features.length) {
            alert("データがありません。");
            return;
        }
        var geojsonChar = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        geojsonChar = JSON.stringify(JSON.parse(geojsonChar),null,1);
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
    //gistで保存
    $("body").on("click","#drawGist-btn",function(){
        drawSourceChangeFlg = false;
        var selectedFeatures = featureSelect.getFeatures();
        var features;
        if(selectedFeatures.getLength()===0) {
            features = drawSource.getFeatures();
        }else{
            features = selectedFeatures.getArray();
        }
        if(!features.length) {
            console.log($(window).height());
            $.notify({//options
                message: "データがありません。"
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
            return;
        }
        $("#loading-fa2").show(0);
        var geojsonChar = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        geojsonChar = JSON.stringify(JSON.parse(geojsonChar),null,1);
        var data = {
            "description": "anonymous gist",
            "public": false,
            "files": {
                "h.geojson": {
                    "content": geojsonChar
                }
            }
        };
        var xhr = new XMLHttpRequest();
        xhr.open("post", "https://api.github.com/gists", true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function(e) {
            var gistUrl = JSON.parse(e.target.response).html_url;
            console.log(gistUrl);
            $("#geojson-gist-div").remove();
            $("#mydialog-draw-dialog .dialog-content").append("<div id='geojson-gist-div' class='alert alert-danger alert-gist'><a id='geojson-gist-a' class='alert-link'><i class='fa fa-github-alt fa-fw' style='color:rgba(0,0,0,1.0);'></i> gistを開く</a></div>");
            $("#geojson-gist-a").attr({
                "href": gistUrl,
                "target":"_blank"
            });
            //$(".geojson-save-a")[0].click();//[0]が肝
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
            drawTypeMsDropDown.set("selectedIndex",0);
            addInteractions();
            $("#loading-fa2").hide(500);
        };
        xhr.send(JSON.stringify(data));
    });
    //------------------------------------------------------------------------------------------------------------------
    //csvで保存
    $("body").on("click","#drawCsv-btn",function(){
        drawSourceChangeFlg = false;
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
        console.log(features);
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
    };
    //------------------------------------------------------------------------------------------------------------------
    //gist読み込み
    var urlHash = location.hash;
    console.log(urlHash);
    var hashAr = urlHash.split("&");
    var hashObj= {};
    for(var i = 1; i <hashAr.length; i++){
        var kvAr = hashAr[i].split("=");
        hashObj[kvAr[0]]=kvAr[1]
    }
    var gist = hashObj["g"];
    console.log(gist);
    if(gist) {
        $.ajax({
            type: "get",
            url: "https://api.github.com/gists/" + gist,
            dataType: "json"
        }).done(function (json) {
            console.log(json);
            var truncated = json["files"]["h.geojson"]["truncated"];
            var gistGeojson;
            if(!truncated) {//falseのときが通常。APIで普通に取得
                gistGeojson = JSON.parse(json["files"]["h.geojson"]["content"]);
                if(gistGeojson){
                    var targetGeojson = new ol.format.GeoJSON().readFeatures(gistGeojson, {featureProjection: 'EPSG:3857'});
                    drawSource.addFeatures(targetGeojson);
                }
            }else{//trueのときは別の取得方法を
                var rawUrl = json["files"]["h.geojson"]["raw_url"];
                $.ajax({
                    type: "get",
                    url: rawUrl ,
                    dataType: "json"
                }).done(function (json) {
                    console.log(json);
                    gistGeojson = json;
                    if(gistGeojson){
                        var targetGeojson = new ol.format.GeoJSON().readFeatures(gistGeojson, {featureProjection: 'EPSG:3857'});
                        drawSource.addFeatures(targetGeojson);
                    }
                }).fail(function () {
                    console.log("失敗!");
                });
            }
        }).fail(function () {
            console.log("失敗!");
        });
    }
    //------------------------------------------------------------------------------------------------------------------
    //右クリックメニュー
    $("#map1")[0].addEventListener('contextmenu',drawContextmenu,false);
    $("body").on("mouseenter",".ol-popup,.dialog-base",function(){//contentにマウスが当たったら通常の右クリックメニュー復活。
        $("#map1")[0].removeEventListener('contextmenu',drawContextmenu,false);
    }).on("mouseleave",".ol-popup,.dialog-base",function(){//contentからマウスが抜けたら通常の右クリックメニューを無効化。
        $("#map1")[0].addEventListener('contextmenu',drawContextmenu,false);
    });
    //------------------------------------------------------------------------------------------------------------------
    //右クリック用オーバーレイ要素作成
    var drawContextmenuContent = "";
    drawContextmenuContent += "<button type='button' class='close' id='drawContextmenuOverlay-close'>&times;</button>";
    drawContextmenuContent += "<div id='drawContextmenuOverlay-content-div'>";
    drawContextmenuContent += "<div><button type='button' id='drawContextmenu-delete-btn' class='btn btn-xs btn-primary' disabled='disabled'>削除</button></div>";

    drawContextmenuContent += "<div>";
    drawContextmenuContent += "<span>色 </span>";
    drawContextmenuContent += "<select id='drawContextmenu-drawColor'>";
    drawContextmenuContent += "<option value='red'>赤</option>";
    drawContextmenuContent += "<option value='green'>緑</option>";
    drawContextmenuContent += "<option value='blue'>青</option>";
    drawContextmenuContent += "<option value='yellow'>黄</option>";
    drawContextmenuContent += "<option value='gray'>灰</option>";
    drawContextmenuContent += "<option value='silver'>銀</option>";
    drawContextmenuContent += "<option value='black'>黒</option>";
    drawContextmenuContent += "<option value='maroon'>栗色</option>";
    drawContextmenuContent += "<option value='purple'>紫</option>";
    drawContextmenuContent += "<option value='olive'>オリーブ</option>";
    drawContextmenuContent += "<option value='navy'>濃紺</option>";
    drawContextmenuContent += "<option value='teal'>青緑</option>";
    drawContextmenuContent += "<option value='fuchsia'>赤紫</option>";
    drawContextmenuContent += "<option value='lime'>ライム</option>";
    drawContextmenuContent += "<option value='aqua'>水色aqua</option>";
    drawContextmenuContent += "</select>";
    drawContextmenuContent += "</div>";
    //drawContextmenuContent += " <button type='button' id='drawContextmenu-colorSave-btn' class='btn btn-xs btn-primary'>反映</button>";

    drawContextmenuContent += "<div>";
    drawContextmenuContent += "<span>線 </span>";
    drawContextmenuContent += "<select id='drawContextmenu-drawColor-waku'>";
    drawContextmenuContent += "<option value='red'>赤</option>";
    drawContextmenuContent += "<option value='green'>緑</option>";
    drawContextmenuContent += "<option value='blue'>青</option>";
    drawContextmenuContent += "<option value='yellow'>黄</option>";
    drawContextmenuContent += "<option value='gray'>灰</option>";
    drawContextmenuContent += "<option value='silver'>銀</option>";
    drawContextmenuContent += "<option value='black'>黒</option>";
    drawContextmenuContent += "<option value='maroon'>栗色</option>";
    drawContextmenuContent += "<option value='purple'>紫</option>";
    drawContextmenuContent += "<option value='olive'>オリーブ</option>";
    drawContextmenuContent += "<option value='navy'>濃紺</option>";
    drawContextmenuContent += "<option value='teal'>青緑</option>";
    drawContextmenuContent += "<option value='fuchsia'>赤紫</option>";
    drawContextmenuContent += "<option value='lime'>ライム</option>";
    drawContextmenuContent += "<option value='aqua'>水色aqua</option>";
    drawContextmenuContent += "</select>";
    drawContextmenuContent += "<span>幅 </span>";
    drawContextmenuContent += "<select id='drawContextmenu-drawColor-haba'>";
    drawContextmenuContent += "<option value='1'>1px</option>";
    drawContextmenuContent += "<option value='3'>3px</option>";
    drawContextmenuContent += "<option value='5'>5px</option>";
    drawContextmenuContent += "<option value='10'>10px</option>";
    drawContextmenuContent += "<option value='15'>15px</option>";
    drawContextmenuContent += "<option value='25'>25px</option>";
    drawContextmenuContent += "<option value='40'>40px</option>";
    drawContextmenuContent += "<option value='60'>60px</option>";
    drawContextmenuContent += "</select>";
    drawContextmenuContent += "</div>";


    
    drawContextmenuContent += "</div>";

    //drawContextmenuContent += "<div>テスト中</div>";
    $("#map1").append('<div id="drawContextmenuOverlay-div" class="drawContextmenuOverlay-div">' + drawContextmenuContent + '</div>');
    var drawContextmenuDrawColorDD = $("#drawContextmenu-drawColor").msDropDown().data("dd");
    var drawContextmenuDrawColorWakuDD = $("#drawContextmenu-drawColor-waku").msDropDown().data("dd");
    var drawContextmenuDrawColorHabaDD = $("#drawContextmenu-drawColor-haba").msDropDown().data("dd");
    drawContextmenuDrawColorDD.set("disabled",true);
    drawContextmenuDrawColorWakuDD.set("disabled",true);
    drawContextmenuDrawColorHabaDD.set("disabled",true);
    //------------------------------------------------------------------------------------------------------------------
    //右クリック用オーバーレイをマップに設定
    var drawContextmenuOverlay = new ol.Overlay({
        element:$("#drawContextmenuOverlay-div")[0],
        autoPan:false,
        offset:[0,0]//横、縦
    });
    map1.addOverlay(drawContextmenuOverlay);
    //------------------------------------------------------------------------------------------------------------------
    //右クリック時の動作
    var rightClickedFatyure = null;
    function drawContextmenu(evt){
        evt.preventDefault();
        if(drawPolygon.nbpts>1 || drawLineString.nbpts>1) {
            drawPolygon.removeLastPoint();
            drawLineString.removeLastPoint();
            return;
        }

        if($("#mydialog-draw-dialog").css("display")!=="block") return;
        var top = evt.clientY;
        var left = evt.clientX;
        coord1 = map1.getCoordinateFromPixel([left,top]);
        //evt.preventDefault();
        drawContextmenuOverlay.setPosition(coord1);
        var pixel = [left,top];
        var features = [];
        var layers = [];
        map1.forEachFeatureAtPixel(pixel,function(feature,layer){
            //features.push(feature);
            //layers.push(layer);
            if(layer){
                var layerName = layer.getProperties()["name"];
                if(layerName==="drawLayer"){
                    features.push(feature);
                    layers.push(layer);
                }
            }
        });
        var feature = features[features.length-1];
        console.log(feature);
        if(feature) {
            console.log("drawLayerの上");
            map1.addInteraction(featureSelect);
            drawTypeMsDropDown.set("selectedIndex", 0);
            addInteractions();
            $(".select-toggle").bootstrapToggle("on");
            featureSelect.getFeatures().push(feature);
            rightClickedFatyure = feature;
            //featureSelect.dispatchEvent("select");
            console.log($("#drawContextmenu-delete-btn").attr("class"));
            $("#drawContextmenu-delete-btn").prop("disabled", false);
            drawContextmenuDrawColorDD.set("disabled",false);
            drawContextmenuDrawColorWakuDD.set("disabled",false);
            drawContextmenuDrawColorHabaDD.set("disabled",false);
        }else{
            $("#drawContextmenu-delete-btn").prop("disabled",true);
            drawContextmenuDrawColorDD.set("disabled",true);
            drawContextmenuDrawColorWakuDD.set("disabled",true);
            drawContextmenuDrawColorHabaDD.set("disabled",true);
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //右クリックオーバーレイをクローズ
    $("#drawContextmenuOverlay-close").click(function(){
        //featureSelect.getFeatures().clear();
        drawContextmenuOverlay.setPosition(null);
    });
    //------------------------------------------------------------------------------------------------------------------
    //右クリック　ドロー　リセット
    $("#draw-reset-btn").click(function(){
        //$("#drawType").val("0");
        drawTypeMsDropDown.set("selectedIndex",0);
        addInteractions();
        $(".select-toggle").bootstrapToggle("on");
        drawContextmenuOverlay.setPosition(null);
    });
    //------------------------------------------------------------------------------------------------------------------
    //右クリック　ドロー　削除
    $("#drawContextmenu-delete-btn").click(function(){
        console.log("セレクトインタラクション");
        if(confirm("削除しますか？")) {
            drawSource.removeFeature(rightClickedFatyure);
            rightClickedFatyure = null;
            featureSelect.getFeatures().clear();
            drawContextmenuOverlay.setPosition(null);
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //右クリック　色　変更
    $("body").on("change","#drawContextmenu-drawColor",function(){
        var colorVal = $(this).val();
        var rgb = d3.rgb(colorVal);
        var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)";
        rightClickedFatyure.setProperties({
            "_fillColor":rgba
        });
    });
    //------------------------------------------------------------------------------------------------------------------
    //右クリック　枠色　変更
    $("body").on("change","#drawContextmenu-drawColor-waku",function(){
        var colorVal = $(this).val();
        var rgb = d3.rgb(colorVal);
        var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.8)";
        rightClickedFatyure.setProperties({
            "_color":rgba
        });
    });
    //------------------------------------------------------------------------------------------------------------------
    //右クリック　幅　変更
    $("body").on("change","#drawContextmenu-drawColor-haba",function(){
        var val = $(this).val();
        console.log(val);
        rightClickedFatyure.setProperties({
            "_weight":val
        });
    });
});

