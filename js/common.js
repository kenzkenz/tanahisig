if (typeof H_COMMON === 'undefined') {
    var H_COMMON = {};
}
//---------------------------------------------------------------------------------
H_COMMON.ajaxStartFlg = true;
$(document).ajaxStart(function (){
    if(H_COMMON.ajaxStartFlg) {//フラグでの制御はうまくいかないようだ。念の為残しておく。
        $("#loading-fa").show(500);
    }
});
$(document).ajaxStop(function (){
    if(H_COMMON.ajaxStartFlg) {
        $("#loading-fa").hide(500);
    }
});
//----------------------------------------------------------
//URLにハッシュをセット
H_COMMON.setHush = function(key,parameter){
    var href = location["href"].split("#")[0];
    var urlHash = location.hash;
    var hashAr = urlHash.split("&");
    var hashObj= {};
    for(var i = 1; i <hashAr.length; i++){
        var kvAr = hashAr[i].split("=");
        hashObj[kvAr[0]]=kvAr[1]
    }
    var parameters = "";
    var flg = false;
    for(hashObjKey in hashObj){
        if(hashObjKey===key) {
            parameters += "&" + key + "=" + parameter;
            flg = true;
        }else{
            parameters += "&" + hashObjKey + "=" + hashObj[hashObjKey];
        }
    }
    var zxy;
    if(key==="zxy") {
        zxy = parameter;
    }else{
        zxy = hashAr[0];
        if(!flg) parameters += "&" + key + "=" + parameter;
    }
    var newUrl = href + zxy + parameters;
    localStorage.setItem("href",newUrl);//URLも記憶
    history.replaceState(null, null, newUrl);
    return newUrl;
};
//----------------------------------------------------------
//ハッシュからいろいろ復元
H_COMMON.getHush = function() {
    var urlHash = location.hash;
    var hashAr = urlHash.split("&");
    var hashObj= {};
    for(var i = 1; i <hashAr.length; i++){
        var kvAr = hashAr[i].split("=");
        hashObj[kvAr[0]]=kvAr[1]
    }
    //うちのサーバー------------------------------------------
    var uid = hashObj["uid"];
    if(uid){
        $.ajax({
            type: "POST",
            url: "php/jsondb.php",
            dataType: "json",
            data: {
                "uid":uid,
                "drawnGeojson":null
            }
        }).done(function (json) {
            json = JSON.parse(json);
            var targetGeojson = new ol.format.GeoJSON().readFeatures(json, {featureProjection: 'EPSG:3857'});
            H_DRAW.drawLayer.getSource().addFeatures(targetGeojson);
        }).fail(function () {
            console.log("エラー")
        });
    }
    //gist--------------------------------------------------
    /*
    var gist = hashObj["g"];
    if(gist) {
        $.ajax({
            type: "get",
            url: "https://api.github.com/gists/" + gist,
            dataType: "json"
        }).done(function (json) {
            console.log(json);
            var truncated = json["files"]["hinatagis.geojson"]["truncated"];
            var gistGeojson;
            if(!truncated) {//falseのときが通常。APIで普通に取得
                gistGeojson = JSON.parse(json["files"]["hinatagis.geojson"]["content"]);
                if(gistGeojson){
                    var targetGeojson = new ol.format.GeoJSON().readFeatures(gistGeojson, {featureProjection: 'EPSG:3857'});
                    H_DRAW.drawLayer.getSource().addFeatures(targetGeojson);
                }
            }else{//trueのときは別の取得方法を
                var rawUrl = json["files"]["hinatagis.geojson"]["raw_url"];
                $.ajax({
                    type: "get",
                    url: rawUrl ,
                    dataType: "json"
                }).done(function (json) {
                    console.log(json);
                    gistGeojson = json;
                    if(gistGeojson){
                        var targetGeojson = new ol.format.GeoJSON().readFeatures(gistGeojson, {featureProjection: 'EPSG:3857'});
                        H_DRAW.drawLayer.getSource().addFeatures(targetGeojson);
                    }
                }).fail(function () {
                    console.log("失敗!");
                });
            }
        }).fail(function () {
            console.log("失敗!");
        });
    }
    */
    //2画面---------------------------------------------------
    var dual = hashObj["d"];
    if(dual){
        if(dual==="2"){
            $("#map1 .dualscreen-btn").click();
        }
    }
    //レイヤー順----------------------------------------------
    var layerJson = hashObj["l"];
    if(layerJson) {
        layerJson = decodeURI(layerJson);
        layerJson = JSON.parse(layerJson);
        console.log(layerJson);
        var maps = [map1,map2];
        for(var i = 0; i <maps.length; i++) {
            if(maps[i]===map1) {
                useLayersArr = useLayersArr1;
                element =  $("#map1");
            }else{
                useLayersArr = useLayersArr2;
                element =  $("#map2");
            }
            element.find("input:checkbox[name='haikei-check'][value='0']").iCheck("uncheck");
            for(var j = 0; j <layerJson[i].length; j++) {
                var obj = layerJson[i][j];
                var name_J = obj["n"];
                var opacity_J = Number(obj["o"]);
                //var zIndex_J = Number(obj["z"]);
                var useLayersArr;
                var element;



                if (name_J === "plusLayer") {
                    var plusUrl = obj["pu"];
                    var plusName = obj["pn"];
                    var plusLayer = H_layer00.layerPlus(element.find(".top-left-div"),plusUrl,plusName);
                    var tgtTr = element.find(".haikei-tbl tbody tr:first");
                    tgtTr.find(".ui-slider-handle").css({
                        left:String(opacity_J*100) + "%"
                    });
                    plusLayer.setOpacity(opacity_J);
                }



                for(var k = 0; k <useLayersArr.length; k++){
                    var layer = useLayersArr[k];
                    var name;
                    if(!Array.isArray(layer)){
                        name = layer.getProperties()["name"];
                        if (name) {
                            if (name === name_J) {
                                var heikeiCheck = element.find("input:checkbox[name='haikei-check'][value='" + k + "']");
                                heikeiCheck.iCheck("check");
                                var tgtTr = heikeiCheck.parents("tr");
                                tgtTr.find(".ui-slider-handle").css({
                                    left:String(opacity_J*100) + "%"
                                });
                                tgtTr.show();
                                layer.setOpacity(opacity_J);
                                tgtTr.removeClass("tr-" + layer.getProperties()["category"]);
                            }
                        }
                    }else{//配列のとき
                        name = layer[0].getProperties()["name"];
                        if (name) {
                            if (name === name_J) {
                                var heikeiCheck = element.find("input:checkbox[name='haikei-check'][value='" + k + "']");
                                heikeiCheck.iCheck("check");
                                var tgtTr = heikeiCheck.parents("tr");
                                tgtTr.find(".ui-slider-handle").css({
                                    left:String(opacity_J*100) + "%"
                                });
                                tgtTr.show();

                                for(var l = 0; l <layer.length; l++){
                                    layer[l].setOpacity(opacity_J);
                                }
                                tgtTr.removeClass("tr-" + layer[0].getProperties()["category"]);
                            }
                        }
                    }
                }
            }
        }
    }
    //レイヤー順ここまで--------------------------------------------
    //3d cesium--------------------------------------------------
    var d3json = hashObj["3d"];
    if(d3json){
        d3json = JSON.parse(decodeURI(d3json));
        console.log(d3json);
        var ol3ds = [ol3d1,ol3d2];
        for(var i = 0; i <ol3ds.length; i++) {
            var obj = d3json[i][0];
            console.log(obj);
            var enabled_J = obj["e"];
            var tilt_J = obj["t"];
            var head_J = obj["h"];

            console.log(enabled_J,tilt_J,head_J);

            if(enabled_J) {
                console.log(i);
                if(i===0) {
                    $("#map1 .d3d2-btn").click();
                    ol3d1.getCamera().setTilt(tilt_J);
                    ol3d1.getCamera().setHeading(head_J);
                    ol3d1.getCamera().setDistance(obj["d"]);
                    ol3d1.getCamera().setAltitude(obj["a"]);
                    ol3d1.getCamera().setPosition(obj["p"]);
                    ol3d1.getCamera().setCenter(obj["c"]);
                }else{
                    $("#map2 .d3d2-btn").click();
                    ol3d2.getCamera().setTilt(tilt_J);
                    ol3d2.getCamera().setHeading(head_J);
                    ol3d2.getCamera().setDistance(obj["d"]);
                    ol3d2.getCamera().setAltitude(obj["a"]);
                    ol3d2.getCamera().setPosition(obj["p"]);
                    ol3d2.getCamera().setCenter(obj["c"]);
                }
            }
        }
    }
    //最後に座標とズームをセット-------------------------------------
    var zxy = hashAr[0];
    if(zxy){
        var zxyAr = zxy.replace("#","").split("/");
        var zoom = Number(zxyAr[0]);
        var lat = Number(zxyAr[1]);
        var lon = Number(zxyAr[2]);
        map1.getView().setZoom(zoom)
        var lonlat = ol.proj.fromLonLat([lon,lat]);
        map1.getView().setCenter(lonlat);
    }
};
//----------------------------------------------------------
//ハッシュ用のレイヤーの並び等のjsonをつくる
H_COMMON.getHushJson = function(){
    var maps = [map1,map2];
    var arr0 = [];
    for(var i = 0; i <maps.length; i++){
        var layers = maps[i].getLayers().getArray();
        var arr1 = [];
        for(var j = 0; j <layers.length; j++){
            if(layers[j].getProperties()["title"]){

                var prop = layers[j].getProperties();
                var name = prop["name"];
                var opacity = prop["opacity"];
                var zIndex = prop["zIndex"];
                var obj;

                if(name==="plusLayer") {
                    var plusName = prop["plusName"];
                    var plusUrl = prop["plusUrl"];
                    console.log(plusUrl);
                    obj = {"n":name,"o":opacity,"z":zIndex,"pn":plusName,"pu":plusUrl};
                }else{
                    obj = {"n":name,"o":opacity,"z":zIndex};
                }
                arr1.push(obj)
            }
        }
        arr1.sort(function(a,b){//念のためzIndexで昇順ソート
            if(a["z"]<b["z"]) return -1;
            if(a["z"]>b["z"]) return 1;
            return 0;
        });
        arr0.push(arr1)
    }
    var parametor = encodeURI(JSON.stringify(arr0));
    return parametor;
};
//----------------------------------------------------------
//ハッシュ用のレイヤーcesium関係のjsonをつくる
H_COMMON.getHush3dJson = function(){
    var ol3ds = [ol3d1,ol3d2];
    var arr0 = [];
    for(var i = 0; i <ol3ds.length; i++){
        var enabled =  ol3ds[i].getEnabled();
        var tilt = ol3ds[i].getCamera().getTilt();
        var head = ol3ds[i].getCamera().getHeading();
        var distance = ol3ds[i].getCamera().getDistance();
        var altitude = ol3ds[i].getCamera().getAltitude();
        var position = ol3ds[i].getCamera().getPosition();
        var center = ol3ds[i].getCamera().getCenter();
        var arr1 = [];
        var obj;
        if(enabled) {
            obj = {"e": enabled, "t": tilt, "h": head, "d": distance, "a": altitude, "p": position, "c": center};
        }else{
            obj = {"e": enabled}
        }
        arr1.push(obj);
        arr0.push(arr1);
    }
    console.log(arr0);
    var parametor = encodeURI(JSON.stringify(arr0));
    return parametor;
};
//----------------------------------------------------------


