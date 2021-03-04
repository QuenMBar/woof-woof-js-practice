let filter = false;
document.addEventListener("DOMContentLoaded", () => {
    fetchAndPopList();

    document.getElementById("good-dog-filter").addEventListener("click", (e) => {
        if (e.target.innerHTML === "Filter good dogs: OFF") {
            e.target.innerHTML = "Filter good dogs: ON";
            filter = true;
            fetchAndPopList();
        } else {
            e.target.innerHTML = "Filter good dogs: OFF";
            filter = false;
            fetchAndPopList();
        }
    });
});

function fetchAndPopList() {
    const dogList = document.getElementById("dog-bar");
    dogList.innerHTML = "";
    fetch("http://localhost:3000/pups")
        .then((response) => {
            return response.json();
        })
        .then((dogData) => {
            dogData.forEach((dog) => {
                let newDogSpan = document.createElement("span");
                newDogSpan.append(dog.name);
                newDogSpan.id = dog.id;
                newDogSpan.addEventListener("click", (e) => {
                    const dogInfoDiv = document.getElementById("dog-info");
                    dogInfoDiv.innerHTML = "";
                    fetch(`http://localhost:3000/pups/${e.target.id}`)
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            // console.log(data);
                            let dogImg = document.createElement("img");
                            dogImg.src = data.image;

                            let dogName = document.createElement("h2");
                            dogName.append(data.name);

                            let dogGoodBadBttn = document.createElement("button");
                            dogGoodBadBttn.id = data.id;
                            if (data.isGoodDog) {
                                dogGoodBadBttn.innerHTML = "Good Dog!";
                            } else {
                                dogGoodBadBttn.innerHTML = "Bad Dog!";
                            }
                            dogGoodBadBttn.addEventListener("click", (e) => {
                                if (e.target.innerHTML === "Good Dog!") {
                                    let dataObj = {
                                        isGoodDog: false,
                                    };
                                    let postObj = {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Accept": "application/json",
                                        },
                                        body: JSON.stringify(dataObj),
                                    };
                                    fetch(`http://localhost:3000/pups/${e.target.id}`, postObj).then((response) => {
                                        e.target.innerHTML = "Bad Dog!";
                                        if (filter) {
                                            fetchAndPopList();
                                        }
                                    });
                                } else {
                                    let dataObj = {
                                        isGoodDog: true,
                                    };
                                    let postObj = {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Accept": "application/json",
                                        },
                                        body: JSON.stringify(dataObj),
                                    };
                                    fetch(`http://localhost:3000/pups/${e.target.id}`, postObj).then((response) => {
                                        e.target.innerHTML = "Good Dog!";
                                        if (filter) {
                                            fetchAndPopList();
                                        }
                                    });
                                }
                            });

                            dogInfoDiv.append(dogImg, dogName, dogGoodBadBttn);
                        });
                });
                if (!filter) {
                    dogList.append(newDogSpan);
                } else {
                    if (dog.isGoodDog) {
                        dogList.append(newDogSpan);
                    }
                }
            });
        });
}
