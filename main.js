const database = firebase.database();
var addTrainForm = document.getElementById("addTrainForm");
addTrainForm.addEventListener("submit", createTrainSchedule);
//Shape of data sent from "form"
var sampleData = {
    trainName : "Flex Train",
    destinationName: "Oakland",
    firstTrainTime: "8:49 PM",
    frequencyTime: 22
};
//Creating schuedule of trains
function createTrainSchedule(event){
    //event.preventDefault();
    var validResponse = true;
    var sampleData = {
        trainName : $("#trainName").val().trim(),
        destinationName: $("#destinationName").val().trim(),
        firstTrainTime: $("#firstTrainTime").val().trim(),
        frequencyTime: $("#frequencyTime").val().trim()
    };
    console.log(sampleData);
    for(let prop in sampleData){
        if(sampleData[prop] === ""){
            validResponse = false;
            break;
        }
    }
    if(validResponse){ /*if all forms are filled*/
        database.ref("id"+Date.now()).set(sampleData);
    }
}
//Displays upadted train schedule
database.ref().once("value").then(function(snapshot){
  console.log(snapshot.val());


  var trainScheduleElement =  document.getElementById("trainSchedule");

  // $("#trainSchedule").append(JSON.stringify(snapshot.val()));
  for (let key in snapshot.val()){
    console.log("NOW: ", Date.now());
    var startTime = new Date("1970-01-01T"+snapshot.val()[key].firstTrainTime+":00").getTime();
    // time since first train
    var timeSpan = Date.now() - startTime;
    console.log(timeSpan);
    // find previous train
    var prevTrain = Date.now() - (timeSpan % snapshot.val()[key].frequencyTime*60000);
    console.log("prev: ", prevTrain);
    var nextTrain = prevTrain + snapshot.val()[key].frequencyTime *60000;
    var minutesAway = (nextTrain - Date.now())/60000;
    console.log(new Date(nextTrain));
    // Next Arrival
    
    
    // Minutes Away
    
    var tR = $("<tr></tr>");
    $(tR).append($(`<td>${snapshot.val()[key].trainName}</td>`))
    $(tR).append($(`<td>${snapshot.val()[key].destinationName}</td>`))
    $(tR).append($(`<td>${snapshot.val()[key].frequencyTime}</td>`))
    $(tR).append($(`<td>${new Date(nextTrain).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>`));
    $(tR).append($(`<td>${Math.ceil(minutesAway)}</td>`));


    $("#trainSchedule table").append(tR);
  }
})
