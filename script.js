//Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAY6PNnfnW5FRY3e9DZ_tqmc_IH0fO9sFk",
    authDomain: "fir-josegajavascript01.firebaseapp.com",
    databaseURL: "https://fir-josegajavascript01.firebaseio.com",
    projectId: "firebasejosegajavascript01",
    storageBucket: "firebasejosegajavascript01.appspot.com",
    messagingSenderId: "694400752772",
    appId: "1:694400752772:web:402ae0ce668bf22473f6d1"
  };
firebase.initializeApp(firebaseConfig);
let catalogAppReference = firebase.database();
let catRef = catalogAppReference.ref("readCatalog");

//Variable declarations
const nasaApiKey= "w6hW2Elv9bgWGbJfk3dmGj5f7LxLj8I4YtNP8ush";
const nasaUrl = "https://api.nasa.gov/planetary/apod?";
let dynUrl = ""; //Might change to local variable on function getAPOD()
let existingCatalog = [];
let datesToDisplay = [];

//Get the dates that have been recorded from API in Firebase
catRef.on("value", function(snapshot){
    snapshot.forEach(ss=>{
        existingCatalog.push(ss.child("date").val());
    })
    //console.log(existingCatalog);
})

//Function to add APOD of a given date to Firebase
function getApod(refDate){
    //Validate refDate
    dynUrl = nasaUrl + "date=" + refDate + "&api_key=" + nasaApiKey;
    console.log(dynUrl);
    //the fetch - then - throw - catch statement is not working!!!!!
    fetch(dynUrl).then((res)=> {
            if(!res.ok){
                console.log("error API");
                let auxJSON ={
                    date: refDate,
                    explanation: "API does not contain record",
                    hdurl: "./error.png",
                    title: "File not found",
                    url: "./error.png",
                    favor: false
                }
                let catalogRef = catalogAppReference.ref("readCatalog");
                catalogRef.push(auxJSON);
                throw "error";
            }
            return res.json();
        })
        .then((resJSON)=>{
                console.log(resJSON);
                resJSON.favor = false;
                let catalogRef = catalogAppReference.ref("readCatalog");
                catalogRef.push(resJSON);
        })
        .catch(error=>{
            
            return Promise.reject();
        })
}

//Call getApod with restricted date string format "YYYY-MM-DD"
let searchAPOD=()=>{
    let bringDate = document.getElementById("dateInput").value;
    //console.log(existingCatalog.includes(bringDate));
    sampleDays(bringDate);
    datesToDisplay.forEach(el=>{
        if(!(existingCatalog.includes(el))){
            getApod(el);
        }
    })
}

//Function to get 9 more valid days before a given date in an array
let sampleDays=(date)=>{
    datesToDisplay=[date];
    for(let i=1; i<10; i++){
        datesToDisplay.push(moment(date).subtract(i, "days").format("YYYY-MM-DD"));
    }
    console.log(datesToDisplay);
}