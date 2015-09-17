//Initialize Select (case 't')
function piIni()
{
	var sel = document.getElementById("piSel");
	
	var req = new XMLHttpRequest();
	
	// Create some variables we need to send to our PHP file
	var url = "dat.php";
	var vars = "req=t&tbl=''";
	req.open("POST", url, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");	
	req.send(vars);
	// Access the onreadystatechange event for the XMLHttpRequest object
	req.onreadystatechange = function() 
	{
		//alert(req.readyState);
		//alert(req.status);
		if(req.readyState == 4 && req.status == 200) 
		{
			dat = req.responseText;
			var pis = dat.split("\n");
			pis.pop();
			for (var i=0; i<pis.length; i++)
			{
				var opt = document.createElement("option");
				opt.value = pis[i];
				opt.innerHTML = pis[i];
				sel.appendChild(opt);
			}
		}
	}
}
//Download Data (case 'd')
function dwn(obj)
{
	if (document.getElementById("res"))
	{
		document.body.removeChild(document.getElementById("res"));
	}
	var sqltbl = document.getElementById("piSel").value;
	var start  = document.getElementById("start").innerHTML;
	var end    = document.getElementById("end").innerHTML;
	var stime  = document.getElementById("stime").innerHTML;
	var etime  = document.getElementById("etime").innerHTML;
	
	if ((start == "") && (end == ""))
	{
		var now = new Date();
		start = (now.getMonth()+1).toString() + "/" + now.getDate.toString() + "/" + now.getFullYear.toString();
		end = start;
	}
	else if ((start == "") || (end == ""))
	{
		start = start || end;
		end = start;
	}
	
	if ((stime == "") && (etime == ""))
	{
		var now = new Date();
		stime = "00:00:00";
		etime = "23:59:59";
	}
	else if ((stime == "") || (etime == ""))
	{
		stime = stime || etime;
		etime = stime;
	}
	
	var req = new XMLHttpRequest();
	
	// Create some variables we need to send to our PHP file
	var url = "dat.php";
	var vars = "req=d&tbl=" + sqltbl + "&st=" + start + "&en=" + end + "&ts=" + stime + "&te=" + etime;
	req.open("POST", url, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");	
	req.send(vars);
	// Access the onreadystatechange event for the XMLHttpRequest object
	req.onreadystatechange = function() 
	{
		//alert(req.readyState);
		//alert(req.status);
		if(req.readyState == 4 && req.status == 200) 
		{
			var dat = req.responseText;
			//document.getElementById("status").innerHTML = dat;
			if (dat == "0 results")
			{
				alert("No Results");
				return;
			}
			if (obj.id == "tab")
			{
				var div = document.createElement("div");
				div.id = "res";
				
				var tbl = document.createElement("table");			
				tbl.insertRow(0);
				hdr = tbl.rows[0];
				
				var th = document.createElement("th");
				th.innerHTML = "Date";
				th.style.border = "1px solid black";
				hdr.appendChild(th);
				
				var th = document.createElement("th");
				th.innerHTML = "UNIX Time";
				th.style.border = "1px solid black";
				hdr.appendChild(th);
				
				var th = document.createElement("th");
				th.innerHTML = "Local Time";
				th.style.border = "1px solid black";
				hdr.appendChild(th);
				
				var th = document.createElement("th");
				th.innerHTML = "Dust Reading";
				th.style.border = "1px solid black";
				hdr.appendChild(th);
							
				tbl.style.border = "1px solid black";
				tbl.style.borderCollapse = "collapse";
			}
			var rows = dat.split("\n");
			rows.pop();
			//alert(rows.length);
			
			
			var time = [];
			var dust = [];
			var ustrt = rows[0].split(",")[1];
			for (var i = 0; i<rows.length; i++)
			{
				var tmp = rows[i].split(",");
				if (obj.id == "tab")
				{
					var row = tbl.insertRow(tbl.rows.length);
					for (var j=0; j<tmp.length; j++)
					{
						var cell = row.insertCell(j);
						cell.innerHTML = tmp[j];
						cell.style.border = "1px solid black";
					}
					
				}
				else
				{
					if (i%(parseInt(rows.length/10)+1)==0){time.push(tmp[2].slice(0,5));}
					//if (i%(parseInt(rows.length/10))==0){time.push(tmp[1]-ustrt);}
					else{time.push("");}
					dust.push(tmp[3]);
				}
			}
			
			if (obj.id == "tab")
			{
				div.appendChild(tbl);			
				document.body.appendChild(div);
			}
			//alert(dat);
			
			genChart(time,dust);
		}
	}
}

//Upload Data (case 'u')
function upl()
{
	var sqltbl = document.getElementById("piSel").value;
	var start  = document.getElementById("start").innerHTML;
	var end    = document.getElementById("end").innerHTML;
	
	
	var req = new XMLHttpRequest();
	
	// Create some variables we need to send to our PHP file
	var url = "dat.php";
	var vars = "req=u&tbl=" + sqltbl + "\n&obs=2015/07/26,1437953352.48,16:29:12,699.78\n";
	req.open("POST", url, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");	
	req.send(vars);
	// Access the onreadystatechange event for the XMLHttpRequest object
	req.onreadystatechange = function() 
	{
		//alert(req.readyState);
		//alert(req.status);
		if(req.readyState == 4 && req.status == 200) 
		{
			var dat = req.responseText;
			alert(dat);
		}
	}
}


function popup(pos)
{
	var pops = document.getElementsByClassName("tooltip");
	if (pops.length != 0)
	{
		for (var i=0; i<pops.length; i++)
		{
			document.body.removeChild(pops[i]);
			i--;
		}
	}
	
	
	var div = document.createElement("div");
	div.style.position = "fixed";
	div.style.left= pos[0] + "px";
	div.style.top = pos[1] + "px";
	div.style.backgroundColor = "white";
	div.className = "tooltip";
	div.style.width = "10%";
	
	var lbl = document.createElement("label");
	lbl.innerHTML = "Please Select Time: ";
	
	div.appendChild(lbl);
	
	var hr = document.createElement("select");
	hr.id = "hour";
	hr.width = "50%";
	for (var i=0; i<24; i++)
	{
		var hropt = document.createElement("option");
		var temp = "";
		temp = i.toString();
		if (i<10){temp = "0" + i.toString()}
		hropt.value = temp;
		hropt.innerHTML = temp;
		hr.appendChild(hropt);
	}
	/*
	hr.onchange = function()
	{
		var hour = document.getElementById("hr");
		hour.innerHTML = this.options[this.selectedIndex].value;
	}
	*/
	div.appendChild(hr);
	
	var mn = document.createElement("select");
	mn.id = "minute";
	for (var i=0; i<4; i++)
	{
		var mnopt = document.createElement("option");
		var temp = "";
		temp = (i*15).toString();
		if (i==0){temp = "0" + (i*15).toString()}
		mnopt.value = temp;
		mnopt.innerHTML = temp;
		mn.appendChild(mnopt);
	}
	/*
	mn.onchange = function()
	{
		var min = document.getElementById("mn");
		min.innerHTML = this.options[this.selectedIndex].value;
	}
	*/	
	div.appendChild(mn);
	
	var btn = document.createElement("input");
	btn.type = "button";
	btn.value = "OK";
	btn.onclick = function ()
		{
			var min = document.getElementById("minute");
			var mn = document.getElementById("mn");
			mn.innerHTML = min.options[min.selectedIndex].value;
			var hour = document.getElementById("hour");
			var hr = document.getElementById("hr");
			hr.innerHTML = hour.options[hour.selectedIndex].value;
			document.body.removeChild(this.parentElement);
		};
	div.appendChild(btn);
	
	
	document.body.appendChild(div);
}


var mon;
var first = new Date();
var year;

function monIni()
{
	var now = new Date();
	mon = now.getMonth();
	var date = now.getDate();
	var day = now.getDay();
	year = now.getFullYear();
	
	first.setFullYear(year,mon,1);
	
	//alert((date - first.getDate())%7);
	//alert(first.getDay());
	monTable(first);
	
}

function monTable(first)
{
	var lbm = document.getElementById("mon");
	var lby = document.getElementById("year");
	lbm.innerHTML = monInfo(mon,year,"str");
	lby.innerHTML = " " + year;
	var days = monInfo(mon,year,"days");
	
	var tbl = document.getElementById("cal");
	var row;
	var cell;
	var day = first.getDay();
	
	if (tbl.rows.length > 1)
	{
		do
		{
			tbl.deleteRow(-1);
		}while (tbl.rows.length>1)
	}
	var x = 0;
	var y = 0;
	//insert first row
	row = tbl.insertRow(-1);
	//find first of month
	var c = 0;
	//fill cells empty until first
	if (day != 0) 
	{
		do
		{
			cell = row.insertCell(c);
			cell.innerHTML = "";
			cell.style.borderWidth = "0px 0px 0.2vw 0px";
			if (c == day-1){cell.style.borderWidth = "0px 0.2vw 0.2vw 0px";}
			c++;
		}while(c<day)
	}
	cell = row.insertCell(day); 
	cell.innerHTML = 1;
	cell.onclick = function()
		{
			//alert(this.innerHTML);
			var rows = this.parentNode.parentNode.rows;
			for (var i = 0; i<rows.length; i++)
			{
				var cells = rows[i].cells;
				for (var j = 0;j<cells.length; j++)
				{
					cells[j].style.fontWeight = "";
					cells[j].style.color = "";
				}
			}
			this.style.fontWeight = "bold";
			this.style.color = "blue";
			
			var month = (mon+1).toString();
			if (mon < 10){month = "0" + month;}
			var date = this.innerHTML.toString();					
			if (date < 10){date = "0" + date;}
			
			document.getElementById("date").innerHTML = year.toString() + "/" + month + "/" + date;
			
			var rect = this.getBoundingClientRect();
			x = rect.right;
			y = rect.top  + (this.offsetHeight/3);
			popup([x,y],"time");
		};
	
	//fill rest of month
	c++;
	var d = 2;

	do
	{
		if (c == 7){c=0;}
		if (c == 0){row = tbl.insertRow(-1);}
		cell = row.insertCell(c); 
		if (d == days+1){cell.innerHTML = "";cell.style.border = "0px";}
		else
		{
			cell.innerHTML = d;
			cell.onclick = function()
				{
					//alert(this.innerHTML);
					var rows = this.parentNode.parentNode.rows;
					for (var i = 0; i<rows.length; i++)
					{
						var cells = rows[i].cells;
						for (var j = 0;j<cells.length; j++)
						{
							cells[j].style.fontWeight = "";
							cells[j].style.color = "";
						}
					}
					this.style.fontWeight = "bold";
					this.style.color = "blue";
					
					var month = (mon+1).toString();
					if (mon < 10){month = "0" + month;}
					var date = this.innerHTML.toString();					
					if (date < 10){date = "0" + date;}
					
					document.getElementById("date").innerHTML = year.toString() + "/" + month + "/" + date;
					
					var rect = this.getBoundingClientRect();
					x = rect.right;
					y = rect.top  + (this.offsetHeight/3);
					popup([x,y],"time");
					//alert(x.toString().concat(",",y));
				};
				
			
			
		}					
		c++;
		if (d!= days+1){d++;}
	}while (c<7 || d<(days+1))		
		
	//monResize();
	
}

function monResize()
{
	var div = document.getElementById("tbl");
	var tbl = document.getElementById("cal");
	
	var w = div.offsetWidth;
	var h = div.offsetHeight;
	
	tbl.style.width = w.toString() + "px";
	tbl.style.height = h.toString() + "px";
	rows = tbl.children[0].children;
	for (var i=0; i<rows.length; i++)
	{
		var cells = rows[i].children;
		for (var j=0; j<cells.length; j++)
		{
			cells[j].style.width = (w/6.5).toString() + "px";
			cells[j].style.width = (h/6.5).toString() + "px";
		}
	}
}

function monChange(dir)
{
	if (dir == "prev"){mon--;}
	else{mon++;}
	if (mon < 0 ){mon += 11;year--;}
	if (mon > 11){mon -= 12;year++;}
	first.setFullYear(year,mon,1);
	monTable(first);
}

function monSet(mon)
{
	var date = document.getElementById("date");
	var set = date.innerHTML;
	
	var time = document.getElementById("hr").innerHTML + ":" + document.getElementById("mn").innerHTML;
	//date.innerHTML = "";
	
	switch(mon.id)
	{
		case "st":
			document.getElementById("start").innerHTML = set;
			document.getElementById("stime").innerHTML = time + ":00";
			set = "";
			time = "";
			break;
		case "en":
			document.getElementById("end").innerHTML = set;
			document.getElementById("etime").innerHTML = time + ":00";
			set = "";
			time = "";
			break;
	}
	
}

function monInfo(mon,year,inf)
{
	var ret;
	var str = "";
	var day = 0;
	switch(mon)
	{
		case 0:
			str = "January";
			day = 31;
			break;
		case 1:
			str = "February";			
			if (year%4 != 0){day = 28;}
			else{day=29;}
			break;
		case 2:
			str = "March";
			day = 31;
			break;
		case 3:
			str = "April";
			day = 30;
			break;
		case 4:
			str = "May";
			day = 31;
			break;
		case 5:
			str = "June";
			day = 30;
			break;
		case 6:
			str = "July";
			day = 31;
			break;
		case 7:
			str = "August";
			day = 31;
			break;
		case 8:
			str = "September";
			day = 30;
			break;
		case 9:
			str = "October";
			day = 31;
			break;
		case 10:
			str = "November";
			day = 30;
			break;
		case 11:
			str = "December";
			day = 31;
			break;
	}
	switch (inf)
	{
		case "str":
			ret = str;
			break;
		case "days":
			ret = day;
			break;
	}
	return ret;		
}

/* Charts (use chart.js) */

function genChart(x,y)
{
	chrt_data = {
		labels: x,
		datasets:
		[
			{
				fillColor: "rgba(255,0,0,0.2)",
				strokeColor: "rgba(255,0,0,1)",
				pointColor: "rgba(255,0,0,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: y
			}
		]
	};
	line(chrt_data);
}
//Graph Generation Functions (uses chart.js)
function line(data,options)
{
	var ctx = document.getElementById('chart').getContext("2d");
	
	test = typeof data == 'undefined'; 	
	if (test) 
	{ 
		data={
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: 
		[
			{
				label: "My First dataset",
				fillColor: "rgba(220,220,220,0.2)",
				strokeColor: "rgba(220,220,220,1)",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: [65, 59, 80, 81, 56, 55, 40]
			},
			{
				label: "My Second dataset",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: [28, 48, 40, 19, 86, 27, 90]
			}
		]
		};
	}
	test = typeof options == 'undefined'; 
	legend_templ = '<table class=\"<%=name.toLowerCase()%>-legend\">'
					+ '<% for (var i=0; i<datasets.length; i++){%>'
						+'<tr>'
							+ '<span style=\"background-color:<%=datasets[i].strokeColor%>\"></span>'
							+'<td><%if(datasets[i].label){%><%=datasets[i].label%><%}%></td>'
							+'<td><%if(datasets[i].label){%><%=datasets[i].value%><%}%></td>'
						+'</tr>'
					+'<%}%>'
					+'</table>';
	if (test)
	{
		options={
		//Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,
		
		//Boolean - Whether to show a dot for each point
		pointDot : false,	
		
		 // Boolean - whether or not the chart should be responsive and resize when the browser does.
		responsive: true,
		
		// Boolean - Determines whether to draw tooltips on the canvas or not
		showTooltips: false,
		
		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - Whether the line is curved between points
		bezierCurve : true,

		//Number - Tension of the bezier curve between points
		bezierCurveTension : 0.4,

		//Boolean - Whether to show a dot for each point
		//pointDot : true,

		//Number - Radius of each point dot in pixels
		pointDotRadius : 4,

		//Number - Pixel width of point dot stroke
		pointDotStrokeWidth : 1,

		//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		pointHitDetectionRadius : 20,

		//Boolean - Whether to show a stroke for datasets
		datasetStroke : true,

		//Number - Pixel width of dataset stroke
		datasetStrokeWidth : 2,

		//Boolean - Whether to fill the dataset with a colour
		datasetFill : true,
		//onAnimationComplete: save,
		//String - A legend template
		legendTemplate : legend_templ
		};
	}
	var myLineChart = new Chart(ctx).Line(data, options);
	legend = myLineChart.generateLegend();
	//document.getElementById('legend').innerHTML = legend;
	curr_chart = myLineChart;
}
function bar(data,options)
{
	var ctx = document.getElementById('chart').getContext("2d");
	
	test = typeof data == 'undefined'; 	
	
	if (test) 
	{ 
		data = {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [
			{
				label: "My First dataset",
				fillColor: "rgba(220,220,220,0.5)",
				strokeColor: "rgba(220,220,220,0.8)",
				highlightFill: "rgba(220,220,220,0.75)",
				highlightStroke: "rgba(220,220,220,1)",
				data: [65, 59, 80, 81, 56, 55, 40]
			},
			{
				label: "My Second dataset",
				fillColor: "rgba(151,187,205,0.5)",
				strokeColor: "rgba(151,187,205,0.8)",
				highlightFill: "rgba(151,187,205,0.75)",
				highlightStroke: "rgba(151,187,205,1)",
				data: [28, 48, 40, 19, 86, 27, 90]
			}
		]
		};
	}
	test = typeof options == 'undefined'; 
	if (test)
	{
		options = {
		//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		scaleBeginAtZero : true,

		//Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - If there is a stroke on each bar
		barShowStroke : true,

		//Number - Pixel width of the bar stroke
		barStrokeWidth : 2,

		//Number - Spacing between each of the X value sets
		barValueSpacing : 5,

		//Number - Spacing between data sets within X values
		barDatasetSpacing : 1,
		
		//onAnimationComplete: save,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
		
		};
	}
	var myBarChart = new Chart(ctx).Bar(data, options);
	curr_chart = myBarChart;
}
function pie(data,options)
{
	var ctx = document.getElementById('chart').getContext("2d");
	
	var legend_templ = '<table class=\"<%=name.toLowerCase()%>-legend\">'
				+ '<% for (var i=0; i<segments.length; i++){%>'
					+'<tr>'
						+ '<td style=\"background-color:<%=segments[i].fillColor%>;width:25px\"> </td>'
						+'<td><%if(segments[i].label){%><%=segments[i].label%><%}%></td>'
						+'<td><%if(segments[i].value){%><%=segments[i].value%><%}%></td>'
					+'</tr>'
				+'<%}%>'
				+'</table>';
	
	test = typeof data == 'undefined'; 	
	
	if (test) 
	{ 
		data = [
			{
				value: 300,
				color:"#F7464A",
				highlight: "#FF5A5E",
				label: "Red"
			},
			{
				value: 50,
				color: "#46BFBD",
				highlight: "#5AD3D1",
				label: "Green"
			},
			{
				value: 100,
				color: "#FDB45C",
				highlight: "#FFC870",
				label: "Yellow"
			}
		];
	}
	
	test = typeof options == 'undefined'; 
	if (test)
	{
		options = {
			//scaleShowLabels: true,
			//Boolean - Whether we should show a stroke on each segment
			segmentShowStroke : true,

			//String - The colour of each segment stroke
			segmentStrokeColor : "#fff",

			//Number - The width of each segment stroke
			segmentStrokeWidth : 2,

			//Number - The percentage of the chart that we cut out of the middle
			percentageInnerCutout : 0, // This is 0 for Pie charts

			//Number - Amount of animation steps
			animationSteps : 100,

			//String - Animation easing effect
			animationEasing : "easeOutBounce",

			//Boolean - Whether we animate the rotation of the Doughnut
			animateRotate : true,

			//Boolean - Whether we animate scaling the Doughnut from the centre
			animateScale : false,
			//onAnimationComplete: save,
			//String - A legend template
			legendTemplate : legend_templ//"<ul class=\"<%=name.toLowerCase()%>-legend\" style=\"list-style-type: square\"><% for (var i=0; i<segments.length; i++){%><li style=\"color:<%=segments[i].fillColor%>\"><span style=\"color:<%=segments[i].fillColor%>;font-weight:bold\"></span><%if(segments[i].label){%><%=segments[i].label%> - <%=segments[i].value%> <%}%></li><%}%></ul>"
		};
	}
	var myPieChart = new Chart(ctx).Pie(data, options);
	legend =  myPieChart.generateLegend();
	//document.getElementById('legend').innerHTML = legend;
	curr_chart = myPieChart;
}
function radar(data,options)
{
	var ctx = document.getElementById('chart').getContext("2d");
	
	test = typeof data == 'undefined'; 	
	
	if (test) 
	{ 
		data = {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [
			{
				label: "My First dataset",
				fillColor: "rgba(220,220,220,0.5)",
				strokeColor: "rgba(220,220,220,0.8)",
				highlightFill: "rgba(220,220,220,0.75)",
				highlightStroke: "rgba(220,220,220,1)",
				data: [65, 59, 80, 81, 56, 55, 40]
			},
			{
				label: "My Second dataset",
				fillColor: "rgba(151,187,205,0.5)",
				strokeColor: "rgba(151,187,205,0.8)",
				highlightFill: "rgba(151,187,205,0.75)",
				highlightStroke: "rgba(151,187,205,1)",
				data: [28, 48, 40, 19, 86, 27, 90]
			}
		]
		};
	}
	test = typeof options == 'undefined'; 
	if (test)
	{
		options = {
			//Boolean - Whether to show lines for each scale point
			scaleShowLine : true,
			// Boolean - Determines whether to draw tooltips on the canvas or not
			showTooltips: false,
			//Boolean - Whether we show the angle lines out of the radar
			angleShowLineOut : true,

			//Boolean - Whether to show labels on the scale
			scaleShowLabels : false,

			// Boolean - Whether the scale should begin at zero
			scaleBeginAtZero : true,

			//String - Colour of the angle line
			angleLineColor : "rgba(0,0,0,.1)",

			//Number - Pixel width of the angle line
			angleLineWidth : 1,

			//String - Point label font declaration
			pointLabelFontFamily : "'Arial'",

			//String - Point label font weight
			pointLabelFontStyle : "normal",

			//Number - Point label font size in pixels
			pointLabelFontSize : 10,

			//String - Point label font colour
			pointLabelFontColor : "#666",

			//Boolean - Whether to show a dot for each point
			pointDot : true,

			//Number - Radius of each point dot in pixels
			pointDotRadius : 3,

			//Number - Pixel width of point dot stroke
			pointDotStrokeWidth : 1,

			//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			pointHitDetectionRadius : 20,

			//Boolean - Whether to show a stroke for datasets
			datasetStroke : true,

			//Number - Pixel width of dataset stroke
			datasetStrokeWidth : 2,

			//Boolean - Whether to fill the dataset with a colour
			datasetFill : true,
			//onAnimationComplete: save,
			//String - A legend template
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

		};
	}
	var myRadarChart = new Chart(ctx).Radar(data, options);
	curr_chart = myRadarChart;
}