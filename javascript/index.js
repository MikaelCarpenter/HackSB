$(function(){
	$('#submit').on('click', function(event){
		event.preventDefault();
		$.getJSON( "/data", function(result) {
			var results = [];
			var day = $('#DotW').val();
			var time = $('#time').val();

			Object.keys(result).map(function(value, index) {
				for(var key in result[value]) {
					var input = result[value][key][day][time];
					if(!input) {
						results.push([value, key]);
					}
				}
			});

			console.log(results);
		});
	});
});
