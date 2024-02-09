const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location");
const searchForm = document.querySelector("[data-searcForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorFound = document.querySelector("[error-found]");

let currentTab = userTab;
const API_Key = "3dec6d659e1ea3384d037da7b860c970";
currentTab.classList.add("current-tab")
getLocation();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        errorFound.classList.remove("active");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    errorFound.classList.remove("active");
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    errorFound.classList.remove("active");
    switchTab(searchTab);
})


function getFromSessionStorage(){

    const localCordinates = sessionStorage.getItem("user-cordinates");
    if(!localCordinates){
        grantAccessContainer.classList.add("active")
    }
    else{
        const cordinates = JSON.parse(localCordinates);
        fetchUserWeatherInfo(cordinates);
    }
}

async function  fetchUserWeatherInfo(cordinates){
    const {lat,lon} = cordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    errorFound.classList.remove("active");

    try {
        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${API_Key}`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        // todo handle it
        console.log("cityname");
        errorFound.classList.add("active");
    }
}

function renderWeatherInfo(data){
    const cityName = document.querySelector(".data-cityName");
    const countryFlag = document.querySelector("[data-countryFlag]");
    const weatherDesc = document.querySelector(".data-weatherDesc");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");
    const visibility = document.querySelector("[data-Visibility]");
    const pressure = document.querySelector("[data-airPressure]");

    cityName.innerHTML = data?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerHTML = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    temp.innerHTML = `${data?.main?.temp} °C`;
    windSpeed.innerHTML = `${data?.wind?.speed} m/s`;
    humidity.innerHTML = `${data?.main?.humidity}%`;
    clouds.innerHTML = `${data?.clouds?.all}%`;
    visibility.innerHTML = `${(data?.visibility)/1000} k/m`;
    pressure.innerHTML = `${data?.main?.pressure} hPa`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        grantAccessContainer.classList.remove("active");
        // todo-show an elert
        console.log("geolocation");

        errorFound.classList.add("active");
    }
}

function showPosition(position){
    const usercoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    // console.log(usercoordinates);

    sessionStorage.setItem("user-cordinates",JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);



const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

searchInput.addEventListener('click',()=>{
    errorFound.classList.remove("active");
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");
    errorFound.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${API_Key}`);
        const data = await response.json();

        if (response.ok) {
            // If the response is OK, display weather information
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            // If the response is not OK, city not found, show error image
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorFound.classList.add("active");
        }
    } catch (error) {
        // Handle other errors
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errorFound.classList.add("active");
    }
}




// function apiResponse(cityName) {

//     return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=3dec6d659e1ea3384d037da7b860c970`)
//         .then((response) => {
//            return response.json();
//         }).catch((err) => {
//             console.log("error: ", err);
//         })
// }


// async function getdata() {
//     const cityNameInput = document.getElementById('cityname');
//     const cityName = cityNameInput.value;
//     // console.log(cityName);
//     try {
//         const data = await apiResponse(cityName);
//         const temp = data.main.temp;
//         const pressure = data.main.pressure;
//         const humidity = data.main.humidity;
//         const windSpeed = data.wind.speed;
//         const city = data.name;
//         const clouds = data.clouds.all;
//         const visibility = (data.visibility) / 1000;
//         const description = data.weather[0].description;

//         // console.log(data);

//         console.log(`City: ${city}`);
//         console.log(`Temperature: ${temp}`);
//         console.log(`Pressure: ${pressure}`);
//         console.log(`Humidity: ${humidity}`);
//         console.log(`Wind Speed: ${windSpeed}`);
//         console.log(`Clouds: ${clouds}`);
//         console.log(`Visibility: ${visibility}`);
//         console.log(`Description: ${description}`);
    
//         // const dataContainer  = document.getElementById('data');
//         // dataContainer.innerHTML = `city:${city}<br>Temperature:${temp}<br>Pressure:${pressure}<br>Humidity:${humidity}<br>Wind Speed:${windSpeed}<br>Clouds:${clouds}<br>Visibility:${visibility}`

//         let cityData = document.getElementById('city');
//         let descriptionData = document.getElementById('description');
//         let tempData = document.getElementById('temp');
//         let windData = document.getElementById('wind');
//         let humadityData = document.getElementById('humidity');
//         let cloudsData = document.getElementById('clouds');
//         let visibilityData = document.getElementById('visibility');
//         let pressureData = document.getElementById('pressure');

//         cityData.innerHTML = city;
//         descriptionData.innerHTML = description;
//         tempData.innerHTML = temp;
//         windData.innerHTML = windSpeed;
//         cloudsData.innerHTML = clouds;
//         visibilityData.innerHTML = visibility;
//         pressureData.innerHTML = pressure;
//         humadityData.innerHTML = humidity;

//         cityNameInput.value = "";
    
//     } catch (error) {
//         console.log("error: ", error);
//         throw error;
//     }
   
// }


// const x = document.getElementById("demo");

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }

// function showPosition(position) {
//   x.innerHTML = "Latitude: " + position.coords.latitude +
//   "<br>Longitude: " + position.coords.longitude;
// }

// getLocation()