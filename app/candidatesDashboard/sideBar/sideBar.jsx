import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faSignOutAlt,
  faInfoCircle,
  faSun,
  faMoon,
  faUser,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faUserTie,
  faPencilRuler,
  faUserTimes,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

import ViewProfile from "../modal/viewProfile";

import {
  faUser as faUserRegular,
  faCheckCircle as faCheckCircleRegular,
} from "@fortawesome/free-regular-svg-icons";

import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { storeData, retrieveData } from "../../utils/storageUtils"; // Import the utility functions
import { FaUserTie, FaUserTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ExamModal from "../exam/exam";
import JobOfferModal from "../modal/jobOffer";

// Import useNavigate

const Sidebar = ({
  userName,
  isDarkMode,
  setIsDarkMode,
  handleLogout,
  isMenuOpen,
  setIsMenuOpen,
  handleViewProfileClick,
}) => {
  const router = useRouter();
  const sidebarRef = useRef(null);
  const dropdownUsernameRef = useRef(null);
  const dropdownRef = useRef(null);

  //   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [appliedJobs, setAppliedJobs] = useState([]);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [selectedJobMId, setSelectedJobMId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [selectedJobPercentage, setSelectedJobPercentage] = useState(null);

  const [examResults, setExamResults] = useState([]); // State to hold exam results

  const [isJobOfferModalOpen, setIsJobOfferModalOpen] = useState(false);
  const [jobOfferDetails, setJobOfferDetails] = useState(null); // State to hold job offer details

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutsideUsername = (event) => {
    if (
      dropdownUsernameRef.current &&
      !dropdownUsernameRef.current.contains(event.target)
    ) {
      setIsUserDropdownOpen(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setIsUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideUsername);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideUsername);
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
      formData.append("cand_id", personalInfoId);

      const response = await axios.post(url, formData);

      if (response.data.error) {
        console.error(response.data.error);
      } else {
        setAppliedJobs(response.data);
        console.log("Applied jobs:", response.data);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  }
  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const userId = retrieveData("user_id");

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <FontAwesomeIcon
            icon={faClock}
            className="text-yellow-500 animate-pulse"
          />
        );
      case "approved":
        return (
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
        );
      case "rejected":
        return (
          <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
        );
      case "interview":
        return <FontAwesomeIcon icon={faUserTie} className="text-blue-400" />;
      case "exam":
        return (
          <FontAwesomeIcon icon={faPencilRuler} className="text-blue-400" />
        );
      case "background check":
        return (
          <FontAwesomeIcon icon={faUserCheck} className="text-yellow-500" />
        );
      case "job offer":
        return (
          <FontAwesomeIcon icon={faUserCheck} className="text-green-500" />
        );
      default:
        return (
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-gray-300 animate-spin"
          />
        );
    }
  };

  const openExamModal = (jobMId, jobTitle, jobAppId, jobPercentage) => {
    setSelectedJobMId(jobMId);
    setSelectedJobTitle(jobTitle);
    setSelectedJobPercentage(jobPercentage);
    setIsExamModalOpen(true);
    storeData("jobMId", jobMId);
    storeData("app_id", jobAppId);
  };

  const closeExamModal = () => {
    setIsExamModalOpen(false); // Close the exam modal
    setSelectedJobMId(null); // Clear the selected jobM_id
  };

  const fetchExamResults = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const candId = retrieveData("user_id");

      const formData = new FormData();
      formData.append("operation", "fetchExamResult");
      formData.append("json", JSON.stringify({ cand_id: candId }));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error) {
        console.error(response.data.error);
      } else {
        setExamResults(response.data);
      }
    } catch (error) {
      console.error("Error fetching exam results:", error);
    }
  };

  // Call fetchExamResults when the component mounts or when needed
  useEffect(() => {
    fetchExamResults();
  }, [userId]);

  // Function to fetch job offer details
  const fetchJobOffer = async (appId) => {
    // Accept appId as a parameter
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const candId = retrieveData("user_id");

      const formData = new FormData();
      formData.append("operation", "getJobOffer");
      formData.append(
        "json",
        JSON.stringify({ cand_id: candId, app_id: appId })
      ); // Include appId in the request

      const response = await axios.post(url, formData);

      console.log("Job offer response:", response.data);

      if (response.data.error) {
        console.error(response.data.error);
      } else {
        // Extract the first job offer from the response array
        const jobOffer = response.data[0]; // Assuming the response is an array
        setJobOfferDetails(jobOffer);
        setIsJobOfferModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching job offer:", error);
    }
  };

  // ... existing code ...

  // ... existing code ...

  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full p-5 rounded-r-lg flex flex-col transform transition-transform duration-300 ease-in-out z-20
      ${isMenuOpen ? "translate-x-0 w-60" : "-translate-x-full w-72"}
      ${isDarkMode ? "bg-[#0A6338]" : "bg-[#0A6338]"}
      md:w-72 md:translate-x-0`}
      >
        <div
          className="relative inline-block text-left"
          ref={dropdownUsernameRef}
        >
          <div className="flex justify-center items-center mt-2 ">
            <img
              src="/assets/images/delMontes.png"
              alt="Del Monte Logo"
              className="hidden md:flex h-[120px]"
            />
          </div>
          <button
            onClick={toggleUserDropdown}
            className={`text-lg font-bold flex justify-start items-center md:hidden ${
              isDarkMode
                ? "text-[#93B1A6] hover:text-green-300"
                : "text-[#93B1A6] hover:text-green-600"
            }`}
          >
            <FontAwesomeIcon icon={faUserRegular} className="mr-2 text-2xl" />

            {userName}
            <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-sm" />
          </button>
          {isUserDropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-10
              ${
                isDarkMode
                  ? "bg-[#5C8374] text-white "
                  : "bg-gray-300 text-black"
              }`}
            >
              <div className="p-4">
                <button
                  className={`w-full mt-5 text-left py-2 text-sm flex items-center rounded-lg
                  ${
                    isDarkMode
                      ? "hover:bg-[#5C8374] text-gray-200"
                      : "hover:bg-gray-200 text-black"
                  }`}
                  onClick={() =>
                    handleViewProfileClick(retrieveData("user_id"))
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                  View Profile
                </button>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-full text-left py-2 text-sm flex items-center rounded-lg mt-2 ${
                    isDarkMode
                      ? "text-white"
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
                    console.log("Logout button clicked");
                    handleLogout();
                  }}
                  className={`w-full text-left py-2 text-sm flex items-center mt-2 rounded-lg
                ${isDarkMode ? "hover:bg-green-700" : "hover:bg-gray-200"}`}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto scrollbar-custom">
          <div className="mt-28 ">
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-[#43CD8A]" : "text-[#43CD8A]"
              } mb-4`}
            >
              LIST OF APPLIED JOBS
            </h3>
            {/* <div
          className={`pl-4 border-l-2 ${
            isDarkMode ? "border-green-500" : "border-[#43CD8A]"
          }`}
        > */}
            <div
              className={`max-h-72 overflow-y-auto scrollbar-custom ${
                isDarkMode
                  ? "scrollbar-thumb-green-500 scrollbar-track-green-300"
                  : "scrollbar-thumb-gray-400 scrollbar-track-gray-200"
              }`}
            >
              {appliedJobs.length > 0 ? (
                appliedJobs.slice(0, 5).map((job, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-4 rounded-lg shadow-md flex items-center justify-between text-[15px] cursor-pointer transition-all duration-300 ${
                      isDarkMode
                        ? "bg-[#1F2937] text-green-200 hover:bg-green-700"
                        : "bg-[#059e54] text-white hover:bg-green-600"
                    }`}
                    onClick={() => {
                      if (job.status_name.toLowerCase() === "exam") {
                        openExamModal(
                          job.jobM_id,
                          job.jobM_title,
                          job.app_id,
                          job.jobM_passpercentage
                        );
                      } else if (
                        job.status_name.toLowerCase() === "job offer"
                      ) {
                        fetchJobOffer(job.app_id); // Fetch job offer details
                      }
                    }}
                  >
                    <span className="flex items-center font-medium">
                      {job.jobM_title}
                    </span>
                    <span className="flex items-center">
                      {getStatusIcon(job.status_name)}
                      <span
                        className={`ml-2 text-sm ${
                          isDarkMode ? "text-green-400" : "text-gray-300"
                        } animate-pulse transition-opacity duration-800 ease-in-out`}
                      >
                        {job.status_name}
                      </span>
                    </span>
                  </div>
                ))
              ) : (
                <p
                  className={`p-4 rounded-lg shadow-md ${
                    isDarkMode
                      ? "bg-[#1F2937] text-green-300"
                      : "bg-white text-gray-500"
                  }`}
                >
                  No applied jobs found.
                </p>
              )}
            </div>
          </div>

          {/* Exam Modal */}
          <div className="mt-6">
            {/* Check if there are applied jobs with status "exam" */}
            {appliedJobs.some(
              (job) => job.status_name.toLowerCase() === "exam"
            ) && (
              <>
                <h3 className="text-xl font-semibold text-[#43CD8A] mb-4">
                  Exam Results
                </h3>
                {examResults.length > 0 ? (
                  examResults.map((result, index) => (
                    <div
                      key={index}
                      className={`mb-4 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${
                        isDarkMode
                          ? "bg-[#1F2937] text-green-200"
                          : "bg-[#059e54] text-white"
                      }`}
                    >
                      <h4 className="text-lg font-medium">
                        {result.jobM_title}
                      </h4>
                      <p className="text-sm">
                        Score:{" "}
                        <span className="font-semibold">
                          {result.examR_score}
                        </span>{" "}
                        /{" "}
                        <span className="font-semibold">
                          {result.examR_totalscore}
                        </span>
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          result.examR_status === "Passed"
                            ? "text-green-200"
                            : "text-red-500"
                        }`}
                      >
                        Status: {result.examR_status}
                      </p>
                    </div>
                  ))
                ) : (
                  <p
                    className={`p-4 rounded-lg shadow-md ${
                      isDarkMode
                        ? "bg-[#1F2937] text-green-300"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    No exam results found.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {isExamModalOpen && (
        <ExamModal
          jobMId={selectedJobMId}
          jobTitle={selectedJobTitle}
          jobPercentage={selectedJobPercentage}
          onClose={closeExamModal}
        />
      )}
      {isJobOfferModalOpen && (
        <JobOfferModal
          jobOfferDetails={jobOfferDetails}
          fetchJobOffer={fetchJobOffer}
          fetchAppliedJobs={fetchAppliedJobs}
          onClose={() => setIsJobOfferModalOpen(false)}
        />
      )}
    </>
    // </div>
  );
};

export default Sidebar;
