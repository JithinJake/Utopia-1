jQuery(document).ready(function($){
	
	$('#attachCart').click(function(){
		var names =localStorage.getItem("pagex");
		var res=$(names).text().split("Delete");
		res.splice(res.length-1);
	if($('#message').text()===null){
		$('#message').text("Hi I would like to visit these places \n"+res);
		
	}
		else{$('#message').text("");
			$('#message').text("Hi I would like to visit these places \n"+res); 
		}
	});
	
	$(document).on("scroll",function(e){
		
		//$(".navbar").css('opacity',($(document).scrollTop()/500));
		var alphavalue=$(document).scrollTop()/500;
		$(".navbar").css('background-color','rgba(255,255,255,'+alphavalue+')');
	});

				
});
 