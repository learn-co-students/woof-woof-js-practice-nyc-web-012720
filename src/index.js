let dogURL = "http://localhost:3000/pups"

document.addEventListener("DOMContentLoaded", function(){
    dogBarDiv = document.getElementById('dog-bar')
    selectedDogDiv = document.getElementById('dog-info')
    filterButton = document.getElementById('good-dog-filter')
    fetchDogTiles()
    addSpanEventListener()
    addFilterListener()
})

function fetchDogTiles(){
    dogBarDiv.innerHTML = ``
    fetch(dogURL)
    .then(resp => resp.json())
    .then(dogsJson => dogsJson.forEach(dog => {
        if (filterButton.innerText === "Filter good dogs: ON" && dog.isGoodDog){
            renderDogTile(dog)
        } else if (filterButton.innerText === "Filter good dogs: OFF") {
        renderDogTile(dog)
    }}
    ))
}

function renderDogTile(dogJson){
    let span = document.createElement('span')
    span.dataset.id = dogJson.id
    span.innerText = dogJson.name
    dogBarDiv.append(span)
}

function addSpanEventListener(){
    dogBarDiv.addEventListener("click", function(event){
        let dogId = event.target.dataset.id
        fetch(dogURL + `/${dogId}`)
        .then(resp => resp.json())
        .then(json => renderDogInfo(json))
    })
}

function renderDogInfo(dogInfoJson){
    selectedDogDiv.dataset.id = dogInfoJson.id
    selectedDogDiv.innerHTML = `
        <img src=${dogInfoJson.image}>
        <h2>${dogInfoJson.name}</h2>
        <button>Good Dog!</button>
        `
    let goodDogButton = selectedDogDiv.getElementsByTagName('button')[0]
    if (dogInfoJson.isGoodDog === false){
        goodDogButton.innerText = "Bad Dog!"
    }
    goodDogButton.addEventListener('click', function(event){
        let dogId = event.target.parentNode.dataset.id
        let newGoodnessStatus
        if (event.target.innerText === "Good Dog!"){
            newGoodnessStatus = false
            event.target.innerText = "Bad Dog!"
            
        } else if (event.target.innerText === "Bad Dog!"){
            newGoodnessStatus = true
            event.target.innerText = "Good Dog!"
        }
        toggleDogGoodness(dogId, newGoodnessStatus)
    })
}

function toggleDogGoodness(dogId, boolean){
    fetch(dogURL + `/${dogId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({isGoodDog: boolean})
    })
}

function addFilterListener(){
    filterButton.addEventListener('click', function(){
        if (filterButton.innerText === "Filter good dogs: OFF"){
            console.log("success")
            filterButton.innerText = "Filter good dogs: ON"
            fetchDogTiles()
            } else if (filterButton.innerText === "Filter good dogs: ON"){
                filterButton.innerText = "Filter good dogs: OFF"
                fetchDogTiles()
            }
    })
}