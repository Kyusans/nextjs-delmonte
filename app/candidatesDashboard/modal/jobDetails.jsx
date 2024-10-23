"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { removeData, retrieveData } from "@/app/utils/storageUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

// import { fetchAppliedJobs } from "../sideBar/sideBar.jsx";

// import { fetchJobs } from "./candidatesDashboard/page.js";

const JobDetailsModal = ({ job, onClose }) => {
  const router = useRouter();
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    async function fetchJobs() {
      try {
        const formData = new FormData();
        formData.append("operation", "getActiveJob");
        const response = await axios.post(url, formData);

        // console.log("Response:", response);
        // console.log("Response data:", response.data);

        if (Array.isArray(response.data)) {
          // console.log("Setting jobs:", response.data);
          setJobs(response.data);
        } else if (response.data.error) {
          // console.error("Server error:", response.data.error);
          setError("Error fetching jobs: " + response.data.error);
        } else {
          // console.error("Invalid data format:", response.data);
          setError("Unexpected data format received from server.");
        }
      } catch (error) {
        setError("Error fetching jobs");
      } finally {
        setLoading(false);
      }
    }

    async function fetchProfile() {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

        const cand_id = retrieveData("user_id");

        const jsonData = { cand_id: cand_id };

        const formData = new FormData();
        formData.append("operation", "getCandidateProfile");
        formData.append("json", JSON.stringify(jsonData));

        const response = await axios.post(url, formData);
        ("");
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    fetchJobs();
    fetchProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
      // removeData("jobId");
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleApply = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (
      profile.candidateInformation.length === 0 ||
      profile.skills.length === 0 ||
      profile.employmentHistory.length === 0 ||
      profile.educationalBackground.length === 0 ||
      profile.knowledge.length === 0 ||
      profile.training.length === 0 ||
      profile.license.length === 0 ||
      profile.resume.length === 0
    ) {
      toast.error(
        "Please complete your profile information before applying to this job."
      );
      return;
    }

    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const user_id = retrieveData("user_id");
      const jobId = retrieveData("jobId");

      // console.log("user_id:", user_id, "jobId:", jobId);

      const formData = new FormData();
      formData.append("operation", "applyForJob");
      formData.append("user_id", user_id);
      formData.append("jobId", jobId);

      const response = await axios.post(url, formData);

      console.log(response);

      if (response.data.success) {
        setSuccess("You have successfully applied for the job!");

        // fetchAppliedJobs();

        // fetchJobs();
        // removeData("jobId");

        removeData("jobId");
        onClose();

        // window.location.reload();
        // revalidatePath("/candidatesDashboard");
        toast.success("Applied successfully!");
      } else if (response.data.status === "duplicate") {
        toast.warning(response.data.message);
        // removeData("jobId");
      } else {
        throw new Error(response.data.error || "Failed to apply for the job.");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
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

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // useEffect(() => {
  //   const theme = isDarkMode ? "dark" : "light";
  //   localStorage.setItem("theme", theme);
  //   document.body.className = theme;
  //   console.log("Setting theme:", theme);
  // }, [isDarkMode]);

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

  if (!job) return null;

  const dutiesArray = job.duties_text ? job.duties_text.split("|") : [];
  const educationArray = job.course_categoryName
    ? job.course_categoryName.split("|").join(", ")
    : [];
  const workResponsibilitiesArray = job.jwork_responsibilities
    ? job.jwork_responsibilities
        .split("|")
        .map((responsibility) => responsibility.trim())
    : [];

  const workDurationsArray = job.jwork_duration
    ? job.jwork_duration.split("|").map((duration) => duration.trim())
    : [];

  const workDetailsArray = workResponsibilitiesArray.map(
    (responsibility, index) => ({
      responsibility: responsibility || "",
      duration: workDurationsArray[index] || "",
    })
  );

  // const knowledgeArray = job.jknow_text ? job.jknow_text.split("|") : [];
  const knowledgeArray = job.knowledge_name
    ? job.knowledge_name.split("|").join(", ") // Join knowledge items with a comma
    : [];

  const skillsArray = job.jskills_text ? job.jskills_text.split("|") : [];
  const trainingArray = job.perT_name
    ? job.perT_name.split("|").join(", ")
    : [];

  const licenseArray = job.license_master_name
    ? job.license_master_name.split("|").join(", ")
    : [];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isDarkMode ? "bg-black bg-opacity-80" : "bg-black bg-opacity-50"
      }`}
    >
      <div
        ref={modalRef}
        className={`relative p-6 rounded-lg max-w-4xl w-full ${
          isDarkMode ? "bg-[#1D1D1D] text-gray-200" : "bg-white text-black"
        }`}
      >
        <div
          className={`sticky top-0 left-0 right-0 ${
            isDarkMode ? "bg-[#1D1D1D]" : "bg-white"
          } z-10 pb-4 border-b ${
            isDarkMode
              ? "border-gray-700 text-gray-200"
              : "border-gray-200 text-[#0A6338]"
          } text-center`}
        >
          <h2 className="text-xl font-bold mb-4">{job.jobM_title}</h2>
        </div>

        <div
          className={`overflow-y-auto scrollbar-custom ${
            isDarkMode ? "scrollbar-thumb-gray-600" : "scrollbar-thumb-gray-300"
          }`}
          style={{ paddingBottom: "6rem", maxHeight: "70vh" }}
        >
          <h2 className="text-lg font-bold mb-4">Job Description:</h2>
          <p className="mb-8">{job.jobM_description}</p>

          {dutiesArray.length > 0 && (
            <>
              <h2 className="text-lg font-bold mb-4">
                Duties and Responsibilities:
              </h2>
              <ul className="list-disc pl-5 mb-8">
                {dutiesArray.map((duty, index) => (
                  <li key={index} className="mb-2">
                    {duty}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div>
            <h2 className="text-lg font-bold mb-4">Qualifications:</h2>

            {educationArray.length > 0 && (
              <>
                {/* <h3 className="text-md font-semibold mb-2">Education:</h3> */}
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">
                    Graduate of any {educationArray} courses.
                  </li>
                </ul>
              </>
            )}

            {licenseArray.length > 0 && (
              <>
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">
                    Having a {licenseArray} is considered an advantage.
                  </li>
                </ul>
              </>
            )}

            {trainingArray.length > 0 && (
              <>
                {/* <h3 className="text-md font-semibold mb-2">Training:</h3> */}
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">With training in {trainingArray} </li>
                </ul>
              </>
            )}

            <div className="job-details">
              {workDetailsArray.length > 0 && (
                <>
                  {/* <h3 className="text-md font-semibold mb-2">
                    Work Experience:
                  </h3> */}
                  <ul className="list-disc pl-5">
                    {workDetailsArray.map((detail, index) => (
                      <li key={index} className="mb-2">
                        <p>
                          atleast {detail.duration} years,{" "}
                          {detail.responsibility}
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {knowledgeArray.length > 0 && (
              <>
                {/* <h3 className="text-md font-semibold mb-2">Knowledge:</h3> */}
                <ul className="list-disc pl-5 mb-4 mt-4">
                  <li className="mb-2">Knowledge in {knowledgeArray} </li>
                </ul>
              </>
            )}

            {skillsArray.length > 0 && (
              <>
                {/* <h3 className="text-md font-semibold mb-2">Skills:</h3> */}
                <ul className="list-disc pl-5 mb-4">
                  {skillsArray.map((skill, index) => (
                    <li key={index} className="mb-2 mt-4">
                      {skill}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 p-4 ${
            isDarkMode
              ? "bg-[#1D1D1D] border-gray-700"
              : "bg-white border-gray-200"
          } flex justify-between`}
        >
          <button
            onClick={handleApply}
            className={`px-4 py-2 rounded-md relative transition-transform duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 ${
              isDarkMode
                ? "bg-green-600 text-white"
                : "bg-green-700 hover:bg-[#0A6338] text-white"
            }`}
            style={{
              boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            Apply
          </button>

          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md relative transition-transform duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 ${
              isDarkMode ? "bg-gray-600 text-white" : "bg-gray-500 text-white"
            }`}
            style={{
              boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
