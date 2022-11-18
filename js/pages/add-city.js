async function addNewCityToLocalStorage(newCity) {

    let cities = getCitiesFromLocalStorage();

    const error = document.getElementById('error');
    error.style.display = "none";

    const warning = document.getElementById('warning');
    warning.style.display = "none";

    const success = document.getElementById('success');
    success.style.display = "none";

    if(cities.includes(newCity.toLowerCase())) {
        warning.style.display = "block";

        return 0;
    }

    
    const cityWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=52dce47a7821d13b1c4dfe1c0c73bcd7&units=metric&lang=es`)
    
    if(cityWeather.status === 404) {
        error.style.display = "block";

        return 0;
    }


    cities.push(newCity.toLowerCase());

    localStorage.setItem("CITIES", JSON.stringify(cities));

    success.style.display = "block";

    return 1;
}