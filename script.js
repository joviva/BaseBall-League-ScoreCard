// Baseball Scorecard JavaScript

class BaseballScorecard {
  constructor() {
    this.actions = ["hit", "double", "triple", "run", "error", "out", "clear"];
    this.gameData = this.loadGameData();
    this.scores = {
      home: 0,
      visiting: 0,
    };
    this.init();
  }

  init() {
    try {
      this.setupEventListeners();
      this.loadSavedData();
      this.updateScoreDisplays();
      this.validateGameData();

      // Add unload handler to save data
      window.addEventListener("beforeunload", () => {
        this.autoSave();
      });

      console.log("Baseball Scorecard initialized successfully");
    } catch (error) {
      this.handleError(error, "Initialization");
    }
  }

  setupEventListeners() {
    // Inning cell click handlers
    document.querySelectorAll(".inning-cell[data-inning]").forEach((cell) => {
      cell.addEventListener("click", (e) => this.handleInningCellClick(e));
    });

    // Inning header click handlers
    document
      .querySelectorAll(".innings-header .inning-cell")
      .forEach((cell) => {
        cell.addEventListener("click", (e) => this.handleInningHeaderClick(e));
      });

    // Player info header click handler
    document.querySelectorAll(".player-info-header").forEach((header) => {
      header.addEventListener("click", (e) =>
        this.handlePlayerInfoHeaderClick(e)
      );
    });

    // Action buttons
    document
      .getElementById("saveScorecard")
      ?.addEventListener("click", () => this.saveGame());
    document
      .getElementById("printScorecard")
      ?.addEventListener("click", () => this.printScorecard());
    document
      .getElementById("clearScorecard")
      ?.addEventListener("click", () => this.clearScorecard());

    // Action icon click handler
    document
      .querySelector(".action-icon")
      ?.addEventListener("click", () => this.handleActionIconClick());

    // Auto-save on input changes
    document.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => this.autoSave());
    });
  }

  // Score counter functions
  incrementScore(team) {
    if (this.scores[team] >= 99) {
      this.showNotification("Maximum score reached (99)", "warning");
      this.addScoreAnimation(team, "error");
      return;
    }

    this.scores[team]++;
    this.updateScoreDisplay(team);
    this.addScoreAnimation(team, "increment");
    this.autoSave();

    // Show milestone notifications
    if (this.scores[team] % 10 === 0 && this.scores[team] > 0) {
      const teamName = team === "home" ? "Home Team" : "Visiting Team";
      this.showNotification(
        `${teamName} reaches ${this.scores[team]} runs!`,
        "success"
      );
    }
  }

  decrementScore(team) {
    if (this.scores[team] > 0) {
      this.scores[team]--;
      this.updateScoreDisplay(team);
      this.addScoreAnimation(team, "decrement");
      this.autoSave();
    } else {
      // Visual feedback when trying to go below 0
      this.addScoreAnimation(team, "error");
      this.showNotification("Score cannot go below 0", "warning");
    }
  }

  addScoreAnimation(team, type) {
    const scoreElement = document.getElementById(`${team}Score`);
    if (scoreElement) {
      // Remove any existing animation classes
      scoreElement.classList.remove(
        "score-increment",
        "score-decrement",
        "score-error"
      );

      // Add animation class based on type
      if (type === "increment") {
        scoreElement.classList.add("score-increment");
      } else if (type === "decrement") {
        scoreElement.classList.add("score-decrement");
      } else if (type === "error") {
        scoreElement.classList.add("score-error");
      }

      // Remove animation class after animation completes
      setTimeout(() => {
        scoreElement.classList.remove(
          "score-increment",
          "score-decrement",
          "score-error"
        );
      }, 300);
    }
  }

  updateScoreDisplay(team) {
    const scoreElement = document.getElementById(`${team}Score`);
    if (scoreElement) {
      scoreElement.textContent = this.scores[team];
    }
  }

  updateScoreDisplays() {
    this.updateScoreDisplay("home");
    this.updateScoreDisplay("visiting");
  }

  handleInningCellClick(event) {
    const cell = event.target;
    const inning = parseInt(cell.dataset.inning);
    const player = cell.dataset.player;
    const team = cell.dataset.team || "home";

    if (!inning || !player) return;

    // Check if this inning is allowed (sequential gameplay enforcement)
    if (!this.isInningAllowed(inning, player, team)) {
      const nextAllowedInning = this.getNextAllowedInning(player, team);
      this.showNotification(
        `Please complete Inning ${nextAllowedInning} first for this player`,
        "error"
      );
      return;
    }

    // Get current cell state and determine next action in sequence
    const currentAction = this.getCurrentCellAction(cell);
    const nextAction = this.getNextAction(currentAction);

    // Apply action
    this.applyAction(cell, nextAction, inning, player, team);

    // Use debounced auto-save for better performance
    this.debouncedAutoSave();
  }

  isInningAllowed(inning, player, team) {
    // Always allow inning 1
    if (inning === 1) return true;

    // Check if previous inning has been completed for this player
    const previousInning = inning - 1;
    const previousCell = document.querySelector(
      `[data-inning="${previousInning}"][data-player="${player}"]${
        team === "visiting" ? '[data-team="visiting"]' : ":not([data-team])"
      }`
    );

    // Previous inning must have some action (not empty)
    return previousCell && previousCell.textContent.trim() !== "";
  }

  getNextAllowedInning(player, team) {
    // Find the first empty inning cell for this player
    for (let i = 1; i <= 14; i++) {
      const cell = document.querySelector(
        `[data-inning="${i}"][data-player="${player}"]${
          team === "visiting" ? '[data-team="visiting"]' : ":not([data-team])"
        }`
      );
      if (cell && cell.textContent.trim() === "") {
        return i;
      }
    }
    return 1; // Default to inning 1 if all are filled
  }

  applyAction(cell, action, inning, player, team) {
    // Clear previous styling
    cell.className = "inning-cell";
    cell.textContent = "";

    // Add transition for smooth color changes
    cell.style.transition = "all 0.2s ease";

    switch (action) {
      case "hit":
        cell.classList.add("hit");
        cell.textContent = "H";
        break;
      case "double":
        cell.classList.add("double");
        cell.textContent = "D";
        break;
      case "triple":
        cell.classList.add("triple");
        cell.textContent = "T";
        break;
      case "run":
        cell.classList.add("run");
        cell.textContent = "R";
        break;
      case "error":
        cell.classList.add("error");
        cell.textContent = "E";
        break;
      case "out":
        cell.classList.add("out");
        cell.textContent = "O";
        break;
      case "clear":
        // Already cleared above
        cell.style.transform = "scale(1)";
        cell.style.boxShadow = "none";
        break;
    }

    // Add click animation
    if (action !== "clear") {
      // Brief scale animation on click
      setTimeout(() => {
        cell.style.transform = "scale(0.95)";
      }, 50);
    }

    // Update game data
    if (!this.gameData[team]) this.gameData[team] = {};
    if (!this.gameData[team][player]) this.gameData[team][player] = {};
    this.gameData[team][player][inning] = action === "clear" ? null : action;
  }

  autoSave() {
    // Save player names and positions
    document
      .querySelectorAll(".player-name, .player-position")
      .forEach((input) => {
        const player = input.closest(".player-row").dataset.player;
        const team = input.closest(".player-row").dataset.team || "home";
        const field = input.classList.contains("player-name")
          ? "name"
          : "position";

        if (!this.gameData[team]) this.gameData[team] = {};
        if (!this.gameData[team][player]) this.gameData[team][player] = {};
        this.gameData[team][player][field] = input.value;
      });

    // Save team names and date
    this.gameData.homeTeam = document.getElementById("homeTeam")?.value || "";
    this.gameData.visitingTeam =
      document.getElementById("visitingTeam")?.value || "";
    this.gameData.gameDate = document.getElementById("gameDate")?.value || "";
    this.gameData.gameNotes = document.getElementById("gameNotes")?.value || "";

    // Save scores
    this.gameData.scores = this.scores;

    this.saveGameData();
  }

  saveGame() {
    this.autoSave();
    this.showNotification("Game saved successfully!", "success");
  }

  loadGame() {
    this.loadSavedData();
    this.showNotification("Game loaded successfully!", "success");
  }

  loadSavedData() {
    // Load team names and date
    if (this.gameData.homeTeam)
      document.getElementById("homeTeam").value = this.gameData.homeTeam;
    if (this.gameData.visitingTeam)
      document.getElementById("visitingTeam").value =
        this.gameData.visitingTeam;
    if (this.gameData.gameDate)
      document.getElementById("gameDate").value = this.gameData.gameDate;
    if (this.gameData.gameNotes)
      document.getElementById("gameNotes").value = this.gameData.gameNotes;

    // Load scores
    if (this.gameData.scores) {
      this.scores = this.gameData.scores;
      this.updateScoreDisplays();
    }

    // Load player data
    ["home", "visiting"].forEach((team) => {
      if (this.gameData[team]) {
        Object.keys(this.gameData[team]).forEach((player) => {
          const playerData = this.gameData[team][player];

          // Load names and positions
          if (playerData.name) {
            const nameInput = document.querySelector(
              `[data-player="${player}"][data-team="${team}"] .player-name, [data-player="${player}"]:not([data-team]) .player-name`
            );
            if (nameInput) nameInput.value = playerData.name;
          }

          if (playerData.position) {
            const posInput = document.querySelector(
              `[data-player="${player}"][data-team="${team}"] .player-position, [data-player="${player}"]:not([data-team]) .player-position`
            );
            if (posInput) posInput.value = playerData.position;
          }

          // Load inning data
          Object.keys(playerData).forEach((key) => {
            if (key !== "name" && key !== "position" && playerData[key]) {
              const cell = document.querySelector(
                `[data-inning="${key}"][data-player="${player}"][data-team="${team}"], [data-inning="${key}"][data-player="${player}"]:not([data-team])`
              );
              if (cell) {
                this.applyAction(cell, playerData[key], key, player, team);
              }
            }
          });
        });
      }
    });
  }

  clearScorecard() {
    // Clear all inputs
    document.querySelectorAll("input, textarea").forEach((input) => {
      input.value = "";
    });

    // Clear all inning cells
    document.querySelectorAll(".inning-cell[data-inning]").forEach((cell) => {
      cell.className = "inning-cell";
      cell.textContent = "";
      cell.style.transform = "";
      cell.style.boxShadow = "";
    });

    // Clear inning header active states
    document
      .querySelectorAll(".innings-header .inning-cell, .player-info-header")
      .forEach((element) => {
        element.classList.remove("active-inning");
      });

    // Reset scores
    this.scores = { home: 0, visiting: 0 };
    this.updateScoreDisplays();

    // Clear game data
    this.gameData = {};
    this.saveGameData();

    // Show success message
    this.showNotification("Scorecard cleared successfully!", "success");
  }

  printScorecard() {
    // Hide action buttons and score counters before printing
    const actionButtons = document.querySelector(".action-buttons");
    const scoreCounters = document.querySelector(".score-counters-container");

    if (actionButtons) actionButtons.style.display = "none";
    if (scoreCounters) scoreCounters.style.display = "none";

    window.print();

    // Restore elements after printing
    setTimeout(() => {
      if (actionButtons) actionButtons.style.display = "flex";
      if (scoreCounters) scoreCounters.style.display = "flex";
    }, 1000);
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 6px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    // Set background color based on type
    switch (type) {
      case "success":
        notification.style.background =
          "linear-gradient(135deg, #28a745, #1e7e34)";
        break;
      case "error":
        notification.style.background =
          "linear-gradient(135deg, #dc3545, #c82333)";
        break;
      case "warning":
        notification.style.background =
          "linear-gradient(135deg, #ffc107, #e0a800)";
        notification.style.color = "#212529";
        break;
      default:
        notification.style.background =
          "linear-gradient(135deg, #007bff, #0056b3)";
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  saveGameData() {
    localStorage.setItem("baseballScorecard", JSON.stringify(this.gameData));
  }

  loadGameData() {
    const saved = localStorage.getItem("baseballScorecard");
    return saved ? JSON.parse(saved) : {};
  }

  handleInningHeaderClick(event) {
    const cell = event.target;
    const clickedInningNumber = parseInt(cell.textContent);

    // Get all inning header cells
    const allInningCells = document.querySelectorAll(
      ".innings-header .inning-cell"
    );

    // Find the current highest active inning
    const currentActiveInnings = document.querySelectorAll(
      ".innings-header .inning-cell.active-inning"
    );
    const lastActiveInning =
      currentActiveInnings.length > 0
        ? Math.max(
            ...Array.from(currentActiveInnings).map((c) =>
              parseInt(c.textContent)
            )
          )
        : 0;

    // Check if the clicked inning is valid (sequential order)
    const nextAllowedInning = lastActiveInning + 1;

    // Allow clicking the same inning to deselect, or the next inning in sequence
    if (clickedInningNumber === lastActiveInning) {
      // Clicking the same inning - deselect it and all after it
      allInningCells.forEach((inningCell) => {
        const inningNumber = parseInt(inningCell.textContent);
        if (inningNumber >= clickedInningNumber) {
          inningCell.classList.remove("active-inning");
        }
      });

      // Also clear player info header active state if no innings are selected
      if (clickedInningNumber === 1) {
        document.querySelectorAll(".player-info-header").forEach((header) => {
          header.classList.remove("active-inning");
        });
        this.showNotification("All innings deselected", "info");
      } else {
        this.showNotification(
          `Innings ${clickedInningNumber}-14 deselected`,
          "info"
        );
      }
      return;
    } else if (clickedInningNumber === nextAllowedInning) {
      // Clicking the next allowed inning - select it
      cell.classList.add("active-inning");

      // Show notification about active innings
      if (clickedInningNumber === 1) {
        this.showNotification(`Inning 1 selected`, "info");
      } else {
        this.showNotification(
          `Innings 1-${clickedInningNumber} selected`,
          "info"
        );
      }
    } else {
      // Clicking out of sequence - show error message
      if (lastActiveInning === 0) {
        this.showNotification("Please start with Inning 1", "error");
      } else {
        this.showNotification(
          `Please select Inning ${nextAllowedInning} next`,
          "error"
        );
      }
      return;
    }
  }

  handlePlayerInfoHeaderClick(event) {
    const header = event.target;

    // Toggle active state for player info header
    header.classList.toggle("active-inning");

    // Remove active state from all inning cells
    document
      .querySelectorAll(".innings-header .inning-cell")
      .forEach((cell) => {
        cell.classList.remove("active-inning");
      });
  }

  handleActionIconClick() {
    const actionIcon = document.querySelector(".action-icon");

    // Add the clicked class for the animation
    actionIcon.classList.add("clicked");

    // Remove the class after 3 seconds
    setTimeout(() => {
      actionIcon.classList.remove("clicked");
    }, 3000);
  }

  getCurrentCellAction(cell) {
    // Determine current action based on cell content and class
    if (cell.textContent === "H" && cell.classList.contains("hit"))
      return "hit";
    if (cell.textContent === "D" && cell.classList.contains("double"))
      return "double";
    if (cell.textContent === "T" && cell.classList.contains("triple"))
      return "triple";
    if (cell.textContent === "R" && cell.classList.contains("run"))
      return "run";
    if (cell.textContent === "E" && cell.classList.contains("error"))
      return "error";
    if (cell.textContent === "O" && cell.classList.contains("out"))
      return "out";
    return "clear"; // Default to clear/empty state
  }

  getNextAction(currentAction) {
    // Define the sequential progression: Clear -> H -> D -> T -> R -> E -> O -> Clear
    const actionSequence = [
      "clear",
      "hit",
      "double",
      "triple",
      "run",
      "error",
      "out",
    ];
    const currentIndex = actionSequence.indexOf(currentAction);
    const nextIndex = (currentIndex + 1) % actionSequence.length;
    return actionSequence[nextIndex];
  }

  // Error handling and logging for production
  handleError(error, context) {
    console.error(`Baseball Scorecard Error [${context}]:`, error);
    this.showNotification(
      "An error occurred. Please refresh the page if issues persist.",
      "error"
    );
  }

  // Performance optimization - debounced auto-save
  debouncedAutoSave = this.debounce(this.autoSave.bind(this), 300);

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Validate game data integrity
  validateGameData() {
    try {
      // Check for data consistency
      const teams = ["home", "visiting"];
      for (const team of teams) {
        if (this.gameData[team]) {
          for (let player = 1; player <= 13; player++) {
            if (this.gameData[team][player]) {
              // Validate player data structure
              for (let inning = 1; inning <= 14; inning++) {
                const action = this.gameData[team][player][inning];
                if (
                  action &&
                  !this.actions.includes(action) &&
                  action !== "clear"
                ) {
                  console.warn(
                    `Invalid action found: ${action} for ${team} player ${player} inning ${inning}`
                  );
                }
              }
            }
          }
        }
      }
      return true;
    } catch (error) {
      this.handleError(error, "Data Validation");
      return false;
    }
  }
}

// Global functions for score buttons
function incrementScore(team) {
  if (window.scorecard) {
    window.scorecard.incrementScore(team);
  }
}

function decrementScore(team) {
  if (window.scorecard) {
    window.scorecard.decrementScore(team);
  }
}

// Initialize the scorecard when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.scorecard = new BaseballScorecard();
});
