import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import backgroundImage from "./assets/bg.png";
import "./App.css";
// 
// import Header from "./components/Header";
// import ResetPassword from "./pages/ResetPassword";
// import ForgotPassword from "./pages/ForgotPassword";
// import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        {/* <Header /> */}
        {/* <ProtectedRoute> */}
          <Home />
        {/* </ProtectedRoute> */}
      </>
    ),
  },
  // {
  //   path: "/login",
  //   element: (
  //     <>
  //       {/* <Header /> */}

  //       <Login />
  //     </>
  //   ),
  // },
  // {
  //   path: "/signup",
  //   element: (
  //     <>
  //       {/* <Header /> */}

  //       <SignUp />
  //     </>
  //   ),
  // },
  // {
  //   path: "/reset-password",
  //   element: (
  //     <>
  //       {/* <Header /> */}

  //       <ResetPassword />
  //     </>
  //   ),
  // },
  // {
  //   path: "/forgot-password",
  //   element: (
  //     <>
  //       {/* <Header /> */}
  //       <ForgotPassword />
  //     </>
  //   ),
  // },
]);
function App() {
  return (
    <div className="app-container" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <div className="overlay"></div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
