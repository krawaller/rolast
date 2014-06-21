checkTable = function(table){
	if (table.limits.length !== table.data.length){throw "Table has different limit and data length";}
	if (table.limits[0] !== 0){throw "Table limit doesn't start with 0";}
};

processTable = function(table){
	checkTable(table);
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
			calcMax: function(limit){ return 37.5+Math.floor((10*limit-220)/2)*0.25; }
		})
	},
	readTable: function(table,limit){
		return limit < table.minlimit ? table.mindata : limit >= table.maxlimit ? (table.calcMax ? table.calcMax(limit) : table.maxdata) : table.data[_.find(limit <= table.midlimit ? table.range : table.revrange,function(n){
			return limit >= table.limits[n] && limit < table.limits[n+1];
		})];
	},
	getGeneralLimit: function(road,vehicle){
		return road === 3 ? "---" :
			road === 2 ? (vehicle.hasengine && vehicle.numberOfAxles === 2 ? 18 : "---") :
			vehicle.isJointBus && vehicle.numberOfAxles === 3 ? 28 :
			vehicle.isTrailer && vehicle.totalAxleDistance >= 7.2 ? 36 :
			vehicle.hasEngine && vehicle.numberOfAxles === 2 ? 18 :
			vehicle.hasEngine && vehicle.numberOfAxles === 3 ? (vehicle.hasGoodSuspension ? 26 : 25) :
			vehicle.hasEngine && vehicle.numberOfAxles >= 4 ? (vehicle.hasGoodSuspension ? 32 : 31) : "---";
	}
};