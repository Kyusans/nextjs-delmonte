"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storeData, retrieveData } from "../utils/storageUtils";

import {
  faChevronDown,
  faMoon,
  faSun,
  faSignOutAlt,
  faInfoCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser as faUserRegular } from "@fortawesome/free-regular-svg-icons";
import Sidebar from "./sideBar/sideBar";
import secureLocalStorage from "react-secure-storage";
import JobDetailsModal from "./modal/jobDetails";
import ViewProfile from "./modal/viewProfile";
import ExamModal from "./exam/exam";

export default function DashboardCandidates() {
  const [jobs, setJobs] = useState([]);
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

  const [isOpen, setIsOpen] = useState(false);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [selectedJobMId, setSelectedJobMId] = useState(null);

  const openExamModal = (jobMId) => {
    setSelectedJobMId(jobMId); // Set the selected jobM_id
    setIsExamModalOpen(true); // Open the exam modal
  };

  const closeExamModal = () => {
    setIsExamModalOpen(false); // Close the exam modal
    setSelectedJobMId(null); // Clear the selected jobM_id
  };

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

  useEffect(() => {
    const userLevel = retrieveData("user_level");
    const userName = retrieveData("first_name");
    const userId = retrieveData("user_id");
    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

    if (!userLevel || !userName || !userId || !url) {
      sessionStorage.clear();

      router.push("/");
      return;
    }

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
        console.log("Unexpected user level, redirecting to landing area.");
        router.push("/");
    }

    const firstName = retrieveData("first_name");
    const lastName = retrieveData("last_name");
    setUserName(`${firstName}`);

    async function fetchJobs() {
      try {
        // console.log("Fetching jobs...");
        const formData = new FormData();
        formData.append("operation", "getActiveJob");
        const response = await axios.post(url, formData);

        // console.log("Response:", response);
        // console.log("Response data:", response.data);

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

    fetchJobs();
  }, [router]);

  const handleLogout = () => {
    console.log("Logging out...");

    sessionStorage.clear();

    toast.success("Logged out successfully!");

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

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

  const dropdownUsernameRef = useRef(null);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleClickOutsideUsername = (event) => {
    if (
      dropdownUsernameRef.current &&
      !dropdownUsernameRef.current.contains(event.target)
    ) {
      setIsUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideUsername);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUsername);
    };
  }, []);

  return (
    <div
      className={`flex min-h-screen flex-col md:flex-row ${
        isDarkMode ? "bg-[#1C1919] text-white" : "bg-[#F4F7FC] text-gray-900"
      }`}
    >
      <div
        className={`md:hidden flex items-center justify-between p-4  ${
          isDarkMode ? "bg-[#183D3D]" : "bg-[#0A6338]"
        }`}
      >
        <img
          src="/assets/images/delMontes.png"
          alt="Del Monte Logo"
          className="h-10 w-auto slide-up"
        />
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
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
        } overflow-y-auto scrollbar-custom  md:mt-0 md:ml-72`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-4xl font-semibold slide-up ${
              isDarkMode ? "text-[#93B1A6]" : "text-[#0A6338]"
            }`}
          >
            Active Jobs
          </h1>

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
                {/* <span className="ml-2">{userName}</span> */}
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

                  {/* View Details Button */}
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

                  {/* Dark/Light Mode Toggle Button */}
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

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      console.log("Logout button clicked");
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 slide-up">
          {loading ? (
            <p className="text-white">Loading jobs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div
                key={index}
                className={`rounded-lg shadow-2xl overflow-hidden h-64 flex flex-col ${
                  isDarkMode
                    ? "bg-gray-500 text-gray-200"
                    : "bg-white text-gray-800"
                }`}
              >
                <div
                  className={`p-4 h-20 flex items-center justify-start ${
                    isDarkMode
                      ? "bg-[#188C54] text-[#FFFFFF]"
                      : "bg-[#0A6338] text-white"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{job.jobM_title}</h3>
                </div>

                <div
                  className={`flex-1 p-4 flex flex-col justify-between ${
                    isDarkMode ? "bg-[#1D1D1D]" : "bg-white"
                  }`}
                >
                  <div>
                    <p
                      className={`mb-4 ${
                        isDarkMode ? "text-gray-200" : "text-gray-600"
                      }`}
                    >
                      {job.Total_Applied} Applicants{" "}
                      <span className="text-green-500">•</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleDetailsClick(job)}
                      className={`px-4 py-2 rounded-md relative transition-transform duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 ${
                        isDarkMode
                          ? "bg-[#188C54] text-white hover:bg-green-800"
                          : "bg-[#0A6338] text-white"
                      }`}
                      style={{
                        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      Details
                    </button>

                    <span
                      className={`px-3 py-1 rounded-full text-sm  ${
                        isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {job.jobM_createdAt}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No jobs available</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <ViewProfile
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        candId={selectedCandidateId}
      />

      {isExamModalOpen && (
        <ExamModal jobMId={selectedJobMId} onClose={closeExamModal} />
      )}

      <ToastContainer />
    </div>
  );
}