//---------------------------------------------------------------------------------
//rgbaをrgbに変換
H_COMMON.rgba2rgb = function(rgba) {
    var rgb;
    if(rgba.indexOf("rgba")!==-1) {
        rgb = rgba.substr(0, rgba.lastIndexOf(",")).replace("rgba", "rgb") + ")";//rgbaをrgbに変換
        console.log(rgb)
    }else if(rgba.indexOf("rgb")!==-1) {//実はもとからrgbだったとき
        rgb = rgba;
    }else {
        var d3rgb = d3.rgb(rgba);
        rgb = 'rgb(' + d3rgb["r"] + ',' + d3rgb["g"] + ',' + d3rgb["b"] + ')'
    }
    return rgb;
};
//---------------------------------------------------------------------------------
//rgbaの透過度を取得
H_COMMON.getRgbaOpacity = function(rgba) {
    var opacity;
    if(rgba.indexOf("rgba")!==-1) {
        opacity = rgba.match(/([^,]+)\)/)[1];
    }else{//実はもとからrgbだったとき
        opacity = 1;
    }
    return opacity;
};
//---------------------------------------------------------------------------------
//rgbaの透過度を設定
H_COMMON.setRgbaOpacity = function(rgba,opacity) {
    if(rgba.indexOf("rgba")!==-1) {
        rgba = rgba.substr(0, rgba.lastIndexOf(",")) + "," + opacity + ")";
    }else{//実はもとからrgbだったとき

    }
    return rgba;
};
//---------------------------------------------------------------------------------
//全角数字を半角数字に変換
H_COMMON.zen2han = function(str) {
    str = str.replace(/[０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    return str;
};
//---------------------------------------------------------------------------------
//↓産業技術総合研究所の西岡さんから頂きました。自分流に体裁をちょっと変えました。
// ********************************************************************************
// getElev, タイル座標とズームレベルを指定して標高値を取得する関数
//	rx, ry: タイル座標(実数表現）z:　ズームレベル
//	thenは終了時に呼ばれるコールバック関数
//	成功時には標高(単位m)，無効値の場合は'e'を返す
// ********************************************************************************
//function getElev(rx,ry,z,then){
var erevImg = new Image();
erevImg.crossOrigin = 'anonymouse'
var prevImgSrc = "";
//var elevImgSrc = null;
function getElev(coordinate,mapName,then){
    var elevServer = 'https://gsj-seamless.jp/labs/elev2/elev/';
    var z = Math.floor(eval(mapName).getView().getZoom());
    if(z>13) z=13;
    var R = 6378137;// 地球の半径(m);
    var rx = (0.5 + coordinate[0]/(2*R*Math.PI))*Math.pow(2,z);
    var ry = (0.5 - coordinate[1]/(2*R*Math.PI))*Math.pow(2,z);

    var x = Math.floor(rx);// タイルX座標
    var y = Math.floor(ry);// タイルY座標
    var i = (rx - x) * 256;// タイル内i座標
    var j = (ry - y) * 256;// タイル内j座標

    erevImg.onload = canvasRead();

    function canvasRead(){
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var h = "e";
        //var data = null;
        canvas.width = 1;
        canvas.height = 1;
        context.drawImage(erevImg,i,j,1,1,0,0,1,1);
        data = context.getImageData(0,0,1,1).data;
        if(data[3] === 255){
            h = (data[0] * 256 * 256 + data[1] * 256 + data[2]) / 100;
        }
        then(h);
    }
    var elevImgSrc = elevServer + z + '/' + y + '/' + x + '.png?res=cm'
    if(prevImgSrc != elevImgSrc) {
        erevImg.src = elevImgSrc;
    }else{
        canvasRead();
    }
    prevImgSrc = elevImgSrc;
}
//-----------------------------------------------------------------------------
function getPixelVale(coordinate,mapName,then){
    var pngServer = 'https://mtile.pref.miyazaki.lg.jp/tile/mvt/totiriyoul/';
    var z = Math.floor(eval(mapName).getView().getZoom());
    if(z>13) z=13;
    var R = 6378137;// 地球の半径(m);
    var rx = (0.5 + coordinate[0]/(2*R*Math.PI))*Math.pow(2,z);
    var ry = (0.5 - coordinate[1]/(2*R*Math.PI))*Math.pow(2,z);
    var x = Math.floor(rx);// タイルX座標
    var y = Math.floor(ry);// タイルY座標
    var tmsy = (1 << z) -y -1;//tms形式に変換
    var i = (rx - x) * 256;// タイル内i座標
    var j = (ry - y) * 256;// タイル内j座標
    //console.log(z,x,tmsy,i,j);

    var pngImg = new Image();
    pngImg.crossOrigin = 'anonymouse';
    pngImg.onload = function(){
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 1;
        context.drawImage(pngImg,i,j,1,1,0,0,1,1);
        var targetRgba = context.getImageData(0,0,1,1).data;
        //console.log(targetRgba)
        //console.log(targetRgba);
        then(targetRgba);
    };

    var pngImgSrc = pngServer + z + '/' + x + '/' + tmsy + '.png?res=cm'
    pngImg.src = pngImgSrc;
    console.log(pngImgSrc)
}
//-----------------------------------------------------------------------------
//バックグラウンドで色を判断する。
function funcTextColor(R,G,B){
    var cY = 0.3*R + 0.6*G + 0.1*B;
    if(cY > 100) {//最高値は255。今回は100で判断させる。
        return "black";
    }else{
        return "white";
    }
}
//-----------------------------------------------------------------------------
function funcColor100(valueAr) {
    var max = Math.max.apply(null,valueAr);
    var min = Math.min.apply(null,valueAr);
    var minM = 0;
    if (min < 0) {//最小値がマイナスだったとき
        max = max;
        minM = min;
        min = 0;
    }
    //console.log(max);
	//console.log(min);
    //var d3Color = d3.interpolateLab("white", "red");
    var plus100 = (max - min) / 100;//最大値と最小値の差を1としたとき0.01あたりの差
    //var d3ColorM = d3.interpolateLab("white", "blue");
    var minus100 = (0 - minM) / 100;
    return [plus100,minus100,min];
}
//-----------------------------------------------------------------------------
function funcMaps(element){
	var mapName = element.parents(".maps").attr("id");
	var mapElement = element.parents(".maps");
	if(mapName=="map1"){
		var ol3d = "ol3d1";
		var layers = useLayersArr1;
	}else{
		var ol3d = "ol3d2";
		var layers = useLayersArr2;
	}
	return {"name":mapName,"element":mapElement,"ol3d":ol3d,"layers":layers};
}
//------------------------------------------------------------------------------
//ダイアログの高さを設定する。
function funcHaikeiTblDivHeight(){
	if($(window).width()>1000){
		var height = $(window).height()-150;
	}else{
		if($(".dualscreen-btn").eq(0).text()=="1画面"){
			var height = $(window).height()/2-150;
		}else{
			var height = $(window).height()-150;
		}
	}
    $(".data-tbl-div").css({
        "max-height":height + "px",
        //"width":($(".data-tbl-div table").width() + 20) + "px"
    });
	$(".haikei-tbl-div").css("max-height",height + "px");
    $(".estat-tbl-div").css("max-height",height-65 + "px");
    $(".resas-tbl-div").css("max-height",height-50 + "px");
    $(".csv-tbl-div").css("max-height",height-50 + "px");
}
//------------------------------------------------------------------------------
//エクステントの座標系を変換する
function transformE(extent) {
	return ol.proj.transformExtent(extent,'EPSG:4326','EPSG:3857');
}
//------------------------------------------------------------------------------
// 文字列から，Unicodeコードポイントの配列を作る
function str_to_unicode_array( str ){
    var arr = [];
    for( var i = 0; i < str.length; i ++ ){
        arr.push( str.charCodeAt( i ) );
    }
    return arr;
}
function str2Array(str) {
    var array = [],i,il=str.length;
    for(i=0;i<il;i++) array.push(str.charCodeAt(i));
    return array;
}
//-------------------------------------------------------------------------------
// 配列内に存在するかを調べる関数
function IsExists(array, value){
    for (var i =0, len = array.length; i < len; i++){
        if (value == array[i]){
            // 存在したらtrueを返す
            return true;
        };
    };
    // 存在しない場合falseを返す
    return false;
}
// 重複を排除しながらpushする関数
function PushArray(array, value){
    // 存在しない場合、配列にpushする
    if(! IsExists(array, value)){
        array.push(value);
    };
    return true;
}
//-----------------------------------------------------------------------------------------
//円の座標を作る。
function createCirclePointCoords(circleCenterX,circleCenterY,circleRadius,pointsToFind){
    //pointsToFind = 24
    var angleToAdd = 360/pointsToFind;
    var coords = [];
    var angle = 45;
    var firstCoord;
    for (var i=0;i<pointsToFind;i++){
        angle = angle+angleToAdd;
        //console.log(angle);
        var coordX = circleCenterX + ((circleRadius + 0) * Math.cos(angle*Math.PI/180));
        var coordY = circleCenterY + (circleRadius * Math.sin(angle*Math.PI/180));
        coords.push([coordX,coordY]);
        //最初のポイントを足すことによって多角形をきれいにとじる。
        if(i==0) firstCoord = [coordX,coordY];
        if(i==pointsToFind-1) coords.push(firstCoord);
    }
    return coords;
}
//------------------------------------------------------------------------------
//2015年10月1日　国勢調査人口
var prefAr =
	[
		{"id":"01000","name":"北海道","zinkou":5381733},
		{"id":"02000","name":"青森県","zinkou":1308265},
		{"id":"03000","name":"岩手県","zinkou":1279594},
		{"id":"04000","name":"宮城県","zinkou":2333899},
		{"id":"05000","name":"秋田県","zinkou":1023119},
		{"id":"06000","name":"山形県","zinkou":1123891},
		{"id":"07000","name":"福島県","zinkou":1914039},
		{"id":"08000","name":"茨城県","zinkou":2916976},
		{"id":"09000","name":"栃木県","zinkou":1974255},
		{"id":"10000","name":"群馬県","zinkou":1973115},
		{"id":"11000","name":"埼玉県","zinkou":7266534},
		{"id":"12000","name":"千葉県","zinkou":6222666},
		{"id":"13000","name":"東京都","zinkou":13515271},
		{"id":"14000","name":"神奈川県","zinkou":9126214},
		{"id":"15000","name":"新潟県","zinkou":2304264},
		{"id":"16000","name":"富山県","zinkou":1066328},
		{"id":"17000","name":"石川県","zinkou":1154008},
		{"id":"18000","name":"福井県","zinkou":786740},
		{"id":"19000","name":"山梨県","zinkou":834930},
        {"id":"20000","name":"長野県","zinkou":2098804},
		{"id":"21000","name":"岐阜県","zinkou":2031903},
		{"id":"22000","name":"静岡県","zinkou":3700305},
		{"id":"23000","name":"愛知県","zinkou":7483128},
		{"id":"24000","name":"三重県","zinkou":1815865},
		{"id":"25000","name":"滋賀県","zinkou":1412916},
		{"id":"26000","name":"京都府","zinkou":2610353},
		{"id":"27000","name":"大阪府","zinkou":8839469},
		{"id":"28000","name":"兵庫県","zinkou":5534800},
		{"id":"29000","name":"奈良県","zinkou":1364316},
		{"id":"30000","name":"和歌山県","zinkou":963579},
		{"id":"31000","name":"鳥取県","zinkou":573441},
		{"id":"32000","name":"島根県","zinkou":694352},
		{"id":"33000","name":"岡山県","zinkou":1921525},
		{"id":"34000","name":"広島県","zinkou":2843990},
		{"id":"35000","name":"山口県","zinkou":1404729},
		{"id":"36000","name":"徳島県","zinkou":755733},
		{"id":"37000","name":"香川県","zinkou":976263},
		{"id":"38000","name":"愛媛県","zinkou":1385262},
		{"id":"39000","name":"高知県","zinkou":728276},
        {"id":"40000","name":"福岡県","zinkou":5101556},
		{"id":"41000","name":"佐賀県","zinkou":832832},
		{"id":"42000","name":"長崎県","zinkou":1377187},
		{"id":"43000","name":"熊本県","zinkou":1786170},
		{"id":"44000","name":"大分県","zinkou":1166338},
		{"id":"45000","name":"宮崎県","zinkou":1104069},
		{"id":"46000","name":"鹿児島県","zinkou":1648177},
		{"id":"47000","name":"沖縄県","zinkou":1433566}
	];

//----------------------------------------------------------------------------------------------------------------------
//スタイルファンクション
var commonstyleFunction = function(feature, resolution) {
    var prop = feature.getProperties();
    var geoType = feature.getGeometry().getType();
    var fillColor = prop["_fillColor"];
    var zindex = prop["_zindex"];
    if(resolution>2445) {//ズーム６
        var pointRadius = 2;
    }else if(resolution>1222) {//ズーム７
        var pointRadius = 2;
    }else if(resolution>611){
        var pointRadius = 2;
    }else if(resolution>305) {
        var pointRadius = 4;
    }else if(resolution>152) {
        var pointRadius = 6;
    }else if(resolution>76) {
        var pointRadius = 8;
    }else if(resolution>38) {
        var pointRadius = 10;
    }else{
        var pointRadius = 12;
    }
    switch (geoType){
        case "LineString":
            var lineDash = eval(prop["_lineDash"]);
            var style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color:fillColor ? fillColor : "red",
                    lineDash:lineDash,
                    width:6
                })
            });
            break;
        case "Point":
            var style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius:pointRadius,
                    fill: new ol.style.Fill({
                        color:fillColor ? fillColor : "orange"
                    }),
                    stroke: new ol.style.Stroke({color: "white", width: 1})
                })
            });
            break;
        case "Polygon":
        case "MultiPolygon":
            if(fillColor==""){
                fillColor = d3CategoryColor(d3CategoryColorI);
                d3CategoryColorI++;
                //console.log(d3CategoryColorI)
                feature["D"]["_fillColor"] = fillColor;
            }
            if(!zindex) {
                zindex = 0;
            }
            var style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color:fillColor ? fillColor : "rgba(200,100,100,0.4)"
                }),
                stroke: new ol.style.Stroke({
                    color: "gray",
                    width: 1
                }),
                zIndex:zindex
            });
            break;
        default:
    }
    return style;
};
//----------------------------------------------------------------------------------------------------------------------
var syoukubunAr =
    [
        {"id":"11","name":"有形文化財","color":"red"},
        {"id":"21","name":"無形文化財","color":"blue"},
        {"id":"31","name":"有形民俗文化財","color":"red"},
        {"id":"32","name":"無形民俗文化財","color":"blue"},
        {"id":"41","name":"史跡（旧跡を含む）","color":"green"},
        {"id":"42","name":"名勝","color":"green"},
        {"id":"43","name":"天然記念物","color":"green"},
        {"id":"51","name":"重要文化的景観","color":"green"},
        {"id":"61","name":"伝統的建造物群保存地区","color":"black"},
        {"id":"71","name":"選定保存技術","color":"black"}
    ];
