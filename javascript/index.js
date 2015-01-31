$(function(){
	$('#submit').on('click', function(event){
		event.preventDefault();
		$.getJSON( "assets/data.json", function(data) {
		  var results = [];
		  console.log(data);
		});
	})
});
