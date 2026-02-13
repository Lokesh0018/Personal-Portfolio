'use strict';

// --- Preloader Animation ---
const preloader = document.getElementById('preloader');
const preloaderImg = document.getElementById('preloader-img');
const startFramePreloader = 33;
const endFramePreloader = 120;
let currentPreloadFrame = startFramePreloader;
let preloaderLoaded = false;
let preloaderAnimationFinished = false;

window.addEventListener('load', () => {
  preloaderLoaded = true;
  checkPreloaderDone();
});

function checkPreloaderDone() {
  if (preloaderLoaded && preloaderAnimationFinished && preloader) {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
  }
}

function playPreloader() {
  if (!preloaderImg) return;
  
  const preloadInterval = setInterval(() => {
    currentPreloadFrame++;
    
    if (currentPreloadFrame > endFramePreloader) {
      clearInterval(preloadInterval);
      preloaderAnimationFinished = true;
      checkPreloaderDone();
      return;
    }
    
    const formattedFrame = currentPreloadFrame.toString().padStart(3, '0');
    preloaderImg.src = `./assets/images/logo-sequence/ezgif-frame-${formattedFrame}.jpg`;
  }, 35); // ~28 fps
}

// Start immediately
playPreloader();

// Element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// Sidebar toggle functionality for mobile
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// Page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Add click event to all navigation links
if (navigationLinks.length > 0 && pages.length > 0) {
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {
      const targetPage = this.innerHTML.toLowerCase();

      // First, remove active class from all nav links and all pages
      // Also remove animate-in class from all pages to sync with visibility
      for (let k = 0; k < navigationLinks.length; k++) {
        navigationLinks[k].classList.remove("active");
      }
      for (let k = 0; k < pages.length; k++) {
        pages[k].classList.remove("active");
        pages[k].classList.remove("animate-in");
      }

      // Then, add active class to the clicked nav link
      this.classList.add("active");

      // Then, find and activate the matching page
      let foundMatch = false;
      for (let j = 0; j < pages.length; j++) {
        if (targetPage === pages[j].dataset.page) {
          pages[j].classList.add("active");
          pages[j].classList.add("animate-in"); // Also add animate-in for sync
          foundMatch = true;
          break; // No need to check further
        }
      }
      // If no match found, all pages remain inactive (hidden)

      window.scrollTo(0, 0);
    });
  }
}

// Contact form validation & Toast Notification
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

const toast = document.createElement('div');
toast.className = 'toast hidden';
toast.textContent = 'Message Sent Successfully!';
document.body.appendChild(toast);

if (form && formInputs.length > 0 && formBtn) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
    form.reset();
    formBtn.setAttribute("disabled", "");
  });
}

// --- Dynamic Projects Data & Logic ---

