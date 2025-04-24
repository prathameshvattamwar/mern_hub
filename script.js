document.addEventListener("DOMContentLoaded", () => {

    const QUIZ_QUESTION_TIME_LIMIT = 20;
    const MAX_QUIZ_QUESTIONS = 10;

    const state = {
        progress: {},
        studyLog: [],
        theme: "light-mode",
        sidebarCollapsed: false,
        roadmapData: [],
        resourceData: [],
        allQuizData: {},
        currentQuizTopic: null,
        currentQuizQuestions: [],
        currentQuestionIndex: 0,
        userScore: 0,
        quizTimerInterval: null,
        timeLeft: 0,
        quizAnswered: false,
    };

    // Store all element references centrally
    let elements = {};

    const STORAGE_KEYS = {
        PROGRESS: "mernHubProgress",
        STUDY_LOG: "mernHubStudyLog",
        THEME: "mernHubTheme",
        SIDEBAR: "mernHubSidebarCollapsed",
    };

    // --- Initialization and Data Loading ---

    async function loadData() {
        try {
            const [roadmapRes, resourcesRes, quizRes] = await Promise.all([
                fetch('roadmap.json'),
                fetch('resources.json'),
                fetch('quiz_data.json')
            ]);

            if (!roadmapRes.ok || !resourcesRes.ok || !quizRes.ok) {
                throw new Error(`HTTP error! status: Roadmap: ${roadmapRes.status}, Resources: ${resourcesRes.status}, Quiz: ${quizRes.status}`);
            }

            state.roadmapData = await roadmapRes.json();
            state.resourceData = await resourcesRes.json();
            state.allQuizData = await quizRes.json();

            console.log("All data loaded successfully.");

        } catch (error) {
            console.error("Failed to load data:", error);
            // Display error to user if critical data fails to load
            if (elements.mainContent) {
                elements.mainContent.innerHTML = `<h1 style="color: red;">Error loading application data. Please try refreshing the page. Check console for details.</h1>`;
            }
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(state.progress));
            localStorage.setItem(STORAGE_KEYS.STUDY_LOG, JSON.stringify(state.studyLog));
            localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
            localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(state.sidebarCollapsed));
        } catch (error) {
            console.error("Error saving state to localStorage:", error);
        }
    }

    function loadState() {
        try {
            const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
            const savedLog = localStorage.getItem(STORAGE_KEYS.STUDY_LOG);
            const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
            const savedSidebar = localStorage.getItem(STORAGE_KEYS.SIDEBAR);

            state.progress = savedProgress ? JSON.parse(savedProgress) : {};
            state.studyLog = savedLog ? JSON.parse(savedLog) : [];

            const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            state.theme = savedTheme || (prefersDark ? "dark-mode" : "light-mode");
            state.sidebarCollapsed = savedSidebar === "true";

        } catch (error) {
            console.error("Error loading state from localStorage:", error);
            // Reset to defaults if loading fails
            state.progress = {};
            state.studyLog = [];
            state.theme = "light-mode";
            state.sidebarCollapsed = false;
        }
    }

    // --- UI Navigation and Interaction ---

    function navigateToSection(sectionId, filter = null) {
        if (!elements.contentSections || !elements.navLinks) return;

        elements.contentSections.forEach((section) => {
            section.classList.remove("active-section");
        });
        elements.navLinks.forEach((link) => {
            link.classList.remove("active");
        });

        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);

        if (targetSection) {
            targetSection.classList.add("active-section");
            window.scrollTo(0, 0);
            // Update URL hash
            // window.location.hash = `#${sectionId}`;
        }
        if (targetLink) {
            targetLink.classList.add("active");
        }

        // Handle section-specific actions after navigation
        if (sectionId === "resources" && elements.resourceFilter) {
            if (filter) {
                elements.resourceFilter.value = filter;
            }
            renderResources(); // Render resources based on current filter
        }
        if (sectionId === "practice" && elements.quizTopicSelect && Object.keys(state.allQuizData).length > 0) {
            populateQuizTopics(); // Repopulate topics if needed
        }
         if (sectionId === 'roadmap') {
            renderRoadmap(); // Ensure roadmap is rendered when navigating to it
        }
         if (sectionId === 'tracker') {
             renderStudyLog(); // Ensure log is rendered
             updateStudyStreak(); // Ensure streak is updated
         }
          if(sectionId === 'dashboard') {
             updateDashboard(); // Update dashboard stats
          }
    }

    function handleNavClick(event) {
        event.preventDefault();
        const sectionId = event.currentTarget.getAttribute("data-section");
        if (sectionId) {
            navigateToSection(sectionId);
        }
    }

    function handleFocusLinkClick(event) {
        event.preventDefault();
        const sectionId = event.currentTarget.getAttribute("data-goto-section");
        if (sectionId) {
            navigateToSection(sectionId);
            // Highlight the next topic after navigation settles
            setTimeout(() => {
                 if (!elements.roadmapContainer) return;
                const focusTopicElement = elements.roadmapContainer.querySelector(".topic:not(.completed)");
                if (focusTopicElement) {
                    const phaseElement = focusTopicElement.closest(".phase");
                    if (phaseElement && !phaseElement.classList.contains("open")) {
                        phaseElement.classList.add("open");
                    }
                    focusTopicElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    focusTopicElement.style.transition = "background-color 0.5s ease";
                    focusTopicElement.style.backgroundColor = "rgba(var(--current-primary-rgb), 0.1)";
                    setTimeout(() => {
                        if (focusTopicElement) {
                            focusTopicElement.style.backgroundColor = "";
                            focusTopicElement.style.transition = "";
                        }
                    }, 2000);
                }
            }, 150); // Delay to allow section transition
        }
    }

     function handleQuickLinkClick(event) {
        if ( event.target.tagName === "A" && event.target.closest(".quick-links-card") ) {
            event.preventDefault();
            const sectionId = event.target.getAttribute("data-section-target");
            const filterValue = event.target.getAttribute("data-filter-target");
            if (sectionId) {
                navigateToSection(sectionId, filterValue || null);
            }
        }
    }

    function toggleTheme() {
        state.theme = state.theme === "light-mode" ? "dark-mode" : "light-mode";
        elements.body.className = state.theme;
        updateThemeIcon();
        saveState();
    }

    function updateThemeIcon() {
        if (!elements.themeToggleBtn) return;
        const icon = elements.themeToggleBtn.querySelector("i");
        if (!icon) return;
        if (state.theme === "dark-mode") {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    }

    function toggleSidebar() {
        if (!elements.sidebar) return;
        state.sidebarCollapsed = !state.sidebarCollapsed;
        applySidebarState();
        saveState();
    }

    function applySidebarState() {
        if (!elements.sidebar) return;
        elements.sidebar.classList.toggle("collapsed", state.sidebarCollapsed);
    }

    // --- Rendering Functions ---

    function renderRoadmap() {
        if (!elements.roadmapContainer || !state.roadmapData || state.roadmapData.length === 0) return;

        elements.roadmapContainer.innerHTML = "";
        let totalTopics = 0;
        let completedTopics = 0;

        state.roadmapData.forEach((phase) => {
            const phaseElement = document.createElement("div");
            phaseElement.className = "phase";
            phaseElement.dataset.phaseId = phase.id;

            const phaseHeader = document.createElement("div");
            phaseHeader.className = "phase-header";

            const phaseContent = document.createElement("div");
            phaseContent.className = "phase-content";

            let phaseTotalTopics = 0;
            let phaseCompletedTopics = 0;

            phase.topics.forEach((topic) => {
                totalTopics++;
                phaseTotalTopics++;
                const topicElement = document.createElement("div");
                topicElement.className = "topic";
                topicElement.dataset.topicId = topic.id;
                const isCompleted = state.progress[topic.id] === true;

                if (isCompleted) {
                    completedTopics++;
                    phaseCompletedTopics++;
                    topicElement.classList.add("completed");
                }

                const checkboxId = `checkbox-${topic.id}`;
                topicElement.innerHTML = `
                    <div class="topic-header">
                        <input type="checkbox" id="${checkboxId}" class="topic-checkbox" data-topic-id="${topic.id}" ${isCompleted ? "checked" : ""}>
                        <label for="${checkboxId}">${topic.title}</label>
                    </div>
                    <div class="topic-details">
                        <p>${topic.details}</p>
                        ${topic.resources && topic.resources.length > 0 ? topic.resources.map(resId => `<a href="#resources" data-resource-link="${resId}">${findResourceTitle(resId)}</a>`).join(" ") : ""}
                    </div>
                `;
                phaseContent.appendChild(topicElement);
            });

            const phaseProgress = phaseTotalTopics > 0 ? Math.round((phaseCompletedTopics / phaseTotalTopics) * 100) : 0;
            phaseHeader.innerHTML = `
                <h2>${phase.title} (${phase.weeks})</h2>
                <div class="phase-details">
                    <span class="phase-progress">${phaseProgress}%</span>
                    <i class="fas fa-chevron-down phase-toggle-icon"></i>
                </div>
            `;

            phaseElement.appendChild(phaseHeader);
            phaseElement.appendChild(phaseContent);
            elements.roadmapContainer.appendChild(phaseElement);

             // Open phase if in progress
             if (phaseCompletedTopics > 0 && phaseCompletedTopics < phaseTotalTopics) {
                 phaseElement.classList.add('open');
             }
             phaseHeader.addEventListener("click", () => phaseElement.classList.toggle("open"));
        });

        attachRoadmapListeners(); // Attach listeners after rendering
        updateOverallProgress(completedTopics, totalTopics);
        updateCurrentFocus();
    }

    function findResourceTitle(resourceId) {
        const resource = state.resourceData.find((r) => r.id === resourceId);
        return resource ? resource.type : "Resource"; // Or maybe resource.title?
    }

    function handleResourceLinkClick(event) {
        if (event.target.tagName === "A" && event.target.dataset.resourceLink) {
            event.preventDefault();
            const resourceId = event.target.dataset.resourceLink;
            const resource = state.resourceData.find((r) => r.id === resourceId);
            if (resource && elements.resourcesList) {
                navigateToSection("resources", resource.category);
                // Highlight the linked resource card
                setTimeout(() => {
                    const resourceCard = elements.resourcesList.querySelector(`.resource-card[data-resource-id="${resourceId}"]`);
                    if (resourceCard) {
                        resourceCard.scrollIntoView({ behavior: "smooth", block: "center" });
                        resourceCard.style.transition = "box-shadow 0.3s ease";
                        resourceCard.style.boxShadow = `0 0 0 3px var(--current-primary)`;
                        setTimeout(() => {
                            if (resourceCard) resourceCard.style.boxShadow = "";
                            resourceCard.style.transition = "";
                        }, 2500);
                    }
                }, 150); // Delay for section transition
            }
        }
    }

    function attachRoadmapListeners() {
        if (!elements.roadmapContainer) return;
        // Use event delegation for checkboxes and resource links
        elements.roadmapContainer.addEventListener("change", (event) => {
            if (event.target.classList.contains("topic-checkbox")) {
                const topicId = event.target.dataset.topicId;
                if (topicId) {
                     state.progress[topicId] = event.target.checked;
                     const topicElement = event.target.closest(".topic");
                     if (topicElement) {
                         topicElement.classList.toggle("completed", event.target.checked);
                     }
                     saveState();
                     // Re-calculate progress without full re-render if possible
                     // For simplicity, full re-render is acceptable here, but can be optimized
                     renderRoadmap(); // Re-render updates phase progress etc.
                }
            }
        });
        elements.roadmapContainer.addEventListener("click", handleResourceLinkClick);
    }

    function updateOverallProgress(completed, total) {
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        if (elements.overallProgressBar) elements.overallProgressBar.style.width = `${percentage}%`;
        if (elements.overallProgressText) elements.overallProgressText.textContent = `${percentage}% Complete`;
        if (elements.sidebarProgressBar) elements.sidebarProgressBar.style.width = `${percentage}%`;
        if (elements.sidebarProgressText) elements.sidebarProgressText.textContent = `${percentage}%`;
    }

     function updateCurrentFocus() {
        if (!elements.currentFocusTopic || !state.roadmapData) return;
        let firstUncompleted = null;
        for (const phase of state.roadmapData) {
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
        if (!elements.resourcesList || !elements.resourceFilter || !state.resourceData) return;
        elements.resourcesList.innerHTML = "";
        const filterValue = elements.resourceFilter.value;

        state.resourceData
            .filter((resource) => filterValue === "all" || resource.category === filterValue)
            .forEach((resource) => {
                const card = document.createElement("div");
                card.className = "resource-card";
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
        if (!elements.studyLogList) return;
        elements.studyLogList.innerHTML = "";
        const sortedLog = [...state.studyLog].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedLog.forEach((entry) => {
            const li = document.createElement("li");
            let durationText = entry.duration ? `(${entry.duration})` : "";
            const dateParts = entry.date.split("-");
            let dateFormatted = entry.date; // Fallback
            try {
                const entryDate = new Date(Date.UTC(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])));
                 dateFormatted = entryDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
            } catch(e) { console.warn("Could not format date:", entry.date)}


            li.innerHTML = `
                <div>
                    <strong>${dateFormatted}</strong> ${durationText}:
                    <span>${entry.notes.replace(/\n/g, "<br>")}</span>
                </div>
                <button class="delete-log-btn" data-log-id="${entry.id}"><i class="fas fa-trash-alt"></i></button>
            `;
             // Attach listener directly
             const deleteBtn = li.querySelector('.delete-log-btn');
             if (deleteBtn) {
                 deleteBtn.addEventListener('click', handleDeleteLogEntry);
             }
            elements.studyLogList.appendChild(li);
        });
        // No need for separate attachLogDeleteListeners if done during creation
        updateStudyStreak();
    }

    function handleDeleteLogEntry(event) {
        const logId = event.currentTarget.dataset.logId;
         // Confirm deletion
         if (!confirm("Are you sure you want to delete this log entry?")) {
            return;
         }
        state.studyLog = state.studyLog.filter(entry => entry.id !== logId);
        saveState();
        renderStudyLog(); // Re-render the list
    }

    function logStudySession() {
        if (!elements.studyDateInput || !elements.studyNotesInput || !elements.studyDurationInput || !elements.trackerMessage) return;

        const date = elements.studyDateInput.value;
        const notes = elements.studyNotesInput.value.trim();
        const duration = elements.studyDurationInput.value.trim();

        elements.trackerMessage.textContent = "";
        elements.trackerMessage.classList.remove("error", "success");

        if (!date || !notes) {
            elements.trackerMessage.textContent = "Please enter both date and notes.";
            elements.trackerMessage.classList.add("error");
            return;
        }

        const newEntry = { id: `log-${Date.now()}`, date: date, notes: notes, duration: duration };

        state.studyLog.push(newEntry);
        saveState();
        renderStudyLog();

        elements.studyNotesInput.value = "";
        elements.studyDurationInput.value = "";
        elements.trackerMessage.textContent = "Session logged successfully!";
        elements.trackerMessage.classList.add("success"); // Optional: style success messages
        setTimeout(() => {
            if (elements.trackerMessage) elements.trackerMessage.textContent = "";
             elements.trackerMessage.classList.remove("success");
        }, 3000);
    }

    function clearStudyLog() {
        if (confirm("Are you sure you want to delete the ENTIRE study log? This cannot be undone.")) {
            state.studyLog = [];
            saveState();
            renderStudyLog();
        }
    }

     function dateToYMD(date) {
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    function updateStudyStreak() {
        if (!elements.studyStreakDays || !elements.streakMessage) return;
        if (state.studyLog.length === 0) {
            elements.studyStreakDays.textContent = "0";
            elements.streakMessage.textContent = "Log your first session!";
            return;
        }

        const uniqueDates = [...new Set(state.studyLog.map((entry) => entry.date))].map(d => new Date(d)).sort((a,b)=> b - a); // Sort dates descending

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize current date

        // Check if today is logged
        if (uniqueDates.length > 0 && uniqueDates[0].getTime() === currentDate.getTime()) {
            streak = 1;
            let previousDay = new Date(currentDate);
            previousDay.setDate(previousDay.getDate() - 1);

            for (let i = 1; i < uniqueDates.length; i++) {
                 if (uniqueDates[i].getTime() === previousDay.getTime()) {
                     streak++;
                     previousDay.setDate(previousDay.getDate() - 1); // Check for the day before that
                 } else {
                     break; // Streak broken
                 }
            }
        } else {
             // Check if yesterday is logged (to handle case where today isn't logged yet)
             let yesterday = new Date(currentDate);
             yesterday.setDate(yesterday.getDate() - 1);
             if (uniqueDates.length > 0 && uniqueDates[0].getTime() === yesterday.getTime()) {
                 streak = 1;
                 let previousDay = new Date(yesterday);
                 previousDay.setDate(previousDay.getDate() - 1);
                 for (let i = 1; i < uniqueDates.length; i++) {
                      if (uniqueDates[i].getTime() === previousDay.getTime()) {
                          streak++;
                          previousDay.setDate(previousDay.getDate() - 1);
                      } else {
                          break;
                      }
                 }
             } else {
                 streak = 0; // Neither today nor yesterday logged
             }
        }


        elements.studyStreakDays.textContent = streak.toString();
        const loggedToday = uniqueDates.length > 0 && uniqueDates[0].getTime() === new Date(new Date().setHours(0,0,0,0)).getTime();

         if (streak > 0) {
            elements.streakMessage.textContent = loggedToday ? "Keep the fire burning!" : "Log today to continue the streak!";
         } else {
            elements.streakMessage.textContent = "Log today to start a streak!";
         }
    }

     function setTodaysDate() {
        if (!elements.studyDateInput) return;
        const today = new Date();
        // Adjust for timezone offset to get local date in YYYY-MM-DD format
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        try {
            elements.studyDateInput.value = today.toISOString().split("T")[0];
        } catch (e) {
            console.error("Error setting today's date:", e);
            // Fallback or alternative method if needed
             elements.studyDateInput.value = dateToYMD(new Date());
        }
    }

     function updateDashboard() {
         // Example: Recalculate progress and update focus topic if needed
         let totalTopics = 0;
         let completedTopics = 0;
         state.roadmapData.forEach(phase => {
             phase.topics.forEach(topic => {
                 totalTopics++;
                 if (state.progress[topic.id]) {
                     completedTopics++;
                 }
             });
         });
         updateOverallProgress(completedTopics, totalTopics);
         updateCurrentFocus();
         updateStudyStreak(); // Also update streak when viewing dashboard
     }


    // --- Quiz Functions ---

    function populateQuizTopics() {
        if (!elements.quizTopicSelect || !state.roadmapData || !state.allQuizData) return;

        elements.quizTopicSelect.innerHTML = '<option value="">-- Choose a Topic --</option>';
        const addedTopics = new Set(); // Ensure unique quizKeys

        state.roadmapData.forEach((phase) => {
            phase.topics.forEach((topic) => {
                // Check if topic has a quizKey, data exists, and not already added
                if (topic.quizKey && state.allQuizData[topic.quizKey] && state.allQuizData[topic.quizKey].length > 0 && !addedTopics.has(topic.quizKey)) {
                    const option = document.createElement("option");
                    option.value = topic.quizKey;
                    // Try to get a cleaner title, e.g., "JS Basics & ES6 Syntax" from "Week 1: JS Basics & ES6 Syntax"
                    const titleParts = topic.title.split(":");
                    option.textContent = titleParts.length > 1 ? titleParts[1].trim() : topic.title;
                    elements.quizTopicSelect.appendChild(option);
                    addedTopics.add(topic.quizKey); // Mark as added
                }
            });
        });

        if (elements.quizTopicSelect.options.length <= 1) {
            elements.quizTopicSelect.innerHTML = '<option value="">-- No Quiz Topics Available --</option>';
            elements.quizTopicSelect.disabled = true;
             if(elements.startQuizBtn) elements.startQuizBtn.disabled = true;
        } else {
             elements.quizTopicSelect.disabled = false;
             if(elements.startQuizBtn) elements.startQuizBtn.disabled = false;
        }
    }

    function shuffleArray(array) {
        if (!Array.isArray(array)) return [];
        const shuffled = [...array]; // Create a copy
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
        }
        return shuffled;
    }

    function startQuiz() {
        // **Crucial Check:** Ensure all required quiz elements exist before proceeding
        const requiredQuizElems = ['quizTopicSelect', 'quizMessage', 'quizArea', 'quizSetup', 'quizHeader', 'quizTopicTitle', 'quizProgressTimer', 'quizQuestionNumber', 'quizTotalQuestions', 'quizTimer', 'quizQuestionContainer', 'quizQuestion', 'quizOptions', 'quizFeedback', 'quizNavigation', 'nextQuestionBtn', 'quizResultArea', 'quizResultText', 'restartQuizBtn'];
        const missing = requiredQuizElems.filter(id => !elements[id]);

        if (missing.length > 0) {
            console.error("Cannot start quiz, essential UI elements missing:", missing);
            if (elements.quizMessage) {
                 elements.quizMessage.textContent = `Error: Cannot start quiz. Missing elements: ${missing.join(', ')}. Check HTML and console.`;
                 elements.quizMessage.classList.add('error');
            }
            return; // Halt execution
        }

        const selectedTopicKey = elements.quizTopicSelect.value;
        elements.quizMessage.textContent = "";
        elements.quizMessage.classList.remove("error", "success");

        if (!selectedTopicKey) {
            elements.quizMessage.textContent = "Please select a topic first.";
            elements.quizMessage.classList.add("error");
            return;
        }

        const questions = state.allQuizData[selectedTopicKey];
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            elements.quizMessage.textContent = "No questions available for this topic yet.";
            elements.quizMessage.classList.add("error");
            console.error(`No valid questions found for quiz key: ${selectedTopicKey}`);
            return;
        }

        // Prepare quiz state
        state.currentQuizTopic = selectedTopicKey;
        state.currentQuizQuestions = shuffleArray([...questions]).slice(0, MAX_QUIZ_QUESTIONS);
        state.currentQuestionIndex = 0;
        state.userScore = 0;
        state.quizAnswered = false;

        // Update Topic Title Display
         const selectedOption = elements.quizTopicSelect.options[elements.quizTopicSelect.selectedIndex];
         elements.quizTopicTitle.textContent = `Quiz: ${selectedOption ? selectedOption.text : selectedTopicKey}`;


        // Update Total Questions Display
        elements.quizTotalQuestions.textContent = state.currentQuizQuestions.length;

        // Update UI visibility
        elements.quizArea.style.display = "block";
        elements.quizSetup.style.display = "none";
        elements.quizHeader.style.display = "flex"; // Show quiz header
        elements.quizQuestionContainer.style.display = "block"; // Show question area
        elements.quizNavigation.style.display = "flex"; // Show navigation (center button)
        elements.quizResultArea.style.display = "none"; // Hide results initially
        elements.nextQuestionBtn.disabled = true; // Disable next until answered


        displayCurrentQuestion();
    }

    function displayCurrentQuestion() {
        // Check if quiz should end
        if (!state.currentQuizQuestions || state.currentQuestionIndex >= state.currentQuizQuestions.length) {
            showQuizResults();
            return;
        }

        clearTimeout(state.quizTimerInterval); // Clear previous timer
        state.quizAnswered = false;

        const questionData = state.currentQuizQuestions[state.currentQuestionIndex];

        // Validate question data format
        if (!questionData || typeof questionData.question !== 'string' || !Array.isArray(questionData.options) || typeof questionData.answer !== 'string') {
            console.error("Invalid question data format at index", state.currentQuestionIndex, ":", questionData);
            // Skip this question or show error
            elements.quizQuestion.textContent = "Error: Invalid question data encountered.";
            elements.quizOptions.innerHTML = "";
            elements.quizFeedback.textContent = "Skipping invalid question...";
             elements.nextQuestionBtn.disabled = false; // Allow moving past error
            return;
        }

        // Update question number and text
        elements.quizQuestionNumber.textContent = state.currentQuestionIndex + 1;
        elements.quizQuestion.textContent = questionData.question;

        // Reset feedback and options
        elements.quizOptions.innerHTML = "";
        elements.quizFeedback.textContent = "";
        elements.quizFeedback.className = "quiz-feedback"; // Reset classes

        // Disable next button initially
        elements.nextQuestionBtn.disabled = true;
        elements.nextQuestionBtn.textContent = (state.currentQuestionIndex === state.currentQuizQuestions.length - 1) ? "Finish Quiz" : "Next Question";

        // Create and display options
        const displayOptions = shuffleArray([...questionData.options]);
        displayOptions.forEach((optionText) => {
            const optionBtn = document.createElement("button");
            optionBtn.className = "quiz-option-btn";
            optionBtn.textContent = optionText;
            optionBtn.dataset.answer = optionText; // Store answer text directly
            optionBtn.addEventListener("click", handleAnswerSelection);
            elements.quizOptions.appendChild(optionBtn);
        });

        startTimer(); // Start the timer for the new question
    }

    function startTimer() {
        if (!elements.quizTimer) return;
        state.timeLeft = QUIZ_QUESTION_TIME_LIMIT;
        elements.quizTimer.textContent = state.timeLeft;
        clearInterval(state.quizTimerInterval); // Clear any existing interval

        state.quizTimerInterval = setInterval(() => {
            state.timeLeft--;
            if (elements.quizTimer) elements.quizTimer.textContent = state.timeLeft;

            if (state.timeLeft <= 0) {
                clearInterval(state.quizTimerInterval);
                handleTimeOut();
            }
        }, 1000);
    }

    function handleAnswerSelection(event) {
        if (state.quizAnswered) return; // Prevent multiple answers
        state.quizAnswered = true;
        clearInterval(state.quizTimerInterval); // Stop timer

        const selectedButton = event.target;
        const selectedAnswer = selectedButton.dataset.answer;
        const correctAnswer = state.currentQuizQuestions[state.currentQuestionIndex].answer;

        disableOptions(); // Disable all option buttons

        const isCorrect = selectedAnswer === correctAnswer;

        if (isCorrect) {
            state.userScore++;
            selectedButton.classList.add("correct");
            elements.quizFeedback.textContent = "Correct!";
            elements.quizFeedback.className = "quiz-feedback correct";
        } else {
            selectedButton.classList.add("incorrect");
            elements.quizFeedback.textContent = `Incorrect. The answer is: ${correctAnswer}`;
            elements.quizFeedback.className = "quiz-feedback incorrect";

            // Highlight the correct answer button
            const correctButton = elements.quizOptions.querySelector(`button[data-answer="${CSS.escape(correctAnswer)}"]`);
             // Use CSS.escape for answers with special characters if necessary
            if (correctButton) {
                correctButton.classList.add("correct");
            }
        }

        elements.nextQuestionBtn.disabled = false; // Enable the next button
    }

    function handleTimeOut() {
        if (state.quizAnswered) return; // Already handled by click
        state.quizAnswered = true;
        disableOptions();

        const correctAnswer = state.currentQuizQuestions[state.currentQuestionIndex].answer;

        elements.quizFeedback.textContent = `Time's up! The correct answer was: ${correctAnswer}`;
        elements.quizFeedback.className = "quiz-feedback timeout";

        // Highlight the correct answer
        const correctButton = elements.quizOptions.querySelector(`button[data-answer="${CSS.escape(correctAnswer)}"]`);
        if (correctButton) {
            correctButton.classList.add("correct");
        }

        elements.nextQuestionBtn.disabled = false; // Enable next button
    }

    function disableOptions() {
        if (!elements.quizOptions) return;
        elements.quizOptions.querySelectorAll(".quiz-option-btn").forEach((btn) => {
            btn.disabled = true;
            btn.removeEventListener('click', handleAnswerSelection); // Prevent further clicks
        });
    }

    function nextQuestion() {
        state.currentQuestionIndex++;
        if (state.currentQuestionIndex < state.currentQuizQuestions.length) {
            displayCurrentQuestion();
        } else {
            showQuizResults();
        }
    }

    function showQuizResults() {
        clearInterval(state.quizTimerInterval); // Ensure timer is stopped

        // Hide quiz elements, show results
        if(elements.quizQuestionContainer) elements.quizQuestionContainer.style.display = "none";
        if(elements.quizNavigation) elements.quizNavigation.style.display = "none";
        if(elements.quizHeader) elements.quizHeader.style.display = "none"; // Hide timer/topic header
        if(elements.quizResultArea) elements.quizResultArea.style.display = "block";

        // Display the score
        if(elements.quizResultText) {
            elements.quizResultText.textContent = `Quiz Complete! Your score: ${state.userScore} out of ${state.currentQuizQuestions.length}`;
        }
    }

    function resetQuizArea() {
        clearInterval(state.quizTimerInterval);

        // Reset UI to initial state
        if(elements.quizArea) elements.quizArea.style.display = "none";
        if(elements.quizSetup) elements.quizSetup.style.display = "flex"; // Show setup
        if(elements.quizResultArea) elements.quizResultArea.style.display = "none"; // Hide results
        if(elements.quizMessage) elements.quizMessage.textContent = ""; // Clear messages
        if(elements.quizTopicSelect) elements.quizTopicSelect.value = ""; // Reset dropdown

        // Reset quiz state variables
        state.currentQuizTopic = null;
        state.currentQuizQuestions = [];
        state.currentQuestionIndex = 0;
        state.userScore = 0;
        state.quizAnswered = false;
        state.timeLeft = 0;
    }


    // --- Main Initialization Function ---

    async function initializeApp() {
        console.log("Initializing MERN Hub...");

        // 1. Populate Elements Object
        elements = {
            body: document.body,
            sidebar: document.querySelector(".sidebar"),
            sidebarToggleBtn: document.getElementById("sidebar-toggle"),
            mainContent: document.querySelector(".main-content"),
            navLinks: document.querySelectorAll(".nav-link"),
            contentSections: document.querySelectorAll(".content-section"),
            themeToggleBtn: document.getElementById("theme-toggle-btn"),
            roadmapContainer: document.getElementById("roadmap-phases-container"),
            resourcesList: document.getElementById("resources-list"),
            resourceFilter: document.getElementById("resource-filter"),
            overallProgressBar: document.getElementById("overall-progress-bar"),
            overallProgressText: document.getElementById("overall-progress-text"),
            sidebarProgressBar: document.getElementById("sidebar-progress-bar"),
            sidebarProgressText: document.getElementById("sidebar-progress-text"),
            currentFocusTopic: document.getElementById("current-focus-topic"),
            studyStreakDays: document.getElementById("study-streak-days"),
            streakMessage: document.getElementById("streak-message"),
            studyDateInput: document.getElementById("study-date"),
            studyDurationInput: document.getElementById("study-duration"),
            studyNotesInput: document.getElementById("study-notes"),
            logStudyBtn: document.getElementById("log-study-btn"),
            studyLogList: document.getElementById("study-log-list"),
            clearLogBtn: document.getElementById("clear-log-btn"),
            trackerMessage: document.getElementById("tracker-message"),
            quickLinksList: document.getElementById("quick-links-list"),
            // Quiz Specific Elements
            quizTopicSelect: document.getElementById("quiz-topic-select"),
            startQuizBtn: document.getElementById("start-quiz-btn"),
            quizArea: document.getElementById("quiz-area"),
            quizSetup: document.getElementById("quiz-setup"), // Added quiz setup div
            quizHeader: document.getElementById("quiz-header"),
            quizTopicTitle: document.getElementById("quiz-topic-title"),
            quizProgressTimer: document.getElementById("quiz-progress-timer"),
            quizQuestionNumber: document.getElementById("quiz-question-number"),
            quizTotalQuestions: document.getElementById("quiz-total-questions"), // Added total questions span
            quizTimer: document.getElementById("quiz-timer"),
            quizQuestionContainer: document.getElementById("quiz-question-container"),
            quizQuestion: document.getElementById("quiz-question"),
            quizOptions: document.getElementById("quiz-options"),
            quizFeedback: document.getElementById("quiz-feedback"),
            quizNavigation: document.getElementById("quiz-navigation"),
            nextQuestionBtn: document.getElementById("next-question-btn"),
            quizResultArea: document.getElementById("quiz-result-area"),
            quizResultText: document.getElementById("quiz-result-text"),
            restartQuizBtn: document.getElementById("restart-quiz-btn"),
            quizMessage: document.getElementById("quiz-message"),
        };

        // 2. Validate Essential Elements
        const essentialElementKeys = [
             'body', 'sidebar', 'sidebarToggleBtn', 'mainContent', 'navLinks',
             'contentSections', 'themeToggleBtn', 'roadmapContainer', 'resourcesList',
             'resourceFilter', 'overallProgressBar', 'overallProgressText', 'sidebarProgressBar',
             'sidebarProgressText', 'currentFocusTopic', 'studyStreakDays', 'streakMessage',
             'studyDateInput', 'logStudyBtn', 'studyLogList', 'clearLogBtn', 'trackerMessage',
             // Crucial Quiz Elements for basic operation
             'quizTopicSelect', 'startQuizBtn', 'quizArea', 'quizSetup', 'quizMessage',
             'quizResultArea', 'restartQuizBtn'
         ]; // Add more as needed
         const missingEssential = essentialElementKeys.filter(key => !elements[key] || (elements[key] instanceof NodeList && elements[key].length === 0));

         if (missingEssential.length > 0) {
             console.error("FATAL: Essential UI elements missing, cannot initialize app:", missingEssential);
             document.body.innerHTML = `<h1 style="color: red; padding: 20px;">Application Error: Required HTML elements are missing (${missingEssential.join(', ')}). Please check the HTML structure and element IDs.</h1>`;
             return; // Stop initialization
         }
         console.log("Essential elements found.");


        // 3. Load State and Data
        loadState(); // Load saved progress, theme, etc.
        await loadData(); // Fetch roadmap, resources, quiz data

        // 4. Initial UI Setup
        setTodaysDate();
        elements.body.className = state.theme; // Apply theme immediately
        updateThemeIcon();
        applySidebarState();

        // 5. Render Content
        renderRoadmap();
        renderResources();
        renderStudyLog();
        populateQuizTopics(); // Populate quiz dropdown AFTER data is loaded
        updateDashboard(); // Initial dashboard update

        // 6. Attach Event Listeners
        elements.navLinks.forEach((link) => link.addEventListener("click", handleNavClick));
        if(elements.themeToggleBtn) elements.themeToggleBtn.addEventListener("click", toggleTheme);
        if(elements.resourceFilter) elements.resourceFilter.addEventListener("change", renderResources);
        if(elements.logStudyBtn) elements.logStudyBtn.addEventListener("click", logStudySession);
        if(elements.clearLogBtn) elements.clearLogBtn.addEventListener("click", clearStudyLog);
        if(elements.sidebarToggleBtn) elements.sidebarToggleBtn.addEventListener("click", toggleSidebar);
        if(elements.startQuizBtn) elements.startQuizBtn.addEventListener("click", startQuiz);
        if(elements.nextQuestionBtn) elements.nextQuestionBtn.addEventListener("click", nextQuestion);
        if(elements.restartQuizBtn) elements.restartQuizBtn.addEventListener("click", resetQuizArea);
        if(elements.quickLinksList) elements.quickLinksList.addEventListener("click", handleQuickLinkClick);

        const focusLink = document.querySelector(".focus-link");
        if (focusLink) {
            focusLink.addEventListener("click", handleFocusLinkClick);
        }

        // 7. Initial Navigation
        // Handle hash routing if needed, or default to dashboard
        const initialSection = window.location.hash.substring(1) || "dashboard";
        navigateToSection(initialSection);

        console.log("MERN Hub Initialized Successfully.");
    }

    // Start the application
    initializeApp();

});