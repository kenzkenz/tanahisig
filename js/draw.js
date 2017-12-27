var drawLayer = null;
var drawContextmenuOverlay = null;
$(function() {
    var rightClickedFeatyure = null;
    var drawHelpFlg = false;
    var theGlyph = null;//アイコン用
    var drawCancelFlg = false;//ドローキャンセル用
    var modify = null;//モディファイ用。その都度作る必要があるため
    //------------------------------------------------------------------------------------------------------------------
    //キーボード操作　キーダウン時　ctrl+zで戻す　同時押しはこちらに描く
    $(window).keydown(function(e){
        if(event.ctrlKey){
            if(e.keyCode === 90){//z
                if(drawPolygon.nbpts>1 || drawLineString.nbpts>1) {
                    drawPolygon.removeLastPoint();
                    drawLineString.removeLastPoint();
                }
                return false;
            }
            if(e.keyCode === 89){//y
                //ctrl+yの処理はこっち。今は使っていない。
                return false;
            }
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //
    $(".draw-btn").click(function(){
        console.log(222222222222222222)
        //drawDialogCreate()
    });
    //------------------------------------------------------------------------------------------------------------------
    //★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    //右クリックメニュー
    $("#map1")[0].addEventListener('contextmenu',drawContextmenu,false);
    $("body").on("mouseenter",".ol-popup,.dialog-base,input",function(){//contentにマウスが当たったら通常の右クリックメニュー復活。
        $("#map1")[0].removeEventListener('contextmenu',drawContextmenu,false);
    }).on("mouseleave",".ol-popup,.dialog-base,input",function(){//contentからマウスが抜けたら通常の右クリックメニューを無効化。
        $("#map1")[0].addEventListener('contextmenu',drawContextmenu,false);
    });
    //★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    //------------------------------------------------------------------------------------------------------------------
    //右クリック用オーバーレイ要素作成
    var menuContent = "";
    menuContent += "<button type='button' class='close' id='drawContextmenuOverlay-close'>&times;</button>";

    menuContent += "<div id='drawContextmenuOverlay-content-div'>";
    menuContent += "<div id='first-div'>";

    menuContent += "<div id='drawContextmenu-msg-div'></div>";
    //
    menuContent += "<div id='drawContextmenu-step1-div'>";
    //menuContent += "選択：";
    menuContent += "<select id='drawType2'>";
    menuContent += "<option value='0' selected>選択してください　　</option>";
    menuContent += "<option value='1' >描画終了</option>";
    menuContent += "<option value='Point'>点</option>";
    menuContent += "<option value='LineString'>線</option>";
    menuContent += "<option value='Polygon'>面</option>";
    menuContent += "<option value='DrawHole'>面に穴を開ける</option>";
    menuContent += "<option value='hanisitei'>範囲指定</option>";
    menuContent += "</select>";
    menuContent += "<hr class='my-hr'>";
    menuContent += "</div>";
    //色、線、アイコン等
    menuContent += "<div id='drawContextmenu-drawColor-div'>";
    //menuContent += "step2<br>";
    menuContent += " <span class='color-span' id='fillcolor-color-span'>　色　</span> ";
    menuContent += "<select id='drawContextmenu-drawColor'>";
    menuContent += "<option value=''></option>";
    menuContent += "<option value='rgb(255,0,0)'>赤</option>";
    menuContent += "<option value='rgb(0,128,0)'>緑</option>";
    menuContent += "<option value='rgb(0,0,255)'>青</option>";
    menuContent += "<option value='rgb(255,255,0)'>黄</option>";
    menuContent += "<option value='rgb(128,128,128)'>灰</option>";
    menuContent += "<option value='rgb(192,192,192)'>銀</option>";
    menuContent += "<option value='rgb(0,0,0)'>黒</option>";
    menuContent += "<option value='rgb(128,0,0)'>栗色</option>";
    menuContent += "<option value='rgb(128,0,128)'>紫</option>";
    menuContent += "<option value='rgb(128,128,0)'>オリーブ</option>";
    menuContent += "<option value='rgb(0,0,128)'>濃紺</option>";
    menuContent += "<option value='rgb(0,128,128)'>青緑</option>";
    menuContent += "<option value='rgb(255,0,255)'>赤紫</option>";
    menuContent += "<option value='rgb(0,255,0)'>ライム</option>";
    menuContent += "<option value='rgb(0,255,255)'>水色</option>";
    menuContent += "</select>";

    menuContent += "<span id='currentIcon'></span>";
    menuContent += " <button type='button' id='drawContextmenu-icon-btn' class='btn btn-xs btn-primary'>icon</button>";
    menuContent += "<hr class='my-hr' id='my-hr-point'>";

    menuContent += "</div>";
    //menuContent += " <button type='button' id='drawContextmenu-colorSave-btn' class='btn btn-xs btn-primary'>反映</button>";
    menuContent += "<div id='drawContextmenu-drawColor-waku-div'>";
    menuContent += " <span class='color-span' id='color-color-span'>　線　</span> ";
    menuContent += "<select id='drawContextmenu-drawColor-waku'>";
    menuContent += "<option value=''></option>";
    menuContent += "<option value='rgb(255,0,0)'>赤</option>";
    menuContent += "<option value='rgb(0,128,0)'>緑</option>";
    menuContent += "<option value='rgb(0,0,255)'>青</option>";
    menuContent += "<option value='rgb(255,255,0)'>黄</option>";
    menuContent += "<option value='rgb(128,128,128)'>灰</option>";
    menuContent += "<option value='rgb(192,192,192)'>銀</option>";
    menuContent += "<option value='rgb(0,0,0)'>黒</option>";
    menuContent += "<option value='rgb(128,0,0)'>栗色</option>";
    menuContent += "<option value='rgb(128,0,128)'>紫</option>";
    menuContent += "<option value='rgb(128,128,0)'>オリーブ</option>";
    menuContent += "<option value='rgb(0,0,128)'>濃紺</option>";
    menuContent += "<option value='rgb(0,128,128)'>青緑</option>";
    menuContent += "<option value='rgb(255,0,255)'>赤紫</option>";
    menuContent += "<option value='rgb(0,255,0)'>ライム</option>";
    menuContent += "<option value='rgb(0,255,255)'>水色</option>";
    menuContent += "</select>";
    menuContent += "<span> 幅 </span>";
    menuContent += "<select id='drawContextmenu-drawColor-haba'>";
    menuContent += "<option value='1'>1px</option>";
    menuContent += "<option value='3'>3px</option>";
    menuContent += "<option value='5'>5px</option>";
    menuContent += "<option value='10'>10px</option>";
    menuContent += "<option value='15'>15px</option>";
    menuContent += "<option value='25'>25px</option>";
    menuContent += "<option value='40'>40px</option>";
    menuContent += "<option value='60'>60px　</option>";
    menuContent += "</select>";
    menuContent += "<div id='drawContextmenu-height-div'>";
    menuContent += "<hr class='my-hr'>";
    menuContent += "高さ<input type='text' id='height-input-text'>m ←任意";
    menuContent += "</div>";
    menuContent += "<hr class='my-hr'>";
    menuContent += "</div>";
    //円の半径
    menuContent += "<div id='drawContextmenu-drawCircle-div'>";
    menuContent += "半径<input id='circle-radius1-input' type='text' value='100'>m　";
    menuContent += "半径<input id='circle-radius2-input' type='text' value='50'>m";
    menuContent += "<hr class='my-hr'>";
    menuContent += "</div>";

    menuContent += "</div>";//first-divここまで

    menuContent += "<div id='second-div'>";
    menuContent += "<div id='second-div-msg-div'>属性を記入します。</div>";
    menuContent += "<div id='prop-div'>";
    menuContent += "<table id='propTable' class='table table-bordered table-hover'>";
    menuContent += "<tr><th class='prop-th-num'></th><th class='prop-th0'>項目名</th><th class='prop-th1'></th></tr>";
    menuContent += "<tr><td class='prop-td-num'>1</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "<tr><td class='prop-td-num'>2</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "<tr><td class='prop-td-num'>3</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "<tr><td class='prop-td-num'>4</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "<tr><td class='prop-td-num'>5</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "<tr><td class='prop-td-num'>6</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "<tr><td class='prop-td-num'>7</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "<tr><td class='prop-td-num'>8</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "<tr><td class='prop-td-num'>9</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "<tr><td class='prop-td-num'>10</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menuContent += "</table>";
    menuContent += "</div>";
    menuContent += "<hr class='my-hr'>";
    menuContent += "</div>";//second-divここまで

    //削除ボタン等
    menuContent += "<button type='button' id='drawContextmenu-delete-btn' class='btn btn-xxs btn-primary'><span data-toggle='tooltip' data-placement='bottom' title='一つだけ削除します。'>削除</span></button>";
    menuContent += "<button type='button' id='drawContextmenu-deleteall-btn' class='btn btn-xxs btn-primary'><span data-toggle='tooltip' data-placement='bottom' title='全て削除します。要注意！'>全削除</span></button>";
    menuContent += "<button type='button' id='drawContextmenu-copy-btn' class='btn btn-xxs btn-primary'><span data-toggle='tooltip' data-placement='bottom' title='選択物をコピーします。'>コピー</span></button>";
    //menuContent += "<button type='button' id='drawContextmenu-paste-btn' class='btn btn-xs btn-primary'>ペースト</button>";
    menuContent += "<button type='button' id='drawContextmenu-prop-btn' class='btn btn-xxs btn-danger'><span data-toggle='tooltip' data-placement='bottom' title='名称等を設定します。'>属性</span></button>";

    menuContent += "<div class='dropdown-div' id='drawContextmenu-save-div'>";
    menuContent += "<button id='drawContextmenu-save-btn' class='btn btn-xxs btn-primary dropdown-toggle' type='button' data-toggle='dropdown'>保存<span class='caret'></span></button>";
    menuContent += "<ul id='drawContextmenu-save-ul' class='dropdown-menu'>";
    menuContent += "<li><a>geojson</a></li>";
    menuContent += "<li><a>csv</a></li>";
    menuContent += "<li><a>gist</a></li>";
    menuContent += "</ul>";
    menuContent += "</div>";

    menuContent += "<button type='button' id='drawContextmenu-measure-btn' class='btn btn-xxs btn-default'><span data-toggle='tooltip' data-placement='bottom' title=''>計測</span></button>";


    //menuContent += "<br>計測：";
    //menuContent += "<input type='checkbox' data-toggle='toggle' id='measure-toggle' class='bs-toggle' data-size='mini'>";

    menuContent += "</div>";//最後のdiv

    //menuContent += "<div>テスト中</div>";
    $("#map1").append('<div id="drawContextmenuOverlay-div" class="drawContextmenuOverlay-div">' + menuContent + '</div>');
    $('[data-toggle="tooltip"]').tooltip();
    $(".bs-toggle").bootstrapToggle();
    var drawContextmenuDrawColorDD = $("#drawContextmenu-drawColor").msDropDown().data("dd");
    var drawContextmenuDrawColorWakuDD = $("#drawContextmenu-drawColor-waku").msDropDown().data("dd");
    var drawContextmenuDrawColorHabaDD = $("#drawContextmenu-drawColor-haba").msDropDown().data("dd");
    var drawTypeMsDropDown2 = $("#drawType2").msDropDown().data("dd");
    drawContextmenuDrawColorDD.set("disabled",true);
    drawContextmenuDrawColorWakuDD.set("disabled",true);
    drawContextmenuDrawColorHabaDD.set("disabled",true);
    //------------------------------------------------------------------------------------------------------------------
    //右クリック用オーバーレイをマップに設定
    drawContextmenuOverlay = new ol.Overlay({
        element:$("#drawContextmenuOverlay-div")[0],
        autoPan:true,
        autoPanAnimation:{duration:200},
        offset:[0,0]//横、縦
    });
    map1.addOverlay(drawContextmenuOverlay);
    //------------------------------------------------------------------------------------------------------------------
    //⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
    // 右クリック時の動作
    function drawContextmenu(evt){
        evt.preventDefault();
        rightClickedFeatyure = null;
        //人口５００メッシュと共存するときは下記を復活
        //if($("#mydialog-draw-dialog").css("display")!=="block") return;
        var top = evt.clientY;
        var left = evt.clientX;
        var coord = map1.getCoordinateFromPixel([left, top]);
        var pixel = [left, top];
        var features = [];
        var layers = [];
        map1.forEachFeatureAtPixel(pixel,function(feature,layer){
            if(layer){
                var layerName = layer.getProperties()["name"];
                if(layerName==="drawLayer"){
                    features.push(feature);
                    layers.push(layer);
                }
            }
        });
        var feature,pointFeature,lineStringFeature,otherFeature;
        for(var i = 0; i <features.length; i++){
            var geomType = features[i].getGeometry().getType();
            switch (geomType) {
                case "Point":
                    pointFeature = features[i];
                    break;
                case "LineString":
                    lineStringFeature = features[i];
                    break;
                default:
                    otherFeature = features[i]
            }
        }
        if(pointFeature) {
            feature = pointFeature;
        }else if(lineStringFeature) {
            feature = lineStringFeature;
        }else{
            feature = otherFeature;
        }
        drawContextmenuOverlay.setPosition(coord);
        drawContextmenuCreate(feature);
    }
    //------------------------------------------------------------------------------------------------------------------
    //★★★メニュー項目　調整★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    //var prevMsddIndex;
    function drawContextmenuCreate(feature){
        console.log(feature);
        //最初に全て隠す
        $("#drawContextmenu-step1-div").hide();
        $("#drawContextmenu-drawColor-div").hide();
        $("#drawContextmenu-drawColor-waku-div").hide();
        $("#drawContextmenu-icon-btn").hide();
        $("#currentIcon").hide();
        $("#drawContextmenu-drawCircle-div").hide();
        $("#drawContextmenu-height-div").hide();$("#drawContextmenu-delete-btn").prop("disabled","disabled");
        $("#drawContextmenu-copy-btn").prop("disabled","disabled");
        $("#drawContextmenu-prop-btn").prop("disabled","disabled");
        //$("#drawContextmenu-paste-btn").prop("disabled","disabled");

        $(".prop-input-text-name").val("");
        $(".prop-input-text-val").val("");

        if(feature) {//地物があるとき
            //地物を選択地物としてセット--------------------------
            rightClickedFeatyure = feature;
            console.log(rightClickedFeatyure);
            drawLayer.getSource().changed();
            //モディファイインタラクション------------------------
            map1.removeInteraction(modify);
            modify = new ol.interaction.Modify({
                features:new ol.Collection([rightClickedFeatyure]),
                deleteCondition:ol.events.condition.singleClick//頂点の削除をシングルクリックのみでできるようにしたｓ
            });
            map1.addInteraction(modify);
            //------------------------------------------------
            var prop,geomType;
            if(!Array.isArray(feature)) {//配列でないとき　つまり一つだけ選択しているとき
                prop = feature.getProperties();
                geomType = feature.getGeometry().getType();
                var type = prop["_type"];
                console.log(type);
                //色--------------------------------
                var fillColor = prop["_fillColor"];
                var rgb;
                console.log(fillColor);
                if(fillColor) {
                    rgb = rgba2rgb(fillColor);
                    drawContextmenuDrawColorDD.setIndexByValue(rgb);
                    $("#fillcolor-color-span").css({
                        "background": rgb,
                        "border":"1px solid " + rgb,
                        "color": funcTextColor(rgb.r, rgb.g, rgb.b)
                    });
                }
                //線の色--------------------------------
                var color = prop["_color"];
                if(color){
                    rgb = rgba2rgb(color);
                    drawContextmenuDrawColorWakuDD.setIndexByValue(rgb);
                }
                $("#color-color-span").css({
                    "background":rgb,
                    "border":"1px solid " + rgb,
                    "color":funcTextColor(rgb.r,rgb.g,rgb.b)
                });
                //線の幅--------------------------------
                var weight = String(prop["_weight"]);
                if(weight) drawContextmenuDrawColorHabaDD.setIndexByValue(weight);
                //３D時高さ--------------------------------
                var height = prop["_polygonHeight"];
                if(height) {
                    $("#height-input-text").val(height);
                }else{
                    $("#height-input-text").val(null);
                }
                //円--------------------------------
                if(type==="circle") {
                    var tRadius = funcTRadius(feature);
                    var tRadiusNum1, tRadiusNum2;
                    switch (geomType) {
                        case "Polygon":
                            if (tRadius.indexOf("km") !== -1) {
                                tRadiusNum1 = Number(tRadius.replace("km", "")) * 1000;
                            } else {
                                tRadiusNum1 = Number(tRadius.replace("m", ""));
                            }
                            $("#circle-radius1-input").val(tRadiusNum1);
                            $("#circle-radius2-input").val(null);
                            break;
                        case "MultiPolygon":
                            var tRadiusAr = funcTRadius(feature);
                            if (tRadiusAr[0].indexOf("km") !== -1) {
                                tRadiusNum1 = Number(tRadiusAr[0].replace("km", "")) * 1000;
                                tRadiusNum2 = Number(tRadiusAr[1].replace("km", "")) * 1000;
                            } else {
                                tRadiusNum1 = Number(tRadiusAr[0].replace("m", ""));
                                tRadiusNum2 = Number(tRadiusAr[1].replace("m", ""));
                            }
                            $("#circle-radius1-input").val(tRadiusNum1);
                            $("#circle-radius2-input").val(tRadiusNum2);
                            break;
                        default:
                    }
                }else{
                    $("#circle-radius1-input").val(null);
                    $("#circle-radius2-input").val(null);
                }
                //属性---------------------------------------------------

                var i = 0;
                for(key in prop){
                    if(key!=="geometry" && key.substr(0,1)!=="_" && key!=="経度" && key!=="緯度" && key!=="経度old" && key!=="緯度old" && key!=="移動"){
                        console.log(key);
                        $(".prop-input-text-name").eq(i).val(key);
                        $(".prop-input-text-val").eq(i).val(prop[key]);
                        i++
                    }
                }

                //--------------------------------
                switch (geomType) {
                    case "Point":
                        $("#drawContextmenu-msg-div").html("(点)色を変えます。iconで形状変更します。");
                        var pointCoord = feature.getGeometry().getCoordinates();
                        drawContextmenuOverlay.setPosition(pointCoord);
                        drawContextmenuOverlay.setOffset([10, 10]);
                        $("#drawContextmenu-drawColor-div").show();
                        $("#drawContextmenu-icon-btn").show();
                        $("#currentIcon").show();
                        $("#drawContextmenu-prop-btn").prop("disabled",false);
                        break;
                    case "MultiPolygon":
                    case "Polygon":
                        $("#drawContextmenu-msg-div").html("(面)色を変えます。高さ設定→3Dで・・");
                        $("#drawContextmenu-drawColor-div").show();
                        $("#drawContextmenu-drawColor-waku-div").show();
                        if(type==="circle") $("#drawContextmenu-drawCircle-div").show();
                        $("#drawContextmenu-height-div").show();
                        $("#drawContextmenu-prop-btn").prop("disabled",false);
                        break;
                    case "LineString":
                        $("#drawContextmenu-msg-div").html("線の色と幅を変えます。");
                        $("#drawContextmenu-drawColor-waku-div").show();
                        $("#drawContextmenu-prop-btn").prop("disabled",false);
                        break;
                    default:
                }
                console.log("drawLayerの上");
                //addInteractions();

                //--------------------------------------------------------
                $("#drawContextmenu-delete-btn").prop("disabled", false);
                $("#drawContextmenu-copy-btn").prop("disabled",false);
                drawContextmenuDrawColorDD.set("disabled", false);
                drawContextmenuDrawColorWakuDD.set("disabled", false);
                drawContextmenuDrawColorHabaDD.set("disabled", false);
                //最後に移動を可視化
                /*
                transform2.select(feature);
                transform2.setVisible(true);
                */
            }else{//配列のとき　つまり複数選択の時
                console.log("配列");
                $("#drawContextmenu-msg-div").html("複数選択。まとめて変更します。");
                $("#drawContextmenu-drawColor-div").show();
                $("#drawContextmenu-drawColor-waku-div").show();
                $("#drawContextmenu-icon-btn").show();
                $("#currentIcon").show();
                $("#drawContextmenu-height-div").show();
                $("#drawContextmenu-delete-btn").prop("disabled",false);
                drawContextmenuDrawColorDD.set("disabled",false);
                drawContextmenuDrawColorWakuDD.set("disabled",false);
                drawContextmenuDrawColorHabaDD.set("disabled",false);
            }
        }else{//最初又は地物なしのとき
            console.log("最初または地物なしのとき");
            map1.removeInteraction(modify);
            rightClickedFeatyure = null;
            drawLayer.getSource().changed();

            $("#drawContextmenu-msg-div").html("点、面、線等を作ります。");
            $("#drawContextmenu-step1-div").show();
            drawContextmenuDrawColorDD.set("disabled",true);
            drawContextmenuDrawColorWakuDD.set("disabled",true);
            drawContextmenuDrawColorHabaDD.set("disabled",true);
            $("#second-div").hide();
            $("#first-div").show();

        }
    }
    //★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    //------------------------------------------------------------------------------------------------------------------
    //各レイヤー設定
    //ドロー用（通常）のソース、レイヤーを設置
    //drawSource = new ol.source.Vector();
    drawLayer = new ol.layer.Vector({
        source:new ol.source.Vector(),
        name:"drawLayer",
        renderOrder: ol.ordering.yOrdering(),
        style:drawStyleFunction()
    });
    map1.addLayer(drawLayer);
    drawLayer.set("selectable",true);
    drawLayer.set("altitudeMode","clampToGround");
    drawLayer.setZIndex(9999);
    //------------------------------------------------------------------------------------------------------------------
    //★★★★ソースに地物が追加されたときの処理 今の所同じ座標にポイントを打とうとしたときだけに使っている。
    drawLayer.getSource().on("addfeature", function(e) {
        var feature = e["feature"];
        if(drawCancelFlg){
            drawLayer.getSource().removeFeature(feature);
        }
        drawCancelFlg = false;
    });
    //------------------------------------------------------------------------------------------------------------------
    //スタイルファンクション-----------------------------------------------------------------------------------------------
    //基本のスタイルファンクションはここに書く。ドロー専用は別の場所に
    //ポイント用のスタイル
    function pointStyle(feature,resolution,selected) {
        var prop = feature.getProperties();
        var fillColor = prop["_fillColor"];
        if(!fillColor) fillColor = "rgba(0,122,255,0.7)";
        var icon = prop["_icon"];
        var text = prop["ラベル"];
        var style = [];
        if (icon) {
            if(!selected) {
                style.push(
                    new ol.style.Style({
                        image: new ol.style.FontSymbol({
                            form: "",
                            gradient: true,
                            glyph: icon,
                            fontSize: 1,
                            radius: 16,
                            //offsetX: -15,
                            rotation: 0 * Math.PI / 180,
                            rotateWithView: true,
                            offsetY: 0,
                            color: fillColor ? fillColor : "orange",
                            fill: new ol.style.Fill({
                                color: "black"
                            }),
                            stroke: new ol.style.Stroke({
                                color: "white",
                                width: 1
                            })
                        }),
                        stroke: new ol.style.Stroke({
                            width: 2,
                            color: '#f80'
                        }),
                        fill: new ol.style.Fill({
                            color: [255, 136, 0, 0.6]
                        }),
                        zIndex:2
                    })
                );
            }else{//選択しているとき
                style.push(
                    new ol.style.Style({
                        image: new ol.style.FontSymbol({
                            form: "",
                            gradient: true,
                            glyph: icon,
                            fontSize: 1,
                            radius:16,
                            rotation: 0 * Math.PI / 180,
                            rotateWithView: true,
                            offsetY: 0,
                            color: fillColor,
                            fill: new ol.style.Fill({
                                color: "black"
                            }),
                            stroke: new ol.style.Stroke({
                                color: "red",
                                width: 3
                            })
                        }),
                        stroke: new ol.style.Stroke({
                            width: 2,
                            color: '#f80'
                        }),
                        fill: new ol.style.Fill({
                            color: [255, 136, 0, 0.6]
                        }),
                        zIndex:2
                    })
                );
            }
        } else {//iconでない通常のとき
            var color,width;
            if(feature===rightClickedFeatyure) {
                color = "red";
                width = 3;
            }else{
                color = "white";
                width = 1;
            }
            style.push(
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
                        fill: new ol.style.Fill({
                            color: fillColor
                        }),
                        stroke: new ol.style.Stroke({
                            color: color, width: width
                        }),
                        zIndex:2
                    }),
                    text: new ol.style.Text({
                        font: "8px sans-serif",
                        text: text,
                        offsetY:10,
                        stroke: new ol.style.Stroke({
                            color: "white",
                            width: 3
                        })
                    })
                })
            )
        }
        return style;
    }
    //------------------------------------------------------------------------------------------------------------------
    //スタイルファンクション本体
    function drawStyleFunction() {
        return function(feature, resolution) {
            var prop = feature.getProperties();
            var geoType = feature.getGeometry().getType();
            var fillColor = prop["_fillColor"];
            if (!fillColor) fillColor = "rgba(0,122,255,0.7)";
            var strokeColor = prop["_color"];
            var strokeWidth = prop["_weight"];
            var type = prop["_type"];
            //--------------------------------------------------------------------
            switch (geoType) {
                //線（ライン）
                case "LineString":
                    var tDistance = funcTDistance(feature);
                    if(feature!==rightClickedFeatyure) {
                        var style = [
                            new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: strokeColor,
                                    width: strokeWidth
                                }),
                                zIndex: 0
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
                                    angle: 45
                                }),
                                text: new ol.style.Text({
                                    font: "10px sans-serif",
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
                                zIndex: 1,
                                geometry: function (feature) {
                                    var lastCoord = feature.getGeometry().getLastCoordinate();
                                    return new ol.geom.Point(lastCoord)
                                }
                            })
                        ];
                    }else{//選択しているとき
                        var style = [
                            new ol.style.Style({
                                fill: new ol.style.Fill({
                                    color: fillColor
                                }),
                                stroke: new ol.style.Stroke({
                                    color: strokeColor,
                                    width: strokeWidth
                                }),
                                text: new ol.style.Text({
                                    font: "10px sans-serif",
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
                                    angle: 45
                                }),
                                geometry: function (feature) {
                                    var coord = feature.getGeometry().getCoordinates();
                                    return new ol.geom.MultiPoint(coord)
                                }
                            })
                        ];
                    }
                    break;
                //-----------------------------------------------------------------
                //点（ポイント）
                case "Point":
                    var selected = false;
                    var style = pointStyle(feature, resolution,selected);
                    break;
                //-----------------------------------------------------------------
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
                                    var lastCoord = feature.getGeometry().getLastCoordinate();
                                    var returnGeom = new ol.geom.Point(lastCoord);//テキスト用ジオメトリー
                                    break;
                                case "MultiPolygon":
                                    text = "半径" + tRadius[0];
                                    text2 = "半径" + tRadius[1];
                                    var lastCoord = feature.getGeometry().getCoordinates()[0][0][0];
                                    var lastCoord2 = feature.getGeometry().getCoordinates()[1][0][0];
                                    var returnGeom = new ol.geom.Point(lastCoord);//テキスト用ジオメトリー
                                    var returnGeom2 = new ol.geom.Point(lastCoord2);//テキスト用ジオメトリー
                                    break;
                            }
                            break;
                        default:
                            var tArea = funcTArea(feature);
                            var tDistance = funcTDistance(feature);
                            if (tDistance) {
                                text = "面積\n" + tArea + "\n周長" + tDistance;
                            } else {
                                if (tArea) {
                                    text = "面積\n" + tArea;
                                } else {
                                    text = "";
                                }
                            }
                            var returnGeom = feature.getGeometry();//テキスト用ジオメトリー
                    }
                    //switchここまで
                    if(feature!==rightClickedFeatyure) {
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
                                    font: "10px sans-serif",
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
                                    font: "10px sans-serif",
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
                    }else{//選択しているとき
                        var style = [
                            new ol.style.Style({
                                fill: new ol.style.Fill({
                                    color: fillColor
                                }),
                                stroke: new ol.style.Stroke({
                                    color: strokeColor,
                                    width: strokeWidth
                                }),
                                zIndex: 0
                            }),
                            new ol.style.Style({//頂点の六角形
                                image: new ol.style.RegularShape({
                                    fill: new ol.style.Fill({
                                        color: "white"
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: "navy",
                                        width: 1
                                    }),
                                    points: 6,
                                    radius: 6,
                                    angle: 45
                                }),
                                geometry: function (feature) {
                                    var coord = feature.getGeometry().getCoordinates()[0];
                                    return new ol.geom.MultiPoint(coord);//ノード用ジオメトリー
                                }
                            })
                        ];
                    }
                    break;
                default:
            }
            return style;
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //各種計測
    //------------------------------------------------------------------------------------------------------------------
    //線の長さを計算
    function funcTDistance(feature){
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
    }
    //------------------------------------------------------------------------------------------------------------------
    //地物の面積を計算
    function funcTArea(feature){
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
    }
    //------------------------------------------------------------------------------------------------------------------
    //各インタラクション
    //ドロー専用のスタイルファンクションもここに書く
    //------------------------------------------------------------------------------------------------------------------
    //共通的なインタラクション　スナップとモディファイ　セレクトは今の所使用していない。
    //------------------------------------------------------------------------------------------------------------------
    //スナップ　各ドローの後にaddする必要がある。
    var snap = new ol.interaction.Snap({source:drawLayer.getSource()});
    //------------------------------------------------------------------------------------------------------------------
    //モディファイ のインタラクションはファンクション「drawContextmenuCreate」の中にある
    //------------------------------------------------------------------------------------------------------------------
    //ここから専用ドロー
    //ポイント関係ここから
    var drawPoint = new ol.interaction.Draw({
        source:drawLayer.getSource(),
        type:"Point",
        condition:function(e){
            var mouseButton = e["originalEvent"]["button"];
            if(mouseButton===0){//0が左クリック。2が右クリック。
                return ol.events.condition.singleClick
            }
        },
        style:pointStyleFunc()
    });
    //ポイントのドローエンド
    drawPoint.on("drawend", function(e) {
        var feature = e["feature"];
        var coord = feature.getGeometry().getCoordinates();
        var pixel = map1.getPixelFromCoordinate(coord);
        var features = [];
        var layers = [];
        map1.forEachFeatureAtPixel(pixel,function(feature,layer){
            if(layer){
                var layerName = layer.getProperties()["name"];
                if(layerName==="drawLayer"){
                    features.push(feature);
                    layers.push(layer);
                }
            }
        });
        for(var i = 0; i <features.length; i++){
            var geomType = features[i].getGeometry().getType();
            if(geomType==="Point"){
                drawCancelFlg = true;
                alert("同じ座標に点を設置することはできません。");
                return;
            }
        }
        //var prop = feature.getProperties();
        var prop = feature["D"];
        var colorVal = $("#drawContextmenu-drawColor").val();
        if(colorVal) {
            prop["_fillColor"] = colorVal;
        }else{
            prop["_fillColor"] = "rgb(51,122,183)";
        }
        prop["_icon"] = theGlyph;
    });
    //-----------------------------------------------------------------------------
    //ドロー時ポイントのスタイルファンクション
    function pointStyleFunc() {
        $("body").on("mouseenter",".ol-popup,.dialog-base,input",function(){//ダイアログにマウスが乗っているときは描画しない。
            return;
        });
        return function (feature) {
            var prop = feature.getProperties();
            var fillColor = prop["_fillColor"];
            if(!fillColor) fillColor = "rgba(0,122,255,0.7)";
            var style;
            if(theGlyph) {//アイコンを選択しているとき
                style = new ol.style.Style({
                    image: new ol.style.FontSymbol({
                        form: "",
                        gradient: true,
                        glyph: theGlyph,
                        fontSize: 1,
                        radius: 16,
                        rotation: 0 * Math.PI / 180,
                        rotateWithView: true,
                        offsetY: 0,
                        color: fillColor,
                        fill: new ol.style.Fill({
                            color: "black"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "white",
                            width: 3
                        })
                    }),
                    stroke: new ol.style.Stroke({
                        width: 2,
                        color: '#f80'
                    }),
                    fill: new ol.style.Fill({
                        color: [255, 136, 0, 0.6]
                    })
                });
            }else{//通常
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
                        fill: new ol.style.Fill({
                            color: "rgba(255,255,255,0.1)"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "blue",
                            width: 1
                        })
                    })
                })
            }
            return style;
        }
    }
    //ポイント関係ここまで
    //------------------------------------------------------------------------------------------------------------------
    //ラインストリング(通常)
    var drawLineString = new ol.interaction.Draw({
        source:drawLayer.getSource(),
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
    //ドロー時ラインストリングのスタイルファンクション
    function linStringeStyleFunc() {
        return function(feature) {
            var tDistance = funcTDistance(feature);
            var styles =[
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 100, 0.7)',
                        lineDash: [10, 10],
                        width: 3
                    })
                }),
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 4,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.7)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        })
                    }),
                    text: new ol.style.Text({
                        font: "10px sans-serif",
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
                }),
                /*
                new ol.style.Style({
                    text: new ol.style.Text ({
                        text:"線",//'\uf0e2',
                        //font:"20px Fontawesome",
                        font: "16px sans-serif",
                        fill: new ol.style.Fill({ color:[0,0,255,0.8] }),
                        //stroke: new ol.style.Stroke({ width:2, color:'red' })
                    }),
                    geometry: function (feature) {
                        if(!tDistance) {
                            var lastCoord = feature.getGeometry().getLastCoordinate();
                            return new ol.geom.Point(lastCoord)
                        }
                    }
                })
                */
            ];
            return styles;
        };
    }
    drawLineString.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        //prop["_color"] = "rgba(51,122,255,0.7)";
        prop["_color"] = "rgba(0,0,240,0.7)";
        prop["_weight"] = 3;
        drawLineString.nbpts = 0;
    });
    //------------------------------------------------------------------------------------------------------------------
    //ポリゴン(通常)
    var drawPolygon = new ol.interaction.Draw({
        snapTolerance:1,
        source:drawLayer.getSource(),
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
        return function(feature) {
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
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: "rgba(0, 0, 0, 0.0)"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "rgba(0, 0, 255, 1)",
                            width: 1
                        }),
                        points: 4,
                        radius: 10
                    }),
                    text: new ol.style.Text({
                        font: "10px sans-serif",
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
    function polygonGometryFunc() {
        return function(coordinates, geometry) {
            this.nbpts = coordinates[0].length;
            if (geometry) geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
            else geometry = new ol.geom.Polygon(coordinates);
            return geometry;
        };
    }
    drawPolygon.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_fillColor"] = "rgba(192,192,192,0.5)";
        prop["_color"] = "rgba(0,0,255,0.7)";
        prop["_weight"] = 1;
        drawPolygon.nbpts = 0;
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
    //------------------------------------------------------------------------------------------------------------------
    //インタラクション追加
    function addInteractions() {
        drawHelpFlg = false;
        var typeVal = $("#drawType2").val();
        console.log(typeVal);
        //map1.removeInteraction(featureSelect);
        map1.removeInteraction(snap);
        map1.removeInteraction(drawPoint);
        map1.removeInteraction(drawPolygon);
        map1.removeInteraction(drawhole);
        map1.removeInteraction(drawLineString);
        //map1.removeInteraction(modify);

        /*
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
        map1.removeInteraction(transform2);
        map1.removeInteraction(drawDome);
        map1.removeInteraction(drawNintoku);
        map1.removeInteraction(drawPaste);
        map1.removeInteraction(modify);
        */
        switch (typeVal) {
            case "1":
            case "0":
                break;
            case "Point":
                map1.addInteraction(drawPoint);
                map1.addInteraction(snap);//ドロー系の後でないとうまく動作しない
                break;
            case "Polygon":
                map1.addInteraction(drawPolygon);
                map1.addInteraction(snap);
                break;
            /*
            case "PolygonFree":
                drawHelpFlg = true;
                helpTooltipElement.innerHTML = "面フリー＞シングルクリック後にそのままドラッグ";
                map1.addInteraction(drawPolygonFree);
                map1.addInteraction(snap);
                break;
                */
            case "DrawHole":
                //drawHelpFlg = true;
                //helpTooltipElement.innerHTML = "穴＞面の上でシングルクリック";
                //console.log("DrawHole");
                map1.addInteraction(drawhole);
                break;
            case "LineString":
                map1.addInteraction(drawLineString);
                map1.addInteraction(snap);
                break;
                /*
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
                */
            default:
        }
    }
    //addInteractions　ここまで
    //------------------------------------------------------------------------------------------------------------------
    //ここから各コントロール
    //ドロータイプ選択
    $("body").on("change","#drawType2",function(){
        //featureSelect.getFeatures().clear();
        drawContextmenuOverlay.setPosition(null);
        rightClickedFeatyure = null;
        addInteractions()

    });
    //------------------------------------------------------------------------------------------------------------------
    //クローズ ×マーク
    $("#drawContextmenuOverlay-close").click(function(){
        drawContextmenuOverlay.setPosition(null);
        //map1.removeInteraction(modify);
        //rightClickedFeatyure = null;
        //drawLayer.getSource().changed();
    });
    //------------------------------------------------------------------------------------------------------------------
    //削除
    $("#drawContextmenu-delete-btn").click(function(){
        if(rightClickedFeatyure) {
            if (confirm("削除しますか？")) {
                drawLayer.getSource().removeFeature(rightClickedFeatyure);
                //transform2.select(null);
                rightClickedFeatyure = null;
                drawContextmenuOverlay.setPosition(null);
            }
        }else{
            /*
            var features = featureSelect.getFeatures().getArray();
            if(confirm("選択された地物を削除しますか？")){
                for(var i = 0; i <features.length; i++){
                    drawLayer.getSource().removeFeature(features[i]);
                }
                rightClickedFeatyure = null;
                featureSelect.getFeatures().clear();
                drawContextmenuOverlay.setPosition(null);
            }
            */
        }
        return false;
    });
    //------------------------------------------------------------------------------------------------------------------
    //全削除
    $("#drawContextmenu-deleteall-btn").click(function(){
        if (confirm("全削除しますか？")) {
            drawLayer.getSource().clear();
            //transform2.select(null);
            rightClickedFeatyure = null;
            drawContextmenuOverlay.setPosition(null);
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //属性オープンクローズ
    $("#drawContextmenu-prop-btn").click(function(){
        if($("#first-div").css("display")==="block") {
            $("#first-div").toggle(500, function () {
                $("#second-div").toggle(500);
            });
        }else{
            $("#second-div").toggle(500, function () {
                $("#first-div").toggle(500);
            })
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //計測オンオフ
    $("#drawContextmenu-measure-btn").click(function(){
        if($(this).hasClass("btn-primary")) {
            $(this).removeClass("btn-primary");
            $(this).addClass("btn-default");
        }else{
            $(this).addClass("btn-primary");
            $(this).removeClass("btn-default");
        }
        drawLayer.getSource().changed();
    });
    //------------------------------------------------------------------------------------------------------------------
    //保存 （普通は必要ない。なぜかオーバーレイではbootstrapが動かないので）
    $("#drawContextmenu-save-btn").click(function(){
        $("#drawContextmenu-save-ul").toggle(500)
    });
    $("#drawContextmenu-save-ul a").click(function(){
        console.log($(this).text());
    });
    //------------------------------------------------------------------------------------------------------------------
    //色　枠色　変更のセレクトボックスをオープン
    $("#fillcolor-color-span").click(function(){
        drawContextmenuDrawColorDD.open();
    });
    $("#color-color-span").click(function(){
        drawContextmenuDrawColorWakuDD.open();
    });
    //------------------------------------------------------------------------------------------------------------------
    //色　変更
    $("body").on("change","#drawContextmenu-drawColor",function(){
        var colorVal = $(this).val();
        var rgb = d3.rgb(colorVal);
        var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.7)";
        if(rightClickedFeatyure) {
            rightClickedFeatyure.setProperties({
                "_fillColor": rgba
                //"_fillColor": colorVal
            });
        }else{
            var features = featureSelect.getFeatures().getArray();
            for(var i = 0; i <features.length; i++){
                var silentBool = true;
                if(i===features.length-1) silentBool = false;
                features[i].setProperties({
                    "_fillColor": rgba
                    //"_fillColor": colorVal
                },silentBool);
            }
        }
        $("#fillcolor-color-span").css({
            "background":rgb,
            "color":funcTextColor(rgb.r,rgb.g,rgb.b),
            "border":"solid 1px " + rgb
        });
        $("#iconI").css({
            color:colorVal
        });
    });
    //------------------------------------------------------------------------------------------------------------------
    //枠色　変更
    $("body").on("change","#drawContextmenu-drawColor-waku",function(){
        var colorVal = $(this).val();
        var rgb = d3.rgb(colorVal);
        var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.8)";
        if(rightClickedFeatyure) {
            rightClickedFeatyure.setProperties({
                "_color": rgba
            });
        }else{
            var features = featureSelect.getFeatures().getArray();
            for(var i = 0; i <features.length; i++){
                if(features[i].getGeometry().getType()!=="Point") {//ポイント以外
                    var silentBool = true;
                    if (i === features.length - 1) silentBool = false;
                    features[i].setProperties({
                        "_color": rgba
                    }, silentBool);
                }
            }
        }
        $("#color-color-span").css({
            "background":rgb,
            "color":funcTextColor(rgb.r,rgb.g,rgb.b),
            "border":"solid 1px " + rgb
        });
    });
    //------------------------------------------------------------------------------------------------------------------
    //幅　変更
    $("body").on("change","#drawContextmenu-drawColor-haba",function(){
        var val = $(this).val();
        if(rightClickedFeatyure) {
            rightClickedFeatyure.setProperties({
                "_weight":val
            });
        }else{
            var features = featureSelect.getFeatures().getArray();
            for(var i = 0; i <features.length; i++){
                if(features[i].getGeometry().getType()!=="Point") {//ポイント以外
                    var silentBool = true;
                    if (i === features.length - 1) silentBool = false;
                    features[i].setProperties({
                        "_weight":val
                    }, silentBool);
                }
            }
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //高さ　設定
    $("#height-input-text").change(function() {
        var val = $(this).val();
        val = zen2han(val);
        $(this).val(val);
        if(val){
            if(rightClickedFeatyure) {
                rightClickedFeatyure.setProperties({
                    "_polygonHeight":val
                });
            }else{
                var features = featureSelect.getFeatures().getArray();
                for(var i = 0; i <features.length; i++){
                    if(features[i].getGeometry().getType()!=="Point") {//ポイント以外
                        var silentBool = true;
                        if (i === features.length - 1) silentBool = false;
                        features[i].setProperties({
                            "_polygonHeight":val
                        }, silentBool);
                    }
                }
            }
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //属性　設定
    $(".prop-input-text-name,.prop-input-text-val").change(function() {
        var nameElements = $(".prop-input-text-name");
        var valElements = $(".prop-input-text-val");
        for(var i = 0; i <nameElements.length; i++) {
            var name = nameElements.eq(i).val();
            var val = valElements.eq(i).val();
            if(name) rightClickedFeatyure["D"][name] = val;
        }
    });
    //-----------------------------------------------------------------------------------------------------
});

