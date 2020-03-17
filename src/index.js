
document.addEventListener('DOMContentLoaded', (event) => {
    const dogBar = document.getElementById("dog-bar")
    const dogInfo = document.getElementById("dog-info")
    let allDogs = []

    fetch('http://localhost:3000/pups')
    .then(function(response){
        return response.json()
    })
    .then(function(dogs){
        dogs.forEach(dog => {
            allDogs.push(dog)
            dogBar.innerHTML += `<span class='doggers' id= ${dog.id}> ${dog.name} </span>`
        });
    })
    dogBar.addEventListener('click', (event) => {
        dogInfo.innerHTML = `
        <img src=${allDogs[event.target.id - 1].image}> 
        <h2> ${allDogs[event.target.id - 1].name} </h2> 
        <button id = "button">Good Dog!</button>
        `
        currentDog = allDogs[event.target.id - 1]
        const button = document.getElementById("button")
        button.addEventListener('click', (event) => {
            if (button.innerHTML === "Good Dog!") {
                button.innerHTML = "Very Good Dog!",
                fetch(`http://localhost:3000/pups/${currentDog.id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    isGoodDog: false
                  })
                })
                .then(response => response.json())
                .then(console.log)
              } else {
                button.innerHTML = "Good Dog!",
                fetch(`http://localhost:3000/pups/${currentDog.id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    isGoodDog: true
                  })
                })
                .then(response => response.json())
                .then(console.log)
            }

        })
    })
    
});

