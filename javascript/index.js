$(function(){
	var results = [];
	var buildingsRaw = [];
	var buildings = [];
	var day = $('#DotW').val();
	var time = $('#time').val();
	$('#submit').on('click', function(event){
		event.preventDefault();
		console.log('hi');
		$.getJSON( "/data", function(result) {
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

			var resultsLength = results.length;

			for(var i = 0; i < resultsLength; i++) {
				console.log('hi');
				buildingsRaw.push(results[i][0]);
			}

			$.each(buildingsRaw, function(i, el){
			    if($.inArray(el, buildings) === -1) {
			    	buildings.push(el);
			    }
			});

			var buildingsLength = buildings.length;

			for(var i = 0; i < buildingsLength; i++){
				var buildingName = buildings[i];
				console.log('<li id=\'' + buildingName + '\'>' + buildingName + '</li>');
				$('#buildings').append('<li id=\'' + buildingName + '\' class=\'building\'>' + buildingName + '</li>');
			}

			$('.inputWrap').hide();
			$('.titleWrap').hide();	
			$('.resultsWrap').show();
		});
	});
});
