var seamlessG1 = new ol.layer.Tile({
    folder:"child",
    category:"tisitutikei",
    name:"seamlessv2",
    title:"シームレス地質図V2",
    origin:"<a href='https://gbank.gsj.jp/seamless/seamless2015/2d/' target='_blank'>日本シームレス地質図</a><br>" +
    "<a href='https://gbank.gsj.jp/geonavi/' target='_blank'>地質図Navi</a>",
    detail:"20万分の1日本シームレス地質図®は、これまで出版されてきた地質図幅の図郭における境界線の不連続を、日本全国統一の凡例を用いることによって解消した新しい地質図です。",
    icon:"<i class='fa fa-map fa-fw' style='color:darkred;'></i>",
    source: new ol.source.XYZ({
        url:"./php/proxy-png.php?url=https://gbank.gsj.jp/seamless/v2full/tiles/g/{z}/{y}/{x}.png",//ｘとｙを国土地理院流の反対にすること。
        attributions:[new ol.Attribution({html:"<a href='https://www.gsj.jp/HomePageJP.html' target='_blank'>産業技術総合研究所地質調査総合センター</a>"})],
        //crossOrigin:"anonymous",
        minZoom:5,
        maxZoom:13
    })
});
var seamlessG2 = new ol.layer.Tile({
    folder:"child",
    category:"tisitutikei",
    name:"seamlessv2",
    title:"シームレス地質図V2",
    origin:"<a href='https://gbank.gsj.jp/seamless/seamless2015/2d/' target='_blank'>日本シームレス地質図</a><br>" +
    "<a href='https://gbank.gsj.jp/geonavi/' target='_blank'>地質図Navi</a>",
    detail:"20万分の1日本シームレス地質図®は、これまで出版されてきた地質図幅の図郭における境界線の不連続を、日本全国統一の凡例を用いることによって解消した新しい地質図です。",
    icon:"<i class='fa fa-map fa-fw' style='color:darkred;'></i>",
    source: new ol.source.XYZ({
        url:"./php/proxy-png.php?url=https://gbank.gsj.jp/seamless/v2full/tiles/g/{z}/{y}/{x}.png",//ｘとｙを国土地理院流の反対にすること。
        attributions:[new ol.Attribution({html:"<a href='https://www.gsj.jp/HomePageJP.html' target='_blank'>産業技術総合研究所地質調査総合センター</a>"})],
        //crossOrigin:"anonymous",
        minZoom:5,
        maxZoom:13
    })
});
var seamlessS1 = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:"./php/proxy-png.php?url=https://gbank.gsj.jp/seamless/v2full/tiles/s/{z}/{y}/{x}.png",//ｘとｙを国土地理院流の反対にすること。
        //crossOrigin:"anonymous",
        minZoom:5,
        maxZoom:13
    })
});
var seamlessS2 = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:"./php/proxy-png.php?url=https://gbank.gsj.jp/seamless/v2full/tiles/s/{z}/{y}/{x}.png",//ｘとｙを国土地理院流の反対にすること。
        //crossOrigin:"anonymous",
        minZoom:5,
        maxZoom:13
    })
});
var seamlessLF1 = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:"./php/proxy-png.php?url=https://gbank.gsj.jp/seamless/v2full/tiles/lf/{z}/{y}/{x}.png",//ｘとｙを国土地理院流の反対にすること。
        //crossOrigin:"anonymous",
        minZoom:5,
        maxZoom:13
    })
});
var seamlessLF2 = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:"./php/proxy-png.php?url=https://gbank.gsj.jp/seamless/v2full/tiles/lf/{z}/{y}/{x}.png",//ｘとｙを国土地理院流の反対にすること。
        //crossOrigin:"anonymous",
        minZoom:5,
        maxZoom:13
    })
});
var seamlessArr1 = [seamlessG1,seamlessS1,seamlessLF1];
var seamlessArr2 = [seamlessG2,seamlessS2,seamlessLF2];
