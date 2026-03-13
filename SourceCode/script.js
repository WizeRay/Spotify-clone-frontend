console.log("Lets write JavaScript")


 //test
    let folder = "Classical"



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

let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/`)
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

function playSong(songPath){
    currentSong.src = songPath
    currentSong.play()
    playImg.src = "../Assets/svg/pause.svg"
}
//songInfo finder function
function songInfoFinder(songPath){

    let fileName = songPath.split("/").pop()

    let songInfo = fileName
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
const circle = document.querySelector(".circle")
const progress = document.querySelector(".progress")

function updateSeek(e){

    const rect = timeBar.getBoundingClientRect()

    let percent = (e.clientX - rect.left) / rect.width

    // prevent overflow
    percent = Math.max(0, Math.min(percent,1))

    circle.style.transform = `translateX(${percent}%)`
    progress.style.width = percent * 100 + "%"

    currentSong.currentTime = percent * currentSong.duration

    
}




async function main(){
    
   


    let classicalSongs = await getSongs("Classical")
    console.log("Classical Playlist:",classicalSongs)

    let hiphopSongs = await getSongs("Hiphop&Rap")
    console.log("Hiphop&Rap Playlist:",hiphopSongs)

    let jazzSongs = await getSongs("Jazz&Blues")
    console.log("Jazz&Blues Playlist:",jazzSongs)

    let popSongs = await getSongs("Pop")
    console.log("Pop Playlist:",popSongs)


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
    if(currentSong.src){
        let info = songInfoFinder(currentSong.src)
        document.querySelector(".songInfo-playBar span").textContent = `${toTitleCase(info.songName)} - ${toTitleCase(info.songArtist)}`
    }
})

   
    let songUL = document.querySelector(".songSelection ul")

    //creating a fragment as its good practice
    let fragment1 = document.createDocumentFragment()
    //creating DOM element for playbar song info
    let songInfo = createElement("span","--")
    document.querySelector(".songInfo-playBar").appendChild(songInfo)
    
    for (const song of classicalSongs) {
        let songPath =`http://127.0.0.1:5500/songs/${folder}/${song}`

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
            playSong(songPath)
            let info = songInfoFinder(songPath)
            songInfo.textContent = `${toTitleCase(info.songName)} - ${toTitleCase(info.songArtist)}`

            
        })


        li.appendChild(songImage)
        li.appendChild(songInfoEl)
        li.appendChild(playBtn)

        fragment1.appendChild(li)

        
    }

    songUL.appendChild(fragment1)

    //adding currentime and timeDuration

    //listen for timeupdate event for adding currentime
    let currentTimeEl = document.querySelector(".currentTime")
    currentSong.addEventListener("timeupdate", ()=>{
        if(isDragging) return
        currentTimeEl.textContent = formatTime(currentSong.currentTime)
        let progressPercentage = (currentSong.currentTime)*100/currentSong.duration
        
        circle.style.left = progressPercentage + "%"
        progress.style.width = progressPercentage + "%"

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
    let isDragging = false
    circle.addEventListener("pointerdown",(e)=>{
        
        isDragging = true

        circle.setPointerCapture(e.pointerId)
    })

    document.addEventListener("pointermove",(e)=>{

    if(!isDragging) return 
    updateSeek(e)

    })
    document.addEventListener("pointerup",(e)=>{

    isDragging = false

    circle.releasePointerCapture(e.pointerId)

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


    
}

main()
