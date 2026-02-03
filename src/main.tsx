import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { ChatRoute } from "./pages/ChatRoute.tsx";
import { DefaultChat } from "./components/defaultChat/DefaultChat.tsx";
import { HomeRoute } from "./pages/HomeRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      { path: "c/:chatId", element: <ChatRoute /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
