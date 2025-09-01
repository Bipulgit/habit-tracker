# AI-Powered Habit Tracker (React + Supabase)

## 1️⃣ Setup Project
### Commands
```bash
# Create React project (using Vite for speed)
npm create vite@latest habit-tracker --template react
cd habit-tracker

# Install dependencies
npm install @supabase/supabase-js react-router-dom recharts

# for styling
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### File Structure
```
habit-tracker/
┣ 📁 public/
┃ ┗ vite.svg
┣ 📁 src/
┃ ┣ 📁 components/
┃ ┃ ┣ Auth.jsx           # Authentication UI
┃ ┃ ┣ Navbar.jsx         # Navigation bar
┃ ┃ ┣ HabitForm.jsx      # Create/Edit habits
┃ ┃ ┣ HabitList.jsx      # Display all habits
┃ ┃ ┣ HabitLogs.jsx      # Daily progress tracking
┃ ┃ ┗ Stats.jsx          # Progress charts
┃ ┣ 📁 pages/
┃ ┃ ┣ Dashboard.jsx      # Main dashboard
┃ ┃ ┣ Login.jsx          # Login page
┃ ┃ ┗ Register.jsx       # Registration page
┃ ┣ 📁 lib/
┃ ┃ ┗ supabase.js        # Supabase client
┃ ┣ 📁 hooks/
┃ ┃ ┗ useAuth.jsx         # Authentication hook
┃ ┣ 📁 utils/
┃ ┃ ┗ dateHelpers.js     # Date utility functions
┃ ┣ App.jsx              # Main app component
┃ ┣ index.css            # Global styles
┃ ┗ main.jsx             # App entry point
┣ .env                   # Environment variables
┣ .env.example           # Environment template
┣ .gitignore            # Git ignore rules
┣ tailwind.config.js     # Tailwind configuration
┣ postcss.config.js      # PostCSS configuration
┣ vite.config.js         # Vite configuration
┣ package.json           # Project dependencies
┗ README.md              # Project documentation

```

## 2️⃣ Backend (Supabase Setup)

### Step 1: Create a Supabase Project
- Go to [supabase.com](https://supabase.com), create project.  
- Copy **API URL** + **Anon Key** → put into `.env` file:
```env
VITE_SUPABASE_URL=https://your-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Database Tables
In Supabase SQL editor, run:
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

### Step 3: Enable Row Level Security (RLS)
```sql
alter table habits enable row level security;
alter table habit_logs enable row level security;

-- Users can manage their own habits
create policy "Users can view their habits"
  on habits for select using (auth.uid() = user_id);

create policy "Users can insert their habits"
  on habits for insert with check (auth.uid() = user_id);

-- Users can log only their habits
create policy "Users can manage their logs"
  on habit_logs for all
  using (exists (
    select 1 from habits
    where habits.id = habit_logs.habit_id
    and habits.user_id = auth.uid()
  ));
```

---

## 3️⃣ Frontend (React + Supabase)

### Step 1: Setup Supabase Client
`src/lib/supabase.js`
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

### Step 2: Auth Pages
- **Register.jsx** → Email/Password signup  
- **Login.jsx** → Email/Password login  

```js
const { data, error } = await supabase.auth.signUp({ email, password })
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
```

- Save session in React state/context.  

---

### Step 3: Dashboard
- Fetch habits for logged-in user.  
- Show list + “Add Habit” button.  

```js
const { data, error } = await supabase
  .from("habits")
  .select("*")
  .eq("user_id", user.id)
```

---

### Step 4: Add Habit
- `HabitForm.jsx` → Form with `name` & `description`.  
- Insert into Supabase:

```js
await supabase.from("habits").insert([
  { name, description, user_id: user.id }
])
```

---

### Step 5: Log Habit Progress
- `HabitLogs.jsx` → Daily checklist.  
- Insert logs:

```js
await supabase.from("habit_logs").insert([
  { habit_id, log_date: new Date().toISOString().split("T")[0], status: true }
])
```

- Prevent duplicate logs for same date.  

---

### Step 6: Stats Page
- Fetch logs, group by habit.  
- Use `Recharts` to show streaks/progress:

```js
const { data } = await supabase
  .from("habit_logs")
  .select("log_date, status")
  .eq("habit_id", habitId)
```

---

## 4️⃣ AI Integration (Optional)
- Install OpenAI client:  
  ```bash
  npm install openai
  ```
- Example: Suggest new habits:
```js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_KEY });

const response = await client.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Suggest 3 healthy daily habits" }]
});
console.log(response.choices[0].message.content);
```
- Display suggestions → allow user to add them as habits.  

---

## 5️⃣ Deployment
- Deploy frontend → **Vercel/Netlify**.  
- Supabase is already hosted.  
- Set **env vars** on hosting platform.  

---

✅ **Frontend covers:** Routing, Auth, CRUD, Charts, AI integration.  
✅ **Backend covers:** Auth, RLS, DB relations, Policies.  
✅ All within **free Supabase limits**.
