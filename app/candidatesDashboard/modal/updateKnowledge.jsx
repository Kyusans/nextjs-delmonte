"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { retrieveData } from "@/app/utils/storageUtils";
import Select from "react-select";
import { toast } from "react-toastify";

const UpdateKnowledge = ({
  showModal,
  setShowModal,
  know,
  knowledges,
  fetchProfile,
  selectedKnowledge,

}) => {
  const [data, setData] = useState({
    canknow_id: know?.canknow_id || "",
    knowledge_id: know?.knowledge_id || "",
    knowledge_name: know?.knowledge_name || "",
  });

  useEffect(() => {
    if (know) {
      setData({
        canknow_id: know.canknow_id || "",
        knowledge_id: know.knowledge_id || "",
        knowledge_name: know.knowledge_name || "",
      });
    }
  }, [know]);

  useEffect(() => {
    if (selectedKnowledge) {
      setData({
        canknow_id: selectedKnowledge.canknow_id || "",
        knowledge_id: selectedKnowledge.knowledge_id || "",
        knowledge_name: selectedKnowledge.knowledge_name || "",
      });
    }
  }, [selectedKnowledge]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setData({
      ...data,
      knowledge_id: selectedOption ? selectedOption.value : "",
      knowledge_name: selectedOption ? selectedOption.label : "",
    });
  };

  const handleSave = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const updatedKnowledge = {
        cand_id: retrieveData("user_id"),
        knowledge: [
          {
            canknow_id: data.canknow_id || null,
            knowledge_id: data.knowledge_id || know.canknow_knowledgeId,
          },
        ],
      };

      console.log("Update:", updatedKnowledge);

      const formData = new FormData();
      formData.append("operation", "updateCandidateKnowledge");
      formData.append("json", JSON.stringify(updatedKnowledge));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        console.log("Knowledge updated successfully.");
        toast.success("Knowledge updated successfully.");
        if (fetchProfile) {
          fetchProfile(); // Refresh the profile after update
        }
        setShowModal(false); // Close the modal after saving
      } else {
        console.error("Failed to update knowledge:", response.data);
      }
    } catch (error) {
      console.error("Error updating knowledge:", error);
    }
  };



  const getSelectedOption = (options, value) =>
    options.find((option) => option.value === value);

  return (
    <div className={`modal ${showModal ? "block" : "hidden"}`}>
      <div className="modal-content bg-gray-200 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Update Knowledge
        </h3>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Knowledge:
          </label>
          <Select
            name="knowledge_id"
            value={getSelectedOption(
              knowledges.map((knowledge) => ({
                value: knowledge.knowledge_id,
                label: knowledge.knowledge_name,
              })),
              data.knowledge_id
            )}
            onChange={handleSelectChange}
            options={knowledges.map((knowledge) => ({
              value: knowledge.knowledge_id,
              label: knowledge.knowledge_name,
            }))}
            placeholder={data.knowledge_name || "Select Knowledge"}
            isSearchable
            className="w-full"
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

export default UpdateKnowledge;
