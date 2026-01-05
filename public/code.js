let jsonData;
let albumIndex = 0;
let postIndex = 0;
let albumPathData = null;
let imagePathData = null;
let formattedSearchedPath = null;
let searchedImages = [];

fetch('images.json')
    .then(res => res.json())
    .then(data => {
        jsonData = data;
        if (window.location.pathname.split("/").pop() == "index.html") {
            populateAlbums();
        };
        if (window.location.pathname.split("/").pop() == "") {
            populateAlbums();
        };
        if (window.location.pathname.split("/").pop() == "top20.html") {
            populateTop20();
        };
    })



function populateAlbums() {

    jsonData.albums.forEach(album => {
        let path = album.thumbnail;

        const photo_box = document.createElement('div');
        const img = document.createElement('img');
        const description_wrapper = document.createElement('div')
        const description = document.createElement('p');
        const photo_grid_top = document.getElementById('photo_grid_top');
        const photo_grid_bottom = document.getElementById('photo_grid_bottom');

        photo_box.dataset.index = albumIndex;
        photo_box.className = "photo_box";
        photo_box.onclick = () => populateImages(albumIndex);
        photo_box.appendChild(img);
        photo_box.appendChild(description_wrapper);

        img.loading = "lazy";
        img.src = path;
        img.className = "img";
        img.onload = () => {
            img.style.height = "auto";
        };

        description_wrapper.className = 'description_wrapper';
        description_wrapper.dataset.index = albumIndex;
        description_wrapper.appendChild(description);

        description.innerHTML = album.name;
        description.className = "description";

        if (photo_grid_top.scrollHeight < photo_grid_bottom.scrollHeight) {
            photo_grid_top.appendChild(photo_box);
        } else {
            photo_grid_bottom.appendChild(photo_box)
        };
        albumIndex++;
    });
}

function imageMaximize(index) {

    document.getElementById("highlighted_image_wrapper")?.remove();
    const screenwrapper = document.createElement('div');
    const imageClicked = document.querySelectorAll('[data-index~=\'' + index + "\']")[0].children[0];
    const imagewrapper = document.createElement('div');
    const highlighted_image_description_wrapper = document.createElement('a')
    const description = document.createElement('a');
    const img = document.createElement('img');
    const description_data = document.createElement('p');
    const nextImagewrapper = document.createElement('div');
    const nextButtonLeft = document.createElement('button');
    const nextButtonRight = document.createElement('button');


    img.src = imageClicked.src;
    img.id = "highlighted_image";
    img.onclick = () => closeMaximizedImage();
    description.href = "images/" + imageClicked.src.split('/').slice(-3).join('/').slice(7);
    description.download = true;
    highlighted_image_description_wrapper.className = "highlighted_image_description_wrapper";
    highlighted_image_description_wrapper.appendChild(description);
    highlighted_image_description_wrapper.appendChild(description_data);



    description.className = "description";
    description.style.width = "max-content";
    description.style.color = "white";


    nextImagewrapper.className = "nextImageWrapper"
    nextImagewrapper.appendChild(nextButtonLeft);
    nextImagewrapper.appendChild(nextButtonRight);

    nextButtonLeft.className = 'nextButton';
    nextButtonRight.className = 'nextButton';
    nextButtonLeft.onclick = () => imageMaximize(parseInt(index) - 1);
    nextButtonRight.onclick = () => imageMaximize(parseInt(index) + 1);
    nextButtonLeft.id = 'nextButtonLeft';
    nextButtonRight.id = 'nextButtonRight';
    nextButtonLeft.innerHTML = 'Back';
    nextButtonRight.innerHTML = 'Next';

    const venue = imageClicked.src.split('/').slice(-3).join('/').slice(7).split('/').slice(-1).pop().split('-').slice(0, 2).join('').toLowerCase().trim();

    jsonData.albums.some(albumPath => {
        if (venue === albumPath.tag) {
            albumPathData = albumPath;
            return true;
        }
    });

    albumPathData.data.some(data => {
        if (data.path === imageClicked.src.split('/').slice(-3).join('/')) {
            imagePathData = data;
            return true;
        }
    });

    description_data.className = "description";
    description_data.innerHTML = Object.keys(imagePathData)[1] + ": " + Object.values(imagePathData)[1] + "<br>" + Object.keys(imagePathData)[2] + ": " + Object.values(imagePathData)[2] + "<br>" + Object.keys(imagePathData)[0] + ": " + Object.values(imagePathData)[0];
    description.innerHTML = "Download This Image In HD!";


    imagewrapper.id = 'imagewrapper';
    imagewrapper.appendChild(img);
    imagewrapper.appendChild(highlighted_image_description_wrapper);
    imagewrapper.style.animation = "highlightMaximize 0.1s linear forwards";


    screenwrapper.id = "highlighted_image_wrapper";
    screenwrapper.appendChild(imagewrapper);
    screenwrapper.appendChild(nextImagewrapper)
    screenwrapper.style.animation = "opacitize 0.1s linear forwards";

    img.style.animation = "highlightMaximize 0.1s linear forwards";

    document.body.appendChild(screenwrapper);

}

function closeMaximizedImage() {
    const highlighted_image_wrapper = document.getElementById("highlighted_image_wrapper");
    const imagewrapper = document.getElementById("imagewrapper");
    const highlighted_image = document.getElementById("highlighted_image");

    highlighted_image.style.animation = "none";
    imagewrapper.style.animation = "none";
    void highlighted_image.offsetWidth;
    void imagewrapper.offsetWidth;


    highlighted_image.style.animation = "highlightMaximize 0.1s ease reverse both 1";
    imagewrapper.style.animation = "highlightMaximize 0.1s ease reverse both 1";
    highlighted_image_wrapper.style.animation = "opacitize 0.1s linear reverse";
    highlighted_image.addEventListener("animationend", () => {
        highlighted_image_wrapper.remove();
    }, {
        once: true
    });

}

