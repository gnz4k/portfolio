document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');
  const hireMeBtn = document.getElementById('hire-me-btn');
  const searchInput = document.getElementById('portfolio-search');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchContainer = document.querySelector('.search-container');
  
  // Mobile Sidebar Elements
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

  // Mobile Sidebar Logic
  function toggleSidebar() {
      if (sidebar) sidebar.classList.toggle('open');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('open');
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

  // Navigation Logic
  function navigateTo(targetId) {
    // Remove active from all nav items and views
    navItems.forEach(nav => nav.classList.remove('active'));
    views.forEach(view => view.classList.remove('active'));

    // Highlight the correct nav item
    const matchingNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
    if (matchingNav) {
      matchingNav.classList.add('active');
    }

    // Show target view
    const targetView = document.getElementById(targetId);
    if (targetView) {
      targetView.classList.add('active');
    }

    // If search triggered this, clear the search drop down
    if (searchInput) {
        searchInput.value = '';
        searchDropdown.classList.remove('active');
    }

    // Close mobile sidebar if open
    if (sidebar && sidebar.classList.contains('open')) {
        toggleSidebar();
    }
  }

  // Expose to window for inline calls
  window.navigateTo = navigateTo;

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      navigateTo(targetId);
    });
  });

  // Hire me button shortcut
  if (hireMeBtn) {
    hireMeBtn.addEventListener('click', () => {
      navigateTo('view-contact');
    });
  }

  // --- SEARCH AUTO-COMPLETE LOGIC --- //
  
  // Define available searchable terms and their target sections
  const searchableContexts = [
    { label: "Home Page", target: "view-home" },
    { label: "Experience & Focus", target: "view-home", elementId: "focus-home", focusClass: "highlight-focus-text" },
    { label: "My Projects", target: "view-projects" },
    { label: "Project: Hephaestus Engine", target: "view-projects", elementId: "proj-heph" },
    { label: "Project: Project GK | VAL (Valorant Intelligence)", target: "view-projects", elementId: "proj-gk-val" },
    { label: "Project: Procedural World Engine", target: "view-projects", elementId: "proj-procedural-world" },
    { label: "Technical Skills", target: "view-skills" },
    { label: "Skills: Roblox Ecosystem & Luau", target: "view-skills", elementId: "skill-roblox" },
    { label: "Skills: Python & Auto Scripting", target: "view-skills", elementId: "skill-python" },
    { label: "Skills: Frontend Web (HTML/CSS/JS)", target: "view-skills", elementId: "skill-web" },
    { label: "Contact Details & Socials", target: "view-contact", elementId: "contact-details" },
    { label: "Hire Me", target: "view-contact" }
  ];

  if (searchInput && searchDropdown) {
      
      function renderDropdown(query) {
          searchDropdown.innerHTML = ''; // clear current

          let matches = searchableContexts;
          if (query.length > 0) {
              matches = searchableContexts.filter(item => 
                  item.label.toLowerCase().includes(query) || 
                  item.target.toLowerCase().includes(query)
              );
          }

          if (matches.length > 0) {
              matches.forEach(match => {
                  const itemDiv = document.createElement('div');
                  itemDiv.className = 'search-item';
                  itemDiv.innerHTML = `
                      <span>${match.label}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: auto;">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                  `;
                  itemDiv.addEventListener('click', () => {
                      navigateTo(match.target);
                      if (match.elementId) {
                          setTimeout(() => {
                              const el = document.getElementById(match.elementId);
                              if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  const animClass = match.focusClass || 'highlight-focus';
                                  el.classList.add(animClass);
                                  setTimeout(() => el.classList.remove(animClass), 2000);
                              }
                          }, 300); // Wait for view animation to complete
                      }
                  });
                  searchDropdown.appendChild(itemDiv);
              });
          } else {
              const emptyDiv = document.createElement('div');
              emptyDiv.className = 'empty-search';
              emptyDiv.textContent = 'No matching pages found.';
              searchDropdown.appendChild(emptyDiv);
          }

          searchDropdown.classList.add('active');
      }

      searchInput.addEventListener('focus', (e) => {
          renderDropdown(e.target.value.toLowerCase().trim());
      });

      searchInput.addEventListener('input', (e) => {
          renderDropdown(e.target.value.toLowerCase().trim());
      });

      // Close dropdown if clicking outside
      document.addEventListener('click', (e) => {
          if (searchContainer && !searchContainer.contains(e.target)) {
              searchDropdown.classList.remove('active');
          }
      });

      // Show dropdown on initial focus if there's text
      if (searchInput.value.trim().length > 0) {
          renderDropdown(searchInput.value.trim());
      }
  }
});

// Copy to Clipboard Utility
window.copyToClipboard = function(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = buttonElement.innerText;
        buttonElement.innerText = "COPIED!";
        buttonElement.style.borderColor = "var(--crimson)";
        buttonElement.style.color = "white";
        buttonElement.style.background = "rgba(225, 29, 72, 0.2)";
        setTimeout(() => {
            buttonElement.innerText = originalText;
            buttonElement.style.borderColor = "";
            buttonElement.style.color = "";
            buttonElement.style.background = "";
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
};
