const appWrapper = document.querySelector('.wrapper');
const inputSection = document.querySelector('.input-part');
const infoText = document.querySelector('.info-txt');
const inputField = document.querySelector('input');
const locationButton = document.querySelector('button');


let api;
inputField.addEventListener('keyup',(e)=>{
    
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationButton.addEventListener('click',()=>{
    if(navigator.geolocation){ //if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert('Your browser not support geolocation api');
    }
});

function onSuccess(position){
    const {latitude,longitude} = position.coords; //getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    fetchData()
}

function onError(error){
    infoText.innerText = error.message;
    infoText.classList.add('error');
}

let apiKey = '5b0e5713c670328b6c135f95972379a8';

function requestApi(city){
        api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
       fetchData()
}

function fetchData(){
        infoText.innerText= 'Getting Weather Details....';
        infoText.classList.add('pending')
        fetch(api).then(response=>response.json()).then(result=> weatherDetails(result));
}

function weatherDetails(info){
    infoText.classList.replace('pending','error');
    if(info.cod == '404'){
        infoText.innerHTML = `${inputField.value} isn't a valid city name!`
    }else{
        //let's get required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        //let's pass these values to a particular html element
        appWrapper.querySelector('.temp .numb').innerText = Math.round(temp);
        appWrapper.querySelector('.weather').innerText = description;
        appWrapper.querySelector('.location span').innerText = `${city},${country}`;
        appWrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
        appWrapper.querySelector('.humidity span').innerText = `${humidity}%`;

        infoText.classList.remove('pending','error');
        appWrapper.classList.add('active');
        console.log(info); 
    }
}