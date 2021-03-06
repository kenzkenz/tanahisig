var ol3d1 = null;
var ol3d2 = null;
var prevTilt = 0.5;
var d3Flg = true;
$(function(){
    $(".elevMag-text").spinner({
        max:10, min:1, step:1,
        stop:function(event,ui){
            //syoutiikiColorChange(ui.value,mapName);
            var mapObj = funcMaps($(this));
            var mapName = mapObj["name"];
            console.log(mapName)
            console.log(ui.value)
            if(mapName==="map1") {
                var scene = ol3d1.getCesiumScene();
            }else{
                var scene = ol3d2.getCesiumScene();
            }
            var terrain = new Cesium.PngElevationTileTerrainProvider({
                url:"https://gsj-seamless.jp/labs/elev2/elev/gsi10m_latlng_257/{z}/{y}/{x}.png",
                tilingScheme: new Cesium.GeographicTilingScheme(),
                magnification:Number($(this).val())
            });
            scene.terrainProvider = terrain;
        }
    });

    //3Dボタン
    $(".d3d2-btn").click(function(){
        //カーソルシンクロを削除---------------------------------------
        /*
        var maps = [map1,map2];
        for(var i = 0; i <maps.length; i++) {
            var interactions = maps[i].getInteractions().getArray();
            for (var j = 0; j < interactions.length; j++) {
                var interaction = interactions[j];
                if (interaction instanceof ol.interaction.Synchronize) maps[i].removeInteraction(interaction);
            }
        }
        */
        //----------------------------------------------------------
        var mapObj = funcMaps($(this));
        var mapName = mapObj["name"];
        var layers = eval(mapName).getLayers().getArray();
        console.log(layers);
        for (j = 0; j < layers.length; j++) {
            console.log(layers[j].getProperties());
            console.log(String(layers[j].getProperties()["title"]).indexOf("MVT"));
            if(String(layers[j].getProperties()["title"]).indexOf("MVT")==-1) {
                console.log("非MVT")
            }else{
                console.log("MVT")
                alert("MVTは3D化できません！MVTの背景のチェックを外してください。");
                return;
            }
        }

        if($(this).text()==="3D"){

            $("#" + mapName + " .cesium-btn-up").show(500);
            $("#" + mapName + " .cesium-btn-down").show(500);
            $("#" + mapName + " .elevMag").show(500);

            if(d3Flg) {
                $.notify({//options
                    message: "<div style='text-align:center;'><i class='fa fa-exclamation fa-fw'></i>十字コントーラーはドラッグで移動可能です。</div>"
                }, {//settings
                    type: "info",
                    z_index: 999999,
                    placement: {
                        from: "top",
                        align: "center"
                    },
                    animate: {
                        enter: "animated fadeInDown",
                        exit: "animated fadeOutUp"
                    }
                });
                d3Flg = false;
            }
            if(ol3d1==null){
                ol3d1 = new olcs.OLCesium({
                    map:map1
                });
                var scene1 = ol3d1.getCesiumScene();

                var terrain = new Cesium.PngElevationTileTerrainProvider({
                    url:"https://gsj-seamless.jp/labs/elev2/elev/gsi10m_latlng_257/{z}/{y}/{x}.png",
                    //url:"https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png",
                    tilingScheme: new Cesium.GeographicTilingScheme(),
                    magnification:1
                });
                /*
                terrain = new Cesium.CesiumTerrainProvider({
                    url: 'https://assets.agi.com/stk-terrain/world'
                });
                */

                scene1.terrainProvider = terrain;
                scene1.screenSpaceCameraController._minimumZoomRate = 1;//10000
                // ズームしたときの，ホイールに対する動作制御。
                scene1.screenSpaceCameraController.minimumZoomDistance = 10;
                // めり込みにくくするためズーム制限
                //scene.screenSpaceCameraController.minimumCollisionTerrainHeight=10;
                scene1.terrainProvider.heightmapTerrainQuality = 0.1;
                scene1.terrainProvider.hasVertexNormals = false;
                scene1.terrainProvider.hasWaterMask = false;
                scene1.globe.depthTestAgainstTerrain = true;//trueにすると地形より下のフューチャーは見えないようになる。
                //--------------------------------------------------------------------------
                ol3d2 = new olcs.OLCesium({
                    map:map2
                });
                var scene2 = ol3d2.getCesiumScene();
                var terrain = new Cesium.PngElevationTileTerrainProvider({
                    url:"https://gsj-seamless.jp/labs/elev2/elev/gsi10m_latlng_257/{z}/{y}/{x}.png",
                    tilingScheme: new Cesium.GeographicTilingScheme(),
                    magnification:1
                });
                scene2.terrainProvider = terrain;
                scene2.screenSpaceCameraController._minimumZoomRate = 1;
                scene2.screenSpaceCameraController._minimumZoomRate = 1;//10000
                scene2.screenSpaceCameraController.minimumZoomDistance = 10;
                scene2.terrainProvider.heightmapTerrainQuality = 0.1;
                scene2.terrainProvider.hasVertexNormals = false;
                scene2.terrainProvider.hasWaterMask = false;
                scene2.globe.depthTestAgainstTerrain = true;//trueにすると地形より下のフューチャーは見えないようになる。
            }
            //----------------------------------------------------------------
            var ol3d = eval(mapObj["ol3d"]);
            //ol3d.setEnabled(true);
            mapObj["element"].find(".cesium-btn-div").show(500);
            var tiltI = 0;
            ol3d.getCamera().setTilt(0);
            ol3d.setEnabled(true);

            H_COMMON.setHush("3d",H_COMMON.getHush3dJson());

            console.log(ol3d.getEnabled());

            function cTilt(){
                tiltI++;
                ol3d.getCamera().setTilt(prevTilt/10*tiltI);
                var st = setTimeout(function(){cTilt()},50);
                if(tiltI>=10){
                    clearTimeout(st);
                }
            }
           // cTilt();
            $(this).text("2D");
            //estatLayer
            var estatLayer = eval("estatLayer" + mapName);
            if(estatLayer){
                var features = eval("estatLayer" + mapName).getSource().getFeatures();
                console.log(features);
                czmlCreate(features,$(this));
            }
            /*
            if(mapName==="map1") {
                var mobakuu = mobakuu1;
            }else{
                //var resasLayer = resasLayermap2;
            }
            if(mobakuu){
                var features = mobakuu.getSource().getFeatures();
                console.log(features);
                czmlCreate(features,$(this));
            }
            */
            if(dataLayer["map1-kyuusyuuCity"]){
                var features = dataLayer["map1-kyuusyuuCity"].getSource().getFeatures();
                console.log(features);
                czmlCreate(features,$(this));

            }
            //resasLayer
            if(mapName==="map1") {
                var resasLayer = resasLayermap1;
            }else{
                var resasLayer = resasLayermap2;
            }
            if(resasLayer){
                var features = resasLayer.getSource().getFeatures();
                console.log(features);
                czmlCreate(features,$(this));
            }
            /*
            if(mapName==="map1") {
                var csvLayer = csvLayer1;
            }else{
                var csvLayer = csvLayer2;
            }
            if(csvLayer){
                var features = csvLayer.getSource().getFeatures();
                console.log(features);
                czmlCreate(features,$(this));
            }
            */

            /*右クリック人口用　しばらく退場
            //mesh500
            if(mapName==="map1") {
                var mesh500Layer = mesh500Layer1;
            }else{
                var mesh500Layer = mesh500Layer2;
            }
            if(mesh500Layer){
                var features = mesh500Layer.getSource().getFeatures();
                console.log(features);
                czmlCreate(features,$(this));
            }
            */


            //ドロー関係
            if(H_DRAW.drawLayer){
                //H_DRAW.rightClickedFeatyure = null;
                //H_DRAW.drawLayer.getSource().changed();
                var features = H_DRAW.drawLayer.getSource().getFeatures();
                H_DRAW.drawContextmenuOverlay.setPosition(null);

                if(features.length) czmlCreate(features,$(this));
            }
            //選挙区
            if(dataLayer["map1-senkyoku"]){
                var features = dataLayer["map1-senkyoku"].getSource().getFeatures();
                console.log(features);
                czmlCreate(features,$(this));
            }
        }else{//2Dになるとき
            //カーソルシンクロを復活---------------------------------------
            /*
            map1.addInteraction(new ol.interaction.Synchronize({maps:[map2]}));
            map2.addInteraction(new ol.interaction.Synchronize({maps:[map1]}));
            */
            //----------------------------------------------------------
            $("#" + mapName + " .cesium-btn-up").hide(500);
            $("#" + mapName + " .cesium-btn-down").hide(500);
            $("#" + mapName + " .elevMag").hide(500);
            var ol3d = eval(mapObj["ol3d"]);
            //ol3d.setEnabled(false);
            mapObj["element"].find(".cesium-btn-div").hide(500);
            var tiltI = 0;
            prevTilt = ol3d.getCamera().getTilt();//2dになる直前に３ｄのチルトを記憶
            function cTilt2(){
                tiltI++;
                ol3d.getCamera().setTilt(prevTilt-(prevTilt/10*tiltI));
                var st = setTimeout(function(){cTilt2()},10);
                if(tiltI>=10){
                    clearTimeout(st);
                    ol3d.getCamera().setTilt(0);
                    ol3d.setEnabled(false);
                    H_COMMON.setHush("3d",H_COMMON.getHush3dJson());
                }
            }
            cTilt2();
            $(this).text("3D");

            if($("#mydialog-draw-dialog")) $("#mydialog-draw-dialog").show();//ドローダイアログがあったら表示する。


        }

    });
    //------------------------------------------------------------

    $(".elevMag-text").change(function(){
        var scene1 = ol3d1.getCesiumScene();
        var terrain = new Cesium.PngElevationTileTerrainProvider({
            url:"https://gsj-seamless.jp/labs/elev2/elev/gsi10m_latlng_257/{z}/{y}/{x}.png",
            tilingScheme: new Cesium.GeographicTilingScheme(),
            magnification:Number($(this).val())
        });
        scene1.terrainProvider = terrain;
    });
    //--------------------------------------------------------------------------
    //セシウム操作ボタンを移動可能に
    $(".cesium-btn-div").draggable({
        stop:function(){
                $(this).css({"height":"","with":""});
            }
    });
    //-------------------------------------------------------------------------
    //チルト
    var tiltFlg = false;
    //仰角----------------------------------------------------------------------
    $("body").on("mousedown",".cesium-btn-up,.cesium-btn-down",function(){
        var mapObj = funcMaps($(this));
        var mapName = mapObj["name"];
        var text = $("#" + mapName + " .d3d2-btn").text();
        if(text==="3D"){
            alert("MVT時は3D操作できません。");
        }else {
            var ol3d = eval(mapObj["ol3d"]);
            tiltFlg = true;
            var tiltUp = function (upDown) {
                if (tiltFlg) {
                    var tilt = ol3d.getCamera().getTilt();
                    if (upDown == "up") {
                        if ($("#sync-btn").text() == "非同期") {//起動時はこっち
                            if (tilt < 1.5) ol3d1.getCamera().setTilt(tilt + 0.05);
                            if (tilt < 1.5) ol3d2.getCamera().setTilt(tilt + 0.05);
                        } else {
                            if (tilt < 1.5) ol3d.getCamera().setTilt(tilt + 0.05);
                        }
                    } else {
                        if ($("#sync-btn").text() == "非同期") {//起動時はこっち
                            if (tilt > 0) ol3d1.getCamera().setTilt(tilt - 0.05);
                            if (tilt > 0) ol3d2.getCamera().setTilt(tilt - 0.05);
                        } else {
                            if (tilt > 0) ol3d.getCamera().setTilt(tilt - 0.05);
                        }
                    }
                    H_COMMON.setHush("3d",H_COMMON.getHush3dJson());
                    setTimeout(function () {
                        tiltUp(upDown)
                    }, 20);
                } else {
                    clearTimeout(tiltUp);
                }
            };
            if ($(this).attr("class").match("cesium-btn-up")) {
                tiltUp("up");
            } else {
                tiltUp("down");
            }
        }
        return false;
    }).mouseup(function(){
        tiltFlg = false;
    }).mouseleave(function(){
        tiltFlg = false;
    });
    //左右回転------------------------------------------------------------------
    $("body").on("mousedown",".cesium-btn-left,.cesium-btn-right",function(){
        var mapObj = funcMaps($(this));
        var mapName = mapObj["name"];
        var text = $("#" + mapName + " .d3d2-btn").text();
        console.log(text);
        if(text==="3D"){
            tiltFlg = true;
            var tiltLeft = function(leftRight){
                if(tiltFlg){
                    var rotate = eval(mapName).getView().getRotation();
                    if(leftRight=="left"){
                        eval(mapName).getView().setRotation(rotate-0.1);
                    }else{
                        eval(mapName).getView().setRotation(rotate+0.1);
                    }
                    setTimeout(function(){tiltLeft(leftRight)},20);
                }else{
                    clearTimeout(tiltLeft);
                }

            };
            if($(this).attr("class").match("cesium-btn-left")){
                tiltLeft("left");
            }else{
                tiltLeft("right");
            }

        }else{
            var ol3d = eval(mapObj["ol3d"]);
            tiltFlg = true;
            var tiltLeft = function(leftRight){
                if(tiltFlg){
                    var head = ol3d.getCamera().getHeading();
                    if(leftRight=="left"){
                        ol3d.getCamera().setHeading(head - 0.05);
                    }else{
                        ol3d.getCamera().setHeading(head + 0.05);
                    }
                    setTimeout(function(){tiltLeft(leftRight)},20);
                }else{
                    clearTimeout(tiltLeft);
                }
                H_COMMON.setHush("3d",H_COMMON.getHush3dJson());
            };
            if($(this).attr("class").match("cesium-btn-left")){
                tiltLeft("left");
            }else{
                tiltLeft("right");
            }
        }
        return false;
    }).mouseup(function(){
        tiltFlg = false;
    }).mouseleave(function(){
        tiltFlg = false;
    });
});

