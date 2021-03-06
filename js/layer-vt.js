if (typeof H_VT === 'undefined') {
    var H_VT = {};
}
(function () {
    var codeList_sizen = new Array(//図式コード,"色"]
        [10101,"#d9cbae"],
        [1010101,"#d9cbae"],
        [11201,"#d9cbae"],
        [11202,"#d9cbae"],
        [11203,"#d9cbae"],
        [11204,"#d9cbae"],
        [10202,"#9466ab"],
        [10204,"#9466ab"],
        [2010201,"#9466ab"],
        [10205,"#cc99ff"],
        [10206,"#cc99ff"],
        [10301,"#ffaa00"],
        [10302,"#ffaa00"],
        [10303,"#ffaa00"],
        [10304,"#ffaa00"],
        [10308,"#ffaa00"],
        [10314,"#ffaa00"],
        [10305,"#ffaa00"],
        [10508,"#ffaa00"],
        [2010101,"#ffaa00"],
        [10306,"#ffaa00"],
        [10307,"#ffaa00"],
        [10310,"#ffaa00"],
        [10312,"#ffaa00"],
        [10401,"#99804d"],
        [10402,"#99804d"],
        [10403,"#99804d"],
        [10404,"#99804d"],
        [10406,"#99804d"],
        [10407,"#99804d"],
        [3010101,"#99804d"],
        [10501,"#cacc60"],
        [10502,"#cacc60"],
        [3020101,"#cacc60"],
        [10503,"#ffff33"],
        [3040101,"#ffff33"],
        [10506,"#fbe09d"],
        [10507,"#fbe09d"],
        [10801,"#fbe09d"],
        [10504,"#ffff99"],
        [10505,"#ffff99"],
        [10512,"#ffff99"],
        [3050101,"#ffff99"],
        [10601,"#a3cc7e"],
        [2010301,"#a3cc7e"],
        [10701,"#bbff99"],
        [3030101,"#bbff99"],
        [10702,"#bbff99"],
        [10705,"#bbff99"],
        [10703,"#00d1a4"],
        [10804,"#00d1a4"],
        [3030201,"#00d1a4"],
        [10704,"#6699ff"],
        [3040201,"#6699ff"],
        [3040202,"#6699ff"],
        [3040301,"#1f9999"],
        [10802,"#9f9fc4"],
        [10803,"#9f9fc4"],
        [10807,"#9f9fc4"],
        [10808,"#9f9fc4"],
        [10805,"#e5ffff"],
        [10806,"#e5ffff"],
        [10901,"#e5ffff"],
        [10903,"#e5ffff"],
        [5010201,"#e5ffff"],
        [10904,"#779999"],
        [5010301,"#779999"],
        [11001,"#85c4d1"],
        [11003,"#85c4d1"],
        [11009,"#85c4d1"],
        [11011,"#85c4d1"],
        [4010301,"#85c4d1"],
        [11002,"#8ad8b6"],
        [11004,"#ef8888"],
        [11006,"#ef8888"],
        [11007,"#ef8888"],
        [11014,"#ef8888"],
        [4010201,"#ff4f4f"],
        [11005,"#ff4f4f"],
        [11008,"#c37aff"],
        [4010101,"#c37aff"],
        [11010,"#ffe8e8"],
        [999999,"#144dfa"],
        [101,"#e6e600"],
        [102,"#00e2e6"],
        [103,"#2ae600"],
        [104,"#e60400"],
        [105,"#5e5ce6"],
        [9999,"#ff00ff"]
    );
    H_VT.codeList_sizen2 = new Array(//2次元配列 [図式コード,"地形分類名","成因など","リスク"]
        [999999,"地図を拡大すると表示されます。","",""],
        [100,"数値地図25000(土地条件)","地図を拡大すると表示されます。",""],
        [101,"数値地図25000(土地条件)","地図を拡大すると表示されます。",""],
        [102,"治水地形分類図(更新版)","地図を拡大すると表示されます。",""],
        [103,"脆弱地形調査","地図を拡大すると表示されます。",""],
        [104,"土地条件図","地図を拡大すると表示されます。",""],
        [105,"沿岸海域土地条件図","地図を拡大すると表示されます。",""],
        [10101,"山地","尾根や谷で構成される土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
        [11201,"山地","尾根や谷で構成される土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
        [11202,"山地","尾根や谷で構成される土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
        [11203,"山地","尾根や谷で構成される土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
        [11204,"山地","尾根や谷で構成される土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
        [1010101,"山地","尾根や谷で構成される土地や、比較的斜面の急な土地。山がちな古い段丘崖の斜面や火山地を含む。","大雨や地震により、崖崩れや土石流、地すべりなどの土砂災害のリスクがある。"],
        [10202,"崖･段丘崖","台地の縁にある極めて急な斜面や、山地や海岸沿いなどの岩場。","周辺では大雨や地震の揺れによる崖崩れなどの土砂災害のリスクがある。"],
        [10204,"崖･段丘崖","台地の縁にある極めて急な斜面や、山地や海岸沿いなどの岩場。","周辺では大雨や地震の揺れによる崖崩れなどの土砂災害のリスクがある。"],
        [2010201,"崖･段丘崖","台地の縁にある極めて急な斜面や、山地や海岸沿いなどの岩場。","周辺では大雨や地震の揺れによる崖崩れなどの土砂災害のリスクがある。"],
        [10205,"地すべり","斜面が下方に移動し、斜面上部の崖と不規則な凹凸のある移動部分からなる土地。山体の一部が重力により滑ってできる。","大雨・雪解けにより多量の水分が土中に含まれたり、地震で揺れたりすることで、土地が滑って土砂災害を引き起こすことがある。"],
        [10206,"地すべり","斜面が下方に移動し、斜面上部の崖と不規則な凹凸のある移動部分からなる土地。山体の一部が重力により滑ってできる。","大雨・雪解けにより多量の水分が土中に含まれたり、地震で揺れたりすることで、土地が滑って土砂災害を引き起こすことがある。"],
        [10301,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10302,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10303,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10304,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10308,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10314,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10305,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10508,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [2010101,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10306,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10307,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10310,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10312,"台地･段丘","周囲より階段状に高くなった平坦な土地。周囲が侵食により削られて取り残されてできる。","河川氾濫のリスクはほとんどないが、河川との高さが小さい場合には注意。縁辺部の斜面近くでは崖崩れに注意。地盤は良く、地震の揺れや液状化のリスクは小さい。"],
        [10401,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
        [10402,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
        [10403,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
        [10404,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
        [10406,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
        [10407,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
        [3010101,"山麓堆積地形","山地や崖･段丘崖の下方にあり、山地より斜面の緩やかな土地。崖崩れや土石流などによって土砂が堆積してできる。","大雨により土石流が発生するリスクがある。地盤は不安定で、地震による崖崩れにも注意。"],
        [10501,"扇状地","山麓の谷の出口から扇状に広がる緩やかな斜面。谷口からの氾濫によって運ばれた土砂が堆積してできる。","山地からの出水による浸水や、谷口に近い場所では土石流のリスクがある。比較的地盤は良いため、地震の際には揺れにくい。下流部では液状化のリスクがある。"],
        [10502,"扇状地","山麓の谷の出口から扇状に広がる緩やかな斜面。谷口からの氾濫によって運ばれた土砂が堆積してできる。","山地からの出水による浸水や、谷口に近い場所では土石流のリスクがある。比較的地盤は良いため、地震の際には揺れにくい。下流部では液状化のリスクがある。"],
        [3020101,"扇状地","山麓の谷の出口から扇状に広がる緩やかな斜面。谷口からの氾濫によって運ばれた土砂が堆積してできる。","山地からの出水による浸水や、谷口に近い場所では土石流のリスクがある。比較的地盤は良いため、地震の際には揺れにくい。下流部では液状化のリスクがある。"],
        [10503,"自然堤防","現在や昔の河川に沿って細長く分布し、周囲より0.5～数メートル高い土地。河川が氾濫した場所に土砂が堆積してできる。","洪水に対しては比較的安全だが、大規模な洪水では浸水することがある。縁辺部では液状化のリスクがある。"],
        [3040101,"自然堤防","現在や昔の河川に沿って細長く分布し、周囲より0.5～数メートル高い土地。河川が氾濫した場所に土砂が堆積してできる。","洪水に対しては比較的安全だが、大規模な洪水では浸水することがある。縁辺部では液状化のリスクがある。"],
        [10506,"天井川","周囲の土地より河床が高い河川。人工的な河川堤防が築かれることで、固定された河床に土砂が堆積してできる。","ひとたび天井川の堤防が決壊すれば、氾濫流が周辺に一気に拡がるため注意が必要。"],
        [10507,"天井川","周囲の土地より河床が高い河川。人工的な河川堤防が築かれることで、固定された河床に土砂が堆積してできる。","ひとたび天井川の堤防が決壊すれば、氾濫流が周辺に一気に拡がるため注意が必要。"],
        [10801,"天井川","周囲の土地より河床が高い河川。人工的な河川堤防が築かれることで、固定された河床に土砂が堆積してできる。","ひとたび天井川の堤防が決壊すれば、氾濫流が周辺に一気に拡がるため注意が必要。"],
        [10504,"砂州・砂丘","主に現在や昔の海岸･湖岸･河岸沿いにあり、周囲よりわずかに高い土地。波によって打ち上げられた砂や礫、風によって運ばれた砂が堆積することでできる。","通常の洪水では浸水を免れることが多い。縁辺部では強い地震によって液状化しやすい。"],
        [10505,"砂州・砂丘","主に現在や昔の海岸･湖岸･河岸沿いにあり、周囲よりわずかに高い土地。波によって打ち上げられた砂や礫、風によって運ばれた砂が堆積することでできる。","通常の洪水では浸水を免れることが多い。縁辺部では強い地震によって液状化しやすい。"],
        [10512,"砂州・砂丘","主に現在や昔の海岸･湖岸･河岸沿いにあり、周囲よりわずかに高い土地。波によって打ち上げられた砂や礫、風によって運ばれた砂が堆積することでできる。","通常の洪水では浸水を免れることが多い。縁辺部では強い地震によって液状化しやすい。"],
        [3050101,"砂州・砂丘","主に現在や昔の海岸･湖岸･河岸沿いにあり、周囲よりわずかに高い土地。波によって打ち上げられた砂や礫、風によって運ばれた砂が堆積することでできる。","通常の洪水では浸水を免れることが多い。縁辺部では強い地震によって液状化しやすい。"],
        [10601,"凹地・浅い谷","台地や扇状地、砂丘などの中にあり、周辺と比べてわずかに低い土地。小規模な流水や地下水の働きによってできる。","大雨の際に一時的に雨水が集まりやすく、浸水のおそれがある。地盤は周囲（台地･段丘など）に比べるとわずかに劣る場合がある。"],
        [2010301,"凹地・浅い谷","台地や扇状地、砂丘などの中にあり、周辺と比べてわずかに低い土地。小規模な流水や地下水の働きによってできる。","大雨の際に一時的に雨水が集まりやすく、浸水のおそれがある。地盤は周囲（台地･段丘など）に比べるとわずかに劣る場合がある。"],
        [3030101,"氾濫平野","起伏が小さく、低くて平坦な土地。洪水で運ばれた砂や泥などが河川周辺に堆積したり、過去の海底が干上がったりしてできる。","河川の氾濫に注意。地盤は海岸に近いほど軟弱で、地震の際にやや揺れやすい。液状化のリスクがある。沿岸部では高潮に注意。"],
        [10701,"氾濫平野","起伏が小さく、低くて平坦な土地。洪水で運ばれた砂や泥などが河川周辺に堆積したり、過去の海底が干上がったりしてできる。","河川の氾濫に注意。地盤は海岸に近いほど軟弱で、地震の際にやや揺れやすい。液状化のリスクがある。沿岸部では高潮に注意。"],
        [10702,"氾濫平野","起伏が小さく、低くて平坦な土地。洪水で運ばれた砂や泥などが河川周辺に堆積したり、過去の海底が干上がったりしてできる。","河川の氾濫に注意。地盤は海岸に近いほど軟弱で、地震の際にやや揺れやすい。液状化のリスクがある。沿岸部では高潮に注意。"],
        [10705,"氾濫平野","起伏が小さく、低くて平坦な土地。洪水で運ばれた砂や泥などが河川周辺に堆積したり、過去の海底が干上がったりしてできる。","河川の氾濫に注意。地盤は海岸に近いほど軟弱で、地震の際にやや揺れやすい。液状化のリスクがある。沿岸部では高潮に注意。"],
        [10703,"後背低地･湿地","主に氾濫平野の中にあり、周囲よりわずかに低い土地。洪水による砂や礫の堆積がほとんどなく、氾濫水に含まれる泥が堆積してできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が極めて軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。沿岸部では高潮に注意。"],
        [10804,"後背低地･湿地","主に氾濫平野の中にあり、周囲よりわずかに低い土地。洪水による砂や礫の堆積がほとんどなく、氾濫水に含まれる泥が堆積してできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が極めて軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。沿岸部では高潮に注意。"],
        [3030201,"後背低地･湿地","主に氾濫平野の中にあり、周囲よりわずかに低い土地。洪水による砂や礫の堆積がほとんどなく、氾濫水に含まれる泥が堆積してできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が極めて軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。沿岸部では高潮に注意。"],
        [10704,"旧河道","かつて河川の流路だった場所で、周囲よりもわずかに低い土地。流路の移動によって河川から切り離されて、その後に砂や泥などで埋められてできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。"],
        [3040201,"旧河道","かつて河川の流路だった場所で、周囲よりもわずかに低い土地。流路の移動によって河川から切り離されて、その後に砂や泥などで埋められてできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。"],
        [3040202,"旧河道","かつて河川の流路だった場所で、周囲よりもわずかに低い土地。流路の移動によって河川から切り離されて、その後に砂や泥などで埋められてできる。","河川の氾濫によって周囲よりも長期間浸水し、水はけが悪い。地盤が軟弱で、地震の際は揺れが大きくなりやすい。液状化のリスクが大きい。"],
        [3040301,"落堀","河川堤防沿いにある凹地状の土地。洪水のときに、堤防を越えた水によって地面が侵食されてできる。","河川の氾濫や堤防からの越水に注意。周囲の地盤に比べて軟弱なことが多い。液状化のリスクが大きい。"],
        [10802,"河川敷･浜","現在(調査時)の河川敷や浜辺。","河川の増水や高波で冠水する。河川敷は液状化のリスクが大きい。"],
        [10803,"河川敷･浜","現在(調査時)の河川敷や浜辺。","河川の増水や高波で冠水する。河川敷は液状化のリスクが大きい。"],
        [10807,"河川敷･浜","現在(調査時)の河川敷や浜辺。","河川の増水や高波で冠水する。河川敷は液状化のリスクが大きい。"],
        [10808,"河川敷･浜","現在(調査時)の河川敷や浜辺。","河川の増水や高波で冠水する。河川敷は液状化のリスクが大きい。"],
        [10805,"水部","現在(調査時)において、海や湖沼、河川などの水面である場所。",""],
        [10806,"水部","現在(調査時)において、海や湖沼、河川などの水面である場所。",""],
        [10901,"水部","現在(調査時)において、海や湖沼、河川などの水面である場所。",""],
        [10903,"水部","現在(調査時)において、海や湖沼、河川などの水面である場所。",""],
        [5010201,"水部","現在(調査時)において、海や湖沼、河川などの水面である場所。",""],
        [10904,"旧水部","江戸時代もしくは明治期から現在までの間に海や湖、池･貯水池であり、過去の地形図などから水部であったと確認できる土地。その後の土砂の堆積や土木工事により陸地になったところ。","地盤が軟弱である。液状化のリスクが大きい。沿岸部では高潮や津波に注意。"],
        [5010301,"旧水部","江戸時代もしくは明治期から現在までの間に海や湖、池･貯水池であり、過去の地形図などから水部であったと確認できる土地。その後の土砂の堆積や土木工事により陸地になったところ。","地盤が軟弱である。液状化のリスクが大きい。沿岸部では高潮や津波に注意。"],
        [11001,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
        [11003,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
        [11009,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
        [11011,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
        [4010301,"切土地","山地、台地の縁などの斜面を切取りにより造成した土地。","切取り斜面によっては、大雨や地震により斜面崩壊のリスクがある。地盤は一般的に良好。"],
        [11002,"農耕平坦化地","山地などを切り開いて整地した農耕地。","大雨や地震により崩壊するリスクがある。"],
        [11005,"高い盛土地","周辺よりも約2m以上盛土した造成地。主に海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","海や湖沼、河川を埋め立てた場所では、強い地震の際に液状化のリスクがある。山間部の谷を埋め立てた造成地では、大雨や地震により地盤崩壊のリスクがある。"],
        [4010201,"高い盛土地","周辺よりも約2m以上盛土した造成地。主に海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","海や湖沼、河川を埋め立てた場所では、強い地震の際に液状化のリスクがある。山間部の谷を埋め立てた造成地では、大雨や地震により地盤崩壊のリスクがある。"],
        [11008,"干拓地","水面や低湿地を堤防で締め切って排水して、新たな陸地になった土地。過去の地形図や資料から、干拓されたことが確認できる場所。","一般に海･湖水面より低いため、洪水時に氾濫水が留まりやすい。沿岸部では特に高潮に対して注意が必要。地盤は軟弱で、地震による揺れも大きくなりやすい。液状化のリスクがある。"],
        [4010101,"干拓地","水面や低湿地を堤防で締め切って排水して、新たな陸地になった土地。過去の地形図や資料から、干拓されたことが確認できる場所。","一般に海･湖水面より低いため、洪水時に氾濫水が留まりやすい。沿岸部では特に高潮に対して注意が必要。地盤は軟弱で、地震による揺れも大きくなりやすい。液状化のリスクがある。"],
        [11004,"盛土地･埋立地","周囲の地表より高く盛土した土地や、海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","高さが十分でない場合には浸水のリスクがある。山地や台地では降雨･地震により地盤崩壊のリスクがある。低地では液状化のリスクがあり、海や湖沼･河川を埋め立てた場所では特に注意。"],
        [11006,"盛土地･埋立地","周囲の地表より高く盛土した土地や、海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","高さが十分でない場合には浸水のリスクがある。山地や台地では降雨･地震により地盤崩壊のリスクがある。低地では液状化のリスクがあり、海や湖沼･河川を埋め立てた場所では特に注意。"],
        [11007,"盛土地･埋立地","周囲の地表より高く盛土した土地や、海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","高さが十分でない場合には浸水のリスクがある。山地や台地では降雨･地震により地盤崩壊のリスクがある。低地では液状化のリスクがあり、海や湖沼･河川を埋め立てた場所では特に注意。"],
        [11014,"盛土地･埋立地","周囲の地表より高く盛土した土地や、海水面などの水部に土砂を投入して陸地にしたり、谷のような凹地を埋め立てて造成した土地。","高さが十分でない場合には浸水のリスクがある。山地や台地では降雨･地震により地盤崩壊のリスクがある。低地では液状化のリスクがあり、海や湖沼･河川を埋め立てた場所では特に注意。"],
        [11010,"改変工事中","調査時に土地の改変工事が行われていた土地。",""],
        [9999,"拡大すると地形分類が表示されます。","",""]
    );
    function tikeiVectorTileSizen(){
        this.icon = "<i class='fa fa-map-o fa-fw' style='color:dimgrey;'></i>";
        this.title = "地理院_地形分類（自然地形）(VT)";
        this.name = "sizentikei";
        this.origin = "<a href='https://github.com/gsi-cyberjapan/experimental_landformclassification' target='_blank'>国土地理院ベクトルタイル提供実験（地形分類）</a>";
        this.detail = "";
        this.source = new ol.source.VectorTile({
            //attributions: [new ol.Attribution({html:"<a href='https://github.com/gsi-cyberjapan/vector-tile-experiment' target='_blank'>国土地理院</a>"})],
            format: new ol.format.GeoJSON({defaultProjection:'EPSG:4326'}),
            tileGrid: new ol.tilegrid.createXYZ({
                maxZoom:14
            }),
            url:"https://cyberjapandata.gsi.go.jp/xyz/experimental_landformclassification1/{z}/{x}/{y}.geojson"
        });
        this.style = sizentikeiStyleFunction;
    }
    H_VT.tikeiVectorTileSizen1 = new ol.layer.VectorTile(new tikeiVectorTileSizen());
    H_VT.tikeiVectorTileSizen2 = new ol.layer.VectorTile(new tikeiVectorTileSizen());
    function sizentikeiStyleFunction(feature, resolution) {
        var code = Number(feature.getProperties()["code"]);
        var fillColor = 'rgba(0,0,0,0.1)';
        for(var i=0;i<codeList_sizen.length;i++){
            if(codeList_sizen[i][0]==code){
                fillColor = codeList_sizen[i][1];
                break;
            }
        }
        return [new ol.style.Style({
            fill: new ol.style.Fill({
                color:fillColor
            })
        })];
    }

}());