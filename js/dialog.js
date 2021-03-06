$(function(){
	//ダイアログをクリックしたときにそのダイアログを最前面にする。
	$("body").on("click",".dialog-base",function(){
		dialogbaseMaxzindex($(this));
	});
	//--------------------------------------------------------------------------
	//ダイアログを閉じる
	$("body").on("click",".mydialog .dialog-hidden",function(){
		if($(this).data("remove")==true){
			var element = $(this).parents(".dialog-base");
            element.hide(500,function(){
            	element.remove();
			})
		}else{
			var mapWidth = $(this).parents(".maps").width();
			var dialogLeft = Number($(this).parents(".dialog-base").css("left").replace("px",""));
			if(mapWidth/2>dialogLeft) {
                $(this).parents(".dialog-base").toggle("drop");
            }else{
                $(this).parents(".dialog-base").toggle("drop",{direction:"right"});
			}
			console.log("hide!!")
		}
	});
    //--------------------------------------------------------------------------
    //ダイアログを最小化する。
    $("body").on("click",".mydialog .dialog-min",function(){
        $(this).parents(".dialog-base").find(".minmax-div").hide(500);
    });
	//--------------------------------------------------------------------------
	//ダイアログを最大化する。
    $("body").on("click",".mydialog .dialog-max",function(){
        $(this).parents(".dialog-base").find(".minmax-div").show(500);
    });
});
//------------------------------------------------------------------------------
//z-indexを最大に
function dialogbaseMaxzindex(dialog){
	var maxzindex = 0;
	$(".dialog-base").each(function(){
		if(maxzindex < $(this).zIndex()){
			maxzindex = $(this).zIndex();
		}
	});
	dialog.zIndex(maxzindex+1);
}
//------------------------------------------------------------------------------
//ダイアログ生成
function mydialog(options){
	var opts = $.extend({},options);
	var id = opts.id;
	var className = opts.class;
	var map = opts.map;
	var title = opts.title;
	var headerMenu = opts.headerMenu;
	var content = opts.content;
	var top = opts.top;
	var left = opts.left;
	var right = opts.right;
    var width = opts.width;
    var height = opts.height;
	var rmDialog = opts.rmDialog;
	var hide = opts.hide;
	var minMax = opts.minMax;
	var plus =  opts.plus;
    var download =  opts.download;
    var info = opts.info;

	if(!right){
		$(".dialog-base:visible").each(function(){
			if(left==$(this).css("left")){
				left = (Number(left.replace(/px/gi,"")) + 0) + "px";
				top = (Number(top.replace(/px/gi,"")) + 0) + "px";
			}
		});
	}else{
		$(".dialog-base:not('.haikei-dialog'):visible").each(function(){
			if(right==$(this).css("right")){
				right = (Number(right.replace(/px/gi,"")) + 40) + "px";
				top = (Number(top.replace(/px/gi,"")) + 40) + "px";
			}
		});
	}
	if($("#" + map).find("#mydialog-" + id).length!=0){
		var dialog = $("#" + map).find("#mydialog-" + id);
        var mapWidth = $("#" + map).width();
        var dialogLeft = Number(dialog.css("left").replace("px",""));
        if(mapWidth/2>dialogLeft) {
            dialog.toggle("drop");
        }else{
            dialog.toggle("drop",{direction:"right"});
        }
        dialogbaseMaxzindex(dialog);
		return;
	}
	if(className){
		var classChar = "dialog-base mydialog " + className;
	}else{
		var classChar = "dialog-base mydialog";
	}
	if(rmDialog){
		rmDialog = rmDialog;
	}else{
		rmDialog = false;
	}
	var htmlStr = "";
	htmlStr += '<div id="mydialog-' + id + '" class="' + classChar + '">';
	htmlStr += 	'<div class="dialog-header">';
    htmlStr += 		'<div class="drag-handle"></div>';
	htmlStr += 		'<p>' + title + '</p>';
	htmlStr += 		headerMenu?headerMenu:"";
	if(minMax){
        htmlStr += '<span class="dialog-min winicon"><i class="fa fa-window-minimize fa-2x"></i></span>';
        htmlStr += '<span class="dialog-max winicon"><i class="fa fa-window-maximize fa-2x"></i></span>';
    }
    if(plus){
        htmlStr += '<span class="dialog-plus winicon"><i class="fa fa-plus-square fa-2x"></i></span>';
	}
    if(download){
        htmlStr += '<span class="dialog-download winicon"><i class="fa fa-download fa-2x"></i></span>';
    }
    if(info){
        htmlStr += '<span class="dialog-info winicon"><i class="fa fa-info-circle fa-2x"></i></span>';
    }

    htmlStr += 		'<span class="dialog-hidden winicon" data-remove="' + rmDialog + '"><i class="fa fa-window-close-o fa-2x"></i></span>';
    //htmlStr += 		'<span class="dialog-hidden" data-remove="' + rmDialog + '"><i class="fa fa-times fa-2x"></i></span>';
	htmlStr += 	'</div>';
	htmlStr += 	'<div class="dialog-content">' + content + '</div>';
	htmlStr += '</div>';
	$("#" + map).append(htmlStr);
	var dialog = $("#" + map).find("#mydialog-" + id);
    dialogbaseMaxzindex(dialog);
	if(!right){
		dialog.css({
			top:top,
			left:left
		});
	}else{
		dialog.css({
			top:top,
			right:right
		});
	}
	if(width) dialog.css("width",width);
    if(height) dialog.css("height",height);

	dialog.draggable({
		handle:".drag-handle",
		stop:function(){
			$(this).css({
				"height":"",
				"width":""
			});
		}
	});
    if(hide) dialog.css("visibility","hidden");//生成はするが隠す場合

	dialog.show(function(){
		//ドラッグのハンドルの幅を調整するために。スマホ、タブレットのため。PCだけだったら必要ない。
		var winiconAr = dialog.find(".winicon");
		var winiconsWidth = 0;
        for(i=0;i<winiconAr.length;i++){
            winiconsWidth = winiconsWidth + winiconAr.eq(i).width() + 7;
        }
        //var handleWidth = dialog.find(".drag-handle").width()-dialog.find(".winicon").width()-15;
        var handleWidth = dialog.find(".drag-handle").width() - winiconsWidth - 15;
        dialog.find(".drag-handle").width(handleWidth);
        if(hide){
            dialog.css("visibility","visible");//次回の呼び出し時のために見えるようにする。
        	dialog.hide();
        }
        //dialogbaseMaxzindex(dialog);
	});
}