const projectsData = [
  {
    id: "result-scale",
    title: "Result Scale",
    category: "saas",
    featured: true,
    status: "Production",
    description: "Multi-tenant SaaS platform with role-based portals, OTP verification, isolated institutional data, and automated result publishing.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Brevo API"],
    image: "./assets/images/projects/ResultScale.png",
    demoLink: "https://resultscale.web.app",
    githubLink: "#",
    caseStudy: {
      problem: "Educational institutions struggled with managing and securely publishing student results across different departments.",
      architecture: "A multi-tenant architecture on Node.js/Express with isolated MongoDB databases per tenant. Frontend built in React for role-specific portals.",
      contribution: "Designed the overall system architecture, implemented JWT & OTP-based authentication, and built the core API endpoints.",
      challenge: "Ensuring data isolation across multiple tenants while maintaining a single scalable codebase.",
      solution: "Implemented middleware that dynamically resolves the tenant's database connection based on the authenticated request context.",
      outcome: "Successfully adopted by multiple institutions, reducing result processing time by <b>70%</b>.",
      nextSteps: "Implement advanced analytics dashboards and PDF report generation for students."
    }
  },
  {
    id: "ht-generator",
    title: "Hall Ticket Generator",
    category: "web apps",
    featured: true,
    status: "Live",
    description: "A robust full-stack application to automatically generate and manage hall tickets for university examinations.",
    techStack: ["Spring Boot", "React", "MySQL"],
    image: "./assets/images/projects/HTG.png",
    githubLink: "https://github.com/Lokesh0018/HT-Generator",
    caseStudy: {
      problem: "Manual generation of hall tickets was error-prone and time-consuming for the administration team.",
      architecture: "Spring Boot REST API backend with MySQL for relational data integrity. React frontend for the administration interface.",
      contribution: "Developed the entire backend API, database schema, and integrated the PDF generation library.",
      challenge: "Handling concurrent requests during peak exam seasons without database deadlocks.",
      solution: "Optimized database transactions and implemented connection pooling in Spring Boot.",
      outcome: "Generated over <b>10,000</b> hall tickets reliably in the first production run.",
      nextSteps: "Migrate to a serverless architecture for better cost efficiency during off-peak times."
    }
  },
  {
    id: "git-intel",
    title: "Git Intel",
    category: "ai",
    featured: true,
    status: "Open Source",
    description: "AI-powered tool that analyzes GitHub repositories and generates intelligent code insights and metrics.",
    techStack: ["React", "Express", "MongoDB", "GitHub API"],
    image: "./assets/images/projects/GitIntel.png",
    githubLink: "https://github.com/Lokesh0018/Git-Intel",
    caseStudy: {
      problem: "Developers needed a quick way to assess the quality and activity of open-source repositories.",
      architecture: "Node/Express backend that proxies requests to the GitHub API, applies sentiment analysis, and caches results in MongoDB.",
      contribution: "Sole developer; designed the data pipeline and built the responsive dashboard.",
      challenge: "Managing GitHub API rate limits.",
      solution: "Implemented an intelligent caching layer using MongoDB to store frequent queries.",
      outcome: "Provides instant repository health scores and AI-driven insights.",
      nextSteps: "Integrate LLM-based code review summaries."
    }
  },
  {
    id: "gesture-chess",
    title: "Gesture Chess",
    category: "experiments",
    featured: true,
    status: "Prototype",
    description: "An experimental real-time chess game controlled entirely via hand gestures using computer vision.",
    techStack: ["React", "Express", "PostgreSQL", "MediaPipe"],
    image: "./assets/images/projects/GChess.png",
    demoLink: "https://github.com/Lokesh0018/Gesture-Chess",
    githubLink: "https://github.com/Lokesh0018/Gesture-Chess",
    caseStudy: {
      problem: "Traditional chess interfaces limit user interaction to mouse and keyboard inputs, which can be less engaging for players.",
      architecture: "React frontend with Express backend, using MediaPipe for real-time hand gesture recognition and PostgreSQL for game state management.",
      contribution: "Developed the gesture recognition module and integrated it with the game logic, ensuring smooth real-time interaction.",
      challenge: "Achieving accurate gesture recognition in varying lighting conditions and backgrounds.",
      solution: "Implemented adaptive thresholding and background subtraction techniques to enhance gesture detection accuracy.",
      outcome: "Provides an engaging and intuitive chess-playing experience through natural hand gestures.",
      nextSteps: "Expand the gesture vocabulary to include advanced chess moves and implement multiplayer support."
    }
  },
  {
    id: "login-register",
    title: "Login/Register System",
    category: "web apps",
    featured: true,
    status: "Open Source",
    description: "A secure and scalable user authentication system with JWT-based login, email verification, and password reset functionality.",
    techStack: ["React", "Spring Boot", "MySQL", "JWT"],
    image: "./assets/images/projects/LRForm.png",
    demoLink: "https://github.com/Lokesh0018/loginregister",
    githubLink: "https://github.com/Lokesh0018/loginregister",
    caseStudy: {
      problem: "Many web applications require a robust authentication system that can handle user registration, login, and password management securely.",
      architecture: "Spring Boot backend with JWT for authentication, MySQL for data storage.",
      contribution: "Sole developer; designed the authentication flow and implemented the REST API.",
      challenge: "Ensuring secure storage and transmission of user credentials.",
      solution: "Implemented JWT-based authentication with secure token handling and encrypted password storage.",
      outcome: "Provides a secure and scalable user authentication system.",
      nextSteps: "Add OAuth2 integration for third-party login options."
    }
  },
  {
    id: "v-films",
    title: "V Films",
    category: "ui",
    featured: false,
    status: "Open Source",
    description: "A visually appealing web showcase for an industry-level film production company, highlighting their portfolio and services.",
    techStack: ["React", "Responsive Design"],
    image: "./assets/images/projects/VFilms.png",
    githubLink: "https://github.com/Lokesh0018/V-Films",
    caseStudy: null
  },
  {
    id: "react-components",
    title: "React Components",
    category: "ui",
    featured: false,
    status: "Open Source",
    description: "A collection of reusable React components for building modern web applications.",
    techStack: ["React", "Responsive Design", "Vite"],
    image: "./assets/images/projects/ReactComponents.png",
    githubLink: "https://github.com/Lokesh0018/React-Components",
    caseStudy: null
  },
  {
    id: "calendar",
    title: "Calendar",
    category: "ui",
    featured: false,
    status: "In Development",
    description: "A simple calendar application with basic scheduling features.",
    techStack: ["React"],
    image: "./assets/images/projects/Calendar.png",
    demoLink: "https://github.com/Lokesh0018/Calendar",
    githubLink: "https://github.com/Lokesh0018/Calendar",
    caseStudy: null
  }
];

