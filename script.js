document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('dateButton');
    const response = document.getElementById('response');
    const music = document.getElementById('backgroundMusic');
    const musicContainer = document.querySelector('.music-container');
    const heartsContainer = document.querySelector('.hearts-background');
    let messageCount = 0;
    let musicStarted = false;

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
        
        // Random position and animation duration
        const startX = Math.random() * window.innerWidth;
        const duration = 10 + Math.random() * 5;
        const rotation = (Math.random() - 0.5) * 360;
        
        heart.style.setProperty('--duration', `${duration}s`);
        heart.style.setProperty('--rotation', `${rotation}deg`);
        heart.style.left = `${startX}px`;
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    function showResponse() {
        messageCount = (messageCount + 1) % messages.length;
        response.textContent = messages[messageCount];
        response.classList.add('visible');
        
        // Create multiple hearts
        for(let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFloatingHeart();
            }, i * 300);
        }

        startMusicAndShowTitle();
    }

    function startMusicAndShowTitle() {
        if (!musicStarted) {
            music.play()
                .then(() => {
                    musicStarted = true;
                    musicContainer.classList.add('visible');
                })
                .catch(error => {
                    console.log("Music playback failed:", error);
                });
        } else if (!musicContainer.classList.contains('visible')) {
            musicContainer.classList.add('visible');
        }
    }

    // Add click listeners to all interactive elements
    document.querySelectorAll('.btn, .date-header').forEach(element => {
        element.addEventListener('click', startMusicAndShowTitle);
    });

    // Create periodic floating hearts
    setInterval(createFloatingHeart, 3000);

    // Initial hearts
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
        
        // Start music and show title when section is toggled
        startMusicAndShowTitle();
    };
});
