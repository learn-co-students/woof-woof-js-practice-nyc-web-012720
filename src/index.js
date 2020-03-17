document.addEventListener('DOMContentLoaded', () => {
	loadDogCards()
	document.addEventListener('click', event => {
		if (event.target.className === 'dog-card') {
			console.log(event.target)
			getDogInfo(event)
		}

		if (event.target.className === 'good-bad-button') {
			toggleGood(event)
		}

		if (event.target.id === 'good-dog-filter') {
			if (event.target.textContent === 'Filter good dogs: OFF') {
				removeDogCards()
				loadDogCards()
				event.target.textContent = 'Filter good dogs: ON'
			} else if (event.target.textContent === 'Filter good dogs: ON') {
				removeDogCards()
				loadGoodDogCards()
				event.target.textContent = 'Filter good dogs: OFF'
			}
		}
	})
})

function loadDogCards() {
	fetch('http://localhost:3000/pups')
		.then(response => {
			return response.json()
		})
		.then(result => {
			console.log(result)
			result.forEach(dog => {
				makeDogCard(dog)
			})
		})
}

function loadGoodDogCards() {
	fetch('http://localhost:3000/pups')
		.then(response => {
			return response.json()
		})
		.then(result => {
			console.log(result)
			result.forEach(dog => {
				if (dog.isGoodDog === true) makeDogCard(dog)
			})
		})
}

function removeDogCards() {
	const dogCards = document.querySelectorAll('.dog-card')
	dogCards.forEach(element => {
		element.remove()
	})
}

function makeDogCard(dog) {
	const dogBar = document.querySelector('#dog-bar')
	const dogSpan = document.createElement('span')
	dogSpan.dataset.id = dog.id
	dogSpan.className = 'dog-card'
	dogSpan.textContent = dog.name
	dogBar.append(dogSpan)
}

function getDogInfo(event) {
	const dogID = event.target.dataset.id
	fetch(`http://localhost:3000/pups/${dogID}`)
		.then(response => {
			return response.json()
		})
		.then(result => {
			console.log(result)
			showDogInfo(result)
		})
}

function showDogInfo(dog) {
	const dogInfoBox = document.querySelector('#dog-info')
	if (dog.isGoodDog === true) {
		dogInfoBox.dataset.id = dog.id
		dogInfoBox.innerHTML = `
    <img src=${dog.image}>
    <h2>${dog.name}</h2>
    <button class="good-bad-button">Good Dog!</button>
    `
	}

	if (dog.isGoodDog === false) {
		dogInfoBox.dataset.id = dog.id
		dogInfoBox.innerHTML = `
        <img src=${dog.image}>
        <h2>${dog.name}</h2>
        <button class="good-bad-button">Bad Dog!</button>
        `
	}
}

function toggleGood(event) {
	let currentGoodBad = true
	if (event.target.textContent === 'Good Dog!') {
		currentGoodBad = true
	}

	if (event.target.textContent === 'Bad Dog!') {
		currentGoodBad = false
	}

	const configObject = {
		method: 'PATCH',
		headers: {
			'content-type': 'application/json',
			accept: 'application/json'
		},
		body: JSON.stringify({isGoodDog: !currentGoodBad})
	}
	const dogID = event.target.parentNode.dataset.id
	fetch(`http://localhost:3000/pups/${dogID}`, configObject)
		.then(response => {
			return response.json()
		})
		.then(result => {
			showDogInfo(result)
		})
}
