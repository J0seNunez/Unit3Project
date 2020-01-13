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
//Add styling
//Add API promise completion (search button has to be clicked twice in order to get the newly fetched urls)
//Host on Heroku
//Find out what to do when links are videos

//Variable declarations
const nasaApiKey= "w6hW2Elv9bgWGbJfk3dmGj5f7LxLj8I4YtNP8ush";
const nasaUrl = "https://api.nasa.gov/planetary/apod?";
let dynUrl = ""; //Might change to local variable on function getAPOD()
let existingCatalog = [];  //Array to hold the dates included in the database
let datesToDisplay = [];
let favsToDisplay = [];


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
                }
                catRef.push(auxJSON);
                throw "error";
            }
            return res.json();
        })
        .then((resJSON)=>{
                catRef.push(resJSON);
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
        //Manage favsToDisplay from firebase "favs"

        favRef.on("value",function(favsnapshot){
            favsToDisplay = [];
            let dataFromFirebase = favsnapshot.val();
            for(let ky in dataFromFirebase){
                favsToDisplay.push([
                    dataFromFirebase[ky].date,          //1=date
                    dataFromFirebase[ky].explanation,   //2=explanation
                    dataFromFirebase[ky].hdurl,         //3=hdurl
                    dataFromFirebase[ky].title,         //4=title
                    dataFromFirebase[ky].url            //5=url
                ])
            }
            console.log(favsToDisplay);
            favSelection.innerHTML = "";
            favsnapshot.forEach(fs=>{
                let favImageEl = document.createElement("img");
                favImageEl.setAttribute("src", fs.child("url").val());
                favImageEl.setAttribute("width", 60);
                favImageEl.setAttribute("height", 60);
                favSelection.appendChild(favImageEl);
                favImageEl.onclick = ()=>{
                    onDisplay.innerHTML = "";
                    let titleToDisplay = document.createElement("h2");
                    titleToDisplay.innerHTML = fs.child("title").val();
                    let explanationToDisplay = document.createElement("h6");
                    explanationToDisplay.innerHTML = fs.child("explanation").val();
                    let unFavButton = document.createElement("button");
                    unFavButton.style.display = "block";
                    unFavButton.innerHTML = "Remove from favorite images";
                    unFavButton.onclick = ()=>{
                        let favToRemove = catalogAppReference.ref("favs/"+ fs.key);
                        favToRemove.remove();
                        unFavButton.style.display = "none";
                    }
                    let imgToDisplay = document.createElement("img");
                    imgToDisplay.setAttribute("src",fs.child("hdurl").val());
                    imgToDisplay.setAttribute("height", 1000);
                    onDisplay.appendChild(unFavButton);
                    onDisplay.appendChild(titleToDisplay);
                    onDisplay.appendChild(explanationToDisplay);
                    onDisplay.appendChild(imgToDisplay);
                }           
            })
        })
        
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
                        let favButton = document.createElement("button");
                        favButton.innerHTML = "Add to favorite images";
                        favButton.style.display = "none"
                        if(!favsToDisplay.find(elem => elem[1] === ss.child("date").val())){
                            favButton.style.display = "block";
                            favButton.onclick = ()=>{
                                favRef.push({
                                    date:ss.child("date").val(),
                                    explanation:ss.child("explanation").val(),
                                    hdurl:ss.child("hdurl").val(),
                                    title:ss.child("title").val(),
                                    url:ss.child("url").val(),
                                });
                                favButton.style.display = "none";
                            }
                        }   //favorited items clicked on the main feed wont show unFavButton                     

                        let imgToDisplay = document.createElement("img");
                        imgToDisplay.setAttribute("src",ss.child("hdurl").val());
                        imgToDisplay.setAttribute("height", 1000);
                        onDisplay.appendChild(favButton);
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

//Run script
//Get today's APOD and fill sample thumbnails
let d = moment(new Date()).format("YYYY-MM-DD");
callGetAPOD(d);
