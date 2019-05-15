let baseURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/"
let apiKey = '9ee4eba2-c998-4dbb-a2ea-877712953d20'
const dictionaryWordID = document.getElementById('dictionaryWord')
const dictionarySyllablesID = document.getElementById('dictionarySyllables')
const shortDefinitionID = document.getElementById('shortDefinition')
const searchTerm = document.querySelector('.search')
const dictionarySection = document.getElementById('dictionary')
const soundButton = document.getElementById('sound-button')
const shortDefHeader = document.getElementById('header-short-def')

let mySound = ""
let baseSoundURL = "https://media.merriam-webster.com/soundc11/"
let toggle = true

let numberOfButtons = document.querySelectorAll(".btn").length
for (i = 0; i < numberOfButtons; i++) {
    document.querySelectorAll(".btn")[i].addEventListener("click", function (e) {
        let buttonPressed = e.target.innerText;
        whichButton(buttonPressed)
    })
}

document.querySelector('.search').addEventListener("keydown", e => {
    if (e.key == "Escape") {

        if (toggle == true) {
            toggle = false
            makeVisible()
        } else {
            toggle = true
            makeHidden()
        }
    }

    if (e.key == "Enter" && searchTerm.value !== "") {

        //Resetting the Dictionary Section when a new search is conducted
        makeHidden()

        let longURL = baseURL + searchTerm.value + "?key=" + apiKey

        fetchNewWord(longURL)

    }

})

function whichButton(buttonPressed) {
    console.log(buttonPressed)

    switch (buttonPressed) {

        case "Dictionary Search":

            //Resetting the Dictionary Section when a new search is conducted
            makeHidden()


            let longURL = baseURL + searchTerm.value + "?key=" + apiKey


            if (searchTerm.value !== "") { // Making sure we are not Fetching if it is blank

                fetchNewWord(longURL)

            } else {
                alert("Search field is blank")
            }
            break

        case "Hear How the Word Sounds":

            let playSound = new Audio(mySound)
            playSound.play()


            break


        default:
            break


    }
}



function fetchNewWord(longURL) {
    if (searchTerm.value !== "tyler") {

        fetch(`${longURL}`)
            .then(function (response) {
                return response.json()
            })
            .then(json => {
                console.log(json)
                if (json.length > 0) {
                    console.log(typeof json[0]) // Making sure we get an object
                    if (typeof json[0] == 'object') {
                        //Typically brings in an large array of multiple definitions based on history of the word. The 0 position of the array is the most current definition of the word

                        //Defining my variables based on the JSON data of the 0 position of the Array
                        let dictionaryWord = json[0].meta.id
                        let dictionarySyllable = json[0].hwi.hw
                        let dictionaryDefinition = json[0].shortdef
                        let dictionaryType = json[0].fl
                        shortDefHeader.innerHTML = "Short Definition"

                        // Audio wave file is only stored as a NAME without the WAV at the end. The docs tell me that to create the URL
                        // To create the URL https://dictionaryapi.com/info/faq-audio-image
                        // sometimes audio file isn't associated with word and we need to check for it.
                        console.log(Object.keys(json[0].hwi))

                        if (Object.keys(json[0].hwi).length > 1) {
                            let myAudio = json[0].hwi.prs[0].sound.audio
                            mySound = `${baseSoundURL}${myAudio[0]}/${myAudio}.wav`
                            console.log(mySound)
                            soundButton.style.visibility = "visible"

                        } else {
                            soundButton.style.visibility = "hidden"

                        }
                        shortDefinitionID.innerHTML = ""


                        // Writing the code on the website from the search

                        // Placing the Dictionary Word Fetch and Making it Capitol
                        dictionaryWordID.innerHTML = dictionaryWord.toUpperCase()

                        // Making the Noun, Verb..etc and Syllable in the same line
                        dictionarySyllablesID.innerHTML = `${dictionaryType} // ${dictionarySyllable}`

                        // Webster's Dictionary gives you an array when it comes to definitions as a word holds multiple defs. We are just looping through it. 
                        dictionaryDefinition.forEach(element => {
                            let newList = document.createElement("li")
                            newList.innerText = element
                            shortDefinitionID.appendChild(newList)

                        });
                        makeVisible()

                    } else { // NOT CURRENTLY IN THE DICTIONARY BUT IT WILL OFFER SUGGESTIONS        

                        // Resetting the data to be displayed to the page
                        dictionarySyllablesID.innerHTML = ""
                        shortDefinitionID.innerText = ""

                        for (i = 0; i < json.length - 1; i++) {
                            // Looping through the suggested items due to a misspelled word.
                            dictionaryWordID.innerHTML = "DID YOU MEAN?"
                            shortDefHeader.innerHTML = ""

                            // Webster's Dictionary gives you an array when it comes to definitions as a word holds multiple defs. We are just looping through it. 
                            let newList = document.createElement("li")
                            newList.innerHTML = `<u> ${json[i]} <u>`
                            shortDefinitionID.appendChild(newList)
                            newList.setAttribute("class", "pointer")

                        }
                        makeVisible()
                        soundButton.style.visibility = "hidden"

                        let numberOfBullets = document.querySelectorAll("li").length
                        for (i = 0; i < numberOfBullets; i++) {
                            document.querySelectorAll("li")[i].addEventListener("click", function (e) {
                                document.getElementById("search").value = e.target.innerText
                                let longURL = baseURL + searchTerm.value + "?key=" + apiKey
                                makeHidden()
                                fetchNewWord(longURL)

                            })
                        }

                    } // typeof IF      
                } else {
                    alert("Check Spelling")
                    soundButton.style.visibility = "hidden"

                }


            });
    } else { // Tyler IF Statement
        let dictionaryWord = "tyler"
        let dictionarySyllable = "Bill Gates, Steve Jobs, Coding Genius"
        let dictionaryDefinition = ['best known as Mr T.', 'works for Eleven Fifty', "NEVER makes a PROMISE he can't CATCH"]
        let dictionaryType = "noun"
        shortDefHeader.innerHTML = "Short Definition"

        shortDefinitionID.innerHTML = ""


        // Writing the code on the website from the search

        // Placing the Dictionary Word Fetch and Making it Capitol
        dictionaryWordID.innerHTML = dictionaryWord.toUpperCase()

        // Making the Noun, Verb..etc and Syllable in the same line
        dictionarySyllablesID.innerHTML = `${dictionaryType} // ${dictionarySyllable}`

        // Webster's Dictionary gives you an array when it comes to definitions as a word holds multiple defs. We are just looping through it. 
        dictionaryDefinition.forEach(element => {
            let newList = document.createElement("li")
            newList.innerText = element
            shortDefinitionID.appendChild(newList)

        });
        let addPhoto = document.createElement("img")
        addPhoto.setAttribute("src", "images/tyler.jpg")
        addPhoto.setAttribute('class','img-fluid')
        shortDefinitionID.appendChild(addPhoto)

        makeVisible()
        soundButton.style.visibility = "hidden"



    }

}


function makeVisible() {
    dictionarySection.style.visibility = "visible" // Making the Definition Section Visible
    dictionarySection.style.animation = "fadeIn 3s" // Fading it in over 3 secs
    soundButton.style.visibility = "visible"

}

function makeHidden() {
    dictionarySection.style.visibility = "hidden"
    dictionarySection.style.animation = ""
    soundButton.style.visibility = "hidden"

}