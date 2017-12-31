var drawLayer = null;
var rangeLayer = null;
var drawContextmenuOverlay = null;
var rightClickedFeatyure = null;
var rangeFeatures = [];
$(function() {
    var theGlyph = null;//アイコン用
    var drawCancelFlg = false;//ドローキャンセル用
    var modify = null;//モディファイ用。その都度作る必要があるため
    //var rangeFeatures = [];
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
    var colorOption = "<option value=''></option>";
    colorOption += "<option value='rgb(255,0,0)'>赤</option>";
    colorOption += "<option value='rgb(0,128,0)'>緑</option>";
    colorOption += "<option value='rgb(0,0,255)'>青</option>";
    colorOption += "<option value='rgb(255,255,0)'>黄</option>";
    colorOption += "<option value='rgb(128,128,128)'>灰</option>";
    colorOption += "<option value='rgb(192,192,192)'>銀</option>";
    colorOption += "<option value='rgb(0,0,0)'>黒</option>";
    colorOption += "<option value='rgb(128,0,0)'>栗色</option>";
    colorOption += "<option value='rgb(128,0,128)'>紫</option>";
    colorOption += "<option value='rgb(128,128,0)'>オリーブ</option>";
    colorOption += "<option value='rgb(0,0,128)'>濃紺</option>";
    colorOption += "<option value='rgb(0,128,128)'>青緑</option>";
    colorOption += "<option value='rgb(255,0,255)'>赤紫</option>";
    colorOption += "<option value='rgb(0,255,0)'>ライム</option>";
    colorOption += "<option value='rgb(0,255,255)'>水色</option>";
    var menu = "";
    menu += "<button type='button' class='close' id='drawContextmenuOverlay-close'>&times;</button>";
    menu += "<div id='drawContextmenuOverlay-content-div'>";
    menu += "<div id='first-div'>";
    menu += "<div id='drawContextmenu-msg-div'></div>";
    //ドロー選択とレイヤー透過度
    menu += "<div id='drawContextmenu-step1-div' class='menu-item'>";
    menu += "<select id='drawType'>";
    menu += "<option value='0' selected>選択してください　　</option>";
    menu += "<option value='0' >描画終了</option>";
    menu += "<option value='drawPoint'>点</option>";
    menu += "<option value='drawLineString'>線</option>";
    menu += "<option value='drawLineStringFree'>線フリーハンド</option>";
    menu += "<option value='drawPolygon'>面</option>";
    menu += "<option value='drawhole'>面に穴を開ける</option>";
    menu += "<option value='drawPolygonFree'>面フリーハンド</option>";
    menu += "<option value='transform'>面の回転と変形と移動</option>";
    menu += "<option value='drawPolygonRange'>範囲指定</option>";
    menu += "</select>";
    //透過度(レイヤー)
    menu += "<div id='drawContextmenu-layeropacity-div' class='menu-item'>全体の透過度<div id='drawContextmenu-layeropacity-div2'></div><div id='drawContextmenu-layeropacity-div3'>1</div></div>";
    menu += "</div>";
    //ドロー選択とレイヤー透過度ここまで
    //色、線、アイコン等
    menu += "<div id='drawContextmenu-drawColor-div' class='menu-item'>";
    menu += " <span class='color-span' id='fillcolor-color-span'>　色　</span> ";
    menu += "<select id='drawContextmenu-drawColor'>";
    menu += colorOption;
    menu += "</select>";
    menu += "<span id='currentIcon' class='menu-item'></span>";
    menu += " <button type='button' id='drawContextmenu-icon-btn' class='btn btn-xs btn-primary menu-item'>icon</button>";
    menu += "</div>";
    //色、線、アイコン等ここまで
    menu += "<div id='drawContextmenu-drawColor-waku-div' class='menu-item'>";
    menu += " <span class='color-span' id='color-color-span'>　線　</span> ";
    menu += "<select id='drawContextmenu-drawColor-waku'>";
    menu += colorOption;
    menu += "</select>";
    menu += "<span>　幅 </span>";
    menu += "<select id='drawContextmenu-drawColor-haba'>";
    menu += "<option value='1'>1px</option>";
    menu += "<option value='3'>3px</option>";
    menu += "<option value='5'>5px</option>";
    menu += "<option value='10'>10px</option>";
    menu += "<option value='15'>15px</option>";
    menu += "<option value='25'>25px</option>";
    menu += "<option value='40'>40px</option>";
    menu += "<option value='60'>60px　</option>";
    menu += "</select>";
    menu += "<div id='drawContextmenu-height-div' class='menu-item'>";
    //透過度(地物ごと)
    menu += "<div id='drawContextmenu-opacity-div' class='menu-item'>透過度<div id='drawContextmenu-opacity-div2'></div><div id='drawContextmenu-opacity-div3'></div></div>";
    //高さ
    menu += "高さ<input type='text' id='height-input-text' data-toggle='tooltip' data-placement='bottom' title='' placeholder='任意'> m";
    menu += "</div>";
    menu += "</div>";
    //円の半径
    menu += "<div id='drawContextmenu-drawCircle-div' class='menu-item'>";
    menu += "半径<input id='circle-radius1-input' type='text' value='100'>m　";
    menu += "半径<input id='circle-radius2-input' type='text' value='50'>m";
    menu += "</div>";
    menu += "</div>";
    //first-divここまで
    menu += "<div id='second-div'>";
    menu += "<div id='second-div-msg-div'>項目名を「ラベル」にすると地図に表示</div>";
    menu += "<div id='prop-div'>";
    menu += "<table id='propTable' class='table table-bordered table-hover'>";
    menu += "<tr><th class='prop-th-num'></th><th class='prop-th0'>項目名</th><th class='prop-th1'></th></tr>";
    menu += "<tr><td class='prop-td-num'>1</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "<tr><td class='prop-td-num'>2</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "<tr><td class='prop-td-num'>3</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "<tr><td class='prop-td-num'>4</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "<tr><td class='prop-td-num'>5</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "<tr><td class='prop-td-num'>6</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "<tr><td class='prop-td-num'>7</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "<tr><td class='prop-td-num'>8</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "<tr><td class='prop-td-num'>9</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "<tr><td class='prop-td-num'>10</td><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
    menu += "</table>";
    menu += "</div>";
    menu += "</div>";
    //second-divここまで
    //ここから下部メニュー
    menu += "<hr class='my-hr'>";
    menu += "<button type='button' id='drawContextmenu-prop-btn' class='btn btn-xxs btn-danger'><span data-toggle='tooltip' data-placement='bottom' title=''>属性</span></button>";
    //操作トグル
    menu += "<div class='dropdown-div' id='drawContextmenu-op-div'>";
    menu += "<button id='drawContextmenu-op-btn' class='btn btn-xxs btn-primary dropdown-toggle my-toggle-btn' type='button' data-toggle='dropdown'>操作<span class='caret'></span></button>";
    menu += "<ul id='drawContextmenu-op-ul' class='dropdown-menu my-toggle-ul'>";
    menu += "<li><a>選択物のみ削除</a></li>";
    menu += "<li><a>全削除</a></li>";
    menu += "<li><a>コピー</a></li>";
    menu += "</ul>";
    menu += "</div>";
    //操作トグルここまで
    //ファイルトグル
    menu += "<div class='dropdown-div' id='drawContextmenu-file-div'>";
    menu += "<button id='drawContextmenu-file-btn' class='btn btn-xxs btn-primary dropdown-toggle my-toggle-btn' type='button' data-toggle='dropdown'>ﾌｧｲﾙ<span class='caret'></span></button>";
    menu += "<ul id='drawContextmenu-file-ul' class='dropdown-menu my-toggle-ul'>";
    menu += "<li><a>ファイル読込</a></li>";
    menu += "<hr class='my-hr'>";
    menu += "<li><a>geojson保存</a></li>";
    menu += "<li><a>csv保存</a></li>";
    menu += "<li><a>gist保存</a></li>";
    menu += "</ul>";
    menu += "</div>";
    //ファイルトグルここまで
    //効果トグル
    menu += "<div class='dropdown-div' id='drawContextmenu-effect-div'>";
    menu += "<button id='drawContextmenu-effect-btn' class='btn btn-xxs btn-primary dropdown-toggle my-toggle-btn' type='button' data-toggle='dropdown'>効果<span class='caret'></span></button>";
    menu += "<ul id='drawContextmenu-effect-ul' class='dropdown-menu my-toggle-ul'>";
    menu += "<li><a>リセット</a></li>";
    menu += "<li><a>ボロノイ図</a></li>";
    menu += "<li><a>バッファー</a></li>";
    menu += "<li><a>ヒートマップ</a></li>";
    menu += "</ul>";
    menu += "</div>";
    //効果トグルここまで
    menu += "<button type='button' id='drawContextmenu-measure-btn' class='btn btn-xxs btn-default'><span data-toggle='tooltip' data-placement='bottom' title=''>計測</span></button>";
    menu += "<button type='button' id='drawContextmenu-help-btn' class='btn btn-xxs btn-primary'><span data-toggle='tooltip' data-placement='bottom' title=''><i class='fa fa-question-circle-o fa-lg'></i></span></button>";
    menu += "<button type='button' id='drawContextmenu-geojsontext-btn' class='btn btn-xxs btn-primary'><span data-toggle='tooltip' data-placement='bottom' title='<span style=\"font-size:10px;\">geojsonを表示</span>'><i class='fa fa-window-maximize fa-lg'></i></span></button>";
    //下部メニューここまで
    menu += "</div>";//最後のdiv
    //menu += "<div>テスト中</div>";
    $("#map1").append('<div id="drawContextmenuOverlay-div" class="drawContextmenuOverlay-div">' + menu + '</div>');
    $('[data-toggle="tooltip"]').tooltip({html: true, container: 'body'});
    $(".bs-toggle").bootstrapToggle();
    var drawContextmenuDrawColorDD = $("#drawContextmenu-drawColor").msDropDown().data("dd");
    var drawContextmenuDrawColorWakuDD = $("#drawContextmenu-drawColor-waku").msDropDown().data("dd");
    var drawContextmenuDrawColorHabaDD = $("#drawContextmenu-drawColor-haba").msDropDown().data("dd");
    var drawTypeMsDropDown = $("#drawType").msDropDown().data("dd");
    drawContextmenuDrawColorDD.set("disabled",true);
    drawContextmenuDrawColorWakuDD.set("disabled",true);
    drawContextmenuDrawColorHabaDD.set("disabled",true);
    $("#drawContextmenu-layeropacity-div2").slider({
        min:0,max:1,value:1,step:0.01,
        slide: function(event,ui){
            drawLayer.setOpacity(ui.value);
            $("#drawContextmenu-layeropacity-div3").html(ui.value);
        }
    });
    $("#drawContextmenu-opacity-div2").slider({
        min:0,max:1,value:1,step:0.01,
        slide: function(event,ui){
            var fillColor = rightClickedFeatyure.getProperties()["_fillColor"];
            var rgba = setRgbaOpacity(fillColor,ui.value);
            rightClickedFeatyure.setProperties({
                "_fillColor":rgba
            });
            $("#drawContextmenu-opacity-div3").html(ui.value);
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //右クリック用オーバーレイをマップに設定
    drawContextmenuOverlay = new ol.Overlay({
        element:$("#drawContextmenuOverlay-div")[0],
        //autoPan:true,
        //autoPanAnimation:{duration:200},
        offset:[0,0]//横、縦
    });
    map1.addOverlay(drawContextmenuOverlay);
    //------------------------------------------------------------------------------------------------------------------
    //⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
    //右クリック時の動作その１
    function drawContextmenu(evt){
        evt.preventDefault();
        rightClickedFeatyure = null;
        drawTypeMsDropDown.set("selectedIndex", 0);
        addInteractions();
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
            console.log(geomType);
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
            console.log("点")
        }else if(lineStringFeature) {
            feature = lineStringFeature;
            console.log("線")
        }else{
            feature = otherFeature;
            console.log("他")
        }
        drawContextmenuOverlay.setPosition(coord);
        drawContextmenuCreate(feature);
    }
    //------------------------------------------------------------------------------------------------------------------
    //右クリック時の動作その2
    //★★★メニュー項目　調整★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    //var prevMsddIndex;
    function drawContextmenuCreate(feature){
        //最初に全て隠す
        $(".menu-item").hide();
        //$("#drawContextmenu-height-div").hide();$("#drawContextmenu-delete-btn").prop("disabled","disabled");
        //$("#drawContextmenu-copy-btn").prop("disabled","disabled");
        $("#drawContextmenu-prop-btn").prop("disabled","disabled");
        //$("#drawContextmenu-paste-btn").prop("disabled","disabled");
        $(".prop-input-text-name").val("");
        $(".prop-input-text-val").val("");
        if(feature) {//地物があるとき
            //地物を選択地物としてセット--------------------------
            rightClickedFeatyure = feature;
            drawLayer.getSource().changed();
            //モディファイと移動　インタラクション-----------------
            map1.removeInteraction(snap);
            map1.removeInteraction(modify);
            modify = new ol.interaction.Modify({
                features:new ol.Collection([rightClickedFeatyure]),
                deleteCondition:ol.events.condition.singleClick//頂点の削除をシングルクリックのみでできるようにした
            });
            map1.addInteraction(modify);
            map1.addInteraction(snap);
            transform2.select(rightClickedFeatyure);
            transform2.setVisible(true);
            console.log(rightClickedFeatyure)
            //------------------------------------------------
            var prop,geomType;
            if(!Array.isArray(feature)) {//配列でないとき　つまり一つだけ選択しているとき
                prop = feature.getProperties();
                geomType = feature.getGeometry().getType();
                var type = prop["_type"];
                console.log(type);
                //色-----------------------------------
                var fillColor = prop["_fillColor"];
                var rgb;
                if(fillColor) {
                    rgb = rgba2rgb(fillColor);
                    drawContextmenuDrawColorDD.setIndexByValue(rgb);
                    $("#fillcolor-color-span").css({
                        "background": rgb,
                        "border":"1px solid " + rgb,
                        "color": funcTextColor(rgb.r, rgb.g, rgb.b)
                    });
                }
                //透過度-------------------------------
                if(fillColor) {
                    var opacity = getRgbaOpacity(fillColor);
                    console.log(String(opacity*100) + "%");
                    $("#drawContextmenu-opacity-div2 .ui-slider-handle").css({
                        left:String(opacity*100) + "%"
                    });
                    $("#drawContextmenu-opacity-div3").html(opacity);
                }
                //線の色-------------------------------
                var color = prop["_color"];
                console.log(color);
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
                //３D時高さ-----------------------------
                var height = prop["_polygonHeight"];
                if(height) {
                    $("#height-input-text").val(height);
                }else{
                    $("#height-input-text").val(null);
                }
                //円-----------------------------------
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
                //------------------------------------------------------
                //メニューを地物のタイプによって書き換える
                switch (geomType) {
                    case "Point":
                        $("#drawContextmenu-msg-div").html("(点)色を変えます。iconで形状変更します。");
                        var pointCoord = feature.getGeometry().getCoordinates();
                        drawContextmenuOverlay.setPosition(pointCoord);
                        drawContextmenuOverlay.setOffset([10, 10]);
                        $("#drawContextmenu-drawColor-div").show();
                        //$("#drawContextmenu-icon-btn").show();
                        $("#currentIcon").show();
                        $("#drawContextmenu-prop-btn").prop("disabled",false);
                        break;
                    case "MultiPolygon":
                    case "Polygon":
                        $("#drawContextmenu-msg-div").html("(面)色を変えます。高さ設定→3Dで・・");
                        $("#drawContextmenu-drawColor-div").show();
                        $("#drawContextmenu-drawColor-waku-div").show();
                        if(type==="circle") $("#drawContextmenu-drawCircle-div").show();
                        $("#drawContextmenu-opacity-div").show();
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
                //$("#drawContextmenu-delete-btn").prop("disabled", false);
                //$("#drawContextmenu-copy-btn").prop("disabled",false);
                drawContextmenuDrawColorDD.set("disabled", false);
                drawContextmenuDrawColorWakuDD.set("disabled", false);
                drawContextmenuDrawColorHabaDD.set("disabled", false);
            }else{//配列のとき　つまり複数選択の時
                console.log("配列");
                $("#drawContextmenu-msg-div").html("複数選択。まとめて変更します。");
                $("#drawContextmenu-drawColor-div").show();
                $("#drawContextmenu-drawColor-waku-div").show();
                //$("#drawContextmenu-icon-btn").show();
                $("#currentIcon").show();
                $("#drawContextmenu-height-div").show();
                //$("#drawContextmenu-delete-btn").prop("disabled",false);
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
            $("#drawContextmenu-layeropacity-div").show();
            drawContextmenuDrawColorDD.set("disabled",true);
            drawContextmenuDrawColorWakuDD.set("disabled",true);
            drawContextmenuDrawColorHabaDD.set("disabled",true);
            $("#second-div").hide();
            $("#first-div").show();
            transform2.setVisible(false);
        }
    }
    //★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    //------------------------------------------------------------------------------------------------------------------
    //クリック時の動作　重要！！ここでユーザーの操作によって見方や機能を変化させている。！！！！！！！！！！！！！！！！！！！！！！！！
    map1.on("click",function(evt){
        var interactions = map1.getInteractions().getArray();
        var drawFlg,modifyFlg;
        for(var i = 0; i <interactions.length; i++){//drawとmodifyから作られたオブジェクトの存在チェック
            if(interactions[i] instanceof ol.interaction.Draw) drawFlg = true;
            if(interactions[i] instanceof ol.interaction.Modify) modifyFlg = true;
        }
        var features = [];
        map1.forEachFeatureAtPixel(evt.pixel,function(feature,layer){
            if(layer){
                if(layer.getProperties()["name"]==="drawLayer") features.push(feature);
            }
        });
        var feature = features[0];
        transform2.setVisible(false);//まず消す
        console.log(888)
        if(modifyFlg && features.length===0) {//modifyかつ地物の外
            console.log("modifyかつ外");
            rightClickedFeatyure = null;
            drawLayer.getSource().changed();
            drawContextmenuOverlay.setPosition(null);
            map1.removeInteraction(modify);
            console.log("パターン1")
        }else if(!drawFlg && !modifyFlg && features.length>0){//drawとmodifyじゃなくかつ地物の内
            drawContextmenuOverlay.setPosition(null);
            popupShow(feature,evt);//クリック時の動作その２　ポップアップへ　すぐ下
            console.log("パターン2")
        }else if(!drawFlg && modifyFlg && features.length>0){//modifyかつ地物の内。でもdrawじゃない。
            if(feature===rightClickedFeatyure) transform2.setVisible(true);//更に右クリック地物のときに移動を可視化
            var coordAr = feature.getGeometry().getCoordinates()[0];
            var verticesFlg = false;
            for(var i = 0; i <coordAr.length; i++){
                var verticesPixel = map1.getPixelFromCoordinate(coordAr[i]);
                if(Math.abs(verticesPixel[0]-evt.pixel[0])<10){
                        console.log("頂点");
                        verticesFlg = true;
                        break;
                }
            }
            if(!verticesFlg) popupShow(feature,evt);//クリック時の動作その２　ポップアップへ　すぐ下
            console.log("パターン3")
        }else if(!drawFlg){//drawじゃない
            drawContextmenuOverlay.setPosition(null);
            console.log("パターン5")
        }
        console.log("drawFlg=" + drawFlg,"modifyFlg=" + modifyFlg,"features.length=" + features.length);
    });
    //------------------------------------------------------------------------------------------------------------------
    //クリック時の動作その２　ポップアップ
    var drawPopup = new ol.Overlay.Popup();
    map1.addOverlay(drawPopup);
    function popupShow(feature,evt){
        var geomType = feature.getGeometry().getType();
        var coord;
        if(geomType==="Point"){
            coord = feature.getGeometry().getCoordinates();
        }else{
            coord = evt.coordinate;
        }
        var prop = feature.getProperties();
        var flg = false;
        var content = "";
        var table = "<table class='draw-popup-tbl table table-bordered table-hover' style=''>";
        for(key in prop){
            if(key!=="geometry" && key.substr(0,1)!=="_"){
                table += "<tr>";
                var val = prop[key];
                table += "<th class='draw-popup-th'>" + key + "</th><td class='draw-popup-td'>" + val + "</td>";
                table += "</tr>";
                flg = true;
            }
        }
        content += table;
        if(!flg) content = "属性未設定です。";
        content = content.replace(/undefined/gi,"");
        drawPopup.show(coord,content);
    }
    //------------------------------------------------------------------------------------------------------------------
    //各レイヤー設定
    //ドロー用（通常）のソース、レイヤーを設置
    //drawSource = new ol.source.Vector();
    drawLayer = new ol.layer.Vector({
        source:new ol.source.Vector(),
        name:"drawLayer",
        renderOrder: ol.ordering.yOrdering(),
        //style:drawStyleFunction()
        style:zzz()
    });
    map1.addLayer(drawLayer);
    drawLayer.set("altitudeMode","clampToGround");
    drawLayer.setZIndex(9999);
    //------------------------------------------------------------------------------------------------------------------
    //ソースに変更があった時に発火
    drawLayer.getSource().on("change", function(e) {
        geojsonText();
    });
    //範囲指定用レイヤー
    rangeLayer = new ol.layer.Vector({
        source:new ol.source.Vector(),
        name:"rangeLayer",
        style:function(){

        }
    });
    map1.addLayer(rangeLayer);
    drawLayer.setZIndex(9999);
    //------------------------------------------------------------------------------------------------------------------
    //geojsonの文字を書き出し
    function geojsonText(){
        var features = drawLayer.getSource().getFeatures();
        var drawSourceGeojson = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        var geojsonT = JSON.stringify(JSON.parse(drawSourceGeojson),null,1);
        var height = $(window).height() - 100;
        //$("#geojson-text").html("<pre style='max-height:" + height + "px'>" + geojsonT + "</pre>");
        $("#geojson-text").val(geojsonT).change();//チェンジイベント強制発火
    }
    //------------------------------------------------------------------------------------------------------------------
    //★★★★ソースに地物が追加されたときの処理 今の所同じ座標にポイントを打とうとしたときだけに使っている。
    drawLayer.getSource().on("addfeature", function(e) {
        var feature = e["feature"];
        if(drawCancelFlg){
            drawLayer.getSource().removeFeature(feature);
        }
        drawCancelFlg = false;
    });
    /*
    //------------------------------------------------------------------------------------------------------------------
    //スタイルファンクション-----------------------------------------------------------------------------------------------
    //基本のスタイルファンクションはここに書く。ドロー専用は別の場所に
    //ポイント用のスタイル------------------------------------------------------------------------------------------------
    function pointStyle(feature,resolution) {
        var prop = feature.getProperties();
        var fillColor = prop["_fillColor"];
        if(!fillColor) fillColor = "rgba(0,122,255,0.7)";
        var icon = prop["_icon"];
        var text = prop["ラベル"];
        var style = [];
        if (icon) {
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

        } else {//iconでない通常のとき
            var color,width;
            if(feature===rightClickedFeatyure || rangeFeatures.indexOf(feature)!==-1) {
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
    //ラインストリング用のスタイル------------------------------------------------------------------------------------------
    function lineStringStyle(feature,resolution) {
        var prop = feature.getProperties();
        var fillColor = prop["_fillColor"];
        if (!fillColor) fillColor = "rgba(0,122,255,0.7)";
        var strokeColor = prop["_color"];
        var strokeWidth = prop["_weight"];
        var tDistance;
        tDistance = funcTDistance(feature);
        if(feature!==rightClickedFeatyure && rangeFeatures.indexOf(feature)===-1) {
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
        return style;
    }
    //ポリゴン用のスタイル-------------------------------------------------------------------------------------------------
    function polygonStyle(feature,resolution) {
        var prop = feature.getProperties();
        var geoType = feature.getGeometry().getType();
        var type = prop["_type"];
        var fillColor = prop["_fillColor"];
        if (!fillColor) fillColor = "rgba(0,122,255,0.7)";
        var strokeColor = prop["_color"];
        var strokeWidth = prop["_weight"];
        var text = "",text2 = "",lastCoord,lastCoord2,returnGeom,returnGeom2,tRadius,tArea,tDistance;
        //面積や長さを測る
        switch (type) {
            case "circle":
            case "buffer":
                tRadius = funcTRadius(feature);
                switch (geoType) {
                    case "Polygon":
                        text = "半径" + tRadius;
                        text2 = "";
                        lastCoord = feature.getGeometry().getLastCoordinate();
                        returnGeom = new ol.geom.Point(lastCoord);//テキスト用ジオメトリー
                        break;
                    case "MultiPolygon":
                        text = "半径" + tRadius[0];
                        text2 = "半径" + tRadius[1];
                        lastCoord = feature.getGeometry().getCoordinates()[0][0][0];
                        lastCoord2 = feature.getGeometry().getCoordinates()[1][0][0];
                        returnGeom = new ol.geom.Point(lastCoord);//テキスト用ジオメトリー
                        returnGeom2 = new ol.geom.Point(lastCoord2);//テキスト用ジオメトリー
                        break;
                }
                break;
            default://通常のポリゴンはこっち
                if(geoType==="Polygon" || geoType==="MultiPolygon") {
                    tArea = funcTArea(feature);
                    tDistance = funcTDistance(feature);
                    if (tDistance) {
                        text = "面積\n" + tArea + "\n周長" + tDistance;
                    } else {
                        if (tArea) {
                            text = "面積\n" + tArea;
                        } else {
                            text = "";
                        }
                    }
                    returnGeom = feature.getGeometry();//テキスト用ジオメトリー
                }
        }
        //面積や長さを測るここまで-----------------------------------------------
        var polygonTextStyle =[
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
        if(feature!==rightClickedFeatyure && rangeFeatures.indexOf(feature)===-1) {
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
                polygonTextStyle[0],
                polygonTextStyle[1]
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
                polygonTextStyle[0],
                polygonTextStyle[1],
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
        return style;
    }
    //------------------------------------------------------------------------------------------------------------------
    //スタイルファンクション本体
    function drawStyleFunction() {
        return function(feature, resolution) {
            var geoType = feature.getGeometry().getType();
            //--------------------------------------------------------------------
            switch (geoType) {
                //線（ライン）
                case "LineString":
                    var style = lineStringStyle(feature,resolution);
                    break;
                //-----------------------------------------------------------------
                //点（ポイント）
                case "Point":
                    var style = pointStyle(feature,resolution);
                    break;
                //-----------------------------------------------------------------
                //面と円（ポリゴンとマルチポリゴン）
                case "Polygon":
                case "MultiPolygon":
                    var style = polygonStyle(feature,resolution);
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
    */
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
            prop["_fillColor"] = "rgb(0,0,255)";
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
            //var tDistance = funcTDistance(feature);
            var tDistance = measure("distance",feature);
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
        prop["_color"] = "rgba(0,0,255,0.7)";
        prop["_weight"] = 3;
        drawLineString.nbpts = 0;
    });
    //------------------------------------------------------------------------------------------------------------------
    //ラインストリング(フリーハンド)
    var drawLineStringFree = new ol.interaction.Draw({
        source:drawLayer.getSource(),
        type:"LineString",
        geometryFunction:linStringeGometryFunc(),
        style:linStringeStyleFunc(),
        freehand:true
    });
    drawLineStringFree.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_color"] = "rgba(51,122,255,0.7)";
        prop["_weight"] = 6;
        drawLineString.nbpts = 0;
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
            //var tDistance = funcTDistance(feature);
            var tDistance = measure("distance",feature);
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
    //ポリゴン(フリーハンド)
    var drawPolygonFree = new ol.interaction.Draw({
        snapTolerance:1,
        source:drawLayer.getSource(),
        type:"Polygon",
        style:polygonStringeStyleFunc(),
        geometryFunction:polygonGometryFunc(),
        freehand:true
    });
    drawPolygonFree.on("drawend", function(e) {
        var prop = e["feature"]["D"];
        prop["_fillColor"] = "rgba(192,192,192,0.5)";
        prop["_color"] = "rgba(0,0,255,0.7)";
        prop["_weight"] = 1;
        drawPolygon.nbpts = 0;
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
    //ポリゴンで範囲指定 フリーハンド
    var drawPolygonRange = new ol.interaction.Draw({
        snapTolerance:1,
        source:rangeLayer.getSource(),
        type:"Polygon",
        style:polygonStringeStyleFunc(),
        freehand:true
    });
    //--------------------------
    drawPolygonRange.on("drawend", function(e) {
        rangeFeatures = [];
        var feature = e["feature"];
        var coordAr = feature.getGeometry().getCoordinates();
        var haniPolygon = turf.toWgs84(turf.polygon(coordAr));
        features = drawLayer.getSource().getFeatures();
        for (var i = 0; i < features.length; i++) {
            var geomType = features[i].getGeometry().getType();
            var bool,point,targetGeom;
            switch (geomType) {
                case "Point":
                    point = turf.toWgs84(turf.point(features[i].getGeometry().getCoordinates()));
                    bool = turf.booleanPointInPolygon(point, haniPolygon);
                    if (bool) rangeFeatures.push(features[i]);
                    break;
                default:
                    switch (geomType) {
                        case "MultiPolygon":
                            targetGeom = turf.toWgs84(turf.multiPolygon(features[i].getGeometry().getCoordinates()));
                            var tgtFeatureCollection = turf.flatten(targetGeom);
                            var tgtFeatures = tgtFeatureCollection["features"];
                            //console.log(tgtFeatures);
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
                            //console.log(bool);
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
                    if (bool) rangeFeatures.push(features[i]);
                    break;
            }
            bool = false;
        }//forここまで
        console.log(rangeFeatures);
        drawLayer.getSource().changed();
        var extent = feature.getGeometry().getExtent();
        drawContextmenuOverlay.setPosition([extent[2],extent[3]]);



        //drawContextmenuCreate(featureSelect.getFeatures().getArray());
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
    //トランスフォーム（移動のみ）
    var transform2 = new ol.interaction.Transform ({
        translateFeature:false,
        scale:false,
        rotate:false,
        keepAspectRatio:ol.events.condition.always,
        translate:true,
        stretch:false
    });
    map1.addInteraction(transform2);//他と違って最初から設定
    transform2.setVisible(false);//でもハンドルを見せない。適宜ハンドルを可視化させている。できればもっとよくしたい。
    //トランスフォームハンドルスタイルセット
    transformSetHandleStyle();
    function transformSetHandleStyle() {
        //if (!transform instanceof ol.interaction.Transform) return;
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
        transform2.setStyle('translate',
            new ol.style.Style(
                {	text: new ol.style.Text (
                        {	text:'\uf047',
                            font:"20px Fontawesome",
                            fill: new ol.style.Fill({ color:[255,255,255,0.8] }),
                            stroke: new ol.style.Stroke({ width:2, color:'red' })
                        })
                }));
        transform.set('translate', transform.get('translate'));
        transform2.set('translate', transform2.get('translate'));
    }
    //------------------------------------------------------------------------------------------------------------------
    //インタラクション追加
    function addInteractions() {
        var typeVal = $("#drawType").val();
        //インタラクションをリムーブ--------------
        var interactions = map1.getInteractions().getArray();
        map1.removeInteraction(transform);
        map1.removeInteraction(snap);
        for(var i = 0; i <interactions.length; i++){
            var interaction = interactions[i];
            if(interaction instanceof ol.interaction.Draw) map1.removeInteraction(interaction);
        }
        //--------------------------------------------------
        if(typeVal!=="0") {
            map1.addInteraction(eval(typeVal));
            map1.addInteraction(snap);//ドロー系の後でないとうまく動作しない
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    //ここから各コントロール
    //ドロータイプ選択
    $("body").on("change","#drawType",function(){
        drawContextmenuOverlay.setPosition(null);
        rightClickedFeatyure = null;
        addInteractions()
    });
    //------------------------------------------------------------------------------------------------------------------
    //クローズ ×マーク
    $("#drawContextmenuOverlay-close").click(function(){
        drawContextmenuOverlay.setPosition(null);
        //transform2.setVisible(false);
    });
    //------------------------------------------------------------------------------------------------------------------
    //トグルオープン＆クローズ （普通は必要ない。なぜかオーバーレイ上ではbootstrapが動かないので）
    $(".my-toggle-btn").click(function(){
        var tgtElem = $(this).next(".my-toggle-ul");
        $(".my-toggle-ul").not(tgtElem).hide(500);//対象以外を隠す。
        tgtElem.toggle(500);//対象を表示する。
        return false;
    });
    $("body,.ol-overlay-container").click(function(){
        $(".my-toggle-ul").hide(500);
        $(".ddChild").hide();
    });
    //------------------------------------------------------------------------------------------------------------------
    //操作
    $("#drawContextmenu-op-ul a").click(function() {
        var text = $(this).text();
        switch (text) {
            case "選択物のみ削除":
                if(rightClickedFeatyure) {
                    if (confirm("削除しますか？")) {
                        drawLayer.getSource().removeFeature(rightClickedFeatyure);
                        //transform2.select(null);
                        rightClickedFeatyure = null;
                        drawContextmenuOverlay.setPosition(null);
                        drawPopup.setPosition(null);
                        $(this).parents(".my-toggle-ul").hide(500);
                    }
                }
                break;
            case "全削除":
                if (confirm("全削除しますか？")) {
                    drawLayer.getSource().clear();
                    //transform2.select(null);
                    rightClickedFeatyure = null;
                    drawContextmenuOverlay.setPosition(null);
                    drawPopup.setPosition(null);
                    $(this).parents(".my-toggle-ul").hide(500);
                }
                break;
            case "コピー":
                alert("作成中！");
                break;
            default:
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //削除
    /*
    $("#drawContextmenu-delete-btn").click(function(){
        if(rightClickedFeatyure) {
            if (confirm("削除しますか？")) {
                drawLayer.getSource().removeFeature(rightClickedFeatyure);
                //transform2.select(null);
                rightClickedFeatyure = null;
                drawContextmenuOverlay.setPosition(null);
            }
        }else{

            var features = featureSelect.getFeatures().getArray();
            if(confirm("選択された地物を削除しますか？")){
                for(var i = 0; i <features.length; i++){
                    drawLayer.getSource().removeFeature(features[i]);
                }
                rightClickedFeatyure = null;
                featureSelect.getFeatures().clear();
                drawContextmenuOverlay.setPosition(null);
            }

        }
        return false;
    });
    */
    //------------------------------------------------------------------------------------------------------------------
    //属性オープンクローズ
    $("#drawContextmenu-prop-btn").click(function(){
        if($("#first-div").css("display")==="block") {
            $("#first-div").toggle(150, function () {
                $("#second-div").toggle(150);
            });
        }else{
            $("#second-div").toggle(150, function () {
                $("#first-div").toggle(150);
            })
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //計測オンオフ
    $("#drawContextmenu-measure-btn").click(function(){
        $(this).toggleClass("btn-primary");
        $(this).toggleClass("btn-default");
        drawLayer.getSource().changed();
    });
    //------------------------------------------------------------------------------------------------------------------
    //色　枠色　変更のセレクトボックスをオープン
    $("#fillcolor-color-span,#color-color-span").click(function(){
        $(".ddChild").hide();
        $(this).parent().find(".ddChild").eq(0).show();
        return false;
    });
    //------------------------------------------------------------------------------------------------------------------
    //geojsonダイアログを表示
    $("#drawContextmenu-geojsontext-btn").click(function() {
        var content = "<div style='width:440px'><textarea id='geojson-text'></textarea></div>";
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
        $("#geojson-text").bcralnit({
            width:"30px",
            background:"#75BAFF",
            color:"white"
        });
    });
    //------------------------------------------------------------------------------------------------------------------
    //色　変更
    $("body").on("change","#drawContextmenu-drawColor",function(){
        var colorVal = $(this).val();
        var rgb = d3.rgb(colorVal);
        var opacity = $("#drawContextmenu-opacity-div3").text();
        var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + opacity + ")";
        if(rightClickedFeatyure) {
            rightClickedFeatyure.setProperties({
                "_fillColor": rgba
            });
        }else{
            var features = featureSelect.getFeatures().getArray();
            for(var i = 0; i <features.length; i++){
                var silentBool = true;
                if(i===features.length-1) silentBool = false;
                features[i].setProperties({
                    "_fillColor": rgba
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
        var name,val;
        //地物のプロパティを操作---------------------------------------------------
        for(var i = 0; i <nameElements.length; i++) {
            name = nameElements.eq(i).val();
            val = valElements.eq(i).val();
            if(name) rightClickedFeatyure["D"][name] = val;
        }
        //ドロー用のポップアップを操作　見やすいようにあえて冗長に書いている-------------
        var table = "<table class='draw-popup-tbl table table-bordered table-hover' style=''>";
        for(var i = 0; i <nameElements.length; i++) {
            name = nameElements.eq(i).val();
            val = valElements.eq(i).val();
            if(name) {
                table += "<tr><th class='draw-popup-th'>" + name + "</th><td class='draw-popup-td'>" + val + "</td></tr>";
            }
        }
        table += "</table>";
        $(".ol-popup-content").html(table);
        //----------------------------------------------------------------------
    });
    //------------------------------------------------------------------------------------------------------------------
    //ジオコーディング
    $("body").on("change",".addres-input",function(){
        $.ajax({
            type: "get",
            url: "https://msearch.gsi.go.jp/address-search/AddressSearch",
            dataType: "json",
            data:{
                "q":$(this).val()
            }
        }).done(function (json) {
            if(json.length) {
                var feature = json[0];
                var coord = feature["geometry"]["coordinates"];
                var lonlatText = coord[0] + "," + coord[1];
                coord = ol.proj.transform(coord, "EPSG:4326", "EPSG:3857");
                var geometry = new ol.geom.Point(coord);
                var newFeature = new ol.Feature({
                    geometry: geometry,
                    "_fillColor":"rgb(255,0,0)",
                    "住所":feature["properties"]["title"],
                    "座標":lonlatText
                });
                drawLayer.getSource().addFeature(newFeature);
                map1.getView().setCenter(coord);
            }
        }).fail(function () {
            console.log("失敗!");
        });
    });
});

