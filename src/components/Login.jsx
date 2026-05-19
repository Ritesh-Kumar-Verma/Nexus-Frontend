import { useEffect, useState } from "react";
import { authAPI } from "../api/service";
import { redirect, useNavigate } from "react-router-dom";
import Toast from "./Toast";
import { toast } from "react-toastify";
import Loading from "./Loading";
const Login = () => {
  const navigate = useNavigate();

  const [serverStatus, setServerStatus] = useState(null);

  const handleCheckStatus = async () => {
    try {
      const res =await authAPI.status();
      return res.status
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setServerStatus(handleCheckStatus())
  }, []);

  const [page, setPage] = useState("login");
  const [isAuthChecking, setIsAuthChecking] = useState(false);

  const [userLoginInfo, setUserLoginInfo] = useState({
    username: "",
    password: "",
    email: "",
  });

  const checkUserInfo = (form) => {
    if (userLoginInfo.username === "") {
      toast.error("Username Cannot be blank");
      return true;
    } else if (userLoginInfo.password === "") {
      toast.error("Password Cannot be blank");
      return true;
    } else if (form === "signup" && userLoginInfo.email === "") {
      toast.error("Email Cannot be black");
      return true;
    }
    // console.log(userLoginInfo)
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (checkUserInfo("signup")) {
      return;
    }

    try {
      setIsAuthChecking(true);
      const data = await authAPI.signup(userLoginInfo);
      localStorage.setItem("jwttoken", data.data);
      setIsAuthChecking(false);
      navigate("/home");
    } catch (error) {
      setIsAuthChecking(false);
      if (error.response.status == 409) {
        toast.error("Username Taken");
      } else {
        console.log(error.response);
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (checkUserInfo("login")) {
      return;
    }

    try {
      setIsAuthChecking(true);
      const data = await authAPI.login(userLoginInfo);
      // console.log(data.data);
      localStorage.setItem("jwttoken", data.data);
      // console.log("navigating to home")
      setIsAuthChecking(false);
      navigate("/home");
    } catch (errorMessage) {
      setIsAuthChecking(false);
      toast.error("Wrong username or password");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center  p-6 ">
      <Toast />
      <div
        className={` absolute top-5 right-5 h-fit border-2 px-2 rounded-lg ${serverStatus ? "bg-green-600 text-white/90" : "bg-red-400 text-black/60"} `}
      >
        Server {serverStatus ? "Online" : "Offline"}
      </div>
      {isAuthChecking && <Loading fullScreen={true} />}

      <div className="w-full max-w-225 h-140 bg-[linear-gradient(180deg,#1b2a3a_0%,#391f44_100%)] rounded-2xl  overflow-hidden flex shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]">
        {/* left half */}
        <div className="w-1/2 relative p-8 flex items-center justify-center">
          {/* login form page === 'login' */}
          <div
            className={`absolute inset-0 flex flex-col justify-center items-center px-6 transition-all duration-700 ease-in-out transform
              ${
                page === "login"
                  ? "translate-x-0 opacity-100 z-20 pointer-events-auto"
                  : "-translate-x-8 opacity-0 z-10 pointer-events-none"
              }
            `}
          >
            <h2 className="text-3xl font-bold mb-4 text-cyan-400">Login</h2>
            <form className="w-full max-w-sm" onSubmit={handleLoginSubmit}>
              <input
                className="w-full mb-4 p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="username"
                placeholder="Username"
                onChange={handleChange}
              />
              <input
                className="w-full mb-6 p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <button className="cursor-pointer w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition">
                Login
              </button>
            </form>
            <button
              onClick={() => setPage("signup")}
              className="cursor-pointer mt-4 text-cyan-700 hover:underline"
            >
              Don't have an account? Sign Up
            </button>
          </div>

          {/* left info page === 'signup' */}
          <div
            className={`absolute inset-0 flex flex-col justify-center items-center px-6 transition-all duration-700 ease-in-out transform
              ${
                page === "signup"
                  ? "translate-x-0 opacity-100 z-20 pointer-events-auto"
                  : "translate-x-8 opacity-0 z-10 pointer-events-none"
              }
            `}
          >
            <h2 className="text-3xl font-bold mb-3 text-cyan-600 text-center">
              Join Us Today!
            </h2>
            <p className="mb-6 text-center text-gray-200">
              Sign up to create an account and start your journey with Mapify.
            </p>

            <div className="flex items-center w-full mb-6">
              <div className="flex-1 h-px bg-gray-400"></div>
              <div className="px-2 text-white">or</div>
              <div className="flex-1 h-px bg-gray-400"></div>
            </div>

            <button
              onClick={() => setPage("login")}
              className="bg-cyan-600 cursor-pointer text-white px-5 py-2 rounded-full shadow hover:bg-cyan-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>

        {/* right half */}
        <div className="w-1/2 relative p-8 flex items-center justify-center bg-[linear-gradient(0deg,#1b2a3a_0%,#391f44_100%)]">
          {/* signup form  page === 'signup' */}
          <div
            className={`absolute inset-0 flex flex-col justify-center items-center px-6 transition-all duration-700 ease-in-out transform
              ${
                page === "signup"
                  ? "translate-x-0 opacity-100 z-20 pointer-events-auto"
                  : "translate-x-8 opacity-0 z-10 pointer-events-none"
              }
            `}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Sign Up</h2>
            <form className="w-full max-w-sm" onSubmit={handleSignUpSubmit}>
              <input
                className="w-full mb-4 p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
              <input
                className="w-full mb-4 p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
                name="username"
                placeholder="Username"
                onChange={handleChange}
              />
              <input
                className="w-full mb-6 p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <button className="cursor-pointer w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition">
                Sign Up
              </button>
            </form>
            <button
              onClick={() => setPage("login")}
              className="cursor-pointer mt-4 text-pink-600 hover:underline"
            >
              Already have an account? Login
            </button>
          </div>

          {/* right info  page === 'login'*/}
          <div
            className={`absolute inset-0 flex flex-col justify-center items-center px-6 transition-all duration-700 ease-in-out transform
              ${
                page === "login"
                  ? "translate-x-0 opacity-100 z-20 pointer-events-auto"
                  : "-translate-x-8 opacity-0 z-10 pointer-events-none"
              }
            `}
          >
            <h2 className="text-3xl font-bold mb-3 text-cyan-600 text-center">
              Welcome Back!
            </h2>
            <p className="mb-6 text-center text-gray-200">
              Login to your Account to access new Features.
            </p>
            <div className="flex items-center w-full mb-6">
              <div className="flex-1 h-px bg-gray-400"></div>
              <div className="px-2 text-white">or</div>
              <div className="flex-1 h-px bg-gray-400"></div>
            </div>
            <button
              onClick={() => setPage("signup")}
              className="cursor-pointer bg-pink-600 text-white px-5 py-2 rounded-full shadow hover:bg-pink-700 transition"
            >
              Go to Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
