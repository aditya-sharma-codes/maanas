# MANAS: Mental Awareness & Assistance for Student Stress

Welcome to the MANAS project! MANAS is a privacy-first, wellness application designed to help students track their stress levels, practice mindfulness, and seamlessly connect with campus counselors—all while remaining completely anonymous.

---

## Folder Structure

The project is divided into two main parts: the Frontend (User Interface) and the Backend (Server & Database). Below is a simple breakdown of the major folders.

### Frontend
- **Components**: Reusable UI elements like buttons, cards, and the mascot.
- **Pages**: Main screens of the application (e.g., Dashboard, Breathing, Games).
- **Store**: Manages the local state and data (like the anonymous student ID and wellness streak).
- **Services**: Contains the core logic for calculating weather states, recommendations, and rewards.

### Backend
- **Controllers**: Handles the logic for processing incoming requests and generating responses.
- **Routes**: Defines the URL endpoints (APIs) that the frontend communicates with.
- **Services**: Contains reusable business logic for database operations.
- **Prisma**: Holds the database schema and configurations.
- **Middleware**: Intercepts requests for security checks like verifying authentication tokens.

---

## Deployment

The MANAS platform is deployed across modern, cloud-based services to ensure high availability and security. Environment variables are strictly used across all platforms to protect sensitive keys and credentials.

- **Frontend → Vercel**: The user-facing application is hosted on Vercel, providing fast, global content delivery and automatic scaling.
- **Backend → Railway**: The core server and APIs are deployed on Railway, ensuring reliable processing and seamless integration with the database.
- **Database → Neon**: We use Neon for serverless PostgreSQL hosting, which offers excellent performance and secure data storage.
