document.addEventListener('DOMContentLoaded', function() {
// Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.location.href = 'main.html';
        });
    }

// Sidebar toggle handler
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleBtn && sidebar && mainContent) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

//Same Page Switching code
    function showPage(pageID){
        document.querySelectorAll(".page").forEach(p => p.style.display = "none");     //Hides all pages
        document.getElementById(pageID).style.display = "block"; //Then shows the selected page
    }

    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const pageID = this.getAttribute("href").substring(1);
            showPage(pageID);
        })
    })

showPage("dashboard");

//Log a workout form handler

});