function search() {
    searchedImages = [];
    event.preventDefault();
    let userSearch = document.getElementById("search_bar").value
    document.getElementById("search_bar").innerHTML = "";
    jsonData.albums.forEach(searchedAlbums => {
        searchedAlbums.data.forEach(searchedData => {
            formattedSearchedPath = searchedData.path.split("/").slice(2, 3).join().toLowerCase();
            if (formattedSearchedPath.includes(userSearch.toLowerCase().replace(/\s/g, ""))) {
                searchedImages.push(searchedData);
            }
        });

    });
    populateImages(searchedImages);
}

function populateTop20() {

    postIndex = 0;

    document.getElementById("album_grid_wrapper")?.remove();
    document.getElementsByClassName("header_logo")[0]?.remove();
    document.getElementsByClassName("photo_grid_wrapper")[0]?.remove();

    const photo_grid_top = document.createElement('div');
    const photo_grid_bottom = document.createElement('div');
    const photo_grid_wrapper = document.createElement('div');

    document.body.appendChild(photo_grid_wrapper)

    photo_grid_wrapper.className = "photo_grid_wrapper";
    photo_grid_wrapper.appendChild(photo_grid_top);
    photo_grid_wrapper.appendChild(photo_grid_bottom);

    photo_grid_top.className = "photo_grid";
    photo_grid_top.id = "photo_grid_top";

    photo_grid_bottom.className = "photo_grid";
    photo_grid_bottom.id = "photo_grid_bottom";


    jsonData.top20.forEach(path2 => {

        let path = path2.path;
        const photo_box = document.createElement('div');
        const description_wrapper = document.createElement('div');
        const description = document.createElement('a');
        const img = document.createElement('img');

        photo_box.className = 'photo_box';
        photo_box.appendChild(img);
        photo_box.appendChild(description_wrapper);
        photo_box.dataset.index = postIndex;

        img.style.visibility = "hidden";
        img.loading = "lazy";
        img.src = path;
        img.style.visibility = 'visible';
        img.onclick = () => imageMaximize(photo_box.dataset.index);
        postIndex++;

        img.onload = () => {
            img.style.height = "auto";
        };

        description_wrapper.className = "description_wrapper"
        description_wrapper.appendChild(description);

        description.href = path;
        description.download = true;
        description.style.color = "white";
        description.innerHTML = "Download This Image In HD!";
        description.className = "description";




        if (photo_grid_top.scrollHeight < photo_grid_bottom.scrollHeight) {
            photo_grid_top.appendChild(photo_box);
        } else {
            photo_grid_bottom.appendChild(photo_box)
        };

    });

}

function populateImages(albumArray) {
    postIndex = 0;
    let index;
    let path1;
    let path1Data;

    document.getElementById("album_grid_wrapper")?.remove();
    document.getElementsByClassName("header_logo")[0]?.remove();
    document.getElementsByClassName("photo_grid_wrapper")[0]?.remove();
    document.getElementsByClassName("header_text")[0]?.remove();

    const photo_grid_top = document.createElement('div');
    const photo_grid_bottom = document.createElement('div');
    const photo_grid_wrapper = document.createElement('div');
    const header_text = document.createElement('p');


    /* if populating an albums contents */

    if (typeof(albumArray) === "number") {
        index = event.target.parentElement.dataset.index;
        document.getElementById("top_head_landing_page").style.backgroundImage = jsonData.albums[index].gradient;
        header_text.innerHTML = jsonData.albums[index].name;
        path1 = jsonData.albums[index]
        path1Data = jsonData.albums[index].data;
    } else if (typeof(albumArray === "list")) {
        header_text.innerHTML = "you searched: " + "\"" + document.getElementById("search_bar").value + "\"";
        path1Data = albumArray;
    };




    header_text.className = "header_text";

    document.body.appendChild(photo_grid_wrapper);
    document.getElementById('top_head_landing_page').appendChild(header_text)

    photo_grid_wrapper.className = "photo_grid_wrapper";
    photo_grid_wrapper.appendChild(photo_grid_top);
    photo_grid_wrapper.appendChild(photo_grid_bottom);

    photo_grid_top.className = "photo_grid";
    photo_grid_top.id = "photo_grid_top";

    photo_grid_bottom.className = "photo_grid";
    photo_grid_bottom.id = "photo_grid_bottom";

    path1Data.forEach(path2 => {
        let path = path2.path;

        const photo_box = document.createElement('div');
        photo_box.loading = "lazy";
        const description_wrapper = document.createElement('div');
        const description = document.createElement('a');
        const img = document.createElement('img');

        photo_box.dataset.index = postIndex;
        photo_box.className = 'photo_box';
        photo_box.appendChild(img);
        photo_box.appendChild(description_wrapper);
        img.style.visibility = "hidden";
        img.loading = "lazy";
        img.src = path;
        img.onerror = () => {
            photo_box.remove();
            return false


        };

        img.style.visibility = 'visible';
        img.onclick = () => imageMaximize(photo_box.dataset.index);
        postIndex++;

        img.onload = () => {
            img.style.height = "auto";
        };
        description_wrapper.className = "description_wrapper"
        description.href = path;
        description.download = true;
        description.style.color = "white";

        description_wrapper.appendChild(description);

        description.innerHTML = "Download This Image In HD!";
        description.className = "description";

        if (photo_grid_top.scrollHeight < photo_grid_bottom.scrollHeight) {
            photo_grid_top.appendChild(photo_box);
        } else {
            photo_grid_bottom.appendChild(photo_box)
        };
    });
}