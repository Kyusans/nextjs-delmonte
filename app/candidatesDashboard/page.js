"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import {
  retrieveDataFromCookie,
  retrieveDataFromSession,
  storeDataInCookie,
  storeDataInSession,
  removeDataFromCookie,
  removeDataFromSession,
  retrieveData,
  storeData,
  removeData,
} from "../utils/storageUtils";

import {
  faChevronDown,
  faMoon,
  faSun,
  faSignOutAlt,
  faInfoCircle,
  faUser,
  faBell,
  faTimes,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBellSlash,
  faUser as faUserRegular,
  faBell as faBellRegular,
} from "@fortawesome/free-regular-svg-icons";
import Sidebar from "./sideBar/sideBar";
import secureLocalStorage from "react-secure-storage";
import JobDetailsModal from "./modal/jobDetails";
import ViewProfile from "./modal/viewProfile";
import ExamModal from "./exam/exam";
import { TbMenuDeep } from "react-icons/tb";
import { MdClose } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import JobOfferModal from "./modal/jobOffer";
import CancelJobModal from "./modal/cancelJobApplied";
import {
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { XCircleIcon } from "lucide-react";
import { UserIcon } from "@heroicons/react/24/solid";
import { tailChase } from "ldrs";

tailChase.register();

export default function DashboardCandidates() {
  const [jobs, setJobs] = useState([]);
  const dropdownUsernameRef = useRef(null);
  const [notification, setNotification] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedJobsLoading, setAppliedJobsLoading] = useState(true);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownNotificationRef = useRef(null);

  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [selectedJobMId, setSelectedJobMId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [selectedJobPercentage, setSelectedJobPercentage] = useState(null);
  const [selectedJobPassingPoints, setSelectedJobPassingPoints] = useState(null);
  const [appId, setAppId] = useState(null);
  const [jobMId, setJobMId] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [jobAppId, setJobAppId] = useState(null);

  const [examResults, setExamResults] = useState([]);

  const [isJobOfferModalOpen, setIsJobOfferModalOpen] = useState(false);
  const [jobOfferDetails, setJobOfferDetails] = useState(null); // State to hold job offer details

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [jobToCancel, setJobToCancel] = useState(null);

  // useEffect(() => {
  //   localStorage.setItem("theme", isDarkMode ? "darks" : "light");
  //   console.log("Setting theme:", isDarkMode ? "darks" : "light");
  // }, [isDarkMode]);

  // const [isDarkMode, setIsDarkMode] = useState(() => {
  //   const savedTheme = localStorage.getItem("theme");
  //   return savedTheme === "darks";
  // });

  const handleViewProfileClick = (candId) => {
    setSelectedCandidateId(candId);
    setIsUserDropdownOpen(false);
    setIsProfileModalOpen(true);
    setIsMenuOpen(false);
    // setIsDarkMode(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);

    setSelectedCandidateId(null);
  };

  async function fetchJobs() {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const candId = retrieveData("user_id");
      // console.log("Fetching jobs...");
      const formData = new FormData();
      formData.append("operation", "getActiveJob");
      formData.append("json", JSON.stringify({ cand_id: candId }));
      const response = await axios.post(url, formData);

      // console.log("Response:", response);
      // console.log("active job data:", response.data);

      if (Array.isArray(response.data)) {
        // console.log("Setting jobs:", response.data);
        setJobs(response.data);
      } else {
        // console.error("Invalid data format:", response.data);
        setError("Unexpected data format received from server.");
      }
    } catch (error) {
      // console.error(
      //   "Error fetching jobs:",
      //   error.response || error.message || error
      // );
      setError("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchNotification = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const candId = retrieveData("user_id");

      const formData = new FormData();
      formData.append("operation", "getNotification");
      formData.append("json", JSON.stringify({ cand_id: candId }));
      
      const response = await axios.post(url, formData);
      // console.log('Notification response:', response.data);

      // Ensure response.data is an array
      const notifications = Array.isArray(response.data) ? response.data : [];
      setNotification(notifications);

      // Calculate unread notifications
      const unreadCount = notifications.reduce((count, notif) => {
        return count + (notif.notification_read === 0 ? 1 : 0);
      }, 0);
      
      setUnreadNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotification([]);
      setUnreadNotificationCount(0);
    }
  };

  // console.log("notification", notification);

  useEffect(() => {
    fetchNotification();
  }, []);

  const markNotificationsAsRead = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const candId = retrieveData("user_id");

      const formData = new FormData();
      formData.append("operation", "markNotificationsAsRead");
      formData.append("json", JSON.stringify({ cand_id: candId }));
      await axios.post(url, formData);

      // Reset the count to zero on the frontend
      setUnreadNotificationCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("appearance");
    if (savedTheme && savedTheme !== "system") {
      return savedTheme === "dark";
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark;
  };

  const getInitialThemeOption = () => {
    const savedThemeOption = localStorage.getItem("themeOption");
    return savedThemeOption ? savedThemeOption : "system";
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("appearance", theme);
    document.body.className = theme;
    // console.log("Setting theme:", theme);
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  // Toggle function to switch themes manually
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleDetailsClick = (job) => {
    storeData("jobId", job.jobM_id);
    // console.log("Selected job:", job);

    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // const first_name = secureLocalStorage.getItem("first_name");
  // const updatedFirstName = first_name.toUpperCase();
  // secureLocalStorage.setItem("first_name", updatedFirstName);
  const userId = retrieveData("user_id");

  const [profile, setProfile] = useState({
    candidateInformation: {},
    educationalBackground: [],
    employmentHistory: {},
    skills: [],
    training: [],
  });

  // useEffect(() => {
  //   try {
  //     console.log('Checking authentication...');
  //     const token = retrieveDataFromCookie("auth_token");
  //     console.log('Retrieved token:', token);

  //     if (!token) {
  //       console.log('No token found, logging out');
  //       handleLogout();
  //       return;
  //     }

  //     // Decode and verify token
  //     const decodedToken = JSON.parse(atob(token));
  //     console.log('Decoded token:', decodedToken);
      
  //     // Verify token expiration
  //     const tokenAge = new Date().getTime() - decodedToken.timestamp;
  //     if (tokenAge > 86400000) { // 24 hours
  //       console.log('Token expired');
  //       handleLogout();
  //       return;
  //     }

  //     // Verify user type and level
  //     const storedUserId = retrieveData("user_id");
  //     const storedUserLevel = retrieveData("user_level");
      
  //     if (decodedToken.userId !== storedUserId || 
  //         decodedToken.userLevel !== storedUserLevel) {
  //       console.log('User data mismatch', {
  //         tokenUserId: decodedToken.userId,
  //         storedUserId,
  //         tokenLevel: decodedToken.userLevel,
  //         storedLevel: storedUserLevel
  //       });
  //       handleLogout();
  //       return;
  //     }

  //     // If we're on the wrong dashboard, redirect
  //     if (decodedToken.type !== 'candidate') {
  //       console.log('Wrong dashboard type:', decodedToken.type);
  //       switch (decodedToken.type) {
  //         case 'admin':
  //           router.push("/admin/dashboard");
  //           break;
  //         case 'supervisor':
  //           router.push("/supervisorDashboard");
  //           break;
  //       }
  //       return;
  //     }

  //     console.log('Authentication successful');
      
  //   } catch (error) {
  //     console.error('Authentication error:', error);
  //     handleLogout();
  //   }
  // }, []);

  const handleLogout = () => {
    // console.log('Executing logout');
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=;max-age=0;path=/;secure;samesite=Strict`;
    });
    router.push("/");
  };

  useEffect(() => {
    // Debug: Log all cookies
    // console.log('All Cookies:', document.cookie);
    
    const token = retrieveDataFromCookie("auth_token");
    // console.log('Retrieved token:', token);

    if (!token) {
      // console.log('No token found, logging out');
      handleLogout();
      return;
    }

    try {
      // Decode and verify token
      const decodedToken = JSON.parse(atob(token));
      // console.log('Decoded token:', decodedToken);
      
      const tokenTimestamp = decodedToken.timestamp;
      const currentTime = new Date().getTime();
      const tokenAge = currentTime - tokenTimestamp;
      // console.log('Token age (ms):', tokenAge);
      
      // Check if token is expired (24 hours = 86400000 milliseconds)
      if (tokenAge > 86400000) {
        // console.log('Token expired');
        handleLogout();
        return;
      }

      // Verify user level matches
      const storedUserLevel = retrieveData("user_level");
      // console.log('Stored user level:', storedUserLevel);
      // console.log('Token user level:', decodedToken.userLevel);
      
      if (decodedToken.userLevel !== storedUserLevel) {
        // console.log('User level mismatch');
        handleLogout();
        return;
      }

    } catch (error) {
      console.error('Token validation failed:', error);
      handleLogout();
      return;
    }

    // Token is valid, continue with normal flow
    const encodedToken = retrieveDataFromCookie("auth_token");
    const tokenData = encodedToken ? JSON.parse(atob(encodedToken)) : null;
    const userLevel = tokenData?.userLevel;
    const userName = retrieveDataFromCookie("first_name");
    // const userId = retrieveData("user_id");
    // const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    // const token = retrieveDataFromCookie("auth_token");
    // const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    // const userLevel = retrieveDataFromCookie("auth_token");

    if (!token) {
      sessionStorage.clear();

      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=;max-age=0;path=/;secure;samesite=Strict`;
      });

      router.push("/");
      return;
    }

    switch (userLevel) {
      case "100.0":
        router.replace("/admin/dashboard");
        break;
      case "2":
        router.replace("/superAdminDashboard");
        break;
      case "supervisor":
        router.replace("/supervisorDashboard");
        break;
      case "1.0":
        router.replace("/candidatesDashboard");
        break;
      default:
        // console.log("Unexpected user level, redirecting to landing area.");
        router.replace("/");
    }

    const firstName = retrieveDataFromCookie("first_name");
    // const lastName = retrieveData("last_name");
    setUserName(`${firstName}`);
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const logoutChannel = new BroadcastChannel('logout_channel');
      
      logoutChannel.onmessage = (event) => {
        if (event.data === 'LOGOUT') {
          // Clear sessionStorage
          sessionStorage.clear();
          // Redirect to login
          router.push("/");
        }
      };

      return () => {
        logoutChannel.close();
      };
    }
  }, [router]);

  const fetchJobOffer = async (jobMId) => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const candId = retrieveData("user_id");
      // const appId = localStorage.getItem("app_id");

      const data = {
        cand_id: candId,
        jobM_id: jobMId,
      };

      console.log("jobMId", jobMId);
      const formData = new FormData();
      formData.append("operation", "getJobOffer");
      formData.append("json", JSON.stringify(data));

      console.log("formData", data);

      const response = await axios.post(url, formData);

      console.log("Job offer response:", response.data);

      if (response.data.error) {
        console.error(response.data.error);
      } else {
        const jobOffer = response.data[0];
        setJobOfferDetails(jobOffer);
        setIsJobOfferModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching job offer:", error);
    }
  };

  const openExamModal = (
    jobMId,
    jobTitle,
    jobAppId,
    jobPercentage,
    jobPassingPoints
  ) => {
    setSelectedJobMId(jobMId);
    setSelectedJobTitle(jobTitle);
    setSelectedJobPercentage(jobPercentage);
    setIsExamModalOpen(true);
    setSelectedJobPassingPoints(jobPassingPoints);
    // storeData("jobMId", jobMId);
    storeData("app_id", jobAppId);
    // storeData("pass_percentage", jobPassingPoints);
  };

  const closeExamModal = () => {
    setIsExamModalOpen(false);
    setSelectedJobMId(null);
  };

  // Function to open job offer modal
  const openJobOfferModal = (appId, jobMId) => {
    // console.log("Opening job offer modal for app ID:", appId);
    // console.log("jobMId", jobMId);
    setAppId(appId);
    fetchJobOffer(jobMId);
  };

  const openCancelJobAppliedModal = (appId, jobMId, jobTitle) => {
    setJobAppId(appId);
    setJobMId(jobMId);
    setJobTitle(jobTitle);
    // setJobToCancel({ jobMId, jobTitle });
    setShowCancelModal(true);

    // storeData("appId", appId);
    // storeData("jobMId", jobMId);
    // console.log("jobToCancel", appId, jobMId, jobTitle);
  };

  async function fetchAppliedJobs() {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const personalInfoId = retrieveData("user_id");
      // console.log("cand ID:", personalInfoId);

      if (!personalInfoId) {
        // console.error("No cand_id found in localStorage.");
        return;
      }

      const formData = new FormData();
      formData.append("operation", "getAppliedJobs");
      formData.append("json", JSON.stringify({ cand_id: personalInfoId }));

      const response = await axios.post(url, formData);

      if (response.data.error) {
        console.error(response.data.error);
      } else {
        setAppliedJobs(response.data);
        console.log("Applied jobs:", response.data);
        // const passingpoints = response.data.passing_points;
        // localStorage.setItem("passing", passingpoints);
        // localStorage.setItem("app_id", response.data[0].app_id);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  }

  const fetchExamResult = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const candId = retrieveData("user_id");

      const formData = new FormData();
      formData.append("operation", "fetchExamResult");
      formData.append("json", JSON.stringify({ cand_id: candId }));
      const examResultsResponse = await axios.post(url, formData);

      console.log("exam result", examResultsResponse.data);

      setExamResults(examResultsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
    fetchExamResult();
  }, []);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    if (!isNotificationDropdownOpen) {
      markNotificationsAsRead();
    }
  };

  const handleClickOutsideUsername = (event) => {
    if (
      dropdownUsernameRef.current &&
      !dropdownUsernameRef.current.contains(event.target)
    ) {
      setIsUserDropdownOpen(false);
    }
  };

  const handleClickOutsideNotification = (event) => {
    if (
      dropdownNotificationRef.current &&
      !dropdownNotificationRef.current.contains(event.target)
    ) {
      setIsNotificationDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideUsername);
    document.addEventListener("mousedown", handleClickOutsideNotification);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUsername);
      document.removeEventListener("mousedown", handleClickOutsideNotification);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div
      className={`flex min-h-screen flex-col md:flex-row ${
        isDarkMode ? "bg-[#1C1919] text-white" : "bg-[#F4F7FC] text-gray-900"
      }`}
    >
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-[#0A6338] dark:bg-[#0A6338]`}
      >
        <img
          src="/assets/images/delMontes.png"
          alt="Del Monte Logo"
          className="h-10 w-auto"
        />

        <button
          className="text-white focus:outline-none"
          onClick={(e) => {
            e.stopPropagation(); 
            setIsMenuOpen(!isMenuOpen); 
          }}
        >
          {isMenuOpen ? (
            <MdClose className="w-8 h-8" />
          ) : (
            <TbMenuDeep className="w-8 h-8" />
          )}{" "}
        </button>
      </div>
      <Sidebar
        userName={userName}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        appliedJobs={appliedJobs}
        handleLogout={handleLogout}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        ref={sidebarRef}
        handleViewProfileClick={handleViewProfileClick}
        openExamModal={openExamModal}
      />
      {/* Main Content */}
      <div
        className={`flex-1 p-8 ${
          isDarkMode ? "bg-[#101010] text-white" : "bg-[#F4F7FC] text-gray-900"
        } overflow-y-auto scrollbar-custom md:mt-0 md:ml-72 mt-16`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-2xl md:text-4xl font-semibold slide-up ${
              isDarkMode ? "text-[#188C54]" : "text-[#0A6338]"
            }`}
          >
            Active Jobs
          </h1>

          <div className="flex items-center">
            <div ref={dropdownNotificationRef} className="relative">
              <button
                onClick={() => {
                  toggleNotificationDropdown();
                }}
                className={`text-2xl md:text-3xl mr-6 slide-up ${
                  isDarkMode ? "text-[#93B1A6]" : "text-[#0A6338]"
                }`}
              >
                <FontAwesomeIcon
                  icon={isNotificationDropdownOpen ? faBell : faBellRegular}
                />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
              {isNotificationDropdownOpen && (
                <div className={`absolute mt-2 w-96 right-5 z-10 ${isDarkMode ? 'bg-[#101010]' : 'bg-white'} rounded-lg shadow-lg transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-2`}>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${isDarkMode ? 'text-[#188C54]' : 'text-[#188C54]'}`}>
                          {/* Updated Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-full h-full"
                          >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-[#188C54]' : 'text-[#0A6338]'}`}>
                            Notifications
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-[#93B1A6]' : 'text-[#0A6338]'}`}>Earlier Today</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleNotificationDropdown}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[600px] overflow-y-auto scrollbar-custom">
                    <div className="p-4 space-y-4">
                      {notification.length > 0 ? (
                        notification.map((result, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              if (result.status_name.toLowerCase() === "exam") {
                                const examId = examResults.find(
                                  (exam) => exam.jobM_id === result.jobM_id
                                );
                                if (examId) {
                                  toast.error(
                                    `You already took an exam for ${result.jobM_title}`
                                  );
                                } else {
                                  openExamModal(
                                    result.jobM_id,
                                    result.jobM_title,
                                    result.app_id,
                                    result.jobM_passpercentage
                                  );
                                }
                              } else if (
                                result.status_name.toLowerCase() === "job offer"
                              ) {
                                const jobOfferResponse = appliedJobs.find(
                                  (job) =>
                                    job.jobM_id === result.jobM_id &&
                                    (job.status_name.toLowerCase() ===
                                      "accept" ||
                                      job.status_name.toLowerCase() ===
                                        "decline")
                                );
                                if (jobOfferResponse) {
                                  toast.error(
                                    `You have already responded to the job offer for ${result.jobM_title}`
                                  );
                                } else {
                                  openJobOfferModal(
                                    result.app_id,
                                    result.jobM_id
                                  );
                                }
                              } else if (
                                result.status_name.toLowerCase() === "pending"
                              ) {
                                openCancelJobAppliedModal(
                                  result.app_id,
                                  result.jobM_id,
                                  result.jobM_title
                                );
                              }
                            }}
                            className={`group relative rounded-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer
                            ${
                              isDarkMode
                                ? "bg-[#1F2937] text-green-200"
                                : "bg-[#0A6338] text-white"
                            } hover:shadow-lg`}
                          >
                            <div className="p-4 space-y-3 shadow-sm hover:shadow-md">
                              {/* Header with Logo and Date */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-white p-1 flex items-center justify-center shadow-sm">
                                    <img
                                      src="/assets/images/delMontes.png"
                                      alt="Del Monte Logo"
                                      className="h-8 w-auto object-contain"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="text-xl font-semibold text-white">
                                      {result.jobM_title}
                                    </h4>
                                    <span className="inline-block px-2 py-1 text-xs bg-white/20 rounded-full mt-1">
                                      {result.status_name}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs opacity-80">
                                  {result.notification_date}
                                </span>
                              </div>

                              {/* Notification Message */}
                              <p className="text-sm leading-relaxed opacity-90">
                                {result.notification_message}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py- 8 text-gray-500">
                          <div className="w-12 h-12 mb-3 text-gray-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                          </div>
                          <p className="text-base font-medium">
                            No notifications yet
                          </p>
                          <p className="text-sm text-gray-400">
                            We'll notify you when something arrives
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={dropdownUsernameRef}>
              <button
                onClick={toggleUserDropdown}
                className={`text-2xl font-bold items-center hidden md:flex ${
                  isDarkMode
                    ? "text-[#93B1A6] hover:text-green-300"
                    : "text-[#0A6338] hover:text-green-600"
                }`}
              >
                <div
                  className={`flex items-center p-2 rounded-full
                            ${isDarkMode ? "bg-[#0A6338]" : "bg-gray-300"}
                            ${isDarkMode ? "text-[#93B1A6]" : "text-black"}
                            shadow-md`}
                >
                  <FontAwesomeIcon
                    icon={faUserRegular}
                    className="text-2xl slide-up"
                  />
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="ml-2 text-xs"
                  />
                </div>
              </button>
              {isUserDropdownOpen && (
                <div
                  className={`absolute right-8 mt-2 w-64 rounded-lg shadow-xl z-10
                ${
                  isDarkMode
                    ? "bg-[#0A6338] text-white "
                    : "bg-gray-300 text-black"
                }`}
                >
                  <div className="p-4">
                    <div className="mb-4">
                      <p
                        className={`text-lg mb-4 font-semibold ${
                          isDarkMode ? "text-gray-200" : "text-black"
                        }`}
                      >
                        {userName}
                      </p>
                      <hr
                        className={`my-2 ${
                          isDarkMode ? "border-white" : "border-gray-400"
                        }`}
                      />
                    </div>

                    <button
                      className={`w-full mt-5 text-left py-2 text-sm flex items-center rounded-lg
                  ${
                    isDarkMode
                      ? "hover:bg-[#5C8374] text-gray-200"
                      : "hover:bg-gray-200 text-black"
                  }`}
                      onClick={() => handleViewProfileClick(userId)}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      View Profile
                    </button>

                    <button
                      onClick={toggleTheme}
                      className={`w-full text-left py-2 text-sm flex items-center rounded-lg mt-2 ${
                        isDarkMode
                          ? "text-gray-200 hover:bg-[#5C8374]"
                          : "text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={isDarkMode ? faSun : faMoon}
                        className="mr-2"
                      />
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                      }}
                      className={`w-full text-left py-2 text-sm flex items-center mt-2 rounded-lg
                    ${
                      isDarkMode
                        ? "hover:bg-[#5C8374] text-gray-200"
                        : "hover:bg-gray-200 text-black"
                    }`}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="fixed inset-0 bg-[#01472B] bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <l-tail-chase
                size="40"
                speed="1.75"
                color="#0B864A"
              ></l-tail-chase>
              <p className="text-white text-xl font-semibold mt-4">Loading...</p>
              <p className="text-green-300 mt-2">Please wait while we load your dashboard</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No jobs available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-800"
                }`}
              >
                <div
                  className={`p-4 h-20 flex items-center justify-start ${
                    isDarkMode ? "bg-[#188C54]" : "bg-[#188C54]"
                  }`}
                >
                  <h3 className="text-xl font-semibold text-white truncate">
                    {job.jobM_title}
                  </h3>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-2 text-sm mt-4">
                    <UserGroupIcon className="w-5 h-5 text-gray-400" />
                    <span>{job.Total_Applied} Applicants</span>
                    {job.Is_Applied !== 0 && (
                      <span className="flex items-center">
                        {(() => {
                          const jobApplications = appliedJobs.filter(aj => aj.jobM_id === job.jobM_id);
                          const hasFailed = jobApplications.some(aj => aj.status_name === "Failed Exam");
                          const hasCancelled = jobApplications.some(aj => aj.status_name === "Cancelled");
                          const hasDeclinedOffer = jobApplications.some(aj => aj.status_name === "Decline Offer");
                          const isEmployed = jobApplications.some(aj => aj.status_name === "Employed");
                          const hasActiveStatus = jobApplications.some(aj => 
                            ["Pending", "Processed", "Exam", "Interview"].includes(aj.status_name)
                          );
                          
                          if ((hasCancelled || hasDeclinedOffer) && hasActiveStatus) {
                            return (
                              <>
                                <CheckCircleIcon className="w-5 h-5 mr-1 text-blue-500" />
                                Reapplied
                              </>
                            );
                          } else if (isEmployed) {
                            return (
                              <>
                                <UserIcon className="w-5 h-5 mr-1 text-blue-600" />
                                Employed
                              </>
                            );
                          } else if (hasDeclinedOffer) {
                            return (
                              <>
                                <XCircleIcon className="w-5 h-5 mr-1 text-red-500" />
                                Decline Offer
                              </>
                            );
                          } else if (hasCancelled) {
                            return (
                              <>
                                <XCircleIcon className="w-5 h-5 mr-1 text-red-500" />
                                Cancelled
                              </>
                            );
                          } else if (hasFailed) {
                            return (
                              <>
                                <XCircleIcon className="w-5 h-5 mr-1 text-red-500" />
                                Failed Exam
                              </>
                            );
                          } else {
                            return (
                              <>
                                <CheckCircleIcon className="w-5 h-5 mr-1 text-green-500" />
                                Applied
                              </>
                            );
                          }
                        })()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-sm mb-5">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <span>{job.jobM_createdAt}</span>
                  </div>
                  <div className="mb-5"></div>

                  <button
                    onClick={() => handleDetailsClick(job)}
                    className={`w-full px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-[#188C54] hover:bg-green-600 text-white"
                        : "bg-[#188C54] hover:bg-green-600 text-white"
                    }`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <JobDetailsModal
          job={selectedJob}
          fetchJobs={fetchJobs}
          onClosedd={() => {
            setIsModalOpen(false);
            removeData("jobId");
          }}
        />
      )}
      {isProfileModalOpen && (
        <ViewProfile
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          candId={selectedCandidateId}
        />
      )}
      {isExamModalOpen && (
        <ExamModal jobMId={selectedJobMId} onClose={closeExamModal} />
      )}

      {isExamModalOpen && (
        <ExamModal
          jobMId={selectedJobMId}
          jobTitle={selectedJobTitle}
          jobPercentage={selectedJobPercentage}
          jobPassingPoints={selectedJobPassingPoints}
          // fetchAppliedJobs={fetchAppliedJobs}
          // fetchExamResult={fetchExamResult}
          startTimer={isExamModalOpen}
          onClose={() => {
            closeExamModal();
            removeData("app_id");
          }}
        />
      )}
      {isJobOfferModalOpen && (
        <JobOfferModal
          jobOfferDetails={jobOfferDetails}
          fetchJobOffer={fetchJobOffer}
          // fetchAppliedJobs={fetchAppliedJobs}
          appId={appId}
          onClose={() => {
            setIsJobOfferModalOpen(false);
            setAppId(null);
          }}
        />
      )}
      {showCancelModal && (
        <CancelJobModal
          // jobTitle={jobToCancel.jobTitle}
          jobAppId={jobAppId}
          jobTitle={jobTitle}
          jobMId={jobMId}
          onCancel={showCancelModal}
          // fetchAppliedJobs={fetchAppliedJobs}
          onClose={() => setShowCancelModal(false)}
        />
      )}
      <Toaster position="bottom-left" />
    </div>
  );
}
