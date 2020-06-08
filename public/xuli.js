var socket = io("http://localhost:2323");

socket.on("Server_send_data", function(data){
	const string =JSON.stringify(data);
	
	const obj = JSON.parse(string);
	NhietDo=obj.NhietDo;
	DoAm=obj.DoAm;
	$("#NhietDo").html("");
	$("#NhietDo").append("<div class='ms'>"+NhietDo+ "&#176;C" +"</div>");
	$("#DoAm").html("");
	
$("#DoAm").append("<div class='ms'>" + DoAm +" % "+"</div>");
	});


window.onload = function () {
var dps1 =[]; //DoAm
var dps = []; // NhietDo
var chart = new CanvasJS.Chart("chartContainer", {
	title :{
		text: "Temperature"
	},
	axisY: {
		title: "Temperature (in °C)",
		includeZero: false,
		suffix: " °C"
	},  
	axisX: {
                        title: "chart updates every 2 secs" // Chú thích cho trục X
                    },   
	data: [{
		name:"Temperature",
		type: "spline",
		 xValueType: "dateTime",
		 yValueFormatString: "#0.## °C",
		showInLegend: true,
		dataPoints: dps
	}]
});
var chart1 = new CanvasJS.Chart("chartContainer1", {
	title :{
		text: "Humidity"
	},
	axisY: {
		title: "Humidity (in %)",
		includeZero: false,
		suffix: " %"
	},  
	axisX: {
                        title: "chart updates every 2 secs" // Chú thích cho trục X
                    },   
	data: [{
		name:"Humidity",
		type: "spline",
		 xValueType: "dateTime",
		 yValueFormatString: "#0.## %",
		showInLegend: true,
		dataPoints: dps1
	}]
});



var yVal = 0; 
var updateInterval = 2000;
var dataLength = 20; // number of dataPoints visible at any point
var time=new Date();

var updateChart = function (data) {

		time.setTime(time.getTime()+ updateInterval)

		yVal1=parseInt(DoAm);
		yVal =parseInt(NhietDo); 
		dps.push({
			x: time.getTime(),
			y: yVal
		});
	
		yVal1 =parseInt(DoAm); 
		dps1.push({
			x: time.getTime(),
			y: yVal1
		});

	

	chart.render();
	chart1.render();
};

updateChart();
setInterval(function(){updateChart()}, updateInterval);

}




$(document).ready(function(){
	alert("Hello every body");
	socket.emit("byhand","byhand");
	$("#MayBom").change(function(event){
		var data;
		if ($(this).prop('checked')){
			data='on';
		}
		else{
			data='off'
		}
	socket.emit("BatDen", data);
	});
	$("#PhunThuoc").change(function(event){
		var data;
		if ($(this).prop('checked')){
			data='on';
		}
		else{
			data='off'
		}
	socket.emit("BatQuat", data);
	});

	$("#BangTay").change(function(event){
		var data;
		if ($(this).prop('checked')){
			data='auto';
			socket.emit("auto", data);
		}
		else{
			data='byhand';
			socket.emit("byhand",data);
		}
		
	});
	$("#TuDong").change(function(data){
		var data;
		if ($(this).prop('checked')){
			data='auto';
			socket.emit("auto", data);
		}
		else{
			data='auto';
			socket.emit("auto",data);
		}
		
	});


});