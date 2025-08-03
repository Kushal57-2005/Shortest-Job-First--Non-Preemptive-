function mainpg() {
  document.body.className = "main-page";
  document.querySelector(".start").style.display = "none";
  document.querySelector(".main").style.display = "block";
}

function SJF(event) {
  event.preventDefault();

  const num = parseInt(document.getElementById("numProcess").value);
  if (num <= 0) return;

  createInputFields(num);
}

function createInputFields(n) {
  const container = document.getElementById("inputFields");
  container.innerHTML = ""; // Clear previous inputs if any

  for (let i = 0; i < n; i++) {
    const div = document.createElement("div");
    div.className = 'input';
    div.innerHTML = `
      <label style="color:black;">Process ${i + 1} - Arrival Time: 
        <input type="number" class="arrival" min="0" required />
      </label>
      <label style="color:black; margin-left:10px;">Burst Time: 
        <input type="number" class="burst" min="1" required />
      </label>
      <br><br>
    `;
    container.appendChild(div);
  }

  const calcBtn = document.createElement("button");
  calcBtn.className = 'calcBtn';
  calcBtn.innerText = "Calculate SJF";
  calcBtn.style.marginTop = "1rem";
  calcBtn.onclick = calculateSJF;
  container.appendChild(calcBtn);
}

function calculateSJF() {
  const arrivalInputs = document.querySelectorAll(".arrival");
  const burstInputs = document.querySelectorAll(".burst");

  const n = arrivalInputs.length;
  let processes = [];

  for (let i = 0; i < n; i++) {
    const arrival = parseInt(arrivalInputs[i].value);
    const burst = parseInt(burstInputs[i].value);
    processes.push({ id: i + 1, arrival, burst });
  }

  // Clone the original order for display later
  const originalOrder = [...processes];

  // Sort by arrival and then burst time (SJF)
  processes.sort((a, b) => a.arrival - b.arrival || a.burst - b.burst);

  let currentTime = 0;
  let completed = [];

  while (processes.length > 0) {
    let available = processes.filter(p => p.arrival <= currentTime);
    if (available.length === 0) {
      currentTime = processes[0].arrival;
      available = processes.filter(p => p.arrival <= currentTime);
    }

    available.sort((a, b) => a.burst - b.burst);
    const process = available[0];

    currentTime += process.burst;
    const tat = currentTime - process.arrival;
    const wt = tat - process.burst;

    completed.push({
      id: process.id,
      arrival: process.arrival,
      burst: process.burst,
      completion: currentTime,
      tat: tat,
      wt: wt
    });

    processes = processes.filter(p => p.id !== process.id);
  }

  // Sort result by original input order (by process ID)
  completed.sort((a, b) => a.id - b.id);

  displayResult(completed);
}

function displayResult(completed) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  let totalTAT = 0, totalWT = 0;

  completed.forEach(p => {
    totalTAT += p.tat;
    totalWT += p.wt;
    const row = `<tr>
      <td>P${p.id}</td>
      <td>${p.arrival}</td>
      <td>${p.burst}</td>
      <td>${p.completion}</td>
      <td>${p.tat}</td>
      <td>${p.wt}</td>
    </tr>`;
    tbody.innerHTML += row;
  });

  const output = document.getElementById("output");
  output.innerHTML = `
    <strong>Average Turn Around Time:</strong> ${(totalTAT / completed.length).toFixed(2)}<br>
    <strong>Average Waiting Time:</strong> ${(totalWT / completed.length).toFixed(2)}
  `;

  document.querySelector(".SJF").style.display = "block";
}
