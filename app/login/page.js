"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storeData, retrieveData } from "../utils/storageUtils";
import ForgotPassword from "../candidatesDashboard/modal/forgotPassword";
import { Input } from "@/components/ui/input";

export default function Login(user) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const router = useRouter();
  const [captchaImage, setCaptchaImage] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [buttonText, setButtonText] = useState("Login");
  const usernameRef = useRef(null);
  const captchaInputRef = useRef(null);
  const [captchaTouched, setCaptchaTouched] = useState(false); // New state to track if captcha has been touched

  const generateCaptcha = useCallback(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 150;
    canvas.height = 50;

    ctx.fillStyle = "#01472B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = "#0E5A35";
      ctx.stroke();
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#FFFFFF";
    for (let i = 0; i < text.length; i++) {
      const x = 20 + i * 25;
      const y = 30 + Math.random() * 10;
      const angle = (Math.random() - 0.5) * 0.4;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    setCaptchaImage(canvas.toDataURL());
    setCaptchaText(text);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCalculation = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCalculation({ num1, num2, answer: "" });
  }, []);

  useEffect(() => {
    generateCalculation();
  }, [generateCalculation]);

  const [calculation, setCalculation] = useState({
    num1: 0,
    num2: 0,
    answer: "",
  });
  const [calculationError, setCalculationError] = useState(false);

  useEffect(() => {
    const userName = retrieveData("first_name");
    const userId = retrieveData("user_id");
    const url = retrieveData("url");

    if (userName || userId || url) {
      const userLevel = retrieveData("user_level");
      switch (userLevel) {
        case "100.0":
          router.push("/admin/dashboard");
          break;
        case "2":
          router.push("/superAdminDashboard");
          break;
        case "supervisor":
          router.push("/supervisorDashboard");
          break;
        case "1.0":
          router.push("/candidatesDashboard");

          break;
        default:
          console.log("Unknown user level:", userLevel);
          break;
      }
      return;
    }
  }, [router]);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() && !password.trim()) {
      toast.error("Please enter both username and password.");
      return;
    }

    if (!username.trim()) {
      toast.error("Please enter your username.");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    if (!calculation.answer.trim()) {
      setCalculationError(true);
      toast.error("Please answer the calculation.");
      return;
    }

    if (parseInt(calculation.answer) !== calculation.num1 + calculation.num2) {
      setCalculationError(true);
      toast.error("Invalid Credentials. Please try again.");
      generateCalculation();
      generateCaptcha();
      setCaptchaInput("");
      setUsername("");
      setPassword("");
      return;
    }

    generateCaptcha();
    setCaptchaInput("");
    setShowCaptcha(true);

    setButtonText("Submit");
    setLoading(false);

    // setTimeout(() => {
    //   if (showCaptcha) {
    //     captchaInputRef.current.focus();
    //   }
    // }, 0);

    // setLoading(true);
    // try {
    //   const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    //   const formData = new FormData();
    //   formData.append("operation", "login");
    //   formData.append("json", JSON.stringify({ username, password }));

    //   const response = await axios.post(url, formData);

    //   if (response.data) {
    //     const user = response.data;

    //     // Step 2: If credentials are correct, generate captcha
    //     generateCaptcha();
    //     setCaptchaInput(""); // Clear previous captcha input
    //     setShowCaptcha(true); // Show captcha input field

    //     setButtonText("Submit");
    //     setLoading(false);
    //   } else {
    //     toast.error("Invalid Credentials. Please try again.");
    //     generateCaptcha();
    //     setCaptchaInput("");
    //     setUsername("");
    //     setPassword("");
    //     generateCalculation();
    //     setShowCaptcha(false);
    //     setButtonText("Login");
    //   }
    // } catch (error) {
    //   toast.error("Error logging in. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  // New function to handle captcha validation
  const handleCaptchaValidation = async () => {
    setCaptchaTouched(true); // Mark captcha as touched when validating

    if (!captchaInput) {
      toast.error("Please enter the captcha.");
      return;
    }

    if (captchaInput !== captchaText) {
      toast.error("Invalid credentials. Please try again.");
      generateCaptcha();
      setCaptchaInput("");
      setUsername("");
      setPassword("");
      generateCalculation();
      setShowCaptcha(false);
      setButtonText("Login");

      // Focus on the captcha input after an invalid attempt

      return;
    }

    // // Proceed to successful login
    // toast.success("Login successful! Redirecting...");
    // setTimeout(() => {
    //   // Redirect based on user level
    //   if (user.adm_user_level === "admin") {
    //     router.push("/admin/dashboard");
    //   } else if (user.user_level_id === "superAdmin") {
    //     router.push("/superAdminDashboard");
    //   } else if (user.sup_user_level === "supervisor") {
    //     router.push("/supervisorDashboard");
    //   } else if (user.user_level_id === "applicant") {
    //     router.push("/candidatesDashboard");
    //   }
    // }, 1000);

    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const formData = new FormData();
      formData.append("operation", "login");
      formData.append("json", JSON.stringify({ username, password }));

      const response = await axios.post(url, formData);

      if (response.data) {
        const user = response.data;

        setButtonText("Submit");
        setLoading(true);

        toast.success("Login successful! Redirecting...");

        if (user.adm_userLevel === "100.0") {
          storeData("user_id", user.adm_id);
          storeData("user_level", user.adm_userLevel);
          storeData("name", user.adm_name || "");
          router.push("/admin/dashboard");
        } else if (user.user_level_id === "superAdmin") {
          storeData("user_id", user.sup_id);
          storeData("user_level", user.user_level_id);
          storeData("name", user.sup_name || "");
          storeData("email", user.sup_email || "");
          router.push("/superAdminDashboard");
        } else if (user.sup_user_level === "supervisor") {
          storeData("user_id", user.sup_id);
          storeData("user_level", user.sup_user_level);
          storeData("name", user.sup_name || "");
          storeData("email", user.sup_email || "");
          router;
        } else if (user.cand_userLevel === "1.0") {
          storeData("user_id", user.cand_id);
          storeData("user_level", user.cand_userLevel);
          storeData("first_name", user.cand_firstname || "");
          router.push("/candidatesDashboard");
        }
      } else {
        toast.error("Invalid Credentials. Please try again.");
        generateCaptcha();
        setCaptchaInput("");
        setUsername("");
        setPassword("");
        generateCalculation();
        setShowCaptcha(false);
        setButtonText("Login");
      }
    } catch (error) {
      toast.error("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculationChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setCalculation({ ...calculation, answer: numericValue });

    setCalculationError(
      numericValue !== "" &&
        parseInt(numericValue) !== calculation.num1 + calculation.num2
    );
  };

  useEffect(() => {
    if (showCaptcha && captchaInputRef.current) {
      captchaInputRef.current.focus();
    }
  }, [showCaptcha]);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  return (
    <div className="min-h-screen bg-[#01472B] flex items-center justify-center px-4">
      <div className="bg-[#01472B] p-8 rounded-lg w-full max-w-4xl flex flex-col md:flex-row">
        <div className="flex flex-col justify-center w-full md:w-1/2 order-2 md:order-1">
          {/* <h1 className="text-2xl text-green-200 mb-2 slide-up">Welcome to</h1> */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 slide-up">
            Del Monte
          </h2>
          <p className="text-green-200 mb-6 slide-up">
            Login to your existing account
          </p>
          <div className="mb-4">
            <label className="block text-green-200 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0E5A35]  placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 slide-up text-white"
              required
              autoFocus
              ref={usernameRef}
            />
            {/* <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0E5A35] text-muted placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 slide-up"
              required
            /> */}
          </div>
          <div className="mb-4">
            <label className="block text-green-200 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0E5A35] placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 slide-up text-white"
              required
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-[#0E5A35] p-3 rounded-lg text-green-200 w-12 h-12 flex items-center justify-center">
                {calculation.num1}
              </div>
              <div className="text-green-200 text-2xl">+</div>
              <div className="bg-[#0E5A35] p-3 rounded-lg text-gray-200 w-12 h-12 flex items-center justify-center">
                {calculation.num2}
              </div>
              <div className="text-gray-200 text-2xl">=</div>
              <input
                id="calculation"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="?"
                value={calculation.answer}
                onChange={handleCalculationChange}
                className={`w-12 h-12 p-3 rounded-lg bg-[#0E5A35] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-center ${
                  calculationError || calculation.answer === ""
                    ? "border-red-500 border-2"
                    : "border-green-500 border-2"
                }`}
              />
            </div>
          </div>
          {showCaptcha && (
            <div className="mb-4">
              <img src={captchaImage} alt="Captcha" />
              <input
                ref={captchaInputRef}
                type="text"
                placeholder="Enter captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className={`w-full p-3 rounded-lg bg-[#0E5A35] placeholder-gray-200 focus:outline-none focus:ring-2 ${
                  captchaTouched
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                } slide-up text-white`}
                required
                autoFocus
              />
            </div>
          )}
          <button
            onClick={
              buttonText === "Login" ? handleLogin : handleCaptchaValidation
            }
            className="w-full bg-[#0B864A] hover:bg-green-500 text-green-100 py-3 rounded-lg transition duration-200 slide-up"
            disabled={loading}
          >
            {loading ? "Logging in..." : buttonText}
          </button>
          <div className="mt-4 text-white flex flex-col items-start">
            <p>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="ml-2 text-green-300 hover:underline slide-up"
              >
                Create account here
              </Link>
            </p>
            <button
              className="text-green-300 hover:underline slide-up mt-2"
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex items-center justify-center w-full md:w-1/2 mb-8 md:mb-0 md:pl-8 order-1 md:order-2">
          <Image
            src="/assets/images/logoDelmonte.jpg"
            alt="Del Monte"
            width={500}
            height={500}
            className="rounded-3xl object-cover hidden md:block"
          />
          <Image
            src="/assets/images/delmonte.png"
            alt="Del Monte"
            width={100}
            height={100}
            className="rounded-3xl object-cover block md:hidden mb-6 top-0 h-auto w-auto"
            priority
          />
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <ForgotPassword
          showModal={showForgotPasswordModal}
          setShowModal={setShowForgotPasswordModal}
          candidateEmail={username}
        />
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
