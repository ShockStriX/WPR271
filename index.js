document.addEventListener("DOMContentLoaded", function () {
  let workouts = [];
  
  // Login form handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "main.html";
    });
  }

  // Sidebar toggle handler
  const toggleBtn = document.querySelector(".toggle-btn");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  if (toggleBtn && sidebar && mainContent) {
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");
    });
  }

  // Same Page Switching function
  function showPage(pageID) {
    document
      .querySelectorAll(".page")
      .forEach((p) => (p.style.display = "none")); // Hides all pages
    document.getElementById(pageID).style.display = "block"; // Shows the selected page

    if (pageID === "dashboard") {
      renderCharts();
    }
    if (pageID === "workout-history") {
      displayWorkoutHistory();
    }
    if (pageID === "goals") {
      updateGoalsFromWorkouts();
      displayGoals();
      updateGoalsStats();
    }
    if (pageID === "achievements") {
      updateAchievementsFromWorkouts();
      displayAchievements();
      initAchievementFilters();
    }
  }

  // Navigation event listeners
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      // Remove active class from all links
      document.querySelectorAll(".sidebar a").forEach(l => l.classList.remove("active"));
      // Add active class to clicked link
      this.classList.add("active");
      
      const pageID = this.getAttribute("href").substring(1);
      showPage(pageID);
    });
  });

  // Set default page
  showPage("dashboard");

  // Generating dummy data
  const workoutTypes = [
    "Weightlifting",
    "Pilates",
    "Cycling",
    "Rowing",
    "Running",
    "Swimming",
    "Circuit",
    "Yoga",
  ];

  let startDate = new Date("2025-06-01");

  for (let i = 0; i < 100; i++) {
    const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];

    let duration, calories;

    switch (type) {
      case "Weightlifting":
        duration = Math.floor(Math.random() * 31) + 30;
        calories = Math.floor(duration * 8);
        break;
      case "Pilates":
        duration = Math.floor(Math.random() * 31) + 30;
        calories = Math.floor(duration * 4);
        break;
      case "Cycling":
        duration = Math.floor(Math.random() * 61) + 30;
        calories = Math.floor(duration * 9);
        break;
      case "Rowing":
        duration = Math.floor(Math.random() * 46) + 30;
        calories = Math.floor(duration * 9);
        break;
      case "Running":
        duration = Math.floor(Math.random() * 16) + 30;
        calories = Math.floor(duration * 8);
        break;
      case "Swimming":
        duration = Math.floor(Math.random() * 21) + 30;
        calories = Math.floor(duration * 11);
        break;
      case "Circuit":
        duration = Math.floor(Math.random() * 11) + 30;
        calories = Math.floor(duration * 6);
        break;
      case "Yoga":
        duration = Math.floor(Math.random() * 26) + 30;
        calories = Math.floor(duration * 3);
        break;
    }

    const date = startDate.toISOString().split("T")[0];
    workouts.push({ type, duration, calories, date, favourite: false });
    startDate.setDate(startDate.getDate() + 1);
  }

  // Logs a new workout when the form is submitted
  const workoutForm = document.getElementById("workoutForm");
  if (workoutForm) {
    workoutForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const workout = {
        type: document.getElementById("workoutType").value,
        duration: parseInt(document.getElementById("duration").value),
        calories: parseInt(document.getElementById("calories").value),
        date: document.getElementById("date").value,
        favourite: false
      };

      workouts.push(workout);
      console.log("Workout added", workout);
      
      // Update achievements after adding workout
      updateAchievementsFromWorkouts();
      
      // Reset form
      workoutForm.reset();
      
      // Show success message
      alert("Workout logged successfully!");
    });
  }

  // Workout History - Displaying workout history in a table
  function displayWorkoutHistory() {
    const tableBody = document.querySelector("#workoutTable tbody");
    if (!tableBody) return;
    
    tableBody.innerHTML = "";

    workouts.forEach((w, index) => {
      const row = document.createElement("tr");

      // Favourite button cell
      const favCell = document.createElement("td");
      const favBtn = document.createElement("button");
      favBtn.textContent = w.favourite ? "❤️" : "🤍"; // Fixed emoji encoding
      favBtn.addEventListener("click", () => {
        w.favourite = !w.favourite;
        displayWorkoutHistory();
      });
      favCell.appendChild(favBtn);
      row.appendChild(favCell);

      // Other workout data cells
      ["type", "duration", "calories", "date"].forEach((key) => {
        const cell = document.createElement("td");
        cell.textContent = w[key];
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });
  }

  // Generating Workout Charts
  function renderCharts() {
    if (typeof Chart === 'undefined') {
      console.log('Chart.js not loaded yet');
      return;
    }
    
    // Destroy existing charts
    if (window.pieChart) window.pieChart.destroy();
    if (window.barChart) window.barChart.destroy();

    const typeCounts = {};
    workouts.forEach((w) => {
      typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
    });

    const pieCtx = document.getElementById("workoutPieChart");
    const barCtx = document.getElementById("workoutBarChart");
    
    if (!pieCtx || !barCtx) return;

    // Pie Chart
    window.pieChart = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: Object.keys(typeCounts),
        datasets: [
          {
            label: "Workout Type Distribution",
            data: Object.values(typeCounts),
            backgroundColor: [
              "#0b84a5", "#f6c85f", "#6f4e7c", "#9dd866", 
              "#ca472f", "#ffa056", "#8dddd0", "#3cc677"
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    // Bar Chart - Calories per type
    const caloriesPerType = {};
    workouts.forEach((w) => {
      caloriesPerType[w.type] = (caloriesPerType[w.type] || 0) + w.calories;
    });

    window.barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: Object.keys(caloriesPerType),
        datasets: [
          {
            label: "Total Calories Burned",
            data: Object.values(caloriesPerType),
            backgroundColor: [
              "#0b84a5", "#f6c85f", "#6f4e7c", "#9dd866", 
              "#ca472f", "#ffa056", "#8dddd0", "#3cc677"
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  // Goals data storage
  let goals = [
    {
      id: 1,
      title: "Monthly Workout Target",
      description: "Complete 20 workouts this month",
      type: "frequency",
      target: 20,
      current: 12,
      deadline: "2025-09-30",
      category: "Frequency"
    },
    {
      id: 2,
      title: "Burn 10,000 Calories",
      description: "Burn a total of 10,000 calories this month",
      type: "calories",
      target: 10000,
      current: 6800,
      deadline: "2025-09-30",
      category: "Calories"
    },
    {
      id: 3,
      title: "Master Yoga",
      description: "Complete 15 yoga sessions to improve flexibility",
      type: "activity",
      target: 15,
      current: 7,
      deadline: "2025-10-15",
      category: "Skill"
    }
  ];

  // Goals functions
  function displayGoals() {
    const goalsContainer = document.getElementById('goalsContainer');
    if (!goalsContainer) return;
    
    goalsContainer.innerHTML = '';
    
    goals.forEach(goal => {
      const progressPercentage = Math.min((goal.current / goal.target) * 100, 100);
      const isCompleted = goal.current >= goal.target;
      const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      
      const goalCard = document.createElement('div');
      goalCard.className = `goal-card ${isCompleted ? 'completed' : ''}`;
      
      goalCard.innerHTML = `
        <div class="goal-header">
          <h3>${goal.title}</h3>
          <span class="goal-category">${goal.category}</span>
        </div>
        <p class="goal-description">${goal.description}</p>
        <div class="goal-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="progress-text">
            <span>${goal.current} / ${goal.target}</span>
            <span>${Math.round(progressPercentage)}%</span>
          </div>
        </div>
        <div class="goal-footer">
          <span class="deadline">
            ${daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
          </span>
          <div class="goal-actions">
            <button onclick="updateGoalProgress(${goal.id}, 1)" class="btn-small btn-primary" ${isCompleted ? 'disabled' : ''}>
              +1
            </button>
            <button onclick="editGoal(${goal.id})" class="btn-small btn-secondary">
              Edit
            </button>
            <button onclick="deleteGoal(${goal.id})" class="btn-small btn-danger">
              Delete
            </button>
          </div>
        </div>
      `;
      
      goalsContainer.appendChild(goalCard);
    });
    
    updateGoalsStats();
  }

  function updateGoalProgress(goalId, increment) {
    const goal = goals.find(g => g.id === goalId);
    if (goal && goal.current < goal.target) {
      goal.current += increment;
      displayGoals();
    }
  }

  function deleteGoal(goalId) {
    if (confirm('Are you sure you want to delete this goal?')) {
      goals = goals.filter(g => g.id !== goalId);
      displayGoals();
    }
  }

  function editGoal(goalId) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    // Populate edit form
    document.getElementById('editGoalId').value = goal.id;
    document.getElementById('editGoalTitle').value = goal.title;
    document.getElementById('editGoalDescription').value = goal.description;
    document.getElementById('editGoalType').value = goal.type;
    document.getElementById('editGoalTarget').value = goal.target;
    document.getElementById('editGoalDeadline').value = goal.deadline;
    document.getElementById('editGoalCategory').value = goal.category;
    
    // Show edit modal
    document.getElementById('editGoalModal').style.display = 'block';
  }

  // Add new goal
  function addNewGoal() {
    const title = document.getElementById('newGoalTitle').value.trim();
    const description = document.getElementById('newGoalDescription').value.trim();
    const type = document.getElementById('newGoalType').value;
    const target = parseInt(document.getElementById('newGoalTarget').value);
    const deadline = document.getElementById('newGoalDeadline').value;
    const category = document.getElementById('newGoalCategory').value;
    
    if (!title || !target || !deadline) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newGoal = {
      id: Date.now(),
      title,
      description,
      type,
      target,
      current: 0,
      deadline,
      category
    };
    
    goals.push(newGoal);
    displayGoals();
    
    // Reset form and close modal
    document.getElementById('newGoalForm').reset();
    document.getElementById('addGoalModal').style.display = 'none';
  }

  // Update goal
  function updateGoal() {
    const goalId = parseInt(document.getElementById('editGoalId').value);
    const goal = goals.find(g => g.id === goalId);
    
    if (!goal) return;
    
    goal.title = document.getElementById('editGoalTitle').value.trim();
    goal.description = document.getElementById('editGoalDescription').value.trim();
    goal.type = document.getElementById('editGoalType').value;
    goal.target = parseInt(document.getElementById('editGoalTarget').value);
    goal.deadline = document.getElementById('editGoalDeadline').value;
    goal.category = document.getElementById('editGoalCategory').value;
    
    displayGoals();
    document.getElementById('editGoalModal').style.display = 'none';
  }

  // Update goals based on workout data
  function updateGoalsFromWorkouts() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter workouts for current month
    const thisMonthWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate.getMonth() === currentMonth && workoutDate.getFullYear() === currentYear;
    });
    
    goals.forEach(goal => {
      if (goal.type === 'frequency') {
        goal.current = thisMonthWorkouts.length;
      } else if (goal.type === 'calories') {
        goal.current = thisMonthWorkouts.reduce((total, workout) => total + workout.calories, 0);
      } else if (goal.type === 'activity') {
        const activityName = goal.title.toLowerCase();
        const activityWorkouts = thisMonthWorkouts.filter(workout => 
          workout.type.toLowerCase().includes(activityName) || 
          activityName.includes(workout.type.toLowerCase())
        );
        goal.current = activityWorkouts.length;
      }
    });
  }

  // Update goals statistics
  function updateGoalsStats() {
    const activeGoals = goals.filter(goal => goal.current < goal.target).length;
    const completedGoals = goals.filter(goal => goal.current >= goal.target).length;
    const successRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;
    
    const activeGoalsCount = document.getElementById('activeGoalsCount');
    const completedGoalsCount = document.getElementById('completedGoalsCount');
    const successRateElement = document.getElementById('successRate');
    
    if (activeGoalsCount) activeGoalsCount.textContent = activeGoals;
    if (completedGoalsCount) completedGoalsCount.textContent = completedGoals;
    if (successRateElement) successRateElement.textContent = `${successRate}%`;
  }

  // Modal functions
  function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }

  function showAddGoalModal() {
    document.getElementById('addGoalModal').style.display = 'block';
  }

  // Modal event listeners
  window.onclick = function(event) {
    const addModal = document.getElementById('addGoalModal');
    const editModal = document.getElementById('editGoalModal');
    
    if (event.target === addModal) {
      addModal.style.display = 'none';
    }
    if (event.target === editModal) {
      editModal.style.display = 'none';
    }
  };

  // Achievements data
  let achievements = [
    {
      id: 1,
      title: "First Workout",
      description: "Complete your first workout",
      icon: "🚀", // Fixed emoji encoding
      type: "count",
      target: 1,
      current: 0,
      category: "Milestone",
      earned: false
    },
    {
      id: 2,
      title: "Weekly Warrior",
      description: "Complete 5 workouts in a week",
      icon: "💪", // Fixed emoji encoding
      type: "frequency",
      target: 5,
      current: 0,
      category: "Consistency",
      earned: false
    },
    {
      id: 3,
      title: "Calorie Crusher",
      description: "Burn 10,000 total calories",
      icon: "🔥", // Fixed emoji encoding
      type: "calories",
      target: 10000,
      current: 0,
      category: "Endurance",
      earned: false
    },
    {
      id: 4,
      title: "Marathon Runner",
      description: "Run 26.2 miles total",
      icon: "🏃", // Fixed emoji encoding
      type: "distance",
      target: 26.2,
      current: 0,
      category: "Endurance",
      earned: false
    },
    {
      id: 5,
      title: "Early Bird",
      description: "Work out before 8 AM for 7 days",
      icon: "🌅", // Fixed emoji encoding
      type: "streak",
      target: 7,
      current: 0,
      category: "Consistency",
      earned: false
    },
    {
      id: 6,
      title: "Variety Pack",
      description: "Try 5 different workout types",
      icon: "🎯", // Fixed emoji encoding
      type: "variety",
      target: 5,
      current: 0,
      category: "Exploration",
      earned: false
    }
  ];

  // Display achievements
  function displayAchievements(filter = "all") {
    const achievementsContainer = document.getElementById('achievementsContainer');
    if (!achievementsContainer) return;
    
    achievementsContainer.innerHTML = '';
    
    // Filter achievements based on selection
    let filteredAchievements = achievements;
    if (filter === "completed") {
      filteredAchievements = achievements.filter(a => a.earned);
    } else if (filter === "pending") {
      filteredAchievements = achievements.filter(a => !a.earned);
    }
    
    filteredAchievements.forEach(achievement => {
      const progressPercentage = Math.min((achievement.current / achievement.target) * 100, 100);
      
      const achievementCard = document.createElement('div');
      achievementCard.className = `achievement-card ${achievement.earned ? '' : 'locked'}`;
      
      achievementCard.innerHTML = `
        ${achievement.earned ? '<div class="achievement-badge">EARNED</div>' : ''}
        <div class="achievement-icon">${achievement.icon}</div>
        <h3>${achievement.title}</h3>
        <p>${achievement.description}</p>
        <span class="goal-category">${achievement.category}</span>
        
        ${!achievement.earned ? `
          <div class="achievement-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="progress-text">
              ${Math.round(progressPercentage)}% Complete
            </div>
          </div>
        ` : ''}
      `;
      
      achievementsContainer.appendChild(achievementCard);
    });
    
    updateAchievementsStats();
  }

  // Update achievements stats
  function updateAchievementsStats() {
    const totalBadges = document.getElementById('totalBadges');
    const completionRate = document.getElementById('completionRate');
    const recentUnlock = document.getElementById('recentUnlock');
    
    const earnedAchievements = achievements.filter(a => a.earned);
    const total = achievements.length;
    const earned = earnedAchievements.length;
    const rate = total > 0 ? Math.round((earned / total) * 100) : 0;
    
    // Find most recent unlock
    let recent = "None";
    if (earned > 0) {
      recent = earnedAchievements[earnedAchievements.length - 1].title;
    }
    
    if (totalBadges) totalBadges.textContent = earned;
    if (completionRate) completionRate.textContent = `${rate}%`;
    if (recentUnlock) recentUnlock.textContent = recent;
  }

  // Show achievement unlocked toast
  function showAchievementToast(achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="achievement-toast-icon">${achievement.icon}</div>
      <div class="achievement-toast-content">
        <h4>Achievement Unlocked!</h4>
        <p>${achievement.title}</p>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 500);
    }, 5000);
  }

  // Update achievements from workout data
  function updateAchievementsFromWorkouts() {
    let newUnlocks = [];
    
    // Store previously earned status
    achievements.forEach(achievement => {
      achievement.previouslyEarned = achievement.earned;
      achievement.current = 0;
      achievement.earned = false;
    });
    
    // Calculate achievements progress based on workouts
    const workoutCount = workouts.length;
    const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);
    const uniqueWorkoutTypes = new Set(workouts.map(w => w.type));
    
    // Update achievements based on calculations
    achievements[0].current = workoutCount; // First Workout
    achievements[1].current = Math.min(workoutCount, 5); // Weekly Warrior (simplified)
    achievements[2].current = totalCalories; // Calorie Crusher
    achievements[3].current = workoutCount * 2; // Marathon Runner (simplified: 2 miles per workout)
    achievements[4].current = Math.min(workoutCount, 7); // Early Bird (simplified)
    achievements[5].current = uniqueWorkoutTypes.size; // Variety Pack
    
    // Check if achievements are earned
    achievements.forEach(achievement => {
      if (achievement.current >= achievement.target) {
        achievement.earned = true;
        achievement.current = achievement.target;
        
        // Check if this is a new unlock
        if (!achievement.previouslyEarned) {
          newUnlocks.push(achievement);
        }
      }
      
      delete achievement.previouslyEarned;
    });
    
    // Show toast for new unlocks
    newUnlocks.forEach(achievement => {
      showAchievementToast(achievement);
    });
    
    return newUnlocks;
  }

  // Add event listener for achievement filters
  function initAchievementFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Filter achievements
        const filter = this.getAttribute('data-filter');
        displayAchievements(filter);
      });
    });
  }

  // Make functions globally available
  window.showPage = showPage;
  window.updateGoalProgress = updateGoalProgress;
  window.editGoal = editGoal;
  window.deleteGoal = deleteGoal;
  window.addNewGoal = addNewGoal;
  window.updateGoal = updateGoal;
  window.closeModal = closeModal;
  window.showAddGoalModal = showAddGoalModal;
  window.displayAchievements = displayAchievements;
  window.displayWorkoutHistory = displayWorkoutHistory;
  window.renderCharts = renderCharts;
  window.updateGoalsFromWorkouts = updateGoalsFromWorkouts;
  window.updateGoalsStats = updateGoalsStats;
  window.displayGoals = displayGoals;
  window.updateAchievementsFromWorkouts = updateAchievementsFromWorkouts;
  window.initAchievementFilters = initAchievementFilters;

});