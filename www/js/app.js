// This is a JavaScript file

const output = document.getElementById('output');
const img = output.querySelector('img');
navigator.mediaDevices
    .getUserMedia({ video: { facingMode: 'user' } })
    .then((stream) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        setInterval(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg'); // Base64 image data
            img.src = imageData;
        }, 1000);
    })
    .catch((error) => console.error('Camera error: ', error));
