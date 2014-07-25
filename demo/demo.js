
// TABELLSLAGTEST
$("#weightform").submit(function(e){
	e.preventDefault();
	var form = _.reduce($(this).serializeArray(),function(memo,val,key){ memo[val.name] = val.value; return memo;},{}),
		data = {
			road:+form.road,
			hasEngine: form.type != "trailer",
			totalAxleDistance:+form.distance.replace(/\,/,".")
		},
		list = rolast.lists.weightLimits,
		result = rolast.lookUpInList(list,data);
	$("#weightresult").html(rolast.describeWeightLimit({
		result: result[1],
		filter: result[0]
	},data));
});

// AXELBEGRÄNSNINGSTEST
$("#axleform").submit(function(e){
	e.preventDefault();
	var form = _.reduce($(this).serializeArray(),function(memo,val,key){ memo[val.name] = val.value; return memo;},{}),
		data = {
			road:+form.road,
			axles:+form.type,
			axleWidth:+form.distance.replace(/\,/,"."),
			hasGoodSuspension: !!form.susp,
			isPropulsionAxle: !!form.prop
		},
		list = rolast.lists.axleLimits,
		result = rolast.lookUpInList(list,data);
	$("#axleresult").html(rolast.describeAxleLimit({
		result: result[1],
		filter: result[0]
	},data));
});

// GENERELLBEGRÄNSNINGSTEST
var hiddenval = 0;
$("#axletype").change(function(e){
	var val = $(this).val();
	if (val > 1){
		$("#axledistance").val(hiddenval).show();
	} else {
		hiddenval = $("#axledistance").val();
		$("#axledistance").val(0).hide();
	}
});
$("#generalform").submit(function(e){
	e.preventDefault();
	var form = _.reduce($(this).serializeArray(),function(memo,val,key){ memo[val.name] = val.value; return memo;},{}),
		data = {
			road:+form.road,
			numberOfAxles:+form.numaxles,
			totalAxleDistance:+form.distance.replace(/\,/,"."),
			hasGoodSuspension: !!form.susp,
			hasEngine: form.type != "trailer",
			isJointBus: form.type === "jointbus"
		},
		list = rolast.lists.generalLimits,
		result = rolast.lookUpInList(list,data);
	$("#generalresult").html(rolast.describeGeneralLimit({
		result: result[1],
		filter: result[0]
	},data));
});

// GRUPPERINGSTEST
var distances = [];
$("#axlegroupresult").html(rolast.drawAxle({axles:1}));
$("#axlegroupform").submit(function(e){
	e.preventDefault();
	var form = _.reduce($(this).serializeArray(),function(memo,val,key){ memo[val.name] = val.value; return memo;},{});
	distances.push(+form.axledist);
	var arr = rolast.findAxleGroupArray(distances);
	$("#axlegroupresult").html( _.reduce(arr,function(str,axle){return str+rolast.drawAxle(axle);},"") );
});
$("#axlegroupform").on("reset",function(e){
	$("#axlegroupresult").html(rolast.drawAxle({axles:1}));
	distances = [];
});

// TOTALTEST
var fillform = function(obj){
	var form = $("#totalform");
	_.each(obj,function(val,name){
		var input = form.find("[name='"+name+"']");
		if (input.is("[type='checkbox']")){
			input.prop("checked",!!val);
		} else {
			input.val(val);
		}
	});
};
var examples = {
	lastbilsteori1: {
		distances: "5.7",
		maxweights: "7.5 15.5",
		serviceweight: 10.4,
		maxweight: 23,
		susp: true,
		type: "engine"
	},
	lastbilsteori2: {
		distances: "4.8 1.38",
		maxweights: "9 18",
		serviceweight: 10.8,
		maxweight: 26,
		susp: true,
		type: "engine"
	},
	tyapowerpoint: {
		distances: "4.7 1.35",
		maxweights: "8 19",
		serviceweight: 13.23,
		maxweight: 26,
		susp: true,
		type: "engine"
	},
	kbj016: {
		distances: "4.6 1.32",
		maxweights: "8 20",
		serviceweight: 11.89,
		maxweight: 25,
		susp: false,
		type: "engine"
	},
	dxl116: {
		distances: "0.72",
		maxweights: "2",
		serviceweight: 0.525,
		maxweight: 2,
		susp: false,
		type: "trailer"
	},
	bwg831: {
		distances: "4.035",
		maxweights: "0 0",
		serviceweight: 2.99,
		maxweight: 3.49,
		susp: false,
		type: "engine"
	}
};
$(".totalexamples button").click(function(e){
	fillform(examples[$(this).attr('data-example')]);
	e.preventDefault();
	$(e.target).blur();
});
$("body").on("click",".calczoomer",function(e){
	e.preventDefault();
	$(e.target).text($(e.target).text()==="visa"?"dölj":"visa").closest(".calcprint").toggleClass("zoomed");
});
$("#totalform").on("reset",function(e){
	$("#totalresult").empty();
	$("#totalaxleresult").empty();
});
$("#totalform").submit(function(e){
	e.preventDefault();
	var form = _.reduce($(this).serializeArray(),function(memo,val,key){ memo[val.name] = val.value; return memo;},{}),
		data = {
			axleDistances: _.map(_.compact(form.distances.replace(",",".").split(" ")),function(d){ return parseFloat(d,10); }),
			axleWeightLimits: _.map(_.compact(form.maxweights.replace(",",".").split(" ")),function(d){ return parseFloat(d,10); }),
			road: +form.road,
			serviceWeight: +form.serviceweight,
			maxWeight: +form.maxweight,
			hasEngine: form.type != "trailer",
			isJointBus: form.type === "jointbus",
			hasGoodSuspension: !!form.susp,
		},
		pdata = rolast.processVehicle(data);
	if (pdata.axleWeightLimits.length > 0 && pdata.groupedAxles.length != pdata.axleWeightLimits.length){
		$("#totalresult").html("Efter gruppering har vi "+pdata.groupedAxles.length+" axlar, men maxgränserna innehöll "+pdata.axleWeightLimits.length+" värden! De måste vara samma antal!");
	} else {
		var result = rolast.calculate( rolast.calculations.maxVehicleLoad, pdata );
		$("#totalresult").html(rolast.printCalcResult(result,pdata));
		$("#totalaxleresult").html( _.reduce(pdata.groupedAxles,function(str,axle){return str+rolast.drawAxle(axle);},"") );
	}
});

// TRAIN TEST

var truck = rolast.processVehicle({road:1,hasEngine:true,serviceWeight: 10.8, maxWeight: 26, couplingDistance: 3.2,axleDistances:[4.8,1.38],axleWeightLimits:[9,18]}),
	trailer = rolast.processVehicle({road:1,hasEngine:false,serviceWeight: 6, maxWeight: 70, couplingDistance: 7, axleDistances:[0.72,8,2,2],axleWeightLimits:[13,22]}),
	train = rolast.buildTrain(truck,trailer),
	result = rolast.calculate(rolast.calculations.maxTrainLoad, _.extend({road:1},train));

$("#trainresult").html(rolast.printCalcResult(result,train));
$("#trainaxleresult").html( _.reduce(train.groupedAxles,function(str,axle){return str+rolast.drawAxle(axle);},"") );

// ALL TEST

var truck = rolast.processVehicle({road:1,hasEngine:true,serviceWeight: 10.8, maxWeight: 26, couplingDistance: 3.2,axleDistances:[4.8,1.38],axleWeightLimits:[9,18]}),
	result = rolast.calculate(rolast.calculations.maxVehicleLoadForAllRoads, truck );

$("#allresult").html(rolast.printCalcResult(result,truck));
