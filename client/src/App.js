// external
import React, { useState, useEffect, useCallback } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router";

// components
import Layout from "./components/Layout/Layout";
import Backdrop from "./components/Backdrop/Backdrop";
import Toolbar from "./components/Toolbar/Toolbar";
import MainNavigation from "./components/Navigation/MainNavigation/MainNavigation";
import MobileNavigation from "./components/Navigation/MobileNavigation/MobileNavigation";
import ErrorHandler from "./components/ErrorHandler/ErrorHandler";

// pages
import FeedPage from "./pages/Feed/Feed";
import SinglePostPage from "./pages/Feed/SinglePost/SinglePost";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";

// Create a context for authentication
const AuthContext = React.createContext({
  isAuth: false,
  token: null,
  userId: null,
  login: () => {},
  logout: () => {},
});

const App = () => {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [authState, setAuthState] = useState({
    isAuth: false,
    token: null,
    userId: null,
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Auto-login on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    const userId = localStorage.getItem("userId");

    if (!token || !expiryDate || new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }

    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setAuthState({ isAuth: true, token, userId });
    setAutoLogout(remainingMilliseconds);
  }, []);

  // Mobile navigation handler
  const mobileNavHandler = useCallback((isOpen) => {
    setShowMobileNav(isOpen);
    setShowBackdrop(isOpen);
  }, []);

  // Backdrop click handler
  const backdropClickHandler = useCallback(() => {
    setShowBackdrop(false);
    setShowMobileNav(false);
    setError(null);
  }, []);

  // Logout handler
  const logoutHandler = useCallback(() => {
    setAuthState({ isAuth: false, token: null, userId: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
    navigate("/");
  }, [navigate]);

  // Login handler
  const loginHandler = async (event, authData) => {
    event.preventDefault();
    setAuthLoading(true);

    const graphqlQuery = {
      query: `
        query UserLogin($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            userId
          }
        }
      `,
      variables: {
        email: authData.email,
        password: authData.password,
      },
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphqlQuery),
      });
      const resData = await response.json();

      if (resData.errors) {
        throw new Error(resData.errors[0].message || "User login failed!");
      }

      const { token, userId } = resData.data.login;
      setAuthState({ isAuth: true, token, userId });
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem("expiryDate", expiryDate.toISOString());
      setAutoLogout(remainingMilliseconds);
      navigate("/");
    } catch (err) {
      setError(err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Signup handler
  const signupHandler = async (event, authData) => {
    event.preventDefault();
    setAuthLoading(true);

    const graphqlQuery = {
      query: `
        mutation CreateNewUser($email: String!, $name: String!, $password: String!) {
          createUser(userInput: {email: $email, name: $name, password: $password}) {
            _id
            email
          }
        }
      `,
      variables: {
        email: authData.email.toLowerCase(), // Ensure lowercase for mongoose
        name: authData.name,
        password: authData.password,
      },
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphqlQuery),
      });
      const resData = await response.json();

      if (resData.errors) {
        throw new Error(resData.errors[0].message || "User creation failed!");
      }

      navigate("/");
    } catch (err) {
      setError(err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Auto-logout handler
  const setAutoLogout = useCallback(
    (milliseconds) => {
      setTimeout(() => {
        logoutHandler();
      }, milliseconds);
    },
    [logoutHandler]
  );

  // Error handler
  const errorHandler = useCallback(() => {
    setError(null);
  }, []);

  // Routes based on authentication
  const routes = authState.isAuth ? (
    <Routes>
      <Route
        index
        element={<FeedPage userId={authState.userId} token={authState.token} />}
      />
      <Route
        path="/posts/:postId"
        element={
          <SinglePostPage userId={authState.userId} token={authState.token} />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  ) : (
    <Routes>
      <Route
        index
        element={<LoginPage onLogin={loginHandler} loading={authLoading} />}
      />
      <Route
        path="/signup"
        element={<SignupPage onSignup={signupHandler} loading={authLoading} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  return (
    <AuthContext.Provider
      value={{
        isAuth: authState.isAuth,
        token: authState.token,
        userId: authState.userId,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {showBackdrop && <Backdrop onClick={backdropClickHandler} />}
      <ErrorHandler error={error} onHandle={errorHandler} />
      <Layout
        header={
          <Toolbar>
            <MainNavigation
              onOpenMobileNav={() => mobileNavHandler(true)}
              onLogout={logoutHandler}
              isAuth={authState.isAuth}
            />
          </Toolbar>
        }
        mobileNav={
          <MobileNavigation
            open={showMobileNav}
            mobile
            onChooseItem={() => mobileNavHandler(false)}
            onLogout={logoutHandler}
            isAuth={authState.isAuth}
          />
        }
      />
      {routes}
    </AuthContext.Provider>
  );
};

export default App;
