// This is a JavaScript file

const preview = document.querySelector('.preview');
const verdict = document.querySelector('#verdict');
const verdictPercent = document.querySelector('#percent');
const scores = {
    sad: document.querySelector('#sad'),
    happy: document.querySelector('#happy'),
    angry: document.querySelector('#angry'),
    surprise: document.querySelector('#surprise'),
    fear: document.querySelector('#fear'),
    disgust: document.querySelector('#disgust'),
    neutral: document.querySelector('#neutral'),
};

function startPhotoScanner(callback) {
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
                callback(imageData);
            }, 1000);
        })
        .catch((error) => (verdict.innerHTML = 'Camera error: ' + error));
}

function getOrCreateUUID() {
    const storedUUID = localStorage.getItem('user-uuid');
    if (storedUUID) {
        return storedUUID; // Retorna o UUID existente
    }

    const newUUID = crypto.randomUUID();
    localStorage.setItem('user-uuid', newUUID); // Salva o novo UUID no localStorage
    return newUUID;
}

// Obter o UUID persistente
const userUUID = getOrCreateUUID();

// Inicializar o WebSocket com o UUID persistente
const backendPath = '2md2-pam-emotion-recog-backend-production.up.railway.app';
const socketUrl = `ws://${backendPath}?token=${userUUID}`;

// Função para traduzir cores
function traduzirCor(cor) {
    const traducoes = {
        blue: 'azul',
        red: 'vermelho',
        yellow: 'amarelo',
        green: 'verde',
        purple: 'roxo',
        orange: 'laranja',
        black: 'preto',
        white: 'branco',
    };
    return traducoes[cor] || cor;
}

// Função para traduzir emoções
function traduzirEmocao(emocao) {
    const traducoes = {
        sad: 'Triste',
        happy: 'Alegria',
        angry: 'Raiva',
        surprise: 'Surpresa',
        fear: 'Medo',
        disgust: 'Nojo',
        neutral: 'Neutro',
    };
    return traducoes[emocao] || emocao;
}

// Inicialização do WebSocket
function createSocket({ url, onopen, onmessage, onerror }) {
    const ws = new WebSocket(url);

    ws.addEventListener('open', onopen);
    ws.addEventListener('message', onmessage);
    ws.addEventListener('error', onerror);

    return ws;
}

// Função para lidar com mensagens do socket
function handleSocketMessage(event) {
    try {
        const response = JSON.parse(event.data);

        if (response.image) {
            preview.src = response.image; // Atualiza a imagem de preview
        }

        if (response.emotions && response.emotions.length > 0) {
            const emotionData = response.emotions[0]; // Pega a emoção de maior confiança
            const { emotion, confidence, scores: emotionScores } = emotionData;

            // Atualiza emoção traduzida e confiança formatada
            verdict.textContent = traduzirEmocao(emotion.name);
            verdictPercent.textContent = `${confidence.toFixed(2)}%`;

            // Atualiza os scores de emoções
            for (const [key, value] of Object.entries(emotionScores)) {
                if (scores[key]) {
                    scores[key].textContent = `${value.toFixed(2)}%`;
                }
            }
        }
    } catch (error) {
        console.error('Erro ao processar mensagem do socket:', error);
    }
}

// Conecta ao WebSocket e inicia o scanner de fotos
const socket = createSocket({
    url: socketUrl,
    onopen: () => {
        console.log('WebSocket conectado!');
        startPhotoScanner((imageData) => {
            socket.send(JSON.stringify({ image: imageData }));
        });
    },
    onmessage: handleSocketMessage,
    onerror: (error) => {
        console.error('Erro no WebSocket:', error);
        verdict.textContent = 'Erro no WebSocket!';
    },
});
