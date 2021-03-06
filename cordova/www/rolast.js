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
			case "ormore": return testval[1]+" "+unit+" eller "+more;
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
		return this.strings.ALLMAENINTRO+"\nPå BK"+data.road+"-väg har "+(calcres.result == "---" ? "detta fordon ingen allmän viktbegränsning" : this.describeVehicle(calcres.filter)+" maxvikten "+calcres.result+" ton")+". (sid 12 i häftet)";
	},
	describeWeightLimit: function(calcres,data){
		return this.strings.BRUTTOTABELLINTRO+"\nPå BK"+data.road+"-väg så är bruttomaxvikten "+calcres.result+" ton för "+this.describeVehicle(calcres.filter)+". (sid "+["foo",11,13,14][data.road]+" i häftet)";
	},
	describeAxleLimit: function(calcres,data){
		if (!calcres.filter){
			console.log("Oh no! Describing axle limit but we got no filter!",calcres,"data:",data);
		}
		return this.strings.AXELREGELINTRO+" På BK"+data.road+"-väg får "+this.describeAxle(calcres.filter)+" bära max "+calcres.result+" ton. (sid "+["foo",7,7,8][data.axles]+" i häftet)";
	},
	describeMaxWeight: function(calcres,data){
		var names = ["skattevikten","bruttonmaxvikten från tabellen","den allmäna begränsningen","summan av de tillåtna axelbelastningarna"],
			limit = calcres.lowest.length === 4 ? "samtliga begränsningar lika låga" : _.map(calcres.lowest,function(n){return names[n];}).join(" och ")+" lägst";
		return this.strings.MINSTABEGRAENSNING.replace("%LIMIT",limit);
	},
	describeTrainMaxWeight: function(calcres,data){
		var what = calcres.used[0].result === calcres.used[1].result ? 0 : calcres.used[0].result === calcres.result ? 1 : 2;
		return this.strings.TAAGMAX+" "+this.strings[ ["TAAGMAXSAMMA","TAAGMAXTABELL","TAAGMAXSUMMA"][what] ];
	},
	describeAxleGroupMax: function(calcres,data){
		var what = calcres.used[0].result === calcres.used[1].result ? 0 : calcres.used[0].result === calcres.result ? 1 : 2;
		return this.strings.AXELGRUPPMAX+"\n"+this.strings[ ["AXELGRUPPMAXSAMMA","AXELGRUPPMAXREGEL","AXELGRUPPMAXBEVIS"][what] ];
	},
	printCalcResult: function(calcres,data,lvl){
		if (!lvl) { lvl = 0;}
		var str = "<span class='calcprint calc"+lvl+((lvl%2)?" calcodd":"")+"'><span class='calctitle'>"+calcres.title+"</span>"+(calcres.type === "all" ? "" : "<span class='calcresult'>"+calcres.result+"</span>");
		if (calcres.type != "read"){
			str += "<button class='calczoomer'>visa</button>";
			str += "<span class='calcdesc'>"+calcres.desc+"</span>";
			str += _.reduce(calcres.used || [],function(s,part){
				return s+"<span class='calcdetails'>"+this.printCalcResult(part,data,lvl+1)+"</span>";
			},"",this);
		}
		return str+"</span>";
	},
	printFlatCalcResult: function(calcres,detail,index){
		var str = "<span class='calc"+(detail?"detailtitle":"title")+"'>"+calcres.title+"</span>"+(calcres.type === "all" ? "" : "<span class='calcresult'>"+calcres.result+"</span>");
		if (calcres.type != "read" && !detail){
			str += "<span class='calcdesc'>"+calcres.desc+"</span>";
			str += _.reduce(calcres.used || [],function(s,part,n){
				return s+this.printFlatCalcResult(part,true,n);
			},"",this);
		}
		return "<span class='calc"+(detail?(calcres.type!="read" ? "multi" : "read")+"part":"overview")+"'"+(detail?" data-index='"+index+"'":"")+">"+str+"</span>";
	},
	describe: function(res,data){
		if (!this.descriptions[res.name]){
			throw "Unknown description name: "+res.name;
		}
		var name = res.name,
			title = this.descriptions[name][0].replace("%NAME",(res.useddata||data).descriptionName),
			descname = (this.descriptions[name][1] || ""),
			desc = this[descname] ? this[descname](res,data) : this.strings[descname] || descname;
		desc = desc.replace("%NAME",(res.useddata||data).descriptionName);
		desc = desc.replace("%RES",res.result);
		desc = desc.replace("\n","<br/><br/>");
		desc = _.reduce(res.used || [],function(desc,child,n){ return desc.replace("%DEP"+(n+1),child.result); },desc);
		return _.extend(res,{
			title: title,
			desc: desc
		});
	},
	strings: {
		LASTVIASKILLNAD: "Vi får fram lastvikten genom att ta skillnaden mellan högsta tillåtna totalvikt (%DEP1 ton) och tjänstevikt (%DEP2 ton). Resultatet blir då %RES ton.",
		MINSTABEGRAENSNING: "Att räkna ut ett fordons högsta tillåtna vikt är komplicerat. Vi måste ta fram var och en av de fyra möjliga begränsningar som finns, och maxvikten blir sedan den lägsta av dessa begränsningar.\nI detta fall var %LIMIT och fordonets maxvikt är därmed %RES ton.",
		BRUTTOTABELLINTRO: "Trafikförordningen innehåller tabeller för ett fordons maxvikt utifrån avståndet mellan dess första och sista axel.",
		ALLMAENINTRO: "Utöver maxviktstabellerna så finns det också några allmäna viktbegränsningar utifrån fordonstyp och axelantal.",
		LOKOCHSLAEP: "Genom att räkna ut maxvikt för lok (%DEP1 ton) och släp (%DEP2 ton) var för sig så kan vi sedan summera dessa för att få fram en möjlig maxvikt för fordonståget. För detta fordonståg blir summan %RES ton.",
		TAAGMAX: "För att ta reda på maxvikten för ett fordonståg så måste vi dels slå i bruttoviktstabellen som om tåget vore ett enda fordon (vilket ger %DEP1 ton), och dels räkna ut summan av maxvikterna för loket och släpet (sammanlagt %DEP2 ton).",
		TAAGMAXSAMMA: "I detta fall så gav båda samma resultat, och fordonstågets maxvikt är därmed %RES ton.",
		TAAGMAXTABELL: "I detta fall gav tabellen det lägsta resultatet, så fordonstågets maxvikt blir %RES ton.",
		TAAGMAXSUMMA: "I detta fall gav summan av lokets och släpets maxvikter det lägsta resultatet, så fordonstågets maxvikt blir %RES ton.",
		TAAGVIKTSUMMA: "Tjänstevikten för fordonståget får vi genom att summera tjänstevikterna för loket (%DEP1 ton) och släpet (%DEP2 ton) från deras respektive registreringsbevis. Vi får då fram att vårt fordonståg väger %RES ton.",
		AXELGRUPPMAXSUMMA: "Vi räknar ut ett fordons maximala sammanlagda axelbelastning genom att summera maxbelastningarna för samtliga axelgrupper. För detta fordon blev summan %RES ton.",
		AXELGRUPPMAX: "Maxbelastningen på en axel eller axelgrupp är antingen begränsningen enligt regelverket eller högsta tillåtna belastning enligt registreringsbeviset.",
		AXELGRUPPMAXSAMMA: "För %NAME så gav båda samma resultat, och maxbelastningen blir därmed %RES ton.",
		AXELGRUPPMAXREGEL: "För %NAME så är det regelverkets begränsning på %RES ton som sätter gränsen, eftersom registreringsbevisets gräns på %DEP2 ton är högre.",
		AXELGRUPPMAXBEVIS: "För %NAME så är det registreringsbeviset begränsning på %RES ton som sätter gränsen, eftersom regelverkets begränsning på %DEP1 ton är högre.",
		AXELREGELINTRO: "Regelverket dikterar maxvikt för en axel eller axelgrupp utifrån dess egenskaper. "
	},
	descriptions: {
		DIFFERENSEN: ["maximal lastvikt","LASTVIASKILLNAD"],
		MINSTABEGRAENSNING: ["tillåten totalvikt","describeMaxWeight"],
		REGMAXVIKT: ["skattevikt från registreringsbevis"],
		TABELLBRUTTOMAX: ["bruttomaxvikt enligt tabell","describeWeightLimit"],
		GENERELLGRAENS: ["allmän begränsning","describeGeneralLimit"],
		AXELSUMMA: ["sammanlagd axelbelastning","AXELGRUPPMAXSUMMA"],
		MINSTAAXELBEGRAENSNING: ["%NAMEs maxbelastning","describeAxleGroupMax"],
		AXELMAX: ["begränsning enligt regler","describeAxleLimit"],
		REGAXELMAX: ["begränsning från registreringsbevis"],
		TJAENSTEVIKT: ["tjänstevikt från registreringsbevis"],
		FORDONSLASTVIKTFOERALLAVAEGAR: ["Fordonets maxlastvikter","Här är fordonets maximala lastvikt för de olika bärighetsklasserna:"],
		TAAGLASTVIKTFOERALLAVAEGAR: ["Tågets maxlastvikter","Här är fordonstågets maximala lastvikt för de olika bärighetsklasserna:"],
		MAXLASTBK1: ["Maxlast på BK1-väg","LASTVIASKILLNAD"],
		MAXLASTBK2: ["Maxlast på BK2-väg","LASTVIASKILLNAD"],
		MAXLASTBK3: ["Maxlast på BK3-väg","LASTVIASKILLNAD"],
		// tåågskit
		TAAGVIKT: ["fordonstågets maximala vikt","describeTrainMaxWeight"],
		TAAGTJAENSTEVIKT: ["fordonstågets tjänstevikt","TAAGVIKTSUMMA"],
		DRAGBILVIKT: ["dragbilens tjänstevikt"],
		SLAEPVIKT: ["släpets tjänstevikt"],
		DRAGBILMAX: ["dragbilens största tillåtna vikt"],
		SLAEPMAX: ["släpets största tillåtna vikt"],
		TAAGTABELLBRUTTOMAX: ["Tågets maxvikt enligt tabell","describeWeightLimit"],
		LOKPLUSSLAEP: ["Lokets och släpets maxvikter","LOKOCHSLAEP"]

	},
	calculations: {
		maxTrainLoadForAllRoads:
			["all","TAAGLASTVIKTFOERALLAVAEGAR",
				["with",{road:1},"calc","maxTrainLoad","MAXLASTBK1"],
				["with",{road:2},"calc","maxTrainLoad","MAXLASTBK2"],
				["with",{road:3},"calc","maxTrainLoad","MAXLASTBK3"]
			],
		maxTrainLoad:
			["subtract","DIFFERENSEN",
				["calc","maxTrainWeight"],
				["sum","TAAGTJAENSTEVIKT",
					["for","engine","read","DRAGBILVIKT","serviceWeight"],
					["for","trailer","read","SLAEPVIKT","serviceWeight"]
				],
			],
		maxTrainWeight:
			["min","TAAGVIKT",
				["filter","TAAGTABELLBRUTTOMAX","weightLimits"],
				["sum","LOKPLUSSLAEP",
					["for","engine","calc","maxVehicleWeight","DRAGBILMAX"],
					["for","trailer","calc","maxVehicleWeight","SLAEPMAX"]
				]
			],
		maxVehicleWeight:
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
		maxVehicleLoad:
			["subtract","DIFFERENSEN",
				["calc","maxVehicleWeight"],
				["read","TJAENSTEVIKT","serviceWeight"]
			],
		maxVehicleLoadForAllRoads:
			["all","FORDONSLASTVIKTFOERALLAVAEGAR",
				["with",{road:1},"calc","maxVehicleLoad","MAXLASTBK1"],
				["with",{road:2},"calc","maxVehicleLoad","MAXLASTBK2"],
				["with",{road:3},"calc","maxVehicleLoad","MAXLASTBK3"]
			]
	},
	calculate: function(calc,data){
		if (calc.hasOwnProperty("result")) { return calc; } // already processed!
		if (calc[0] === "with") {
			data = _.extend(data,calc[1]);
			calc = _.rest(calc,2);
		}
		if (calc[0] === "for") {
			data = _.extend(data[calc[1]],{road:data.road}); // pass on road
			calc = _.rest(calc,2);
		}
		if (calc[0] === "calc") {
			calcresult = this.calculate(this.calculations[calc[1]],data);
			if (calc[2]){
				calcresult.name = calc[2];
				return this.describe(calcresult);
			}
			return calcresult;
		}
		var type = calc[0],
			name = calc[1],
			args = _.rest(calc,2),
			obj = {type:type,name:name,def:calc,useddata:data};
		if (args[0] && args[0][0] === "each"){
			args = this.calculateeach(data[args[0][1]],args[0][2],data);
		}
		if (!this["calculate"+type]){
			console.log("BAD CALC",calc,"data",data);
			throw "Unknown calc type: "+type;
		}
		return this.describe(_.extend(obj,this["calculate"+type]((args.length === 1 && (type !== "sum") ? args[0] : args), data)),data);
	},
	calculatesubtract: function(terms,data){
		var subtractee = this.calculate(terms[0],data),
			subtractor = this.calculate(terms[1],data);
		return {
			result: (+(subtractee.result || 0)*1000 - +(subtractor.result||0)*1000)/1000,
			used: [subtractee,subtractor]
		};
	},
	calculateeach: function(arr,calc,data){
		return _.map(arr,function(el){
			return this.calculate(calc,_.extend(el,{road:data.road})); // pass on road
		},this);
	},
	calculateread: function(propname,data){
		return {result: data[propname] || "---"};
	},
	calculatefilter: function(filtername,data){
		var f = this.lookUpInList(this.lists[filtername],data);
		//if (filtername === "axleLimits"){ console.log("axle LIMIT CALC","result",f && f[1],"catchfilter",f && f[0],"filtereddata",data); }
		return {
			result: f && f[1] || "---",
			filter:f && f[0],
			filtereddata:data,
			useddata:data
		};
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
			},66666666,this),
			result = min === 66666666 ? "---" : min;
		return {
			result: min,
			lowest: result === "---" ? [] : _.reduce(deps,function(arr,dep,n){return arr.concat(dep.result === result ? n : []);},[]),
			used: deps
		};
	},
	calculatesum: function(calcs,data){
		var deps = _.map(calcs,function(el){ return this.calculate(el,data); },this),
			sum = _.reduce(deps,function(memo,res,n){
				return (memo*1000 + (res.result === "---" ? 0 : res.result)*1000)/1000;
			},0,this);
		return deps.length === 1 ? deps[0] : {
			result: sum,
			used: deps
		};
	},
	calculateall: function(calcs,data){
		var deps = _.map(calcs,function(el){ return this.calculate(el,data); },this);
		return deps.length === 1 ? deps[0] : {
			used: deps
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
	tableOverflow: function(table,limit){
		var overflow = (limit*10-table.maxlimit*10)/10,
			numstepsover = Math.floor((10*(overflow))/(10*table.flowstep)),
			lower = (table.maxlimit*10+numstepsover*table.flowstep*10)/10,
			higher = (lower*10+table.flowstep*10)/10,
			val = table.maxdata+numstepsover*table.flowadd;
		return [["between",lower,higher],val];
	},
	lookUpInTable: function(table,limit){
		if (limit < table.minlimit){
			return [["lessthan",table.minlimit],table.mindata];
		} else if (limit >= table.maxlimit) {
			return table.flowstep ? this.tableOverflow(table,limit) : [["ormore",table.maxlimit],table.maxdata];
		} else {
			var n = _.find(table.range,function(n){return limit >= table.limits[n] && limit < table.limits[n+1];});
			return [["between",table.limits[n],table.limits[n+1]],table.data[n]];
		}
	},
	matchValue: function(against,val){
		switch(against[0]){
			case "ormore": return val >= against[1];
			case "lessthan": return val < against[1];
			case "between": return val >= against[1] && val < against[2];
			default: return val === against;
		}
	},
	performMatch: function(match,data){
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
		return !!(data.hasEngine && n === grouparr.length-1); // TODO how to do this? :P
	},
	processAxleGroup: function(data,axleobj,n,grouparr,count){
		return _.extend(axleobj,{
			hasGoodSuspension: !!data.hasGoodSuspension,
			isPropulsionAxle: this.testAxleGroupPropulsion(data,axleobj.axles,n,grouparr),
			groupOrderNumber: n,
			weightLimit: data.axleWeightLimits[n],
			descriptionName: this.nameAxleGroup(data,axleobj,n,grouparr,count),
			road: data.road,
			last: n === grouparr.length-1
		});
	},
	nameAxleGroup: function(data,axleobj,n,grouparr,count){
		var name = ["FOOBAR","axeln","boggien","trippelaxeln"][axleobj.axles], pre = "";
		if (axleobj.axles === 1){
			pre = !n ? "fram" : n === grouparr.length-1?"bak":"";
		} else if (count > 1) {
			pre = !n ? "främre " : n === grouparr.length-1?"bakre ":"";
		}
		return pre+name;
	},
	processAxleGroupArray: function(data,grouparr){
		var counts = _.reduce(grouparr,function(c,group){
			c[group.axles]++;
			return c;
		},{1:0,2:0,3:0});
		return _.map(grouparr,function(axle,index){
			return this.processAxleGroup(data,axle,index,grouparr,counts[axle.axles]);
		},this);
	},
	processVehicle: function(data){
		return _.extend({
			groupedAxles: this.processAxleGroupArray(data,this.findAxleGroupArray(data.axleDistances)),
			totalAxleDistance: _.reduce(data.axleDistances,function(mem,d){return (mem*1000+d*1000)/1000;},0),
			numberOfAxles: data.axleDistances.length+1,
			hasEngine: !!data.hasEngine,
			hasGoodSuspension: !!data.hasGoodSuspension, // TODO - calc this!
			isJointBus: !!data.isJointBus
		},data);
	},
	drawAxle: function(axle){
		var name = ["FOOBAR","axel","boggie","trippel"][axle.axles],
			desc = "<span class='axledesc'>"+name+"</span>",
			width = (axle.axles!=1?"<span class='axlewidth'>"+axle.axleWidth+"m</span>":""),
			weight = (axle.weightLimit?"<span class='axlemax'>"+axle.weightLimit+"ton</span>":""),
			dist = (axle.distanceToNext ? "<span class='axledistancetonext"+(axle.lastBeforeCoupling?" lastaxlegroup":"")+"'>"+axle.distanceToNext+"m</span>":"");
		return "<span class='axlecontainer'><span class='axle axle-"+name+"'>"+desc+weight+"</span>"+width+"</span>"+dist;
	},
	drawAxleGroup: function(groupedAxles){
		return _.reduce(groupedAxles,function(str,axle){return str+this.drawAxle(axle);},"",this);
	},
	findCouplingMatches: function(vehicle,all){ // all is object, returns arr
		return _.reduce(all,function(memo,other){
			console.log("Coupling matching",vehicle.vehicleid,other.vehicleid);
			return memo.concat((vehicle.couplingDistance && other.couplingDistance && vehicle.hasEngine !== other.hasEngine) ? other : []);
		},[]);
	},
	buildTrain: function(engine,trailer){
		if (engine.hasEngine === false){
			var temp = engine;
			engine = trailer;
			trailer = temp;
		}
		var between = engine.couplingDistance + trailer.couplingDistance;
		return {
			hasEngine: true,
			isTrain: true,
			totalAxleDistance: (engine.totalAxleDistance*1000 + between*1000 + trailer.totalAxleDistance*1000)/1000,
			numberOfAxles: engine.numberOfAxles + trailer.numberOfAxles,
			groupedAxles: _.map(engine.groupedAxles.concat(trailer.groupedAxles),function(g,n){
				return n === engine.groupedAxles.length-1 ? _.extend({},g,{distanceToNext:between,lastBeforeCoupling:true}) : g;
			}),
			engine: engine,
			serviceWeight: (engine.serviceWeight*1000 + trailer.serviceWeight*1000)/1000,
			trailer: trailer,
			type: "fordonståg",
			vehicleid: engine.vehicleid+"+"+trailer.vehicleid
		};
	}
};