# 🚀 AlgoViz — DSA Visualizer

> ⚠️ **This project is actively under development.** Features are being built and improved regularly. Expect breaking changes, incomplete sections, and exciting new additions soon!

A premium, interactive platform for visualizing Data Structures and Algorithms with step-by-step animations, code highlighting, and variable tracking.

---

## 🔨 Current Status

| Phase | Status |
|-------|--------|
| Phase 1 — Frontend + Landing Page + Mock Visualizer | 🔄 In Progress |
| Phase 2 — C++ Compilation Pipeline (g++ integration) | 🔄 In Progress |
| Phase 3 — Tree, Graph, Linked List Visualizers | 🔜 Coming Soon |
| Phase 4 — Auth, Progress Saving, AI Explanations | 🔜 Planned |

> 🧩 **Currently implemented:** Bubble Sort only — more algorithms coming soon!
> 💡 **Last updated:** May 2025 · More updates shipping weekly!

---

## ✨ Features

- **Interactive Visualizations** — Watch arrays sort, trees traverse, and graphs explore in real-time
- **Step-by-Step Execution** — Play, pause, step forward/back, adjust speed
- **Code Highlighting** — See exactly which line of code is executing
- **Variable Tracking** — Live variable values update alongside visualization
- **Auto-Detection** — Drop your C++ files into `algorithms/` and they appear automatically
- **Dark Mode** — Cinematic, professional dark UI with teal accent
- **Fully Responsive** — Works on desktop, tablet, and mobile

> 🔜 **Upcoming:** Graph visualizer, linked list animations, user progress tracking, and AI-powered algorithm explanations.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Node.js, Express.js |
| Algorithms | C++ (your own implementations) |
| Design | Custom CSS Design System |

---

## 📁 Project Structure

```
DSA-Visualizer/
├── algorithms/          # YOUR C++ algorithm files go here
│   ├── sorting/
│   ├── searching/
│   ├── stacks/
│   ├── queues/
│   ├── linked-lists/
│   ├── trees/
│   ├── graphs/
│   ├── recursion/
│   ├── dynamic-programming/
│   └── greedy/
├── backend/
│   ├── server.js        # Express dev server + API
│   ├── scanner.js       # Auto-scan algorithm directories
│   └── package.json
├── frontend/
│   ├── index.html       # Landing page
│   ├── visualizer.html  # Visualization page
│   └── assets/
│       ├── CSS/         # Design system (7 files)
│       └── JS/          # App + Visualizer engine
└── README.md
```

---

## 🚀 Quick Start

> ⚠️ Some features may not be fully functional yet while Phase 2 is in development.

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Start the dev server
npm start

# 3. Open in browser
# http://localhost:3000
```

---

## 📂 Adding Your Own Algorithms

1. Create a `.cpp` file in the appropriate category folder:
   ```
   algorithms/sorting/bubble_sort.cpp
   ```

2. Optionally add a companion `.json` file with metadata:
   ```json
   {
     "name": "Bubble Sort",
     "complexity": {
       "time": { "best": "O(n)", "average": "O(n²)", "worst": "O(n²)" },
       "space": "O(1)"
     },
     "description": "Repeatedly swaps adjacent elements",
     "visualizer": "array"
   }
   ```

3. The platform auto-detects your file via the API scanner.

> 🔜 **Upcoming:** Full C++ compilation and live execution pipeline — drop in any `.cpp` and watch it run visually.

---

## 📋 Keyboard Shortcuts (Visualizer)

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Step Forward |
| `←` | Step Backward |
| `R` | Reset |

---

## 🗺 Roadmap

- [ ] Phase 1 — Frontend + Landing Page + Mock Visualizer *(in progress 🔄 — Bubble Sort done)*
- [ ] Phase 2 — C++ Compilation Pipeline *(in progress 🔄)*
- [ ] Phase 3 — Tree, Graph & Linked List Visualizers *(coming soon 🔜)*
- [ ] Phase 4 — User Auth, Progress Saving & AI Explanations *(planned 🔜)*

---

## 🤝 Contributing

The project is in early development — contributions, suggestions, and bug reports are very welcome! Feel free to open an issue or pull request.

---

## 📄 License

MIT License — Built with ❤️ for learning.