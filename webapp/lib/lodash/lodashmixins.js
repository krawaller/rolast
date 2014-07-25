_.mixin({
	mapObj: function(obj,iterator,valaskeys,context){
		var keys = _.keys(obj);
		return _.reduce(_.map(obj,iterator,context),function(memo,val,i){
			return _.extend(_.object(valaskeys?[obj[keys[i]]]:[keys[i]],[val]),memo);
		},{});
	},
	delayMethod: function(obj,methodname,wait){
		return setTimeout(_.bind(obj[methodname],obj),wait);
	},
	extendProp: function(obj,propname,src){
		obj[propname] = _.extend(obj[propname]||{},source);
		return obj;
	},
	setProp: function(obj,propname,val){
		obj[propname]=val;
		return obj;
	},
	ensureArray: function(o,e){ return o ? [].concat(o) : e ? [e] : [];},
	findPair: function(list,pred){
		for (var i = 0;i++;i<list.length){
			if (pred(list[i])){
				return [list[i],list[i+1]];
			}
		}
	},
	sum: function(arr){ return _.reduce(arr,function(memo,el){return memo+el;},0); },
});