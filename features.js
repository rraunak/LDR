// Countdown Timer
function initCountdown() {
    // Set your next meeting date here
    const nextDate = new Date('2025-04-30T00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = nextDate - now;

        // Handle case when countdown is complete
        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Virtual Hug Animation
function sendVirtualHug() {
    const hugAnimation = document.querySelector('.hug-animation');
    hugAnimation.classList.add('active');
    
    // Create floating hearts
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createFloatingHeart(), i * 100);
    }

    setTimeout(() => {
        hugAnimation.classList.remove('active');
    }, 1000);
}

// Weather Widget
async function initWeather() {
    const berlinApi = `https://api.openweathermap.org/data/2.5/weather?q=Berlin,DE&units=metric&appid=d09824d6cffb662fb276e5258b014d25`;
    const santaClaraApi = `https://api.openweathermap.org/data/2.5/weather?q=Santa+Clara,US&units=metric&appid=d09824d6cffb662fb276e5258b014d25`;

    function updateTime() {
        const berlinTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Berlin' });
        const santaClaraTime = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' });

        document.querySelector('#berlinWeather .time-info').textContent = berlinTime;
        document.querySelector('#santaClaraWeather .time-info').textContent = santaClaraTime;
    }

    setInterval(updateTime, 1000);
    updateTime();

    async function fetchWeather(url, elementId) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const weatherInfo = document.querySelector(`#${elementId} .weather-info`);
            weatherInfo.innerHTML = `
                ${Math.round(data.main.temp)}°C
                ${data.weather[0].main}
            `;
        } catch (error) {
            console.log('Weather fetch error:', error);
        }
    }

    setInterval(() => {
        fetchWeather(berlinApi, 'berlinWeather');
        fetchWeather(santaClaraApi, 'santaClaraWeather');
    }, 600000); // Update every 10 minutes

    // Initial weather fetch
    fetchWeather(berlinApi, 'berlinWeather');
    fetchWeather(santaClaraApi, 'santaClaraWeather');
}

// Calendar Integration
function initCalendar() {
    const calendarEl = document.querySelector('.calendar-container');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: [
            {
                title: 'Virtual Date ❤️',
                start: '2024-02-20'
            }
        ],
        eventColor: '#ff6b6b',
        eventClick: function(info) {
            alert('Event: ' + info.event.title);
        },
        dateClick: function(info) {
            if (confirm('Would you like to schedule a date on ' + info.dateStr + '?')) {
                calendar.addEvent({
                    title: 'Virtual Date ❤️',
                    start: info.date,
                    allDay: true
                });
            }
        }
    });
    calendar.render();
}

// Digital Diary
function initDiary() {
    const addEntryBtn = document.querySelector('.add-entry-btn');
    const diaryEntries = document.getElementById('diaryEntries');
    const textarea = document.querySelector('.diary-input textarea');

    addEntryBtn.addEventListener('click', () => {
        if (textarea.value.trim()) {
            const entry = document.createElement('div');
            entry.className = 'diary-entry';
            entry.innerHTML = `
                <div class="entry-date">${new Date().toLocaleDateString()}</div>
                <div class="entry-content">${textarea.value}</div>
            `;
            diaryEntries.appendChild(entry);
            textarea.value = '';
        }
    });
}

// Virtual Gifts
function initGifts() {
    const giftItems = document.querySelectorAll('.gift-item');
    const animationContainer = document.getElementById('animation-container');
    
    const giftEmojis = {
        flower: '🌹',
        teddy: '🧸',
        star: '⭐',
        chocolate: '🍫',
        kiss: '💋',
        hug: '🤗'
    };

    function createGiftAnimation(type, x, y) {
        const gift = document.createElement('div');
        gift.className = `animated-gift ${type}`;
        gift.textContent = giftEmojis[type];
        gift.style.left = `${x}px`;
        gift.style.top = `${y}px`;
        
        animationContainer.appendChild(gift);
        
        // Remove the element after animation
        gift.addEventListener('animationend', () => {
            gift.remove();
        });
    }

    function createMultipleGifts(type, x, y) {
        const count = 3;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const offsetX = x + (Math.random() - 0.5) * 100;
                const offsetY = y + (Math.random() - 0.5) * 100;
                createGiftAnimation(type, offsetX, offsetY);
            }, i * 200);
        }
    }
    
    giftItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const rect = item.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            const giftType = item.getAttribute('data-gift-type');
            createMultipleGifts(giftType, x, y);
            
            // Add click feedback
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 200);
        });
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initWeather();
    initCalendar();
    initDiary();
    initGifts();
});
