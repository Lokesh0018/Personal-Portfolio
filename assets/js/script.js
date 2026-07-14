'use strict';

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
      
      for (let j = 0; j < pages.length; j++) {
        if (targetPage === pages[j].dataset.page) {
          pages[j].classList.add("active");
          navigationLinks[j].classList.add("active");
          window.scrollTo(0, 0);
        } else {
          pages[j].classList.remove("active");
          navigationLinks[j].classList.remove("active");
        }
      }
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
    image: "./assets/images/ResultScale.png",
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
    image: "./assets/images/HTG.png",
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
    image: "./assets/images/GitIntel.png",
    demoLink: "https://github.com/Lokesh0018/Git-Intel",
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
    id: "gesture-chess-1",
    title: "Gesture Chess",
    category: "experiments",
    featured: false,
    status: "In Development",
    description: "An experimental real-time chess game controlled entirely via hand gestures using computer vision.",
    techStack: ["React", "Express", "PostgreSQL", "MediaPipe"],
    image: "./assets/images/GChess.png",
    demoLink: "https://github.com/Lokesh0018/Gesture-Chess",
    githubLink: "https://github.com/Lokesh0018/Gesture-Chess",
    caseStudy: null
  },
  {
    id: "gesture-chess-2",
    title: "Gesture Chess v2",
    category: "experiments",
    featured: false,
    status: "In Development",
    description: "Enhanced gesture recognition engine and multiplayer websocket support for gesture-controlled chess.",
    techStack: ["React", "Express", "PostgreSQL", "MediaPipe", "Socket.io"],
    image: "./assets/images/GChess.png",
    demoLink: "https://github.com/Lokesh0018/Gesture-Chess",
    githubLink: "https://github.com/Lokesh0018/Gesture-Chess",
    caseStudy: null
  }
];

const categories = ["All", "SaaS", "AI", "Web Apps", "Experiments"];

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
        <div class="project-item-icon-box">
          <ion-icon name="${hasCaseStudy ? 'document-text-outline' : 'eye-outline'}"></ion-icon>
        </div>
        <img src="${project.image}" alt="${project.title}" loading="lazy">
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
    <h3 class="case-study-title">${p.title} - Case Study</h3>
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

// --- 3D Avatar Animation ---
const avatarImg = document.getElementById('avatar-img');
document.addEventListener('mousemove', (e) => {
  if (!avatarImg) return;
  const rect = avatarImg.getBoundingClientRect();
  const avatarX = rect.left + rect.width / 2;
  const avatarY = rect.top + rect.height / 2;
  
  const deltaX = e.clientX - avatarX;
  const deltaY = e.clientY - avatarY;
  
  const rotateX = Math.max(-25, Math.min(25, -(deltaY / window.innerHeight) * 50));
  const rotateY = Math.max(-25, Math.min(25, (deltaX / window.innerWidth) * 50));
  
  avatarImg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

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