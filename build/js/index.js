$(function(){var i=[],n=[],o=[],l={8:"8:00AM",8.5:"8:30AM",9:"9:00AM",9.5:"9:30AM",10:"10:00AM",10.5:"10:30AM",11:"11:00AM",11.5:"11:30AM",12:"12:00PM",12.5:"12:30PM",13:"1:00PM",13.5:"1:30PM",14:"2:00PM",14.5:"2:30PM",15:"3:00PM",15.5:"3:30PM",16:"4:00PM",16.5:"4:30PM",17:"5:00PM",17.5:"5:30PM",18:"6:00PM",18.5:"6:30PM",19:"7:00PM",19.5:"7:30PM",20:"8:00PM"};$("#submit").on("click",function(){var l=$("#DotW").val(),a=$("#time option:selected").val();$.getJSON("/data",function(r){Object.keys(r).map(function(n){for(var o in r[n]){for(var e=r[n][o][l][a],t=r[n][o].size,s=19.5-parseFloat(a),p=0;s>=p;p+=.5){var $=parseFloat(a)+p,u=$.toString();if(1===r[n][o][l][u]){var c=u;p=s+1}else if(p===s)var c="20"}0===e&&(console.log(c),i.push([n,o,t,c]))}});for(var e=i.length,t=0;e>t;t++)n.push(i[t][0]);$.each(n,function(i,n){-1===$.inArray(n,o)&&o.push(n)});for(var s=o.length,t=0;s>t;t++){var p=o[t];$("#buildings").append("<li id='"+p+"' class='building'>"+p+"</li>")}$(".inputWrap").hide(),$(".titleWrap").hide(),$(".buildingsWrap").show()})}),$("#buildings").on("click",".building",function(){var n=$(this).attr("id"),o=[];i.map(function(i){i[0]===n&&(o.push(i),console.log(i,i[0]),console.log(o))}),o.map(function(i){var n=i[3],o=l[n];$("#room").append("<li>"+i[1]+"</li>"),$("#size").append("<li>"+i[2]+"</li>"),$("#until").append("<li>"+o+"</li>")}),$(".buildingsWrap").hide(),$(".roomsWrap").show()}),$("#back1").on("click",function(){$(".buildingsWrap").hide(),$(".inputWrap").show(),$(".titleWrap").show(),$("#buildings > li").remove()}),$("#back2").on("click",function(){$(".roomsWrap").hide(),$(".buildingsWrap").show(),$("#room > li").remove(),$("#size > li").remove(),$("#until > li").remove()})});