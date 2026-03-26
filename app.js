// Telegram WebApp
const tg = window.Telegram.WebApp;

// Vibrate Helper (Haptic Feedback)
function hapticFeedback() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// App State
let currentUser = null;
let currentPage = 'home';
let currentTheme = 'light';
let userData = {
    coin: 0,
    usdt: 0,
    star: 0,
    level: 1,
    streak: 0,
    referrals: 0,
    lastSpin: null,
    transactions: [],
    completedTasks: [],
    claimedMilestones: []
};

// Sample Data
const sampleTasks = {
    social: [
        { id: 'follow_twitter', title: 'Follow on Twitter', description: 'Follow our Twitter account', reward: 50, currency: 'Coin', type: 'social' },
        { id: 'join_telegram', title: 'Join Telegram Channel', description: 'Join our official Telegram channel', reward: 30, currency: 'Coin', type: 'social' },
        { id: 'share_post', title: 'Share Post', description: 'Share our post on your story', reward: 25, currency: 'Coin', type: 'social' }
    ],
    daily: [
        { id: 'daily_login', title: 'Daily Login', description: 'Login to the app today', reward: 10, currency: 'Coin', type: 'daily' },
        { id: 'watch_video', title: 'Watch Video', description: 'Watch a promotional video', reward: 15, currency: 'Coin', type: 'daily' },
        { id: 'play_game', title: 'Play Mini Game', description: 'Complete a mini game', reward: 20, currency: 'Coin', type: 'daily' }
    ],
    offerwall: [
        { id: 'install_app1', title: 'Install App 1', description: 'Download and install App 1', reward: 100, currency: 'Coin', type: 'offerwall' },
        { id: 'install_app2', title: 'Install App 2', description: 'Download and install App 2', reward: 75, currency: 'Coin', type: 'offerwall' }
    ],
    ads: [
        { id: 'watch_ad1', title: 'Watch Ad 1', description: 'Watch a 30-second ad', reward: 40, currency: 'Coin', type: 'ads' },
        { id: 'watch_ad2', title: 'Watch Ad 2', description: 'Watch a 60-second ad', reward: 80, currency: 'Coin', type: 'ads' }
    ]
};

const sampleMilestones = [
    { referrals: 1, description: 'Invite 1 friend', reward: 50, currency: 'Coin' },
    { referrals: 5, description: 'Invite 5 friends', reward: 200, currency: 'Coin' },
    { referrals: 10, description: 'Invite 10 friends', reward: 500, currency: 'Coin' },
    { referrals: 25, description: 'Invite 25 friends', reward: 1500, currency: 'Coin' },
    { referrals: 50, description: 'Invite 50 friends', reward: 3000, currency: 'Coin' }
];

// DOM Elements
const app = document.getElementById('app');
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
const loadingOverlay = document.getElementById('loading-overlay');
const withdrawModal = document.getElementById('withdraw-modal');
const withdrawForm = document.getElementById('withdraw-form');

// Initialize App
async function initApp() {
    try {
        // Set Telegram theme
        tg.ready();
        tg.expand();

        // Load user data from localStorage
        loadUserData();

        // Setup event listeners
        setupEventListeners();

        // Start banner slider
        startBannerSlider();

        // Hide loading
        loadingOverlay.style.display = 'none';

        // Show app
        app.style.display = 'block';

    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to initialize app');
    }
}

// Load User Data
function loadUserData() {
    // Try to get user from Telegram
    const user = tg.initDataUnsafe?.user;

    if (user) {
        currentUser = {
            id: user.id,
            username: user.username || `user_${user.id}`,
            firstName: user.first_name,
            lastName: user.last_name,
            photoUrl: user.photo_url
        };

        // Load user data from localStorage
        const savedData = localStorage.getItem(`user_${currentUser.id}`);
        if (savedData) {
            userData = { ...userData, ...JSON.parse(savedData) };
        } else {
            // Initialize new user
            userData.coin = 100; // Starting bonus
            saveUserData();
        }
    } else {
        // Demo mode without Telegram
        currentUser = {
            id: 'demo',
            username: 'Demo User',
            firstName: 'Demo',
            lastName: 'User'
        };
        const savedData = localStorage.getItem('demo_user');
        if (savedData) {
            userData = { ...userData, ...JSON.parse(savedData) };
        } else {
            userData.coin = 100;
            saveUserData();
        }
    }

    updateUI();
}

