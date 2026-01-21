let selectedAlgorithm = null;
function goBack() {
  document.querySelector(".start").style.display = "flex";
  document.querySelector(".main").style.display = "none";
  selectedAlgorithm = null;
  document.getElementById("inputFields").innerHTML = "";
  document.getElementById("steps").innerHTML = "";
  document.getElementById("gantt").innerHTML = "";
  document.getElementById("tableBody").innerHTML = "";
  document.getElementById("calcBody").innerHTML = "";
  document.getElementById("output").innerHTML = "";
  document.querySelector(".SJF").style.display = "none";
  document.getElementById("numProcess").value = "";
}

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
      steps.push(`CPU is idle from ${currentTime} to ${p.arrival}`);

      gantt.push({
        process: "Idle",
        start: currentTime,
        end: p.arrival,
      });

      currentTime = p.arrival;
    }

    let startTime = currentTime;
    let finishTime = startTime + p.burst;
    steps.push(
      `P${p.id} starts at ${startTime}, runs for ${p.burst} → finishes at ${finishTime}`,
    );

    gantt.push({
      process: "P" + p.id,
      start: startTime,
      end: finishTime,
    });

    let tat = finishTime - p.arrival;
    let wt = tat - p.burst;

    result.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      completion: finishTime,
      tat,
      wt,
    });

    currentTime = finishTime;
  });

  displayStepsSimple(steps);
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
  let stepNo = 1;

  while (completedCount < n) {
    let available = processes.filter(
      (p) => p.arrival <= currentTime && !p.completed,
    );

    if (available.length === 0) {
      steps.push(`Time = ${currentTime} → CPU is idle`);
      currentTime++;
      continue;
    }

    steps.push(`Time = ${currentTime} → Choose shortest among arrived`);

    let arrivedList = available
      .map((p) => `\t P${p.id} (AT ${p.arrival}, BT ${p.burst})`)
      .join(",\n");

    steps.push(`Arrived processes:\n ${arrivedList}`);

    available.sort((a, b) => {
      if (a.burst === b.burst) return a.arrival - b.arrival;
      return a.burst - b.burst;
    });

    let compareLine = available
      .map((p, idx) =>
        idx === 0 ? `P${p.id} = ${p.burst} ✅` : `P${p.id} = ${p.burst}`,
      )
      .join(", ");

    steps.push(`Compare Burst Times: ${compareLine}`);

    let p = available[0];

    let startTime = currentTime;
    let completionTime = startTime + p.burst;

    steps.push(
      `So next = P${p.id}. P${p.id} runs from ${startTime} to ${completionTime}`,
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
      completion: null,
      done: false,
    });
  }

  let time = Math.min(...processes.map((p) => p.arrival));
  let completed = 0;
  let currentProcess = null;
  let runStartTime = null;

  while (completed < n) {
    let arrivalsNow = processes.filter((p) => p.arrival === time && !p.done);

    let available = processes.filter(
      (p) => p.arrival <= time && !p.done && p.remaining > 0,
    );

    if (available.length === 0) {
      time++;
      continue;
    }

    available.sort((a, b) => {
      if (a.remaining !== b.remaining) return a.remaining - b.remaining;
      if (a.arrival !== b.arrival) return a.arrival - b.arrival;
      return a.id - b.id;
    });

    let selected = available[0];

    if (currentProcess === null || currentProcess.id !== selected.id) {
      if (currentProcess !== null && runStartTime !== null) {
        steps.push(
          `Time = ${runStartTime} to ${time}\n` +
            `No new arrivals.\n` +
            `P${currentProcess.id} runs continuously and stops here.`,
        );
      }

      steps.push(`Time = ${time}`);

      if (arrivalsNow.length > 0) {
        steps.push(`Arrived: ${arrivalsNow.map((p) => "P" + p.id).join(", ")}`);
      }

      steps.push(`Remaining:`);

      available.forEach((p, idx) => {
        if (idx === 0) {
          steps.push(`P${p.id} = ${p.remaining} ✅`);
        } else {
          steps.push(`P${p.id} = ${p.remaining}`);
        }
      });

      if (currentProcess === null) {
        steps.push(`Run P${selected.id}`);
      } else {
        steps.push(`So preempt P${currentProcess.id}, run P${selected.id}`);
      }

      runStartTime = time;
    }

    if (
      gantt.length === 0 ||
      gantt[gantt.length - 1].process !== "P" + selected.id
    ) {
      gantt.push({
        process: "P" + selected.id,
        start: time,
        end: time + 1,
      });
    } else {
      gantt[gantt.length - 1].end++;
    }

    selected.remaining--;
    time++;

    if (selected.remaining === 0) {
      selected.completion = time;
      selected.done = true;
      completed++;

      steps.push(
        `Time = ${runStartTime} to ${time}\n` +
          `P${selected.id} runs continuously and finishes at ${time}.`,
      );

      runStartTime = null;
      currentProcess = null;
      continue;
    }

    currentProcess = selected;
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
  let stepNo = 1;

  while (completed < n) {
    let arrivalsNow = [];
    while (index < n && processes[index].arrival <= currentTime) {
      queue.push(processes[index]);
      arrivalsNow.push(processes[index]);
      index++;
    }

    if (queue.length === 0) {
      currentTime++;
      continue;
    }

    let p = queue.shift();
    let execTime = Math.min(timeQuantum, p.remaining);

    steps.push(`Time = ${currentTime}`);

    if (arrivalsNow.length > 0) {
      steps.push(`Arrived: ${arrivalsNow.map((x) => "P" + x.id).join(", ")}`);
    } else {
      steps.push(`Arrived: None`);
    }

    steps.push(`Run P${p.id} for ${execTime} units.`);
    steps.push(`P${p.id} runs: ${currentTime} → ${currentTime + execTime}`);

    gantt.push({
      process: "P" + p.id,
      start: currentTime,
      end: currentTime + execTime,
    });

    currentTime += execTime;
    p.remaining -= execTime;

    steps.push(`Remaining P${p.id} = ${p.remaining}`);

    let arrivalsDuring = [];
    while (index < n && processes[index].arrival <= currentTime) {
      queue.push(processes[index]);
      arrivalsDuring.push(processes[index]);
      index++;
    }

    if (arrivalsDuring.length > 0) {
      steps.push(`At time ${currentTime}, arrivals:`);
      arrivalsDuring.forEach((x) => {
        steps.push(`P${x.id} (AT ${x.arrival})`);
      });
    }

    if (p.remaining > 0) {
      queue.push(p);
    } else {
      p.completion = currentTime;
      completed++;
      steps.push(`P${p.id} finishes here.`);
    }

    if (queue.length > 0) {
      steps.push(`Queue now: [${queue.map((x) => "P" + x.id).join(", ")}]`);
    }

    stepNo++;
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
      currentTime++;
      continue;
    }

    steps.push(`Time = ${currentTime} → choose highest priority among arrived`);

    steps.push(`By time ${currentTime}, arrived:`);

    available.forEach((p) => {
      steps.push(`P${p.id} (Priority ${p.priority})`);
    });

    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.arrival !== b.arrival) return a.arrival - b.arrival;
      return a.id - b.id;
    });
    steps.push(`Pick highest priority = smallest number:`);

    available.forEach((p, idx) => {
      if (idx === 0) {
        steps.push(`P${p.id} = ${p.priority} ✅ (highest)`);
      } else {
        steps.push(`P${p.id} = ${p.priority}`);
      }
    });

    let p = available[0];

    let startTime = currentTime;
    let completionTime = startTime + p.burst;

    steps.push(`So next = P${p.id}`);
    steps.push(`P${p.id} runs from ${startTime} to ${completionTime}`);

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
      priority: p.priority,
      completion: completionTime,
      tat,
      wt,
    });

    p.completed = true;
    currentTime = completionTime;
    completed++;
  }

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
      done: false,
    });
  }

  let time = Math.min(...processes.map((p) => p.arrival));
  let completed = 0;
  let currentProcess = null;
  let runStartTime = null;

  while (completed < n) {
    let arrivalsNow = processes.filter((p) => p.arrival === time && !p.done);

    let available = processes.filter(
      (p) => p.arrival <= time && !p.done && p.remaining > 0,
    );

    if (available.length === 0) {
      if (gantt.length === 0 || gantt[gantt.length - 1].process !== "IDLE") {
        gantt.push({
          process: "IDLE",
          start: time,
          end: time + 1,
        });
      } else {
        gantt[gantt.length - 1].end++;
      }

      time++;
      currentProcess = null;
      continue;
    }

    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.arrival !== b.arrival) return a.arrival - b.arrival;
      return a.id - b.id;
    });

    let selected = available[0];

    if (currentProcess === null || currentProcess.id !== selected.id) {
      if (currentProcess !== null && runStartTime !== null) {
        steps.push(
          `Time = ${runStartTime} to ${time}\n` +
            `P${currentProcess.id} runs continuously and stops here.`,
        );
      }

      steps.push(`Time = ${time} → choose highest priority among arrived`);

      if (arrivalsNow.length > 0) {
        steps.push(`Arrived:`);
        arrivalsNow.forEach((p) => {
          steps.push(`P${p.id} (Priority ${p.priority})`);
        });
      } else {
        steps.push(`Arrived: None`);
      }

      steps.push(`Remaining time:`);

      available.forEach((p, idx) => {
        if (idx === 0) {
          steps.push(`P${p.id} = ${p.remaining} (Priority ${p.priority}) ✅`);
        } else {
          steps.push(`P${p.id} = ${p.remaining} (Priority ${p.priority})`);
        }
      });

      if (currentProcess === null) {
        steps.push(`Run P${selected.id}`);
      } else {
        steps.push(`So preempt P${currentProcess.id}, run P${selected.id}`);
      }

      runStartTime = time;
    }

    if (
      gantt.length === 0 ||
      gantt[gantt.length - 1].process !== "P" + selected.id
    ) {
      gantt.push({
        process: "P" + selected.id,
        start: time,
        end: time + 1,
      });
    } else {
      gantt[gantt.length - 1].end++;
    }

    selected.remaining--;
    time++;

    if (selected.remaining === 0) {
      selected.completion = time;
      selected.done = true;
      completed++;

      steps.push(
        `Time = ${runStartTime} to ${time}\n` +
          `P${selected.id} runs continuously and finishes at ${time}.`,
      );

      runStartTime = null;
      currentProcess = null;
      continue;
    }

    currentProcess = selected;
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

  let stepCount = 0;
  let currentBlock = null;

  steps.forEach((line) => {
    if (!line || line.trim() === "") return;

    if (line.startsWith("Time =")) {
      stepCount++;

      const block = document.createElement("div");
      block.style.marginBottom = "1rem";

      const title = document.createElement("p");
      title.style.fontWeight = "bold";
      title.innerText = `Step ${stepCount}:`;

      block.appendChild(title);
      stepsDiv.appendChild(block);

      currentBlock = block;
    }

    const p = document.createElement("p");
    p.innerText = line;
    p.style.whiteSpace = "pre-line";
    p.style.marginLeft = "1rem";

    if (currentBlock) {
      currentBlock.appendChild(p);
    }
  });
}

