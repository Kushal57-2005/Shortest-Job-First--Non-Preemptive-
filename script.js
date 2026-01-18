let selectedAlgorithm = null;

function startAlgo(algo) {
  selectedAlgorithm = algo;
  document.querySelector(".start").style.display = "none";
  document.querySelector(".main").style.display = "block";
  algoName();
}

function algoName() {
  let name = document.querySelector(".algoName");

  if (selectedAlgorithm == "FCFS") name.innerText = "First Come First Serve";
  if (selectedAlgorithm == "SJF_NP")
    name.innerText = "Shortest Job First (Non-Preemptive)";
  if (selectedAlgorithm == "SJF_P")
    name.innerText = "Shortest Job First (Preemptive)";
  if (selectedAlgorithm == "RR") name.innerText = "Round Robin";
  if (selectedAlgorithm == "PRIORITY_NP")
    name.innerText = "Priority (Non-Preemptive)";
  if (selectedAlgorithm == "PRIORITY_P")
    name.innerText = "Priority (Preemptive)";
}

function handleSubmit(event) {
  event.preventDefault();

  if (!selectedAlgorithm) {
    alert("Please select an algorithm first");
    return;
  }

  const num = parseInt(document.getElementById("numProcess").value);
  if (num <= 0) return;

  createInputFields(num);
}
function runSelectedAlgorithm() {
  switch (selectedAlgorithm) {
    case "SJF_NP":
      calculateSJF_NP();
      break;

    case "SJF_P":
      calculateSJF_P();
      break;

    case "FCFS":
      calculateFCFS();
      break;

    case "RR":
      calculateRR();
      break;

    case "PRIORITY_NP":
      calculatePriority_NP();
      break;

    case "PRIORITY_P":
      calculatePriority_P();
      break;

    default:
      alert("Algorithm not implemented yet");
  }
}

function createInputFields(n) {
  const container = document.getElementById("inputFields");
  container.innerHTML = "";

  if (selectedAlgorithm === "RR") {
    const tqDiv = document.createElement("div");
    tqDiv.innerHTML = `
      <label>
        Time Quantum:
        <input type="number" id="timeQuantum" min="1" required />
      </label>
    `;
    container.appendChild(tqDiv);
  }

  if (
    selectedAlgorithm === "PRIORITY_NP" ||
    selectedAlgorithm === "PRIORITY_P"
  ) {
    const info = document.createElement("p");
    info.style.margin = "10px 0";
    info.style.fontWeight = "bold";
    info.innerText = "Note: Lower priority number means higher priority";
    container.appendChild(info);
  }

  for (let i = 0; i < n; i++) {
    const div = document.createElement("div");
    div.className = "input";

    div.innerHTML = `
      <label>
        Process ${i + 1} :- Arrival Time:
        <input type="number" class="arrival" min="0" required />
      </label>

      <label style="margin-left:10px;">
        Burst Time:
        <input type="number" class="burst" min="1" required />
      </label>

      ${
        selectedAlgorithm === "PRIORITY_NP" ||
        selectedAlgorithm === "PRIORITY_P"
          ? `<label style="margin-left:10px;">
               Priority:
               <input type="number" class="priority" min="0" required />
             </label>`
          : ""
      }
    `;

    container.appendChild(div);
  }

  const calcBtn = document.createElement("button");
  calcBtn.type = "button";
  calcBtn.innerText = "Calculate";
  calcBtn.onclick = runSelectedAlgorithm;
  container.appendChild(calcBtn);
}

function calculateFCFS() {
  const arrivalInputs = document.querySelectorAll(".arrival");
  const burstInputs = document.querySelectorAll(".burst");

  const n = arrivalInputs.length;

  let processes = [];
  let steps = [];
  let gantt = [];
  let result = [];

  for (let i = 0; i < n; i++) {
    processes.push({
      id: i + 1,
      arrival: Number(arrivalInputs[i].value),
      burst: Number(burstInputs[i].value),
    });
  }

  processes.sort((a, b) => {
    if (a.arrival === b.arrival) return a.id - b.id;
    return a.arrival - b.arrival;
  });

  let currentTime = 0;

  processes.forEach((p) => {
    if (currentTime < p.arrival) {
      steps.push(`CPU is idle from time ${currentTime} to ${p.arrival}.`);
      gantt.push({
        process: "Idle",
        start: currentTime,
        end: p.arrival,
      });
      currentTime = p.arrival;
    }

    let startTime = currentTime;
    let completionTime = startTime + p.burst;

    steps.push(
      `Process P${p.id} executes from ${startTime} to ${completionTime}.`,
    );

    gantt.push({
      process: "P" + p.id,
      start: startTime,
      end: completionTime,
    });

    let tat = completionTime - p.arrival;
    let wt = tat - p.burst;

    result.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      completion: completionTime,
      tat,
      wt,
    });

    currentTime = completionTime;
  });

  displaySteps(steps);
  displayGanttChart(gantt);
  displayResult(result);
}

