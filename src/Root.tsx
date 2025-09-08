import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import FocusSession from "./routes/FocusSession";
import UpdateCheckIn from "./routes/UpdateCheckIn";
import Coaching from "./routes/Coaching";
import History from "./routes/History";

const router = createBrowserRouter([
  { path: "/", element: <App /> },                 // Morning Check-In
  { path: "/update", element: <UpdateCheckIn /> }, // Update Check In
  { path: "/focus", element: <FocusSession /> },   // Focus Session
  { path: "/coaching", element: <Coaching /> },    // Coaching Session
  { path: "/history", element: <History /> },      // History
]);

export default function Root() {
  return <RouterProvider router={router} />;
}
