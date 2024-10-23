import React, { useState, useEffect } from "react";
import axios from "axios";
import { retrieveData } from "@/app/utils/storageUtils";
import Select from "react-select";
import { toast } from "react-toastify";

const UpdateEducBac = ({
  showModalUpdateEduc,
  setShowModalUpdateEduc,
  selectedEducation,
  courses,
  institutions,
  fetchProfile,
}) => {
  const [data, setData] = useState({
    educ_back_id: selectedEducation.educ_back_id || "",
    courses_id: selectedEducation.courses_id || "",
    institution_id: selectedEducation.institution_id || "",
    educ_dategraduate: selectedEducation.educ_dategraduate || "",
    customCourse: "", // Added for custom course input
    customInstitution: "", // Added for custom institution input
  });

  useEffect(() => {
    if (selectedEducation) {
      setData({
        educ_back_id: selectedEducation.educ_back_id || "",
        courses_id: selectedEducation.courses_id || "",
        institution_id: selectedEducation.institution_id || "",
        educ_dategraduate: selectedEducation.educ_dategraduate || "",
        customCourse: "", // Reset custom values on selection change
        customInstitution: "", // Reset custom values on selection change
      });
    }
  }, [selectedEducation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setData({
      ...data,
      [fieldName]: selectedOption ? selectedOption.value : "",
      ...(fieldName === "courses_id" ? { customCourse: "" } : {}), // Reset custom course
      ...(fieldName === "institution_id" ? { customInstitution: "" } : {}), // Reset custom institution
    });
  };

  const handleSave = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const candidateId = retrieveData("user_id");

      const updatedData = {
        candidateId: candidateId,
        educationalBackground: [
          {
            educId: data.educ_back_id || null,
            courseId:
              data.courses_id ||
              (data.customCourse ? "other" : selectedEducation.courses_id),
            institutionId:
              data.institution_id ||
              (data.customInstitution
                ? "other"
                : selectedEducation.institution_id),
            courseDateGraduated:
              data.educ_dategraduate || selectedEducation.educ_dategraduate,
            customCourse: data.customCourse || null,
            customInstitution: data.customInstitution || null,
          },
        ],
      };

      console.log("Updated data:", updatedData);

      const formData = new FormData();
      formData.append("operation", "updateEducationalBackground");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        toast.success("Educational background updated successfully");
        if (fetchProfile) {
          fetchProfile();
        }
      } else {
        console.error(
          "Failed to update educational background:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error updating educational background:", error);
    }

    setShowModalUpdateEduc(false);
  };

  const getSelectedOption = (options, value) =>
    options.find((option) => option.value === value);

  return (
    <div className={`modal ${showModalUpdateEduc ? "block" : "hidden"}`}>
      <div className="modal-content bg-gray-200 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Update Educational Background
        </h3>

        <div className="mb-4 bg-gray-200">
          <label className="block text-gray-600 text-sm font-normal">
            Course:
          </label>
          <Select
            name="courses_id"
            value={getSelectedOption(
              courses.map((course) => ({
                value: course.courses_id,
                label: course.courses_name,
              })),
              data.courses_id
            )}
            onChange={(option) => handleSelectChange(option, "courses_id")}
            options={[
              ...courses.map((course) => ({
                value: course.courses_id,
                label: course.courses_name,
              })),
              { value: "custom", label: "Other (Specify)" },
            ]}
            placeholder={selectedEducation.courses_name || "Select Course"}
            isSearchable
            className="w-full"
          />
          {data.courses_id === "custom" && (
            <input
              type="text"
              name="customCourse"
              value={data.customCourse}
              onChange={handleInputChange}
              placeholder="Enter custom course"
              className="w-full mt-2 border-b-2 pb-2 bg-transparent"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Institution:
          </label>
          <Select
            name="institution_id"
            value={getSelectedOption(
              institutions.map((institution) => ({
                value: institution.institution_id,
                label: institution.institution_name,
              })),
              data.institution_id
            )}
            onChange={(option) => handleSelectChange(option, "institution_id")}
            options={[
              ...institutions.map((institution) => ({
                value: institution.institution_id,
                label: institution.institution_name,
              })),
              { value: "custom", label: "Other (Specify)" },
            ]}
            placeholder={
              selectedEducation.institution_name || "Select Institution"
            }
            isSearchable
            className="w-full"
          />
          {data.institution_id === "custom" && (
            <input
              type="text"
              name="customInstitution"
              value={data.customInstitution}
              onChange={handleInputChange}
              placeholder="Enter custom institution"
              className="w-full mt-2 border-b-2 pb-2 bg-transparent"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Date Graduated:
          </label>
          <input
            type="date"
            name="educ_dategraduate"
            value={
              data.educ_dategraduate || selectedEducation.educ_dategraduate
            }
            onChange={handleInputChange}
            className="w-full border-b-2 pb-2 bg-transparent"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowModalUpdateEduc(false)}
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

export default UpdateEducBac;
