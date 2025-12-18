import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Pages
import Home from "../pages/Home";
import AllContests from "../pages/AllContests";
import About from "../pages/About";
import ContestDetails from "../pages/ContestDetails";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../router/ProtectedRoute";
import Leaderboard from "../components/Leaderboard";

// Dashboard child pages
import MyParticipated from "../pages/Dashboard/MyParticipated";
import MyWinning from "../pages/Dashboard/MyWinning";
import MyProfile from "../pages/Dashboard/MyProfile";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import ManageContests from "../pages/Dashboard/ManageContests";
import AddContest from "../pages/Dashboard/AddContest";
import MyCreatedContests from "../pages/Dashboard/MyCreatedContests";
import SubmittedTasks from "../pages/Dashboard/SubmittedTasks";
import EditContest from "../pages/Dashboard/EditContest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/all-contests", element: <AllContests /> },
      {
        path: "/contest/:id",
        element: (
          <ProtectedRoute>
            <ContestDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          { path: "my-participated", element: <MyParticipated /> },
          { path: "my-winning", element: <MyWinning /> },
          { path: "profile", element: <MyProfile /> },
          { path: "manage-users", element: <ManageUsers /> },
          { path: "manage-contests", element: <ManageContests /> },
          { path: "add-contest", element: <AddContest /> },
          { path: "my-created", element: <MyCreatedContests /> },
          { path: "submitted-tasks", element: <SubmittedTasks /> },
          { path: "edit-contest/:id", element: <EditContest /> },


        ],
      },
      { path: "/leaderboard", element: <Leaderboard /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
