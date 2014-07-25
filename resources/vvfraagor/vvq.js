$("td span[id^='ucUtdata_']").each(function(num,el){
	var $el = $(el),
		idname = $(el).prop("id").split("ucUtdata_")[1],
		old = $el.html(),
		add = " <span style='font-size:0.8em;color:red; padding-left:1em; padding-right:1em;'>("+idname+")</span>";
	$el.html(old+add);
});
