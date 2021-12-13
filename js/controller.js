'use strict'
var gCurrShape;
var gCanvas;
var gCtx;
var gStrokeColor = 'black';
var gFillColor = 'black';
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function init() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
}


function onSave(ev, elForm) {
    ev.preventDefault();
    gFillColor = elForm.querySelector('[name= fill-color]').value
    gStrokeColor = elForm.querySelector('[name=stroke-color]').value
}


function draw(ev) {

    gCurrShape = document.querySelector('.shape-select').value
    if (!gCurrShape) return
    var pos = getEvPos(ev)
    switch (gCurrShape) {
        case 'square':
            drawSquare(pos.x, pos.y);
            break;
        case 'circle':
            drawCircle(pos.x, pos.y);
            break;
    }
}

function drawSquare(x, y) {
    gCtx.beginPath();
    gCtx.rect(x, y, 15, 20);
    gCtx.fillStyle = gFillColor;
    gCtx.fillRect(x, y, 15, 20);
    gCtx.strokeStyle = gStrokeColor;
    gCtx.stroke();
    gCtx.closePath();
}


function drawCircle(x, y) {
    gCtx.beginPath();
    gCtx.lineWidth = 2;
    gCtx.arc(x, y, 10, 0, 2 * Math.PI);
    gCtx.strokeStyle = gStrokeColor;
    gCtx.stroke();
    gCtx.fillStyle = gFillColor;
    gCtx.fill();
    gCtx.arc(x, y, 10, 0, 2 * Math.PI);
    gCtx.strokeStyle = gStrokeColor;
    gCtx.stroke();
    gCtx.fillStyle = gFillColor;
    gCtx.fill();
    gCtx.closePath();

}


function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}


function clearCanvas(ev) {
    ev.preventDefault();
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}


// DOWNLOAD
function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-canvas.jpg'
}

// UPLOAD IMG
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('#my-canvas').innerHTML = ''
    var reader = new FileReader()

    reader.onload = (event) => {
        console.log('onload');
        var img = new Image()
        // Render on canvas
        img.onload = onImageReady.bind(null, img) //renderImg
        // console.log('event.target.result', event.target.result);
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}


function renderImg(img) {
    gCtx.drawImage(img, gCanvas.width / 4, gCanvas.height / 4, gCanvas.width / 2, gCanvas.height / 2);
}

// SHARE TO FACEBOOK

function uploadImg() {
    const imgDataUrl = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.user-msg').innerText = `Your photo is available here: ${uploadedImgUrl}`

        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then((url) => {
            console.log('Got back live url:', url);
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}