function calculateSJF_NP() {
  const arrivalInputs = document.querySelectorAll(".arrival");
  const burstInputs = document.querySelectorAll(".burst");

  const n = arrivalInputs.length;
  let processes = [];
  let steps = [];
  let gantt = [];
  let result = [];

  for (let i = 0; i < n; i++) {
    processes.push({
      id: i + 1,
      arrival: Number(arrivalInputs[i].value),
      burst: Number(burstInputs[i].value),
      completed: false,
    });
  }

  let currentTime = Math.min(...processes.map((p) => p.arrival));
  let completedCount = 0;

  while (completedCount < n) {
    let available = processes.filter(
      (p) => p.arrival <= currentTime && !p.completed,
    );

    if (available.length === 0) {
      steps.push(`CPU is idle at time ${currentTime}.`);
      gantt.push({
        process: "Idle",
        start: currentTime,
        end: currentTime + 1,
      });
      currentTime++;
      continue;
    }

    available.sort((a, b) => {
      if (a.burst === b.burst) return a.arrival - b.arrival;
      return a.burst - b.burst;
    });

    let p = available[0];

    steps.push(
      `At time ${currentTime}, available processes are ${available
        .map((x) => "P" + x.id)
        .join(
          ", ",
        )}. P${p.id} is selected because it has the shortest burst time (${p.burst}).`,
    );

    let startTime = currentTime;
    let completionTime = startTime + p.burst;

    gantt.push({
      process: "P" + p.id,
      start: startTime,
      end: completionTime,
    });

    steps.push(
      `Process P${p.id} executes from time ${startTime} to ${completionTime}.`,
    );

    let tat = completionTime - p.arrival;
    let wt = tat - p.burst;

    result.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      completion: completionTime,
      tat,
      wt,
    });

    currentTime = completionTime;
    p.completed = true;
    completedCount++;
  }

  displaySteps(steps);
  displayGanttChart(gantt);
  displayResult(result);
}

function calculateSJF_P() {
  const arrivalInputs = document.querySelectorAll(".arrival");
  const burstInputs = document.querySelectorAll(".burst");

  const n = arrivalInputs.length;

  let processes = [];
  let gantt = [];
  let steps = [];
  let result = [];

  for (let i = 0; i < n; i++) {
    let burst = Number(burstInputs[i].value);
    processes.push({
      id: i + 1,
      arrival: Number(arrivalInputs[i].value),
      burst,
      remaining: burst,
      completion: burst === 0 ? Number(arrivalInputs[i].value) : null,
      done: burst === 0,
    });
  }

  let currentTime = Math.min(...processes.map((p) => p.arrival));
  let completed = processes.filter((p) => p.done).length;
  let lastProcess = null;

  while (completed < n) {
    let available = processes.filter(
      (p) => p.arrival <= currentTime && !p.done && p.remaining > 0,
    );

    if (available.length === 0) {
      if (!lastProcess || lastProcess.process !== "Idle") {
        gantt.push({
          process: "Idle",
          start: currentTime,
          end: currentTime + 1,
        });
      } else {
        gantt[gantt.length - 1].end++;
      }
      currentTime++;
      lastProcess = gantt[gantt.length - 1];
      continue;
    }

    available.sort((a, b) => {
      if (a.remaining !== b.remaining) return a.remaining - b.remaining;
      if (a.arrival !== b.arrival) return a.arrival - b.arrival;
      return a.id - b.id;
    });

    let p = available[0];

    if (!lastProcess || lastProcess.process !== "P" + p.id) {
      gantt.push({
        process: "P" + p.id,
        start: currentTime,
        end: currentTime + 1,
      });
    } else {
      gantt[gantt.length - 1].end++;
    }

    steps.push(`At time ${currentTime}, P${p.id} executes`);

    p.remaining--;
    currentTime++;

    if (p.remaining === 0) {
      p.completion = currentTime;
      p.done = true;
      completed++;
    }

    lastProcess = gantt[gantt.length - 1];
  }

  processes.forEach((p) => {
    let tat = p.completion - p.arrival;
    let wt = tat - p.burst;
    result.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      completion: p.completion,
      tat,
      wt,
    });
  });

  const executionOrder = gantt
    .filter((g) => g.process !== "Idle")
    .map((g) => g.process)
    .filter((v, i, a) => a.indexOf(v) === i);

  result.sort(
    (a, b) =>
      executionOrder.indexOf("P" + a.id) - executionOrder.indexOf("P" + b.id),
  );

  displaySteps(steps);
  displayGanttChart(gantt);
  displayResult(result);
}

