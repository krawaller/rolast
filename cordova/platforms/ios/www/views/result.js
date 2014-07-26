rolapp.addView("ResultView",{
	events: {"click .calcmultipart": "clickedCalcPart"},
	render: function(){
		this.$el.html(rolast.printFlatCalcResult(this.initdata));
		return this;
	},
	clickedCalcPart: function(e){
		console.log(this.initdata);
		var el = $(e.currentTarget),
			index = parseInt(el.attr("data-index")),
			part = this.initdata.used[index],
			view = new rolapp.ResultView(part);
		this.stackView(view.render());
	}
});