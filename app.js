console.log("This is a Image Search Engine")

const API_KEY = "";
let perPage = 15
let currentPage = 1
const outputImg = document.querySelector(".images")
const imgLi = document.querySelector(".images")
const loadMoreBtn = document.querySelector(".load-more")
const searchInput = document.querySelector(".search-input input")
const wrapperImg = document.querySelector(".lightbox")

const randImages = (e) => {
    for (let i = 0; i < 15; i++) {
        let newElement = document.createElement("li");
        newElement.className = 'card';
        newElement.innerHTML = `<img src="${e[i].src.large2x}" alt="${e[i].alt}">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${e[i].photographer}</span>
            </div>
            <button><i class="uil uil-import"></i></button>
        </div>`
        outputImg.appendChild(newElement);
    }
}

const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Loading..."
    loadMoreBtn.classList.add("disabled")
    fetch(apiURL, {
        headers: { Authorization: API_KEY }
    }).then(res => res.json()).then(data => {
        randImages(data.photos);
        loadMoreBtn.innerText = "Load More"
        loadMoreBtn.classList.remove("disabled")
    });
    
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchVal ? `https://api.pexels.com/v1/search?query=${searchVal}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    if (e.key === "Enter") {
        currentPage = 1
        searchVal = e.target.value
        outputImg.innerHTML = ""
        getImages(`https://api.pexels.com/v1/search?query=${searchVal}&page=${currentPage}&per_page=${perPage}`)
    }
}

const wrapperClose = () => {
    wrapperImg.classList.add("hiddenBox");
}

const downloadImage = (img) => {
    let imgURL = img.src
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(file)
        a.download = new Date().getTime()
        a.click();
    }).catch(() => 
    alert("Failed to download the image"))
}

const popUp = (event) => {
    let targetElement = event.target
    if (targetElement.closest('.details')) {
        targetElement = targetElement.closest('.details').previousElementSibling;
    }
    wrapperImg.classList.remove("hiddenBox");
    wrapperImg.innerHTML = `<div class="wrapper">
            <header>
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${targetElement.nextElementSibling.querySelector('.photographer span').innerText}</span>
                </div>
                <div class="buttons">
                    <i class="uil uil-import"></i>
                    <i class="uil uil-times"></i>
                </div>
            </header>
            <div class="preview-img">
                <div class="img"><img src="${targetElement.src}" alt="${targetElement.alt}"></div>
            </div>`
            document.querySelector(".uil-times").addEventListener("click", wrapperClose)
            document.querySelector(".uil-import").addEventListener("click", () => downloadImage(targetElement.src))
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)

outputImg.addEventListener("click", popUp)
loadMoreBtn.addEventListener("click", loadMoreImages)
searchInput.addEventListener("keyup", loadSearchImages)