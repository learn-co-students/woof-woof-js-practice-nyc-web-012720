
document.addEventListener('DOMContentLoaded', function(event) {
    let dogBar = document.getElementById('dog-bar')
    let dogInfo = document.getElementById('dog-info')
    let dogFilter = document.getElementById('good-dog-filter')
    let dogImage = document.createElement('img')
    let dogName = document.createElement('h2')
    let goodOrBad = document.createElement('button')
    goodOrBad.className = 'good-or-bad'
    showAllDogs()
    
    function showAllDogs() {
        fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(data => {
            data.map(dog => {
                let span = document.createElement('span')
                span.innerText = dog.name
                span.className = 'dog'
                span.dataset.number = dog.id
                dogBar.append(span)
            })
        })
    }
    
    function dogProfileMaker(dog){
        dogImage.src = dog.image
        dogName.innerText = dog.name
        dog.isGoodDog ? goodOrBad.innerText = "Good Dog!" : goodOrBad.innerText = "Bad Dog!"
        dogInfo.dataset.number = dog.id
        dogInfo.append(dogImage, dogName, goodOrBad)
        return dogInfo
    }

    function goodOrBadSwitch(dogId, statusChange){
        fetch(`http://localhost:3000/pups/${dogId}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }, 
            body: JSON.stringify({isGoodDog: statusChange})
        })
    }
    
    function dogFetcher(dogId){
        return fetch(`http://localhost:3000/pups/${dogId}`)
        .then(response => response.json())
        .then(data => {dogProfileMaker(data)})
    }

    dogBar.addEventListener('click', function(event) {
        if (event.target.className === 'dog') {
            dogInfo.innerHTML = ""
            dogFetcher(event.target.dataset.number)
        }
    })

    dogInfo.addEventListener('click', function(event) {
        if (event.target.classList.contains('good-or-bad')) {
            let dogId = event.target.parentNode.dataset.number
            if (event.target.innerText === "Good Dog!"){
                goodOrBadSwitch(dogId, false)
                goodOrBad.innerHTML = "Bad Dog!"
            } else if (event.target.innerText === "Bad Dog!"){
                goodOrBadSwitch(dogId, true)
                goodOrBad.innerHTML = "Good Dog!"
            }
        }
    })

    dogFilter.addEventListener('click', function(event) {
        if (event.target.innerText === 'Filter good dogs: OFF') {
            event.target.innerText = 'Filter good dogs: ON'
            dogBar.innerHTML = ''
            fetch('http://localhost:3000/pups')
            .then(response => response.json())
            .then(data => {
                let goodDogs = data.filter(dog => { 
                    return dog.isGoodDog === true 
                })
                goodDogs.map(dog => {
                    let span = document.createElement('span')
                    span.innerText = dog.name
                    span.className = 'dog'
                    span.dataset.number = dog.id
                    dogBar.append(span)
                })
            })
        } else if (event.target.innerText === 'Filter good dogs: ON') {
            event.target.innerText = 'Filter good dogs: OFF'
            dogBar.innerHTML = ''
            showAllDogs()
        } 
    })

})
