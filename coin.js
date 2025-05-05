let coins = 0;
let level = 1;
let clickPower = 1;
let autoClick = false;
let username = "";

function onTelegramAuth(user) {
  username = user.first_name;
  document.getElementById("username").innerText = username;
  document.getElementById("login-container").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  loadGame();
  initAutoClick();
}

function loadGame() {
  const saved = JSON.parse(localStorage.getItem("sheikh_game_" + username)) || {};
  coins = saved.coins || 0;
  level = Math.floor(coins / 100) + 1;
  clickPower = saved.clickPower || 1;
  autoClick = saved.autoClick || false;
  document.getElementById("coins").innerText = coins;
  document.getElementById("level").innerText = level;
}

function saveGame() {
  localStorage.setItem("sheikh_game_" + username, JSON.stringify({
    coins,
    clickPower,
    autoClick
  }));
}

document.getElementById("sheikh-img").addEventListener("click", () => {
  coins += clickPower;
  updateDisplay();
});

function buyUpgrade(name, cost, power, isAuto = false) {
  if (coins >= cost) {
    coins -= cost;
    if (isAuto) {
      autoClick = true;
      initAutoClick();
    } else {
      clickPower += power;
    }
    updateDisplay();
  }
}

function updateDisplay() {
  level = Math.floor(coins / 100) + 1;
  document.getElementById("coins").innerText = coins;
  document.getElementById("level").innerText = level;
  saveGame();
}

function initAutoClick() {
  if (autoClick && !window.autoInterval) {
    window.autoInterval = setInterval(() => {
      coins += clickPower;
      updateDisplay();
    }, 1000);
  }
}

function checkAdminCode() {
  const input = document.getElementById("admin-code").value;
  if (input === "شیخ کوچولو") {
    document.getElementById("admin-panel").style.display = "block";
    showLeaderboard();
  }
}

function showLeaderboard() {
  let leaderboard = "";
  for (let key in localStorage) {
    if (key.startsWith("sheikh_game_")) {
      const user = key.replace("sheikh_game_", "");
      const data = JSON.parse(localStorage.getItem(key));
      leaderboard += `<p>${user}: ${data.coins || 0} coins</p>`;
    }
  }
  document.getElementById("leaderboard").innerHTML = leaderboard;
}
