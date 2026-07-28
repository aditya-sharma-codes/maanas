# Project Overview

## Project Architecture

The MANAS architecture is designed to be highly secure, completely anonymous, and easy to navigate.

- **Frontend**: The visual layer built with React. It runs in the student's browser, handling animations, form inputs, and local state (like daily streaks) without requiring an account.
- **Backend**: The central brain built with Express.js. It processes data sent from the frontend, enforces business rules, and communicates securely with the database.
- **Database**: A structured PostgreSQL system storing all anonymous assessments, institute credentials, and counselor schedules.
- **Student Flow**: A student scans a QR code, receives a secure, auto-generated anonymous ID, takes a stress assessment, views their customized Dashboard, and accesses immediate relief tools (Breathing, Games, Counseling).
- **Admin Dashboard**: A secure portal for institute administration to view real-time, aggregated campus wellness analytics without ever seeing a student's personal identity.

---

## Features Implemented

✓ Anonymous Student Login  
✓ Stress Assessment  
✓ Feather Forecast (Weather-based UI)  
✓ Guided Breathing Exercises  
✓ Stress Relief Games (Pattern Match)  
✓ Wellness Streak  
✓ Gamified Rewards & Confetti  
✓ Counselor Booking (Video, Voice, In-person)  
✓ Secure Institute Dashboard  
✓ Anonymous Analytics & High-Stress Alerts  

---

## Database Overview

The platform uses a **PostgreSQL database** managed via the **Prisma ORM**. Prisma acts as a bridge, allowing our backend to interact with the database using safe, typed code instead of raw SQL strings.

**Main Data Stored:**
- **Assessments**: Anonymous student IDs, calculated stress scores, timestamps, and weather categories.
- **Appointments**: Counselor availability, selected time slots, and the anonymous ID of the booking student.
- **Institutes**: Secure, hashed login credentials for campus administrators.

---

## API Overview

The backend exposes several key APIs (Application Programming Interfaces) for the frontend to consume.

- **Assessment API**
  - **Purpose**: Receives student quiz answers and saves the stress score.
  - **Request**: Anonymous ID and the list of answers.
  - **Response**: Confirmation of save and the calculated total score.

- **Appointment API**
  - **Purpose**: Fetches available counselors and processes session bookings.
  - **Request**: Counselor ID, date, time slot, and anonymous student ID.
  - **Response**: Booking confirmation and updated counselor availability.

- **Authentication API**
  - **Purpose**: Verifies institute administrators during login.
  - **Request**: Admin email and password.
  - **Response**: A secure JWT (JSON Web Token) to authorize future dashboard requests.

- **Dashboard API**
  - **Purpose**: Aggregates campus-wide data for the institute portal.
  - **Request**: Secure JWT token for authorization.
  - **Response**: Total assessments, unique IDs, weather distribution, and recent high-stress alerts.

---

## Security

Protecting student privacy is the foundational pillar of MANAS. 

- **Anonymous Student Token**: We never ask for names, emails, or roll numbers. Students are identified strictly by auto-generated tokens stored locally on their devices.
- **JWT Authentication**: Institute admins receive time-limited digital passports (JWTs) ensuring only authorized personnel access aggregated data.
- **Password Hashing**: Admin passwords are mathematically scrambled using `bcrypt` before being saved, ensuring they can never be read if the database is exposed.
- **Input Validation**: All incoming data is rigorously checked using `Zod` to prevent malicious or malformed requests from breaking the server.
- **Environment Variables**: Sensitive keys and database URLs are injected secretly during deployment, keeping them entirely out of the public source code.

---

## Testing

Comprehensive testing was conducted to ensure a flawless and responsive user experience:

- **Student Flow**: Verified seamless transition from QR scan to anonymous token generation and assessment completion.
- **Dashboard**: Ensured dynamic recommendations update based on current weather category and streak count.
- **Games**: Verified core loop and resolved a critical bug in the Pattern Match game where cards were prematurely revealing and failing to lock.
- **Breathing Exercises**: Tested the visual scaling and accurate interval timings across 5 different techniques.
- **Responsive Design**: Confirmed the UI scales elegantly across mobile phones, tablets, and desktop monitors.
- **API Testing**: Validated backend routes for proper data saving and error handling during server outages.

---

## Future Scope

While the current platform is highly robust, several exciting features can be considered for future phases:

1. **AI-Based Stress Prediction**: Analyzing historical anonymous data to predict high-stress periods (e.g., final exams) across the campus.
2. **Push Notifications**: Gentle, anonymous reminders to maintain wellness streaks or perform a quick breathing exercise.
3. **Wearable Integration**: Syncing with smartwatches to capture real-time heart rate variability data.
4. **Mobile Application**: Porting the web experience into a native iOS/Android app for deeper device integration.
5. **Multi-Language Support**: Offering the interface and breathing instructions in regional languages to improve accessibility.
6. **Live Counselor Chat**: Implementing a secure, ephemeral real-time messaging system for immediate crisis intervention.