function calculateRR() {
  const arrivalInputs = document.querySelectorAll(".arrival");
  const burstInputs = document.querySelectorAll(".burst");
  const tqInput = document.getElementById("timeQuantum");

  if (!tqInput) {
    alert("Time Quantum input not found");
    return;
  }

  const timeQuantum = Number(tqInput.value);
  if (timeQuantum <= 0) {
    alert("Enter valid Time Quantum");
    return;
  }

  const n = arrivalInputs.length;

  let processes = [];
  let gantt = [];
  let steps = [];
  let result = [];

  for (let i = 0; i < n; i++) {
    processes.push({
      id: i + 1,
      arrival: Number(arrivalInputs[i].value),
      burst: Number(burstInputs[i].value),
      remaining: Number(burstInputs[i].value),
      completion: null,
    });
  }

  processes.sort((a, b) => a.arrival - b.arrival);

  let queue = [];
  let currentTime = processes[0].arrival;
  let index = 0;
  let completed = 0;

  while (completed < n) {
    while (index < n && processes[index].arrival <= currentTime) {
      queue.push(processes[index]);
      index++;
    }

    if (queue.length === 0) {
      currentTime++;
      continue;
    }

    let p = queue.shift();
    let execTime = Math.min(timeQuantum, p.remaining);

    if (gantt.length === 0 || gantt[gantt.length - 1].process !== "P" + p.id) {
      gantt.push({
        process: "P" + p.id,
        start: currentTime,
        end: currentTime + execTime,
      });
    } else {
      gantt[gantt.length - 1].end += execTime;
    }

    steps.push(
      `P${p.id} executes from ${currentTime} to ${currentTime + execTime}`,
    );

    currentTime += execTime;
    p.remaining -= execTime;

    while (index < n && processes[index].arrival <= currentTime) {
      queue.push(processes[index]);
      index++;
    }

    if (p.remaining > 0) {
      queue.push(p);
    } else {
      p.completion = currentTime;
      completed++;
    }
  }

  processes.forEach((p) => {
    let tat = p.completion - p.arrival;
    let wt = tat - p.burst;
    result.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      completion: p.completion,
      tat,
      wt,
    });
  });

  const executionOrder = gantt
    .map((g) => g.process)
    .filter((v, i, a) => a.indexOf(v) === i);

  result.sort(
    (a, b) =>
      executionOrder.indexOf("P" + a.id) - executionOrder.indexOf("P" + b.id),
  );

  displaySteps(steps);
  displayGanttChart(gantt);
  displayResult(result);
}

function calculatePriority_NP() {
  const arrivalInputs = document.querySelectorAll(".arrival");
  const burstInputs = document.querySelectorAll(".burst");
  const priorityInputs = document.querySelectorAll(".priority");

  const n = arrivalInputs.length;

  let processes = [];
  let gantt = [];
  let steps = [];
  let result = [];

  for (let i = 0; i < n; i++) {
    processes.push({
      id: i + 1,
      arrival: Number(arrivalInputs[i].value),
      burst: Number(burstInputs[i].value),
      priority: Number(priorityInputs[i].value),
      completed: false,
    });
  }

  let currentTime = Math.min(...processes.map((p) => p.arrival));
  let completed = 0;

  while (completed < n) {
    let available = processes.filter(
      (p) => p.arrival <= currentTime && !p.completed,
    );

    if (available.length === 0) {
      steps.push(`CPU is idle at time ${currentTime}`);
      currentTime++;
      continue;
    }

    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.arrival !== b.arrival) return a.arrival - b.arrival;
      return a.id - b.id;
    });

    let p = available[0];
    let startTime = currentTime;
    let completionTime = startTime + p.burst;

    gantt.push({
      process: "P" + p.id,
      start: startTime,
      end: completionTime,
    });

    steps.push(
      `At time ${startTime}, P${p.id} executes (priority ${p.priority})`,
    );

    let tat = completionTime - p.arrival;
    let wt = tat - p.burst;

    result.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      priority: p.priority,
      completion: completionTime,
      tat,
      wt,
    });

    p.completed = true;
    currentTime = completionTime;
    completed++;
  }

  const executionOrder = gantt
    .map((g) => g.process)
    .filter((v, i, a) => a.indexOf(v) === i);

  result.sort(
    (a, b) =>
      executionOrder.indexOf("P" + a.id) - executionOrder.indexOf("P" + b.id),
  );

  displaySteps(steps);
  displayGanttChart(gantt);
  displayResult(result);
}

