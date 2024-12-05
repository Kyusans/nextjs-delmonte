import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { retrieveDataFromCookie,
  retrieveDataFromSession,
  storeDataInCookie,
  storeDataInSession,
  removeDataFromCookie,
  removeDataFromSession, 
  retrieveData} from "@/app/utils/storageUtils";
import Select, { components } from "react-select";
import { Toaster, toast } from "react-hot-toast";

// Custom Option Component
const CustomOption = (props) => {
  return (
    <components.Option
      {...props}
      className={`custom-option ${props.isSelected ? "is-selected" : ""}`}
      style={{ cursor: "pointer" }}
    >
      {props.children}
    </components.Option>
  );
};

const UpdateEducBac = ({
  showModalUpdateEduc,
  setShowModalUpdateEduc,
  selectedEducation,
  courses,
  institutions,
  courseTypes,
  courseCategory,
  fetchProfile,
}) => {
  const [data, setData] = useState({
    educ_back_id: "",
    courses_id: "",
    institution_id: "",
    educ_dategraduate: "",
    customCourse: "",
    customInstitution: "",
    customCourseCategory: "",
    customCourseType: "",
  });

  console.log("selectedEducation:", selectedEducation);

  const [errors, setErrors] = useState({
    customCourse: "",
    customCourseCategory: "",
    customCourseType: "",
    customInstitution: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (showModalUpdateEduc) {
      if (selectedEducation && Object.keys(selectedEducation).length > 0) {
        // If editing an existing education
        setData({
          educ_back_id: selectedEducation.educ_back_id || "",
          courses_id: selectedEducation.courses_id || "",
          institution_id: selectedEducation.institution_id || "",
          educ_dategraduate: selectedEducation.educ_dategraduate || "",
          customCourse: "",
          customInstitution: "",
          customCourseCategory: "",
          customCourseType: "",
        });
      } else {
        // If adding a new education
        setData({
          educ_back_id: "",
          courses_id: "",
          institution_id: "",
          educ_dategraduate: "",
          customCourse: "",
          customInstitution: "",
          customCourseCategory: "",
          customCourseType: "",
        });
      }
    }
  }, [showModalUpdateEduc, selectedEducation]); // Add showModalUpdateEduc to dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    validateCustomInput(name, value); // Validate custom input
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setData((prevData) => ({

      ...prevData,
      [fieldName]: selectedOption ? selectedOption.value : "",
      ...(fieldName === "courses_id" ? { customCourse: "" } : {}),
      ...(fieldName === "institution_id" ? { customInstitution: "" } : {}),
      ...(fieldName === "course_category_id"
        ? { customCourseCategory: "" }
        : {}),
      ...(fieldName === "course_type_id" ? { customCourseType: "" } : {}),
    }));
  };

  const validateCustomInput = (fieldName, value) => {
    let errorMessage = "";
    const options = {
      customCourse: courses.map((course) => course.courses_name),
      customCourseCategory: courseCategory.map(
        (category) => category.course_categoryName
      ),
      customCourseType: courseTypes.map((type) => type.crs_type_name),
      customInstitution: institutions.map(
        (institution) => institution.institution_name
      ),
    };

    // Check if the fieldName exists in options
    if (options[fieldName] && value && options[fieldName].includes(value)) {
      errorMessage = "It exists in the dropdown";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
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
              (data.customCourse ? "custom" : selectedEducation.courses_id),
            institutionId:
              data.institution_id ||
              (data.customInstitution
                ? "custom"
                : selectedEducation.institution_id),
            courseDateGraduated:
              data.educ_dategraduate || selectedEducation.educ_dategraduate,
            courseCategoryId:
              data.course_category_id ||
              (data.customCourseCategory
                ? "custom"
                : selectedEducation.course_category_id),
            courseTypeId:
              data.course_type_id ||
              (data.customCourseType
                ? "custom"
                : selectedEducation.course_type_id),
            customCourse: data.customCourse,
            customCourseCategory: data.customCourseCategory,
            customCourseType: data.customCourseType,
            customInstitution: data.customInstitution,
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
        toast.success("Educational background updated successfully"); // This will now use react-hot-toast
        if (fetchProfile) {
          fetchProfile();
        }
      } else {
        console.error(
          "Failed to update educational background:",
          response.data
        );
        toast.error("Failed to update educational background."); // This will now use react-hot-toast
      }
    } catch (error) {
      console.error("Error updating educational background:", error);
      toast.error("Error updating educational background: " + error.message); // This will now use react-hot-toast
    }

    setShowModalUpdateEduc(false);
  };

  const getSelectedOption = (options, value) =>
    options.find((option) => option.value === value) || null;

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const selectStyles = useMemo(() => ({
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#cce5ff" : "white",
      color: "black",
      cursor: "pointer",
    }),
  }), []);

  const coursesOptions = useMemo(() => {
    return [
      { value: "custom", label: "Other (Specify)" },
      ...courses.map((course) => ({
        value: course.courses_id,
        label: course.courses_name,
      })),
    ];
  }, [courses]);

  const selectedCourse = useMemo(() => {
    return getSelectedOption(
      courses.map((course) => ({
        value: course.courses_id,
        label: course.courses_name,
      })),
      data.courses_id
    );
  }, [courses, data.courses_id]);

  const courseCategoryOptions = useMemo(() => {
    return [
      { value: "custom", label: "Other (Specify)" },
      ...courseCategory.map((category) => ({
        value: category.course_categoryId,
        label: category.course_categoryName,
      })),
    ];
  }, [courseCategory]);

  const selectedCourseCategory = useMemo(() => {
    return getSelectedOption(
      courseCategory.map((category) => ({
        value: category.course_categoryId,
        label: category.course_categoryName,
      })),
      data.course_category_id
    );
  }, [courseCategory, data.course_category_id]);

  const courseTypeOptions = useMemo(() => {
    return [
      { value: "custom", label: "Other (Specify)" },
      ...courseTypes.map((type) => ({
        value: type.crs_type_id,
        label: type.crs_type_name,
      })),
    ];
  }, [courseTypes]);

  const selectedCourseType = useMemo(() => {
    return getSelectedOption(
      courseTypes.map((type) => ({
        value: type.crs_type_id,
        label: type.crs_type_name,
      })),
      data.course_type_id
    );
  }, [courseTypes, data.course_type_id]);

  const institutionOptions = useMemo(() => {
    return [
      { value: "custom", label: "Other (Specify)" },
      ...institutions.map((institution) => ({
        value: institution.institution_id,
        label: institution.institution_name,
      })),
    ];
  }, [institutions]);

  const selectedInstitution = useMemo(() => {
    return getSelectedOption(
      institutions.map((institution) => ({
        value: institution.institution_id,
        label: institution.institution_name,
      })),
      data.institution_id
    );
  }, [institutions, data.institution_id]);

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
          <div className="flex items-center">
            <Select
              name="courses_id"
              value={selectedCourse}
              onChange={(option) => handleSelectChange(option, "courses_id")}
              options={coursesOptions}
              placeholder={selectedEducation?.courses_name || "Select Course"}
              isSearchable
              className="w-full"
              menuPlacement="auto"
              menuPosition="fixed"
              blurInputOnSelect
              isOptionDisabled={(option) => option.isDisabled}
              menuShouldScrollIntoView={false}
              menuIsOpen={isDropdownOpen}
              onMenuOpen={handleDropdownOpen}
              onMenuClose={handleDropdownClose}
              components={{ Option: CustomOption }}
              // styles={selectStyles}
            />
            {data.courses_id && ( // Show Clear button only if there is a value
              <button
                className="ml-2 text-red-500"
                onClick={() => handleSelectChange(null, "courses_id")} // Clear selection
              >
                Clear
              </button>
            )}
          </div>
          {data.courses_id === "custom" && (
            <div>
              <input
                type="text"
                name="customCourse"
                value={data.customCourse}
                onChange={handleInputChange}
                placeholder="Enter custom course"
                className={`w-full mt-2 border-b-2 pb-2 ${
                  errors.customCourse ? "border-red-500" : "border-black"
                } bg-transparent`}
              />
              {errors.customCourse && (
                <p className="text-red-500">{errors.customCourse}</p>
              )}
            </div>
          )}
        </div>

        <div className="mb-4 bg-gray-200">
          <label className="block text-gray-600 text-sm font-normal">
            Course Category:
          </label>
          <div className="flex items-center">
            <Select
              name="course_category_id"
              value={selectedCourseCategory}
              onChange={(option) =>
                handleSelectChange(option, "course_category_id")
              }
              options={courseCategoryOptions}
              placeholder="Select Course Category"
              isSearchable
              className="w-full"
              menuPlacement="auto"
              menuPosition="fixed"
              blurInputOnSelect
              isOptionDisabled={(option) => option.isDisabled}
              // styles={selectStyles}
            />
            {data.course_category_id && ( // Show Clear button only if there is a value
              <button
                className="ml-2 text-red-500"
                onClick={() => handleSelectChange(null, "course_category_id")} // Clear selection
              >
                Clear
              </button>
            )}
          </div>
          {data.course_category_id === "custom" && (
            <input
              type="text"
              name="customCourseCategory"
              value={data.customCourseCategory}
              onChange={handleInputChange}
              placeholder="Enter custom course category"
              className={`w-full mt-2 border-b-2 pb-2 ${
                errors.customCourseCategory ? "border-red-500" : "border-black"
              } bg-transparent`}
            />
          )}
          {errors.customCourseCategory && (
            <p className="text-red-500">{errors.customCourseCategory}</p>
          )}
        </div>

        <div className="mb-4 bg-gray-200">
          <label className="block text-gray-600 text-sm font-normal">
            Course Type:
          </label>
          <div className="flex items-center">
            <Select
              name="course_type_id"
              value={selectedCourseType}
              onChange={(option) =>
                handleSelectChange(option, "course_type_id")
              }
              options={courseTypeOptions}
              placeholder="Select Course Type"
              isSearchable
              className="w-full"
              menuPlacement="auto"
              menuPosition="fixed"
              blurInputOnSelect
              isOptionDisabled={(option) => option.isDisabled}
              // styles={selectStyles}
            />
            {data.course_type_id && ( // Show Clear button only if there is a value
              <button
                className="ml-2 text-red-500"
                onClick={() => handleSelectChange(null, "course_type_id")} // Clear selection
              >
                Clear
              </button>
            )}
          </div>
          {data.course_type_id === "custom" && (
            <input
              type="text"
              name="customCourseType"
              value={data.customCourseType}
              onChange={handleInputChange}
              placeholder="Enter custom course type"
              className={`w-full mt-2 border-b-2 pb-2 ${
                errors.customCourseType ? "border-red-500" : "border-black"
              } bg-transparent`}
            />
          )}
          {errors.customCourseType && (
            <p className="text-sm text-red-500">{errors.customCourseType}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Institution:
          </label>
          <div className="flex items-center">
            <Select
              name="institution_id"
              value={selectedInstitution}
              onChange={(option) =>
                handleSelectChange(option, "institution_id")
              }
              options={institutionOptions}
              placeholder="Select Institution"
              isSearchable
              className="w-full"
              menuPlacement="auto"
              menuPosition="fixed"
              blurInputOnSelect
              isOptionDisabled={(option) => option.isDisabled}
              // styles={selectStyles}
            />
            {data.institution_id && ( // Show Clear button only if there is a value
              <button
                className="ml-2 text-red-500"
                onClick={() => handleSelectChange(null, "institution_id")} // Clear selection
              >
                Clear
              </button>
            )}
          </div>
          {data.institution_id === "custom" && (
            <input
              type="text"
              name="customInstitution"
              value={data.customInstitution}
              onChange={handleInputChange}
              placeholder="Enter custom institution"
              className={`w-full mt-2 border-b-2 pb-2 ${
                errors.customInstitution ? "border-red-500" : "border-black"
              } bg-transparent`}
            />
          )}
          {errors.customInstitution && (
            <p className="text-sm text-red-500">{errors.customInstitution}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Date Graduated:
          </label>
          <input
            type="date"
            name="educ_dategraduate"
            value={data.educ_dategraduate}
            onChange={handleInputChange}
            className="w-full mt-2 border-b-2 pb-2 bg-transparent border-black text-black [color-scheme:light]"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={() => setShowModalUpdateEduc(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSave}
          >
            Save
          </button>
          
        </div>
      </div>
      <Toaster position="bottom-left" />
    </div>
  );
};

export default UpdateEducBac;
