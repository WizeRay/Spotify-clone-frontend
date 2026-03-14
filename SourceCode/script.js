console.log("Lets write JavaScript")


    let folderSongs = []
    let currentFolder = ""
    

    let songUL = document.querySelector(".songSelection ul")
    let playlistName = document.querySelector(".playlistName")
    playlistName.textContent = "Select a Playlist"

    //creating a fragment as its good practice
    let fragment1 = document.createDocumentFragment()
    //creating DOM element for playbar song info
    let songInfo = createElement("span","--")
    document.querySelector(".songInfo-playBar").appendChild(songInfo)


//createElement function
function createElement(tag, text){
    let el = document.createElement(tag)
    el.textContent = text

    return el
}
//capitalize function
const toTitleCase = str => str.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase())

// Function to convert seconds to MM:SS format
function formatTime(seconds) {
    
    const mins = Math.floor(seconds / 60);          // get whole minutes
    const secs = Math.floor(seconds % 60);          // get remaining seconds
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    const formattedSecs = secs < 10 ? `0${secs}` : secs;
    return `${formattedMins}:${formattedSecs}`;
}


async function getSongs(folder){

let a = await fetch(`/songs/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`${folder}/`)[1])
        }
        
        
    }
    return songs
}
//audio object
let currentSong = new Audio();

//playSong func
let play = document.getElementById("play")
let playImg =play.querySelector("img")
let songIndex


function playSong(song,folder,folderSongs){
    currentSong.src = `/songs/${folder}/${song}`
    songIndex = folderSongs.indexOf(currentSong.src.split("/").pop())
    currentSong.play()
    let info = songInfoFinder(song)
    songInfo.textContent = `${toTitleCase(info.songName)} - ${toTitleCase(info.songArtist)}`
    playImg.src = "../Assets/svg/pause.svg"
}
//songInfo finder function
function songInfoFinder(song){

    let songInfo = song
        .replace(/-/g," ")
        .replace(".mp3","")
        .split(" by ")

    return{
        songName: songInfo[0],
        songArtist: songInfo[1]
    }
}
//Update song position
const timeBar = document.querySelector(".timeBar")
const circle1 = timeBar.querySelector(".circle")
const progress1 = timeBar.querySelector(".progress")
const volumeBar = document.querySelector(".volumeBar")
const circle2 = volumeBar.querySelector(".circle")
const progress2 = volumeBar.querySelector(".progress")


function updateSeek(e){

    const rect = timeBar.getBoundingClientRect()

    let percent = (e.clientX - rect.left) / rect.width

    // prevent overflow
    percent = Math.max(0, Math.min(percent,1))

    circle1.style.transform = `translateX(${percent*100}%)`
    progress1.style.width = percent * 100 + "%"

    currentSong.currentTime = percent * currentSong.duration

    
}

function updateVolume(e){

    const rect = volumeBar.getBoundingClientRect()

    let percent = (e.clientX - rect.left) / rect.width

    // prevent overflow
    percent = Math.max(0, Math.min(percent,1))

    circle2.style.left = `${percent*100}%`
    progress2.style.width = percent * 100 + "%"

    currentSong.volume = percent

    
}
async function loadPlaylists(){
    let res = await fetch("/songs.json")
    let playlists = await res.json()
    return playlists
}
async function loadCards(){

   let playlists = await loadPlaylists()
    let cardContainer = document.querySelector(".cardContainer")

    for(let i = 0; i < links.length; i++){

        let element = links[i]

        if(element.href.includes("/songs/") && !element.href.endsWith(".mp3")){

            let folder = element.href.split("/songs/")[1].replace("/","")

            // card
            let card = document.createElement("div")
            card.classList.add("card")

            // cardImage
            let cardImage = document.createElement("div")
            cardImage.classList.add("cardImage")

            // cover image
            let img = document.createElement("img")
            img.classList.add("coverImg")
            img.src = playlistName.cover

            // play button
            let playBtn = document.createElement("div")
            playBtn.classList.add("playBtn")

            let playIcon = document.createElement("img")
            playIcon.src = "../Assets/svg/play.svg"

            //click event on playbutton
            playBtn.addEventListener("click",async()=>{
                currentFolder = folder
                folderSongs = await getSongs(folder)
                renderSongList(folderSongs,currentFolder)
                playlistName.textContent = folder.replace("%26","&")
                playSong(folderSongs[0], folder, folderSongs)
            })

            playBtn.appendChild(playIcon)

            cardImage.appendChild(img)
            cardImage.appendChild(playBtn)

            // info section
            let imageInfo = document.createElement("div")
            imageInfo.classList.add("imageInfo")

            let title = document.createElement("h3")
            title.textContent = folder.replace("%26","&")

            imageInfo.appendChild(title)

            // assemble card
            card.appendChild(cardImage)
            card.appendChild(imageInfo)

            // add to container
            cardContainer.appendChild(card)
        }
    }
}
function renderSongList(folderSongs,folder) {
    for (const song of folderSongs) {
        songUL.innerHTML = ""
        //remove .mp3 and -
        let cleanName = song.replace(/-/g , " ").replace(".mp3","")
        
        //split artist name and song name
        let songPart = cleanName.split(" by ")

        let songName = songPart[0]
        let songArtist = songPart[1]

        //making song cards 

        let li = document.createElement("li")

        let songImage = document.createElement("img")
        songImage.src = "../Assets/svg/music.svg"
        songImage.classList.add("invert")

        let songInfoEl = document.createElement("div")
        songInfoEl.classList.add("info")

        let songNameEl = createElement("span",toTitleCase(songName))
        songNameEl.classList.add("songName")

        let artistNameElement = createElement("span",toTitleCase(songArtist))
        artistNameElement.classList.add("artistName")

        songInfoEl.appendChild(songNameEl)
        songInfoEl.appendChild(artistNameElement)


        let playBtn = createElement("div","")
        playBtn.classList.add("right-playBtn")


    
        let playBtnImg = createElement("img","")
        playBtnImg.src ="../Assets/Svg/play.svg"
        playBtn.appendChild(playBtnImg)
        

        //adding eventlistener to library-playbuttons
        playBtn.addEventListener("click",(e)=>{
            e.stopPropagation()
            playSong(song,folder,folderSongs)
            

            
        })


        li.appendChild(songImage)
        li.appendChild(songInfoEl)
        li.appendChild(playBtn)

        fragment1.appendChild(li)

        
    }

    songUL.appendChild(fragment1)
    
}

async function main(){
    //initialVolume
    let initialVolume = 0.5   // range is 0 to 1

    currentSong.volume = initialVolume

    progress2.style.width = initialVolume * 100 + "%"
    circle2.style.left = initialVolume * 100 + "%"



    loadCards()
   
    
    //Attaching eventListener to play,next and prev button
   
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            playImg.src = "../Assets/Svg/pause.svg"
        }
        else{
            currentSong.pause()
            playImg.src = "../Assets/Svg/play.svg"
        }
        // update song info
    // if(currentSong.src){
    //     let info = songInfoFinder(currentSong.src)
    //     document.querySelector(".songInfo-playBar span").textContent = `${toTitleCase(info.songName)} - ${toTitleCase(info.songArtist)}`
    // }
})

   
   
    
    

    //adding currentime and timeDuration

    //listen for timeupdate event for adding currentime
    let currentTimeEl = document.querySelector(".currentTime")
    currentSong.addEventListener("timeupdate", ()=>{
        if(songIsDragging) return
        currentTimeEl.textContent = formatTime(currentSong.currentTime)
        let progressPercentage = (currentSong.currentTime)*100/currentSong.duration
        
        circle1.style.left = progressPercentage + "%"
        progress1.style.width = progressPercentage + "%"

})
    

    //time duration
    let totalTimeEl = document.querySelector(".totalTime")
     currentSong.addEventListener("loadedmetadata", ()=>{
        totalTimeEl.textContent = formatTime(currentSong.duration)
        
       
    })

    
   

    //On click on seek bar
    timeBar.addEventListener("pointerdown", (e)=>{
        updateSeek(e)
    })

    //Drag of circle
    let songIsDragging = false
    circle1.addEventListener("pointerdown",(e)=>{
        
        songIsDragging = true

        circle1.setPointerCapture(e.pointerId)
    })

    document.addEventListener("pointermove",(e)=>{

    if(!songIsDragging) return 
    updateSeek(e)

    })
    document.addEventListener("pointerup",(e)=>{

    songIsDragging = false

    circle1.releasePointerCapture(e.pointerId)

    }) 
    
    // hamburger animation
    isClicked = false
    document.querySelector(".hamburger").addEventListener("click",()=>{
        if(!isClicked){
        document.querySelector(".left").style.left = "0%"
        isClicked = true
        }
        else{
        document.querySelector(".left").style.left = "-100%" 
        isClicked = false 
        }
    })
    //next and previous songs
    
    let prevEl = document.getElementById("prev")
    prevEl.addEventListener("click",()=>{
        if(songIndex>0){
        playSong(folderSongs[songIndex-1],folder,folderSongs)
        }
    })
    let nextEl = document.getElementById("next")
    nextEl.addEventListener("click",()=>{
        if(songIndex+1<folderSongs.length){
        playSong(folderSongs[songIndex+1],folder,folderSongs)
        }
    })

     //Drag of circle2
    let volumeIsDragging = false
    circle2.addEventListener("pointerdown",(e)=>{
        
        volumeIsDragging = true

        circle2.setPointerCapture(e.pointerId)
    })

    document.addEventListener("pointermove",(e)=>{

    if(!volumeIsDragging) return 
    updateVolume(e)

    })
    document.addEventListener("pointerup",(e)=>{

    volumeIsDragging = false

    circle2.releasePointerCapture(e.pointerId)

    }) 
    volumeBar.addEventListener("pointerdown",(e)=>{
    updateVolume(e)
})


    
}

main()