//---------------------------------------------------------------------------------------------------------------------
var totiriyouAr =
    [
        {"id":"0100","name":"田","color":"rgb(255,255,0)","teigi":""},
        {"id":"0200","name":"その他の農用地","color":"rgb(255,204,153)","teigi":""},
        {"id":"0500","name":"森林","color":"rgb(0,170,0)","teigi":""},
        {"id":"0600","name":"荒地","color":"rgb(255,153,0)","teigi":""},
        {"id":"0700","name":"建物用地","color":"rgb(255,0,0)","teigi":""},
        {"id":"0901","name":"道路","color":"rgb(140,140,140)","teigi":""},
        {"id":"0902","name":"鉄道","color":"rgb(180,180,180)","teigi":""},
        {"id":"1000","name":"その他の用地","color":"rgb(200,70,15)","teigi":""},
        {"id":"1100","name":"河川地及び湖沼","color":"rgb(0,0,255)","teigi":""},
        {"id":"1400","name":"海浜","color":"rgb(255,255,153)","teigi":""},
        {"id":"1500","name":"海水域","color":"rgb(0,204,255)","teigi":""},
        {"id":"1600","name":"ゴルフ場","color":"rgb(0,255,0)","teigi":""},
    ];
//----------------------------------------------------------------------------------------------------------------------