function calculatePriority_P() {
  const arrivalInputs = document.querySelectorAll(".arrival");
  const burstInputs = document.querySelectorAll(".burst");
  const priorityInputs = document.querySelectorAll(".priority");

  const n = arrivalInputs.length;

  let processes = [];
  let gantt = [];
  let steps = [];
  let result = [];

  for (let i = 0; i < n; i++) {
    processes.push({
      id: i + 1,
      arrival: Number(arrivalInputs[i].value),
      burst: Number(burstInputs[i].value),
      priority: Number(priorityInputs[i].value),
      remaining: Number(burstInputs[i].value),
      completion: null,
    });
  }

  let currentTime = Math.min(...processes.map((p) => p.arrival));
  let completed = 0;
  let lastProcess = null;

  while (completed < n) {
    let available = processes.filter(
      (p) => p.arrival <= currentTime && p.remaining > 0,
    );

    if (available.length === 0) {
      if (!lastProcess || lastProcess.process !== "IDLE") {
        gantt.push({
          process: "IDLE",
          start: currentTime,
          end: currentTime + 1,
        });
      } else {
        gantt[gantt.length - 1].end++;
      }

      currentTime++;
      lastProcess = gantt[gantt.length - 1];
      continue;
    }

    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.arrival !== b.arrival) return a.arrival - b.arrival;
      return a.id - b.id;
    });

    let p = available[0];

    if (!lastProcess || lastProcess.process !== "P" + p.id) {
      gantt.push({
        process: "P" + p.id,
        start: currentTime,
        end: currentTime + 1,
      });
    } else {
      gantt[gantt.length - 1].end++;
    }

    steps.push(`At time ${currentTime}, P${p.id} executes`);

    p.remaining--;
    currentTime++;

    if (p.remaining === 0) {
      p.completion = currentTime;
      completed++;
    }

    lastProcess = gantt[gantt.length - 1];
  }

  processes.forEach((p) => {
    let tat = p.completion - p.arrival;
    let wt = tat - p.burst;
    result.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      priority: p.priority,
      completion: p.completion,
      tat,
      wt,
    });
  });

  const executionOrder = gantt
    .filter((g) => g.process !== "IDLE")
    .map((g) => g.process)
    .filter((v, i, a) => a.indexOf(v) === i);

  result.sort(
    (a, b) =>
      executionOrder.indexOf("P" + a.id) - executionOrder.indexOf("P" + b.id),
  );

  displaySteps(steps);
  displayGanttChart(gantt);
  displayResult(result);
}

function displayGanttChart(gantt) {
  const ganttColors = ["#e03131", "#2f9e44", "#1c7ed6", "#f59f00", "#9c36b5"];

  const ganttDiv = document.getElementById("gantt");
  ganttDiv.innerHTML = "";

  const startTime = gantt[0].start;
  const endTime = gantt[gantt.length - 1].end;
  const timeline = endTime - startTime;

  gantt.forEach((block, index) => {
    const widthPercent = ((block.end - block.start) / timeline) * 100;

    const div = document.createElement("div");
    div.className = "gantt-block";
    div.style.width = widthPercent + "%";
    div.style.backgroundColor = ganttColors[index % ganttColors.length];
    div.innerText = block.process;

    ganttDiv.appendChild(div);
  });

  const old = ganttDiv.parentElement.querySelector(".time-row");
  if (old) old.remove();

  const timeRow = document.createElement("div");
  timeRow.className = "time-row";
  timeRow.style.position = "relative";
  timeRow.style.height = "20px";
  timeRow.style.marginTop = "6px";

  const startLabel = document.createElement("span");
  startLabel.innerText = startTime;
  startLabel.style.position = "absolute";
  startLabel.style.left = "0%";
  timeRow.appendChild(startLabel);

  gantt.forEach((block) => {
    const label = document.createElement("span");
    label.innerText = block.end;
    label.style.position = "absolute";
    label.style.left = `${((block.end - startTime) / timeline) * 100}%`;
    label.style.transform = "translateX(-50%)";
    timeRow.appendChild(label);
  });

  ganttDiv.parentElement.appendChild(timeRow);
}

function displaySteps(steps) {
  const stepsDiv = document.getElementById("steps");
  stepsDiv.innerHTML = "<h3>Step-by-Step Execution</h3>";

  steps.forEach((step, index) => {
    const p = document.createElement("p");
    p.innerText = `Step ${index + 1}: ${step}`;
    stepsDiv.appendChild(p);
  });
}

function displayResult(completed) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  let totalTAT = 0;
  let totalWT = 0;

  completed.forEach((p) => {
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
  <p>
  <strong>Average Turn Around Time:</strong> ${(
    totalTAT / completed.length
  ).toFixed(2)}</p>  
  <br>
   <p>
    <strong>Average Waiting Time:</strong> ${(
      totalWT / completed.length
    ).toFixed(2)}</p>
  `;

  document.querySelector(".SJF").style.display = "flex";
}
