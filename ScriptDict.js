//getting all the references 
const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
volume = wrapper.querySelector(".word i"),
infoText = wrapper.querySelector(".info-text"),
synonyms = wrapper.querySelector(".synonyms .list"),
removeIcon = wrapper.querySelector(".search span");
let audio;

function data(result, word){ // data function 
    if(result.title){ // if api returns the message of "can't find word"
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }else{
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
        phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;

        //let's pass particular response data to a particular html element
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
        audio = new Audio(result[0].phonetics[0].audio);  //creating new audio object and passing audio src in it

        if(definitions.synonyms[0] == undefined){  // hide synonyms if not present
            synonyms.parentElement.style.display = "none";
        }else{
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) { // getting only 5 synonyms from out of many 
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
                synonyms.insertAdjacentHTML("beforeend", tag);   // passing all 5 synonyms inside synonyms div
            }
        }
    }
}

function search(word) {  //search the synonym of that word to know its details 
    searchInput.value = word;
    fetchApi(word); 
    wrapper.classList.remove('active');
}

function fetchApi(word){   // fetch api function 
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    //fetching api response and returning it with parsing into js object and in another then
    //method calling data function with passing api response and searched word as an argument
    fetch(url)
    .then(response => response.json())
    .then(result => data(result, word))
    .catch(() =>{
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

searchInput.addEventListener("keyup", e => { //when the key "enter" is pressed then only search the targeted value i.e word 
    if(e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
});

volume.addEventListener("click", ()=>{ //make audio listen the pronounciation of that word 
    volume.style.color = "#4D59FB";
    audio.play();
    setTimeout(() =>{
        volume.style.color = "#999";
    }, 800);
});

removeIcon.addEventListener("click", () => { //clear the searched input 
    searchInput.value = "";
    searchInput.focus(); 
    wrapper.classList.remove('active');
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML = "Type a word and press enter to see its meaning, example, synonyms and pronounciation.";
});

