# ContestHub 🏆

A modern, platform that allows users to create, discover, participate in, and manage creative contests.

🔗 **Live Site URL:** [Insert Live Link Here]

## ✨ Features

-   **User Roles**: Admin, Contest Creator, and Normal User with dedicated dashboards.
-   **Contest Discovery**: Browse contests by category, popularity, and search queries.
-   **Secure Authentication**: JWT-based login and registration with Google Sign-in support.
-   **Payment Integration**: (Mock/Simulated) flow for contest registration.
-   **Dashboard Management**:
    -   *Creators*: Add/Edit contests, view submissions, declare winners.
    -   *Admins*: Manage users, approve/reject contests.
    -   *Users*: Track participation and winning history.
-   **Leaderboard**: Dynamic ranking of users based on contest wins.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
-   **Dark/Light Theme**: Persistent theme toggle using local storage.
-   **Notifications**: Toast notifications for all major actions.
-   **Data Visualization**: Win percentage charts for user profiles.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Router, React Hook Form, TanStack Query (optional), Axios.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB.
-   **Authentication**: Firebase (Social), JWT (Session).

## 🚀 Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    cd contest-hub-client && npm install
    cd contest-hub-server && npm install
    ```
3.  Set up environment variables in `.env`.
4.  Run the development servers:
    ```bash
    # Client
    npm run dev
    # Server
    npm run start
    ```

## 📜 License

This project is licensed under the MIT License.
