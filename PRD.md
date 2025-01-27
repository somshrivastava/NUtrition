# Product Requirement Document: NUtrition

## Overview

**Project Name:** NUtrition
**Project Contributors:** Naman, Som, Rishi, Christopher
**Objective:** To build a web-based application that allows Northeastern University students to easily view and calculate nutritional facts about the food available in campus dining halls. The app will scrape nutritional data from the campus dining hall website (NU Dining) and present it in a user-friendly interface.

---

## Goals and Objectives

### Primary Goals:

1. Provide students with easy access to accurate nutritional information for meals served at NU dining halls.
2. Allow users to calculate and track their daily nutritional intake.
3. Support informed dietary choices by offering filtering and customization options for specific dietary needs (e.g., vegetarian, gluten-free).

### Secondary Goals:

1. Enhance user engagement by providing personalized recommendations based on user preferences and past choices.
2. Offer features for meal planning to help users meet their fitness or dietary goals.

---

## Target Audience

**Primary Users:** Northeastern University students, faculty, and staff who eat at campus dining halls and want to make informed dietary choices.

**Secondary Users:** Fitness enthusiasts, students with dietary restrictions, and health-conscious individuals.

---

## Key Features

### 1. Nutritional Information Scraper:

- Scrape nutritional data from the NU Dining website
  (https://www.nudining.com/public/whats-on-the-menu)
- Automatically update information daily to reflect menu changes.
  (with backend API)

### 2. Nutritional Facts Dashboard:

- Display detailed nutritional information (calories, protein, carbs, fats, vitamins, etc.) for all menu items.
- Highlight allergen information.

### 3. Customization and Filtering:

- Allow users to filter menu items based on dietary preferences (e.g., vegetarian, vegan, gluten-free, low-calorie).
- Enable users to sort items by nutritional content (e.g., highest protein, lowest calories).

### 4. Meal Tracker:

- Allow users to add selected menu items to their daily meal tracker.
- Automatically calculate total nutritional intake for the day.

### 5. Personalized Recommendations:

- Suggest menu items based on user preferences, past selections, and dietary goals.
- OpenAI API integration potential here

### 6. User Accounts:

- Northeastern Authentication? How do we do this?
- Enable users to create accounts to save preferences and track history.
- Offer a guest mode for basic functionality.

### 7. Mobile-Friendly Design:

- Optimize the application for use on both desktop and mobile devices.

### 8. Analytics Dashboard (Optional Future Feature):

- Provide aggregate insights about the most popular menu items or average nutritional intake across users.

---

## Technical Requirements

### Frontend:

- **Framework:** React javascript; React-router-dom
- **Styling:** Tailwind CSS, Bootstrap; PrimeReact;
- **Build Tool:** Vite

### Backend:

- **Framework:** Flask with Selenium; CORS; dotenv for safe API key usage
- **Database:** MongoDB for user data and preferences
- **API:** RESTful API for communication between frontend and backend

### Scraping and Automation:

- **Tool:** selenium
- **Frequency:** Hourly??? Daily??s

### Hosting:

- **Frontend Hosting:** Netlify or Vercel
- **Backend Hosting:** AWS EC2 or Heroku
- **Database Hosting:** MongoDB Atlas

---

## User Stories

### As a User:

1. I want to see the nutritional information for all available dining hall menu items so that I can make informed meal choices.
2. I want to filter menu items by dietary preferences so that I can quickly find what I need.
3. I want to track my meals and calculate my daily nutritional intake so that I can achieve my dietary goals.
4. I want personalized meal recommendations so that I can discover new options aligned with my preferences.
5. I want to save my preferences and meal history so that I don’t have to re-enter information every time.

---

## Milestones and Timeline

### Phase 1: Core MVP (4-6 Weeks)

1. Implement the data scraper for NU Dining website.
2. Build the nutritional facts dashboard.
3. Add filtering and sorting functionality.
4. Enable basic meal tracking without user accounts.

### Phase 2: Enhanced Features (4 Weeks)

1. Add user accounts with saved preferences and history.
2. Implement personalized recommendations.
3. Optimize the app for mobile use.

### Phase 3: Future Expansion (Optional)

1. Introduce meal planning features.
2. Add analytics dashboards.
3. Implement a feedback system for user suggestions.

---

## Success Metrics

1. **Adoption Rate:** Percentage of Northeastern students using the app within the first 6 months.
2. **Engagement:** Average number of sessions per user per week.
3. **Accuracy:** Percentage of correct nutritional data scraped from NU Dining.
4. **Retention:** Percentage of users who create accounts and return after the first session.

---

## Risks and Mitigation

### Risk 1: Inconsistent Data from NU Dining Website

**Mitigation:** Implement error-handling and notification systems for failed scrapes; create a backup database for manual updates.

### Risk 2: Low User Adoption

**Mitigation:** Conduct user testing and refine the UI/UX; promote the app through Northeastern student groups and social media.

### Risk 3: Limited Resources for Maintenance

**Mitigation:** Use scalable hosting solutions; implement logging and monitoring to quickly address issues.

---

## Open Questions

1. What specific dietary filters should be prioritized (e.g., allergens, keto, etc.)?
2. Should the app integrate with fitness tracking apps like MyFitnessPal?
3. What partnerships can be explored to enhance app adoption (e.g., collaboration with NU Dining)?

---

## Conclusion

NUtrition Oasis aims to empower Northeastern University students to make healthier, informed dietary choices by providing accurate, accessible, and actionable nutritional data. With an intuitive interface and valuable features, it strives to become an essential tool for campus life.
