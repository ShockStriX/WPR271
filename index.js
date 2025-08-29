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
    if (pageID === "achievements") {
      updateAchievements();
    }
  }

  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageID = this.getAttribute("href").substring(1);
      showPage(pageID);
    });
  });

  showPage("dashboard");

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

      // Update achievements after adding new workout
      updateAchievements();

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
  function updateAchievements() {
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

  // Initialize achievements on page load
  updateAchievements();
});
