$(function(){
	var results = [];
	var buildingsRaw = [];
	var buildings = [];
	var numToTime = {
		8.0: '8:00AM',
		8.5: '8:30AM',
		9.0: '9:00AM',
		9.5: '9:30AM',
		10.0: '10:00AM',
		10.5: '10:30AM',
		11.0: '11:00AM',
		11.5: '11:30AM',
		12.0: '12:00PM',
		12.5: '12:30PM',
		13.0: '1:00PM',
		13.5: '1:30PM',
		14.0: '2:00PM',
		14.5: '2:30PM',
		15.0: '3:00PM',
		15.5: '3:30PM',
		16.0: '4:00PM',
		16.5: '4:30PM',
		17.0: '5:00PM',
		17.5: '5:30PM',
		18.0: '6:00PM',
		18.5: '6:30PM',
		19.0: '7:00PM',
		19.5: '7:30PM',
		20: '8:00PM'
	}
	$('#submit').on('click', function(event){
		var day = $('#DotW').val();
		var time = $('#time option:selected').val();
		$.getJSON( "/data", function(result) {
			results = []; //necessary to avoid repeats
			Object.keys(result).map(function(value, index) {
				for(var key in result[value]) {
					var input = result[value][key][day][time];
					var roomSize = result[value][key].size;
					var timeStepsLeft = (19.5 - parseFloat(time));
					for (var i=0.0; i <= timeStepsLeft; i+=0.5) {
						var timeCheck = parseFloat(time) + i;
						var timeString = timeCheck.toString();
						if(result[value][key][day][timeString] === 1) {
							var freeUntil = timeString;
							i = timeStepsLeft + 1;
						}else if(i === timeStepsLeft){
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
				buildingsRaw.push(results[i][0]);
			}

			$.each(buildingsRaw, function(i, el){
			    if($.inArray(el, buildings) === -1) {
			    	buildings.push(el);
			    }
			});

			buildings = buildings.sort(); // alphabetizes

			var buildingsLength = buildings.length;

			for(var i = 0; i < buildingsLength; i++){
				var buildingName = buildings[i];
				$('#buildings').append('<li id=\'' + buildingName + '\' class=\'building\'>' + buildingName + '</li>');
			}

			$('.inputWrap').hide();
			$('.titleWrap').hide();	
			$('.buildingsWrap').show();
		});
	});

	$('#buildings').on('click', '.building', function(event) {
		var id = $(this).attr('id');
		var displayArray = [];
		results.map(function(value, index) {
			if(value[0] === id){
				displayArray.push(value);
			}
		})
		displayArray.map(function(value, index) {
			var until = value[3];
			var hour = numToTime[until];
			$('#room').append('<li>' + value[1] + '</li>');
			$('#size').append('<li>' + value[2] + '</li>');
			$('#until').append('<li>' + hour + '</li>');
		})

		$('.buildingsWrap').hide();
		$('.roomsWrap').show();
	})

	$('#back1').on('click', function(event) {
		$('.buildingsWrap').hide();
		$('.inputWrap').show();
		$('.titleWrap').show();
		$('#buildings > li').remove(); // removes the <li>s from the ul
	})

	$('#back2').on('click', function(event) {
		$('.roomsWrap').hide();
		$('.buildingsWrap').show();
		$('#room > li').remove(); // removes the <li>s from the ul
		$('#size > li').remove(); // removes the <li>s from the ul
		$('#until > li').remove(); // removes the <li>s from the ul
	})
});