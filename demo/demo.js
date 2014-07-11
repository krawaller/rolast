
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
$("#exampleone").click(function(e){
	fillform({
		distances: "4.8 1.38",
		maxweights: "9 18",
		serviceweight: 10.8,
		maxweight: 26,
		susp: true,
		type: "engine"
	});
	e.preventDefault();
	$(e.target).blur();
});
$("body").on("click",".calczoomer",function(e){
	e.preventDefault();
	$(e.target).text($(e.target).text()==="visa"?"dölj":"visa").closest(".calcprint").toggleClass("zoomed");
});
$("#totalform").on("reset",function(e){
	$("#totalresult").empty();
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
		pdata = rolast.processData(data);
	if (pdata.groupedAxles.length != pdata.axleWeightLimits.length){
		$("#totalresult").html("Efter gruppering har vi "+pdata.groupedAxles.length+" axlar, men maxgränserna innehöll "+pdata.axleWeightLimits.length+" värden! De måste vara samma antal!");
	} else {
		var result = rolast.calculate( rolast.calculations.maxLoad, pdata );
		$("#totalresult").html(rolast.printCalcResult(result,pdata));
	}
});

/*
var data = {
	axleDistances: [5,1],
	hasEngine: true,
	road: 1,
	axleWeightLimits: [7,12],
	serviceWeight: 12,
	maxWeight: 25
};
data = rolast.processData(data);
var result = rolast.calculate( rolast.calculations.maxLoad, data );
$("#totalresult").html(rolast.printCalcResult(result,data));

*/




