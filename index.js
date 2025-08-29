document.addEventListener("DOMContentLoaded", function () {
  //Workout data
  let workouts = [];
  // Player data
  let playerData = {
    level: 1,
    xp: 0,
    totalXp: 0,
  };

  //Achievement data
  let achievements = [
    // Workout Frequency Achievements
    {
      id: "first_workout",
      title: "Getting Started",
      description: "Complete your first workout",
      icon: "🏃",
      category: "workout",
      rarity: "common",
      xpReward: 10,
      requirement: { type: "workout_count", value: 1 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "workout_warrior",
      title: "Workout Warrior",
      description: "Complete 10 workouts",
      icon: "💪",
      category: "workout",
      rarity: "rare",
      xpReward: 50,
      requirement: { type: "workout_count", value: 10 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "fitness_fanatic",
      title: "Fitness Fanatic",
      description: "Complete 50 workouts",
      icon: "🏋️",
      category: "workout",
      rarity: "epic",
      xpReward: 200,
      requirement: { type: "workout_count", value: 50 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "gym_legend",
      title: "Gym Legend",
      description: "Complete 100 workouts",
      icon: "👑",
      category: "workout",
      rarity: "legendary",
      xpReward: 500,
      requirement: { type: "workout_count", value: 100 },
      unlocked: false,
      progress: 0,
    },

    // Calorie Achievements
    {
      id: "calorie_crusher",
      title: "Calorie Crusher",
      description: "Burn 1,000 calories total",
      icon: "🔥",
      category: "calories",
      rarity: "common",
      xpReward: 25,
      requirement: { type: "total_calories", value: 1000 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "calorie_destroyer",
      title: "Calorie Destroyer",
      description: "Burn 5,000 calories total",
      icon: "⚡",
      category: "calories",
      rarity: "rare",
      xpReward: 100,
      requirement: { type: "total_calories", value: 5000 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "inferno",
      title: "Inferno",
      description: "Burn 500 calories in a single workout",
      icon: "🌋",
      category: "calories",
      rarity: "epic",
      xpReward: 150,
      requirement: { type: "single_workout_calories", value: 500 },
      unlocked: false,
      progress: 0,
    },

    // Streak Achievements
    {
      id: "consistent_starter",
      title: "Consistent Starter",
      description: "Work out 3 days in a row",
      icon: "🔗",
      category: "streak",
      rarity: "common",
      xpReward: 30,
      requirement: { type: "workout_streak", value: 3 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "dedication",
      title: "Dedication",
      description: "Work out 7 days in a row",
      icon: "🏆",
      category: "streak",
      rarity: "rare",
      xpReward: 100,
      requirement: { type: "workout_streak", value: 7 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "unstoppable",
      title: "Unstoppable",
      description: "Work out 30 days in a row",
      icon: "🚀",
      category: "streak",
      rarity: "legendary",
      xpReward: 300,
      requirement: { type: "workout_streak", value: 30 },
      unlocked: false,
      progress: 0,
    },

    // Milestone Achievements
    {
      id: "early_bird",
      title: "Early Bird",
      description: "Complete a workout before 8 AM",
      icon: "🌅",
      category: "milestone",
      rarity: "common",
      xpReward: 20,
      requirement: { type: "early_workout", value: 1 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "weekend_warrior",
      title: "Weekend Warrior",
      description: "Work out on both Saturday and Sunday",
      icon: "🗓️",
      category: "milestone",
      rarity: "rare",
      xpReward: 75,
      requirement: { type: "weekend_workouts", value: 1 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "variety_seeker",
      title: "Variety Seeker",
      description: "Try 5 different workout types",
      icon: "🎭",
      category: "milestone",
      rarity: "epic",
      xpReward: 120,
      requirement: { type: "workout_variety", value: 5 },
      unlocked: false,
      progress: 0,
    },

    // Activity Specific Achievements
    {
      id: "yoga_master",
      title: "Yoga Master",
      description: "Complete 20 yoga sessions",
      icon: "🧘",
      category: "workout",
      rarity: "rare",
      xpReward: 80,
      requirement: { type: "activity_count", activity: "Yoga", value: 20 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "running_machine",
      title: "Running Machine",
      description: "Complete 15 running sessions",
      icon: "🏃‍♂️",
      category: "workout",
      rarity: "rare",
      xpReward: 80,
      requirement: { type: "activity_count", activity: "Running", value: 15 },
      unlocked: false,
      progress: 0,
    },
  ];
  
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

  //Same Page Switching function
  function showPage(pageID) {
    document
      .querySelectorAll(".page")
      .forEach((p) => (p.style.display = "none")); //Hides all pages
    document.getElementById(pageID).style.display = "block"; //Then shows the selected page

    if (pageID === "dashboard") {
      renderCharts();
    }
    if (pageID === "workout-history") {
      displayWorkoutHistory();
    }
    if (pageID === "goals") {
      updateGoals();
    }
    if (pageID === "achievements") {
      updateAchievementDisplay();
    }
  }

  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageID = this.getAttribute("href").substring(1);
      showPage(pageID);
    });
  });

  //Log a workout form handler

  //Generating dummy data
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

  //Logs a new workout when the form is submitted
  const workoutForm = document.getElementById("workoutForm");
  if (workoutForm) {
    workoutForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const workout = {
        type: document.getElementById("workoutType").value,
        duration: parseInt(document.getElementById("duration").value),
        calories: parseInt(document.getElementById("calories").value),
        date: document.getElementById("date").value,
      };

      workouts.push(workout);

      console.log("Workout added", workout);
      console.log("All workouts", workouts);

      workoutForm.reset();
    });
  }

  //Workout History
  //Displaying workout history in a table

  function displayWorkoutHistory() {
    const tableBody = document.querySelector("#workoutTable tbody");
    tableBody.innerHTML = "";

    workouts
      .slice()
      .reverse()
      .forEach((w, index) => {
        const row = document.createElement("tr");

        const favCell = document.createElement("td");
        const favBut = document.createElement("button");
        favBut.textContent = w.favourite ? "❤️" : "🤍";
        favBut.addEventListener("click", () => {
          w.favourite = !w.favourite;
          displayWorkoutHistory();
        });

        favCell.appendChild(favBut);
        row.appendChild(favCell);

        ["type", "duration", "calories", "date"].forEach((key) => {
          const cell = document.createElement("td");
          cell.textContent = w[key];
          row.appendChild(cell);
        });

        tableBody.appendChild(row);
      });
  }
  displayWorkoutHistory();

  // Update achievements function
  function updateGoals() {
    if (workouts.length === 0) return;

    // Calculate totals
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);

    // Calculate workout streak (consecutive days with workouts)
    const sortedDates = workouts
      .map((w) => new Date(w.date))
      .sort((a, b) => b - a);
    let streak = 0;
    if (sortedDates.length > 0) {
      const uniqueDates = [
        ...new Set(sortedDates.map((d) => d.toDateString())),
      ];
      const today = new Date();
      let currentDate = new Date(today);

      for (let date of uniqueDates) {
        const workoutDate = new Date(date);
        const daysDiff = Math.floor(
          (currentDate - workoutDate) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === streak) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate workout type counts
    const weightliftingCount = workouts.filter((w) =>
      w.type.toLowerCase().includes("weightlifting")
    ).length;
    const cardioTypes = ["running", "cycling", "swimming", "rowing"];
    const cardioCount = workouts.filter((w) =>
      cardioTypes.some((type) => w.type.toLowerCase().includes(type))
    ).length;

    // Update progress bars
    updateProgressBar("totalWorkouts", totalWorkouts);
    updateProgressBar("totalCalories", totalCalories);
    updateProgressBar("totalTime", totalMinutes);
    updateProgressBar("weightlifting", weightliftingCount);
    updateProgressBar("cardio", cardioCount);

    // Update text values
    const totalWorkoutsElement = document.getElementById("totalWorkoutsCount");
    const totalCaloriesElement = document.getElementById("totalCaloriesCount");
    const totalTimeElement = document.getElementById("totalTimeCount");
    const streakElement = document.getElementById("streakCount");
    const weightliftingElement = document.getElementById("weightliftingCount");
    const cardioElement = document.getElementById("cardioCount");

    if (totalWorkoutsElement) totalWorkoutsElement.textContent = totalWorkouts;
    if (totalCaloriesElement)
      totalCaloriesElement.textContent = totalCalories.toLocaleString();
    if (totalTimeElement)
      totalTimeElement.textContent = totalMinutes.toLocaleString();
    if (streakElement) streakElement.textContent = streak;
    if (weightliftingElement)
      weightliftingElement.textContent = weightliftingCount;
    if (cardioElement) cardioElement.textContent = cardioCount;
  }

  // Helper function to update individual progress bar
  function updateProgressBar(id, current) {
    const progressElement = document.getElementById(id + "Progress");
    if (!progressElement) return;

    // Find the parent progress-text and get the data-goal attribute
    const container = progressElement.closest(".progress-bar-container");
    const textElement = container.querySelector(".progress-text");
    const goal = parseInt(textElement.getAttribute("data-goal"));

    if (!goal || isNaN(goal)) return;

    const percentage = Math.min((current / goal) * 100, 100);
    progressElement.style.width = percentage + "%";
  }

  //Generating Workout Charts
  function renderCharts() {
    if (window.pieChart) window.pieChart.destroy();
    if (window.barChart) window.barChart.destroy();

    const typeCounts = {};
    workouts.forEach((w) => {
      typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
    });

    const pieCtx = document.getElementById("workoutPieChart").getContext("2d");
    window.pieChart = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: Object.keys(typeCounts),
        datasets: [
          {
            label: "Workout Type Distribution",
            data: Object.values(typeCounts),
            backgroundColor: [
              "#0b84a5",
              "#f6c85f",
              "#6f4e7c",
              "#9dd866",
              "#ca472f",
              "#ffa056",
              "#8dddd0",
              "#3cc677",
            ],
          },
        ],
      },
    });

    const caloriesPerType = {};
    workouts.forEach((w) => {
      caloriesPerType[w.type] = (caloriesPerType[w.type] || 0) + w.calories;
    });

    const barCtx = document.getElementById("workoutBarChart").getContext("2d");
    window.barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: Object.keys(caloriesPerType),
        datasets: [
          {
            label: "Total Calories Burned",
            data: Object.values(caloriesPerType),
            backgroundColor: [
              "#0b84a5",
              "#f6c85f",
              "#6f4e7c",
              "#9dd866",
              "#ca472f",
              "#ffa056",
              "#8dddd0",
              "#3cc677",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  //Xander de Klerk
  // Initialize achievements on page load
  updateAchievementDisplay();

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category-btn");
      filterAchievements(category);
    });
  });

  // Level thresholds and titles
  const levelThresholds = [
    { level: 1, xp: 0, title: "Beginner" },
    { level: 2, xp: 100, title: "Novice" },
    { level: 3, xp: 250, title: "Amateur" },
    { level: 4, xp: 450, title: "Enthusiast" },
    { level: 5, xp: 700, title: "Dedicated" },
    { level: 6, xp: 1000, title: "Committed" },
    { level: 7, xp: 1400, title: "Expert" },
    { level: 8, xp: 1900, title: "Master" },
    { level: 9, xp: 2500, title: "Champion" },
    { level: 10, xp: 3200, title: "Legend" },
  ];

  // Achievement functions
  function checkAchievements() {
    const newlyUnlocked = [];

    achievements.forEach((achievement) => {
      if (!achievement.unlocked) {
        const progress = calculateAchievementProgress(achievement);
        achievement.progress = progress;

        if (progress >= achievement.requirement.value) {
          achievement.unlocked = true;
          achievement.progress = achievement.requirement.value;
          newlyUnlocked.push(achievement);
          addXP(achievement.xpReward);
        }
      }
    });

    // Show unlock animations for newly unlocked achievements
    newlyUnlocked.forEach((achievement, index) => {
      setTimeout(() => showAchievementUnlock(achievement), index * 1500);
    });

    updateAchievementDisplay();
    return newlyUnlocked.length > 0;
  }

  function calculateAchievementProgress(achievement) {
    const req = achievement.requirement;

    switch (req.type) {
      case "workout_count":
        return workouts.length;

      case "total_calories":
        return workouts.reduce((sum, workout) => sum + workout.calories, 0);

      case "single_workout_calories":
        const maxCalories = Math.max(...workouts.map((w) => w.calories), 0);
        return Math.min(maxCalories, req.value);

      case "workout_streak":
        return calculateCurrentStreak();

      case "early_workout":
        // This would need workout time data - returning 0 for now
        return 0;

      case "weekend_workouts":
        const weekendWorkouts = workouts.filter((w) => {
          const day = new Date(w.date).getDay();
          return day === 0 || day === 6; // Sunday or Saturday
        });
        return weekendWorkouts.length > 0 ? 1 : 0;

      case "workout_variety":
        const uniqueTypes = new Set(workouts.map((w) => w.type));
        return uniqueTypes.size;

      case "activity_count":
        return workouts.filter((w) => w.type === req.activity).length;

      default:
        return 0;
    }
  }

  function calculateCurrentStreak() {
    if (workouts.length === 0) return 0;

    // Sort workouts by date
    const sortedWorkouts = [...workouts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    let streak = 1;
    let currentDate = new Date(sortedWorkouts[0].date);

    for (let i = 1; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].date);
      const dayDiff = Math.abs(
        (currentDate - workoutDate) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        streak++;
        currentDate = workoutDate;
      } else if (dayDiff > 1) {
        break;
      }
    }

    return streak;
  }

  function addXP(amount) {
    playerData.xp += amount;
    playerData.totalXp += amount;

    // Check for level up
    const newLevel = getLevelFromXP(playerData.totalXp);
    if (newLevel > playerData.level) {
      playerData.level = newLevel;
      playerData.xp = playerData.totalXp - getXPForLevel(newLevel);
    }

    updatePlayerLevel();
  }

  function getLevelFromXP(totalXp) {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (totalXp >= levelThresholds[i].xp) {
        return levelThresholds[i].level;
      }
    }
    return 1;
  }

  function getXPForLevel(level) {
    const threshold = levelThresholds.find((t) => t.level === level);
    return threshold ? threshold.xp : 0;
  }

  function getXPForNextLevel(level) {
    const nextThreshold = levelThresholds.find((t) => t.level === level + 1);
    return nextThreshold ? nextThreshold.xp : getXPForLevel(level);
  }

  function getLevelTitle(level) {
    const threshold = levelThresholds.find((t) => t.level === level);
    return threshold ? threshold.title : "Unknown";
  }

  function showAchievementUnlock(achievement) {
    const modal = document.getElementById("achievementModal");
    document.getElementById("modalAchievementIcon").textContent =
      achievement.icon;
    document.getElementById("modalAchievementTitle").textContent =
      achievement.title;
    document.getElementById("modalAchievementDescription").textContent =
      achievement.description;
    document.getElementById("modalXpReward").textContent = achievement.xpReward;

    modal.style.display = "block";

    // Auto close after 5 seconds
    setTimeout(() => {
      if (modal.style.display === "block") {
        modal.style.display = "none";
      }
    }, 5000);
  }

  function closeAchievementModal() {
    document.getElementById("achievementModal").style.display = "none";
  }

  function filterAchievements(category) {
    document
      .querySelectorAll(".category-btn")
      .forEach((btn) => btn.classList.remove("active"));
    const activeBtn = document.querySelector(
      `[data-category-btn="${category}"]`
    );
    if (activeBtn) activeBtn.classList.add("active");

    const cards = document.querySelectorAll(".achievement-card");
    cards.forEach((card) => {
      const cardCategory = card.dataset.category;
      card.style.display =
        category === "all" || cardCategory === category ? "block" : "none";
    });
  }

  function updateAchievementDisplay() {
    const container = document.getElementById("achievementsContainer");
    if (!container) return;

    container.innerHTML = "";

    achievements.forEach((achievement) => {
      const progressPercentage = Math.min(
        (achievement.progress / achievement.requirement.value) * 100,
        100
      );

      const card = document.createElement("div");
      card.className = `achievement-card ${
        achievement.unlocked ? "unlocked" : "locked"
      }`;
      card.dataset.category = achievement.category;

      card.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <h3 class="achievement-title">${achievement.title}</h3>
      <p class="achievement-description">${achievement.description}</p>
      <div class="achievement-progress">
        <div class="achievement-progress-fill" style="width: ${progressPercentage}%"></div>
      </div>
      <div class="achievement-meta">
        <span class="achievement-progress-text">${achievement.progress} / ${
        achievement.requirement.value
      }</span>
        <div class="achievement-badges">
          <span class="achievement-rarity rarity-${
            achievement.rarity
          }">${achievement.rarity.toUpperCase()}</span>
          <span class="xp-badge">${achievement.xpReward} XP</span>
        </div>
      </div>
    `;

      container.appendChild(card);
    });

    updateAchievementStats();
  }

  function updateAchievementStats() {
    const earnedBadges = achievements.filter((a) => a.unlocked).length;
    const totalBadges = achievements.length;
    const progress = Math.round((earnedBadges / totalBadges) * 100);

    const earnedElement = document.getElementById("earnedBadges");
    const totalElement = document.getElementById("totalBadges");
    const progressElement = document.getElementById("achievementProgress");

    if (earnedElement) earnedElement.textContent = earnedBadges;
    if (totalElement) totalElement.textContent = totalBadges;
    if (progressElement) progressElement.textContent = `${progress}%`;
  }

  function updatePlayerLevel() {
    const levelElement = document.getElementById("playerLevel");
    const titleElement = document.getElementById("levelTitle");
    const xpFillElement = document.getElementById("xpFill");
    const xpTextElement = document.getElementById("xpText");
    const rewardsElement = document.getElementById("nextLevelRewards");

    if (!levelElement) return;

    const currentLevelXP = getXPForLevel(playerData.level);
    const nextLevelXP = getXPForNextLevel(playerData.level);
    const xpForCurrentLevel = playerData.totalXp - currentLevelXP;
    const xpNeededForNext = nextLevelXP - currentLevelXP;
    const xpProgress = Math.min(
      (xpForCurrentLevel / xpNeededForNext) * 100,
      100
    );

    levelElement.textContent = playerData.level;
    titleElement.textContent = getLevelTitle(playerData.level);
    xpFillElement.style.width = `${xpProgress}%`;
    xpTextElement.textContent = `${xpForCurrentLevel} / ${xpNeededForNext} XP`;

    // Update next level rewards
    if (rewardsElement && playerData.level < 10) {
      const nextLevel = playerData.level + 1;
      rewardsElement.innerHTML = `
      <li>Unlock Level ${nextLevel} title: "${getLevelTitle(nextLevel)}"</li>
      <li>New achievement challenges</li>
      <li>Advanced workout insights</li>
    `;
    } else if (rewardsElement) {
      rewardsElement.innerHTML = "<li>You've reached the maximum level!</li>";
    }
  }

  function displayAchievements() {
    checkAchievements();
    updateAchievementDisplay();
    updatePlayerLevel();
  }

  // Initialize achievements when workouts are updated
  function initializeAchievements() {
    // Calculate initial player level based on existing achievements
    let initialXP = 0;

    achievements.forEach((achievement) => {
      const progress = calculateAchievementProgress(achievement);
      achievement.progress = progress;

      if (progress >= achievement.requirement.value) {
        achievement.unlocked = true;
        achievement.progress = achievement.requirement.value;
        initialXP += achievement.xpReward;
      }
    });

    playerData.totalXp = initialXP;
    playerData.level = getLevelFromXP(initialXP);
    playerData.xp = initialXP - getXPForLevel(playerData.level);

    updateAchievementDisplay();
    updatePlayerLevel();
  }

  // Make functions globally accessible
  window.filterAchievements = filterAchievements;
  window.closeAchievementModal = closeAchievementModal;
  window.displayAchievements = displayAchievements;
  window.checkAchievements = checkAchievements;
  window.initializeAchievements = initializeAchievements;
});