// Save User Data
function saveUserData() {
    const key = currentUser.id === 'demo' ? 'demo_user' : `user_${currentUser.id}`;
    localStorage.setItem(key, JSON.stringify(userData));
}

// Update UI
function updateUI() {
    // Update balances
    document.getElementById('coin-balance').textContent = userData.coin.toLocaleString();
    document.getElementById('usdt-balance').textContent = userData.usdt.toFixed(2);
    document.getElementById('star-balance').textContent = userData.star;

    // Update profile
    document.getElementById('user-name').textContent = currentUser.firstName || currentUser.username;
    document.getElementById('user-level').textContent = `Level ${userData.level}`;
    document.getElementById('streak-count').textContent = userData.streak;

    // Update referral link
    const referralLink = currentUser.id === 'demo' ?
        'https://t.me/demo_bot?start=demo' :
        `https://t.me/your_bot?start=${currentUser.id}`;
    document.getElementById('referral-link').value = referralLink;

    // Load tasks and other data
    loadTasks();
    loadMilestones();
    loadLeaderboard();
    loadTransactionHistory();
}

// Navigation
function setupEventListeners() {
    // Navigation with Haptic
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hapticFeedback();
            const page = btn.dataset.page;
            switchPage(page);
        });
    });

    // Quick actions with Haptic
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            hapticFeedback();
            const action = btn.dataset.action;
            handleQuickAction(action);
        });
    });

    // Earn tabs with Haptic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            hapticFeedback();
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Profile menu with Haptic
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            hapticFeedback();
            const menu = item.dataset.menu;
            showProfilePanel(menu);
        });
    });

    // Theme options with Haptic
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            hapticFeedback();
            const theme = option.dataset.theme;
            changeTheme(theme);
        });
    });

    // Copy referral link with Haptic
    document.getElementById('copy-link').addEventListener('click', () => {
        hapticFeedback();
        copyReferralLink();
    });

    // Spin button with Haptic
    document.getElementById('spin-btn').addEventListener('click', () => {
        hapticFeedback();
        spinWheel();
    });

    // Withdraw form with Haptic
    withdrawForm.addEventListener('submit', (e) => {
        hapticFeedback();
        handleWithdraw(e);
    });

    // Withdraw amount change
    document.getElementById('withdraw-amount').addEventListener('input', updateWithdrawFee);

    // Modal close buttons with Haptic
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            hapticFeedback();
            const modalId = btn.dataset.modal;
            document.getElementById(modalId).classList.remove('active');
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hapticFeedback();
                modal.classList.remove('active');
            }
        });
    });
}

function switchPage(page) {
    // Update navigation
    navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    // Update pages
    pages.forEach(p => {
        p.classList.toggle('active', p.id === page);
    });

    currentPage = page;
}

function handleQuickAction(action) {
    switch (action) {
        case 'earn':
            switchPage('earn');
            break;
        case 'withdraw':
            showWithdrawModal();
            break;
        case 'invite':
            switchPage('friends');
            break;
    }
}

function switchTab(tab) {
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update task lists
    document.querySelectorAll('.task-list').forEach(list => {
        list.classList.toggle('active', list.id === `${tab}-tasks`);
    });
}

function showProfilePanel(panel) {
    // Hide all panels
    document.querySelectorAll('.settings-panel, .theme-panel, .history-panel').forEach(p => {
        p.style.display = 'none';
    });

    // Show selected panel
    const panelElement = document.getElementById(`${panel}-panel`);
    if (panelElement) {
        panelElement.style.display = 'block';
    }
}

function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;

    // Update active theme option
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.toggle('active', option.dataset.theme === theme);
    });

    // Save theme preference
    localStorage.setItem('theme', theme);
}

