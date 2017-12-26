// JavaScript Document 
$(document).ready(function() {
	
  /*
   * submit change language form when selection change
   */   
  $("#languageSelector").change(function(event){
    event.preventDefault();    
    $(this).find("form").submit();
  });
  
  
	
	languageActive();

	$(".language_selector").click(function(){
		$('.languages').show(200);
		$(".language_selector").css({'background':'#ffffff'});
		$("#image_lang").addClass('image_language_rotate');
	});
	
	$(".language_selector").mouseleave(function(){
		$('.languages').hide(200);
		$(".language_selector").css({'background':'none'});
		$("#image_lang").removeClass('image_language_rotate');
	});
	

	
	$(".languages li").click(function(){
		$(".languages li").each(function(index) {
			$(this).removeClass('active');
		});
		$(this).addClass('active');
		languageActive();
		
		/*$(".languages").hide(200);*/
		listLanguage();
		
  	});
	
  
  function languageActive(){
	  $(".languages li").each(function(index) {
        if($(this).hasClass('active')){
			$(".language_select").text($(this).text());
		}
      });
  }
  
  
  
  /*
	var cont = 0;  
  $("#image_lang").click(function(){
		$(".languages").toggle(200);
		listLanguage();
	});
	
	$(".language_select").click(function(){
		$(".languages").toggle(200);
		listLanguage();
	});
  
 function listLanguage(){
	  cont++;
  	if (cont % 2 == 0){
		$(".language_selector").css({'background':'none'});
		$("#image_lang").removeClass('image_language_rotate');
		
	}else{
		$(".language_selector").css({'background':'#ffffff'});
		$("#image_lang").addClass('image_language_rotate');
  	}
  }
	*/
});