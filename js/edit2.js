var drawSource = null;
var drawLayer = null
$(function() {
    var selectedFeature = null;
    var selectHtml = "";
        selectHtml += "<div id='draw-div'>";
        //selectHtml += "ドロー実験中。まだ動作しません。<br><br>";
        selectHtml += "<h4>step1 形を作る</h4>";
        selectHtml += "<div class='draw-div2'>";
            selectHtml += "形状 ";
            selectHtml += "<select id='drawType'>";
                selectHtml += "<option value='0' selected>なし</option>";
                selectHtml += "<option value='Point'>点を描く</option>";
                selectHtml += "<option value='LineString'>ラインを描く</option>";
                selectHtml += "<option value='Polygon'>面を描く</option>";
                selectHtml += "<option value='PolygonHole'>面に穴を開ける</option>";
                selectHtml += "<option value='Transform'>面の移動と回転と変形</option>";
                selectHtml += "<option value='Circle'>円を描く</option>";
                selectHtml += "<option value='Dome'>東京ドーム一個分</option>";
                selectHtml += "<option value='Nintoku'>仁徳天皇陵</option>";
            selectHtml += "</select>";
        selectHtml += "</div>";
        selectHtml += "<hr class='my-hr'>";
        selectHtml += "<h4>step2 色を塗る</h4>";
        selectHtml += "<div class='draw-div2'>";
            selectHtml += "選択モード ";
            selectHtml += "<select class='drawSelect'>";
                selectHtml += "<option value='off'>オフ</option>";
                selectHtml += "<option value='on'>オン</option>";
            selectHtml += "</select>";
            selectHtml += "　色選択 ";
            selectHtml += "<select id='drawColor'>";
                selectHtml += "<option value='red'>赤</option>";
                selectHtml += "<option value='green'>緑</option>";
                selectHtml += "<option value='blue'>青</option>";
                selectHtml += "<option value='yellow'>黄</option>";
                selectHtml += "<option value='gray'>灰</option>";
                selectHtml += "<option value='silver'>銀</option>";
                selectHtml += "<option value='black'>黒</option>";
                selectHtml += "<option value='maroon'>maroon</option>";
                selectHtml += "<option value='purple'>purple</option>";
                selectHtml += "<option value='olive'>olive</option>";
                selectHtml += "<option value='navy'>navy</option>";
                selectHtml += "<option value='teal'>teal</option>";
                selectHtml += "<option value='fuchsia'>fuchsia</option>";
                selectHtml += "<option value='lime'>lime</option>";
                selectHtml += "<option value='aqua'>aqua</option>";
            selectHtml += "</select>";
            selectHtml += "　　<button type='button' id='colorSave-btn' class='btn btn-xs btn-primary'>　反映　</button>";
        selectHtml += "</div>";

        selectHtml += "<hr class='my-hr'>";
        selectHtml += "<h4>step3 項目</h4>";
        selectHtml += "<div class='draw-div2'>";
        //selectHtml += "作成中";
        selectHtml += "選択モード ";
        selectHtml += "<select class='drawSelect'>";
        selectHtml += "<option value='off'>オフ</option>";
        selectHtml += "<option value='on'>オン</option>";
        selectHtml += "</select>";

        selectHtml += "<table id='propTable' class='popup-tbl table table-bordered table-hover'>";
        selectHtml += "<tr><th class='prop-th0'>項目名</th><th class='prop-th1'></th></tr>";
        selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
        selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
        selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
        selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
        selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";
        selectHtml += "<tr><td class='prop-td'><input type='text' class='prop-input-text-name'></td><td class='prop-td'><input type='text' class='prop-input-text-val'></td></tr>";

        selectHtml += "</table>";
        selectHtml += "<button type='button' id='propSave-btn' class='btn btn-xs btn-primary btn-block'>反映</button>";
        /*
        selectHtml += "<div class='btn-group btn-group-justified' style='width:300px;'>";
        selectHtml += "<div class='btn-group'><button type='button' id='propCancel-btn' class='btn btn-xs btn-primary'>戻す</button></div>";
        selectHtml += "<div class='btn-group'><button type='button' id='propSave-btn' class='btn btn-xs btn-primary'>反映</button></div>";
        selectHtml += "</div>";
        */
        selectHtml += "</div>";

        selectHtml += "<hr class='my-hr'>";
        selectHtml += "<h4>step4 保存</h4>";
        selectHtml += "<div class='draw-div2'>";
        //selectHtml += "保存 ";

        selectHtml += "<div class='btn-group btn-group-justified' style='width:300px;'>";
        selectHtml += "<div class='btn-group'><button type='button' id='drawGeojson-btn' class='btn btn-xs btn-primary'>GEOJSON</button></div>";
        selectHtml += "<div class='btn-group'><button type='button' id='drawCsv-btn' class='btn btn-xs btn-primary'>CSV</button></div>";
        selectHtml += "</div>";

        selectHtml += "</div>";

        selectHtml += "</div>";

        //$("#map1").append(selectHtml);

        var content = selectHtml;
        /*
        mydialog({
            id:"draw-dialog",
            class:"draw-dialog",
            map:"map1",
            title:"ドロー実験中",
            content:content,
            top:"100px",
            left:"20px",
            //rmDialog:true
        });
        */

    $(".draw-btn").click(function(){
        mydialog({
            id:"draw-dialog",
            class:"draw-dialog",
            map:"map1",
            title:"ドロー実験中",
            content:content,
            top:"60px",
            left:"10px",
            //rmDialog:true
        });
    });
    
    drawSource = new ol.source.Vector();
    drawLayer = new ol.layer.Vector({
        source:drawSource,
        name:"drawLayer",
        style:commonstyleFunction
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

    map1.addLayer(drawLayer);
    drawLayer.set("selectable",true);
    drawLayer.set("altitudeMode","clampToGround");
    drawLayer.setZIndex(9999);
    var modify = new ol.interaction.Modify({source:drawSource});
    modify.on("modifyend", function(e) {
        console.log(e)
    });



    map1.addInteraction(modify);
    var draw,snap,drawhole,transform,circle;
    //------------------------------------------------------------------------------------------------------------------
    
    function addInteractions() {
        var typeVal = $("#drawType").val();
        console.log(typeVal);
        //if(typeVal==="0") return;
        switch (typeVal) {
            case "Polygon":
                draw = new ol.interaction.Draw({
                    source:drawSource,
                    type:typeVal,
                    geometryFunction:function(coordinates, geometry) {
                        this.nbpts = coordinates[0].length;
                        if (geometry) geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
                        else geometry = new ol.geom.Polygon(coordinates);
                        return geometry;
                    }
                });
                break;
            case "LineString":
                draw = new ol.interaction.Draw({
                    source:drawSource,
                    type:typeVal,
                    geometryFunction:function(coordinates, geometry) {
                        if (geometry) geometry.setCoordinates(coordinates);
                        else geometry = new ol.geom.LineString(coordinates);
                        this.nbpts = geometry.getCoordinates().length;
                        return geometry;
                    }
                });
                break;
            case "Dome":
                draw = new ol.interaction.Draw({
                    source:drawSource,
                    type:"Point",
                    geometryFunction:function(coordinates, geometry){
                        console.log(coordinates);
                        this.domeCoord = coordinates;
                    }
                });
                break;
            case "Nintoku":
                draw = new ol.interaction.Draw({
                    source:drawSource,
                    type:"Point",
                    geometryFunction:function(coordinates, geometry){
                        console.log(coordinates);
                        this.nintokuCoord = coordinates;
                    }
                });
                break;
            default:
                draw = new ol.interaction.Draw({
                    source:drawSource,
                    type:typeVal
                });
                break;
        }
        circle = new ol.interaction.Draw({
            source:drawSource,
            type:"Circle",
            geometryFunction:ol.interaction.Draw.createRegularPolygon(32)
        });
        snap = new ol.interaction.Snap({source:drawSource});
        drawhole  = new ol.interaction.DrawHole ({
            layers:[drawLayer]
        });
        transform = new ol.interaction.Transform ({
            /*
             translateFeature: $("#translateFeature").prop('checked'),
             scale: $("#scale").prop('checked'),
             rotate: $("#rotate").prop('checked'),
             keepAspectRatio: $("#keepAspectRatio").prop('checked') ? ol.events.condition.always : undefined,
             translate: $("#translate").prop('checked'),
             stretch: $("#stretch").prop('checked'),
             */
        });

        switch (typeVal) {
            case "0":
                return;
                break;
            case "Polygon":
            case "LineString":
            case "Point":
                map1.addInteraction(modify);
                map1.addInteraction(draw);
                map1.addInteraction(snap);
                draw.on("drawend", function(e) {
                    var prop = e["feature"]["D"];
                    prop["_fillColor"] = "rgba(51,122,255,0.7)";
                    //if(editLayer.get("name")==="editLayer-import"){
                    //    editLayer.getSource().addFeature(e["feature"]);
                    //}
                    //featureSelect.setActive(false);
                    featureSelect.getFeatures().clear();
                });
                break;
            case "PolygonHole":
                map1.addInteraction(modify)
                map1.addInteraction(drawhole);
                map1.addInteraction(snap);
                break;
            case "Transform":
                map1.addInteraction(transform);
                map1.addInteraction(snap);
                setHandleStyle();
                break;
            case "Circle":
                map1.addInteraction(circle);
                circle.on("drawend", function(e) {
                    var prop = e["feature"]["D"];
                    prop["_fillColor"] = "rgba(51,122,255,0.7)";
                    featureSelect.getFeatures().clear();
                });


                /*
                map1.on("singleclick",function(evt) {
                    var coord = ol.proj.transform(evt.coordinate,"EPSG:3857","EPSG:4326");
                    console.log(coord);
                    var precisionCircle = ol.geom.Polygon.circular(
                        // WGS84 Sphere //
                        new ol.Sphere(6378137),
                        //[131.423860, 31.911069],
                        coord,
                        2000,
                        // Number of verticies //
                        32).transform('EPSG:4326', 'EPSG:3857');
                    var precisionCircleFeature = new ol.Feature(precisionCircle);
                    drawSource.addFeature(precisionCircleFeature);
                });
                */


                /*
                map1.on("singleclick",function(evt){
                    console.log(ol.proj.transform(evt.coordinate,"EPSG:3857","EPSG:4326"));
                    var coord = evt.coordinate;
                    var circleCenterX = coord[0];//15438034; //the X center of your circle
                    var circleCenterY = coord[1];//4186771; //the Y center of your circle

                    var km = 5;
                    //var circleCenterX = coord1[0];//15438034; //the X center of your circle
                    //var circleCenterY = coord1[1];//4186771; //the Y center of your circle
                    var circleRadius = km * 1179;
                    var pointsToFind = 30;
                    var circleCoords1 = createCirclePointCoords(circleCenterX, circleCenterY, circleRadius, pointsToFind);
                    console.log(circleCoords1);
                    var circlesource = new ol.source.Vector({
                        features: [
                            new ol.Feature({
                                id: 1,
                                geometry: new ol.geom.Polygon([circleCoords1])
                            })
                        ]
                    });
                });
                */

                break;

            case "Dome":
                console.log("Dome");
                map1.addInteraction(modify);
                map1.addInteraction(draw);
                map1.addInteraction(snap);
                draw.on("drawend", function(e) {
                    console.log(draw.domeCoord);
                    var coord = ol.proj.transform(draw.domeCoord,"EPSG:3857","EPSG:4326");
                    console.log(coord);
                    var precisionCircle = ol.geom.Polygon.circular(
                        // WGS84 Sphere //
                        new ol.Sphere(6378137),
                        //[131.423860, 31.911069],
                        coord,
                        115,
                        // Number of verticies //
                        32).transform('EPSG:4326', 'EPSG:3857');
                    var precisionCircleFeature = new ol.Feature(precisionCircle);
                    precisionCircleFeature["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
                    drawSource.addFeature(precisionCircleFeature);
                    //featureSelect.getFeatures().clear();
                });
                break;
            case "Nintoku":
                console.log("Nintoku");
                map1.addInteraction(modify);
                map1.addInteraction(draw);
                map1.addInteraction(snap);
                draw.on("drawend", function(e) {
                    //console.log(draw.nintokuCoord);
                    var hereCoord = draw.nintokuCoord;
                    var nintokuPolygon = [[[15082094.774117399,4104609.5068460507],[15082096.900639175,4104606.4857429783],[15082129.36019615,4104587.9136047],[15082158.916738488,4104572.306140754],[15082183.353193704,4104557.322071505],[15082221.886320226,4104536.908816471],[15082240.82597234,4104525.31045447],[15082280.496823255,4104504.5777457976],[15082308.445844315,4104487.6706930636],[15082337.947520278,4104469.779253533],[15082390.09980167,4104440.8386413353],[15082400.883508094,4104435.93976219],[15082411.651620751,4104431.5952606387],[15082414.815917248,4104431.101141366],[15082416.235399486,4104431.4055465586],[15082418.54266863,4104432.608369839],[15082419.937057696,4104434.1806772905],[15082421.521496361,4104436.447800941],[15082427.009965366,4104454.879444051],[15082430.057861516,4104469.987335986],[15082432.76305801,4104497.395223116],[15082436.589521732,4104520.4220090453],[15082453.457944872,4104593.6575348037],[15082455.966293145,4104602.6447479874],[15082462.9474467,4104618.8700968116],[15082469.593465274,4104643.368812974],[15082476.032643614,4104655.791178121],[15082489.172744228,4104668.0491904155],[15082495.15720876,4104677.123115205],[15082500.388640255,4104702.6481256126],[15082499.844445901,4104707.9955029287],[15082491.42598106,4104724.7911858247],[15082490.097177617,4104733.967353733],[15082491.62370374,4104743.213095668],[15082494.47001047,4104750.056926742],[15082499.26063454,4104754.3726565684],[15082519.594241023,4104765.160360975],[15082535.24421257,4104774.77877781],[15082569.723446434,4104798.321254086],[15082574.513390971,4104802.923017857],[15082581.186626643,4104811.0218469477],[15082592.218740754,4104827.143829122],[15082603.202797184,4104849.9334887816],[15082610.70653026,4104870.5350143723],[15082614.23770702,4104899.575604842],[15082612.742333326,4104927.4677995597],[15082610.699768946,4104945.9617093275],[15082606.097076781,4104962.2840096937],[15082599.436096366,4104979.383390734],[15082594.5711201,4104988.428047911],[15082585.392075567,4105001.1993277944],[15082573.50520068,4105013.6449827263],[15082559.487443242,4105026.256633181],[15082555.819094103,4105029.449688042],[15082550.49415403,4105032.3369536605],[15082524.345005738,4105046.8270806298],[15082517.346961377,4105050.06779451],[15082504.86766149,4105053.6034897193],[15082483.043220563,4105058.4288857896],[15082458.068962704,4105058.338669127],[15082433.7395421,4105054.8248715545],[15082402.254035477,4105044.544120258],[15082394.308519885,4105042.6508389693],[15082376.150814196,4105033.6496001976],[15082361.619949661,4105022.992898947],[15082347.029209228,4105008.4210490733],[15082339.432012385,4104999.8714636876],[15082332.553682752,4104989.7453425243],[15082326.74097972,4104978.98683948],[15082319.7685783,4104963.4278181517],[15082312.197944123,4104941.7673923736],[15082305.404411748,4104903.601544872],[15082305.349247223,4104870.2978359447],[15082303.73963396,4104862.783921267],[15082296.2914638,4104845.7051192774],[15082292.096452475,4104840.226593593],[15082266.467592461,4104831.4093341734],[15082253.543322515,4104823.6211601417],[15082243.834028618,4104807.32036678],[15082240.833312675,4104795.03568187],[15082239.872530354,4104779.7700620275],[15082238.361695852,4104775.928960714],[15082231.004781727,4104764.5550692645],[15082219.358568018,4104750.162790346],[15082202.01088199,4104736.5284958654],[15082187.075004881,4104721.896824502],[15082170.57968637,4104695.066375912],[15082131.000579158,4104659.372154799],[15082110.448062543,4104638.741330116],[15082094.744524784,4104612.8413440487],[15082094.774117399,4104609.5068460507]]]
                    //console.log(nintokuPolygon[0]);
                    var lonPlus = nintokuPolygon[0][0][0] - hereCoord[0] + 300;
                    var latPlus = nintokuPolygon[0][0][1] - hereCoord[1] + 200;
                    console.log(lonPlus,latPlus);
                    for(var i = 0; i <nintokuPolygon[0].length; i++){
                        var coord = nintokuPolygon[0][i];
                        console.log(coord)
                        coord = [coord[0] - lonPlus,coord[1] - latPlus];
                        //console.log(coord)
                        nintokuPolygon[0][i] = coord;
                    }
                    var nintokuFeature = new ol.Feature({
                        geometry: new ol.geom.Polygon(nintokuPolygon)
                    });
                    nintokuFeature["D"]["_fillColor"] = "rgba(51,122,255,0.7)";
                    drawSource.addFeature(nintokuFeature);
                });
                break;
        }
    }

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

        transform.set('translate', interactionTransform.get('translate'));
    }

    //drawhole.setActive(false);
    //フィーチャーセレクト
    var featureSelect = new ol.interaction.Select({
        layers:function(layer){
            return layer.get("selectable") == true;
        },
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.8)'
            }),
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2
            }),
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                    color:"red"
                }),
                stroke: new ol.style.Stroke({
                    color: "white",
                    width: 1
                }),
                points:5,
                radius: 16,
                radius2: 8,
                angle:0
            }),
            text: new ol.style.Text({
                font: "14px sans-serif",
                text: "選",
                fill: new ol.style.Fill({
                    color:"white"
                }),
                offsetY:0,
                /*
                 stroke: new ol.style.Stroke({
                 color: "white",
                 width: 3
                 })
                 */
            })
            /*
            image: new ol.style.Circle({
                radius: 20,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                }),
                stroke: new ol.style.Stroke({
                    color: "white",
                    width: 1
                })
            })
            */
        })
    });

    featureSelect.on("select", function(e) {
        var features = e.selected;
        console.log(features);
        selectedFeature = features[0];
        $(".prop-input-text-name").val("");
        $(".prop-input-text-val").val("");
        if(!features) return;
        var prop = features[0].getProperties();
        console.log(prop);
        var i = 0;
        for(key in prop){
            //console.log(prop[key]);
            //console.log(key);
            if(key!=="geometry" && key.substr(0,1)!=="_"){
                console.log(key);
                $(".prop-input-text-name").eq(i).val(key);
                $(".prop-input-text-val").eq(i).val(prop[key]);
                i++
            }
        }
    });

    //ドロータイプ選択
    $("body").on("change","#drawType",function(){
        map1.removeInteraction(modify);
        map1.removeInteraction(draw);
        map1.removeInteraction(drawhole);
        map1.removeInteraction(snap);
        map1.removeInteraction(transform);
        map1.removeInteraction(circle);
        map1.removeInteraction(featureSelect);
        featureSelect.getFeatures().clear();
        addInteractions();
        $(".drawSelect").val("off");
        $(".drawSelect").css({
            color:"black"
        })
    });
    //フィーチャー選択
    $("body").on("change",".drawSelect",function(){
        var val = $(this).val();
        $(".drawSelect").val(val);
        var interactions = map1.getInteractions().getArray();
        var DragRotateAndZoomInteraction = interactions.filter(function(interaction) {
            return interaction instanceof ol.interaction.DragRotateAndZoom;
        })[0];
        if (val === "on"){
            map1.removeInteraction(modify);
            map1.removeInteraction(draw);
            map1.removeInteraction(drawhole);
            map1.removeInteraction(snap);
            map1.removeInteraction(transform);
            map1.removeInteraction(circle);
            map1.addInteraction(featureSelect);
            $("#drawType").val("0");
            $(".drawSelect").css({
                color:"red"
            });
            DragRotateAndZoomInteraction.setActive(false);
        }else{
            map1.addInteraction(modify);
            map1.addInteraction(draw);
            map1.removeInteraction(drawhole);
            map1.addInteraction(snap);
            map1.removeInteraction(featureSelect);
            $(".drawSelect").css({
                color:"black"
            });
            DragRotateAndZoomInteraction.setActive(true);
        }
    });
    //色設定
    $("body").on("change","#cdrawColor",function(){

    });
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
    $(window).keyup(function(e){
        var keycode = e.keyCode;
        console.log(keycode);
        //var focusTagName = $(":focus")[0].tagName;
        //console.log(focusTagName);
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
            case 27:
                console.log(draw.nbpts);
                //draw.removeLastPoint();
                console.log(draw);
                if (draw.nbpts>1) draw.removeLastPoint();

                /*
                try {
                    if (draw.nbpts>=1) draw.removeLastPoint();
                }catch(e){
                    console.log("er")
                }
                */
                break;
        }
    });
    //------------------------------------------------------------------------------------------------------------------
    //geojsonで保存
    $("body").on("click","#drawGeojson-btn",function(){
    //$("#drawGeojson-btn").click(function(){
        var features = drawSource.getFeatures();
        console.log(features);
        if(!features.length) {
            alert("データがありません。");
            return;
        }

        var geojsonChar = new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: "EPSG:3857"
        });
        console.log(geojsonChar);
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
                if(key!=="geometry" && key.substr(0,1)!=="_") {
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
            var geoType = features[i].getGeometry().getType() + ",";
            content += geoType;

            console.log(isNaN(lonlat[0]));
            if(isNaN(lonlat[0])) lonlat = ["",""];

            var coordString = '"' + JSON.stringify(coord) + '"';
            var fillColor = '"' + prop["_fillColor"] + '"';
            if(!fillColor) fillColor = "-";
            if(lonOld) {
                if (Math.abs(lonDifference) > 0.000001 || Math.abs(latDifference) > 0.000001) {
                    //console.log("変化");
                    content += lonlat;
                    content += "," + coordString;
                    content += "," + fillColor;
                    content += ",移動\n"
                } else {
                    //console.log("nasi");
                    content += Number(lonOld) + "," + Number(latOld);
                    content += "," + coordString;
                    content += "," + fillColor;
                    content += ",-\n";
                }
            }else{
                content += lonlat;
                content += "," + coordString;
                content += "," + fillColor;
                content += ",-\n"
            }
            if(i===0) {
                header = header + "_type,経度,緯度,_coord,_fillColor,移動" + "\n";
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

    //ドラッグアンドドロップでレイヤーを作る
    dragAndDrop.on('addfeatures', function(event) {
        map1.removeLayer(drawLayer);
        //drawSource = new ol.source.Vector();
        var fileExtension = event["file"]["name"].split(".")[event["file"]["name"].split(".").length - 1]
        console.log(fileExtension);

        //if(fileExtension!=="geojson") return;

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
    var geojsonRead = function(event) {
        drawSource = new ol.source.Vector({
            features: event.features
        });
        drawLayer.setSource(drawSource);
        drawLayer.set("altitudeMode","clampToGround");
        map1.addLayer(drawLayer);
        map1.getView().fit(drawSource.getExtent());
        drawLayer.setZIndex(9999);
        drawLayer.set("selectable",true);
        var modify = new ol.interaction.Modify({source:drawSource});
        map1.addInteraction(modify);
        var snap = new ol.interaction.Snap({source:drawSource});
        map1.addInteraction(snap);
    };

    //-------------------------------------------------------------------------------------
    var csvRead = function(file){
        drawSource = new ol.source.Vector();
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
            console.log(result); //csvデータ(string)

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
            console.log(result.indexOf("\r\n"));
            console.log(result.indexOf("\n"));
            console.log(result.indexOf("\r"));

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

            var csvlon,csvlat;
            var csvType = "";
            var columnAr = [];
            var csvGeoType = null;
            var csvCoord = null;
            var csvFillColor = null;
            for(var i = 0; i <headerAr.length; i++){
                //console.log(headerAr[i])
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
                if(split[0]) {//先頭列に何も書いていないときは抜ける。
                    csvarr.push(split);
                }else{
                    return false;
                }
            });
            cityObjAr = [];
            var cityCode = null;
            suuti = null;
            iro = null;
            inChar = "";
            valueAr = [];
            console.log(csvarr);
            for (var i=0; i < csvarr.length; i++) {
                if(i===0) {
                    /*
                    for (var j = 0; j < csvarr[0].length; j++) {
                        //-------------------------------------------
                        if (csvarr[0][j] === "市町村コード") cityCode = j;
                        if (csvarr[0][j] === "数値") suuti = j;
                        if (csvarr[0][j] === "色") iro = j;
                        if (csvarr[0][j] === "色"){
                            csvType = "city";
                        }
                        //-------------------------------------------
                        //ドローのcsv用
                        if (csvarr[0][j] === "経度") csvlon = j;
                        if (csvarr[0][j] === "緯度") csvlat = j;

                        if (csvarr[0][j] === "_type") csvGeoType = j;
                        if (csvarr[0][j] === "_coord") csvCoord = j;
                        if (csvarr[0][j] === "経度"){
                            csvType = "draw";
                        }
                        columnAr.push(csvarr[0][j])
                    }
                    */
                }else{
                    //-----------------------------------------------
                    switch (csvType) {
                        case "city":
                            var obj = {
                                "citycode": csvarr[i][cityCode],
                                "prop": {
                                    "citycode": csvarr[i][cityCode],
                                    "suuti": csvarr[i][suuti],
                                    "iro": csvarr[i][iro]
                                }
                            };
                            break;
                        case "draw":
                            var geoType = csvarr[i][csvGeoType];
                            console.log(geoType);
                            var lonlat = [Number(csvarr[i][csvlon]),Number(csvarr[i][csvlat])];
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
                                console.log(fillColor);
                                newFeature["D"]["_fillColor"] = fillColor;
                            }else{
                                newFeature["D"]["_fillColor"] = "blue";
                            }
                            //newFeature["D"]["_fillColor"] = "red";
                            for(var j = 0; j <columnAr.length; j++){
                                console.log(columnAr[j])
                                if(columnAr[j].substr(0,1)!=="_") newFeature["D"][columnAr[j]] = csvarr[i][j]
                            }
                            //console.log(newFeature);
                            //editLayer.getSource().addFeature(newFeature);
                            drawSource.addFeature(newFeature);
                            break;
                    }
                    cityObjAr.push(obj);
                    //-----------------------------------------------
                    if(csvarr[i][cityCode]){
                        inChar += "," + csvarr[i][cityCode];
                        valueAr.push(csvarr[i][suuti]);
                    }
                }
            }
            switch (csvType) {
                case "city":
                    $("#modal-div").modal();
                    break;
                case "draw":
                    drawLayer.setSource(drawSource);
                    drawLayer.set("altitudeMode","clampToGround");
                    map1.addLayer(drawLayer);
                    map1.getView().fit(drawSource.getExtent());
                    drawLayer.setZIndex(9999);
                    drawLayer.set("selectable",true);
                    var modify = new ol.interaction.Modify({source:drawSource});
                    map1.addInteraction(modify);
                    var snap = new ol.interaction.Snap({source:drawSource});
                    map1.addInteraction(snap);
                    break;
            }
        };
    }
});

