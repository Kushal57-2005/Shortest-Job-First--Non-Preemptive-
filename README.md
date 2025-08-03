
🖥️ Shortest Job First (SJF) CPU Scheduling Algorithm - Non-Preemptive
This project demonstrates the implementation of the Shortest Job First (SJF) CPU Scheduling algorithm in a simple web-based interface. The non-preemptive version of SJF is implemented here, meaning once a process starts execution, it cannot be interrupted until it completes.

SJF selects the process with the shortest burst time next for execution, minimizing the average waiting and turnaround times, ensuring efficiency in CPU scheduling. However, it requires prior knowledge of burst times and can lead to process starvation for longer tasks.

Note: The preemptive version of the SJF algorithm was added in a previous update, where processes can be interrupted and restarted based on shorter burst times.

🚀 Features
Interactive Input: Users can input the number of processes along with their respective arrival time and burst time.

SJF Calculation: The algorithm calculates the completion time, turnaround time, and waiting time for each process.

Average Waiting & Turnaround Time: The averages are displayed after the calculation.

⚙️ Technologies Used
HTML: Used to structure the content and layout of the webpage.

CSS: For styling the page and making it responsive and visually appealing.

JavaScript: Powers the logic behind the SJF scheduling algorithm and dynamically updates the results.

🛠️ Getting Started
Prerequisites
A modern web browser (e.g., Google Chrome, Firefox, etc.)

Basic knowledge of the Shortest Job First (SJF) CPU scheduling algorithm.

How to Run
Clone or download the repository to your local machine.

Open the index.html file in your browser.

The landing page will provide a description of the algorithm.

Click the "Let's Go" button to move to the input form.

Enter the number of processes and provide their arrival times and burst times.

Click "Calculate SJF" to see the results displayed in a table format.

📁 Files Structure
index.html: Contains the HTML structure for the webpage.

style.css: Provides styling and layout for the user interface.

script.js: The JavaScript file that handles the algorithm, calculations, and result display.

🤝 Contribution
Feel free to fork the repository, submit issues, or open pull requests if you have suggestions, bug fixes, or improvements! 🛠️

🏆 Acknowledgements
Huge thanks to the open-source community for their valuable resources and inspiration! 🙏

This project was made as part of a learning process to understand CPU scheduling algorithms and their real-world applications. 💻

