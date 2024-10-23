"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { retrieveData } from "@/app/utils/storageUtils";
import Select from "react-select";

import { toast } from "react-toastify";

const UpdateSkill = ({
  showModal,
  setShowModal,
  profile,
  skill, // Current selected skill for editing
  setUpdateTrigger,
  skills, // List of all available skills from the backend
  fetchProfile,
  selectedSkill,
}) => {
  const [data, setData] = useState({
    skills_id: "",
    skillId: "",
    perS_name: "",
  });

  useEffect(() => {
    // Set data if selectedSkill is provided, otherwise use the skill prop
    if (selectedSkill) {
      setData({
        skills_id: selectedSkill.skills_id || "",
        skillId: selectedSkill.skills_perSId || "",
        perS_name: selectedSkill.perS_name || "",
      });
    } else if (skill) {
      setData({
        skills_id: skill.skills_id || "",
        skillId: skill.skills_perSId || "",
        perS_name: skill.perS_name || "",
      });
    }
  }, [selectedSkill, skill]);

  // Handle input change for manually entered fields (if needed)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  // Handle selection change in the dropdown
  const handleSelectChange = (selectedOption, fieldName) => {
    setData({
      ...data,
      [fieldName]: selectedOption ? selectedOption.value : "",
    });
  };

  // Function to handle saving the updated skill
  const handleSave = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const candidateId = retrieveData("user_id");

      // Check if profile and profile.skills are defined
      if (!profile || !profile.skills) {
        console.error("Profile or profile.skills is undefined");
        toast.error("Unable to retrieve profile skills.");
        return;
      }

      // Log the skills and IDs for debugging
      console.log("Skills list:", skills);
      console.log("Selected skillId:", data.skillId);
      console.log("Current skill:", skill);

      // Collect the existing skills for the user
      const existingSkills = profile.skills.map(
        (existingSkill) => existingSkill.skills_perSId // Ensure this matches the actual property in your skills array
      );

      console.log("Existing skills:", existingSkills);

      // Determine which skill is being updated
      const skillIdToUpdate = data.skillId || skill.skills_perSId;

      // Check if the selected skill is already associated with the candidate
      if (skillIdToUpdate && existingSkills.includes(skillIdToUpdate)) {
        toast.error("This skill is already associated with the candidate!");
        return; // Prevent the update request
      }

      const updatedData = {
        candidateId: candidateId,
        skills: [
          {
            skills_id: data.skills_id || skill.skills_id || null,
            skillId: skillIdToUpdate,
          },
        ],
      };

      console.log("Updated data:", updatedData);

      const formData = new FormData();
      formData.append("operation", "updateCandidateSkills");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        toast.success("Skill updated successfully!");
        if (fetchProfile) {
          fetchProfile(); // Refresh the profile after updating
        }
      } else {
        console.error("Failed to update skill:", response.data);
      }
    } catch (error) {
      console.error("Error updating skill:", error);
    }

    setShowModal(false);
  };

  // Function to get selected option in dropdown
  const getSelectedOption = (options, value) =>
    options.find((option) => option.value === value);

  return (
    <div className={`modal ${showModal ? "block" : "hidden"}`}>
      <div className="modal-content bg-gray-200 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Skill</h3>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Skill Name:
          </label>
          <Select
            name="skillId"
            value={getSelectedOption(
              skills.map((skill) => ({
                value: skill.perS_id,
                label: skill.perS_name,
              })),
              data.skillId
            )}
            onChange={(option) => handleSelectChange(option, "skillId")}
            options={skills.map((skill) => ({
              value: skill.perS_id,
              label: skill.perS_name,
            }))}
            placeholder={data.perS_name || "Select Skill"}
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

export default UpdateSkill;
