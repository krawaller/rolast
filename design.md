ROLAST! WOO!



calc:

	min: list
	value: propname
	each: propname, calc


subtract
	min:
		read:"maxWeight"
		filter:"weightLimits"
		filter:"generalLimits"
		sum:
			each:
				read:"groupedAxles"
				min:
					filter:"axleLimits"
					read:"weightLimit"

	read: "serviceWeight"