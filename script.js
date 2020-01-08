// insert firebase deployment url

//Initialize Firebase
//

const nasaApiKey= "w6hW2Elv9bgWGbJfk3dmGj5f7LxLj8I4YtNP8ush";
const nasaUrl = "https://api.nasa.gov/planetary/apod?";
let dynUrl = "";

function getApod(refDate){
    //Validate refDate
    dynUrl = nasaUrl + "date=" + refDate + "&api_key=" + nasaApiKey;
    console.log(dynUrl);
}

//Call getApod with restricted date string format "YYYY-MM-DD"
let searchAPOD=()=>{
 getApod("1995-06-16");
}
