rolapp = {
	vehicles: _.mapValues({
		lastbilsteori1: {
			axleDistances: [5.7],
			axleWeightLimits: [7.5, 15.5],
			serviceWeight: 10.4,
			maxWeight: 23,
			hasGoodSuspension: true,
			type: "lastbil",
			hasEngine: true
		},
		lastbilsteori2: {
			axleDistances: [4.8, 1.38],
			axleWeightLimits: [9, 18],
			serviceWeight: 10.8,
			maxWeight: 26,
			hasGoodSuspension: true,
			type: "lastbil",
			hasEngine: true,
			couplingDistance: 1.3
		},
		tyapowerpoint: {
			axleDistances: [4.7, 1.35],
			axleWeightLimits: [8, 19],
			serviceWeight: 13.23,
			maxWeight: 26,
			hasGoodSuspension: true,
			type: "lastbil",
			hasEngine: true,
			couplingDistance: 2.1
		},
		kbj016: {
			axleDistances: [4.6, 1.32],
			axleWeightLimits: [8, 20],
			serviceWeight: 11.89,
			maxWeight: 25,
			type: "lastbil",
			hasEngine: true
		},
		dxl116: {
			axleDistances: [0.72],
			axleWeightLimits: [2],
			serviceWeight: 0.525,
			maxWeight: 2,
			type: "trailer",
			hasEngine: false,
			couplingDistance: 4
		},
		bwg831: {
			axleDistances: [4.035],
			axleWeightLimits: [5],
			serviceWeight: 2.99,
			maxWeight: 3.49,
			type: "personbil",
			hasEngine: true
		},
		davidtrailer: {
			axleDistances: [0.6,8,0.6],
			axleWeightLimits: [14,17],
			serviceWeight: 6,
			maxWeight: 38,
			type: "trailer",
			hasEngine: false,
			couplingDistance: 4.3
		}
	},function(v,id){return _.extend({vehicleid:id},rolast.processVehicle(v));}),
	getVehicles: function(){ return rolapp.vehicles; },
	getVehicle: function(id){ return rolapp.vehicles[id]; },
	addView: function(id,def,sub){
		var lowcase = id.toLowerCase(),
			template = $("#"+lowcase+"template").html();
		if (!template){
			console.log("Warning, no template found for "+id+" (looked for #"+lowcase+"template)");
		}
		rolapp[id] = rolapp.BaseView.extend(_.extend({
			className: lowcase+(sub?"":" view"),
			ui: {},
			views: [],
			template: template
		},def));
	},
	addSubView: function(id,def){
		rolapp.addView(id,def,true);
	},
	launch: function(){
		$("#templates").empty();
		var main = new rolapp.MainView();
		main.render();
		main.$el.prependTo($("body"));
	}
};