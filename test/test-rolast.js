R = _.uniqueId;

describe("the table reader",function(){
	var lookUpInTable = rolast.lookUpInTable;
	it("is defined",function(){ expect(typeof lookUpInTable).toEqual("function"); });
	describe("when used with BK1 table",function(){
		var table = rolast.tables.weightBK1;
		describe("when called with first limit",function(){
			var limit = 0, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(11.5); });
		});
		describe("when called with last limit",function(){
			var limit = 100, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(60); });
		});
		describe("when called with lower middle limit",function(){
			var limit = 10, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(40); });
		});
		describe("when called with higher middle limit",function(){
			var limit = 12.2, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(48); });
		});
	});
	describe("when used with BK2 table",function(){
		var table = rolast.tables.weightBK2;
		describe("when called with first limit",function(){
			var limit = 0, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(16); });
		});
		describe("when called with last limit",function(){
			var limit = 100, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(51.4); });
		});
		describe("when called with lower middle limit",function(){
			var limit = 10, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(31); });
		});
		describe("when called with higher middle limit",function(){
			var limit = 16.3, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(45.32); });
		});
	});
	describe("when used with BK3 table",function(){
		var table = rolast.tables.weightBK3;
		describe("when called with first limit",function(){
			var limit = 0, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(12); });
		});
		describe("when called with last limit",function(){
			var limit = 21.8, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(37); });
		});
		describe("when called with lower middle limit",function(){
			var limit = 9, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(21); });
		});
		describe("when called with higher middle limit",function(){
			var limit = 19.2, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(34); });
		});
		/*describe("when called with past calc limit that needs calc",function(){
			var limit = 22, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(37.5); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22.2, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(37.75); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22.21, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(37.75); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22.4, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res[1]).toEqual(38); });
		});*/
	});
});

