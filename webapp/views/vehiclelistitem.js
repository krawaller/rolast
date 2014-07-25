rolapp.addSubView("VehicleListItemView",{
	setup: function(){
		if (!this.initdata.trainmatches && !this.initdata.isTrain){
			this.initdata.trainmatches = rolast.findCouplingMatches(this.initdata,rolapp.getVehicles());
		}
	},
	render: function(){
		this.setUIFromTemplate("axledrawing name type");
		this.ui.axledrawing.html(rolast.drawAxleGroup(this.initdata.groupedAxles));
		this.ui.name.html(this.initdata.vehicleid);
		this.ui.type.html(this.initdata.type);
		this.$el.attr("data-vehicleid",this.initdata.vehicleid);
		return this;
	}
});