const categories = ["All", "SaaS", "AI", "Web Apps", "UI", "Experiments"];

const desktopFiltersContainer = document.getElementById('desktop-filters');
const mobileFilterList = document.getElementById('mobile-filter-list');
const mobileFilterSelectValue = document.querySelector('[data-selecct-value]');
const mobileFilterSelect = document.querySelector('[data-select]');

const featuredContainer = document.getElementById('featured-projects');
const moreContainer = document.getElementById('more-projects');
const caseStudyModal = document.getElementById('case-study-modal');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.querySelector('[data-modal-close]');

let currentCategory = 'all';

// Initialize Filters
function initFilters() {
  if (!desktopFiltersContainer) return;
  
  categories.forEach((cat, index) => {
    // Desktop
    const li = document.createElement('li');
    li.className = 'filter-item';
    const btn = document.createElement('button');
    if (index === 0) btn.className = 'active';
    btn.textContent = cat;
    btn.dataset.filter = cat.toLowerCase();
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#desktop-filters button').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = cat.toLowerCase();
      renderProjects();
    });
    li.appendChild(btn);
    desktopFiltersContainer.appendChild(li);

    // Mobile
    const mLi = document.createElement('li');
    mLi.className = 'select-item';
    const mBtn = document.createElement('button');
    mBtn.textContent = cat;
    mBtn.addEventListener('click', () => {
      mobileFilterSelectValue.textContent = cat;
      elementToggleFunc(mobileFilterSelect);
      document.querySelectorAll('#desktop-filters button').forEach(b => {
        if(b.textContent === cat) {
          document.querySelectorAll('#desktop-filters button').forEach(bb => bb.classList.remove('active'));
          b.classList.add('active');
        }
      });
      currentCategory = cat.toLowerCase();
      renderProjects();
    });
    mLi.appendChild(mBtn);
    mobileFilterList.appendChild(mLi);
  });
  
  desktopFiltersContainer.classList.remove('hidden');
  document.getElementById('mobile-filters').classList.remove('hidden');
}

