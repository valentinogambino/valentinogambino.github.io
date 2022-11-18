function main() {

    const select = document.getElementById('select-city');
    let cities = getCitiesFromLocalStorage();

    if (!cities.length) {
        const empty = document.createElement("option");
        empty.text = "Debes agregar ciudad/es";
        empty.setAttribute('disabled', '');
        empty.setAttribute('selected', '');
        select.add(empty)

    } else {
        const selectCity = document.createElement("option");
        selectCity.text = "Seleccionar ciudad";
        selectCity.setAttribute('disabled', '');
        selectCity.setAttribute('selected', '');
        
        let counter = 2;

        for (city of cities) {
            const options = document.createElement("option");
            options.text = city;
            options.setAttribute('value', city);
            select.add(options, counter);
            counter++;
        }
    
        select.add(selectCity);
    }
}


async function weather() {

    const infoCard = document.getElementById('info-card');
    infoCard.style.display = "none";

    const select = document.getElementById("select-city");
    const selectedCity = select.options[select.selectedIndex].value;

    const weather = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=52dce47a7821d13b1c4dfe1c0c73bcd7&units=metric&lang=es`)
                .then(response => response.json())
                .then(data => {
                    
                    const cityN = document.getElementById('city');
                    const cityT = document.getElementById('temp');
                    const cityST = document.getElementById('st');
                    const cityH = document.getElementById('humedad');
                    const cityV = document.getElementById('viento');
                    const cityP = document.getElementById('presion');
                    
                    cityN.innerHTML = data.name;
                    cityT.innerHTML = `Temperatura: ${data.main.temp}°`;
                    cityST.innerHTML = `Sensación térmica: ${data.main.feels_like}°`;
                    cityH.innerHTML = `Humedad: ${data.main.humidity}%`;
                    cityV.innerHTML = `Velocidad del viento: ${data.wind.speed}km/h`;
                    cityP.innerHTML = `Presión: ${data.main.pressure}hPa`;
    
                    infoCard.style.display = "block";

                })
}

main ();