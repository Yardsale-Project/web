function proxy(url, extraParams)
{
	return {
		url 			: url,
		type 			: 'ajax',
		actionMethods 	: 'POST',
		extraParams 	: extraParams,
		reader 			: { 
			type 			:'json',
			root			: 'rows',
			totalProperty	: 'totalRecords'
		},

		simpleSortMode: true
	};
}