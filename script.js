document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeSidebar = document.getElementById('close-sidebar');
    const timelineContainer = document.getElementById('timeline-container');

    // 1. Theme Handling (Updated to default Dark Mode)
    // If no theme is saved, default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun'; // Show Sun icon in Dark Mode
        } else {
            icon.className = 'fa-solid fa-moon'; // Show Moon icon in Light Mode
        }
    }

    // 2. Sidebar Handling
    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    menuToggle.addEventListener('click', toggleMenu);
    closeSidebar.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // 3. Fetch and Render Data
    async function loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            
            // Update Hero Info
            document.getElementById('hero-title').textContent = data.project_info.title;
            document.getElementById('hero-subtitle').textContent = data.project_info.subtitle;
            document.getElementById('footer-text').textContent = data.project_info.footer_text;
            document.title = data.project_info.title;

            // Render Timeline
            renderTimeline(data.events);

        } catch (error) {
            console.error('Error loading ', error);
            timelineContainer.innerHTML = '<p style="text-align:center; color:red;">هەڵەیەک ڕوویدا لە بارکردنی زانیارییەکان</p>';
        }
    }

    function renderTimeline(events) {
        timelineContainer.innerHTML = ''; // Clear loader
        
        events.forEach((event, index) => {
            const card = document.createElement('div');
            card.className = 'event-card';
            
            // Staggered animation delay
            card.style.transitionDelay = `${index * 0.05}s`;

            // Updated HTML structure for the new design
            card.innerHTML = `
                <div class="content">
                    <div class="card-header">
                        <span class="event-icon">${event.icon}</span>
                        <span class="year-badge">${event.year} | ${event.age}</span>
                    </div>
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                </div>
            `;
            
            timelineContainer.appendChild(card);
        });

        // Trigger Scroll Animation
        observeCards();
    }

    // 4. Scroll Animation Observer
    function observeCards() {
        const cards = document.querySelectorAll('.event-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Stop observing after it becomes visible once
                    // observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the card is visible

        cards.forEach(card => observer.observe(card));
    }

    // Initial Load
    loadData();
});
