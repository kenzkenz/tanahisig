if (typeof H_layer00 === 'undefined') {
    var H_layer00  = {};
}
var useLayersArr1 = null;
var useLayersArr2 = null;
var plusLayer1 = [];
var plusLayer2 = [];
var plI = 0;
$(function(){
    //使用するレイヤーを設定
    useLayersArr1 = [mieruneNormal1,
                    pale1,
                    blank1,relief1,lcmfc2_1,H_VT.tikeiVectorTileSizen1,
                    osm1,
                    eventSuiro1,
        //mieruneさん
        mierune,
                    mierune1,mieruneMono1,
        //現在の航空写真
        sikiriGenzaiSyasin,
                    ort1,seamlessphoto1,takaoOrt1,
                    muro1,tondabayasik1,kago1,
        //過去の航空写真
        sikiriKakoSyasin,
                    usaokayama011,
                    usasiawase011,
                    gazo11,old10_1,
                    jpn23ku011,
                    usamiyazaki011,usamiyakonozyou011,usanobeoka011,usakobayasi011,usakumamoto011,usamuroran011,usanatori011,
                    usasendai011,
        jpnfukuoka011,jpnnoboribetu011,
        //都市・道路・河川
        sikiriToshiDouroKasen,
                    H_MVT.tositiiki1,H_MVT.youtotiiki1,H_MVT.suiro1,H_MVT.douro1,H_MVT.kaigansen_1,tondabayasit1,
        //子育て・医療・福祉
        sikiriKosodateFukushi,
                    H_MVT.syougakkouku1,H_MVT.tyuugakkouku1,H_MVT.iryouken1,H_MVT.fukushi_1,
        //人口と経済
        sikiriZinkouKeizai,
                    H_MVT.syoutiikiH17_1,H_MVT.syoutiikiH22_1,H_MVT.syoutiiki1,
                    H_MVT.mesh500_1,H_MVT.keizaiCensus_1,H_MVT.cityGeneki_1,H_MVT.cityZaisei_1,H_MVT.syougyou500m_1,H_MVT.syougyou1000m_s_1,H_MVT.syougyou1000m_g_1,H_MVT.syougyou1000m_k_1,H_MVT.suikei1000m_1,did1,
        //九州北部豪雨
        sikiriKyuusyuuHokubuGouu,
                    ooameasahi01,
                    ooameasia07201,ooameasia07181,
                    t0802dol1,t0713dol21,t0713dol11,t0707dol1,t0707dol31,t0708dol11,t0710dol1,
        //熊本地震
        sikiriKumamotoJisin,
                    kumamoto0724_1,kumamoto_0705_1,kumamoto_0531_1,kumamoto_0530_1,kumamoto_0429A_1,kumamoto_0429B_1,kumamoto_04201_1,kumamoto_04202_1,
                    kumamoto_04203_1,kumamoto_04204_1,kumamoto_04205_1,kumamoto_04206_1,kumamoto_04207_1,kumamoto_04208_1,kumamoto_04209_1,
                    kumamoto_042010_1,kumamoto_042011_1,kumamoto_0419dol2_1,kumamoto_0419dol6_1,kumamoto_0416dol1_1,kumamoto_0416dol2_1,
                    kumamoto_0416dol3_1,kumamoto_0416dol4_1,kumamoto_0416dol5_1,kumamoto_0416dol6_1,kumamoto_0416dol7_1,kumamoto_0415dol1_1,
                    kumamoto_0415dol2_1,kumamoto_0415dol3_1,
        //迅速測図等
        sikiriJinsokutou,
                    rekisitekikantou1,zinsokugazou1,rekisitekitoukyou1,rekisitekihukuyama1,
        //遺跡文化財
        sikiriIsekibunkazai,
                    H_MVT.bunkatyoudb1,H_MVT.zenkokuHakubutukan1,H_MVT.bunkazai1,H_MVT.zenkokuIseki1,H_MVT.yayoi1,H_MVT.kumamotoIseki1,
        //ユネスコ
        sikiriUnesco,
                    aya1,sobo1,soboZ1,
        //古地図
        sikiriKotizu,
                    miyagikotizu1,toukyoukotizu1,hukuikotizu1,aichikotizu1,osakakotizu1,hyogokotizu1,simanekotizu1,
                    okayamakotizu1,hiroshimakotizu1,yamagutikotizu1,koutikotizu1,hukuokakotizu1,sagakotizu1,
                    nagasakikotizu1,kumamotokotizu1,ooitakotizu1,kotizu1,kagosimakotizu1,obikoyizu1,//obi1,
        //戦前戦後
        sikiriSenzensengo,
                    amArr1,
                    murosenzen1,hukuokasisenzen1,
                    sengomiya1,sengonobe1,sengomiyako1,murous1,sengokago1,
        //地質地形
        sikiriTisititikei,
                    kawadake1,ryuuiki1,ecoris1,sekiz1,seamlessArr1,
                    nihonCs1,csArr1,sizuokaCs1,takaoCs1,
    H_MVT.syokusei1,H_MVT.dozyouzu1,
        //ハザード
        sikiriHazard,
                    tunami1,H_MVT.tunamimvt1,sinsuisoutei1,kikenkeiryuu1,kyuukeisyakikenkasyo1,H_MVT.hinanzyo,
        sikiriTest,
                    //anno1,
                    okugainobeoka_1,
                    nobeoka19521,
                    bingroad1,
                    kikenkeiryuuAll1,kyuukeisyakikenkasyoAll1,
                    H_MVT.fukuiRindou1,
                    H_MVT.tunamimiyazakimvt1,
                    H_MVT.tunamiWakkanaimvt1,
                    H_MVT.osmmvt1
    ];
    //------------------------------------------------------------------------------------------------------------------
    useLayersArr2 = [mieruneNormal2,
                    pale2,
                    blank2,relief2,lcmfc2_2,H_VT.tikeiVectorTileSizen2,
                    osm2,
                    eventSuiro2,
        //mieruneさん
        mierune,
                    mierune2,mieruneMono2,
        //現在の航空写真
        sikiriGenzaiSyasin,
                    ort2,seamlessphoto2,takaoOrt2,
                    muro2,tondabayasik2,kago2,
        //過去の航空写真
        sikiriKakoSyasin,
                    usaokayama012,
                    usasiawase012,
                    gazo12,old10_2,
                    jpn23ku012,
                    usamiyazaki012,usamiyakonozyou012,usanobeoka012,usakobayasi012,usakumamoto012,usamuroran012,usanatori012,
                    usasendai012,
                    jpnfukuoka012,jpnnoboribetu012,
        //都市・道路・河川
        sikiriToshiDouroKasen,
                    H_MVT.tositiiki2,H_MVT.youtotiiki2,H_MVT.suiro2,H_MVT.douro2,H_MVT.kaigansen_2,tondabayasit2,
        //子育て・医療・福祉
        sikiriKosodateFukushi,
                    H_MVT.syougakkouku2,H_MVT.tyuugakkouku2,H_MVT.iryouken2,H_MVT.fukushi_2,
        //人口と経済
        sikiriZinkouKeizai,
                    H_MVT.syoutiikiH17_2,H_MVT.syoutiikiH22_2,H_MVT.syoutiiki2,
                    H_MVT.mesh500_2,H_MVT.keizaiCensus_2,H_MVT.cityGeneki_2,H_MVT.cityZaisei_2,H_MVT.syougyou500m_2,H_MVT.syougyou1000m_s_2,H_MVT.syougyou1000m_g_2,H_MVT.syougyou1000m_k_2,H_MVT.suikei1000m_2,did2,
        //九州北部豪雨
        sikiriKyuusyuuHokubuGouu,
                    ooameasahi02,
                    ooameasia07202,ooameasia07182,
                    t0802dol2,t0713dol22,t0713dol12,t0707dol2,t0707dol32,t0708dol12,t0710dol2,
        //熊本地震
        sikiriKumamotoJisin,
                    kumamoto0724_2,kumamoto_0705_2,kumamoto_0531_2,kumamoto_0530_2,kumamoto_0429A_2,kumamoto_0429B_2,kumamoto_04201_2,kumamoto_04202_2,
                    kumamoto_04203_2,kumamoto_04204_2,kumamoto_04205_2,kumamoto_04206_2,kumamoto_04207_2,kumamoto_04208_2,kumamoto_04209_2,
                    kumamoto_042010_2,kumamoto_042011_2,kumamoto_0419dol2_2,kumamoto_0419dol6_2,kumamoto_0416dol1_2,kumamoto_0416dol2_2,
                    kumamoto_0416dol3_2,kumamoto_0416dol4_2,kumamoto_0416dol5_2,kumamoto_0416dol6_2,kumamoto_0416dol7_2,kumamoto_0415dol1_2,
                    kumamoto_0415dol2_2,kumamoto_0415dol3_2,
        //迅速測図等
        sikiriJinsokutou,
                    rekisitekikantou2,zinsokugazou2,rekisitekitoukyou2,rekisitekihukuyama2,
        //遺跡文化財
        sikiriIsekibunkazai,
                    H_MVT.bunkatyoudb2,H_MVT.zenkokuHakubutukan2,H_MVT.bunkazai2,H_MVT.zenkokuIseki2,H_MVT.yayoi2,H_MVT.kumamotoIseki2,
        //ユネスコ
        sikiriUnesco,
                    aya2,sobo2,soboZ2,
        //古地図
        sikiriKotizu,
                    miyagikotizu2,toukyoukotizu2,hukuikotizu2,aichikotizu2,osakakotizu1,hyogokotizu2,simanekotizu2,
                    okayamakotizu2,hiroshimakotizu2,yamagutikotizu2,koutikotizu2,hukuokakotizu2,sagakotizu2,
                    nagasakikotizu2,kumamotokotizu2,ooitakotizu2,kotizu2,kagosimakotizu2,obikoyizu2,//obi1,
        //戦前戦後
        sikiriSenzensengo,
                    amArr2,
                    murosenzen2,hukuokasisenzen2,
                    sengomiya2,sengonobe2,sengomiyako2,murous2,sengokago2,
        //地質地形
        sikiriTisititikei,
                    kawadake2,ryuuiki2,ecoris2,sekiz2,seamlessArr2,
                    nihonCs2,csArr2,sizuokaCs2,takaoCs2,
                    H_MVT.syokusei2,H_MVT.dozyouzu2,
        //ハザード
        sikiriHazard,
                    tunami2,H_MVT.tunamimvt2,sinsuisoutei2,kikenkeiryuu2,kyuukeisyakikenkasyo2,
        sikiriTest,
                    //anno1,
                    okugainobeoka_2,
                    nobeoka19521,
                    bingroad2,
                    kikenkeiryuuAll2,kyuukeisyakikenkasyoAll2,
                    H_MVT.fukuiRindou1,
                    H_MVT.tunamimiyazakimvt1,
                    H_MVT.tunamiWakkanaimvt1
    ];
    $("body").on("click",".secret",function() {
        alert("");
        $(".secret-tr").toggle();
    });
});

