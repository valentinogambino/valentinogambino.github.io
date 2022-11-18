function getCitiesFromLocalStorage() {
    let cities = localStorage.getItem("CITIES");
    
    if(cities) {
        cities = JSON.parse(cities);
    } else {
        cities = [];
    }

    return cities;
}