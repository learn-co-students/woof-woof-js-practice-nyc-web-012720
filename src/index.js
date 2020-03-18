document.addEventListener("DOMContentLoaded", () => {
    let PUPS_URL = "http://localhost:3000/pups";
    let goodfilter = false;
    const dogbar = document.querySelector("#dog-bar");
    const doginfo = document.querySelector("#dog-info");
    const dogfilter = document.querySelector("#good-dog-filter");

    const getPups = (pup) => {
        dogbar.innerHTML = "";
        if (pup !== undefined){
            PUPS_URL += `/${pup}`
        }

        fetch(PUPS_URL)
            .then(res => res.json())
            .then(pups => {
                if (goodfilter){
                    pups.forEach(pup => {
                        if (pup.isGoodDog){
                            addToDogBar(pup);
                        }
                    });
                } else {
                    pups.forEach(pup => {
                        addToDogBar(pup);
                    });
                }
            })
            .catch(err => console.log(err));
    };

    const addToDogBar = (pup) => {
        const span = document.createElement('span');
        span.innerText = pup.name;
        dogbar.appendChild(span);

        span.onclick = () => {
            showPup(pup)
        }
    };

    const showPup = (pup) => {
        doginfo.innerHTML = "";
        const img = document.createElement("img");
        img.setAttribute("src", pup.image);
        const h2 = document.createElement("h2");
        h2.innerText = pup.name;
        const btn = document.createElement("button");
        if (pup.isGoodDog){
            btn.innerText = "Good Dog!";
        } else {
            btn.innerText = "Bad Dog!";
        }
        doginfo.appendChild(img);
        doginfo.appendChild(h2);
        doginfo.appendChild(btn);

        btn.onclick = () => {
            updatePup(pup);
        }
    };

    const updatePup = (pup) => {
        const updateObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({isGoodDog: !pup.isGoodDog})
        }
        fetch(`${PUPS_URL}/${pup.id}`, updateObj)
            .then(res => res.json())
            .then(pup => {
                showPup(pup);
            })
            .catch(err => console.log(err));
    };

    const filterPups = () => {
        goodfilter = !goodfilter;
        if (goodfilter){
            dogfilter.innerText = "Filter good dogs: ON";
        } else {
            dogfilter.innerText = "Filter good dogs: OFF";
        }
        getPups();
    };

    getPups();

    dogfilter.onclick = () => {
        filterPups();
    }
});