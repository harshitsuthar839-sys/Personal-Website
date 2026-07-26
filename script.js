// Select the button and the body element
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

// Add a click event listener to the button
themeBtn.addEventListener('click', function() {
    // Toggle the dark-theme class on the body
    body.classList.toggle('dark-theme');
    
    // Update the button text based on the current theme
    if (body.classList.contains('dark-theme')) {
        themeBtn.textContent = '☀️ Light Mode';
    } else {
        themeBtn.textContent = '🌙 Dark Mode';
    }
});