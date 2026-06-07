// Tab Navigation
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        navBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tab}-section`).classList.add('active');
    });
});

// Canvas API
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const drawBtn = document.getElementById('drawBtn');
const clearBtn = document.getElementById('clearBtn');
const colorPicker = document.getElementById('colorPicker');

drawBtn.addEventListener('click', () => {
    const color = colorPicker.value;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    
    // Draw random shapes
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 50 + 10;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw random lines
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineWidth = Math.random() * 5 + 1;
        ctx.stroke();
    }
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Geolocation API
const getLocationBtn = document.getElementById('getLocationBtn');
const locationInfo = document.getElementById('location-info');

getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        locationInfo.innerHTML = '<p>Getting location...</p>';
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                const acc = position.coords.accuracy.toFixed(0);
                locationInfo.innerHTML = `
                    <p><strong>Latitude:</strong> ${lat}</p>
                    <p><strong>Longitude:</strong> ${lon}</p>
                    <p><strong>Accuracy:</strong> ${acc} meters</p>
                `;
            },
            (error) => {
                locationInfo.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        );
    } else {
        locationInfo.innerHTML = '<p style="color: red;">Geolocation is not supported by your browser</p>';
    }
});

// Web Audio API
const playToneBtn = document.getElementById('playToneBtn');
const frequencySlider = document.getElementById('frequencySlider');
const frequencyValue = document.getElementById('frequencyValue');

let audioContext;

frequencySlider.addEventListener('input', () => {
    frequencyValue.textContent = `${frequencySlider.value} Hz`;
});

playToneBtn.addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencySlider.value;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
});

// LocalStorage API
const storageKey = document.getElementById('storageKey');
const storageValue = document.getElementById('storageValue');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const clearStorageBtn = document.getElementById('clearStorageBtn');
const storageOutput = document.getElementById('storageOutput');

saveBtn.addEventListener('click', () => {
    const key = storageKey.value.trim();
    const value = storageValue.value.trim();
    
    if (key && value) {
        localStorage.setItem(key, value);
        storageOutput.innerHTML = `<p style="color: green;">Saved: ${key} = ${value}</p>`;
    } else {
        storageOutput.innerHTML = '<p style="color: red;">Please enter both key and value</p>';
    }
});

loadBtn.addEventListener('click', () => {
    const key = storageKey.value.trim();
    
    if (key) {
        const value = localStorage.getItem(key);
        if (value !== null) {
            storageValue.value = value;
            storageOutput.innerHTML = `<p style="color: green;">Loaded: ${key} = ${value}</p>`;
        } else {
            storageOutput.innerHTML = `<p style="color: red;">Key "${key}" not found</p>`;
        }
    } else {
        storageOutput.innerHTML = '<p style="color: red;">Please enter a key</p>';
    }
});

clearStorageBtn.addEventListener('click', () => {
    localStorage.clear();
    storageOutput.innerHTML = '<p style="color: green;">All localStorage cleared</p>';
});

// Fetch API
const urlInput = document.getElementById('urlInput');
const fetchBtn = document.getElementById('fetchBtn');
const fetchOutput = document.getElementById('fetchOutput');

fetchBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    
    if (url) {
        fetchOutput.textContent = 'Fetching...';
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            fetchOutput.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            fetchOutput.textContent = `Error: ${error.message}`;
        }
    } else {
        fetchOutput.textContent = 'Please enter a URL';
    }
});

// Web Speech API
const startSpeechBtn = document.getElementById('startSpeechBtn');
const stopSpeechBtn = document.getElementById('stopSpeechBtn');
const speechOutput = document.getElementById('speechOutput');

let recognition;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        speechOutput.innerHTML = `
            <p><strong>Final:</strong> ${finalTranscript}</p>
            <p><strong>Interim:</strong> ${interimTranscript}</p>
        `;
    };
    
    recognition.onerror = (event) => {
        speechOutput.innerHTML = `<p style="color: red;">Error: ${event.error}</p>`;
    };
    
    startSpeechBtn.addEventListener('click', () => {
        recognition.start();
        speechOutput.innerHTML = '<p>Listening...</p>';
    });
    
    stopSpeechBtn.addEventListener('click', () => {
        recognition.stop();
        speechOutput.innerHTML += '<p>Stopped listening</p>';
    });
} else {
    speechOutput.innerHTML = '<p style="color: red;">Web Speech API is not supported in your browser</p>';
    startSpeechBtn.disabled = true;
    stopSpeechBtn.disabled = true;
}
