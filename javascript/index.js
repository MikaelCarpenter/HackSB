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
					var roomSize = result[value][key].size;
					var timeStepsLeft = (19.5 - time);
					for (var i=0; i <= timeStepsLeft; i+=0.5) {
						var timeCheck = time + i;
						if(result[value][key][day][timeCheck]) {
							var freeUntil = timeCheck;
							i = timeStepsLeft + 1;
						}else if(i = timeStepsLeft){
							var freeUntil = '20';
						}
					}
					if(input === 0) {
						results.push([value, key, roomSize, freeUntil]);
					}
				}
			});

			console.log(results[0]);
		});
	});
});
