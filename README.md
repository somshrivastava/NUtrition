# NUtrition 🥗

### Live Demo

The app is deployed and available at: [[YOUR_DEPLOYMENT_URL_HERE](https://nutrition-oasis.vercel.app/)]

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Description

NUtrition was built as a part of the Oasis Project Series during Spring 2025 at Northeastern. It helps students and staff easily view, filter, and analyze dining hall menus, with a focus on nutrition, dietary needs, and meal planning. The app provides a seamless experience for browsing menus, logging meals, and making informed dining choices.

## Features

- View daily menus for all Northeastern dining halls
- Filter foods by dietary needs (vegetarian, vegan, gluten-free, etc.)
- Sort menu items by calories, protein, carbs, and fats
- Personalized meal logging and history
- Responsive UI for desktop and mobile
- Scheduled, automated menu scraping and updates
- Admin refresh and monitoring tools

## Tech Stack

- React (Vite)
- Supabase (Postgres, Auth, Storage)
- Playwright (for scraping, Python or TypeScript)
- SCSS/CSS Modules
- TypeScript

## Installation

1. Clone the repository:

```sh
git clone https://github.com/somshrivastava/NUtrition.git
cd NUtrition
```

2. Install frontend dependencies:

```sh
cd frontend
npm install
```

3. Install backend dependencies:

```sh
cd ../backend
pip install -r requirements.txt
```

4. Set up Supabase:

- Create a Supabase project at [supabase.com](https://supabase.com/)
- Add your Supabase config to `frontend/src/supabase.ts` and backend environment

5. Run the app locally:

```sh
cd ../frontend
npm run dev
```

## Usage

- Browse and filter dining hall menus
- Log your meals and view nutrition history
- Admins can trigger menu refreshes and monitor scraper status

**Example:**

```sh
npm run dev
# Open http://localhost:5173 in your browser
```

## License

This project is licensed under the MIT License.
