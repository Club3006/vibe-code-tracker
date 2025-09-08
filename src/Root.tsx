import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import App from "./App";
import FocusSession from "./routes/FocusSession";
import UpdateCheckIn from "./routes/UpdateCheckIn";
import Coaching from "./routes/Coaching";
import History from "./routes/History";
import NavBar from "./components/NavBar";

function Layout() {
  return (
    <div 
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)"
      }}
    >
      <NavBar />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },                 // Morning Check-In
      { path: "/update", element: <UpdateCheckIn /> }, // Update Check In
      { path: "/focus", element: <FocusSession /> },   // Focus Session
      { path: "/coaching", element: <Coaching /> },    // Coaching Session
      { path: "/history", element: <History /> },      // History
    ],
  },
]);

export default function Root() {
  return <RouterProvider router={router} />;
}
