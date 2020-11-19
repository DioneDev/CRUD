(function readyJS(win,doc){
	if(document.querySelectorAll('.deletar')){
		for(let i=0; i<doc.querySelectorAll('.deletar').length; i++){
			doc.querySelectorAll('.deletar')[i].addEventListener('click', function(){
				if(confirm("Dejesa mesmo apagar este dado?")){
					return true;
				}else{
					event.preventDefault();
				};
			});
		}
	}
})(window,document);