//"<option value='h27'>平成27年</option>"
/*
    "<option value='T000843001'>総数（Ａ〜Ｓ全産業）</option>"
    "<option value='T000843002'>Ａ〜Ｒ全産業（Ｓ公務を除く）</option>"
    "<option value='T000843003'>Ａ〜Ｂ農林漁業</option>"
    "<option value='T000843004'>Ｃ〜Ｓ非農林漁業</option>"
    "<option value='T000843005'>Ｃ〜Ｒ非農林漁業（Ｓ公務を除く）</option>"
    "<option value='T000843006'>Ｃ鉱業、採石業、砂利採取業</option>"
    "<option value='T000843007'>Ｄ建設業</option>"
    "<option value='T000843008'>Ｅ製造業</option>"
    "<option value='T000843009'>Ｆ電気・ガス・熱供給・水道業</option>"
    "<option value='T000843010'>Ｇ情報通信業</option>"
    "<option value='T000843011'>Ｈ運輸業、郵便業</option>"
    "<option value='T000843012'>Ｉ卸売業、小売業</option>"
    "<option value='T000843013'>Ｊ金融業、保険業</option>"
    "<option value='T000843014'>Ｋ不動産業、物品賃貸業</option>"
    "<option value='T000843015'>Ｌ学術研究、専門・技術サービス業</option>"
    "<option value='T000843016'>Ｍ宿泊業、飲食サービス業</option>"
    "<option value='T000843017'>Ｎ生活関連サービス業、娯楽業</option>"
    "<option value='T000843018'>Ο教育、学習支援業</option>"
    "<option value='T000843019'>Ｐ医療、福祉</option>"
    "<option value='T000843020'>Ｑ複合サービス事業</option>"
    "<option value='T000843021'>Ｒサービス業（他に分類されないもの）</option>"
    "<option value='T000843022'>Ｓ公務（他に分類されるものを除く）</option>"
    "<option value='T000843023'>１〜４人</option>"
    "<option value='T000843024'>５〜９人</option>"
    "<option value='T000843025'>１０〜１９人</option>"
    "<option value='T000843026'>２０〜２９人</option>"
    "<option value='T000843027'>３０人以上</option>"
    "<option value='T000843028'>出向・派遣従業者のみ</option>"
*/


