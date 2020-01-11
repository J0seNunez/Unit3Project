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
let favRef = catalogAppReference.ref("favs");

//Add Heroku Proxy to avoid cross-origin

//Variable declarations
const nasaApiKey= "w6hW2Elv9bgWGbJfk3dmGj5f7LxLj8I4YtNP8ush";
const nasaUrl = "https://api.nasa.gov/planetary/apod?";
let dynUrl = ""; //Might change to local variable on function getAPOD()
let existingCatalog = [];  //Array to hold the dates included in the database
let datesToDisplay = [];
let favsToDisplay =[];


//Function declarations
//Function to add APOD of a given date to Firebase
function getApod(refDate){
    //Validate refDate
    dynUrl = nasaUrl + "date=" + refDate + "&api_key=" + nasaApiKey;
    console.log(dynUrl);
    //the fetch - then - throw - catch statement is not working!!!!!
    //sorting firebase byChild did not work

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
                //console.log(resJSON);
                resJSON.favor = false;
                let catalogRef = catalogAppReference.ref("readCatalog");
                catalogRef.push(resJSON);
        })
        .catch(error=>{
            
            return Promise.reject();
        })
}

//Call getApod with restricted date string format "YYYY-MM-DD" for search button
let searchAPOD=()=>{
    let bringDate = document.getElementById("dateInput").value;
    callGetAPOD(bringDate);
}

//Call getApod with restricted date string format "YYYY-MM-DD" for any given date
let callGetAPOD=(date)=>{
    sampleDays(date);
    catRef.once("value", function(snapshot){
        snapshot.forEach(ss=>{
            existingCatalog.push(ss.child("date").val());
        });
    }).then(function(dataSnapshot){
        datesToDisplay.forEach(el=>{
            if(!(existingCatalog.includes(el))){
                getApod(el);
                console.log("getApod(" + el + ")");
            }
        });
        catRef.once("value", function(snap){
            apiFeed.innerHTML = "";
            snap.forEach(ss=>{
                if(datesToDisplay.includes(ss.child("date").val())){
                    let feedImageEl = document.createElement("img");
                    feedImageEl.setAttribute("src", ss.child("url").val());
                    feedImageEl.setAttribute("width", 60);
                    feedImageEl.setAttribute("height", 60);
                    //feedImageEl.setAttribute("alt", ss.child("date").val());
                    feedImageEl.onclick = ()=>{
                        onDisplay.innerHTML = "";
                        let titleToDisplay = document.createElement("h2");
                        titleToDisplay.innerHTML = ss.child("title").val();
                        let explanationToDisplay = document.createElement("h6");
                        explanationToDisplay.innerHTML = ss.child("explanation").val();
                        //Validate for favorite
                        let favButton = document.createElement("button");
                        favButton.innerHTML = "Add to favorite images";
                        favButton.style.display = "none"
                        if(!favsToDisplay.find(elem => elem[0] === ss.child("date").val())){
                            favButton.style.display = "block";
                            favButton.onclick = ()=>{
                                favsToDisplay.push([ss.child("date").val(),
                                ss.child("url").val()]);
                                favButton.style.display = "none";
                                favSelection.innerHTML = "";
                                favsToDisplay.forEach(function(thumb){
                                    let favImageEl = document.createElement("img");
                                    favImageEl.setAttribute("src", thumb[1]);
                                    favImageEl.setAttribute("width", 60);
                                    favImageEl.setAttribute("height", 60);
                                    favSelection.appendChild(favImageEl);
                                    unFavButton.style.display = "block";
                                })
                            }
                        }
                        let unFavButton = document.createElement("button");
                        unFavButton.style.display = "none";
                        unFavButton.innerHTML = "Remove from favorite images";
                        if(favsToDisplay.find(elem => elem[0] === ss.child("date").val())){
                            unFavButton.style.display = "block";
                            unFavButton.onclick = ()=>{
                                favsToDisplay.splice(favsToDisplay.indexOf([ss.child("date").val(),
                                ss.child("url").val()]),1);
                                unFavButton.style.display = "none";
                                favSelection.innerHTML = "";
                                favsToDisplay.forEach(function(thumb){
                                    let favImageEl = document.createElement("img");
                                    favImageEl.setAttribute("src", thumb[1]);
                                    favImageEl.setAttribute("width", 60);
                                    favImageEl.setAttribute("height", 60);
                                    favSelection.appendChild(favImageEl);
                                    FavButton.style.display = "block";
                                })
                            }
                        }
                        let imgToDisplay = document.createElement("img");
                        imgToDisplay.setAttribute("src",ss.child("hdurl").val());
                        imgToDisplay.setAttribute("height", 1000);
                        onDisplay.appendChild(favButton);
                        onDisplay.appendChild(unFavButton);
                        onDisplay.appendChild(titleToDisplay);
                        onDisplay.appendChild(explanationToDisplay);
                        onDisplay.appendChild(imgToDisplay);
                    }
                    apiFeed.appendChild(feedImageEl);
                } 
            })
        });
    });
}


//Function to get 14 more valid days before a given date in an array
let sampleDays=(date)=>{
    datesToDisplay=[date];
    for(let i=1; i<15; i++){
        datesToDisplay.push(moment(date).subtract(i, "days").format("YYYY-MM-DD"));
    }
    console.log(datesToDisplay);
}

//Function to get the dates that have been recorded from API in Firebase
//NOT IN USE
let getExistingCatalog=()=>{
    catRef.on("value", function(snapshot){
        snapshot.forEach(ss=>{
            existingCatalog.push(ss.child("date").val());
        })
        console.log(existingCatalog);
    })
}

//Function to create Array from Firebase output
//NOT IN USE
function snapshotToArray(snapshot){
    let returnArr = [];
    snapshot.forEach(function(ss){
        // let item = childSnapshot.val();
        // item.key = childSnapshot.key;
        returnArr.push({date: ss.child("date").val(),
            explanation: ss.child("explanation").val(),
            favor:ss.child("favor").val(),
            hdurl:ss.child("hdurl").val(),
            title:ss.child("title").val(),
            url: ss.child("url").val()
        });
    });
    return returnArr;  
};

//Run script
//Get today's APOD and fill sample thumbnails
let d = moment(new Date()).format("YYYY-MM-DD");
callGetAPOD(d);
