$(function() {
    $("#drawContextmenu-help-btn").click(function(){
        var help = "";
        help += "<h4>使い方の基本<span style='font-size: small'>(とにかく右クリック！！)</span></h4>";
        help += "<hr class='my-hr'>";
        help += "<ul>";
        help += "<li>何もないところを右クリックで各種機能を呼び出します。<br><span style='color: red'>右クリックが操作の起点になります。</span></li>";
        help += "<li>出来上がった点、面、線の上で<span style='color: red'>右クリック</span>すると色や形、属性を変更できます。</li>";
        help += "<li>描画中に<span style='color: red'>右クリック</span>でキャンセルできます。</li>";
        help += "<li>描画中に<span style='color: red'>ctrl+z</span>で頂点を一つずつ戻せます。</li>";
        help += "<li>「操作」をクリックして<span style='color: red'>削除</span>機能等を呼び出します。</li>";
        help += "<li>「ファイル」をクリックしてデータ読込や保存を行います。</li>";
        help += "<li>「効果」をクリックすると各種効果を付与します。</li>";
        help += "<li>「計測」をクリックすると面積、長さを計算表示します。</li>";
        help += "<li>「属性」をクリックすると属性を記入できます。</li>";
        help += "</ul>";
        mydialog({
            id:"draw-help-dialog",
            class:"draw-help-dialog",
            map:"map1",
            title:"図形機能ーヘルプ<span style='font-size:x-small;'></span>",
            content:help,
            top:"60px",
            left:"10px",
            width:"360px"
            //info:true
            //rmDialog:true
        });
    });
});