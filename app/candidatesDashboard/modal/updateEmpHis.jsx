"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { retrieveData } from "@/app/utils/storageUtils";
import { toast } from "sonner";

const UpdateEmpHis = ({
  showModal,
  setShowModal,
  employment,
  fetchProfile,
  profile,
}) => {
  const [data, setData] = useState({
    empH_id: employment?.empH_id || "",
    empH_positionName: employment?.empH_positionName || "",
    empH_companyName: employment?.empH_companyName || "",
    empH_startdate: employment?.empH_startdate || "",
    empH_enddate: employment?.empH_enddate || "",
  });

  useEffect(() => {
    if (employment) {
      setData({
        empH_id: employment.empH_id || "",
        empH_positionName: employment.empH_positionName || "",
        empH_companyName: employment.empH_companyName || "",
        empH_startdate: employment.empH_startdate || "",
        empH_enddate: employment.empH_enddate || "",
      });
    }
  }, [employment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const cand_id = retrieveData("user_id");

      const updatedData = {
        cand_id: cand_id,
        employmentHistory: [
          {
            empH_id: data.empH_id || null,
            empH_positionName: data.empH_positionName,
            empH_companyName: data.empH_companyName,
            empH_startdate: data.empH_startdate,
            empH_enddate: data.empH_enddate,
          },
        ],
      };

      console.log("Update Employment History:", updatedData);

      const formData = new FormData();
      formData.append("operation", "updateCandidateEmploymentInfo");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        toast.success("Employment history updated successfully.");
        if (fetchProfile) {
          fetchProfile();
        }
        setShowModal(false); 
      } else {
        console.error("Failed to update employment history:", response.data);
      }
    } catch (error) {
      console.error("Error updating employment history:", error);
    }
  };

  return (
    <div className={`modal ${showModal ? "block" : "hidden"}`}>
      <div className="modal-content bg-gray-200 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {data.empH_id ? "Edit Employment History" : "Add Employment History"}
        </h3>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Position Name:
          </label>
          <input
            type="text"
            name="empH_positionName"
            value={data.empH_positionName}
            onChange={handleChange}
            placeholder="Enter Position Name"
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Company Name:
          </label>
          <input
            type="text"
            name="empH_companyName"
            value={data.empH_companyName}
            onChange={handleChange}
            placeholder="Enter Company Name"
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Start Date:
          </label>
          <input
            type="date"
            name="empH_startdate"
            value={data.empH_startdate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            End Date:
          </label>
          <input
            type="date"
            name="empH_enddate"
            value={data.empH_enddate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="p-2 rounded-lg bg-red-500 text-white mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="p-2 rounded-lg bg-green-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmpHis;
