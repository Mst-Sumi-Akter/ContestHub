import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { Toaster } from "react-hot-toast";

import ThemeProvider from "./context/ThemeContext";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