function displayStepsSimple(steps) {
  const stepsDiv = document.getElementById("steps");
  stepsDiv.innerHTML = "<h3>Step-by-Step Execution</h3>";

  let stepCount = 1;

  steps.forEach((line) => {
    if (!line || line.trim() === "") return;

    const p = document.createElement("p");
    p.innerText = `Step ${stepCount}: ${line}`;
    stepsDiv.appendChild(p);

    stepCount++;
  });
}

function displayResult(completed) {
  const tbody = document.getElementById("tableBody");
  const calcBody = document.getElementById("calcBody");

  tbody.innerHTML = "";
  calcBody.innerHTML = "";

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
    const calcRow = `<tr>
      <td>P${p.id}</td>
      <td>${p.completion} - ${p.arrival} = ${p.tat}</td>
      <td>${p.tat} - ${p.burst} = ${p.wt}</td>
    </tr>`;
    calcBody.innerHTML += calcRow;
  });

  const output = document.getElementById("output");
  output.innerHTML = `
    <p><strong>Average Turn Around Time:</strong> ${(totalTAT / completed.length).toFixed(2)}</p>
    <br>
    <p><strong>Average Waiting Time:</strong> ${(totalWT / completed.length).toFixed(2)}</p>
  `;

  document.querySelector(".SJF").style.display = "flex";
}

document.getElementById("backBtn").addEventListener("click", goBack);
