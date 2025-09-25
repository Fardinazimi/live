// Script for the Live Project Coming Soon page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    console.log('Live Project - Coming Soon page loaded!');
    
    // Update the progress randomly to simulate activity
    updateProgress();
    
    // Add some dynamic effects
    addFloatingElements();
});

function showNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = '🎉 You\'ll be notified when we go live!';
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
    
    // Log the action
    console.log('User requested notification for live launch');
}

function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (!progressFill || !progressText) return;
    
    // Simulate progress updates
    let currentProgress = 95;
    
    setInterval(() => {
        // Randomly increase progress slightly (but keep it under 100%)
        if (currentProgress < 99) {
            currentProgress += Math.random() * 0.5;
            progressFill.style.width = currentProgress + '%';
            progressText.textContent = Math.floor(currentProgress) + '% Complete';
        }
    }, 5000);
}

function addFloatingElements() {
    // Add floating particles for visual effect
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 6 + 4}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(particle);
    }
    
    // Add CSS for floating animation
    if (!document.querySelector('#floating-animation')) {
        const style = document.createElement('style');
        style.id = 'floating-animation';
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add some live status checking simulation
function checkLiveStatus() {
    const statusIndicator = document.querySelector('.status-indicator span');
    const statuses = [
        'Preparing Launch...',
        'Testing Systems...',
        'Final Checks...',
        'Almost Ready...',
        'Going Live Soon!'
    ];
    
    let currentStatusIndex = 0;
    
    setInterval(() => {
        if (statusIndicator) {
            currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
            statusIndicator.textContent = statuses[currentStatusIndex];
        }
    }, 3000);
}

// Initialize status checking
setTimeout(checkLiveStatus, 2000);

// Add keyboard shortcut for quick actions
document.addEventListener('keydown', function(event) {
    // Press 'L' for Live notification
    if (event.key.toLowerCase() === 'l') {
        showNotification();
    }
});

// Simulate live countdown
function startLiveCountdown() {
    // This is a demo - in real application, you'd have an actual launch date
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 1); // Tomorrow
    
    console.log('Live launch scheduled for:', launchDate.toLocaleDateString());
}

startLiveCountdown();