/* ========================================
   DASHBOARD JAVASCRIPT
   ======================================== */

// ========== MYSTERY BOX REVEAL ==========
const revealBtn = document.getElementById('revealTheme');
const revealedContent = document.getElementById('revealedContent');

if (revealBtn && revealedContent) {
    revealBtn.addEventListener('click', () => {
        // Hide the mystery question and button
        revealBtn.parentElement.style.opacity = '0';
        
        setTimeout(() => {
            revealBtn.parentElement.style.display = 'none';
            revealedContent.classList.remove('hidden');
            revealedContent.style.opacity = '0';
            
            // Fade in the revealed content
            setTimeout(() => {
                revealedContent.style.transition = 'opacity 0.5s ease';
                revealedContent.style.opacity = '1';
            }, 50);
            
            // Confetti effect
            createConfetti();
            
            // Save reveal state
            localStorage.setItem('februaryBoxRevealed', 'true');
        }, 300);
    });
    
    // Check if already revealed
    if (localStorage.getItem('februaryBoxRevealed') === 'true') {
        revealBtn.parentElement.style.display = 'none';
        revealedContent.classList.remove('hidden');
    }
}

// ========== CONFETTI EFFECT ==========
function createConfetti() {
    const colors = ['#D97706', '#059669', '#DC2626', '#FBBF24', '#34D399'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random()};
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            top: 100vh;
            transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
        }
    }
`;
document.head.appendChild(confettiStyle);

// ========== SIDEBAR ACTIVE STATE ==========
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sections = document.querySelectorAll('.dashboard-section');

// Update active link based on scroll position
function updateActiveLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ========== SUBSCRIPTION MANAGEMENT ==========
const pauseSubscription = document.querySelector('.subscription-actions .btn-secondary:first-child');
const cancelSubscription = document.querySelector('.btn-danger-outline');

if (pauseSubscription) {
    pauseSubscription.addEventListener('click', () => {
        showModal({
            title: 'Pause Subscription',
            message: 'Are you sure you want to pause your subscription? You can resume anytime.',
            confirmText: 'Pause',
            onConfirm: () => {
                showNotification('Subscription paused successfully', 'success');
            }
        });
    });
}

if (cancelSubscription) {
    cancelSubscription.addEventListener('click', () => {
        showModal({
            title: 'Cancel Subscription',
            message: 'We\'re sorry to see you go! Are you sure you want to cancel? You\'ll lose access to exclusive recipes and monthly boxes.',
            confirmText: 'Cancel Subscription',
            isDanger: true,
            onConfirm: () => {
                showNotification('Subscription cancelled. We hope to see you again!', 'info');
            }
        });
    });
}

// ========== MODAL SYSTEM ==========
function showModal({ title, message, confirmText, isDanger = false, onConfirm }) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: var(--surface);
        border-radius: var(--radius-xl);
        padding: var(--space-xl);
        max-width: 400px;
        width: 90%;
        box-shadow: var(--shadow-xl);
        animation: scaleIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: var(--space-md);">${title}</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-xl); line-height: 1.6;">${message}</p>
        <div style="display: flex; gap: var(--space-md); justify-content: flex-end;">
            <button class="modal-cancel" style="padding: 0.75rem 1.5rem; border: 2px solid var(--border-color); color: var(--text-secondary); border-radius: var(--radius-md); font-weight: 600; transition: var(--transition-fast);">
                Cancel
            </button>
            <button class="modal-confirm" style="padding: 0.75rem 1.5rem; background: ${isDanger ? 'var(--accent-color)' : 'var(--gradient-primary)'}; color: white; border-radius: var(--radius-md); font-weight: 600; transition: var(--transition-normal);">
                ${confirmText}
            </button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add event listeners
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    
    const closeModal = () => {
        overlay.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => overlay.remove(), 200);
    };
    
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    confirmBtn.addEventListener('click', () => {
        if (onConfirm) onConfirm();
        closeModal();
    });
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    const colors = {
        success: 'var(--secondary-color)',
        error: 'var(--accent-color)',
        info: 'var(--primary-color)'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${colors[type]};
        color: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 10001;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== RECIPE ACTIONS ==========
const recipeCookButtons = document.querySelectorAll('.btn-primary-sm');

recipeCookButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        showNotification('Recipe opened! Check your email for the full tutorial.', 'success');
    });
});

// ========== COMMUNITY ACTIONS ==========
const actionButtons = document.querySelectorAll('.action-btn');

actionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const icon = this.textContent.split(' ')[0];
        const count = parseInt(this.textContent.split(' ')[1]) || 0;
        
        if (icon === '❤️') {
            this.textContent = `${icon} ${count + 1}`;
            this.style.background = 'var(--accent-light)';
            this.style.color = 'white';
            showNotification('Post liked!', 'success');
        } else if (icon === '🔖') {
            this.textContent = icon === '🔖' ? '✓ Saved' : '🔖 Save';
            this.style.background = 'var(--primary-color)';
            this.style.color = 'white';
            showNotification('Post saved to your collection!', 'success');
        }
    });
});

// ========== REWARDS REDEEM ==========
const redeemBtn = document.querySelector('.rewards-card .btn-primary');

if (redeemBtn) {
    redeemBtn.addEventListener('click', () => {
        showModal({
            title: 'Redeem Rewards',
            message: 'You have 450 points available. Choose your reward:\n\n• Free shipping upgrade (300 pts)\n• Premium ingredient swap (200 pts)\n• Bonus recipe pack (150 pts)',
            confirmText: 'View Rewards',
            onConfirm: () => {
                showNotification('Redirecting to rewards catalog...', 'info');
            }
        });
    });
}

// ========== CHART DATA (for future implementation) ==========
const dashboardStats = {
    boxesReceived: 8,
    recipesCompleted: 24,
    rewardsPoints: 450,
    nextDelivery: 'Feb 15',
    memberSince: 'June 2025',
    favoriteCategory: 'Mediterranean',
    completionRate: 85
};

// ========== ANIMATIONS ==========
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(animationStyles);

// ========== TRACK PACKAGE ==========
const trackingLink = document.querySelector('.tracking-link');

if (trackingLink) {
    trackingLink.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Opening tracking in new window...', 'info');
        
        // Simulate tracking
        setTimeout(() => {
            window.open('https://www.example-tracking.com/12345', '_blank');
        }, 500);
    });
}

// ========== SKIP THIS MONTH ==========
const skipMonthBtn = document.querySelector('.header-actions .btn-secondary');

if (skipMonthBtn) {
    skipMonthBtn.addEventListener('click', () => {
        showModal({
            title: 'Skip This Month',
            message: 'Skip February\'s box? You won\'t be charged and your subscription will resume in March.',
            confirmText: 'Skip February',
            onConfirm: () => {
                showNotification('February box skipped. Next delivery: March 15', 'info');
            }
        });
    });
}

// ========== UPGRADE PLAN ==========
const upgradeBtn = document.querySelector('.header-actions .btn-primary');

if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
        window.location.href = 'boxes.html';
    });
}

console.log('%c📊 Dashboard Loaded', 'font-size: 16px; font-weight: bold; color: #059669;');