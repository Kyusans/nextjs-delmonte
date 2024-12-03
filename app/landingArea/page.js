"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import JobDetailsModal from "./modal/jobDetails";
import {
  storeData,
  retrieveData,
  retrieveDataFromCookie,
  retrieveDataFromSession,
} from "../utils/storageUtils";

export default function LandingArea() {
  const [job, setJob] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleDetailsClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const token = retrieveDataFromCookie("auth_token");
    
    if (token) {
      const userLevel = retrieveData("user_level");
      // Redirect to appropriate dashboard if already logged in
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
          console.error("Invalid user level:", userLevel);
          break;
      }
    }
  }, []);

  async function fetchJobs() {
    try {
      // console.log("Fetching jobs...");
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const formData = new FormData();
      formData.append("operation", "getActiveJobs");
      const response = await axios.post(url, formData);

      // console.log("Response:", response);
      // console.log("Response data:", response.data);

      if (Array.isArray(response.data)) {
        // console.log("Setting jobs:", response.data);
        setJob(response.data);
      } else if (response.data.error) {
        // console.error("Server error:", response.data.error);
        setError("Error fetching jobs: " + response.data.error);
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

  return (
    <div className="min-h-screen bg-[#f4f7fc]">
      <div className="p-6 flex justify-between items-center text-center text-white fixed top-0 left-0 w-full h-32 bg-[#116b40] slide-up">
        <img
          src="/assets/images/delMontes.png"
          alt="Del Monte Logo"
          className="h-[120px] w-auto"
        />

        <div className="flex justify-center items-center h-full">
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">
            Explore Exciting Careers at Del Monte
          </h1>
        </div>

        <Link href="/login">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            Login
          </button>
        </Link>
      </div>

      <div className="p-8 mt-[calc(7rem+8px)] overflow-y-auto ">
        <h2 className="text-3xl font-semibold text-[#188C54] mb-6">
          Active Jobs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 rounded-lg">
          {loading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : job.length > 0 ? (
            job.map((job) => (
              <div
                key={job.jobM_id}
                className="rounded-lg overflow-hidden h-64 flex flex-col shadow-xl bg-white"
              >
                <div className="bg-[#188C54] text-white rounded-t-lg px-4 py-5 h-1/3">
                  <h3 className="text-xl font-semibold">{job.jobM_title}</h3>
                </div>
                <div className="p-4 flex flex-col justify-between h-2/3">
                  <div>
                    <div className="flex space-x-2 mb-2">
                      {/* <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Full-time
                      </span> */}
                    </div>
                    <p className="text-gray-700 mb-2">
                      {job.Total_Applied} Applicants{" "}
                      <span className="text-green-500">•</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleDetailsClick(job)}
                      className="px-4 py-2 rounded-md w-36 bg-[#188C54] text-white relative transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-1"
                      style={{
                        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      Details
                    </button>

                    {/* <button
                      onClick={() => handleDetailsClick(job)}
                      className="px-4 py-2 rounded-md w-36 bg-[#188C54] text-white relative transition-transform duration-300 ease-in-out hover:rotate-6 hover:-translate-y-1"
                      style={{
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Details
                    </button> */}

                    <span className="text-gray-500 text-sm ml-4">
                      {job.jobM_createdAt}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs available</p>
          )}
        </div>
        {isModalOpen && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