var optKeizaiCensus0Ar = [//経済センサス事業所数
    {"T000843001":"総数（Ａ〜Ｓ全産業）"},
    {"T000843002":"Ａ〜Ｒ全産業（Ｓ公務を除く）"},
    {"T000843003":"Ａ〜Ｂ農林漁業"},
    {"T000843004":"Ｃ〜Ｓ非農林漁業"},
    {"T000843005":"Ｃ〜Ｒ非農林漁業（Ｓ公務を除く）"},
    {"T000843006":"Ｃ鉱業、採石業、砂利採取業"},
    {"T000843007":"Ｄ建設業"},
    {"T000843008":"Ｅ製造業"},
    {"T000843009":"Ｆ電気・ガス・熱供給・水道業"},
    {"T000843010":"Ｇ情報通信業"},
    {"T000843011":"Ｈ運輸業、郵便業"},
    {"T000843012":"Ｉ卸売業、小売業"},
    {"T000843013":"Ｊ金融業、保険業"},
    {"T000843014":"Ｋ不動産業、物品賃貸業"},
    {"T000843015":"Ｌ学術研究、専門・技術サービス業"},
    {"T000843016":"Ｍ宿泊業、飲食サービス業"},
    {"T000843017":"Ｎ生活関連サービス業、娯楽業"},
    {"T000843018":"Ο教育、学習支援業"},
    {"T000843019":"Ｐ医療、福祉"},
    {"T000843020":"Ｑ複合サービス事業"},
    {"T000843021":"Ｒサービス業（他に分類されないもの）"},
    {"T000843022":"Ｓ公務（他に分類されるものを除く）"},
    {"T000843023":"１〜４人"},
    {"T000843024":"５〜９人"},
    {"T000843025":"１０〜１９人"},
    {"T000843026":"２０〜２９人"},
    {"T000843027":"３０人以上"},
    {"T000843028":"出向・派遣従業者のみ"}
];
for (var i=0;i<optKeizaiCensus0Ar.length;i++){
    //console.log(optKeizaiCensus0Ar[i]);

}



var optKeizaiCensus1Ar = [//経済センサス事業者数　　人
    {"T000843029":"総数（Ａ〜Ｓ全産業）"},
    {"T000843030":"男総数（Ａ〜Ｓ全産業）"},
    {"T000843031":"女総数（Ａ〜Ｓ全産業）"},
    {"T000843032":"Ａ〜Ｒ全産業（Ｓ公務を除く）"},
    {"T000843033":"男Ａ〜Ｒ全産業（Ｓ公務を除く）"},
    {"T000843034":"女Ａ〜Ｒ全産業（Ｓ公務を除く）"},
    {"T000843035":"Ａ〜Ｂ農林漁業"},
    {"T000843036":"Ｃ〜Ｓ非農林漁業"},
    {"T000843037":"Ｃ〜Ｒ非農林漁業（Ｓ公務を除く）"},
    {"T000843038":"Ｃ鉱業、採石業、砂利採取業"},
    {"T000843039":"Ｄ建設業"},
    {"T000843040":"Ｅ製造業"},
    {"T000843041":"Ｆ電気・ガス・熱供給・水道業"},
    {"T000843042":"Ｇ情報通信業"},
    {"T000843043":"Ｈ運輸業、郵便業"},
    {"T000843044":"Ｉ卸売業、小売業"},
    {"T000843045":"Ｊ金融業、保険業"},
    {"T000843046":"Ｋ不動産業、物品賃貸業"},
    {"T000843047":"Ｌ学術研究、専門・技術サービス業"},
    {"T000843048":"Ｍ宿泊業、飲食サービス業"},
    {"T000843049":"Ｎ生活関連サービス業、娯楽業"},
    {"T000843050":"Ο教育、学習支援業"},
    {"T000843051":"Ｐ医療、福祉"},
    {"T000843052":"Ｑ複合サービス事業"},
    {"T000843053":"Ｒサービス業（他に分類されないもの）"},
    {"T000843054":"Ｓ公務（他に分類されるものを除く）"},
    {"T000843055":"１〜４人"},
    {"T000843056":"５〜９人"},
    {"T000843057":"１０〜１９人"},
    {"T000843058":"２０〜２９人"},
    {"T000843059":"３０人以上"}
];


/*
"<option value='T000843029'>総数（Ａ〜Ｓ全産業）</option>" +
"<option value='T000843030'>男総数（Ａ〜Ｓ全産業）</option>" +
"<option value='T000843031'>女総数（Ａ〜Ｓ全産業）</option>" +
"<option value='T000843032'>Ａ〜Ｒ全産業（Ｓ公務を除く）</option>" +
"<option value='T000843033'>男Ａ〜Ｒ全産業（Ｓ公務を除く）</option>" +
"<option value='T000843034'>女Ａ〜Ｒ全産業（Ｓ公務を除く）</option>" +
"<option value='T000843035'>Ａ〜Ｂ農林漁業</option>" +
"<option value='T000843036'>Ｃ〜Ｓ非農林漁業</option>" +
"<option value='T000843037'>Ｃ〜Ｒ非農林漁業（Ｓ公務を除く）</option>" +
"<option value='T000843038'>Ｃ鉱業、採石業、砂利採取業</option>" +
"<option value='T000843039'>Ｄ建設業</option>" +
"<option value='T000843040'>Ｅ製造業</option>" +
"<option value='T000843041'>Ｆ電気・ガス・熱供給・水道業</option>" +
"<option value='T000843042'>Ｇ情報通信業</option>" +
"<option value='T000843043'>Ｈ運輸業、郵便業</option>" +
"<option value='T000843044'>Ｉ卸売業、小売業</option>" +
"<option value='T000843045'>Ｊ金融業、保険業</option>" +
"<option value='T000843046'>Ｋ不動産業、物品賃貸業</option>" +
"<option value='T000843047'>Ｌ学術研究、専門・技術サービス業</option>" +
"<option value='T000843048'>Ｍ宿泊業、飲食サービス業</option>" +
"<option value='T000843049'>Ｎ生活関連サービス業、娯楽業</option>" +
"<option value='T000843050'>Ο教育、学習支援業</option>" +
"<option value='T000843051'>Ｐ医療、福祉</option>" +
"<option value='T000843052'>Ｑ複合サービス事業</option>" +
"<option value='T000843053'>Ｒサービス業（他に分類されないもの）</option>" +
"<option value='T000843054'>Ｓ公務（他に分類されるものを除く）</option>" +
"<option value='T000843055'>１〜４人</option>" +
"<option value='T000843056'>５〜９人</option>" +
"<option value='T000843057'>１０〜１９人</option>" +
"<option value='T000843058'>２０〜２９人</option>" +
"<option value='T000843059'>３０人以上</option>" +






 var syugyou1kAr = [//
 {"s22":""},
 {"s23":""},
 {"s24":""},
 {"s25":""},
 {"s26":""},
 {"s27":""},
 {"s28":""},
 {"s29":""},

 {"s30":""},
 {"s31":""},
 {"s32":""},
 {"s33":""},
 {"s34":""},
 {"s35":""},
 {"s36":""},
 {"s37":""},
 {"s38":""},
 {"s39":""},

 {"s40":""},
 {"s41":""},
 {"s42":""},
 {"s43":""},
 {"s44":""},
 {"s45":""},
 {"s46":""},
 {"s47":""},
 {"s48":""},
 {"s49":""},

 {"s50":""},
 {"s51":""},
 {"s52":""},
 {"s53":""},
 {"s54":""},
 {"s55":""},
 {"s56":""},
 {"s57":""},
 {"s58":""},
 {"s59":""},

 {"s60":""},
 {"s61":""},
 {"s62":""},
 {"s63":""},
 {"s64":""},
 {"s65":""},
 {"s66":""},
 {"s67":""},
 {"s68":""},
 {"s69":""},

 {"s70":""},
 {"s71":""},
 {"s72":""},
 {"s73":""},
 {"s74":""},
 {"s75":""},
 {"s76":""},
 {"s77":""},
 {"s78":""},
 {"s79":""},

 {"s80":""},
 {"s81":""},
 {"s82":""},
 {"s83":""},
 {"s84":""},
 {"s85":""},
 {"s86":""},
 {"s87":""},
 {"s88":""},
 {"s89":""},

 {"s90":""},
 {"s91":""},
 {"s92":""},
 {"s93":""},
 {"s94":""},
 {"s95":""},
 {"s96":""},
 {"s97":""},
 {"s98":""},
 {"s99":""},

 {"s100":""},
 {"s101":""},
 {"s102":""},
 {"s103":""},
 {"s104":""},
 {"s105":""},
 {"s106":""},
 {"s107":""},
 {"s108":""},
 {"s109":""},

 {"s110":""},
 {"s111":""},
 {"s112":""},
 {"s113":""},
 {"s114":""},
 {"s115":""},
 {"s116":""},
 {"s117":""},
 {"s118":""},
 {"s119":""},

 {"s120":""},
 {"s121":""},
 {"s122":""},
 {"s123":""},
 {"s124":""},
 {"s125":""},
 {"s126":""},
 {"s127":""}
 ];



*/

