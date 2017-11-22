var TrainType,StartStation,TerminalStation,TimeToGo,DateToGo,TicketTypeIp,StartStationId,TerminalStationId,UserDate,UserTimeInput;

function Start(){
  $('#Rollens').css('display','block')
  TrainType=document.getElementById("TypeInput").value;
  StartStation=document.getElementById("OriginalStationInput").value;
  TerminalStation=document.getElementById("TerminalStationInput").value;
  TimeToGo=document.getElementById("StartTimeInput").value;
  DateToGo=document.getElementById("StartDateInput").value;
  TicketTypeIp=document.getElementById("TicketTypeInput").value;
  TypeChoose(TrainType);
}
function GetTRAStationData()
{
   $.ajax({
    type: 'GET',
    url:"http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/Station?$select=StationID,StationName&$format=JSON", 
    dataType: 'json',
    headers: GetAuthorizationHeader(),
    success: function (Data) {
    var Database = JSON.parse(JSON.stringify(Data));
    for(var i=0;i<Database.length;i++)
    {
      if(Database[i].StationName.Zh_tw===StartStation)//Assign Station
      {
       StartStationId=Database[i].StationID;
        document.getElementById("StartStationID").innerHTML=Database[i].StationID;
        document.getElementById("StartStationName").innerHTML=Database[i].StationName.Zh_tw;
      }
      else if(Database[i].StationName.Zh_tw===TerminalStation)//Assign Station
      {
        TerminalStationId=Database[i].StationID;
        document.getElementById("TerminalStationID").innerHTML=Database[i].StationID;
        document.getElementById("TerminalStationName").innerHTML=Database[i].StationName.Zh_tw;
      }
    }
    GetTRAFaresData();
    GetTRATable();
    }});
}//Function的結尾
function GetTHSRStationData()
{
   $.ajax({
    type: 'GET',
    url:"http://ptx.transportdata.tw/MOTC/v2/Rail/THSR/Station?$select=StationID,StationName&$format=JSON", 
    dataType: 'json',
    headers: GetAuthorizationHeader(),
    success: function (Data) {
    //$('body').text(JSON.stringify(Data));
    var Database = JSON.parse(JSON.stringify(Data));
    for(var i=0;i<Database.length;i++)
    {
      if(Database[i].StationName.Zh_tw===StartStation)//Assign Station
      {
       StartStationId=Database[i].StationID;
        document.getElementById("StartStationID").innerHTML=Database[i].StationID;
        document.getElementById("StartStationName").innerHTML=Database[i].StationName.Zh_tw;
      }
      else if(Database[i].StationName.Zh_tw===TerminalStation)//Assign Station
      {
        TerminalStationId=Database[i].StationID;
        document.getElementById("TerminalStationID").innerHTML=Database[i].StationID;
        document.getElementById("TerminalStationName").innerHTML=Database[i].StationName.Zh_tw;
      }
    }
    GetTHSRFaresData();
    GetTHSRTable();
    }});
}//Function的結尾
function GetTRAFaresData(){
    var TicketType=TicketTypeIp//Assign TicketType
    $.ajax({
     type: 'GET',
     url: "http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/ODFare/"+StartStationId+"/to/"+TerminalStationId+"?$format=JSON",
     dataType: 'json',
     headers: GetAuthorizationHeader(),
     success: function (Data) 
     {
      var FaresData = JSON.parse(JSON.stringify(Data));
        console.log(FaresData);
      for(var i=0;i<=FaresData[0].Fares.length;i++)
      {
        if(TicketType===FaresData[0].Fares[i].TicketType)
        {    
          document.getElementById("TicketType").innerHTML=FaresData[0].Fares[i].TicketType;
          document.getElementById("Price").innerHTML=FaresData[0].Fares[i].Price;
          break;
        }
       else if (i===FaresData[0].Fares.length)
        {
          document.getElementById("TicketType").innerHTML="Wrong Ticket Type";
          document.getElementById("Price").innerHTML="No Data";
        }
      }
     }
     });
}
function GetTHSRFaresData(){
    var TicketType=TicketTypeIp//Assign TicketType
    $.ajax({
     type: 'GET',
     url: "http://ptx.transportdata.tw/MOTC/v2/Rail/THSR/ODFare/"+StartStationId+"/to/"+TerminalStationId+"?$format=JSON",
     dataType: 'json',
     headers: GetAuthorizationHeader(),
     success: function (data) 
     {
      var FaresData = JSON.parse(JSON.stringify(data));
      for(var i=0;i<=FaresData[0].Fares.length;i++)
      {
        if(TicketType===FaresData[0].Fares[i].TicketType)
        {    
          document.getElementById("TicketType").innerHTML=FaresData[0].Fares[i].TicketType;
          document.getElementById("Price").innerHTML=FaresData[0].Fares[i].Price;
          break;
        }
       else if (i===FaresData[0].Fares.length)
        {
          document.getElementById("TicketType").innerHTML="Wrong Ticket Type";
          document.getElementById("Price").innerHTML="No Data";
        }
      }
     }
     });
}
function GetTRATable()
{
  UserDate=DateToGo;//Assign DateValue
  UserTimeInput=TimeToGo;//Assign TimeValue
  var UserTime= new Date(UserDate+" "+UserTimeInput+":00");
  $.ajax({
   type: 'GET',
   url: "http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/DailyTimetable/OD/"+StartStationId+"/to/"+TerminalStationId+"/"+UserDate+"?$format=json",
   dataType: 'json',
   headers: GetAuthorizationHeader(),
   success: function (data) 
   {
     var TableData = JSON.parse(JSON.stringify(data));
     var temp;
     for(var i=0;i<TableData.length-1;i++)
     {
      for(var j=0;j<TableData.length-1-i;j++)
      { 
        var TransTime1=new Date(UserDate+" "+TableData[j].OriginStopTime.DepartureTime+":00");
        var TransTime2=new Date(UserDate+" "+TableData[j+1].OriginStopTime.DepartureTime+":00");
        if(TransTime1>TransTime2)
        {
          temp=TableData[j];
          TableData[j]=TableData[j+1];
          TableData[j+1]=temp;
        }
      }
     }
     for(var counter=0;counter<TableData.length;counter++)
     {
      var TrainTime=new Date(UserDate+" "+TableData[counter].OriginStopTime.DepartureTime+":00");
      if(UserTime.getTime()<TrainTime.getTime())
      {
        console.log(counter);
        if(counter===0||counter===1)
        {
          for(var i=0;i<5;i++)
          {
            document.getElementById("Sug"+i+"No").innerHTML=TableData[i].DailyTrainInfo.TrainNo;
            document.getElementById("Sug"+i+"Type").innerHTMLTableData[i].DailyTrainInfo.TrainTypeName.Zh_tw;
            document.getElementById("Sug"+i+"Start").innerHTML=TableData[i].DailyTrainInfo.StartingStationName.Zh_tw;
            document.getElementById("Sug"+i+"End").innerHTML=TableData[i].DailyTrainInfo.EndingStationName.Zh_tw;
            document.getElementById("Sug"+i+"Original").innerHTML=TableData[i].OriginStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+i+"OriTime").innerHTML=TableData[i].OriginStopTime.DepartureTime;
            document.getElementById("Sug"+i+"Destination").innerHTML=TableData[i].DestinationStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+i+"DesTime").innerHTML=TableData[i].DestinationStopTime.ArrivalTime;
          }
        }
        else if(counter===TableData.length||counter===TableData.length-1)
        {
         for(var i=TableData.length-5,j=0;i<TableData.length;i++,j++)
         {
            document.getElementById("Sug"+j+"No").innerHTML=TableData[i].DailyTrainInfo.TrainNo;
            document.getElementById("Sug"+j+"Type").innerHTML=TableData[i].DailyTrainInfo.TrainTypeName.Zh_tw;
            document.getElementById("Sug"+j+"Start").innerHTML=TableData[i].DailyTrainInfo.StartingStationName.Zh_tw;
            document.getElementById("Sug"+j+"End").innerHTML=TableData[i].DailyTrainInfo.EndingStationName.Zh_tw;
            document.getElementById("Sug"+j+"Original").innerHTML=TableData[i].OriginStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+j+"OriTime").innerHTML=TableData[i].OriginStopTime.DepartureTime;
            document.getElementById("Sug"+j+"Destination").innerHTML=TableData[i].DestinationStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+j+"DesTime").innerHTML=TableData[i].DestinationStopTime.ArrivalTime;
         }
        }
        else
        {
          for(var i=counter-2,j=0;i<=counter+2;i++,j++)
          {
            document.getElementById("Sug"+j+"No").innerHTML=TableData[i].DailyTrainInfo.TrainNo;
            document.getElementById("Sug"+j+"Type").innerHTML=TableData[i].DailyTrainInfo.TrainTypeName.Zh_tw;
            document.getElementById("Sug"+j+"Start").innerHTML=TableData[i].DailyTrainInfo.StartingStationName.Zh_tw;
            document.getElementById("Sug"+j+"End").innerHTML=TableData[i].DailyTrainInfo.EndingStationName.Zh_tw;
            document.getElementById("Sug"+j+"Original").innerHTML=TableData[i].OriginStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+j+"OriTime").innerHTML=TableData[i].OriginStopTime.DepartureTime;
            document.getElementById("Sug"+j+"Destination").innerHTML=TableData[i].DestinationStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+j+"DesTime").innerHTML=TableData[i].DestinationStopTime.ArrivalTime;
          }
        }
        break;
      }
     }
   }
     });
}
function GetTHSRTable()
{
  UserDate=DateToGo;//Assign DateValue
  UserTimeInput=TimeToGo;//Assign TimeValue
  var UserTime= new Date(UserDate+" "+UserTimeInput+":00");
  $.ajax({
   type: 'GET',
   url: "http://ptx.transportdata.tw/MOTC/v2/Rail/THSR/DailyTimetable/OD/"+StartStationId+"/to/"+TerminalStationId+"/"+UserDate+"?$format=json",
   dataType: 'json',
   headers: GetAuthorizationHeader(),
   success: function (data) 
   {
     var TableData = JSON.parse(JSON.stringify(data));
     var temp;
     for(var i=0;i<TableData.length-1;i++)
     {
      for(var j=0;j<TableData.length-1-i;j++)
      { 
        var TransTime1=new Date(UserDate+" "+TableData[j].OriginStopTime.DepartureTime+":00");
        var TransTime2=new Date(UserDate+" "+TableData[j+1].OriginStopTime.DepartureTime+":00");
        if(TransTime1>TransTime2)
        {
          temp=TableData[j];
          TableData[j]=TableData[j+1];
          TableData[j+1]=temp;
        }
      }
     }
     console.log(TableData);
     for(var counter=0;counter<TableData.length;counter++)
     {
      var TrainTime=new Date(UserDate+" "+TableData[counter].OriginStopTime.DepartureTime+":00");
      if(UserTime.getTime()<TrainTime.getTime())
      {
        console.log(counter);
        if(counter===0||counter===1)
        {
          for(var i=0;i<5;i++)
          {
            document.getElementById("Sug"+i+"No").innerHTML=TableData[i].DailyTrainInfo.TrainNo;
            document.getElementById("Sug"+i+"Type").innerHTML="一般/商務";
            document.getElementById("Sug"+i+"Start").innerHTML=TableData[i].DailyTrainInfo.StartingStationName.Zh_tw;
            document.getElementById("Sug"+i+"End").innerHTML=TableData[i].DailyTrainInfo.EndingStationName.Zh_tw;
            document.getElementById("Sug"+i+"Original").innerHTML=TableData[i].OriginStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+i+"OriTime").innerHTML=TableData[i].OriginStopTime.DepartureTime;
            document.getElementById("Sug"+i+"Destination").innerHTML=TableData[i].DestinationStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+i+"DesTime").innerHTML=TableData[i].DestinationStopTime.ArrivalTime;
          }
        }
        else if(counter===TableData.length||counter===TableData.length-1)
        {
         for(var i=TableData.length-5,j=0;i<TableData.length;i++,j++)
         {
            document.getElementById("Sug"+j+"No").innerHTML=TableData[i].DailyTrainInfo.TrainNo;
            document.getElementById("Sug"+j+"Type").innerHTML="一般/商務";
            document.getElementById("Sug"+j+"Start").innerHTML=TableData[i].DailyTrainInfo.StartingStationName.Zh_tw;
            document.getElementById("Sug"+j+"End").innerHTML=TableData[i].DailyTrainInfo.EndingStationName.Zh_tw;
            document.getElementById("Sug"+j+"Original").innerHTML=TableData[i].OriginStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+j+"OriTime").innerHTML=TableData[i].OriginStopTime.DepartureTime;
            document.getElementById("Sug"+j+"Destination").innerHTML=TableData[i].DestinationStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+j+"DesTime").innerHTML=TableData[i].DestinationStopTime.ArrivalTime;
         }
        }
        else
        {
          for(var i=counter-2,j=0;i<=counter+2;i++,j++)
          {
            document.getElementById("Sug"+j+"No").innerHTML=TableData[i].DailyTrainInfo.TrainNo;
            document.getElementById("Sug"+j+"Type").innerHTML="一般/商務";
            document.getElementById("Sug"+j+"Start").innerHTML=TableData[i].DailyTrainInfo.StartingStationName.Zh_tw;
            document.getElementById("Sug"+j+"End").innerHTML=TableData[i].DailyTrainInfo.EndingStationName.Zh_tw;
            document.getElementById("Sug"+j+"Original").innerHTML=TableData[i].OriginStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+j+"OriTime").innerHTML=TableData[i].OriginStopTime.DepartureTime;
            document.getElementById("Sug"+j+"Destination").innerHTML=TableData[i].DestinationStopTime.StationName.Zh_tw;
            document.getElementById("Sug"+j+"DesTime").innerHTML=TableData[i].DestinationStopTime.ArrivalTime;
          }
        }
        break;
      }
     }
   }
     });
}
function GetAuthorizationHeader() {
  var AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
  var AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  var HMAC = ShaObj.getHMAC('B64');
  var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

  return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/}; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}

function TypeChoose(Type)
{
  switch(Type)
  {
    case 'THSR':
    GetTHSRStationData();
    break;
    case 'TRA':
    GetTRAStationData();
    break;
  }
}
TypeChoose("THSR");
