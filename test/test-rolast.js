R = _.uniqueId;

describe("the table reader",function(){
	var lookUpInTable = rolast.lookUpInTable;
	it("is defined",function(){ expect(typeof lookUpInTable).toEqual("function"); });
	describe("when used with BK1 table",function(){
		var table = rolast.tables.weightBK1;
		describe("when called with first limit",function(){
			var limit = 0, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(11.5); });
		});
		describe("when called with last limit",function(){
			var limit = 100, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(60); });
		});
		describe("when called with lower middle limit",function(){
			var limit = 10, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(40); });
		});
		describe("when called with higher middle limit",function(){
			var limit = 12.2, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(48); });
		});
	});
	describe("when used with BK2 table",function(){
		var table = rolast.tables.weightBK2;
		describe("when called with first limit",function(){
			var limit = 0, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(16); });
		});
		describe("when called with last limit",function(){
			var limit = 100, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(51.4); });
		});
		describe("when called with lower middle limit",function(){
			var limit = 10, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(31); });
		});
		describe("when called with higher middle limit",function(){
			var limit = 16.3, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(45.32); });
		});
	});
	describe("when used with BK3 table",function(){
		var table = rolast.tables.weightBK3;
		describe("when called with first limit",function(){
			var limit = 0, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(12); });
		});
		describe("when called with last limit",function(){
			var limit = 21.8, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(37); });
		});
		describe("when called with lower middle limit",function(){
			var limit = 9, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(21); });
		});
		describe("when called with higher middle limit",function(){
			var limit = 19.2, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(34); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(37.5); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22.2, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(37.75); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22.21, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(37.75); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22.4, res = lookUpInTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(38); });
		});
	});
});

describe("the matcher stuff",function(){
	describe("the matchValue function",function(){
		var matchValue = rolast.matchValue;
		describe("the straight matching",function(){
			describe("when called with nonmatching value",function(){
				var val = 5, against = 6, res = matchValue(val,against);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
			describe("when called with matching value",function(){
				var val = R(), against = val, res = matchValue(val,against);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
		});
		describe("the ormore matching",function(){
			describe("when called with higher value",function(){
				var val = 7, against = ["ormore",5], res = matchValue(val,against);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with equal value",function(){
				var val = 7, against = ["ormore",7], res = matchValue(val,against);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with lower value",function(){
				var val = 7, against = ["ormore",10], res = matchValue(val,against);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
		});
		describe("the lessthan matching",function(){
			describe("when called with lower value",function(){
				var val = 7, against = ["lessthan",12], res = matchValue(val,against);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with equal value",function(){
				var val = 7, against = ["lessthan",7], res = matchValue(val,against);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
			describe("when called with higher value",function(){
				var val = 7, against = ["lessthan",5], res = matchValue(val,against);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
		});
		describe("the between matching",function(){
			describe("when called with below lower bound",function(){
				var val = 7, against = ["between",12,15], res = matchValue(val,against);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
			describe("when called with equal to lower bound",function(){
				var val = 12, against = ["between",12,15], res = matchValue(val,against);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with between bounds",function(){
				var val = 13, against = ["between",12,15], res = matchValue(val,against);
				it("returns true",function(){ expect(res).toEqual(true); });
			});
			describe("when called with equal to higher bound",function(){
				var val = 15, against = ["between",12,15], res = matchValue(val,against);
				it("returns false",function(){ expect(res).toEqual(false); });
			});
			describe("when called with higher than higher bound",function(){
				var val = 16, against = ["between",12,15], res = matchValue(val,against);
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
				expect(context.processListResult.firstCall.args).toEqual([list[1][1],data]);
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
			it("returns result from lookUpInTable",function(){ expect(res).toEqual(ret); });
			it("called lookUpInTable correctly",function(){
				expect(context.lookUpInTable).toHaveBeenCalledOnce();
				expect(context.lookUpInTable.firstCall.args).toEqual([context.tables[tablename],data[propname]]);
			});
		});
	});
});