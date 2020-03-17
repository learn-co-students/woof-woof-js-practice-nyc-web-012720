document.addEventListener("DOMContentLoaded", function () {
    const barDiv = document.getElementById("dog-bar");
    // const infoDiv = document.getElementById("dog-info");
    const filterDiv = document.getElementById("good-dog-filter");
    let filterOnOff = false;
    let storage;

    fetchDogs();

    function fetchDogs() {
        fetch("http://localhost:3000/pups")
            .then(function (response) {
                return response.json();
            })
            .then(function (dogs) {
                storage = dogs;
                return displayDogs(dogs);
            });
    }

    document.addEventListener("click", function (event) {

        if (event.target.className === "span-dog") {
            return fetchSingleDog(event);
        } else if (event.target.className === "dog-button") {
            return fechUpdateDog(event);
        } else if (event.target === filterDiv) {
            if (!filterOnOff) {
                filterOnOff = true;
                event.target.innerText = "Filter good dogs: ON";
                return filterDogs();
            } else {
                filterOnOff = false;
                event.target.innerText = "Filter good dogs: OFF";
                return fetchDogs();
            }
        }
    });
    // filterDiv.addEventListener("click", function (event) {
    //     if (filterOnOff) {
    //         filterOnOff = false;
    //         return event.target.innerText = "Filter good dogs: OFF";
    //     } else {
    //         filterOnOff = true;
    //         event.target.innerText = "Filter good dogs: ON";
    //         return filterDogs();
    //     }
    // });

    // infoDiv.addEventListener("click", function (event) {
    //     return fechUpdateDog(event);
    // });

    // barDiv.addEventListener("click", function (event) {
    //     return fetchSingleDog(event);
    // });

    function displayDogs(dogs) {
        barDiv.innerHTML = "";
        dogs.forEach(function (dog) {
            barDiv.innerHTML += `<span data-id=${dog.id} class="span-dog">${dog.name}</span>`;
        });
    }

    function displaySingleDog(dog) {
        let infoDiv = document.getElementById("dog-info");
        infoDiv.innerHTML = `
            <img src=${dog.image}> 
            <h2>${dog.name}</h2>
            <button id=${dog.id} class="dog-button">${!!dog.isGoodDog ? "Good " : "Bad"} Dog!</button>`;
    }

    function fetchSingleDog(tag) {
        fetch(`http://localhost:3000/pups/${tag.target.dataset.id}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                return displaySingleDog(data);
            });
    }

    function fechUpdateDog(tag) {
        let newValue = false;

        tag.target.innerText.charAt(0) === "G" ? newValue : newValue = true;
        fetch(`http://localhost:3000/pups/${tag.target.id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({ 'isGoodDog': newValue })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (dog) {
                console.log("Update done!");
                return displaySingleDog(dog);
            });
    }

    function filterDogs() {
        barDiv.innerHTML = "";
        return storage.forEach(function (dog) {
            if (!!dog.isGoodDog) {
                console.log(dog.isGoodDog);
                barDiv.innerHTML += `<span data-id=${dog.id} class="span-dog">${dog.name}</span>`;
            }
        });
    }
})