function createProjectCard(project) {
  const li = document.createElement('li');
  li.className = 'project-item active';

  const techTags = project.techStack.map(tech => `<span>${tech}</span>`).join('');

  // Decide whether card triggers modal or directly opens link
  // The user requested: "Allow each major project to open a detailed technical case study"
  const hasCaseStudy = project.caseStudy != null;
  const cardAction = hasCaseStudy ? `onclick="openCaseStudy('${project.id}')"` : '';
  const cardClass = hasCaseStudy ? 'clickable-card' : '';

  li.innerHTML = `
    <div class="project-card-wrapper ${cardClass}" ${cardAction}>
      <figure class="project-img">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
        <!-- Hover overlay -->
        <div class="project-overlay">
          <div class="overlay-content">
            <h4 class="overlay-title">${project.title}</h4>
            <p class="overlay-description">${project.description}</p>
          </div>
        </div>
      </figure>
      <h3 class="project-title">${project.title} <span class="project-status">${project.status}</span></h3>
      <p class="project-description">${project.description}</p>
      <div class="project-tech-stack">
        ${techTags}
      </div>
      <div class="project-actions" onclick="event.stopPropagation();">
        ${project.demoLink ?
        `<a href="${project.demoLink}" target="_blank" class="btn">
          <ion-icon name="eye-outline"></ion-icon> Demo
        </a>` : ''}
        <a href="${project.githubLink}" target="_blank" class="btn">
          <ion-icon name="logo-github"></ion-icon> GitHub
        </a>
      </div>
    </div>
  `;
  return li;
}

function renderProjects() {
  if (!featuredContainer || !moreContainer) return;
  featuredContainer.innerHTML = '';
  moreContainer.innerHTML = '';
  
  const filtered = currentCategory === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === currentCategory);
    
  const featured = filtered.filter(p => p.featured);
  const more = filtered.filter(p => !p.featured);
  
  featured.forEach(p => featuredContainer.appendChild(createProjectCard(p)));
  more.forEach(p => moreContainer.appendChild(createProjectCard(p)));
  
  // Hide section headers if empty
  featuredContainer.previousElementSibling.classList.toggle('hidden', !featured.length);
  moreContainer.previousElementSibling.classList.toggle('hidden', !more.length);
}

window.openCaseStudy = function(projectId) {
  const p = projectsData.find(x => x.id === projectId);
  if (!p || !p.caseStudy) return;
  
  const cs = p.caseStudy;
  modalContent.innerHTML = `
    <div class="modal-header">
      <h3 class="case-study-title">${p.title} - Case Study</h3>
      <hr class="modal-divider">
    </div>
    <div class="case-study-section">
      <h4>Problem</h4>
      <p>${cs.problem}</p>
    </div>
    <div class="case-study-section">
      <h4>Architecture</h4>
      <p>${cs.architecture}</p>
    </div>
    <div class="case-study-section">
      <h4>My Contribution</h4>
      <p>${cs.contribution}</p>
    </div>
    <div class="case-study-section">
      <h4>Hardest Technical Challenge</h4>
      <p>${cs.challenge}</p>
    </div>
    <div class="case-study-section">
      <h4>Solution</h4>
      <p>${cs.solution}</p>
    </div>
    <div class="case-study-section">
      <h4>Outcome</h4>
      <p>${cs.outcome}</p>
    </div>
    <div class="case-study-section">
      <h4>What I Would Improve Next</h4>
      <p>${cs.nextSteps}</p>
    </div>
  `;
  
  caseStudyModal.classList.add('active');
  document.body.classList.add('no-scroll');
}

