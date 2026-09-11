document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn?.querySelector('i');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            
            if (themeIcon) {
                themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        });
    }

    // 2. WhatsApp Welcome Toast Close
    const closeToastBtn = document.getElementById('closeToastBtn');
    const waWelcomeToast = document.getElementById('waWelcomeToast');

    if (closeToastBtn && waWelcomeToast) {
        closeToastBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            waWelcomeToast.style.display = 'none';
        });
    }

    // 3. Specialty Modals
    const specialtyCards = document.querySelectorAll('.card-interactive');
    const specialtyModal = document.getElementById('specialtyDetailsModal');
    const specialtyModalBody = document.getElementById('specialtyModalBody');

    const specialtyData = {
        'glass': {
            title: 'أعمال الزجاج والسكريت',
            content: 'نقدم حلولاً متقدمة في تفصيل وتركيب الزجاج السكريت والاستركشر، بما في ذلك الواجهات الخارجية، الدربزينات الزجاجية، وقواطع المكاتب بأنظمة متنوعة تضمن الأمان والجمالية.'
        },
        'decor': {
            title: 'التصميم والديكور الداخلي (WPC)',
            content: 'تكسيات WPC وبديل الخشب والرخام توفر مظهراً طبيعياً مع متانة عالية ومقاومة للعوامل الجوية، مثالية للواجهات الخارجية والديكورات الداخلية الحديثة.'
        },
        'aluminum': {
            title: 'الألمنيوم والواجهات الخارجية',
            content: 'تركيب قطاعات الألمنيوم سرايا وجامبو مع زجاج دبل جلاس عازل للحرارة والصوت، وتصنيع الأبواب والنوافذ والواجهات المعدنية وفق المخططات الهندسية.'
        }
    };

    specialtyCards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-specialty-trigger');
            const data = specialtyData[type];
            if (data && specialtyModalBody) {
                specialtyModalBody.innerHTML = `
                    <h3 style="margin-top: 0; color: #c99b68; font-size: 1.8rem;">${data.title}</h3>
                    <p style="font-size: 1.1rem; line-height: 1.8; color: #ddd;">${data.content}</p>
                `;
                specialtyModal.classList.add('active');
            }
        });
    });

    window.closeSpecialtyModal = () => {
        if (specialtyModal) specialtyModal.classList.remove('active');
    };

    // 4. Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioFeed = document.getElementById('portfolioFeed');

    const portfolioItems = [
        { type: 'glass', img: '/static/glass-office_ff88266f_aac6aeb9.jpg', title: 'واجهة مكتب زجاجية' },
        { type: 'aluminum', img: '/static/glass-facade_1281cb63_3c523186.jpg', title: 'واجهات ألمنيوم مودرن' },
        { type: 'decor', img: '/static/mathabah-architectural-texture_423c537d_e9b373de.webp', title: 'تكسيات WPC خارجية' }
    ];

    function renderPortfolio(filter = 'all') {
        if (!portfolioFeed) return;
        portfolioFeed.innerHTML = '';
        const items = filter === 'all' ? portfolioItems : portfolioItems.filter(i => i.type === filter);
        
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card-architectural';
            card.innerHTML = `
                <img src="${item.img}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;">
                <h4 style="margin: 15px 0 0; color: #c99b68;">${item.title}</h4>
            `;
            portfolioFeed.appendChild(card);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPortfolio(btn.getAttribute('data-filter'));
        });
    });

    renderPortfolio();

    // 5. Scroll Top
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
