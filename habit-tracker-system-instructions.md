# 📖 System Instructions: AI-Powered Habit Tracker (React + Supabase)

This document provides **step-by-step system instructions** to build an AI-Powered Habit Tracker using **React + Supabase (Free Plan)**.

---

## 1️⃣ Initialize Project
### Commands
```bash
# Create React project using Vite
npm create vite@latest habit-tracker --template react
cd habit-tracker

# Install dependencies
npm install @supabase/supabase-js react-router-dom recharts

# (Optional) Tailwind CSS for styling
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Expected Structure
```
habit-tracker/
 ┣ src/
 ┃ ┣ components/
 ┃ ┃ ┣ Auth.jsx         # Login/Register UI
 ┃ ┃ ┣ Navbar.jsx
 ┃ ┃ ┣ HabitForm.jsx    # Add/Edit Habit
 ┃ ┃ ┣ HabitList.jsx    # Show all habits
 ┃ ┃ ┣ HabitLogs.jsx    # Daily logs
 ┃ ┃ ┗ Stats.jsx        # Charts for progress
 ┃ ┣ pages/
 ┃ ┃ ┣ Dashboard.jsx    # Main page after login
 ┃ ┃ ┣ Login.jsx
 ┃ ┃ ┗ Register.jsx
 ┃ ┣ lib/
 ┃ ┃ ┗ supabase.js      # Supabase client setup
 ┃ ┣ App.jsx
 ┃ ┗ main.jsx
 ┣ .env
 ┗ package.json
```

---

## 2️⃣ Backend Setup (Supabase)

### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com).  
2. Create a new project.  
3. Copy **API URL** and **Anon Key** → save in `.env` file:
```env
VITE_SUPABASE_URL=https://your-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

### Step 2: Database Tables
Run the following SQL in Supabase editor:
```sql
-- Habits table
create table habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp default now()
);

-- Habit logs table
create table habit_logs (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid references habits(id) on delete cascade,
  log_date date not null,
  status boolean default true,
  created_at timestamp default now()
);
```

---

### Step 3: Enable RLS
Enable **Row Level Security** and apply policies:
```sql
alter table habits enable row level security;
alter table habit_logs enable row level security;

-- Policies for habits
create policy "Users can view their habits"
  on habits for select using (auth.uid() = user_id);

create policy "Users can insert their habits"
  on habits for insert with check (auth.uid() = user_id);

-- Policies for logs
create policy "Users can manage their logs"
  on habit_logs for all
  using (exists (
    select 1 from habits
    where habits.id = habit_logs.habit_id
    and habits.user_id = auth.uid()
  ));
```

---

## 3️⃣ Frontend Setup

### Step 1: Supabase Client
`src/lib/supabase.js`
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

### Step 2: Auth Pages
- Register user:
```js
await supabase.auth.signUp({ email, password })
```

- Login user:
```js
await supabase.auth.signInWithPassword({ email, password })
```

---

### Step 3: Dashboard
Fetch user’s habits:
```js
const { data } = await supabase
  .from("habits")
  .select("*")
  .eq("user_id", user.id)
```

---

### Step 4: Add Habits
Insert habit:
```js
await supabase.from("habits").insert([
  { name, description, user_id: user.id }
])
```

---

### Step 5: Log Progress
Insert daily log:
```js
await supabase.from("habit_logs").insert([
  { habit_id, log_date: new Date().toISOString().split("T")[0], status: true }
])
```

---

### Step 6: Stats Page
Fetch logs for progress:
```js
const { data } = await supabase
  .from("habit_logs")
  .select("log_date, status")
  .eq("habit_id", habitId)
```

Visualize using `Recharts`.

---

## 4️⃣ AI Integration (Optional)
- Install OpenAI client:
```bash
npm install openai
```

- Generate habit suggestions:
```js
import OpenAI from "openai";
const client = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_KEY });

const response = await client.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Suggest 3 healthy daily habits" }]
});
console.log(response.choices[0].message.content);
```

---

## 5️⃣ Deployment
1. Push project to GitHub.  
2. Deploy frontend → **Vercel** or **Netlify**.  
3. Set environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, optional `VITE_OPENAI_KEY`).  

---

✅ You now have a structured **system instruction manual** for building the Habit Tracker.  