var syugyou1kAr = [//
    {"s22":"小売業計 事業所数"},
    {"s23":"小売業計 年間販売額（百万円）"},
    {"s24":"小売業計 売場面積（百㎡）"},
    {"s25":"56 各種商品小売業 事業所数"},
    {"s26":"56 各種商品小売業 年間販売額（百万円）"},
    {"s27":"56 各種商品小売業 売場面積（百㎡）"},
    {"s28":"57 織物・衣服・身の回り品小売業 事業所数"},
    {"s29":"57 織物・衣服・身の回り品小売業 年間販売額（百万円）"},
    {"s30":"57 織物・衣服・身の回り品小売業 売場面積（百㎡）"},
    {"s31":"58 飲食料品小売業 事業所数"},
    {"s32":"58 飲食料品小売業 年間販売額（百万円）"},
    {"s33":"58 飲食料品小売業 売場面積（百㎡）"},
    {"s34":"59 機械器具小売業 事業所数"},
    {"s35":"59 機械器具小売業 年間販売額（百万円）"},
    {"s36":"59 機械器具小売業 売場面積（百㎡）"},
    {"s37":"60 その他の小売業 事業所数"},
    {"s38":"60 その他の小売業 年間販売額（百万円）"},
    {"s39":"60 その他の小売業 売場面積（百㎡）"},
    {"s40":"61 無店舗小売業 事業所数"},
    {"s41":"61 無店舗小売業 年間販売額（百万円）"},
    {"s42":"61 無店舗小売業 売場面積（百㎡）"},
    {"s43":"561 百貨店，総合スーパー 事業所数"},
    {"s44":"561 百貨店，総合スーパー 年間販売額（百万円）"},
    {"s45":"561 百貨店，総合スーパー 売場面積（百㎡）"},
    {"s46":"569 その他の各種商品小売業 事業所数"},
    {"s47":"569 その他の各種商品小売業 年間販売額（百万円）"},
    {"s48":"569 その他の各種商品小売業 売場面積（百㎡）"},
    {"s49":"571 呉服・服地・寝具小売業 事業所数"},
    {"s50":"571 呉服・服地・寝具小売業 年間販売額（百万円）"},
    {"s51":"571 呉服・服地・寝具小売業 売場面積（百㎡）"},
    {"s52":"572 男子服小売業 事業所数"},
    {"s53":"572 男子服小売業 年間販売額（百万円）"},
    {"s54":"572 男子服小売業 売場面積（百㎡）"},
    {"s55":"573 婦人・子供服小売業 事業所数"},
    {"s56":"573 婦人・子供服小売業 年間販売額（百万円）"},
    {"s57":"573 婦人・子供服小売業 売場面積（百㎡）"},
    {"s58":"574 靴・履物小売業 事業所数"},
    //{"s59":"574 靴・履物小売業 年間販売額（百万円）"},
    //{"s60":"574 靴・履物小売業 売場面積（百㎡）"},
    {"s61":"579 その他の織物・衣服・身の回り品小売業 事業所数"},
    {"s62":"579 その他の織物・衣服・身の回り品小売業 年間販売額（百万円）"},
    {"s63":"579 その他の織物・衣服・身の回り品小売業 売場面積（百㎡）"},
    {"s64":"581 各種食料品小売業 事業所数"},
    //{"s65":"581 各種食料品小売業 年間販売額（百万円）"},
    //{"s66":"581 各種食料品小売業 売場面積（百㎡）"},
    {"s67":"582 野菜・果実小売業 事業所数"},
    //{"s68":"582 野菜・果実小売業 年間販売額（百万円）"},
    //{"s69":"582 野菜・果実小売業 売場面積（百㎡）"},
    {"s70":"583 食肉小売業 事業所数"},
    //{"s71":"583 食肉小売業 年間販売額（百万円）"},
    //{"s72":"583 食肉小売業 売場面積（百㎡）"},
    {"s73":"584 鮮魚小売業 事業所数"},
    //{"s74":"584 鮮魚小売業 年間販売額（百万円）"},
    //{"s75":"584 鮮魚小売業 売場面積（百㎡）"},
    {"s76":"585 酒小売業 事業所数"},
    {"s77":"585 酒小売業 年間販売額（百万円）"},
    {"s78":"585 酒小売業 売場面積（百㎡）"},
    {"s79":"586 菓子・パン小売業 事業所数"},
    {"s80":"586 菓子・パン小売業 年間販売額（百万円）"},
    {"s81":"586 菓子・パン小売業 売場面積（百㎡）"},
    {"s82":"589 その他の飲食料品小売業 事業所数"},
    {"s83":"589 その他の飲食料品小売業 年間販売額（百万円）"},
    {"s84":"589 その他の飲食料品小売業 売場面積（百㎡）"},
    {"s85":"591 自動車小売業 事業所数"},
    {"s86":"591 自動車小売業 年間販売額（百万円）"},
    {"s87":"591 自動車小売業 売場面積（百㎡）"},
    {"s88":"592 自転車小売業 事業所数"},
    //{"s89":"592 自転車小売業 年間販売額（百万円）"},
    //{"s90":"592 自転車小売業 売場面積（百㎡）"},
    {"s91":"593 機械器具小売業(自動車，自転車を除く) 事業所数"},
    {"s92":"593 機械器具小売業(自動車，自転車を除く) 年間販売額（百万円）"},
    {"s93":"593 機械器具小売業(自動車，自転車を除く) "},
    {"s94":"601 家具・建具・畳小売業 事業所数"},
    //{"s95":"601 家具・建具・畳小売業 年間販売額（百万円）"},
    //{"s96":"601 家具・建具・畳小売業 売場面積（百㎡）"},
    {"s97":"602 じゅう器小売業 事業所数"},
    //{"s98":"602 じゅう器小売業 年間販売額（百万円）"},
    //{"s99":"602 じゅう器小売業 売場面積（百㎡）"},
    {"s100":"603 医薬品・化粧品小売業 事業所数"},
    {"s101":"603 医薬品・化粧品小売業 年間販売額（百万円）"},
    {"s102":"603 医薬品・化粧品小売業 売場面積（百㎡）"},
    {"s103":"604 農耕用品小売業 事業所数"},
    //{"s104":"604 農耕用品小売業 年間販売額（百万円）"},
    //{"s105":"604 農耕用品小売業 売場面積（百㎡）"},
    {"s106":"605 燃料小売業 事業所数"},
    {"s107":"605 燃料小売業 年間販売額（百万円）"},
    {"s108":"605 燃料小売業 売場面積（百㎡）"},
    {"s109":"606 書籍・文房具小売業 事業所数"},
    {"s110":"606 書籍・文房具小売業 年間販売額（百万円）"},
    {"s111":"606 書籍・文房具小売業 売場面積（百㎡）"},
    {"s112":"607 スポーツ用品・がん具・娯楽用品・楽器小売業 事業所数"},
    {"s113":"607 スポーツ用品・がん具・娯楽用品・楽器小売業 年間販売額（百万円）"},
    {"s114":"607 スポーツ用品・がん具・娯楽用品・楽器小売業 売場面積（百㎡）"},
    {"s115":"608 写真機・時計・眼鏡小売業 事業所数"},
    {"s116":"608 写真機・時計・眼鏡小売業 年間販売額（百万円）"},
    {"s117":"608 写真機・時計・眼鏡小売業 売場面積（百㎡）"},
    {"s118":"609 他に分類されない小売業 事業所数"},
    {"s119":"609 他に分類されない小売業 年間販売額（百万円）"},
    {"s120":"609 他に分類されない小売業 売場面積（百㎡）"},
    {"s121":"611 通信販売・訪問販売小売業 事業所数"},
    //{"s122":"611 通信販売・訪問販売小売業 年間販売額（百万円）"},
    //{"s123":"611 通信販売・訪問販売小売業 売場面積（百㎡）"},
    {"s124":"612 自動販売機による小売業 事業所数"},
    //{"s125":"612 自動販売機による小売業 年間販売額（百万円）"},
    //{"s126":"612 自動販売機による小売業 売場面積（百㎡）"},
    {"s127":"619 その他の無店舗小売業 事業所数"},
    //{"s128":"619 その他の無店舗小売業 年間販売額（百万円）"},
    //{"s129":"619 その他の無店舗小売業 売場面積（百㎡）"}
];
var syougyou1kOption = "";
for(var i = 0; i <syugyou1kAr.length; i++){
    //console.log(syugyou1kAr[i]);
    var key = Object.keys(syugyou1kAr[i])[0];
    var val = syugyou1kAr[i][key];
    //console.log(key,val);
    syougyou1kOption += "<option value='" + key + "'>" + val + "</option>"
}
//console.log(syougyou1kOption);
var syugyou1kGyoutaiAr = [//
    {"g22":"業態別全体 事業所数"},
    {"g23":"業態別全体 年間販売額（百万円）"},
    {"g24":"業態別全体 売場面積（百㎡）"},

    {"g25":"百貨店 事業所数"},
    //{"g26":"百貨店 年間販売額（百万円）"},
    //{"g27":"百貨店 売場面積（百㎡）"},

    {"g28":"大型百貨店 事業所数"},
    //{"g29":"大型百貨店 年間販売額（百万円）"},
    //{"g30":"大型百貨店 売場面積（百㎡）"},

    {"g31":"その他の百貨店 事業所数"},
    //{"g32":"その他の百貨店 年間販売額（百万円）"},
    //{"g33":"その他の百貨店 売場面積（百㎡）"},

    {"g34":"総合スーパー 事業所数"},
    //{"g35":"総合スーパー 年間販売額（百万円）"},
    //{"g36":"総合スーパー 売場面積（百㎡）"},

    {"g37":"大型総合スーパー 事業所数"},
    //{"g38":"大型総合スーパー 年間販売額（百万円）"},
    //{"g39":"大型総合スーパー 売場面積（百㎡）"},

    {"g40":"中型総合スーパー 事業所数"},
    //{"g41":"中型総合スーパー 年間販売額（百万円）"},
    //{"g42":"中型総合スーパー 売場面積（百㎡）"},

    {"g43":"専門スーパー 事業所数"},
    {"g44":"専門スーパー 年間販売額（百万円）"},
    {"g45":"専門スーパー 売場面積（百㎡）"},

    {"g46":"衣料品スーパー 事業所数"},
    //{"g47":"衣料品スーパー 年間販売額（百万円）"},
    //{"g48":"衣料品スーパー 売場面積（百㎡）"},

    {"g49":"食料品スーパー 事業所数"},
    //{"g50":"食料品スーパー 年間販売額（百万円）"},
    //{"g51":"食料品スーパー 売場面積（百㎡）"},

    {"g52":"住関連スーパー 事業所数"},
    //{"g53":"住関連スーパー 年間販売額（百万円）"},
    //{"g54":"住関連スーパー 売場面積（百㎡）"},

    {"g55":"うちホームセンター 事業所数"},
    //{"g56":"うちホームセンター 年間販売額（百万円）"},
    //{"g57":"うちホームセンター 売場面積（百㎡）"},

    {"g58":"コンビニエンスストア 事業所数"},
    {"g59":"コンビニエンスストア 年間販売額（百万円）"},
    {"g60":"コンビニエンスストア 売場面積（百㎡）"},

    {"g61":"うち終日営業 事業所数"},
    //{"g62":"うち終日営業 年間販売額（百万円）"},
    //{"g63":"うち終日営業 売場面積（百㎡）"},

    {"g64":"広義ドラッグストア 事業所数"},
    //{"g65":"うち終日営業 年間販売額（百万円）"},
    //{"g66":"うち終日営業 売場面積（百㎡）"},

    {"g67":"うちドラッグストア 事業所数"},
    //{"g68":"うちドラッグストア 年間販売額（百万円）"},
    //{"g69":"うちドラッグストア 売場面積（百㎡）"},

    {"g70":"その他のスーパー 事業所数"},
    {"g71":"その他のスーパー 年間販売額（百万円）"},
    {"g72":"その他のスーパー 売場面積（百㎡）"},

    {"g73":"うち各種商品取扱店 事業所数"},
    //{"g74":"うち各種商品取扱店 年間販売額（百万円）"},
    //{"g75":"うち各種商品取扱店 売場面積（百㎡）"},

    {"g76":"専門店 事業所数"},
    {"g77":"専門店 年間販売額（百万円）"},
    {"g78":"専門店 売場面積（百㎡）"},

    {"g79":"衣料品専門店 事業所数"},
    //{"g80":"衣料品専門店 年間販売額（百万円）"},
    //{"g81":"衣料品専門店 売場面積（百㎡）"},

    {"g82":"食料品専門店 事業所数"},
    //{"g83":"食料品専門店 年間販売額（百万円）"},
    //{"g84":"食料品専門店 売場面積（百㎡）"},

    {"g85":"住関連専門店 事業所数"},
    //{"g86":"住関連専門店 年間販売額（百万円）"},
    //{"g87":"住関連専門店 売場面積（百㎡）"},

    {"g88":"家電大型専門店 事業所数"},
    //{"g89":"家電大型専門店 年間販売額（百万円）"},
    //{"g90":"家電大型専門店 売場面積（百㎡）"},

    {"g91":"中心店 事業所数"},
    {"g92":"中心店 年間販売額（百万円）"},
    {"g93":"中心店 売場面積（百㎡）"},

    {"g94":"衣料品中心店 事業所数"},
    //{"g95":"衣料品中心店 年間販売額（百万円）"},
    //{"g96":"衣料品中心店 売場面積（百㎡）"},

    {"g97":"食料品中心店 事業所数"},
    //{"g98":"食料品中心店 年間販売額（百万円）"},
    //{"g99":"食料品中心店 売場面積（百㎡）"},

    {"g100":"住関連中心店 事業所数"},
    //{"g101":"住関連中心店 年間販売額（百万円）"},
    //{"g102":"住関連中心店 売場面積（百㎡）"},

    {"g103":"その他の小売店 事業所数"},
    //{"g104":"その他の小売店 年間販売額（百万円）"},
    //{"g105":"その他の小売店 売場面積（百㎡）"},

    {"g106":"うち各種商品取扱店 事業所数"},
    //{"g107":"うち各種商品取扱店 年間販売額（百万円）"},
    //{"g108":"うち各種商品取扱店 売場面積（百㎡）"},

    {"g109":"無店舗販売 事業所数"},
    {"g110":"無店舗販売 年間販売額（百万円）"},
    {"g111":"無店舗販売 売場面積（百㎡）"},

    {"g112":"うち通信・カタログ販売、インターネット販売 事業所数"},
    //{"g113":"xx 年間販売額（百万円）"},
    //{"g114":"xx 売場面積（百㎡）"},
];
var syougyou1kGyoutaiOption = "";
for(var i = 0; i <syugyou1kGyoutaiAr.length; i++){
    //console.log(syugyou1kAr[i]);
    var key = Object.keys(syugyou1kGyoutaiAr[i])[0];
    var val = syugyou1kGyoutaiAr[i][key];
    //console.log(key,val);
    syougyou1kGyoutaiOption += "<option value='" + key + "'>" + val + "</option>"
}
//console.log(syougyou1kGyoutaiOption);
var syugyou1kKiboAr = [//
    {"k22":"卸売業計 事業所数"},
    {"k23":"卸売業計 従業者数"},
    {"k24":"卸売業計 年間販売額（百万円）"},

    {"k25":"小売業計 事業所数"},
    {"k26":"小売業計 従業者数"},
    {"k27":"小売業計 年間販売額（百万円）"},
    {"k28":"小売業計 売場面積（百㎡）"},

    {"k29":"従業者規模別 従業者４人以下 事業所数"},
    {"k30":"従業者規模別 従業者４人以下 年間販売額（百万円）"},
    {"k31":"従業者規模別 従業者５～２９人以下 事業所数"},
    {"k32":"従業者規模別 従業者５～２９人以下 年間販売額（百万円）"},
    {"k33":"従業者規模別 従業者３０～４９人以下 事業所数"},
    //{"k34":"従業者規模別 従業者３０～４９人以下 年間販売額（百万円）"},
    {"k35":"従業者規模別 従業者５０人以上 事業所数"},
    //{"k36":"従業者規模別 従業者５０人以上 年間販売額（百万円）"},

    {"k37":"年間販売額階級別 年間販売額200万円未満 事業所数"},
    {"k38":"年間販売額階級別 年間販売額200万円未満 年間販売額（百万円）"},
    {"k39":"年間販売額階級別 年間販売額200万円未満 売場面積（百㎡）"},

    {"k40":"年間販売額階級別 年間販売額200～2,000万円未満 事業所数"},
    {"k41":"年間販売額階級別 年間販売額200～2,000万円未満 年間販売額（百万円）"},
    {"k42":"年間販売額階級別 年間販売額200～2,000万円未満 売場面積（百㎡）"},

    {"k43":"年間販売額階級別 年間販売額2,000～1億円未満 事業所数"},
    {"k44":"年間販売額階級別 年間販売額2,000～1億円未満 年間販売額（百万円）"},
    {"k45":"年間販売額階級別 年間販売額2,000～1億円未満 売場面積（百㎡）"},

    {"k46":"年間販売額階級別 年間販売額1億円以上 事業所数"},
    {"k47":"年間販売額階級別 年間販売額1億円以上 年間販売額（百万円）"},
    {"k48":"年間販売額階級別 年間販売額1億円以上 売場面積（百㎡）"},

    {"k49":"売場面積規模別 20㎡未満 事業所数"},
    {"k50":"売場面積規模別 20㎡未満 年間販売額（百万円）"},
    {"k51":"売場面積規模別 20㎡未満 売場面積（百㎡）"},

    {"k52":"売場面積規模別 20㎡～50㎡未満 事業所数"},
    {"k53":"売場面積規模別 20㎡～50㎡未満 年間販売額（百万円）"},
    {"k54":"売場面積規模別 20㎡～50㎡未満 売場面積（百㎡）"},

    {"k55":"売場面積規模別 50㎡～500㎡未満 事業所数"},
    {"k56":"売場面積規模別 50㎡～500㎡未満 年間販売額（百万円）"},
    {"k57":"売場面積規模別 50㎡～500㎡未満 売場面積（百㎡）"},

    {"k58":"売場面積規模別 500㎡～1,500㎡未満 事業所数"},
    {"k59":"売場面積規模別 500㎡～1,500㎡未満 年間販売額（百万円）"},
    {"k60":"売場面積規模別 500㎡～1,500㎡未満 売場面積（百㎡）"},

    {"k61":"売場面積規模別 1,500㎡～3,000㎡未満 事業所数"},
    //{"k62":"売場面積規模別 1,500㎡～3,000㎡未満 年間販売額（百万円）"},
    //{"k63":"売場面積規模別 1,500㎡～3,000㎡未満 売場面積（百㎡）"},

    {"k64":"売場面積規模別 3,000㎡以上 事業所数"},
    //{"k65":"売場面積規模別 3,000㎡以上 年間販売額（百万円）"},
    //{"k66":"売場面積規模別 3,000㎡以上 売場面積（百㎡）"},

    {"k67":"事業所の開設年 昭和５９年以前 事業所数"},
    {"k68":"事業所の開設年 昭和６０年～平成６年 事業所数"},
    {"k69":"事業所の開設年 平成７年～平成１６年 事業所数"},
    {"k70":"事業所の開設年 平成１７年～平成２３年 事業所数"},
    {"k71":"事業所の開設年 平成２４年～平成２６年 事業所数"},
    {"k72":"事業所の開設年 不詳 事業所数"},

    {"k73":"買回品最寄品業種別 買回品業種 事業所数"},
    {"k74":"買回品最寄品業種別 買回品業種 年間販売額（百万円）"},
    {"k75":"買回品最寄品業種別 買回品業種 売場面積（百㎡）"},

    {"k76":"買回品最寄品業種別 最寄業種 事業所数"},
    {"k77":"買回品最寄品業種別 最寄業種 年間販売額（百万円）"},
    {"k78":"買回品最寄品業種別 最寄業種 売場面積（百㎡）"},

    {"k79":"買回品最寄品業種別 各種商品小売業 事業所数"},
    //{"k80":"買回品最寄品業種別 zz 年間販売額（百万円）"},
    //{"k81":"買回品最寄品業種別 zz 売場面積（百㎡）"},

    {"k82":"買回品最寄品業種別 その他の業種 事業所数"},
    //{"k83":"買回品最寄品業種別 zz 年間販売額（百万円）"},
    //{"k84":"買回品最寄品業種別 zz 売場面積（百㎡）"},

];
var syougyou1kKiboOption = "";
for(var i = 0; i <syugyou1kKiboAr.length; i++){
    //console.log(syugyou1kAr[i]);
    var key = Object.keys(syugyou1kKiboAr[i])[0];
    var val = syugyou1kKiboAr[i][key];
    //console.log(key,val);
    syougyou1kKiboOption += "<option value='" + key + "'>" + val + "</option>"
}
//console.log(syougyou1kKiboOption);