//------------------------------------------------------------------------------
function czmlCreate(features,element){
    console.log(features[0].getProperties());
    var mapObj = funcMaps(element);
    var ol3d = eval(mapObj["ol3d"]);
    ol3d.getDataSources().removeAll();
    var czml = [{
        "id":"document",
        "version":"1.0"
    }];
    var czmlId = 1;
    for (i=0; i<features.length; i++){
        var multiLength = features[i].getGeometry().getCoordinates().length;
        //console.log(multiLength);//マルチポリゴンのときと穴あきポリゴンのときに１以上になる。
        //czmlは穴あきポリゴンに対応していないらしいので苦肉の作
        var geomType = features[i].getGeometry().getType();
        //if(geomType==="Polygon") multiLength = 1;
        //if(geomType!=="Point" && geomType!=="LineString") {
        if(geomType==="Polygon" || geomType==="MultiPolygon") {
            for (j = 0; j < multiLength; j++) {
                var coordArr2 = [];
                if (geomType !== "MultiPolygon") {//ポリゴンのとき
                    //var coordArr = features[i].getGeometry().getCoordinates()[0];//本当はこっちていい
                    //穴ポリゴンのときは穴の個数だけ余分にポリゴンを作って擬似的に穴ポリゴンに見せかける。
                    var coordArr = features[i].getGeometry().getCoordinates()[j];
                } else {//マルチポリゴンのとき
                    var coordArr = features[i].getGeometry().getCoordinates()[j][0];
                }
                for (k = 0; k < coordArr.length; k++) {
                    var coord = ol.proj.transform(coordArr[k], "EPSG:3857", "EPSG:4326");
                    coordArr2.push(Number(coord[0]));
                    coordArr2.push(Number(coord[1]));
                    coordArr2.push(0);
                }
                var fillColor = features[i].getProperties()["_fillColor"];
                var fillColorRgb = fillColor.replace("a", "").substr(0, fillColor.lastIndexOf(",") - 1) + ")";
                var color0 = new RGBColor(fillColorRgb);
                var rgba;
                if (features[i].getProperties()["_fillOpacity"]) {
                    rgba = [Number(color0.r), Number(color0.g), Number(color0.b), 150];
                } else {
                    rgba = [Number(color0.r), Number(color0.g), Number(color0.b), 150];
                }
                var polygonHeight = features[i].getProperties()["_h_height"];
                var description = features[i].getProperties()["hover"];
                if (geomType === "Polygon" && j > 0) {
                    rgba = [0, 0, 0, 0];
                    //polygonHeight = Number(polygonHeight) + 100;
                }//穴ポリゴンを透明化して誤魔化す。
                console.log(polygonHeight);
                var d3Polygon = [
                    {
                        "id": czmlId++, "description": description,
                        "polygon": {
                            "extrudedHeight": polygonHeight,
                            "outline": {"boolean": true},
                            "outlineColor": {"rgba": [0, 0, 0, 255]},
                            "material": {
                                "solidColor": {
                                    "color": {
                                        "rgba": rgba
                                    }
                                }
                            },
                            "positions": {
                                "cartographicDegrees": coordArr2
                            }
                        }
                    }
                ];
                //czml =d3Polygon;
                czml.push(d3Polygon[0]);
            }
        }
    }
    //console.log(JSON.stringify(czml));
    //console.log(czml)
    //console.log(czml[1]["polygon"])
    ol3d.getDataSources().add(Cesium.CzmlDataSource.load(
        czml,{
            //camera: scene.camera,
            //canvas: scene.canvas
        }
    ));
}
