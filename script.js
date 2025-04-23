document.addEventListener('DOMContentLoaded', () => {
    const roadmapData = [
        {
            id: 'phase-1',
            title: 'Phase 1: Solidify Your JavaScript Foundation',
            weeks: 'Weeks 1-4',
            topics: [
                { id: 'topic-1-1', title: 'Week 1: JS Basics & ES6 Syntax', details: 'let/const, Arrow Functions, Template Literals, Basic Arrays (.forEach, .push)', resources: ['js-basics', 'es6'] },
                { id: 'topic-1-2', title: 'Week 2: Functions & Scope', details: 'Scope, Closures (basic), Arrow Functions vs Regular', resources: ['js-functions', 'js-scope'] },
                { id: 'topic-1-3', title: 'Week 3: Asynchronous JS - Promises', details: 'Callbacks (concept), Promises (.then, .catch, .finally), fetch API', resources: ['js-async', 'js-promises', 'fetch-api'] },
                { id: 'topic-1-4', title: 'Week 4: Asynchronous JS - async/await', details: 'async/await syntax, Error Handling (try...catch)', resources: ['js-async', 'js-async-await'] },
                { id: 'topic-1-5', title: 'Key Array/Object Methods', details: '.map, .filter, .reduce, .find, Object Destructuring, Spread Operator (...)', resources: ['js-arrays', 'js-objects', 'es6']},
                { id: 'topic-1-6', title: 'Modules', details: 'import/export (ES Modules)', resources: ['js-modules']}
            ]
        },
        {
            id: 'phase-2',
            title: 'Phase 2: Backend - Node.js & Express.js',
            weeks: 'Weeks 5-7',
            topics: [
                { id: 'topic-2-1', title: 'Week 5: Intro to Node.js & NPM', details: 'Node runtime, NPM init/install, package.json, basic terminal usage, CommonJS modules (require/module.exports)', resources: ['node-intro', 'npm'] },
                { id: 'topic-2-2', title: 'Week 6: Express.js Basics', details: 'Setup server, Routing (GET, POST), Request (req) & Response (res) objects, Sending JSON', resources: ['express-intro', 'express-routing', 'tools-postman'] },
                { id: 'topic-2-3', title: 'Week 7: Express Middleware & REST', details: 'Middleware concept & flow (next()), basic REST principles (HTTP Verbs), express.Router', resources: ['express-middleware', 'rest-api'] }
            ]
        },
        {
            id: 'phase-3',
            title: 'Phase 3: Database - MongoDB & Mongoose',
            weeks: 'Weeks 8-9',
            topics: [
                { id: 'topic-3-1', title: 'Week 8: MongoDB Atlas & Mongoose Setup', details: 'NoSQL concepts, MongoDB Atlas setup, Connection String, Mongoose install & connect, Schema & Model definition', resources: ['mongodb-intro', 'mongodb-atlas', 'mongoose-intro'] },
                { id: 'topic-3-2', title: 'Week 9: CRUD Operations with Mongoose', details: 'Create, Read (find, findById), Update (findByIdAndUpdate), Delete (findByIdAndDelete) using Mongoose models in Express routes', resources: ['mongoose-crud', 'mongoose-queries'] }
            ]
        },
        {
            id: 'phase-4',
            title: 'Phase 4: Frontend - React',
            weeks: 'Weeks 10-15',
            topics: [
                { id: 'topic-4-1', title: 'Week 10: Intro to React & JSX', details: 'Vite setup, JSX syntax, Functional Components, Props', resources: ['react-intro', 'react-jsx', 'react-components-props', 'vite'] },
                { id: 'topic-4-2', title: 'Week 11: State & Events', details: 'useState hook, Handling Events (onClick, onChange), Managing form input state', resources: ['react-state', 'react-events', 'react-forms'] },
                { id: 'topic-4-3', title: 'Week 12: Conditional Rendering & Lists', details: 'Conditional rendering (ternary, &&), Rendering lists with .map(), key prop importance', resources: ['react-conditional', 'react-lists'] },
                { id: 'topic-4-4', title: 'Week 13: useEffect Hook', details: 'Side effects, Fetching data on mount, Cleanup function basic, Handling CORS (backend)', resources: ['react-useeffect', 'fetch-api', 'cors'] },
                { id: 'topic-4-5', title: 'Week 14: React Router', details: 'Client-side routing setup (react-router-dom v6+), Route, Link, useNavigate, useParams', resources: ['react-router'] },
                { id: 'topic-4-6', title: 'Week 15: Forms & Data Submission', details: 'Controlled components, Handling form submission (onSubmit), Making POST requests to backend API', resources: ['react-forms', 'fetch-api'] }
             ]
        },
        {
            id: 'phase-5',
            title: 'Phase 5: Integration & Beyond',
            weeks: 'Week 16+',
             topics: [
                 { id: 'topic-5-1', title: 'Full Stack Connection', details: 'Ensuring seamless data flow (React <-> Express), Debugging across stack', resources: ['cors', 'debugging'] },
                 { id: 'topic-5-2', title: 'Git & Version Control', details: 'Essential Git commands (add, commit, push, pull, branch, merge), GitHub workflow', resources: ['git', 'github'] },
                 { id: 'topic-5-3', title: 'Build Projects', details: 'Apply knowledge by building ToDo List, Blog, etc.', resources: ['project-ideas'] },
                 { id: 'topic-5-4', title: 'Further Learning (Optional)', details: 'Authentication (JWT), State Management (Context API/Redux), Deployment, Testing', resources: ['auth-jwt', 'react-context', 'react-redux', 'deployment', 'testing'] }
            ]
        }
    ];

    const resourceData = [
        { id: 'js-basics', category: 'javascript', title: 'MDN: JavaScript Basics', desc: 'Fundamental concepts of JavaScript.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction', type: 'Documentation' },
        { id: 'es6', category: 'javascript', title: 'ES6 Features', desc: 'Overview of modern JavaScript syntax.', url: 'https://www.w3schools.com/js/js_es6.asp', type: 'Tutorial' },
        { id: 'js-functions', category: 'javascript', title: 'MDN: Functions', desc: 'In-depth guide to JavaScript functions.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions', type: 'Documentation' },
         { id: 'js-scope', category: 'javascript', title: 'MDN: Scope', desc: 'Understanding variable scope in JS.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Variable_scope', type: 'Documentation' },
        { id: 'js-async', category: 'javascript', title: 'MDN: Asynchronous JavaScript', desc: 'Core concepts of async programming.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function', type: 'Documentation' },
        { id: 'js-promises', category: 'javascript', title: 'MDN: Promises', desc: 'Using Promises for async operations.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises', type: 'Documentation' },
        { id: 'js-async-await', category: 'javascript', title: 'MDN: async/await', desc: 'Using async/await syntax.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function', type: 'Documentation' },
         { id: 'fetch-api', category: 'javascript', title: 'MDN: Fetch API', desc: 'Making network requests with Fetch.', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch', type: 'Documentation' },
         { id: 'js-arrays', category: 'javascript', title: 'MDN: Array Methods', desc: 'Essential methods for arrays.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array', type: 'Documentation' },
         { id: 'js-objects', category: 'javascript', title: 'MDN: Working with Objects', desc: 'Guide to JavaScript objects.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects', type: 'Documentation' },
        { id: 'js-modules', category: 'javascript', title: 'MDN: Modules', desc: 'JavaScript ES6 Modules.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules', type: 'Documentation' },
        { id: 'node-intro', category: 'node', title: 'Node.js Official Docs', desc: 'Introduction to Node.js.', url: 'https://nodejs.org/en/docs/', type: 'Documentation' },
        { id: 'npm', category: 'node', title: 'NPM Documentation', desc: 'Using the Node Package Manager.', url: 'https://docs.npmjs.com/', type: 'Documentation' },
        { id: 'express-intro', category: 'express', title: 'Express.js Official Docs', desc: 'Getting started with Express.', url: 'https://expressjs.com/en/starter/hello-world.html', type: 'Documentation' },
        { id: 'express-routing', category: 'express', title: 'Express Routing Guide', desc: 'Defining routes in Express.', url: 'https://expressjs.com/en/guide/routing.html', type: 'Documentation' },
        { id: 'express-middleware', category: 'express', title: 'Express Middleware Guide', desc: 'Using middleware.', url: 'https://expressjs.com/en/guide/using-middleware.html', type: 'Documentation' },
        { id: 'mongodb-intro', category: 'mongodb', title: 'MongoDB Manual', desc: 'Official MongoDB documentation.', url: 'https://www.mongodb.com/docs/manual/', type: 'Documentation' },
        { id: 'mongodb-atlas', category: 'mongodb', title: 'MongoDB Atlas', desc: 'Cloud MongoDB service.', url: 'https://www.mongodb.com/cloud/atlas', type: 'Service' },
        { id: 'mongoose-intro', category: 'mongoose', title: 'Mongoose Quick Start', desc: 'Getting started with Mongoose ODM.', url: 'https://mongoosejs.com/docs/index.html', type: 'Documentation' },
        { id: 'mongoose-crud', category: 'mongoose', title: 'Mongoose Queries', desc: 'Performing CRUD operations.', url: 'https://mongoosejs.com/docs/queries.html', type: 'Documentation' },
        { id: 'mongoose-queries', category: 'mongoose', title: 'Mongoose Models', desc: 'Defining and using models.', url: 'https://mongoosejs.com/docs/models.html', type: 'Documentation' },
        { id: 'react-intro', category: 'react', title: 'React Official Docs', desc: 'The new React documentation.', url: 'https://react.dev/', type: 'Documentation' },
        { id: 'vite', category: 'react', title: 'Vite Documentation', desc: 'Fast frontend build tool.', url: 'https://vitejs.dev/', type: 'Tool' },
         { id: 'react-jsx', category: 'react', title: 'React: Writing Markup with JSX', desc: 'Understanding JSX.', url: 'https://react.dev/learn/writing-markup-with-jsx', type: 'Documentation' },
         { id: 'react-components-props', category: 'react', title: 'React: Components & Props', desc: 'Building reusable UIs.', url: 'https://react.dev/learn/passing-props-to-a-component', type: 'Documentation' },
         { id: 'react-state', category: 'react', title: 'React: State Hook', desc: 'Using the useState hook.', url: 'https://react.dev/reference/react/useState', type: 'Documentation' },
         { id: 'react-events', category: 'react', title: 'React: Handling Events', desc: 'Responding to user interactions.', url: 'https://react.dev/learn/responding-to-events', type: 'Documentation' },
         { id: 'react-conditional', category: 'react', title: 'React: Conditional Rendering', desc: 'Showing content conditionally.', url: 'https://react.dev/learn/conditional-rendering', type: 'Documentation' },
         { id: 'react-lists', category: 'react', title: 'React: Rendering Lists', desc: 'Displaying lists of data.', url: 'https://react.dev/learn/rendering-lists', type: 'Documentation' },
         { id: 'react-forms', category: 'react', title: 'React: Controlled Components', desc: 'Handling forms.', url: 'https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components', type: 'Documentation' },
         { id: 'react-useeffect', category: 'react', title: 'React: useEffect Hook', desc: 'Handling side effects.', url: 'https://react.dev/reference/react/useEffect', type: 'Documentation' },
         { id: 'react-router', category: 'react', title: 'React Router Docs', desc: 'Client-side routing library.', url: 'https://reactrouter.com/en/main', type: 'Library Docs' },
         { id: 'cors', category: 'concepts', title: 'MDN: CORS', desc: 'Understanding Cross-Origin Resource Sharing.', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS', type: 'Concept' },
         { id: 'rest-api', category: 'concepts', title: 'REST API Concepts', desc: 'Principles of RESTful APIs.', url: 'https://restfulapi.net/', type: 'Concept' },
         { id: 'git', category: 'git', title: 'Git Official Docs', desc: 'Version control system.', url: 'https://git-scm.com/doc', type: 'Documentation' },
         { id: 'github', category: 'git', title: 'GitHub Guides', desc: 'Using GitHub for collaboration.', url: 'https://guides.github.com/', type: 'Platform Guide' },
         { id: 'tools-postman', category: 'tools', title: 'Postman', desc: 'API testing tool.', url: 'https://www.postman.com/', type: 'Tool' },
         { id: 'debugging', category: 'concepts', title: 'Browser DevTools Guide', desc: 'Debugging in the browser.', url: 'https://developer.chrome.com/docs/devtools/', type: 'Tool Guide' },
         { id: 'project-ideas', category: 'concepts', title: 'MERN Project Ideas', desc: 'Inspiration for projects.', url: 'https://github.com/florinpop17/app-ideas', type: 'Inspiration' },
         { id: 'auth-jwt', category: 'concepts', title: 'JWT Introduction', desc: 'JSON Web Tokens for authentication.', url: 'https://jwt.io/introduction', type: 'Concept' },
         { id: 'react-context', category: 'react', title: 'React: Context API', desc: 'Managing global state.', url: 'https://react.dev/learn/passing-data-deeply-with-context', type: 'Documentation' },
         { id: 'react-redux', category: 'react', title: 'Redux Toolkit', desc: 'Popular state management library.', url: 'https://redux-toolkit.js.org/', type: 'Library Docs' },
         { id: 'deployment', category: 'concepts', title: 'Vercel/Netlify', desc: 'Platforms for deploying web apps.', url: 'https://vercel.com/', type: 'Platform' },
         { id: 'testing', category: 'concepts', title: 'Testing JavaScript', desc: 'Overview of testing practices.', url: 'https://testingjavascript.com/', type: 'Resource' },
         { id: 'css', category: 'css', title: 'MDN: CSS Basics', desc: 'Fundamental concepts of CSS.', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps', type: 'Documentation' },
         { id: 'css-flexbox', category: 'css', title: 'CSS Tricks: Flexbox Guide', desc: 'Comprehensive guide to Flexbox.', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'Tutorial' },
         { id: 'css-grid', category: 'css', title: 'CSS Tricks: Grid Guide', desc: 'Comprehensive guide to CSS Grid.', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', type: 'Tutorial' },

    ];

    const state = {
        progress: {},
        studyLog: [],
        theme: 'light-mode',
        sidebarCollapsed: false
    };

    const elements = {
        body: document.body,
        sidebar: document.querySelector('.sidebar'),
        sidebarToggleBtn: document.getElementById('sidebar-toggle'),
        mainContent: document.querySelector('.main-content'),
        navLinks: document.querySelectorAll('.nav-link'),
        contentSections: document.querySelectorAll('.content-section'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        roadmapContainer: document.getElementById('roadmap-phases-container'),
        resourcesList: document.getElementById('resources-list'),
        resourceFilter: document.getElementById('resource-filter'),
        overallProgressBar: document.getElementById('overall-progress-bar'),
        overallProgressText: document.getElementById('overall-progress-text'),
        sidebarProgressBar: document.getElementById('sidebar-progress-bar'),
        sidebarProgressText: document.getElementById('sidebar-progress-text'),
        currentFocusTopic: document.getElementById('current-focus-topic'),
        studyStreakDays: document.getElementById('study-streak-days'),
        streakMessage: document.getElementById('streak-message'),
        studyDateInput: document.getElementById('study-date'),
        studyDurationInput: document.getElementById('study-duration'),
        studyNotesInput: document.getElementById('study-notes'),
        logStudyBtn: document.getElementById('log-study-btn'),
        studyLogList: document.getElementById('study-log-list'),
        clearLogBtn: document.getElementById('clear-log-btn'),
        trackerMessage: document.getElementById('tracker-message'),
        quickLinksList: document.getElementById('quick-links-list')
    };

    const STORAGE_KEYS = {
        PROGRESS: 'mernHubProgress',
        STUDY_LOG: 'mernHubStudyLog',
        THEME: 'mernHubTheme',
        SIDEBAR: 'mernHubSidebarCollapsed'
    };

    function saveState() {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(state.progress));
        localStorage.setItem(STORAGE_KEYS.STUDY_LOG, JSON.stringify(state.studyLog));
        localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
        localStorage.setItem(STORAGE_KEYS.SIDEBAR, state.sidebarCollapsed);
    }

    function loadState() {
        const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        const savedLog = localStorage.getItem(STORAGE_KEYS.STUDY_LOG);
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        const savedSidebar = localStorage.getItem(STORAGE_KEYS.SIDEBAR);

        state.progress = savedProgress ? JSON.parse(savedProgress) : {};
        state.studyLog = savedLog ? JSON.parse(savedLog) : [];
        // Default to dark theme if no preference saved and system prefers dark
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        state.theme = savedTheme || (prefersDark ? 'dark-mode' : 'light-mode');

        state.sidebarCollapsed = savedSidebar === 'true';

        elements.body.className = state.theme;
        updateThemeIcon();
        applySidebarState();
    }

    function navigateToSection(sectionId, filter = null) {
        elements.contentSections.forEach(section => {
            section.classList.remove('active-section');
        });
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);

        if (targetSection) {
            targetSection.classList.add('active-section');
            window.scrollTo(0, 0);
        }
        if (targetLink) {
            targetLink.classList.add('active');
        }

        if (sectionId === 'resources' && filter) {
             elements.resourceFilter.value = filter;
             renderResources();
        }

        // Update URL hash without triggering scroll jump if possible
        // if (history.pushState) {
        //      history.pushState(null, null, `#${sectionId}`);
        // } else {
        //      window.location.hash = sectionId;
        // }
    }

    function handleNavClick(event) {
        event.preventDefault();
        const sectionId = event.currentTarget.getAttribute('data-section');
        if (sectionId) {
            navigateToSection(sectionId);
        }
    }

    function handleFocusLinkClick(event) {
        event.preventDefault();
        const sectionId = event.currentTarget.getAttribute('data-goto-section');
         if (sectionId) {
            navigateToSection(sectionId);
            const focusTopicElement = document.querySelector('.topic:not(.completed)');
             if(focusTopicElement) {
                  setTimeout(() => { // Allow section to render
                      focusTopicElement.closest('.phase')?.classList.add('open'); // Ensure phase is open
                      focusTopicElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                       focusTopicElement.style.backgroundColor = 'rgba(var(--current-primary-rgb), 0.1)'; // Highlight
                       setTimeout(() => { focusTopicElement.style.backgroundColor = ''; }, 2000);
                  }, 100);
             }
        }
    }

    function handleQuickLinkClick(event) {
        if (event.target.tagName === 'A' && event.target.closest('.quick-links-card')) {
             event.preventDefault();
             const sectionId = event.target.getAttribute('data-section-target');
             const filterValue = event.target.getAttribute('data-filter-target');
             if (sectionId) {
                 navigateToSection(sectionId, filterValue);
             }
        }
    }

    function toggleTheme() {
        state.theme = state.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
        elements.body.className = state.theme;
        updateThemeIcon();
        saveState();
    }

    function updateThemeIcon() {
        const icon = elements.themeToggleBtn.querySelector('i');
        if (state.theme === 'dark-mode') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

     function toggleSidebar() {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        applySidebarState();
        saveState();
    }

    function applySidebarState() {
        if (state.sidebarCollapsed) {
            elements.sidebar.classList.add('collapsed');
        } else {
            elements.sidebar.classList.remove('collapsed');
        }
     }


    function renderRoadmap() {
        elements.roadmapContainer.innerHTML = '';
        let totalTopics = 0;
        let completedTopics = 0;

        roadmapData.forEach(phase => {
            const phaseElement = document.createElement('div');
            phaseElement.className = 'phase';
            phaseElement.dataset.phaseId = phase.id;

            const phaseHeader = document.createElement('div');
            phaseHeader.className = 'phase-header';
            phaseHeader.innerHTML = `
                <h2>${phase.title} (${phase.weeks})</h2>
                <div class="phase-details">
                    <span class="phase-progress">0%</span>
                    <i class="fas fa-chevron-down phase-toggle-icon"></i>
                </div>
            `;

            const phaseContent = document.createElement('div');
            phaseContent.className = 'phase-content';

            let phaseTotalTopics = 0;
            let phaseCompletedTopics = 0;

            phase.topics.forEach(topic => {
                totalTopics++;
                phaseTotalTopics++;
                const topicElement = document.createElement('div');
                topicElement.className = 'topic';
                topicElement.dataset.topicId = topic.id;
                const isCompleted = state.progress[topic.id] === true;
                 if (isCompleted) {
                    completedTopics++;
                    phaseCompletedTopics++;
                    topicElement.classList.add('completed');
                }

                const checkboxId = `checkbox-${topic.id}`;

                topicElement.innerHTML = `
                    <div class="topic-header">
                        <input type="checkbox" id="${checkboxId}" class="topic-checkbox" data-topic-id="${topic.id}" ${isCompleted ? 'checked' : ''}>
                        <label for="${checkboxId}">${topic.title}</label>
                    </div>
                    <div class="topic-details">
                        <p>${topic.details}</p>
                        ${topic.resources && topic.resources.length > 0 ?
                            topic.resources.map(resId => `<a href="#resources" data-resource-link="${resId}">${findResourceTitle(resId)}</a>`).join(' ') // Removed pipe
                            : ''
                        }
                    </div>
                `;
                phaseContent.appendChild(topicElement);
            });

            phaseElement.appendChild(phaseHeader);
            phaseElement.appendChild(phaseContent);
            elements.roadmapContainer.appendChild(phaseElement);

            const phaseProgress = phaseTotalTopics > 0 ? Math.round((phaseCompletedTopics / phaseTotalTopics) * 100) : 0;
            phaseHeader.querySelector('.phase-progress').textContent = `${phaseProgress}%`;

            phaseHeader.addEventListener('click', (e) => {
                // Prevent toggle if clicking on a link inside header (though none currently exist)
                 if (e.target.closest('a')) return;
                phaseElement.classList.toggle('open');
            });

            // Optionally keep phases with progress open by default
             if (phaseCompletedTopics > 0 && phaseCompletedTopics < phaseTotalTopics) {
                 phaseElement.classList.add('open');
             }

        });

        attachRoadmapListeners();
        updateOverallProgress(completedTopics, totalTopics);
        updateCurrentFocus();
    }

    function findResourceTitle(resourceId) {
         const resource = resourceData.find(r => r.id === resourceId);
         return resource ? resource.type : 'Resource'; // Show type instead of title for brevity
    }

    function handleResourceLinkClick(event) {
         if (event.target.tagName === 'A' && event.target.dataset.resourceLink) {
             event.preventDefault();
             const resourceId = event.target.dataset.resourceLink;
             const resource = resourceData.find(r => r.id === resourceId);
             if (resource) {
                 navigateToSection('resources', resource.category);
                 setTimeout(() => {
                     const resourceCard = elements.resourcesList.querySelector(`.resource-card[data-resource-id="${resourceId}"]`);
                     if (resourceCard) {
                         resourceCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                         resourceCard.style.transition = 'box-shadow 0.3s ease';
                         resourceCard.style.boxShadow = `0 0 0 3px var(--current-primary)`;
                         setTimeout(() => { resourceCard.style.boxShadow = ''; }, 2500);
                     }
                 }, 150);
             }
         }
    }

    function attachRoadmapListeners() {
        elements.roadmapContainer.addEventListener('change', (event) => {
            if (event.target.classList.contains('topic-checkbox')) {
                const topicId = event.target.dataset.topicId;
                state.progress[topicId] = event.target.checked;
                event.target.closest('.topic').classList.toggle('completed', event.target.checked);
                saveState();
                // Re-rendering entire roadmap on check is simple but can cause scroll jumps.
                // Alternative: Update only the necessary parts (progress bars, focus).
                // For simplicity, we'll stick with re-render for now.
                renderRoadmap();
                 // Find the element again after re-render if needed for scroll anchoring
                 // const changedElement = document.querySelector(`[data-topic-id="${topicId}"]`);
                 // if (changedElement) changedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
         elements.roadmapContainer.addEventListener('click', handleResourceLinkClick);
    }

    function updateOverallProgress(completed, total) {
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        elements.overallProgressBar.style.width = `${percentage}%`;
        elements.overallProgressText.textContent = `${percentage}% Complete`;
        elements.sidebarProgressBar.style.width = `${percentage}%`;
        elements.sidebarProgressText.textContent = `${percentage}%`;
    }

    function updateCurrentFocus() {
        let firstUncompleted = null;
        for (const phase of roadmapData) {
            for (const topic of phase.topics) {
                if (!state.progress[topic.id]) {
                    firstUncompleted = topic.title;
                    break;
                }
            }
            if (firstUncompleted) break;
        }
        elements.currentFocusTopic.textContent = firstUncompleted || "All topics completed! 🎉";
    }

    function renderResources() {
        elements.resourcesList.innerHTML = '';
        const filterValue = elements.resourceFilter.value;

        resourceData
            .filter(resource => filterValue === 'all' || resource.category === filterValue)
            .forEach(resource => {
                const card = document.createElement('div');
                card.className = 'resource-card';
                card.dataset.category = resource.category;
                 card.dataset.resourceId = resource.id;
                card.innerHTML = `
                    <h3>${resource.title}</h3>
                    <p>${resource.desc}</p>
                    <div class="resource-actions">
                       <a href="${resource.url}" target="_blank" rel="noopener noreferrer">Visit <i class="fas fa-external-link-alt"></i></a>
                       <span class="resource-type">${resource.type}</span>
                    </div>

                `;
                elements.resourcesList.appendChild(card);
            });
    }


    function renderStudyLog() {
        elements.studyLogList.innerHTML = '';
        const sortedLog = [...state.studyLog].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedLog.forEach((entry) => {
            const li = document.createElement('li');
            const logIndex = state.studyLog.findIndex(item => item.id === entry.id); // Find original index

            let durationText = entry.duration ? `(${entry.duration})` : '';
            // Ensure date is parsed correctly regardless of local timezone issues with split('T')[0]
            const dateParts = entry.date.split('-');
            const entryDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
            const dateFormatted = entryDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });


            li.innerHTML = `
                <div>
                    <strong>${dateFormatted}</strong> ${durationText}:
                    <span>${entry.notes.replace(/\n/g, '<br>')}</span>
                </div>
                <button class="delete-log-btn" data-log-id="${entry.id}"><i class="fas fa-trash-alt"></i></button>
            `;
            elements.studyLogList.appendChild(li);
        });
         attachLogDeleteListeners();
         updateStudyStreak();
    }

     function attachLogDeleteListeners() {
        elements.studyLogList.querySelectorAll('.delete-log-btn').forEach(button => {
            // Remove old listener before adding new one to prevent duplicates if re-rendering often
            button.removeEventListener('click', handleDeleteLogEntry);
            button.addEventListener('click', handleDeleteLogEntry);
        });
    }

     function handleDeleteLogEntry(event) {
        const logId = event.currentTarget.dataset.logId;
        const logIndex = state.studyLog.findIndex(entry => entry.id === logId);

        if (logIndex > -1 && confirm('Are you sure you want to delete this log entry?')) {
            state.studyLog.splice(logIndex, 1);
            saveState();
            renderStudyLog();
        }
    }

    function logStudySession() {
        const date = elements.studyDateInput.value;
        const notes = elements.studyNotesInput.value.trim();
        const duration = elements.studyDurationInput.value.trim();

        elements.trackerMessage.textContent = '';
        elements.trackerMessage.classList.remove('error');

        if (!date || !notes) {
            elements.trackerMessage.textContent = 'Please enter both date and notes.';
            elements.trackerMessage.classList.add('error');
            return;
        }

        const newEntry = {
            id: `log-${Date.now()}`,
            date: date,
            notes: notes,
            duration: duration
        };

        state.studyLog.push(newEntry);
        saveState();
        renderStudyLog();

        elements.studyNotesInput.value = '';
        elements.studyDurationInput.value = '';
        elements.trackerMessage.textContent = 'Session logged successfully!';
        setTimeout(() => { elements.trackerMessage.textContent = ''; }, 3000);
    }

    function clearStudyLog() {
        if (confirm('Are you sure you want to delete the ENTIRE study log? This cannot be undone.')) {
            state.studyLog = [];
            saveState();
            renderStudyLog();
        }
    }

    function dateToYMD(date) {
         const d = date.getDate();
         const m = date.getMonth() + 1;
         const y = date.getFullYear();
         return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

     function updateStudyStreak() {
        if (state.studyLog.length === 0) {
            elements.studyStreakDays.textContent = '0';
            elements.streakMessage.textContent = 'Log your first session!';
            return;
        }

        const uniqueDates = [...new Set(state.studyLog.map(entry => entry.date))].sort().reverse(); // Descending sort

        let streak = 0;
        const today = new Date();
        let currentDate = new Date(today);

        for (let i = 0; i < uniqueDates.length; i++) {
             const checkDateStr = dateToYMD(currentDate);
             if (uniqueDates.includes(checkDateStr)) {
                 streak++;
                 currentDate.setDate(currentDate.getDate() - 1); // Check previous day
             } else {
                  // If the streak didn't start today, check if it started yesterday
                  if (i === 0) {
                       currentDate.setDate(currentDate.getDate() -1); // Check yesterday first
                        const yesterdayStr = dateToYMD(currentDate);
                        if (uniqueDates.includes(yesterdayStr)) {
                             streak++;
                             currentDate.setDate(currentDate.getDate() - 1); // Continue check from day before yesterday
                             // Need to continue loop from here, but break outer loop logic needs adjustment
                             // Simpler: restart the check from yesterday if today wasn't logged
                              if (!uniqueDates.includes(dateToYMD(today))) {
                                  currentDate = new Date(); // reset
                                  currentDate.setDate(currentDate.getDate() - 1);
                                  streak = 0; // reset streak
                                   while(true) {
                                       const innerCheckStr = dateToYMD(currentDate);
                                       if (uniqueDates.includes(innerCheckStr)) {
                                           streak++;
                                           currentDate.setDate(currentDate.getDate() - 1);
                                       } else {
                                           break;
                                       }
                                   }
                              }
                              break; // Exit outer loop after handling yesterday start


                        } else {
                              break; // Streak is 0
                        }


                  } else {
                       break; // Streak broken
                  }
             }
        }


        elements.studyStreakDays.textContent = streak.toString();
        elements.streakMessage.textContent = streak > 0 ? 'Keep the fire burning!' : (uniqueDates.length > 0 ? 'Log today to continue!' : 'Log your first session!');
    }


    function setTodaysDate() {
        const today = new Date();
        // Adjust for timezone offset to get local date correctly
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        elements.studyDateInput.value = today.toISOString().split('T')[0];
    }

    function init() {
        loadState();
        setTodaysDate();
        renderRoadmap();
        renderResources();
        renderStudyLog();

        elements.navLinks.forEach(link => link.addEventListener('click', handleNavClick));
        elements.themeToggleBtn.addEventListener('click', toggleTheme);
        elements.resourceFilter.addEventListener('change', renderResources);
        elements.logStudyBtn.addEventListener('click', logStudySession);
        elements.clearLogBtn.addEventListener('click', clearStudyLog);
        elements.sidebarToggleBtn.addEventListener('click', toggleSidebar);

        const focusLink = document.querySelector('.focus-link');
        if (focusLink) {
            focusLink.addEventListener('click', handleFocusLinkClick);
        }
        if (elements.quickLinksList) {
            elements.quickLinksList.addEventListener('click', handleQuickLinkClick);
        }

        const initialSection = window.location.hash.substring(1) || 'dashboard';
        navigateToSection(initialSection);

         // Listen for hash changes to navigate (optional)
         // window.addEventListener('hashchange', () => {
         //     const newSection = window.location.hash.substring(1) || 'dashboard';
         //     navigateToSection(newSection);
         // });
    }

    init();
});