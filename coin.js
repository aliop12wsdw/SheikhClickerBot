let coinCount = 0;
let level = 1;
let clickPower = 1;
let autoClickEnabled = false;
let user = null;

function onTelegramAuth(userData) {
  user = userData;
  localStorage.setItem('telegramUser', JSON.stringify(user));
  document.getElementById('welcome-text').innerText = `Hello, ${user.first_name}`;
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';

  // Load progress
  const savedCoins = localStorage.getItem(`${user.id}_coins`);
  const savedLevel = localStorage.getItem(`${user.id}_level`);
  const savedPower = localStorage.getItem(`${user.id}_power`);
  if (savedCoins) coinCount = parseInt(savedCoins);
  if (savedLevel) level = parseInt(savedLevel);
  if (savedPower) clickPower = parseInt(savedPower);

  updateUI();
}

function updateUI() {
  document.getElementById("coin-count").innerText = coinCount;
  document.getElementById("level-count").innerText = level;
  localStorage.setItem(`${user.id}_coins`, coinCount);
  localStorage.setItem(`${user.id}_level`, level);
  localStorage.setItem(`${user.id}_power`, clickPower);
}

document.getElementById("sheikh-img").addEventListener("click", () => {
  coinCount += clickPower;
  if (coinCount >= level * 100) {
    level++;
  }
  updateUI();
});

function buyUpgrade(name, cost, power, auto = false) {
  if (coinCount >= cost) {
    coinCount -= cost;
    if (auto) {
      autoClickEnabled = true;
      setInterval(() => {
        coinCount += clickPower;
        updateUI();
      }, 1000);
    } else {
      clickPower += power;
    }
    updateUI();
  } else {
    alert("Not enough coins!");
  }
}

document.getElementById("admin-code").addEventListener("input", function () {
  if (this.value === "شیخ کوچولو") {
    const panel = document.getElementById("admin-panel");
    panel.style.display = "block";
    panel.innerHTML = `<h3>Leaderboard</h3>`;

    for (let key in localStorage) {
      if (key.endsWith("_coins")) {
        const id = key.replace("_coins", "");
        const coins = localStorage.getItem(key);
        const name = JSON.parse(localStorage.getItem("telegramUser"))?.first_name || "User";
        panel.innerHTML += `<p>${name} (ID ${id}): ${coins} coins</p>`;
      }
    }
  }
});