describe("the matcher stuff",function(){
	describe("the matchValue function",function(){
		var matchValue = rolast.matchValue;
		describe("the straight matching",function(){
			describe("when called with nonmatching value",function(){
				var val = 5, against = 6, res = matchValue(against,val);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
			describe("when called with matching value",function(){
				var val = R(), against = val, res = matchValue(against,val);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
		});
		describe("the ormore matching",function(){
			describe("when called with higher value",function(){
				var val = 7, against = ["ormore",5], res = matchValue(against,val);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with equal value",function(){
				var val = 7, against = ["ormore",7], res = matchValue(against,val);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with lower value",function(){
				var val = 7, against = ["ormore",10], res = matchValue(against,val);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
		});
		describe("the lessthan matching",function(){
			describe("when called with lower value",function(){
				var val = 7, against = ["lessthan",12], res = matchValue(against,val);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with equal value",function(){
				var val = 7, against = ["lessthan",7], res = matchValue(against,val);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
			describe("when called with higher value",function(){
				var val = 7, against = ["lessthan",5], res = matchValue(against,val);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
		});
		describe("the between matching",function(){
			describe("when called with below lower bound",function(){
				var val = 7, against = ["between",12,15], res = matchValue(against,val);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
			describe("when called with equal to lower bound",function(){
				var val = 12, against = ["between",12,15], res = matchValue(against,val);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with between bounds",function(){
				var val = 13, against = ["between",12,15], res = matchValue(against,val);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with equal to higher bound",function(){
				var val = 15, against = ["between",12,15], res = matchValue(against,val);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
			describe("when called with higher than higher bound",function(){
				var val = 16, against = ["between",12,15], res = matchValue(against,val);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
		});
	});
	describe("the performMatch func",function(){
		var performMatch = rolast.performMatch;
		describe("for full match",function(){
			var context = {matchValue:sinon.stub().returns(true)};
			var data = R(), matchkeys = [R(),R(),R()], matchvals = [R(),R(),R()], match = _.object(matchkeys,matchvals), res = performMatch.apply(context,[match,data]);
			it("returns true",function(){ expect(res).toEqual(true); });
			it("called matchValue correctly",function(){
				expect(context.matchValue).toHaveBeenCalledThrice();
				expect(context.matchValue.firstCall.args).toEqual([matchvals[0],data[matchkeys[0]]]);
				expect(context.matchValue.secondCall.args).toEqual([matchvals[1],data[matchkeys[1]]]);
				expect(context.matchValue.thirdCall.args).toEqual([matchvals[2],data[matchkeys[2]]]);
			});
		});
		describe("for failing match",function(){
			var context = {matchValue:sinon.stub()};
			context.matchValue.returns(true).onSecondCall().returns(false);
			var data = R(), matchkeys = [R(),R(),R()], matchvals = [R(),R(),R()], match = _.object(matchkeys,matchvals), res = performMatch.apply(context,[match,data]);
			it("returns false",function(){ expect(res).toEqual(false); });
			it("called matchValue correctly",function(){
				expect(context.matchValue).toHaveBeenCalledTwice();
				expect(context.matchValue.firstCall.args).toEqual([matchvals[0],data[matchkeys[0]]]);
				expect(context.matchValue.secondCall.args).toEqual([matchvals[1],data[matchkeys[1]]]);
			});
		});
	});
	describe("the lookUpInList func",function(){
		var lookUpInList = rolast.lookUpInList;
		describe("when matches middle item in list of 3",function(){
			var processresult = R(), context = {performMatch:sinon.stub(),processListResult:sinon.stub()};
			context.performMatch.returns(false).onSecondCall().returns(true);
			context.processListResult.returns(processresult);
			var data = R(), list = [[R(),[R(),R(),R()]],[R(),[R(),R(),R()]],[R(),[R(),R(),R()]]], res = lookUpInList.apply(context,[list,data]);
			it("calls processListResult correctly",function(){
				expect(context.processListResult).toHaveBeenCalledOnce();
				expect(context.processListResult.firstCall.args).toEqual([[list[1][0],list[1][1]],data]);
			});
			it("returns the processed answer",function(){ expect(res).toEqual(processresult); });
			it("called performMatch correctly",function(){
				expect(context.performMatch).toHaveBeenCalledTwice();
				expect(context.performMatch.firstCall.args).toEqual([list[0][0],data]);
				expect(context.performMatch.secondCall.args).toEqual([list[1][0],data]);
			});
		});
		describe("when no matches",function(){
			var context = {performMatch:sinon.stub(),processListResult:sinon.stub()};
			context.performMatch.returns(false);
			var data = R(), list = [[R(),R()],[R(),R()],[R(),R()]], res = lookUpInList.apply(context,[list,data]);
			it("returns undefined",function(){ expect(res).toBeUndefined(); });
			it("called performMatch correctly",function(){
				expect(context.performMatch).toHaveBeenCalledThrice();
				expect(context.performMatch.firstCall.args).toEqual([list[0][0],data]);
				expect(context.performMatch.secondCall.args).toEqual([list[1][0],data]);
				expect(context.performMatch.thirdCall.args).toEqual([list[2][0],data]);
			});
			it("never processed the undefined result",function(){
				expect(context.processListResult.callCount).toEqual(0);
			});
		});
	});
	describe("the processListResult func",function(){
		var processListResult = rolast.processListResult;
		describe("when called with tablelookup",function(){
			var tablename = R(),
				propname = R(),
				data = _.object([propname],[R()]),
				context = {tables:_.object([tablename],[R()]),lookUpInTable:sinon.stub()},
				ret = R(),
				desc = R(),
				result = ["tablelookup",tablename,propname],
				answer = [R(),result,desc];
			context.lookUpInTable.returns(ret);
			var res = processListResult.apply(context,[result,data]);
			/*it("returns result from lookUpInTable",function(){ expect(res).toEqual(ret); });
			it("called lookUpInTable correctly",function(){
				expect(context.lookUpInTable).toHaveBeenCalledOnce();
				expect(context.lookUpInTable.firstCall.args).toEqual([context.tables[tablename],data[propname]]);
			});*/
		});
	});
});

describe("the axleGroup stuff",function(){
	describe("the findNextAxleGroup function",function(){
		var cxg = rolast.findNextAxleGroup;
		describe("when distance is [2,2]",function(){
			var distance = [2,2],
				result = cxg(distance);
			it("returns 3",function(){
				expect(result).toEqual(3);
			});
		});
		describe("when distance is [1.8,5]",function(){
			var distance = [1.8,5],
				result = cxg(distance);
			it("returns 2",function(){
				expect(result).toEqual(2);
			});
		});
		describe("when distance is [6,3]",function(){
			var distance = [6,3],
				result = cxg(distance);
			it("returns 1",function(){
				expect(result).toEqual(1);
			});
		});
	});
	describe("the findAxleGroupArray function",function(){
		var cxga = rolast.findAxleGroupArray;
		it("passes sanity check for single tripleaxle",function(){ expect(cxga.apply(rolast,[[1,1]])).toEqual([{axles:3,axleWidth:2,distanceToNext:0}]); });
		it("passes sanity check for single boggie",function(){ expect(cxga.apply(rolast,[[1]])).toEqual([{axles:2,axleWidth:1,distanceToNext:0}]); });
		it("passes sanity check for single superwidth",function(){ expect(cxga.apply(rolast,[[10]])).toEqual([{axles:1,axleWidth:0,distanceToNext:10},{axles:1,axleWidth:0,distanceToNext:0}]); });
		it("passes sanity check for 2 superwidths",function(){ expect(cxga.apply(rolast,[[10,10]])).toEqual([{axles:1,axleWidth:0,distanceToNext:10},{axles:1,axleWidth:0,distanceToNext:10},{axles:1,axleWidth:0,distanceToNext:0}]); });
		it("passes sanity check for single,boggie",function(){ expect(cxga.apply(rolast,[[10,1]])).toEqual([{axles:1,axleWidth:0,distanceToNext:10},{axles:2,axleWidth:1,distanceToNext:0}]); });
		it("passes sanity check for boggie,single",function(){ expect(cxga.apply(rolast,[[1,10]])).toEqual([{axles:2,axleWidth:1,distanceToNext:10},{axles:1,axleWidth:0,distanceToNext:0}]); });
		it("passes sanity check for boggie,single,boggie",function(){ expect(cxga.apply(rolast,[[1,10,10,1]])).toEqual([{axles:2,axleWidth:1,distanceToNext:10},{axles:1,axleWidth:0,distanceToNext:10},{axles:2,axleWidth:1,distanceToNext:0}]); });
		it("passes sanity check for boggie,boggie",function(){ expect(cxga.apply(rolast,[[1,10,1]])).toEqual([{axles:2,axleWidth:1,distanceToNext:10},{axles:2,axleWidth:1,distanceToNext:0}]); });
		var context = {
			findNextAxleGroup: sinon.stub()
		};
		context.findNextAxleGroup.returns(1).onFirstCall().returns(3);
		var distances = [R(),R(),R(),R()],
			result = cxga.apply(context,[distances]);
		//it("returns array of return values",function(){
		//	expect(result).toEqual([3,1,1]);
		//});
		it("called findNextAxleGroup correctly",function(){
			expect(context.findNextAxleGroup).toHaveBeenCalledTwice();
			expect(context.findNextAxleGroup.firstCall.args).toEqual([distances]);
			expect(context.findNextAxleGroup.secondCall.args).toEqual([ [distances[3]] ]);
		});
	});
});

describe("the calculate stuff",function(){
	describe("the calculateread function",function(){
		var calcread = rolast.calculateread;
		it("passes sanity check",function(){
			var propname = R(), propval = R(), data = _.object([propname],[propval]),
				res = calcread(propname,data);
			expect(res.result).toEqual(propval);
		});
	});
	describe("the calculateread function",function(){
		var calcread = rolast.calculateread;
		it("passes sanity check",function(){
			var propname = R(), propval = R(), data = _.object([propname],[propval]),
				res = calcread(propname,data);
			expect(res.result).toEqual(propval);
		});
	});
	describe("the calculatefilter function",function(){
		var calcfilter = rolast.calculatefilter;
		var filtername = R(), data = R(), filtercontent = R(), lookupres = [R(),R()], context = {
			lists: _.object([filtername],[filtercontent]),
			lookUpInList: sinon.stub()
		};
		context.lookUpInList.returns(lookupres);
		var res = calcfilter.apply(context,[filtername,data]);
		it("called lookUpInList correctly",function(){
			expect(context.lookUpInList).toHaveBeenCalledOnce();
			expect(context.lookUpInList.firstCall.args).toEqual([filtercontent,data]);
		});
		it("returned obj with filterdef and filterresults",function(){
			expect(res.result).toEqual(lookupres[1]);
			expect(res.filter).toEqual(lookupres[0]);
		});
	});
});
describe("the calculateeach func",function(){
	var ceach = rolast.calculateeach, context = {calculate:sinon.stub()}, stub = context.calculate, data = R(), calcret = R(), calc = R(), arr = [R(),R(),R()];
	stub.returns(calcret);
	var res = ceach.apply(context,[arr,calc,data]);
	it("called calculate correctly",function(){
		expect(stub).toHaveBeenCalledThrice();
		expect(stub.firstCall.args).toEqual([calc,arr[0]]);
		expect(stub.secondCall.args).toEqual([calc,arr[1]]);
		expect(stub.thirdCall.args).toEqual([calc,arr[2]]);
	});
	it("returns the processed array",function(){
		expect(res).toEqual([calcret,calcret,calcret]);
	});

});
describe("the calculate func",function(){
	var calc = rolast.calculate;
	describe("when called with single arg calc",function(){
		var type = R(), context = _.object(["calculate"+type],[sinon.stub()]), stub = context["calculate"+type],
			retkey = R(), retval = R(), retobj = _.object([retkey],[retval]), data = R(), name = R(), arg = R();
		stub.returns(retobj);
		var res = calc.apply(context,[[type,name,arg],data]);
		it("called calcfunc correctly",function(){
			expect(stub).toHaveBeenCalledOnce();
			expect(stub.firstCall.args).toEqual([arg,data]);
		});
		it("returned the correct obj",function(){
			expect(res).toEqual(_.object(["type","name",retkey,"def"],[type,name,retval,[type,name,arg]]));
		});
	});
	describe("when called with multiarg calc",function(){
		var type = R(), context = _.object(["calculate"+type],[sinon.stub()]), stub = context["calculate"+type],
			retkey = R(), retval = R(), retobj = _.object([retkey],[retval]), data = R(), name = R(), args = [R(),R(),R()];
		stub.returns(retobj);
		var res = calc.apply(context,[[type,name].concat(args),data]);
		it("called calcfunc correctly",function(){
			expect(stub).toHaveBeenCalledOnce();
			expect(stub.firstCall.args).toEqual([args,data]);
		});
		it("returned the correct obj",function(){
			expect(res).toEqual(_.object(["type","name",retkey,"def"],[type,name,retval,[type,name].concat(args)]));
		});
	});
	describe("when called with single arg each",function(){
		var type = R(), eachpropname = R(), eachpropval = "EPV", context = _.object(["calculate"+type,"calculateeach"],[sinon.stub(),sinon.stub()]),
			calctype = context["calculate"+type], typeretkey = R(), typeretval = R(), typeretobj = _.object([typeretkey],[typeretval]),
			data = _.object([eachpropname],[eachpropval]), name = R(), eachcalcarg = R(),
			calceach = context.calculateeach, calceachreturn = R();
		calctype.returns(typeretobj);
		calceach.returns(calceachreturn);
		var res = calc.apply(context,[[type,name,["each",eachpropname,eachcalcarg]],data]);
		it("called calceach correctly",function(){
			expect(calceach).toHaveBeenCalledOnce();
			expect(calceach.firstCall.args).toEqual([eachpropval,eachcalcarg,data]);
		});
		it("called calcfunc correctly",function(){
			expect(calctype).toHaveBeenCalledOnce();
			expect(calctype.firstCall.args).toEqual([calceachreturn,data]);
		});
		it("returned the correct obj",function(){
			expect(res).toEqual(_.object(["type","name",typeretkey,"def"],[type,name,typeretval,[type,name,["each",eachpropname,eachcalcarg]]]));
		});
	});
});

describe("when testing all together in major sanity check",function(){
	var data = {
		axleDistances: [5,1],
		hasEngine: true,
		road: 1,
		axleWeightLimits: [7,12],
		serviceWeight: 30,
		maxWeight: 25
	};
	data = rolast.processData(data);
	var result = rolast.calculate( rolast.calculations.maxLoad, data );
	console.log("MAJORCALC",result);
});
