(function() {
    console.log("s")
    //------------------------------------------------------------------------------------------------------------------
    //スタイルファンクション-----------------------------------------------------------------------------------------------
    //基本のスタイルファンクションはここに書く。ドロー専用は別の場所に
    //ポイント用のスタイル------------------------------------------------------------------------------------------------
    function pointStyle(feature) {
        var prop = feature.getProperties();
        var fillColor = prop["_fillColor"];
        if(!fillColor) fillColor = "rgba(0,122,255,0.7)";
        var icon = prop["_icon"];
        var text = prop["ラベル"];
        var style = [];
        if (icon) {
            //if(!selected) {
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
            /*
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
        */
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
    function lineStringStyle(feature) {
        var prop = feature.getProperties();
        var fillColor = prop["_fillColor"];
        if (!fillColor) fillColor = "rgba(0,122,255,0.7)";
        var strokeColor = prop["_color"];
        var strokeWidth = prop["_weight"];
        var tDistance;
        //tDistance = funcTDistance(feature);
        tDistance = measure("distance",feature);
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
    function polygonStyle(feature) {
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
                /*
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
                */
                break;
            default://通常のポリゴンはこっち
                if(geoType==="Polygon" || geoType==="MultiPolygon") {
                    tArea = measure("area",feature);
                    tDistance = measure("distance",feature);
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
    //function drawStyleFunction() {
    zzz = function() {
        return function(feature) {
            var geoType = feature.getGeometry().getType();
            //--------------------------------------------------------------------
            switch (geoType) {
                //線（ライン）
                case "LineString":
                    var style = lineStringStyle(feature);
                    break;
                //-----------------------------------------------------------------
                //点（ポイント）
                case "Point":
                    var style = pointStyle(feature);
                    break;
                //-----------------------------------------------------------------
                //面と円（ポリゴンとマルチポリゴン）
                case "Polygon":
                case "MultiPolygon":
                    var style = polygonStyle(feature);
                    break;
                default:
            }
            return style;
        }
    }
})();