if (modalCloseBtn && caseStudyModal) {
  modalCloseBtn.addEventListener('click', () => {
    caseStudyModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
  
  // Close on outside click
  caseStudyModal.addEventListener('click', (e) => {
    if (e.target === caseStudyModal) {
      caseStudyModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
}

// Initialize
if (document.getElementById('featured-projects')) {
  initFilters();
  renderProjects();
}

// --- Avatar Sequence Animation ---
const avatarImg = document.getElementById('avatar-img');
const totalFrames = 181;
let targetFrame = 91; // Center face
let currentFrame = 91; // Used for smooth interpolation
let displayedFrame = 0; // Tracks currently applied frame

document.addEventListener('mousemove', (e) => {
  if (!avatarImg) return;
  
  const rect = avatarImg.getBoundingClientRect();
  const avatarX = rect.left + rect.width / 2;
  
  let normalizedX = 0;
  if (e.clientX < avatarX) {
    // Map 0 -> avatarX to -1 -> 0
    normalizedX = -(avatarX - e.clientX) / avatarX;
  } else {
    // Map avatarX -> window.innerWidth to 0 -> 1
    normalizedX = (e.clientX - avatarX) / (window.innerWidth - avatarX);
  }
  
  // Clamp between -1 and 1 just in case
  normalizedX = Math.max(-1, Math.min(1, normalizedX));
  
  // Map from -1..1 to 1..181
  targetFrame = Math.round(((normalizedX + 1) / 2) * (totalFrames - 1)) + 1;
});

// Smoothly interpolate towards the target frame
function animateAvatar() {
  if (avatarImg) {
    // Lerp (linear interpolation) for smooth transition
    currentFrame += (targetFrame - currentFrame) * 0.1;
    
    const frameToDisplay = Math.round(currentFrame);
    
    if (displayedFrame !== frameToDisplay && frameToDisplay >= 1 && frameToDisplay <= totalFrames) {
      displayedFrame = frameToDisplay;
      const formattedFrame = displayedFrame.toString().padStart(3, '0');
      avatarImg.src = `./assets/images/avatar-sequence/ezgif-frame-${formattedFrame}.jpg`;
    }
  }
  requestAnimationFrame(animateAvatar);
}

// Start animation loop
animateAvatar();

// --- Scroll To Top ---
const scrollToTopBtn = document.getElementById('scroll-to-top');
if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.remove('hidden');
    } else {
      scrollToTopBtn.classList.add('hidden');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Theme Switcher ---
const themeBtn = document.querySelector('.theme-btn');
const htmlElement = document.documentElement;

// Check for saved theme preference or use system preference
const getCurrentTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
  htmlElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
  localStorage.setItem('theme', theme);
  // Update icon
  const icon = themeBtn.querySelector('ion-icon');
  icon.name = theme === 'dark' ? 'sunny' : 'moon';
};

// Initialize theme
const currentTheme = getCurrentTheme();
setTheme(currentTheme);

// Theme toggle event listener
themeBtn.addEventListener('click', () => {
  const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

// --- Custom Cursor ---
const customCursor = document.createElement('div');
customCursor.className = 'custom-cursor';
document.body.appendChild(customCursor);

document.addEventListener('mousemove', (e) => {
  customCursor.style.left = e.clientX + 'px';
  customCursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => customCursor.classList.add('expand'));
document.addEventListener('mouseup', () => customCursor.classList.remove('expand'));

// Add hovered state to cursor for interactive elements
document.addEventListener('mouseover', (e) => {
  if (e.target.matches('a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])')) {
    customCursor.classList.add('hovered');
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.matches('a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])')) {
    customCursor.classList.remove('hovered');
  }
});

// --- Dynamic Background Gradient Tracker ---
const mainBg = document.createElement('div');
mainBg.className = 'dynamic-bg';
document.body.appendChild(mainBg);

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  mainBg.style.background = `radial-gradient(circle at ${x}% ${y}%, hsla(45, 100%, 72%, 0.03), transparent 25%)`;
});

// --- Intersection Observer for Animations (Skill Bars) ---
const skillFills = document.querySelectorAll('.skill-progress-fill');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.parentElement.previousElementSibling.querySelector('data').value + '%';
      entry.target.style.animation = 'fillProgress 1.2s ease-out forwards';
    } else {
      entry.target.style.width = '0';
      entry.target.style.animation = 'none';
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(fill => observer.observe(fill));

	// --- Scroll Reveal Animations ---
	const scrollElements = document.querySelectorAll('[data-animate]');
	const scrollObserver = new IntersectionObserver((entries) => {
	  entries.forEach(entry => {
	    if (entry.isIntersecting) {
	      entry.target.classList.add('animate-in');
	    } else {
	      // Optional: remove animation when scrolling back up
	      // Uncomment the line below if you want elements to hide again when scrolling back up
	      // entry.target.classList.remove('animate-in');
	    }
	  });
	}, {
	  threshold: 0.1, // Trigger when 10% of the element is visible
	  rootMargin: '0px 0px -50px 0px' // Start animation slightly before element fully enters viewport
	});

	scrollElements.forEach(el => scrollObserver.observe(el));