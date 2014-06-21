describe("the table reader",function(){
	it("is defined",function(){ expect(typeof rolast.readTable).toEqual("function"); });
	describe("when used with BK1 table",function(){
		var table = rolast.tables.weightBK1;
		describe("when called with first limit",function(){
			var limit = 0, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(11.5); });
		});
		describe("when called with last limit",function(){
			var limit = 100, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(60); });
		});
		describe("when called with lower middle limit",function(){
			var limit = 10, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(40); });
		});
		describe("when called with higher middle limit",function(){
			var limit = 12.2, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(48); });
		});
	});
	describe("when used with BK2 table",function(){
		var table = rolast.tables.weightBK2;
		describe("when called with first limit",function(){
			var limit = 0, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(16); });
		});
		describe("when called with last limit",function(){
			var limit = 100, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(51.4); });
		});
		describe("when called with lower middle limit",function(){
			var limit = 10, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(31); });
		});
		describe("when called with higher middle limit",function(){
			var limit = 16.3, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(45.32); });
		});
	});
	describe("when used with BK3 table",function(){
		var table = rolast.tables.weightBK3;
		describe("when called with first limit",function(){
			var limit = 0, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(12); });
		});
		describe("when called with last limit",function(){
			var limit = 21.8, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(37); });
		});
		describe("when called with lower middle limit",function(){
			var limit = 9, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(21); });
		});
		describe("when called with higher middle limit",function(){
			var limit = 19.2, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(34); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(37.5); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22.2, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(37.75); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22.21, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(37.75); });
		});
		describe("when called with past calc limit that needs calc",function(){
			var limit = 22.4, res = rolast.readTable(table,limit);
			it("returns correct value",function(){ expect(res).toEqual(38); });
		});
	});
});