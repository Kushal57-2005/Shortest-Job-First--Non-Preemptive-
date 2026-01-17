# 🖥️ CPU Scheduling Algorithms Simulator

A **web-based simulator** for visualizing and understanding different **CPU scheduling algorithms** used in Operating Systems.  
The application not only calculates scheduling metrics but also **shows execution steps and Gantt chart visualization** for better conceptual clarity.

> ✅ **Live Demo**  
> https://kushal57-2005.github.io/Shortest-Job-First--Non-Preemptive-/

---

## 🚀 Implemented Algorithms

- **First Come First Serve (FCFS)**
- **Shortest Job First (SJF)**
  - Non-Preemptive
  - Preemptive
- **Round Robin (RR)**
- **Priority Scheduling**
  - Non-Preemptive
  - Preemptive

---

## ✨ Features

- 📥 User input for:
  - Number of processes
  - Arrival time
  - Burst time
  - Priority (for priority scheduling)
  - Time quantum (for Round Robin)

- 🧠 Automatic calculation of:
  - Completion Time
  - Turnaround Time
  - Waiting Time

- 📊 **Gantt Chart visualization** showing CPU execution order  
- 🪜 **Step-by-step execution** of each scheduling algorithm  
- 📉 Displays **average waiting time** and **average turnaround time**  
- 🎨 Clean and responsive UI for better readability

---

## ⚙️ Technologies Used

- **HTML** – Structure of the application  
- **CSS** – Styling and responsive layout  
- **JavaScript (Vanilla JS)** – Scheduling logic, Gantt chart generation, and DOM manipulation  

---

## 🛠️ How to Run the Project

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Select a CPU scheduling algorithm
4. Enter process details
5. Click **Calculate** to view:
   - Step-by-step execution
   - Gantt chart
   - Computed scheduling metrics

---

## 📁 Project Structure

project-root/
├── index.html    # Main UI
├── style.css     # Styling and layout
└── script.js     # Scheduling logic, steps, and Gantt chart visualization

---
## 🎓 Educational Purpose

This project is useful for:
- Operating Systems labs and assignments
- Visualizing CPU scheduling behavior
- Comparing different scheduling algorithms
- Exam and viva preparation

---

## 🤝 Contributions

Contributions are welcome.  
Feel free to fork the repository, open issues, or submit pull requests to improve the simulator.

---

## 🙏 Acknowledgements

- Inspired by classical Operating Systems scheduling problems  
- Thanks to the open-source community for continuous learning
