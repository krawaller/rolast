$("#weightform").submit(function(e){
	e.preventDefault();
	var form = _.reduce($(this).serializeArray(),function(memo,val,key){ memo[val.name] = val.value; return memo;},{}),
		data = {
			road:+form.road,
			hasEngine: form.type != "trailer",
			totalAxleDistance:+form.distance.replace(/\,/,".")
		},
		page = ["foo",11,13,14][data.road],
		list = rolast.lists.weightLimits,
		result = rolast.lookUpInList(list,data);
	$("#weightresult").html("På BK"+data.road+"-väg så är bruttomaxvikten "+result[1]+" ton för "+rolast.describeVehicle(result[0])+". (sid "+page+" i häftet)");
});
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
		page = ["foo",7,7,8][data.axles],
		list = rolast.lists.axleLimits,
		result = rolast.lookUpInList(list,data);
	$("#axleresult").html("På BK"+data.road+"-väg får "+rolast.describeAxle(result[0])+" bära max "+result[1]+" ton. (sid "+page+" i häftet)" );
});
$("#axletype").change(function(e){
	var val = $(this).val();
	$("#axledistance")[val>1?"show":"hide"]();
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
	$("#generalresult").html("På BK"+data.road+"-väg har "+(result[1] == "---" ? "detta fordon ingen viktbegränsning" : rolast.describeVehicle(result[0])+" maxvikten "+result[1]+" ton" )+". (sid 12 i häftet)");
});

var distances = [];
$("#axlegroupresult").html(rolast.printAxle({axles:1}));
$("#axlegroupform").submit(function(e){
	e.preventDefault();
	var form = _.reduce($(this).serializeArray(),function(memo,val,key){ memo[val.name] = val.value; return memo;},{});
	distances.push(+form.axledist);
	console.log(distances);
	var arr = rolast.findAxleGroupArray(distances);
	$("#axlegroupresult").html( _.reduce(arr,function(str,axle){return str+rolast.printAxle(axle);},"") );
});
$("#axlegroupform").on("reset",function(e){
	$("#axlegroupresult").html(rolast.printAxle({axles:1}));
	distances = [];
});