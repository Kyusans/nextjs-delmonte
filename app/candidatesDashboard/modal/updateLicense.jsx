"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { retrieveData } from "@/app/utils/storageUtils";
import Select from "react-select";

const UpdateLicense = ({
  showLicenseModal,
  setShowLicenseModal,
  selectedLicense,
  licenses,
  lic,
  fetchProfile,
}) => {
  const [data, setData] = useState({
    license_id: lic?.license_id || "",
    license_masterId: lic?.license_masterId || "",
    license_number: lic?.license_number || "",
    license_master_name: lic?.license_master_name || "",
    license_master_id: lic?.license_master_id || "",
  });

  useEffect(() => {
    if (lic) {
      setData({
        license_id: lic.license_id || "",
        license_masterId: lic.license_masterId || "",
        license_number: lic.license_number || "",
        license_master_name: lic.license_master_name || "",
        license_master_id: lic.license_master_id || "",
      });
    }
  }, [lic]);

  useEffect(() => {
    if (selectedLicense) {
      setData({
        license_id: selectedLicense.license_id || "",
        license_masterId: selectedLicense.license_masterId || "",
        license_number: selectedLicense.license_number || "",
        license_master_name: selectedLicense.license_master_name || "",
        license_master_id: selectedLicense.license_master_id || "",
      });
    }
  }, [selectedLicense]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setData({
      ...data,
      license_master_id: selectedOption ? selectedOption.value : "",
      license_master_name: selectedOption ? selectedOption.label : "",
    });
  };

  const handleSave = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const updatedLicense = {
        cand_id: retrieveData("user_id"),
        license: [
          {
            license_id: data.license_id,
            license_masterId: parseInt(
              data.license_master_id ||
                lic?.license_masterId ||
                selectedLicense?.license_masterId,
              10
            ), // Ensure it's an integer
            license_number:
              data.license_number ||
              lic?.license_number ||
              selectedLicense?.license_number,
          },
        ],
      };

      console.log("updateLicense", updatedLicense);

      const formData = new FormData();
      formData.append("operation", "updateCandidateLicense");
      formData.append("json", JSON.stringify(updatedLicense));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        console.log("License updated successfully.");
        if (fetchProfile) {
          fetchProfile(); // Refresh the profile after update
        }
        setShowLicenseModal(false); // Close the modal after saving
      } else {
        console.error("Failed to update license:", response.data);
      }
    } catch (error) {
      console.error("Error updating license:", error);
    }
  };

  const getSelectedOption = (options, value) =>
    options.find((option) => option.value === value);

  return (
    <div className={`modal ${showLicenseModal ? "block" : "hidden"}`}>
      <div className="modal-content bg-gray-200 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Update License
        </h3>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            License Master ID:
          </label>
          <Select
            name="license_master_id"
            value={getSelectedOption(
              licenses.map((license) => ({
                value: license.license_master_id,
                label: license.license_master_name,
              })),
              data.license_master_id
            )}
            onChange={handleSelectChange}
            options={licenses.map((license) => ({
              value: license.license_master_id,
              label: license.license_master_name,
            }))}
            placeholder={data.license_master_name || "Select License"}
            isSearchable
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            License Number:
          </label>
          <input
            type="text"
            name="license_number"
            value={data.license_number}
            onChange={handleInputChange}
            className="w-full border-b-2 pb-2 bg-transparent"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowLicenseModal(false)}
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

export default UpdateLicense;
