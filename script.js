const firebaseConfig = {
    apiKey: "AIzaSyAY6PNnfnW5FRY3e9DZ_tqmc_IH0fO9sFk",
    authDomain: "fir-josegajavascript01.firebaseapp.com",
    databaseURL: "https://fir-josegajavascript01.firebaseio.com",
    projectId: "firebasejosegajavascript01",
    storageBucket: "firebasejosegajavascript01.appspot.com",
    messagingSenderId: "694400752772",
    appId: "1:694400752772:web:402ae0ce668bf22473f6d1"
  };

  // insert firebase deployment url
//Initialize Firebase
firebase.initializeApp(firebaseConfig);
let catalogAppReference = firebase.database();
console.log(catalogAppReference);

const nasaApiKey= "w6hW2Elv9bgWGbJfk3dmGj5f7LxLj8I4YtNP8ush";
const nasaUrl = "https://api.nasa.gov/planetary/apod?";
let dynUrl = "";

function getApod(refDate){
    //Validate refDate
    dynUrl = nasaUrl + "date=" + refDate + "&api_key=" + nasaApiKey;
    console.log(dynUrl);
    fetch(dynUrl).then((res)=> {return res.json();}).then((resJSON)=>{
        console.log(resJSON);
        let auxRecord = resJSON;
        auxRecord.favor = false;
        let catalogRef = catalogAppReference.ref("readCatalog");
        console.log(auxRecord);
        catalogRef.push(auxRecord);
    })
}

//Call getApod with restricted date string format "YYYY-MM-DD"
let searchAPOD=()=>{
 getApod("1995-06-16");
}
