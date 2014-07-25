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





vägverkets skit:
	fordonsslag: ucUtdata_fslag
	fordonsslagsklass: ucUtdata_fslagklass
	skattevikt: ucUtdata_skvikt
	tjänstevikt: ucUtdata_tjvikt
	totalvikt: ucUtdata_totvikt
	ursprunglig totalvikt: ucUtdata_stotvikt
	max släpvikt kärra: ucUtdata_lblMaxViktSlapKarra
	max släpvagnsvikt: ucUtdata_maxSlap
	släp max totalvikt vid körkort B: ucUtdata_maxSlapB
	Max axelavstånd axel 1-2, mm: MaxAxelAvst1Rub






	VYER

*  X Lista
*    New/edit
*    välj tillkoppling till valt fordon
*  X resultat
*    paragraf





