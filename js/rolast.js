
processTable = function(table){
	return _.extend(table,{
		range: _.range(table.limits.length),
		revrange: _.range(table.limits.length).reverse(),
		maxdata: _.last(table.data),
		maxlimit: _.last(table.limits),
		minlimit: table.limits[1],
		midlimit: table.limits[Math.floor(table.limits.length/2)],
		mindata: table.data[0]
	});
};

window.rolast = {
	describeAxle: function(data){
		var desc = "en "+(data.isPropulsionAxle === true ? "drivande " : data.isPropulsionAxle === false ? "ickedrivande " : ""),
			kind = ["","axel ","boggie ","trippelaxel "][data.axles] || "",
			susp = (data.hasGoodSuspension === true ? "med bra fjädring " : data.hasGoodSuspension === false ? "utan bra fjädring " : ""),
			width = data.axleWidth ? (susp?" och":" med")+" bredd "+this.describeTestValue(data.axleWidth,"meter")+" " : "";
		return desc+kind+susp+width;
	},
	describeTestValue: function(testval,unit,fixed){
		var more = fixed ? "fler" : "mer",
			less = fixed ? "färre" : "mindre";
		switch(testval[0]){
			case "lessthan": return less+" än "+testval[1]+" "+unit;
			case "between": return testval[1]+" "+unit+" eller "+more+" men "+less+" än "+testval[2]+" "+unit;
			case "ormore": return testval[1]+" "+unit+" eller "+more+" ";
			default: return testval+" "+unit;
		}
	},
	describeVehicle: function(data){
		var type = data.isJointBus ? "en ledbuss" : data.hasEngine ? "ett motordrivet fordon" : data.hasEngine === false ? "ett släp" : "ett fordon",
			susp = (data.hasGoodSuspension === true ? " med bra fjädring " : data.hasGoodSuspension === false ? " utan bra fjädring " : ""),
			axles = (data.numberOfAxles ? (susp ? " och " : " med ")+this.describeTestValue(data.numberOfAxles,"axlar",true) : ""),
			dist = (data.totalAxleDistance ? (susp || axles ? " och " : " med totalt axelavstånd ")+this.describeTestValue(data.totalAxleDistance,"meter") : "");
		return type+susp+axles+dist;
	},
	describeGeneralLimit: function(calcres,data){
		return "På BK"+data.road+"-väg har "+(calcres.result == "---" ? "detta fordon ingen viktbegränsning" : this.describeVehicle(calcres.filter)+" maxvikten "+calcres.result+" ton")+". (sid 12 i häftet)";
	},
	describeWeightLimit: function(calcres,data){
		return "På BK"+data.road+"-väg så är bruttomaxvikten "+calcres.result+" ton för "+this.describeVehicle(calcres.filter)+". (sid "+["foo",11,13,14][data.road]+" i häftet)";
	},
	describeAxleLimit: function(calcres,data){
		if (!calcres.filter){
			console.log("Oh no! Describing axle limit but we got no filter!",calcres,"data:",data);
		}
		return "På BK"+data.road+"-väg får "+this.describeAxle(calcres.filter)+" bära max "+calcres.result+" ton. (sid "+["foo",7,7,8][data.axles]+" i häftet)";
	},
	printCalcResult: function(calcres,data,lvl){
		if (!lvl) { lvl = 0;}
		var str = "<span class='calcprint calc"+lvl+((lvl%2)?" calcodd":"")+"'><span class='calctitle'>"+this.descriptions[calcres.name][0]+"</span> <span class='calcresult'>"+calcres.result+"</span>";
		if (calcres.type != "read"){
			var desc = this.descriptions[calcres.name][1];
			str += "<button class='calczoomer'>visa</button>";
			str += "<span class='calcdesc'>"+(this[desc] ? this[desc](calcres, calcres.filtereddata || data) : desc)+"</span>";
			if (this["print"+calcres.type]) {
				str += "<span class='calcdetails'>"+this["print"+calcres.type](calcres,data,lvl+1)+"</span>";
			}
		}
		return str+"</span>";
	},
	printsubtract: function(calcres,data,lvl){
		return this.printCalcResult(calcres.subtractee,data,lvl)+this.printCalcResult(calcres.subtractor,data,lvl);
	},
	printsum: function(calcres,data,lvl){
		return _.reduce(calcres.terms,function(s,term){
			return s+this.printCalcResult(term,data,lvl);
		},"",this);
	},
	printmin: function(calcres,data,lvl){
		return _.reduce(calcres.mins,function(s,part){
			return s+this.printCalcResult(part,data,lvl);
		},"",this);
	},
	descriptions: {
		DIFFERENSEN: ["maximal lastvikt","Skillnaden mellan tillåten totalvikt och tjänstevikt:"],
		MINSTABEGRAENSNING: ["tillåten totalvikt","Den lägsta av de olika begränsningarna:"],
		REGMAXVIKT: ["maxvikt från registreringsbevis"],
		TABELLBRUTTOMAX: ["bruttomaxvikt","describeWeightLimit"],
		GENERELLGRAENS: ["generell begränsning","describeGeneralLimit"],
		AXELSUMMA: ["sammanlagd axelbelastning","Summan av axlarnas högsta tillåtna belastningar:"],
		MINSTAAXELBEGRAENSNING: ["maxbelastning","Den lägsta av axelns begränsningar:"],
		AXELMAX: ["axelbegränsning enligt regler","describeAxleLimit"],
		REGAXELMAX: ["axelbegränsning från registreringsbevis"],
		TJAENSTEVIKT: ["tjänstevikt från registreringsbevis"]
	},
	calculations: {
		maxLoad:
			["subtract","DIFFERENSEN",
				["min","MINSTABEGRAENSNING",
					["read","REGMAXVIKT","maxWeight"],
					["filter","TABELLBRUTTOMAX","weightLimits"],
					["filter","GENERELLGRAENS","generalLimits"],
					["sum","AXELSUMMA",
						["each","groupedAxles",
							["min","MINSTAAXELBEGRAENSNING",
								["filter","AXELMAX","axleLimits"],
								["read","REGAXELMAX","weightLimit"]
							]
						]
					]
				],
				["read","TJAENSTEVIKT","serviceWeight"]
			]
	},
	calculate: function(calc,data){
		if (calc.result) { return calc; } // already processed!
		var type = calc[0],
			name = calc[1],
			args = _.rest(calc,2),
			obj = {type:type,name:name,def:calc};
		if (args[0] && args[0][0] === "each"){
			args = this.calculateeach(data[args[0][1]],args[0][2],data);
		}
		if (!this["calculate"+type]){
			console.log("BAD CALC",calc,"data",data);
			throw "Unknown calc type: "+type;
		}
		return _.extend(obj,this["calculate"+type]((args.length === 1 ? args[0] : args), data));
	},
	calculatesubtract: function(terms,data){
		var subtractee = this.calculate(terms[0],data),
			subtractor = this.calculate(terms[1],data);
		return {
			result: (+(subtractee.result || 0)*1000 - +(subtractor.result||0)*1000)/1000,
			subtractee: subtractee,
			subtractor: subtractor
		};
	},
	calculateeach: function(arr,calc,data){
		return _.map(arr,function(el){
			return this.calculate(calc,el);
		},this);
	},
	calculateread: function(propname,data){
		return {result: data[propname]};
	},
	calculatefilter: function(filtername,data){
		var f = this.lookUpInList(this.lists[filtername],data);
		//if (filtername === "generalLimits"){ console.log("GENERAL LIMIT CALC","result",f && f[1],"catchfilter",f && f[0],"filtereddata",data); }
		return {result: f && f[1] || "---",filter:f && f[0],filtereddata:data};
	},
	calculatemin: function(calcs,data){
		var deps = _.map(calcs,function(el){ return this.calculate(el,data); },this),
			lowest = -1,
			min = _.reduce(deps,function(memo,res,n){
				if (res.result !== "---" && res.result !== undefined && res.result < memo){
					lowest = n;
					return res.result;
				} else {
					return memo;
				}
			},66666666,this);
		return {
			result: min === 66666666 ? "---" : min,
			which: lowest,
			mins: deps
		};
	},
	calculatesum: function(calcs,data){
		var deps = _.map(calcs,function(el){ return this.calculate(el,data); },this),
			sum = _.reduce(deps,function(memo,res,n){
				return (memo*1000 + (res.result === "---" ? 0 : res.result)*1000)/1000;
			},0,this);
		return {
			result: sum,
			terms: deps
		};
	},
	tables: {
		weightBK1: processTable({
			limits: [0,1,1.3,1.8,2.0,2.6,5.0,5.2,5.4,5.6,5.8,6.0,6.2,6.4,8.25,8.5,8.75,9.0,9.25,9.5,9.75,10,10.25,10.5,10.75,11.0,11.25,11.5,11.75,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18],
			data: [11.5,16,18,20,21,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60]
		}),
		weightBK2: processTable({
			limits: [0,2,2.6,4.8,5.0,5.2,5.4,5.6,5.8,6.0,6.2,6.4,6.6,6.8,7,7.2,7.4,7.6,7.8,8,8.2,8.4,8.6,8.8,9,9.2,9.4,9.6,9.8,10,10.2,10.4,10.6,10.8,11,11.2,11.4,13.4,13.6,13.8,14,14.2,14.4,14.6,14.8,15,15.2,15.4,15.6,15.8,16,16.2,16.4,16.6,16.8,17,17.2,17.4,17.6,17.8,18,18.2,18.4,18.5],
			data: [16,20,22,22.16,22.5,22.84,23.18,23.52,23.86,24.2,24.54,24.88,25.22,25.56,25.9,26.24,26.58,26.92,27.26,27.6,27.94,28.28,28.62,28.96,29.3,29.64,29.98,30.32,30.66,31,31.34,31.68,32.02,32.36,32.7,33.04,38,38.04,38.56,39.08,39.6,40.12,40.64,41.16,41.68,42.2,42.72,43.24,43.76,44.28,44.8,45.32,45.84,46.36,46.88,47.4,47.92,48.44,48.96,49.48,50,50.52,51.04,51.4]
		}),
		weightBK3: processTable({
			limits: [0,2,2.4,2.8,3.2,3.6,4,4.4,4.8,5.2,5.6,6,6.4,6.8,7.2,7.6,8,8.4,8.8,9.2,9.6,10,10.4,10.8,11.2,11.6,12,12.4,12.8,13.2,13.6,14,14.4,14.8,15.2,15.6,16,16.4,16.8,17.2,17.6,18,18.4,18.8,19.2,19.6,20,20.4,20.8,21.2,21.6,22],
			data: [12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5],
			flowstep: 0.2,
			flowadd: 0.25
		})
	},
	lookUpInTable: function(table,limit){
		if (limit < table.minlimit){
			return [["lessthan",table.minlimit],table.mindata];
		} else if (limit >= table.maxlimit) {
			if (table.flowstep) {
				var overflow = (limit*10-table.maxlimit*10)/10,
					numstepsover = Math.floor((10*(overflow))/(10*table.flowstep)),
					lower = (table.maxlimit*10+numstepsover*table.flowstep*10)/10,
					higher = (lower*10+table.flowstep*10)/10,
					val = table.maxdata+numstepsover*table.flowadd;
				console.log("input",limit,"tablemax",table.maxlimit,"overflow",overflow,"stepsize",table.flowstep,"numstepsover",numstepsover,"lower",lower,"higher",higher);
				return [["between",lower,higher],val];
			} else {
				return [["ormore",table.maxlimit],table.maxdata];
			}
		} else {
			var n = _.find(table.range,function(n){return limit >= table.limits[n] && limit < table.limits[n+1];});
			return [["between",table.limits[n],table.limits[n+1]],table.data[n]];
		}
	},
	lookUpInTableOLD: function(table,limit){
		return limit < table.minlimit ? table.mindata : limit >= table.maxlimit ? (table.calcMax ? table.calcMax(limit) : table.maxdata) : table.data[_.find(limit <= table.midlimit ? table.range : table.revrange,function(n){
			return limit >= table.limits[n] && limit < table.limits[n+1];
		})];
	},
	matchValue: function(against,val){
		//console.log(" ... MATCHVALUE ",val,"against",against,"type",against[0]);
		switch(against[0]){
			case "ormore":
				//console.log(" ... MATCHVALUE ",val,"against",against,"result",val >= against[1]);
				return val >= against[1];
			case "lessthan":
				//console.log(" ... MATCHVALUE ",val,"against",against,"result",val < against[1]);
				return val < against[1];
			case "between": return val >= against[1] && val < against[2];
			default: return val === against;
		}
	},
	performMatch: function(match,data){
		//console.log("matching",match,"against",data);
		return _.reduce(match,function(memo,testpropval,testpropname){
			return memo && this.matchValue(testpropval,data[testpropname]);
		},true,this);
	},
	lookUpInList: function(list,data){
		var lookup = _.find(list,function(listentry){return this.performMatch(listentry[0],data);},this); // now we have a listentry or nothing
		return lookup && this.processListResult(lookup,data);
	},
	processListResult: function(listentry,data){
		var match = listentry[0], result =  _.ensureArray(listentry[1]);
		result = _.ensureArray(result);
		switch(result[0]){ // result is [instruction,arg1,arg2] or just [value]
			case "tablelookup": // [tablelookup,tablename,datapropname]
				var tablename = result[1], propname = result[2],
					tablelookup = this.lookUpInTable(this.tables[tablename],data[propname]),
					betweencondition = tablelookup[0],
					answer = tablelookup[1];
				return [_.extend({},match,_.object([propname],[betweencondition])),answer];
			default:
				return listentry;
		}
	},
	lists: { // a listentry is [test,result]
		weightLimits: [
			[{road: 1,hasEngine:false,totalAxleDistance:["between",6.6,6.8]},33],
			[{road: 1,hasEngine:false,totalAxleDistance:["between",6.8,7]},34],
			[{road: 1,hasEngine:false,totalAxleDistance:["between",7,7.2]},35],
			[{road: 1,hasEngine:false,totalAxleDistance:["morethan",7.2]},36],
			[{road: 1}, ["tablelookup","weightBK1","totalAxleDistance"] ],
			[{road: 2}, ["tablelookup","weightBK2","totalAxleDistance"] ],
			[{road: 3}, ["tablelookup","weightBK3","totalAxleDistance"] ]
		],
		generalLimits: [
			[{road: 3}, "---"],
			[{hasEngine:true,numberOfAxles:2}, 18],
			[{road: 2}, "---"],
			[{road: 1, numberOfAxles:3,isJointBus:true}, 28],
			[{road: 1, hasEngine:true,numberOfAxles:3,hasGoodSuspension:true},26],
			[{road: 1, hasEngine:true,numberOfAxles:3,hasGoodSuspension:false}, 25],
			[{road: 1, hasEngine:true,numberOfAxles:["ormore",4],hasGoodSuspension:true}, 32],
			[{road: 1, hasEngine:true,numberOfAxles:["ormore",4],hasGoodSuspension:false}, 31],
			[{road: 1, hasEngine:false,totalAxleDistance:["ormore",7.2]}, 36], // trailer!
			[{road: 1}, "---"]
		],
		axleLimits: [
			[{road:1,axles:1,isPropulsionAxle:true},11.5],
			[{road:1,axles:1,isPropulsionAxle:false},10],
			[{road:2,axles:1},10],
			[{road:3,axles:1},8],
			[{axles:2,axleWidth:["lessthan",1]},11.5],
			[{road:1,axles:2,axleWidth:["between",1,1.3]},16],
			[{road:1,axles:2,axleWidth:["between",1.3,1.8],hasGoodSuspension:false},18],
			[{road:1,axles:2,axleWidth:["between",1.3,1.8],hasGoodSuspension:true},19],
			[{road:1,axles:2,axleWidth:["ormore",1.8]},20],
			[{road:2,axles:2,axleWidth:["ormore",1]},16],
			[{road:3,axles:2,axleWidth:["ormore",1]},12],
			[{road:1,axles:3,axleWidth:["lessthan",2.6]},21],
			[{road:1,axles:3,axleWidth:["ormore",2.6]},24],
			[{road:2,axles:3,axleWidth:["lessthan",2.6]},20],
			[{road:2,axles:3,axleWidth:["ormore",2.6]},22],
			[{road:3,axles:3},13],
		],
	},
	findNextAxleGroup: function(arr){ // takes array of distances, returns type which is number of axles in group (1, 2 or 3)
		return arr.length >= 2 && arr[0]+arr[1] < 5 ? 3 : arr.length >= 1 && arr[0] < 2 ? 2 : 1;
	},
	findAxleGroupArray: function(distances){
		var arr = [];
		while (distances.length) {
			var type = this.findNextAxleGroup(distances),
				obj = {axles:type,axleWidth: _.sum(_.first(distances,type-1)),distanceToNext:distances[type-1]||0 };
			arr = arr.concat( type === distances.length ? [obj,{axles:1,axleWidth:0,distanceToNext:0}] : obj );
			distances = _.rest(distances,type);
		}
		return arr;
	},
	testAxleGroupPropulsion: function(data,type,n,grouparr){
		return !!(data.hasEngine && n === grouparr.length-1); // how to do this? :P
	},
	processAxleGroup: function(data,axleobj,n,grouparr){
		return _.extend(axleobj,{
			hasGoodSuspension: !!data.hasGoodSuspension,
			isPropulsionAxle: this.testAxleGroupPropulsion(data,axleobj.axles,n,grouparr),
			groupOrderNumber: n,
			weightLimit: data.axleWeightLimits[n],
			groupName: this.nameAxleGroup(data,axleobj,n,grouparr),
			road: data.road
		});
	},
	nameAxleGroup: function(data,axleobj,n,grouparr){
		return ["FOOBAR","axeln","boggien","trippelaxeln"][axleobj.type]; // TODO - främre, bakre and shit
	},
	processAxleGroupArray: function(data,grouparr){
		return _.map(grouparr,function(axle,index){
			return this.processAxleGroup(data,axle,index,grouparr);
		},this);
	},
	processData: function(data){
		return _.extend({
			groupedAxles: this.processAxleGroupArray(data,this.findAxleGroupArray(data.axleDistances)),
			totalAxleDistance: _.reduce(data.axleDistances,function(mem,d){return mem+d;},0),
			numberOfAxles: data.axleDistances.length+1,
			hasEngine: !!data.hasEngine,
			hasGoodSuspension: !!data.hasGoodSuspension,
			isJointBus: !!data.isJointBus
		},data);
	},
	drawAxle: function(axle){
		console.log("DRAWING AXLE",axle)
		var desc = ["FOOBAR","axel","boggie","trippel"][axle.axles],
			width = (axle.axles!=1?"<span class='axlewidth'>"+axle.axleWidth+"m</span>":""),
			weight = (axle.weightLimit?"<span class='axlemax'>"+axle.weightLimit+"ton</span>":""),
			dist = (axle.distanceToNext ? "<span class='axledistancetonext'>"+axle.distanceToNext+"m</span>":"");
		return "<span class='axle axle-"+desc+"'><span class='axledesc'>"+desc+"</span>"+width+weight+"</span>"+dist;
	}
};




