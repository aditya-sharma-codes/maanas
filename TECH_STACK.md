# Technology Stack

This document outlines the core technologies powering the MANAS platform. Each tool was carefully selected to ensure the application is fast, secure, scalable, and easy to maintain.

---

### React
- **Purpose**: Building the User Interface (UI).
- **Why it was selected**: React allows us to create interactive, responsive, and reusable web components quickly. It ensures a smooth and dynamic experience for the students.

### TypeScript
- **Purpose**: Adding strict typing to JavaScript.
- **Why it was selected**: TypeScript catches potential errors before the code is even run. It makes the codebase highly predictable, stable, and easier for new developers to understand.

### Vite
- **Purpose**: Frontend build tool and development server.
- **Why it was selected**: Vite offers incredibly fast startup times and instant updates during development. It compiles the final production code highly efficiently, improving overall performance.

### Tailwind CSS
- **Purpose**: Styling the application visually.
- **Why it was selected**: It provides a utility-first approach, allowing us to build beautiful, custom designs directly within our components without writing complex, messy CSS files.

### Framer Motion
- **Purpose**: Implementing animations and transitions.
- **Why it was selected**: It makes adding complex, physics-based animations (like our breathing circles and page transitions) simple, bringing the application to life and improving user engagement.

### Zustand
- **Purpose**: Managing local application state.
- **Why it was selected**: Zustand is a lightweight and unopinionated state manager. It perfectly handles our anonymous student tokens and wellness streaks without the heavy boilerplate of other tools.

### Express.js
- **Purpose**: Running the backend web server.
- **Why it was selected**: It is a fast, minimalist framework for Node.js. It simplifies the process of creating robust APIs to handle student assessments and counselor bookings.

### Prisma
- **Purpose**: Object-Relational Mapping (ORM) for the database.
- **Why it was selected**: Prisma translates our TypeScript code into safe database queries. It provides a highly readable schema structure and prevents common database security flaws.

### PostgreSQL
- **Purpose**: Storing persistent application data.
- **Why it was selected**: PostgreSQL is an incredibly reliable, open-source relational database. It is renowned for its data integrity, security features, and ability to handle complex queries efficiently.

### Railway
- **Purpose**: Hosting the backend server.
- **Why it was selected**: Railway offers a seamless deployment experience with built-in continuous integration. It automatically builds and scales our backend whenever new code is pushed.

### Vercel
- **Purpose**: Hosting the frontend application.
- **Why it was selected**: Vercel provides world-class global content delivery networks (CDNs). It ensures the MANAS website loads instantly for students, regardless of their location.

### Neon Database
- **Purpose**: Cloud hosting for our PostgreSQL database.
- **Why it was selected**: Neon is a serverless database platform that scales automatically based on demand. It separates compute and storage, making it both highly resilient and cost-effective.
