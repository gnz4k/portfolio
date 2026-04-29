document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');
  const hireMeBtn = document.getElementById('hire-me-btn');
  const searchInput = document.getElementById('portfolio-search');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchContainer = document.querySelector('.search-container');
  

  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');


  function toggleSidebar() {
      if (sidebar) sidebar.classList.toggle('open');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('open');
  }




  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="scramble-dim">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  const scramblers = [];
  document.querySelectorAll('.scramble-text').forEach(el => {
    scramblers.push({
      instance: new TextScramble(el),
      text: el.getAttribute('data-value') || el.innerText
    });
  });


  const glowCards = document.querySelectorAll('.glow-card');
  document.addEventListener('mousemove', e => {
    for(const card of glowCards) {
      const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  });


  const magneticEls = document.querySelectorAll('.magnetic');
  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', function(e) {
      const position = el.getBoundingClientRect();
      const x = e.pageX - position.left - position.width / 2;
      const y = e.pageY - position.top - position.height / 2;
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = 'translate(0px, 0px)';
    });
  });

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);


  function navigateTo(targetId) {
    navItems.forEach(nav => nav.classList.remove('active'));
    views.forEach(view => view.classList.remove('active'));

    const matchingNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
    if (matchingNav) {
      matchingNav.classList.add('active');
    }

    const targetView = document.getElementById(targetId);
    if (targetView) {
      targetView.classList.add('active');
      
      scramblers.forEach(scrambler => {
        if (targetView.contains(scrambler.instance.el)) {
          scrambler.instance.setText(scrambler.text);
        }
      });
    }

    if (searchInput) {
        searchInput.value = '';
        searchDropdown.classList.remove('active');
    }

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


  if (hireMeBtn) {
    hireMeBtn.addEventListener('click', () => {
      navigateTo('view-contact');
    });
  }


  

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
                          }, 300);
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


      document.addEventListener('click', (e) => {
          if (searchContainer && !searchContainer.contains(e.target)) {
              searchDropdown.classList.remove('active');
          }
      });


      if (searchInput.value.trim().length > 0) {
          renderDropdown(searchInput.value.trim());
      }
  }
});


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