//------------------------------------------------------------------------------
//背景ダイアログ用のテーブルを作成する。haikei.jsで使っている。
function funcHaikeiTableCreate(mapElement,mapName){
    if(mapName=="map1"){
        var layers = useLayersArr1;
    }else{
        var layers = useLayersArr2;
    }
    var htmlChar = "<div class='haikei-tbl-div'><table class='haikei-tbl table table-bordered table-condensed'>";
    for(var i = 0; i <layers.length; i++) {
        if (i == 0) {
            var chkChar = "checked";
        } else {
            var chkChar = "";
        }
        if (!Array.isArray(layers[i])) {//配列でないとき
            var prop = layers[i].getProperties();
        } else {//配列のとき
            var prop = layers[i][0].getProperties();
        }
        if (prop["icon"]) {
            var icon = prop["icon"] + " ";
        } else {
            var icon = "";
        }
        var trHtml = "";
        if (prop["folder"] === "child"){
            trHtml = "<tr class='tr-" + prop["category"] + "' style='display:none;'>";
        } else {
            trHtml = "<tr>";
        }
        htmlChar += trHtml;
        htmlChar += "<td><label><input type='checkbox' name='haikei-check' value='" + i + "'" + chkChar + "> " + icon +  prop["title"] + "</label></td>";
        htmlChar += "<td class='td-slider'><div class='haikei-slider'></div></td>";
        htmlChar += "<td class='td-sort' title='ドラッグします。'><i class='fa fa-bars fa-lg'></i></td>";
        htmlChar += "<td class='td-info'><i class='fa fa-info-circle fa-lg primary'></i></td>";
        htmlChar += "</tr>";
    }
    htmlChar += "</table>";
    //htmlChar += "<div style='text-align:right;'><span class='secret'>情報政策課</span></div>";
    htmlChar += "</div>";
    mapElement.find(".haikei-dialog .dialog-content").html(htmlChar);
    funcHaikeiTblDivHeight();//common.jsにある関数
    mapElement.find(".haikei-slider").eq(0).slider({
        min:0,max:1,value:1,step:0.01,
        slide: function(event,ui){
            layers[0].setOpacity(ui.value);
            H_COMMON.setHush("l",H_COMMON.getHushJson());
        }
    });
    mapElement.find(".haikei-tbl tbody").sortable({
        handle:".td-sort",
        update:function(event,ui){
            funcHaikeiLayerSort(mapElement,mapName);
        }
    }).disableSelection();
    //チェックボックスをカスタム。iCheckに。
    mapElement.find("input:checkbox[name='haikei-check']").iCheck({
        checkboxClass:"icheckbox_flat-blue",
        radioClass:"iradio_flat-blue"
    });
    //チェックボックスを押した時★★★★★-------------------------------------------------------------------------
    mapElement.find("input:checkbox[name='haikei-check']").on("ifChanged",function(event){
        //背景レイヤーの追加、削除
        var layer = layers[Number($(this).val())];
        if(!Array.isArray(layer)){//普通のとき
            var prop = layer.getProperties();
        }else{//配列のとき
            var prop = layer[0].getProperties();
        }
        if(prop["folder"]==="parent"){
            console.log(prop["folder"]);
            console.log(prop["category"]);
            var trErement = $(".tr-" + prop["category"]);
            trErement.toggle();
            if($(this).prop("checked")) {
                trErement.children().animate({
                    "background-color": "rgba(51,122,183,1.0)"
                }, 1000).animate({
                    "background-color": "white"
                }, 1000);
            }
            return;
        }
        try {
            if (layer.get("name") === "sobo") {
                if ($(this).prop("checked")) {
                    var msg = "";
                    msg += "<img src='icon/sobo01.jpg' style='width:100%'>";
                    msg += "<div style='text-align:center;position:absolute;bottom:1px;left:50%;width:100px;margin-left:-50px;'><a href='http://sobokatamuki-br-council.org/' target='_blank'>詳細はこちら</a></div>";
                    $.notify({//options
                        message: msg
                    }, {//settings
                        type: "danger",
                        z_index: 999999,
                        placement: {
                            from: "top",
                            align: "center"
                        },
                        animate: {
                            enter: "animated fadeInDown",
                            exit: "animated fadeOutUp"
                        },
                        timer: 0
                    });
                }
            }
        }catch(e){}

        var trErement = $(this).parents("tr");
        if($(this).prop("checked")){
            if(!Array.isArray(layer)){
                layer.set("altitudeMode","clampToGround");
                layer.set("selectable",true);
                var title = layer.getProperties()["title"];
                console.log(title);
                if(title==="osmmvt") {
                    fetch('stylejson/style.json').then(function(response) {
                        response.json().then(function(glStyle) {
                            olms.applyStyle(layer, glStyle, 'openmaptiles').then(function () {
                                eval(mapName).addLayer(layer);
                            });
                        });
                    });
                    $("#" + mapName).css({
                        "background":"hsl(47, 26%, 88%)"
                    })
                }else{
                    eval(mapName).addLayer(layer);
                }
                //座標を移動する。
                if(layer.getProperties()["coord"]){
                    var lonlat = layer.getProperties()["coord"];
                    lonlat = ol.proj.transform(lonlat,"EPSG:4326","EPSG:3857");
                    eval(mapName).getView().setCenter(lonlat);
                }
                //ズーム利を設定する。
                if(layer.getProperties()["zoom"]){
                    var zoom = layer.getProperties()["zoom"];
                    eval(mapName).getView().setZoom(zoom);
                }

            }else{//配列のとき
                for(var i = 0; i < layer.length; i++){
                    eval(mapName).addLayer(layer[i]);
                }
            }

            trErement.children().animate({
                "background-color":"#FFC0CB"
            },1000).animate({
                "background-color":"white"
            },1000);
            trErement.prependTo($(this).parents(".haikei-tbl"));
            //$(this).parents(".haikei-tbl-div").scrollTop(0);
            $(this).parents(".haikei-tbl-div").animate({scrollTop:0});
            funcHaikeiLayerSort(mapElement,mapName);
        }else{
            if(!Array.isArray(layer)){
                eval(mapName).removeLayer(layer);
            }else{//配列のとき
                for(var i = 0; i < layer.length; i++){
                    eval(mapName).removeLayer(layer[i]);
                }
            }
        }
        var tgtTr = $(this).parents("tr");
        tgtTr.find(".haikei-slider").slider({
            min:0,max:1,value:1,step:0.01,
            slide: function(event, ui){
                if(!Array.isArray(layer)){
                    layer.setOpacity(ui.value);
                }else{
                    for(var i = 0; i < layer.length; i++){
                        layer[i].setOpacity(ui.value);
                    }
                }
                H_COMMON.setHush("l",H_COMMON.getHushJson());
            }
        });
        //---------------------------------------------------------------------
        var ua = navigator.userAgent;
        try {
            var idandclass = layer.getProperties()["title"];
        }catch(e){
            var idandclass = layer[0].getProperties()["title"];
        }
        var myurl = location.href;
        $.ajax({
            type:"GET",
            url:"php/log.php",
            data:{
                idandclass:"背景名:" + idandclass,
                ua:ua,
                myurl:myurl
            }
        }).done(function(){
        }).fail(function(){
            console.log("ログ失敗!");
        });
        //----------------------------------------------------------------------
        H_COMMON.setHush("l",H_COMMON.getHushJson());
    });
    //チェックボックスを押した時　ここまで★★★★★--------------------------------------------------------------------------
}
//------------------------------------------------------------------------------
//背景レイヤーの重なり順をtr順に変更する。
function funcHaikeiLayerSort(mapElement,mapName){
    //H_COMMON.setHush("l",H_COMMON.getHushJson());
    //--------------------------------------
    //swipeのため
    if(mapName=="map1"){
        var swipeCtr = H_START.swipeCtr1;
    }else{
        var swipeCtr = H_START.swipeCtr2;
    }
    if(mapElement.find(".swipe-toggle").prop("checked")){
        eval(mapName).addControl(swipeCtr);
    }else{
        eval(mapName).removeControl(swipeCtr);
    }
    //縦分割か横分割か
    swipeCtr.set("orientation",$("input:radio[name='swipe-radio-" + mapName + "']:checked").val());
    //-------------------------------------
    mapElement.find(".haikei-tbl tbody tr").each(function(e){
        if(mapName=="map1"){
            var layer = useLayersArr1[Number($(this).find("input:checkbox").val())];
        }else{
            var layer = useLayersArr2[Number($(this).find("input:checkbox").val())];
        }
        if($(this).attr("class")!="plus-tr") {
            if (!Array.isArray(layer)) {
                layer.setZIndex(-e);

                //------------------------------
                //swipeのため
                swipeCtr.removeLayer(layer);
                if (e == 1) {
                    swipeCtr.addLayer(layer, true);
                } else if (e == 0) {
                    swipeCtr.addLayer(layer);
                }
                //------------------------------

            } else {
                for (var i = 0; i < layer.length; i++) {
                    layer[i].setZIndex(-e);

                    //------------------------------
                    //swipeのため
                    swipeCtr.removeLayer(layer);
                    if (e == 1) {
                        swipeCtr.addLayer(layer, true);
                    } else if (e == 0) {
                        swipeCtr.addLayer(layer);
                    }
                    //------------------------------
                }
            }
        }else{
            var Num = Number($(this).find("input:checkbox[name='haikei-check-plus']").val());
            if(mapName=="map1") {
                var plusLayer = plusLayer1[Num];
            }else{
                var plusLayer = plusLayer2[Num];
            }
            plusLayer.setZIndex(-e);

            //------------------------------
            //swipeのため
            swipeCtr.removeLayer(plusLayer);
            if (e == 1) {
                swipeCtr.addLayer(plusLayer, true);
            } else if (e == 0) {
                swipeCtr.addLayer(plusLayer);
            }
            //------------------------------

        }
    });
    H_COMMON.setHush("l",H_COMMON.getHushJson());
}
//------------------------------------------------------------------------------
$(function(){
    //--------------------------------------------------------------------------
    //インフォメーションを押したとき
    $("body").on("click",".td-info",function(){
        var mapObj = funcMaps($(this));
        var mapName = mapObj["name"];
        var layerVal = $(this).parents("tr").find("input").val();

        console.log(layerVal);
        //--------------------------------------------
        if(layerVal==="pluslayer") {
            var dialog = layerPlusDialog($(this));
            dialog = $("#mydialog-" + dialog);
            var layers = eval(mapName).getLayers().getArray();
            for(var i = 0; i <layers.length; i++){
                if(layers[i].getProperties()["plusName"]) {
                    var layerPlusName = layers[i].getProperties()["plusName"];
                    var inputPlusName = $(this).parents("tr").find("input").data("plusname");
                    if(layerPlusName===inputPlusName){
                        var plusName = layers[i].getProperties()["plusName"];
                        var plusUrl = layers[i].getProperties()["plusUrl"];
                        dialog.find(".plus-name-input").val(plusName);
                        dialog.find(".plus-url-input").val(plusUrl);
                        dialog.find(".plus-btn").prop("disabled","disabled");
                        dialog.find(".plus-edit-btn").prop("disabled",false);
                        dialog.find(".plus-delete-btn").prop("disabled",false);

                        dialog.attr("data-plusname",plusName)
                    }
                }
            }
            return false;
        }
        //--------------------------------------------
        var layer = mapObj["layers"][layerVal];
        if(!Array.isArray(layer)){
            var layerName = layer.getProperties()["name"];
        }else {//配列のとき
            var layerName = layer[0].getProperties()["name"];
        }

        console.log(layerName);
        var targetDialog = $("#mydialog-" + mapName + "-info-dialog-" + layerName);
        console.log(targetDialog.length);
        if(targetDialog.length) {//既に作成すみのとき
            targetDialog.show(function(){
                dialogbaseMaxzindex(targetDialog);
            });
            return;
        }
        //$("#" + mapName + " .info-dialog").remove();
        targetDialog.remove();

        if(!Array.isArray(layer)){
            var prop = layer.getProperties();
        }else{//配列のとき
            var prop = layer[0].getProperties();
        }
        var content = "<table class='info-tbl table table-bordered table-condensed' data-layername='" + prop["name"] + "'>";
        content += "<tr><td>背景名</td><td>" + prop["title"] + "</td></tr>";
        content += "<tr><td>出典</td><td>" + prop["origin"] + "</td></tr>";
        content += "<tr><td>説明</td><td class='detail-td'>" + prop["detail"] + "</td></tr>";
        content += "</table>";
        content += "<input type='hidden' class='layer-id' value='" + $(this).parents("tr").find("input").val() + "'>";

        if(prop["detail2"]) content += prop["detail2"];

        mydialog({
            id:mapName + "-info-dialog-" + layerName,
            class:"info-dialog",
            map:mapName,
            title:"インフォ",
            content:content,
            top:"100px",
            right:"20px",
            rmDialog:true
        });
        //------------------------------------------------------
        console.log(prop);
        console.log(prop["name"]);
        /*
        if(prop["name"]==="keizai-census"){

            var extent = eval(mapName).getView().calculateExtent(eval(mapName).getSize());

            console.log(extent)

            console.log(layer.getSource());
            var prop = layer.getSource()["a"]["a"]["gd"]["f"][0]["c"];
            console.log(prop);

            var mapObj = funcMaps($(this));
            var mapName = mapObj["name"];
            var option = "";
            for(key in prop){
                //console.log(key);
                if(key.indexOf("ks_T000")!=-1) option += "<option value='" + key +  "'>" + key.replace("ks_","") + "</option>"

                 //table += "<tr>";
                 //var prop = featureProp[key];
                 //table += "<th class='popup-th'>" + key + "</th><td class='popup-td'>" + prop + "</td>";
                 //table += "</tr>";

            }
            $("#" + mapName + " .target-select").html(option)
        }
        $("#" + mapName).on("change",".target-select",function() {
            var val = $(this).val();
            console.log(val);
            keizaiCensusTarget = val;
            layer.getSource().changed();
        });
        $("#" + mapName + " .kslimittext").spinner({
            max:5000, min:10, step:10,
            spin:function(event,ui){
                ksLimitChange(ui.value,mapName);
            }
        });
        function ksLimitChange(ksLimit0,mapName){
            ksLimit = ksLimit0;
            vtMaxColor = $("#" + mapName + " .syoutiiki-color-select").val();
            console.log(vtMaxColor);
            vtColor = d3.interpolateLab("white",vtMaxColor);
            layer.getSource().changed();
        }
        */






        //--------------------------------------------------------------------------------------------------------------
        //全国海岸線
        $("#" + mapName).on("change",".kaigansen-color-select,.kaigansen-width-select",function(){
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var colorVal = $(this).parents(".detail2-div").find(".kaigansen-color-select").val();
            var width = $(this).parents(".detail2-div").find(".kaigansen-width-select").val();
            kaigansenColorChange(mapName,layerId,colorVal,width);
        });
        function kaigansenColorChange(mapName,layerId,colorVal,width){
            if(mapName==="map1") {
                var targetLayer = useLayersArr1[layerId];
            }else{
                var targetLayer = useLayersArr2[layerId];
            }
            targetLayer.setStyle(H_MVT.kaigansebStyleFunction(colorVal,width));
            targetLayer.getSource().changed();
        }
        //--------------------------------------------------------------------------------------------------------------
        //osmmvt
        $("#" + mapName).on("change",".osmmvt-select",function(){
            var val = $(this).val();
            console.log(val);
            $("#" + mapName).css({
                //"background":"hsl(47, 26%, 88%)"
                "background":val
            })
        });
        //--------------------------------------------------------------------------------------------------------------
        //小地域
        $("#" + mapName + " .syoutiikitext").spinner({
            max:5000, min:0, step:10,
            spin:function(event,ui){
                var colorVal = $(this).parents(".detail2-div").find("select").val();
                var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
                syoutiikiColorChange(mapName,layerId,ui.value,colorVal);
            }
        });
        $("#" + mapName).on("keyup",".syoutiikitext",function(){
            var limit = $(this).parents(".detail2-div").find("input").val();
            var colorVal = $(this).parents(".detail2-div").find(".syoutiiki-color-select").val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            syoutiikiColorChange(mapName,layerId,limit,colorVal);
        });
        $("#" + mapName).on("change",".syoutiiki-color-select",function(){
            var limit = $(this).parents(".detail2-div").find("input").val();
            var colorVal = $(this).val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            syoutiikiColorChange(mapName,layerId,limit,colorVal);
        });
        function syoutiikiColorChange(mapName,layerId,limit,colorVal){
            console.log(limit)
            if(mapName==="map1") {
                var targetLayer = useLayersArr1[layerId];
            }else{
                var targetLayer = useLayersArr2[layerId];
            }
            targetLayer.setStyle(H_MVT.syoutiikiCommonStyleFunction(colorVal,limit));
            targetLayer.getSource().changed();
        }
        //--------------------------------------------------------------------------------------------------------------
        //500mesh
        $("#" + mapName + " .mesh500text").spinner({
            max:5000, min:100, step:100,
            spin:function(event,ui){
                var colorVal = $(this).parents(".detail2-div").find(".mesh500-color-select").val();
                var yearVal = $(this).parents(".detail2-div").find(".mesh500-year-select").val();
                var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
                mesh500ColorChange(mapName,layerId,ui.value,colorVal,yearVal);
            }
        });
        $("#" + mapName).on("keyup",".mesh500text",function(){
            var limit = $(this).parents(".detail2-div").find("input").val();
            var colorVal = $(this).parents(".detail2-div").find(".mesh500-color-select").val();
            var yearVal = $(this).parents(".detail2-div").find(".mesh500-year-select").val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            mesh500ColorChange(mapName,layerId,limit,colorVal,yearVal);
        });
        $("#" + mapName).on("change",".mesh500-select",function(){
            var limit = $(this).parents(".detail2-div").find("input").val();
            var colorVal = $(this).parents(".detail2-div").find(".mesh500-color-select").val();
            var yearVal = $(this).parents(".detail2-div").find(".mesh500-year-select").val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            mesh500ColorChange(mapName,layerId,limit,colorVal,yearVal);
            console.log(yearVal);
            console.log($(this).parents(".dialog-base").find(".detail-td"));
            if(yearVal==="hutanritu") {
                $(this).parents(".dialog-base").find(".detail-td").html(mesh500Detail);
            }else{
                $(this).parents(".dialog-base").find(".detail-td").html("");
            }
        });
        function mesh500ColorChange(mapName,layerId,limit,colorVal,yearVal){
            if(mapName==="map1") {
                var targetLayer = useLayersArr1[layerId];
            }else{
                var targetLayer = useLayersArr2[layerId];
            }
            targetLayer.setStyle(H_MVT.mesh500CommonStyleFunction(colorVal,limit,yearVal));
            targetLayer.getSource().changed();
        }
        //--------------------------------------------------------------------------------------------------------------
        //商業500mesh
        $("#" + mapName + " .syougyouMeshtext").spinner({
            max:5000, min:1, step:1,
            spin:function(event,ui){
                var colorVal = $(this).parents(".detail2-div").find(".syougyouMesh-color-select").val();
                var yearVal = $(this).parents(".detail2-div").find(".syougyouMesh-year-select").val();
                var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
                syougyouMeshColorChange(mapName,layerId,ui.value,colorVal,yearVal);
            }
        });
        $("#" + mapName).on("keyup",".syougyouMeshtext",function(){
            var limit = $(this).parents(".detail2-div").find("input").val();
            var colorVal = $(this).parents(".detail2-div").find(".syougyouMesh-color-select").val();
            var yearVal = $(this).parents(".detail2-div").find(".syougyouMesh-year-select").val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            syougyouMeshColorChange(mapName,layerId,limit,colorVal,yearVal);
        });
        $("#" + mapName).on("change",".syougyouMesh-select",function(){
            var limit = $(this).parents(".detail2-div").find("input").val();
            var colorVal = $(this).parents(".detail2-div").find(".syougyouMesh-color-select").val();
            var yearVal = $(this).parents(".detail2-div").find(".syougyouMesh-year-select").val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            syougyouMeshColorChange(mapName,layerId,limit,colorVal,yearVal);
            console.log(yearVal);
            console.log($(this).parents(".dialog-base").find(".detail-td"));
        });
        function syougyouMeshColorChange(mapName,layerId,limit,colorVal,yearVal){
            console.log(mapName,layerId,limit,colorVal,yearVal);
            if(mapName==="map1") {
                var targetLayer = useLayersArr1[layerId];
            }else{
                var targetLayer = useLayersArr2[layerId];
            }
            targetLayer.setStyle(H_MVT.syougyouMeshCommonStyleFunction(colorVal,limit,yearVal));
        }
        //--------------------------------------------------------------------------------------------------------------
        //経済センサス
        $("#" + mapName + " .keizaicensustext").spinner({
            max:50000, min:1, step:100,
            spin:function(event,ui){
                var colorVal = $(this).parents(".detail2-div").find(".keizaicensus-color-select").val();
                if($(this).parents(".detail2-div").find(".keizaicensus-column2-select").val()==="99") {
                    var columunVal = $(this).parents(".detail2-div").find(".keizaicensus-column-select").val();
                }else{
                    var columunVal = $(this).parents(".detail2-div").find(".keizaicensus-column2-select").val();
                }
                var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
                keizaiCensusColorChange(mapName,layerId,ui.value,colorVal,columunVal);
            }
        });
        $("#" + mapName).on("keyup",".keizaicensustext",function(){
            var limit = $(this).parents(".detail2-div").find("input").val();
            var colorVal = $(this).parents(".detail2-div").find(".keizaicensus-color-select").val();
            if($(this).parents(".detail2-div").find(".keizaicensus-column2-select").val()==="99") {
                var columunVal = $(this).parents(".detail2-div").find(".keizaicensus-column-select").val();
            }else{
                var columunVal = $(this).parents(".detail2-div").find(".keizaicensus-column2-select").val();
            }
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            keizaiCensusColorChange(mapName,layerId,limit,colorVal,columunVal);
        });
        $("#" + mapName).on("change",".keizaicensus-select",function(){
            var limit = $(this).parents(".detail2-div").find("input").val();
            var colorVal = $(this).parents(".detail2-div").find(".keizaicensus-color-select").val();
            if($(this).hasClass("keizaicensus-column-select")) {
                var columunVal = $(this).parents(".detail2-div").find(".keizaicensus-column-select").val();
                $(this).parents(".detail2-div").find(".keizaicensus-column2-select").val("99");
            }else if($(this).hasClass("keizaicensus-column2-select")) {
                var columunVal = $(this).parents(".detail2-div").find(".keizaicensus-column2-select").val();
                $(this).parents(".detail2-div").find(".keizaicensus-column-select").val("99");
            }else{
                if($(this).parents(".detail2-div").find(".keizaicensus-column2-select").val()==="99") {
                    var columunVal = $(this).parents(".detail2-div").find(".keizaicensus-column-select").val();
                }else{
                    var columunVal = $(this).parents(".detail2-div").find(".keizaicensus-column2-select").val();
                }
            }
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            keizaiCensusColorChange(mapName,layerId,limit,colorVal,columunVal);
        });
        function keizaiCensusColorChange(mapName,layerId,limit,colorVal,columunVal){
            if(mapName==="map1") {
                var targetLayer = useLayersArr1[layerId];
            }else{
                var targetLayer = useLayersArr2[layerId];
            }
            targetLayer.setStyle(H_MVT.keizaiCensusStyleFunction(colorVal,limit,columunVal));
        }
        //--------------------------------------------------------------------------------------------------------------
        //福祉施設
        $("#" + mapName).on("change",".fukushi-select",function(){
            var target = $(this).val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.fukushiStyleFunction(target) );
        });
        //--------------------------------------------------------------------------------------------------------------
        //津波浸水想定
        $("#" + mapName).on("change",".tunami-select",function(){
            var target = $(this).val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.tunamiMiyazakiStyleFunction(target) );
        });
        //--------------------------------------------------------------------------------------------------------------
        //北海道津波浸水想定
        $("#" + mapName).on("change",".tunamihokkaidou-select",function(){
            var target = $(this).val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.tunamiHokkaidouStyleFunction(target));
        });
        //--------------------------------------------------------------------------------------------------------------
        //市町村現役率
        $("#" + mapName + " .cityGeneki-year-slider").slider({
            min:1980,max:2040,value:2015,step:5,
            slide: function(event, ui){
                var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
                var mapObj = funcMaps($(this));
                var targetLayer = mapObj["layers"][layerId];
                var target = ui.value;
                var colorChart = $(this).parents(".detail2-div").find(".cityGeneki-colorchart-select").val();
                targetLayer.setStyle(H_MVT.cityGenekiCommonStyleFunction(target,colorChart));
                $("#" + mapName + " .cityGeneki-year-select").val(target);
            }
        });
        $("#" + mapName).on("change",".cityGeneki-year-select",function(){
            var target = $(this).parents(".detail2-div").find(".cityGeneki-year-select").val();
            var colorChart = $(this).parents(".detail2-div").find(".cityGeneki-colorchart-select").val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.cityGenekiCommonStyleFunction(target,colorChart));
        });
        $("#" + mapName).on("change",".cityGeneki-colorchart-select",function(){
            var target = $(this).parents(".detail2-div").find(".cityGeneki-year-select").val();
            var colorChart = $(this).parents(".detail2-div").find(".cityGeneki-colorchart-select").val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.cityGenekiCommonStyleFunction(target,colorChart));
        });
        //--------------------------------------------------------------------------------------------------------------
        //市町村財政指数
        $("#" + mapName + " .cityZaisei-year-slider").slider({
            min:1977,max:2015,value:2015,step:1,
            slide: function(event, ui){
                var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
                var mapObj = funcMaps($(this));
                var targetLayer = mapObj["layers"][layerId];
                var target = ui.value + "_1";
                var colorChart = $(this).parents(".detail2-div").find(".cityZaisei-colorchart-select").val();
                targetLayer.setStyle(H_MVT.cityZaiseiCommonStyleFunction(target,colorChart));
                $("#" + mapName + " .cityZaisei-year-select").val(target);
            }
        });
        $("#" + mapName).on("change",".cityZaisei-year-select",function(){
            var target = $(this).parents(".detail2-div").find(".cityZaisei-year-select").val();
            var colorChart = $(this).parents(".detail2-div").find(".cityZaisei-colorchart-select").val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.cityZaiseiCommonStyleFunction(target,colorChart));
        });
        $("#" + mapName).on("change",".cityZaisei-colorchart-select",function(){
            var target = $(this).parents(".detail2-div").find(".cityZaisei-year-select").val();
            var colorChart = $(this).parents(".detail2-div").find(".cityZaisei-colorchart-select").val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.cityZaiseiCommonStyleFunction(target,colorChart));
        });

        //-------------------------------------------------------
        //旧石器
        $("#" + mapName).on("change",".kyuusekki-cate-select",function() {
            var target = $(this).val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.zenkokuisekiStyleFunction(target));
            /*
            var val = $(this).val();
            console.log(val);
            kyuusekkiTarget = val;
            layer.getSource().changed();
            */
        });
        //------------------------------------------------
        //二次医療圏
        $("#" + mapName).on("change",".iryouken-color-select",function(){
            var target = $(this).val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.d3StyleFunction(Number(target)));
        });
        //-------------------------------------------------------
        //用途地域
        $("#" + mapName).on("change",".youtotiiki-cate-select",function() {
            var target = $(this).val();
            var layerId = $(this).parents(".dialog-base").find(".layer-id").val();
            var mapObj = funcMaps($(this));
            var targetLayer = mapObj["layers"][layerId];
            targetLayer.setStyle(H_MVT.youtotiikiStyleFunction(Number(target)));
        });
        //-------------------------------------------------------
        $("#" + mapName).on("change",".dozyouzu-cate-select",function() {
            var val = $(this).val();
            console.log(val);
            dozyouzuTarget = val;
            layer.getSource().changed();
        });
        //-------------------------------------------------------
        $("#" + mapName).on("change",".syokusei-cate-select",function() {
            var val = $(this).val();
            console.log(val);
            syokuseiTarget = val;
            layer.getSource().changed();
            $("#" + mapName + " .syokurin-cate-select").val("99");
        });
        $("#" + mapName).on("change",".syokurin-cate-select",function() {
            var val = $(this).val();
            console.log(val);
            syokuseiTarget = val;
            layer.getSource().changed();
            $("#" + mapName + " .syokusei-cate-select").val("99");
        });
        //-------------------------------------------------------
        $("#" + mapName).on("change",".syoukubun-cate-select",function() {
            var val = $(this).val();
            console.log(val);
            syoukubunTarget = val;
            layer.getSource().changed();
        });

        //-------------------------------------------------------
        $("#" + mapName).on("change",".totiriyou-cate-select",function() {
            var val = $(this).val();
            console.log(val);
            totiriyouTarget = val;
            console.log(layer);

            for(var i = 0; i < layer.length; i++){
                layer[i].getSource().changed();
            }
            //totiriyou40001.getSource().changed();
        });
        //-------------------------------------------------------
        $("#" + mapName + " .keizaitext").spinner({
            max:100000, min:100, step:100,
            spin:function(event,ui){
                keizaiColorChange(ui.value,mapName);
            }
        });
        $("#" + mapName).on("change",".keizaicensus-color-select",function(){
            var mapObj = funcMaps($(this));
            var mapName = mapObj["name"];
            console.log(mapName);
            console.log($("#" + mapName + " .keizaitext").val());
            kyoudo = $("#" + mapName + " .keizaitext").val();
            keizaiColorChange(kyoudo,mapName);
        });
        //------------------------------------------------
        function keizaiColorChange(kyoudo0,mapName){
            kyoudoKeizai = kyoudo0;
            keizaiMaxColor = $("#" + mapName + " .keizaicensus-color-select").val();
            console.log(keizaiMaxColor);
            keizaiColor = d3.interpolateLab("white",keizaiMaxColor);
            layer.getSource().changed();
        }

        //------------------------------------------------
        $("#" + mapName).on("change",".senkyoku-color-select",function(){
            var val = $(this).val();
            console.log(val);
            senkyokuTarget = val;
            layer.getSource().changed();
        });


        return false;
    });
    //------------------------------------------------------------
    //スワイプトグルを操作したとき
    $("body").on("change",".swipe-toggle",function(){
        var mapObj = funcMaps($(this));
        funcHaikeiLayerSort(mapObj["element"], mapObj["name"]);
    });
    //------------------------------------------------------------
    //プラスアイコンを押した時
    $("body").on("click",".dialog-plus",function(){
        //layerPlusDialog($(this));
        var dialog = layerPlusDialog($(this));
        dialog = $("#mydialog-" + dialog);
        dialog.find(".plus-name-input").val("");
        dialog.find(".plus-url-input").val("");
        dialog.find(".plus-btn").prop("disabled",false);
        dialog.find(".plus-edit-btn").prop("disabled","disabled");
        dialog.find(".plus-delete-btn").prop("disabled","disabled");
        dialog.attr("data-plusname","");
        return false;
    });
    function layerPlusDialog(elem){
        var mapObj = funcMaps(elem);
        var id = "plus-dialog-" + mapObj["name"];
        var content = "地図タイルのURLを入力します。";
        /*
        content += "<br>・国土地理院標準地図の例：<br>　http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
        content += "<br>・国土地理院空中写真（1936年頃：東京都23区）の例<br>　http://cyberjapandata.gsi.go.jp/xyz/ort_riku10/{z}/{x}/{y}.png";
        content += "<br>・タイルを配信しているサイト";
        content += "<div style='padding:0 0 0 20px'>";
        content += "<a href='https://mapwarper.h-gis.jp' target='_blank'>日本版Map Warper</a>";
        content += "</div>";
        */
        content += "<input type='text' class='form-control plus-url-input' placeholder='例：http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'>";
        content += "名前を入力します。";
        content += "<input type='text' class='form-control plus-name-input' placeholder='名前'>";
        content += "<div class='plus-div'>";
        content += "<div class='plus-div'><button type='button' class='btn btn-primary btn-sm plus-btn'>追加</button>";
        content += " <button type='button' class='btn btn-primary btn-sm plus-edit-btn' disabled='disabled'>編集</button>";
        content += " <button type='button' class='btn btn-primary btn-sm plus-delete-btn' disabled='disabled'>削除</button>";
        content += "</div>";
        mydialog({
            id: id,
            class: "plus-dialog",
            map: mapObj["name"],
            title: "背景レイヤー追加",
            content: content,
            top: "55px",
            right: "20px",
            //hide:true,
            //plus:true
        });
        return id;
    }
    //------------------------------------------------------------
    //レイヤー追加ボタンを押した時
    H_layer00.layerPlus = function(elem,plusUrl,plusName){
        plI++;
        var mapObj = funcMaps(elem);
        var mapName = mapObj["name"];
        var plusUrl0 = plusUrl;
        if(plusUrl==="") return;
        if(plusUrl.indexOf("mtile.pref.miyazaki")===-1) {
            plusUrl = "./php/proxy-png.php?url=" + plusUrl;
        }
        $(this).parents(".dialog-base").find(".plus-url-input").val("");
        plusLayer1[plI] = new ol.layer.Tile({
            title:"pulus",
            origin:"",
            detail:"",
            icon:"<i class='fa fa-map-o fa-fw' style='color:dimgrey;'></i>",
            source:new ol.source.XYZ({
                url:plusUrl,
                crossOrigin:"anonymous"
            })
        });
        plusLayer2[plI] = new ol.layer.Tile({
            title:"pulus",
            origin:"",
            detail:"",
            icon:"<i class='fa fa-map-o fa-fw' style='color:dimgrey;'></i>",
            source:new ol.source.XYZ({
                url:plusUrl,
                crossOrigin:"anonymous"
            })
        });
        if(mapName=="map1") {
            var plusLayer = plusLayer1[plI];
        }else{
            var plusLayer = plusLayer2[plI];
        }
        plusLayer.setProperties({
            "name":"plusLayer",
            "plusName":plusName,
            "plusUrl":plusUrl0
        });
        eval(mapName).addLayer(plusLayer);
        plusLayer.set("altitudeMode","clampToGround");
        plusLayer.set("selectable",true);

        var htmlChar = "<tr class='plus-tr'>";
        //htmlChar += "<td><label><input type='checkbox' name='haikei-check-plus' value='" + plI + "' checked> <i class='fa fa-map-o fa-fw' style='color:red;'></i> 追加レイヤー" + plI + "</label></td>";
        htmlChar += "<td><label><input type='checkbox' name='haikei-check-plus' value='pluslayer' data-plusname='" + plusName + "' checked> <i class='fa fa-thumbs-up fa-fw fa-lg' style='color:rgb(51,122,183);'></i> " + plusName + "</label></td>";
        htmlChar += "<td class='td-slider'><div class='haikei-slider'></div></td>";
        htmlChar += "<td class='td-sort' title='ドラッグします。'><i class='fa fa-bars fa-lg'></i></td>";
        htmlChar += "<td class='td-info'><i class='fa fa-info-circle fa-lg primary'></i></td>";
        htmlChar += "</tr>";
        $(this).parents(".dialog-base").hide(500);
        $("#" + mapName + " .haikei-tbl tbody").prepend(htmlChar);
        //チェックボックスをカスタム。iCheckに。
        var tgtTr = $("#" + mapName + " .haikei-tbl tbody tr:first");
        tgtTr.find("input:checkbox[name='haikei-check-plus']").iCheck({
            checkboxClass:"icheckbox_flat-blue",
            radioClass:"iradio_flat-blue"
        });
        //
        tgtTr.find("input:checkbox[name='haikei-check-plus']").on("ifChanged",function(event) {
            var Num = Number($(this).val());;
            if (mapName == "map1") {
                var plusLayer = plusLayer1[Num];
            } else {
                var plusLayer = plusLayer2[Num];
            }
            if($(this).prop("checked")) {
                eval(mapName).addLayer(plusLayer);
            }else {
                eval(mapName).removeLayer(plusLayer);
            }
        });
        tgtTr.find(".haikei-slider").slider({
            min:0,max:1,value:1,step:0.01,
            slide: function(event, ui){
                plusLayer.setOpacity(ui.value);
                H_COMMON.setHush("l",H_COMMON.getHushJson());
            }
        });
        return plusLayer;
    };
    $("body").on("click",".plus-btn",function() {
        var dialog = $(this).parents(".dialog-base");
        var plusUrl = dialog.find(".plus-url-input").val();
        var plusName = dialog.find(".plus-name-input").val();
        H_layer00.layerPlus($(this),plusUrl,plusName);
        H_COMMON.setHush("l",H_COMMON.getHushJson());
        dialog.find(".plus-url-input").val("");
        dialog.find(".plus-name-input").val("");
        dialog.hide(500);
    });
    //------------------------------------------------------------
    //レイヤー追加の編集ボタンを押した時
    $("body").on("click",".plus-edit-btn",function() {
        console.log(9999999)
        var mapObj = funcMaps($(this));
        var mapName = mapObj["name"];
        var dialog = $(this).parents(".dialog-base");
        var dialogPlusName = dialog.data("plusname");
        var inputPlusUrl = dialog.find(".plus-url-input").val();
        var inputPlusName = dialog.find(".plus-name-input").val();

        var layers = eval(mapName).getLayers().getArray();
        for(var i = 0; i <layers.length; i++){
            if(layers[i].getProperties()["plusName"]) {
                var layerPlusName = layers[i].getProperties()["plusName"];
                if(layerPlusName===dialogPlusName){
                    console.log(layers[i]);
                    layers[i]["D"]["plusName"] = inputPlusName;
                    layers[i]["D"]["plusUrl"] = inputPlusUrl;
                    //$("#" + mapName).find()
                    H_COMMON.setHush("l",H_COMMON.getHushJson());
                    alert("変更を反映するには再起動してください。");
                    break;
                }
            }
        }
    });
    //------------------------------------------------------------
    //レイヤー追加の削除ボタンを押した時
    $("body").on("click",".plus-delete-btn",function() {
        console.log("削除");
        var mapObj = funcMaps($(this));
        var mapName = mapObj["name"];
        var dialog = $(this).parents(".dialog-base");
        var dialogPlusName = dialog.data("plusname");
        var layers = eval(mapName).getLayers().getArray();
        for(var i = 0; i <layers.length; i++){
            if(layers[i].getProperties()["plusName"]) {
                var layerPlusName = layers[i].getProperties()["plusName"];
                if(layerPlusName===dialogPlusName){
                    console.log(layers[i]);
                    layers.splice(i,1);
                    //$("#" + mapName).find()
                    H_COMMON.setHush("l",H_COMMON.getHushJson());
                    alert("変更を反映するには再起動してください。");
                    break;
                }
            }
        }
    });
    //------------------------------------------------------------
    //
    $("body").on("click",".crop-btn",function() {
        alert("実験中！");
        //var mapObj = funcMaps($(this));
        //var mapName = mapObj["name"];
        var layer = $(this).parents("table").data("layername");
        console.log(layer);
        console.log(eval(layer).getFilters());
        eval(layer).removeFilter(eval(layer).getFilters()[0]);
        eval(layer).removeFilter(eval(layer).getFilters()[0]);
        console.log(eval(layer).getFilters());

    });
});
