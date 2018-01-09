if (typeof H_START === 'undefined') {
    var H_START = {};
}
var map1 = null,map2 = null;//
$(function(){
    //--------------------------------------------------------------------------
    //起動時に画面リサイズ、部品リサイズ
    $("#map1").height($(window).height());
    $(window).on('resize',function(){
        $("#map1,#map2").height($(window).height());
        funcResize();
        //$(document).snowfall('clear');
    });
    funcResize();
    function funcResize() {
        if ($("body").width() < 400) {
            $(".data-btn").text("d");
            $(".dropdown-div").hide();
            $(".osm-dropdown-div").hide();
            $(".draw-btn").hide();
            $(".top-left-div button,.top-div button,#sync-btn").addClass("btn-sm");
        }else if($("body").width() < 475) {
            $(".osm-dropdown-div").hide();
            $(".draw-btn").hide();
            $(".top-left-div button,.top-div button,#sync-btn").addClass("btn-sm");
        } else {
            $(".data-btn").text("data").show();
            $(".dropdown-div").show();
            $(".osm-dropdown-div").show();
            $(".draw-btn").show();
            $(".top-left-div button,.top-div button,#sync-btn").removeClass("btn-sm");
        }
    }

    //--------------------------------------------------------------------------
    //bootstrapのtooltip スマホタッチでタッチが二回必要になるので見送り
    //$('[data-toggle="tooltip"]').tooltip({html:true,container:"body"});
    //--------------------------------------------------------------------------
    /*
    if ($("body").width() > 400) {
        var msg = "";
        msg += "<div style='text-align:center;margin-bottom:10px;'><span class='label label-default label-danger'>New</span></div>";
        msg += "★背景のうち(MVT/VT)とついているものは3D化できません！<br>";
        msg += "★詳しい追加情報等は<a href='https://www.facebook.com/hinatagis' target='_blank'><i class='fa fa-facebook-square fa-fw' style='color:navy;'></i>FBへ</a><br>";
        msg += "1 背景に全国海岸線(MVT)を追加しました。<br>";
        msg += "2 背景に大阪府の古地図を追加しました。<br>";
        msg += "3 背景に岡山県、広島県、愛知県、兵庫県の古地図を追加しました。<br>";
        //msg += "4 ドロー機能大幅強化中。「図形」ボタンから<br>";
        //msg += "5 シームレス地質図V2でクリックすると凡例を表示します。<br>";
        msg += "<div style='text-align:center;'>";
        msg += "宮崎県情報政策課<br>最終更新:2017/12/25</div>";
        msg += "<div style='position:absolute;bottom:0px;right:0px;'><a href='https://www.osgeo.jp/' target='_blank'><img src='icon/osgeo.png' style='width:80px;background:'></a></div>";
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
            timer: 0
        });
    }
    */
    //webストレージから中陣地座標、ズーム率を取得
    /*
    var urlHash = location.hash;
    console.log(urlHash);
    if(urlHash) {
        console.log(urlHash);
        var zoom = urlHash.split("/")[0];
        var lon = urlHash.split("/")[2];
        var lat = urlHash.split("/")[1];
        console.log(lon)
        var center = ol.proj.fromLonLat([lon,lat]);
    }else{
        var center = JSON.parse(localStorage.getItem("lonlat"));
        var zoom = localStorage.getItem("zoom");
    }
    //var center = JSON.parse(localStorage.getItem("lonlat"));
    //var zoom = localStorage.getItem("zoom");

    */

    //var center = null;
    //var zoom = null;

    //var center = JSON.parse(localStorage.getItem("lonlat"));
    //var zoom = localStorage.getItem("zoom");
/*
    if(center==undefined){
        //center = ol.proj.fromLonLat([131.423860,31.911069]);//中心地を宮崎市に
        center = ol.proj.fromLonLat([140.097,37.856]);//中心地を宮崎市に
    }
    if(zoom==undefined){
        //zoom = 14;
        zoom = 6;
    }
    */
    var view1 = new ol.View({
        center:ol.proj.fromLonLat([140.097,37.856]),
        zoom:6
    });
    var DragRotateAndZoom = new ol.interaction.DragRotateAndZoom();//shift+ドラッグで回転可能に
    //id map1に起動時に表示されるレイヤーをセット
    map1 = new ol.Map({
        target:"map1",
        layers:[mieruneNormal1],
        //layers:[pale1],
        view:view1,
        interactions:ol.interaction.defaults({doubleClickZoom:false}).extend([
            DragRotateAndZoom
        ])
    });
    map2 = new ol.Map({
        target:"map2",
        layers:[mieruneNormal2],
        //layers:[pale2],
        view:view1,//最初はview1
        interactions:ol.interaction.defaults({doubleClickZoom:false}).extend([
            DragRotateAndZoom
        ])
    });
    //DragRotateAndZoom.setActive(false);
    //--------------------------------------------------------------------------
    //デフォルトで設定されているインタラクション（PinchRotate）を使用不可に
    var interactions1 = map1.getInteractions().getArray();
    var pinchRotateInteraction1 = interactions1.filter(function(interaction) {
        return interaction instanceof ol.interaction.PinchRotate;
    })[0];
    pinchRotateInteraction1.setActive(false);
    //map2---
    var interactions2 = map2.getInteractions().getArray();
    var pinchRotateInteraction2 = interactions2.filter(function(interaction) {
        return interaction instanceof ol.interaction.PinchRotate;
    })[0];
    pinchRotateInteraction2.setActive(false);
    //--------------------------------------------------------------------------
    //スワイプコントロール　後の処理はlayer-00.jsのfuncHaikeiLayerSort()に
    H_START.swipeCtr1 = new ol.control.Swipe();
    H_START.swipeCtr2 = new ol.control.Swipe();
    //--------------------------------------------------------------------------
    //中心の十字を作る.
    var style =	[{
        stroke: new ol.style.Stroke({
            color:"black",
            width:2
        }),
        radius: 15
    }];
    H_START.centerTarget1 =  new ol.control.Target ({style:style});
    H_START.centerTarget2 =  new ol.control.Target ({style:style});
    map1.addControl(H_START.centerTarget1);
    map2.addControl(H_START.centerTarget2);
    //--------------------------------------------------------------------------
    //カーソル同期
    /*
    map1.addInteraction(new ol.interaction.Synchronize({maps:[map2]}));
    map2.addInteraction(new ol.interaction.Synchronize({maps:[map1]}));
    */
    //--------------------------------------------------------------------------
    //現在地取得
    var hele1 = new ol.control.Button ({
            html: "<i class='fa fa-map-marker'></i>",//<i class="fa fa-smile-o"></i>',
            className: "here-btn",
            title: "現在地取得",
            handleClick: function(e) {
                getHere("map1")
            }
    });
    map1.addControl(hele1);
    //------------------
    var hele2 = new ol.control.Button ({
        html: "<i class='fa fa-map-marker'></i>",//<i class="fa fa-smile-o"></i>',
        className: "here-btn",
        title: "現在地取得",
        handleClick: function(e) {
            getHere("map2")
        }
    });
    map2.addControl(hele2);
    //--------------------------------------------------------------------------
    //マップイベント関係
    //ムーブエンド時にwevストレージに中心座標とズーム率を記憶
    map1.on("moveend",function(evt){
        /*
        localStorage.setItem("lonlat",JSON.stringify(map1.getView().getCenter()));
        localStorage.setItem("zoom",map1.getView().getZoom());
        localStorage.setItem("href",location["href"]);//URLも記憶
        */
        $("#map1 .zoom-div .zoom-span").text("zoom=" + Math.floor(map1.getView().getZoom()));
    });
    map2.on("moveend",function(evt){
        $("#map2 .zoom-div .zoom-span").text("zoom=" + Math.floor(map2.getView().getZoom()));
    });
    //ムーブ時に標高取得。
    map1.on("pointermove",function(evt){
        funcElevation(evt,"map1");
        funcMouseMessage(evt,"map1");
    });
    map2.on("pointermove",function(evt){
        funcElevation(evt,"map2");
        funcMouseMessage(evt,"map2");
    });
    //---------------------------------------------------------------------------
    function funcMouseMessage(evt,mapName){
        $("#mouseMessage").text("");
        var map2Top = 0;
        var map2Left = 0;
        if(mapName==="map2") {
            map2Top = $("#map2").offset().top;
            map2Left = $("#map2").offset().left;
        }
        $("#mouseMessage").animate({
            top:evt.pixel[1] + 0 + map2Top,
            left:evt.pixel[0] + 15 + map2Left
        },0);
        var pixel = eval(mapName).getPixelFromCoordinate(evt.coordinate);
        var features = [];
        var layers = [];
        eval(mapName).forEachFeatureAtPixel(pixel,function(feature,layer){
            features.push(feature);
            layers.push(layer);
        });
        if(!features.length) return;
        var layer = layers[layers.length-1];
        if(!layer) return;
        var feature = features[features.length-1];//最後のfeatureを取得している。レイヤーが重なったとき問題があるかも。
        var layerName = layer.getProperties()["name"];
        if(layerName==="tunamimiyazaki"){
            if(feature.getProperties()["H_M"]) {
                $("#mouseMessage").text(feature.getProperties()["H_M"] + "メートル");
            }else{
                $("#mouseMessage").text(feature.getProperties()["A40_003"]);
            }
        }
        if(layerName==="tunamihokkaidou"){
            if(feature.getProperties()["MAX_SIN"]) {
                $("#mouseMessage").text(feature.getProperties()["MAX_SIN"] + "メートル");
            }else{

            }
        }
    }
    //---------------------------------------------------------------------------
    function funcElevation(evt,mapName){
        getElev(evt.coordinate,mapName,function(h){
            if(h=="e"){
                $("#" + mapName + " .zoom-div .elevation-span").text("");
            }else{
                var elevationChar = " 標高:" + h + "m";
                $("#" + mapName + " .zoom-div .elevation-span").text(elevationChar);
            }
        });
    }
    //--------------------------------------------------------------------------
    //ピンチ時の回転を制御
    $("body").on("change",".rotate-toggle",function(){
        var interactions1 = map1.getInteractions().getArray();
        var pinchRotateInteraction1 = interactions1.filter(function(interaction) {
            return interaction instanceof ol.interaction.PinchRotate;
        })[0];
        //map2---
        var interactions2 = map2.getInteractions().getArray();
        var pinchRotateInteraction2 = interactions2.filter(function(interaction) {
            return interaction instanceof ol.interaction.PinchRotate;
        })[0];
        if($(this).prop("checked")){
            pinchRotateInteraction1.setActive(false);
            pinchRotateInteraction2.setActive(false);
        }else{
            pinchRotateInteraction1.setActive(true);
            pinchRotateInteraction2.setActive(true);
        }
    });
    //--------------------------------------------------------------------------
    //OSM
    $("body").on("click",".osm-btn",function() {
        var mapObj = funcMaps($(this));
        var mapName = mapObj["name"];
        var zoom = Math.floor(eval(mapName).getView().getZoom());
        var coord = ol.proj.transform(eval(mapName).getView().getCenter(),"EPSG:3857","EPSG:4326");
        var url = "http://www.openstreetmap.org/edit#map=" + zoom + "/" + coord[1] + "/" + coord[0];
        window.open(url,'_blank')
    });
    //--------------------------------------------------------------------------
    //現在地取得
    function getHere(mapName) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    eval(mapName).getView().setCenter(ol.proj.transform([position.coords.longitude, position.coords.latitude], "EPSG:4326", "EPSG:3857"));
                },
                function () {
                    alert("座標を取得できませんでした。.")
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000
                }
            );
        } else {
            alert("お使いのブラウザには座標取得機能がありません。")
        }
    }
    //------------------------------------------------------------------------
    ol.hash(map1);
    ol.hash(map2);
    //------------------------------------------------------------------------

    /*
    $(document).snowfall({
        flakeCount : 100,
        flakeColor : "lavender",
        minSize : 1,
        maxSize : 8,
        minSpeed : 1,
        maxSpeed : 3,
        round : true,
        collection : ".addres-input"
    });
    */
});