// Banner Slider
function startBannerSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto slide
    setInterval(nextSlide, 3000);

    // Dot click
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// Tasks System
function loadTasks() {
    // Load social tasks
    renderTasks('social-tasks', sampleTasks.social);

    // Load daily tasks
    renderTasks('daily-tasks', sampleTasks.daily);

    // Load offerwall tasks
    renderTasks('offerwall-tasks', sampleTasks.offerwall);

    // Load ads tasks
    renderTasks('ads-tasks', sampleTasks.ads);
}

function renderTasks(containerId, tasks) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        container.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.innerHTML = `
        <div class="task-info">
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <div class="task-reward">
                <span class="reward-amount">+${task.reward} ${task.currency}</span>
            </div>
        </div>
        <button class="task-btn" data-task-id="${task.id}">
            ${userData.completedTasks.includes(task.id) ? 'Completed' : 'Complete'}
        </button>
    `;

    const btn = div.querySelector('.task-btn');
    if (!userData.completedTasks.includes(task.id)) {
        btn.addEventListener('click', () => completeTask(task.id, task));
    } else {
        btn.disabled = true;
    }

    return div;
}

function completeTask(taskId, task) {
    // Mark task as completed
    if (!userData.completedTasks.includes(taskId)) {
        userData.completedTasks.push(taskId);

        // Add reward
        userData[task.currency.toLowerCase()] += task.reward;

        // Add transaction
        userData.transactions.push({
            type: 'Task Completion',
            amount: task.reward,
            currency: task.currency,
            timestamp: new Date().toISOString()
        });

        // Save data
        saveUserData();

        // Update UI
        updateUI();

        // Show success message
        showSuccess(`Task completed! +${task.reward} ${task.currency}`);
    }
}

// Referral System
function loadMilestones() {
    const container = document.getElementById('milestone-list');
    container.innerHTML = '';

    sampleMilestones.forEach(milestone => {
        const milestoneElement = createMilestoneElement(milestone);
        container.appendChild(milestoneElement);
    });
}

function createMilestoneElement(milestone) {
    const div = document.createElement('div');
    div.className = `milestone-card ${userData.claimedMilestones.includes(milestone.referrals) ? 'completed' : ''}`;
    div.innerHTML = `
        <div class="milestone-info">
            <h4>${milestone.referrals} Referrals</h4>
            <p>${milestone.description}</p>
            <div class="milestone-reward">
                <span>+${milestone.reward} ${milestone.currency}</span>
            </div>
        </div>
        <div class="milestone-progress">
            <div class="progress-bar" style="width: ${Math.min((userData.referrals / milestone.referrals) * 100, 100)}%"></div>
        </div>
        ${userData.referrals >= milestone.referrals && !userData.claimedMilestones.includes(milestone.referrals) ?
            '<button class="claim-btn" data-milestone="' + milestone.referrals + '">Claim</button>' : ''}
    `;

    const claimBtn = div.querySelector('.claim-btn');
    if (claimBtn) {
        claimBtn.addEventListener('click', () => claimMilestone(milestone));
    }

    return div;
}

function claimMilestone(milestone) {
    if (userData.referrals >= milestone.referrals && !userData.claimedMilestones.includes(milestone.referrals)) {
        userData.claimedMilestones.push(milestone.referrals);
        userData[milestone.currency.toLowerCase()] += milestone.reward;

        // Add transaction
        userData.transactions.push({
            type: 'Referral Milestone',
            amount: milestone.reward,
            currency: milestone.currency,
            timestamp: new Date().toISOString()
        });

        saveUserData();
        updateUI();
        showSuccess(`Milestone claimed! +${milestone.reward} ${milestone.currency}`);
    }
}

function loadLeaderboard() {
    // Mock leaderboard data
    const leaderboard = [
        { name: 'User 1', referrals: 45 },
        { name: 'User 2', referrals: 38 },
        { name: 'User 3', referrals: 32 },
        { name: currentUser.firstName || currentUser.username, referrals: userData.referrals }
    ].sort((a, b) => b.referrals - a.referrals);

    const container = document.getElementById('leaderboard-list');
    container.innerHTML = '';

    leaderboard.forEach((user, index) => {
        const userElement = createLeaderboardElement(user, index + 1);
        container.appendChild(userElement);
    });
}

