# 📊 Job Request Dashboard

A Google Sheets–like task dashboard built in **React + TypeScript** with Tailwind CSS. Built to mimic a pixel-close layout from Figma and simulate real-time spreadsheet editing and task tracking.

---

## 🚀 Live Demo

🔗 [https://spreadsheet-dhwmh3w09-arindam-duttas-projects-bd121fd4.vercel.app](https://spreadsheet-dhwmh3w09-arindam-duttas-projects-bd121fd4.vercel.app)

---

## 📂 GitHub Repo

🔗 [https://github.com/ArindamDutta2004/Spreadsheet](https://github.com/ArindamDutta2004/Spreadsheet)

---

## 🛠️ Tech Stack

- ⚛️ **React 18** 
- 🔐 **TypeScript** (strict mode)
- 🎨 **Tailwind CSS** (utility-first styling)
- 🧩 **Custom table component** (spreadsheet-like experience)
- 🧠 **Local component state** (no global state library)
- ✨ **Lucide Icons**

---

## ⚖️ Trade-offs

- **Table:** Used custom table logic via hooks and `.map()` instead of `react-table` to maintain full control over rendering and keep the bundle lightweight. This also simplified editing and dynamic column toggling.

- **Data Persistence:** Tasks are currently stored in-memory (local state). For production use, the logic can be easily extended to connect with a backend like Supabase, Firebase, or a REST API.

- **State Management:** All state is managed locally with `useState` and `useReducer`. This avoids the overhead of external state management libraries (like Redux or Zustand) and keeps the code easier to reason about for this scope.

## 🧪 Setup Instructions

```bash

# 2. Install dependencies
npm install

# 3. Start the app
npm run dev

📸 Screenshots
(https://drive.google.com/file/d/1tdeJvESWOfoVkjkJqFtaSpHYlyg5jfbN/view?usp=sharing)

