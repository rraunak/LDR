document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('dateButton');
    const response = document.getElementById('response');
    const music = document.getElementById('backgroundMusic');
    const musicContainer = document.querySelector('.music-container');
    const heartsContainer = document.querySelector('.hearts-background');
    let messageCount = 0;
    let musicStarted = false;

    // Initialize storage for all features
    let savedEvents = [];
    let savedDiaryEntries = [];
    let savedPhotos = JSON.parse(localStorage.getItem('photos')) || [
        {
            id: 1,
            src: 'IMG_9091.JPG',
            date: new Date().toLocaleDateString(),
            caption: 'Our Special Moment ❤️'
        },
        {
            id: 2,
            src: 'IMG_8538.jpg',
            date: new Date().toLocaleDateString(),
            caption: 'Beautiful Memories 💕'
        },
        {
            id: 3,
            src: 'IMG_8422.jpg',
            date: new Date().toLocaleDateString(),
            caption: 'Together Forever 💑'
        },
        {
            id: 4,
            src: 'IMG_8512.jpg',
            date: new Date().toLocaleDateString(),
            caption: 'Just Us 💖'
        },
        {
            id: 5,
            src: 'IMG_8473.jpg',
            date: new Date().toLocaleDateString(),
            caption: 'Love & Laughter 😊'
        },
        {
            id: 6,
            src: 'IMG_8540.jpg',
            date: new Date().toLocaleDateString(),
            caption: 'Perfect Moments ✨'
        },
        {
            id: 7,
            src: 'IMG_9037.jpg',
            date: new Date().toLocaleDateString(),
            caption: 'Forever & Always 💫'
        }
    ];
    let playlist = JSON.parse(localStorage.getItem('playlist')) || [
        {
            id: Date.now(),
            name: "Perfect",
            artist: "Ed Sheeran",
            link: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
            addedDate: new Date().toLocaleDateString(),
            addedBy: 'Raunak'
        },
        {
            id: Date.now() + 1,
            name: "Ve Haniyaan",
            artist: "Neha Bhasin",
            link: "https://www.youtube.com/watch?v=E_SbwSe15y0",
            addedDate: new Date().toLocaleDateString(),
            addedBy: 'Raunak'
        },
        {
            id: Date.now() + 2,
            name: "Ishq Hai",
            artist: "Raghav Chaitanya",
            link: "https://www.youtube.com/watch?v=BcSejVIxB0E",
            addedDate: new Date().toLocaleDateString(),
            addedBy: 'Raunak'
        }
    ];

    // Add at the top with other global variables
    let countdownInterval = null;

    // Load saved diary entries
    function loadDiaryEntries() {
        // Try to load from cache first
        const cachedEntries = localStorage.getItem('diaryEntries');
        if (cachedEntries) {
            savedDiaryEntries = JSON.parse(cachedEntries);
        }

        const diaryEntries = document.getElementById('diaryEntries');
        diaryEntries.innerHTML = '';
        savedDiaryEntries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'diary-entry';
            entryElement.innerHTML = `
                <div class="entry-date">${entry.date}</div>
                <div class="entry-content">${entry.content}</div>
                <button class="delete-entry" onclick="deleteEntry('${entry.id}')">❌</button>
            `;
            diaryEntries.appendChild(entryElement);
        });
    }

    // Save diary entry with caching
    window.addDiaryEntry = function() {
        const textarea = document.querySelector('.diary-input textarea');
        const content = textarea.value.trim();
        
        if (content) {
            const newEntry = {
                id: Date.now().toString(),
                date: new Date().toLocaleDateString(),
                content: content
            };
            
            // Load existing entries from cache
            let entries = [];
            const cachedEntries = localStorage.getItem('diaryEntries');
            if (cachedEntries) {
                entries = JSON.parse(cachedEntries);
            }
            
            // Add new entry at the beginning
            entries.unshift(newEntry);
            savedDiaryEntries = entries;
            
            // Update cache
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            
            textarea.value = '';
            loadDiaryEntries();
        }
    };

    // Delete diary entry
    window.deleteEntry = function(id) {
        if (confirm('Are you sure you want to delete this entry?')) {
            savedDiaryEntries = savedDiaryEntries.filter(entry => entry.id !== id);
            localStorage.setItem('diaryEntries', JSON.stringify(savedDiaryEntries));
            loadDiaryEntries();
        }
    };

    // Initialize calendar with saved events and caching
    function initCalendarWithEvents() {
        // Try to load calendar events from cache
        const cachedEvents = localStorage.getItem('calendarEvents');
        if (cachedEvents) {
            savedEvents = JSON.parse(cachedEvents);
        } else {
            // Initialize with empty events array
            savedEvents = [];
            localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
        }

        const calendarEl = document.querySelector('.calendar-container');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },
            events: savedEvents,
            eventColor: '#ff6b6b',
            eventClick: function(info) {
                const event = info.event;
                const details = event.extendedProps?.details || '';
                const time = event.extendedProps?.time || '';
                
                if (confirm(`Would you like to remove this date?\n\nDate: ${event.startStr}\nTime: ${time}\nDetails: ${details}`)) {
                    info.event.remove();
                    savedEvents = savedEvents.filter(e => 
                        !(e.start === event.startStr && 
                          e.extendedProps?.time === time && 
                          e.extendedProps?.details === details)
                    );
                    // Update cache after deletion
                    localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
                    // Update countdown after deletion
                    updateNextDateCountdown();
                }
            },
            eventDidMount: function(info) {
                if (info.event.extendedProps?.details) {
                    info.el.title = `Time: ${info.event.extendedProps.time || 'Not specified'}
Details: ${info.event.extendedProps.details}`;
                }
            },
            dateClick: function(info) {
                const time = prompt('What time would you like to schedule the virtual date? (e.g., 19:00)', '');
                if (time !== null) {
                    const details = prompt('Add any notes for this date:', '');
                    if (details !== null) {
                        const [hours, minutes] = time.split(':').map(num => parseInt(num)) || [0, 0];
                        const eventDate = new Date(info.dateStr);
                        eventDate.setHours(hours || 0);
                        eventDate.setMinutes(minutes || 0);
                        
                        // Clear existing events first
                        savedEvents = [];
                        calendar.removeAllEvents();
                        
                        const newEvent = {
                            title: 'Virtual Date ❤️',
                            start: eventDate.toISOString(),
                            allDay: false,
                            extendedProps: {
                                time: time,
                                details: details
                            }
                        };
                        calendar.addEvent(newEvent);
                        savedEvents.push(newEvent);
                        // Update cache with new event
                        localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
                        // Update countdown for new event
                        updateNextDateCountdown();
                    }
                }
            }
        });
        calendar.render();
        
        // Store calendar instance on the element
        calendarEl._calendar = calendar;
        
        // Initialize countdown with calendar events
        updateNextDateCountdown();
    }

    // Photo Gallery Functions
    function initPhotoGallery() {
        const photoSection = document.createElement('div');
        photoSection.className = 'gallery-section';
        photoSection.innerHTML = `
            <h2>Our Photo Gallery 📸</h2>
            <div class="gallery-input">
                <input type="file" id="photoUpload" accept="image/*" style="display: none;">
                <div class="file-input-wrapper">
                    <button onclick="document.getElementById('photoUpload').click()">Choose Photo</button>
                    <span id="fileName">No file chosen</span>
                </div>
                <input type="text" placeholder="Add a caption" id="photoCaption">
                <button onclick="handlePhotoUpload()">Add Photo</button>
            </div>
            <div class="gallery-container" id="galleryContainer">
                <div class="slideshow-container">
                    <div class="slide-nav">
                        <button onclick="changeSlide(-1)">❮</button>
                        <button onclick="changeSlide(1)">❯</button>
                    </div>
                    <div class="slide-dots"></div>
                </div>
            </div>
        `;
        
        // Insert before the love quote
        const loveQuote = document.querySelector('.love-quote');
        loveQuote.parentNode.insertBefore(photoSection, loveQuote);
        
        // Handle file selection
        const fileInput = document.getElementById('photoUpload');
        fileInput.addEventListener('change', (event) => {
            const fileName = event.target.files[0]?.name || 'No file chosen';
            document.getElementById('fileName').textContent = fileName;
        });

        loadSavedPhotos();
        startSlideshow();
    }

    let currentSlide = 0;
    let slideshowInterval;

    function startSlideshow() {
        if (savedPhotos.length > 0) {
            showSlide(currentSlide);
            slideshowInterval = setInterval(() => {
                changeSlide(1);
            }, 5000); // Change slide every 5 seconds
        }
    }

    window.changeSlide = function(direction) {
        clearInterval(slideshowInterval);
        currentSlide = (currentSlide + direction + savedPhotos.length) % savedPhotos.length;
        showSlide(currentSlide);
        startSlideshow();
    };

    window.goToSlide = function(index) {
        clearInterval(slideshowInterval);
        currentSlide = index;
        showSlide(currentSlide);
        startSlideshow();
    };

    function showSlide(index) {
        const slideshowContainer = document.querySelector('.slideshow-container');
        
        // Clear any existing content
        slideshowContainer.innerHTML = '';
        
        if (savedPhotos.length === 0) {
            slideshowContainer.innerHTML = `
                <div class="empty-gallery">
                    <h3>No photos yet</h3>
                    <p>Add your special moments to start the slideshow! 📸</p>
                </div>
            `;
            return;
        }

        // Add navigation buttons
        const navButtons = document.createElement('div');
        navButtons.className = 'slide-nav';
        navButtons.innerHTML = `
            <button onclick="changeSlide(-1)">❮</button>
            <button onclick="changeSlide(1)">❯</button>
        `;
        slideshowContainer.appendChild(navButtons);

        // Add slides
        savedPhotos.forEach((photo, i) => {
            const slide = document.createElement('div');
            slide.className = `slide ${i === index ? 'active' : ''}`;
            slide.innerHTML = `
                <img src="${photo.src}" alt="${photo.caption}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNmZjZiNmIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3Qgc3VwcG9ydGVkPC90ZXh0Pjwvc3ZnPg=='">
                <div class="slide-info">
                    <h3>${photo.caption}</h3>
                    <small>Added on ${photo.date}</small>
                    <button class="delete-slide" onclick="deletePhoto(${photo.id})">Delete Photo</button>
                </div>
            `;
            slideshowContainer.appendChild(slide);
        });

        // Add dots navigation
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slide-dots';
        dotsContainer.innerHTML = savedPhotos.map((_, i) => `
            <div class="dot ${i === index ? 'active' : ''}" onclick="goToSlide(${i})"></div>
        `).join('');
        slideshowContainer.appendChild(dotsContainer);
    }

    function loadSavedPhotos() {
        // Clear localStorage to ensure fresh start
        localStorage.removeItem('photos');
        
        // Reset savedPhotos array with the initial photos
        savedPhotos = [
            {
                id: 1,
                src: 'IMG_9091.JPG',
                date: new Date().toLocaleDateString(),
                caption: 'Our Special Moment ❤️'
            },
            {
                id: 2,
                src: 'IMG_8538.jpg',
                date: new Date().toLocaleDateString(),
                caption: 'Beautiful Memories 💕'
            },
            {
                id: 3,
                src: 'IMG_8422.jpg',
                date: new Date().toLocaleDateString(),
                caption: 'Together Forever 💑'
            },
            {
                id: 4,
                src: 'IMG_8512.jpg',
                date: new Date().toLocaleDateString(),
                caption: 'Just Us 💖'
            },
            {
                id: 5,
                src: 'IMG_8473.jpg',
                date: new Date().toLocaleDateString(),
                caption: 'Love & Laughter 😊'
            },
            {
                id: 6,
                src: 'IMG_8540.jpg',
                date: new Date().toLocaleDateString(),
                caption: 'Perfect Moments ✨'
            },
            {
                id: 7,
                src: 'IMG_9037.jpg',
                date: new Date().toLocaleDateString(),
                caption: 'Forever & Always 💫'
            }
        ];
        
        // Update localStorage with the initial photos
        localStorage.setItem('photos', JSON.stringify(savedPhotos));
        
        // Show the first slide
        showSlide(currentSlide);
    }

    window.handlePhotoUpload = function() {
        const fileInput = document.getElementById('photoUpload');
        const captionInput = document.getElementById('photoCaption');
        const file = fileInput.files[0];
        
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newPhoto = {
                    id: Date.now(),
                    src: e.target.result,
                    date: new Date().toLocaleDateString(),
                    caption: captionInput.value.trim() || 'Our Special Moment'
                };
                
                savedPhotos.unshift(newPhoto);
                localStorage.setItem('photos', JSON.stringify(savedPhotos));
                
                // Clear inputs
                fileInput.value = '';
                captionInput.value = '';
                document.getElementById('fileName').textContent = 'No file chosen';
                
                loadSavedPhotos();
                if (savedPhotos.length === 1) {
                    startSlideshow();
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file');
        }
    };

    window.deletePhoto = function(photoId) {
        const photo = savedPhotos.find(p => p.id === photoId);
        if (confirm(`Are you sure you want to delete this photo?\n\nCaption: ${photo.caption}\nAdded on: ${photo.date}`)) {
            const index = savedPhotos.findIndex(p => p.id === photoId);
            
            // Update currentSlide if needed
            if (savedPhotos.length <= 1) {
                // If this is the last photo, clear the slideshow
                clearInterval(slideshowInterval);
                currentSlide = 0;
            } else if (index <= currentSlide) {
                // If we're deleting the current slide or one before it,
                // adjust the current slide index
                currentSlide = Math.max(0, currentSlide - 1);
            }
            
            // Remove the photo
            savedPhotos = savedPhotos.filter(photo => photo.id !== photoId);
            localStorage.setItem('photos', JSON.stringify(savedPhotos));
            
            // Update the display
            loadSavedPhotos();
            
            // Show a message
            const message = savedPhotos.length === 0 ? 
                'All photos have been removed. Add new photos to start the slideshow!' :
                'Photo deleted successfully!';
            
            // Create and show a temporary message
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-color);
                color: white;
                padding: 1rem 2rem;
                border-radius: 30px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                animation: fadeInOut 3s forwards;
            `;
            messageDiv.textContent = message;
            document.body.appendChild(messageDiv);
            
            // Remove the message after animation
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
            
            // Restart slideshow if there are still photos
            if (savedPhotos.length > 0) {
                startSlideshow();
            }
        }
    };

    // Add this CSS to handle the message animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            15% { opacity: 1; transform: translate(-50%, 0); }
            85% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -20px); }
        }
    `;
    document.head.appendChild(style);

    // Playlist Functions
    function initPlaylist() {
        const musicSection = document.createElement('div');
        musicSection.className = 'playlist-section';
        musicSection.innerHTML = `
            <h2>Our Playlist 🎵</h2>
            <div class="playlist-input">
                <input type="text" placeholder="Song name" id="songName">
                <input type="text" placeholder="Artist" id="songArtist">
                <input type="text" placeholder="YouTube or Spotify link (optional)" id="songLink">
                <button onclick="addSong()">Add Song</button>
            </div>
            <div class="playlist-container" id="playlistContainer"></div>
        `;
        
        // Insert before the love quote
        const loveQuote = document.querySelector('.love-quote');
        loveQuote.parentNode.insertBefore(musicSection, loveQuote);
        
        loadPlaylist();
    }

    window.addSong = function() {
        const name = document.getElementById('songName').value.trim();
        const artist = document.getElementById('songArtist').value.trim();
        const link = document.getElementById('songLink').value.trim();
        
        if (name && artist) {
            const newSong = {
                id: Date.now(),
                name: name,
                artist: artist,
                link: link,
                addedDate: new Date().toLocaleDateString(),
                addedBy: 'Raunak'
            };
            
            playlist.unshift(newSong);
            localStorage.setItem('playlist', JSON.stringify(playlist));
            loadPlaylist();
            
            // Clear inputs
            document.getElementById('songName').value = '';
            document.getElementById('songArtist').value = '';
            document.getElementById('songLink').value = '';
        }
    };

    function loadPlaylist() {
        const container = document.getElementById('playlistContainer');
        container.innerHTML = playlist.map(song => `
            <div class="song-card">
                <div class="song-info">
                    <h3>${song.name}</h3>
                    <p>${song.artist}</p>
                    <small>Added by ${song.addedBy} on ${song.addedDate}</small>
                </div>
                ${song.link ? `
                    <a href="${song.link}" target="_blank" class="song-link">
                        <span class="play-icon">▶️</span>
                    </a>
                ` : ''}
                <button class="delete-song" onclick="deleteSong(${song.id})">❌</button>
            </div>
        `).join('');
    }

    window.deleteSong = function(songId) {
        if (confirm('Are you sure you want to remove this song from the playlist?')) {
            playlist = playlist.filter(song => song.id !== songId);
            localStorage.setItem('playlist', JSON.stringify(playlist));
            loadPlaylist();
        }
    };

    // Initialize gifts
    function initGifts() {
        const giftItems = document.querySelectorAll('.gift-item');
        const animationContainer = document.getElementById('animation-container');
        
        if (!animationContainer) {
            console.error('Animation container not found!');
            return;
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

    function createGiftAnimation(type, x, y) {
        const animationContainer = document.getElementById('animation-container');
        if (!animationContainer) return;

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

    // Initialize all features
    verifyCacheStatus();
    initCalendarWithEvents();
    loadDiaryEntries();
    initPhotoGallery();
    initPlaylist();
    initGifts();

    const messages = [
        "Parinita, you make my heart skip a beat! ",
        "Every moment with you is magical, my love! ",
        "You're the most special person in my life, Parinita! ",
        "Can't wait for our next virtual date together! ",
        "You light up my world with your smile! ",
        "Distance means nothing when someone means everything ",
        "Your love makes every day beautiful! ",
        "Forever yours, Raunak "
    ];

    const heartCharacters = ['❤️', '💖', '💗', '💓', '💝', '💕'];

    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartCharacters[Math.floor(Math.random() * heartCharacters.length)];
        
        const startX = Math.random() * window.innerWidth;
        const duration = 10 + Math.random() * 5;
        const rotation = (Math.random() - 0.5) * 360;
        
        heart.style.setProperty('--duration', `${duration}s`);
        heart.style.setProperty('--rotation', `${rotation}deg`);
        heart.style.left = `${startX}px`;
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    function showResponse() {
        messageCount = (messageCount + 1) % messages.length;
        response.textContent = messages[messageCount];
        response.classList.add('visible');
        
        for(let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFloatingHeart();
            }, i * 300);
        }

        if (!musicStarted) {
            music.play()
                .then(() => {
                    musicStarted = true;
                    musicContainer.classList.add('visible');
                })
                .catch(error => {
                    console.log("Music playback failed:", error);
                });
        }
    }

    setInterval(createFloatingHeart, 3000);

    for(let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * 500);
    }

    button.addEventListener('click', showResponse);

    window.togglePlay = function() {
        if (music.paused) {
            music.play()
                .then(() => {
                    musicStarted = true;
                })
                .catch(error => {
                    console.log("Music playback failed:", error);
                });
        } else {
            music.pause();
        }
    };

    window.toggleSection = function(sectionId) {
        const content = document.getElementById(sectionId);
        const header = content.previousElementSibling;
        const allContents = document.querySelectorAll('.date-content');
        const allHeaders = document.querySelectorAll('.date-header');
        
        allContents.forEach(item => {
            if (item.id !== sectionId) {
                item.classList.remove('active');
            }
        });
        
        allHeaders.forEach(item => {
            if (item !== header) {
                item.classList.remove('active');
            }
        });
        
        content.classList.toggle('active');
        header.classList.toggle('active');
    };

    const giftEmojis = {
        flower: '🌹',
        teddy: '🧸',
        star: '⭐',
        chocolate: '🍫',
        heart: '❤️',
        hug: '🤗'
    };

    function createMultipleGifts(type, x, y) {
        const count = 5;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const offsetX = x + (Math.random() - 0.5) * 100;
                const offsetY = y + (Math.random() - 0.5) * 100;
                createGiftAnimation(type, offsetX, offsetY);
            }, i * 200);
        }
    }

    // Add cache cleanup function
    window.clearCache = function() {
        if (confirm('Are you sure you want to clear all cached data? This will remove all diary entries and calendar events.')) {
            localStorage.removeItem('diaryEntries');
            localStorage.removeItem('calendarEvents');
            savedDiaryEntries = [];
            savedEvents = [];
            loadDiaryEntries();
            initCalendarWithEvents();
        }
    };

    // Function to verify cache status
    function verifyCacheStatus() {
        const diaryCache = localStorage.getItem('diaryEntries');
        const calendarCache = localStorage.getItem('calendarEvents');
        
        console.log('Diary Cache Status:', diaryCache ? 'Active' : 'Empty');
        console.log('Calendar Cache Status:', calendarCache ? 'Active' : 'Empty');
        
        if (diaryCache) {
            console.log('Number of diary entries:', JSON.parse(diaryCache).length);
        }
        
        if (calendarCache) {
            console.log('Number of calendar events:', JSON.parse(calendarCache).length);
        }
    }

    // Function to find and update next date countdown
    function updateNextDateCountdown() {
        // Clear any existing interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        const now = new Date().getTime();
        let nextDate = null;
        let nextEventDetails = null;
        
        // Load events from cache
        const cachedEvents = localStorage.getItem('calendarEvents');
        if (cachedEvents) {
            const events = JSON.parse(cachedEvents);
            
            // Find the next upcoming event
            for (const event of events) {
                const eventDate = new Date(event.start);
                
                if (eventDate.getTime() > now) {
                    if (!nextDate || eventDate.getTime() < nextDate.getTime()) {
                        nextDate = eventDate;
                        nextEventDetails = {
                            time: event.extendedProps?.time || '',
                            details: event.extendedProps?.details || ''
                        };
                    }
                }
            }
        }

        // Update the countdown title with event details
        const countdownTitle = document.querySelector('.countdown-section h2');
        if (countdownTitle) {
            if (nextDate) {
                const formattedDate = nextDate.toLocaleDateString();
                const formattedTime = nextEventDetails.time;
                countdownTitle.innerHTML = `Next Date Countdown 💕<br>
                    <small style="font-size: 0.8em; color: #ff6b6b;">
                        ${formattedDate} at ${formattedTime}
                        ${nextEventDetails.details ? `<br>${nextEventDetails.details}` : ''}
                    </small>`;
            } else {
                countdownTitle.innerHTML = `Next Date Countdown 💕`;
            }
        }

        function updateCountdown() {
            const currentTime = new Date().getTime();
            
            if (!nextDate) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }

            const distance = nextDate.getTime() - currentTime;

            // Handle case when countdown is complete
            if (distance < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                
                // Clear interval and check for next event
                clearInterval(countdownInterval);
                updateNextDateCountdown();
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

        // Update immediately and then every second
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Add manual date update function
    window.updateManualDate = function() {
        const dateInput = document.getElementById('nextDateInput');
        const timeInput = document.getElementById('nextTimeInput');
        const detailsInput = document.getElementById('nextDateDetails');
        
        if (!dateInput.value || !timeInput.value) {
            alert('Please select both date and time!');
            return;
        }
        
        const [hours, minutes] = timeInput.value.split(':');
        const eventDate = new Date(dateInput.value);
        eventDate.setHours(parseInt(hours));
        eventDate.setMinutes(parseInt(minutes));
        
        const newEvent = {
            title: 'Virtual Date ❤️',
            start: eventDate.toISOString(),
            allDay: false,
            extendedProps: {
                time: timeInput.value,
                details: detailsInput.value.trim()
            }
        };
        
        // Clear existing events
        savedEvents = [];
        localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
        
        // Add new event
        savedEvents.push(newEvent);
        localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
        
        // Update calendar display
        const calendarEl = document.querySelector('.calendar-container');
        if (calendarEl) {
            const calendar = calendarEl._calendar;
            if (calendar) {
                calendar.removeAllEvents();
                calendar.addEvent(newEvent);
            }
        }
        
        // Update countdown
        updateNextDateCountdown();
        
        // Clear inputs
        dateInput.value = '';
        timeInput.value = '';
        detailsInput.value = '';
        
        // Show success message
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: fadeInOut 3s forwards;
        `;
        messageDiv.textContent = 'Date updated successfully!';
        document.body.appendChild(messageDiv);
        
        // Remove message after animation
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    };
});