function createLeaderboardElement(user, rank) {
    const div = document.createElement('div');
    div.className = 'leaderboard-item';
    div.innerHTML = `
        <div class="rank">#${rank}</div>
        <div class="user-info">
            <span class="user-name">${user.name}</span>
            <span class="user-referrals">${user.referrals} referrals</span>
        </div>
    `;

    return div;
}

function copyReferralLink() {
    const linkInput = document.getElementById('referral-link');
    linkInput.select();
    document.execCommand('copy');

    showSuccess('Referral link copied!');
}

// Gamification
function spinWheel() {
    const now = new Date();
    const lastSpin = userData.lastSpin ? new Date(userData.lastSpin) : null;

    // Check if already spun today
    if (lastSpin && lastSpin.toDateString() === now.toDateString()) {
        showError('You can only spin once per day!');
        return;
    }

    // Generate random reward
    const rewards = [
        { coin: 10, star: 0 },
        { coin: 25, star: 0 },
        { coin: 50, star: 0 },
        { coin: 100, star: 0 },
        { coin: 0, star: 1 },
        { coin: 0, star: 5 }
    ];

    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

    // Update user data
    userData.coin += randomReward.coin || 0;
    userData.star += randomReward.star || 0;
    userData.lastSpin = now.toISOString();

    // Add transactions
    if (randomReward.coin > 0) {
        userData.transactions.push({
            type: 'Daily Spin',
            amount: randomReward.coin,
            currency: 'Coin',
            timestamp: now.toISOString()
        });
    }

    if (randomReward.star > 0) {
        userData.transactions.push({
            type: 'Daily Spin',
            amount: randomReward.star,
            currency: 'Star',
            timestamp: now.toISOString()
        });
    }

    saveUserData();
    updateUI();
    showSuccess(`Spin result: +${randomReward.coin || 0} Coin, +${randomReward.star || 0} Star!`);
}

// Transaction History
function loadTransactionHistory() {
    const container = document.getElementById('transaction-list');
    container.innerHTML = '';

    // Show last 20 transactions
    const recentTransactions = userData.transactions.slice(-20).reverse();

    recentTransactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        container.appendChild(transactionElement);
    });
}

function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `
        <div class="transaction-info">
            <span class="transaction-type">${transaction.type}</span>
            <span class="transaction-amount">${transaction.amount > 0 ? '+' : ''}${transaction.amount} ${transaction.currency}</span>
        </div>
        <div class="transaction-date">${new Date(transaction.timestamp).toLocaleDateString()}</div>
    `;

    return div;
}

// Withdrawal System
function showWithdrawModal() {
    withdrawModal.classList.add('active');
}

function updateWithdrawFee() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value) || 0;
    const fee = Math.ceil(amount * 0.01); // 1% fee in Stars
    document.getElementById('withdraw-fee').textContent = fee;
}

function handleWithdraw(e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const network = document.getElementById('withdraw-network').value;
    const address = document.getElementById('withdraw-address').value;
    const fee = Math.ceil(amount * 0.01);

    if (userData.usdt < amount) {
        showError('Insufficient USDT balance');
        return;
    }

    if (userData.star < fee) {
        showError('Insufficient Stars for fee');
        return;
    }

    // Deduct balances
    userData.usdt -= amount;
    userData.star -= fee;

    // Add transactions
    userData.transactions.push({
        type: 'Withdrawal',
        amount: -amount,
        currency: 'USDT',
        timestamp: new Date().toISOString()
    });

    userData.transactions.push({
        type: 'Withdrawal Fee',
        amount: -fee,
        currency: 'Star',
        timestamp: new Date().toISOString()
    });

    saveUserData();
    updateUI();
    withdrawModal.classList.remove('active');
    showSuccess('Withdrawal request submitted! (Demo mode - no actual withdrawal)');
}

// Utility Functions
function showSuccess(message) {
    // Simple alert for demo
    alert('✅ ' + message);
}

function showError(message) {
    // Simple alert for demo
    alert('❌ ' + message);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
changeTheme(savedTheme);
