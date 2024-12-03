// app/candidatesDashboard/sideBar/CancelJobModal.jsx
import { retrieveData } from "@/app/utils/storageUtils";
import React from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast"; // Updated import

const CancelJobModal = ({
  jobTitle,
  jobMId,
  jobAppId,
  onCancel,
  onClose,
  fetchAppliedJobs,
}) => {
  const handleCancelJob = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    const userId = retrieveData("user_id");
    // console.log("appId", jobAppId, jobMId);

    try {
      const formData = new FormData();
      formData.append("operation", "cancelJobApplied");
      formData.append(
        "json",
        JSON.stringify({ user_id: userId, jobId: jobMId, appId: jobAppId })
      );

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error) {
        // console.error(response.data.error);
        toast.error(response.data.error);
      } else {
        // console.log(response.data.success);
        toast.success("Job application cancelled successfully.");
        fetchAppliedJobs();
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error cancelling job application:", error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FaTimes className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Cancel Job Application
        </h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to cancel your application for:{" "}
          <strong className="text-gray-900">{jobTitle}</strong>?
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCancelJob}
            className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 transition duration-200"
          >
            Cancel Application
          </button>
        </div>
      </div>
      <Toaster position="bottom-left" />
    </div>
  );
};

export default CancelJobModal;
