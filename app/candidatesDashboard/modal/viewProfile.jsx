"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { retrieveData } from "@/app/utils/storageUtils";
import { FaBars } from "react-icons/fa";
import UpdateEducBac from "./updateEducBac";
import UpdateSkill from "./updateSkill";
import UpdateTraining from "./updateTraining";
import UpdateKnowledge from "./updateKnowledge";
import UpdateLicense from "./updateLicense";
import { MoreHoriz, Edit, Trash2, Plus, Settings, Lock } from "lucide-react";
import { Check, X } from "lucide-react";
import UpdateEmpHis from "./updateEmpHis";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import VerificationEmailUpdate from "./verificationEmailUpdate";
import UpdateEmailPassword from "./updatePassword";
import UpdateResume from "./updateResume";
import UpdatePassword from "./updatePassword";
import UpdateEmail from "./updateEmail";

const ViewProfile = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState({
    candidateInformation: {},
    educationalBackground: [],
    employmentHistory: {},
    skills: [],
    training: [],
    license: [],
    resume: [],
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("appearance");
    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      const savedTheme = localStorage.getItem("appearance");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
      } else if (savedTheme === "light") {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(mediaQuery.matches);
      }
    };

    // Set initial theme
    updateTheme();

    // Listen for changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === "appearance") {
        updateTheme();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Listen for changes in system preference
    const handleMediaQueryChange = (e) => {
      const savedTheme = localStorage.getItem("appearance");
      if (savedTheme === "system") {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Personal Information");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingEducationalInfo, setIsEditingEducationalInfo] =
    useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [showModalUpdateEduc, setShowModalUpdateEduc] = useState(false);

  const [isEditingEmploymentInfo, setIsEditingEmploymentInfo] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingTraining, setIsEditingTraining] = useState(false);
  const [isEditingknowledge, setIsEditingknowledge] = useState(false);
  const [isEditinglicense, setIsEditinglicense] = useState(false);

  const [editData, setEditData] = useState({});
  const modalRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);

  const [selectedEmployment, setSelectedEmployment] = useState(null);
  const [showEmploymentModal, setShowEmploymentModal] = useState(false);

  const [updateTrigger, setUpdateTrigger] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skills, setSkills] = useState([]);

  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [trainings, settrainings] = useState([]);

  const [selectedKnowlegde, setSelectedKnowledge] = useState(null);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [knowledges, setKnowledges] = useState([]);

  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenses, setLicense] = useState([]);

  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumes, setResumes] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleEditClick = (education, index) => {
    setSelectedEducation(education);
    setSelectedIndex(index);
    setShowModalUpdateEduc(true);
  };

  const handleEditSkillClick = (skill, index) => {
    setSelectedSkill(skill);
    setSelectedIndex(index);
    setShowSkillModal(true);
  };

  const handleEditTrainingClick = (train, index) => {
    setSelectedTraining(train);
    setSelectedIndex(index);

    setShowTrainingModal(true);
  };

  const handleEditKnowledgeClick = (know, index) => {
    setSelectedKnowledge(know);
    setSelectedIndex(index);
    setShowKnowledgeModal(true);
  };

  const handleEditLicenseClick = (lic, index) => {
    setSelectedLicense(lic);
    setSelectedIndex(index);

    setShowLicenseModal(true);
  };

  const handleEditResumeClick = (res, index) => {
    setSelectedResume(res);
    setSelectedIndex(index);

    setShowResumeModal(true);
  };

  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  const [currentDeleteId, setCurrentDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setCurrentDeleteId(id);
    setIsModalOpen(true);
    setIsModalConfirmOpen(true);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

        const formData = new FormData();
        formData.append("operation", "getCourses");

        const coursesResponse = await axios.post(url, formData);

        setCourses(coursesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchInstitutions = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

        const formData = new FormData();
        formData.append("operation", "getInstitution");

        const institutionsResponse = await axios.post(url, formData);

        setInstitutions(institutionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchCourseTypes = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

        const formData = new FormData();
        formData.append("operation", "getCourseType");

        const courseTypesResponse = await axios.post(url, formData);

        setCourseTypes(courseTypesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchCourseCategorys = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

        const formData = new FormData();
        formData.append("operation", "getCourseCategory");
        const courseCategorysResponse = await axios.post(url, formData);
        setCourseCategory(courseCategorysResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchSkills = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

        const formData = new FormData();
        formData.append("operation", "getSkills");
        const skillsResponse = await axios.post(url, formData);
        setSkills(skillsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchTraining = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

        const formData = new FormData();
        formData.append("operation", "getTraining");
        const trainingResponse = await axios.post(url, formData);
        settrainings(trainingResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchKnowledge = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

        const formData = new FormData();
        formData.append("operation", "getKnowledge");
        const knowledgeResponse = await axios.post(url, formData);
        setKnowledges(knowledgeResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchLicense = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

        const formData = new FormData();
        formData.append("operation", "getLicense");
        const licenseResponse = await axios.post(url, formData);
        setLicense(licenseResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCourses();
    fetchInstitutions();
    fetchCourseTypes();
    fetchCourseCategorys();
    fetchSkills();
    fetchTraining();
    fetchKnowledge();
    fetchLicense();
  }, []);

  async function fetchProfile() {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const cand_id = retrieveData("user_id");

      const jsonData = { cand_id: cand_id };

      const formData = new FormData();
      formData.append("operation", "getCandidateProfile");
      formData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, formData);
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, [updateTrigger]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false); // Close the sidebar on mobile after selecting a section
  };

  const handleEditPersonalClick = () => {
    setIsEditingPersonalInfo(true);
    setEditData(profile);
  };

  const handleEditEmploymentClick = () => {
    setIsEditingEmploymentInfo(true);
    setEditData(profile);
  };

  const handleChangeNotArray = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");

    // Handle cases where nameParts can have 2 parts
    const [parentKey, key] = nameParts;

    setEditData((prevData) => ({
      ...prevData,
      [parentKey]: {
        ...(prevData[parentKey] || {}),
        [key]: value,
      },
    }));
  };

  if (!isOpen) return null;

  const handleDropdownChange = (e, index, field) => {
    const value = e.target.value;
    const newData = [...editData.educationalBackground];
    newData[index][field] = value;
    handleChange({
      target: {
        name: `educationalBackground[${index}].${field}`,
        value: newData,
      },
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.match(/([^[\].]+)|(?=\[\d+\])/g);

    if (nameParts.length < 3) {
      console.error("Unexpected name format", name);
      return;
    }

    const [parentKey, index, key] = nameParts;
    const idx = parseInt(index, 10);

    setEditData((prevData) => {
      if (Array.isArray(prevData[parentKey])) {
        const updatedArray = prevData[parentKey].map((item, i) =>
          i === idx ? { ...item, [key]: value } : item
        );

        return {
          ...prevData,
          [parentKey]: updatedArray,
        };
      } else {
        return {
          ...prevData,
          [parentKey]: {
            ...prevData[parentKey],
            [key]: value,
          },
        };
      }
    });
  };

  const handleSavePersonalInfo = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const cand_id = retrieveData("user_id");

      const updatedData = { ...editData, cand_id };

      console.log("Sending data:", updatedData);

      const formData = new FormData();
      formData.append("operation", "updateCandidatePersonalInfo");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData);
      console.log("ashjvdgjashdghjadsghj", updatedData);

      if (response.data.success) {
        setProfile(updatedData);
        setIsEditingPersonalInfo(false);
        console.log("Profile updated successfully");
      } else if (response.data.error) {
        console.error("Error updating profile:", response.data.error);
      } else {
        console.error("Unexpected response from server:", response.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSaveEmploymentInfo = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

      const cand_id = retrieveData("user_id");

      const updatedData = { ...editData, cand_id };

      console.log("Sending data:", updatedData);

      const formData = new FormData();
      formData.append("operation", "updateCandidateEmploymentInfo");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData);

      if (response.data.success) {
        setProfile(updatedData);
        setIsEditingEmploymentInfo(false);
        console.log("Profile updated successfully");
      } else if (response.data.error) {
        console.error("Error updating profile:", response.data.error);
      } else {
        console.error("Unexpected response from server:", response.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleEducationDeleteClick = async () => {
    if (currentDeleteId == null) return;

    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const candidateId = retrieveData("user_id");

      const updatedData = {
        candidateId: candidateId,
        educationalBackground: [
          {
            educId: currentDeleteId,
            deleteFlag: true,
          },
        ],
      };

      console.log("Sending data:", updatedData);

      const formData = new FormData();
      formData.append("candidateId", candidateId);
      formData.append("operation", "updateEducationalBackground");

      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      if (response.data === 1) {
        toast.success("Education record deleted successfully.");
        fetchProfile();
        console.log(
          `Education record with ID ${educationId} deleted successfully.`
        );
      } else {
        console.error("Failed to delete the education record.");
      }
    } catch (error) {
      console.error(
        "An error occurred while deleting the education record:",
        error
      );
    } finally {
      setIsModalOpen(false);
      setCurrentDeleteId(null);
    }
  };

  const handleConfirmEmployementHistoryDelete = async () => {
    if (currentDeleteId == null) return;

    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    const candidateId = retrieveData("user_id");

    const updatedData = {
      candidateId: candidateId,
      employmentHistory: [
        {
          empH_id: currentDeleteId,
          deleteFlag: true,
        },
      ],
    };

    try {
      const formData = new FormData();
      formData.append("candidateId", candidateId);
      formData.append("operation", "updateCandidateEmploymentInfo");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Employment record deleted successfully.");
        fetchProfile(); // Assume fetchProfile is defined to refresh the data
      } else {
        toast.error("Failed to delete the employment record.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the employment record.");
    } finally {
      setIsModalOpen(false);
      setCurrentDeleteId(null);
    }
  };

  const handleConfirmSkillDelete = async () => {
    if (currentDeleteId == null) return;

    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    const candidateId = retrieveData("user_id");

    const updatedData = {
      candidateId: candidateId,
      skills: [
        {
          skills_id: currentDeleteId,
          deleteFlag: true,
        },
      ],
    };

    try {
      const formData = new FormData();
      formData.append("candidateId", candidateId);
      formData.append("operation", "updateCandidateSkills");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        toast.success("Skill record deleted successfully.");
        fetchProfile(); // Assume fetchProfile is defined to refresh the data
      } else {
        toast.error("Failed to delete the skill record.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the skill record.");
    } finally {
      setIsModalOpen(false);
      setCurrentDeleteId(null);
    }
  };

  const handleConfirmTrainingDelete = async () => {
    if (currentDeleteId == null) return;

    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    const cand_id = retrieveData("user_id");

    const updatedData = {
      cand_id: cand_id,
      training: [
        {
          training_id: currentDeleteId,
          deleteFlag: true,
        },
      ],
    };

    console.log("fck", updatedData);

    try {
      const formData = new FormData();
      formData.append("cand_id", cand_id);
      formData.append("operation", "updateCandidateTraining");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        toast.success("Training record deleted successfully.");
        fetchProfile();
      } else {
        toast.error("Failed to delete the Training record.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the skill record.");
    } finally {
      setIsModalOpen(false);
      setCurrentDeleteId(null);
    }
  };

  const handleConfirmKnowledgeDelete = async () => {
    if (currentDeleteId == null) return;

    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    const cand_id = retrieveData("user_id");

    const updatedData = {
      cand_id: cand_id,
      knowledge: [
        {
          canknow_id: currentDeleteId,
          deleteFlag: true,
        },
      ],
    };

    console.log("fck", updatedData);

    try {
      const formData = new FormData();
      formData.append("cand_id", cand_id);
      formData.append("operation", "updateCandidateKnowledge");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        toast.success("Knowledge record deleted successfully.");
        fetchProfile();
      } else {
        toast.error("Failed to delete the Knowledge record.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the skill record.");
    } finally {
      setIsModalOpen(false);
      setCurrentDeleteId(null);
    }
  };

  const handleConfirmLicenseDelete = async () => {
    if (currentDeleteId == null) return;

    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    const cand_id = retrieveData("user_id");

    const updatedData = {
      cand_id: cand_id,
      license: [
        {
          license_id: currentDeleteId,
          deleteFlag: true,
        },
      ],
    };

    console.log("fck", updatedData);

    try {
      const formData = new FormData();
      formData.append("cand_id", cand_id);
      formData.append("operation", "updateCandidateLicense");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        toast.success("License record deleted successfully.");
        fetchProfile();
      } else {
        toast.error("Failed to delete the License record.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the license record.");
    } finally {
      setIsModalOpen(false);
      setCurrentDeleteId(null);
    }
  };

  const handleConfirmResumeDelete = async () => {
    if (currentDeleteId == null) return;

    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    const cand_id = retrieveData("user_id");

    const updatedData = {
      cand_id: cand_id,
      resume: [
        {
          canres_id: currentDeleteId,
          deleteFlag: true,
        },
      ],
    };

    try {
      const formData = new FormData();
      formData.append("cand_id", cand_id);
      formData.append("operation", "updateCandidateResume");
      formData.append("json", JSON.stringify(updatedData));

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        toast.success("Resume record deleted successfully.");
        fetchProfile();
      } else {
        toast.error("Failed to delete the Resume record.");
        console.error("Server response:", response.data);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the resume record.");
      console.error("Error details:", error);
    } finally {
      setIsModalOpen(false);
      setCurrentDeleteId(null);
    }
  };

  // Function to handle opening the modal
  const handleSaveClick = () => {
    setShowVerificationModal(true);
  };

  // Function to handle closing the modal after verification
  const handleVerificationSubmit = (code) => {
    console.log("Verification code submitted:", code);

    setShowVerificationModal(false);
  };

  const handleEditPasswordClick = () => {
    setShowPasswordModal(true);
  };

  const handleEditEmailClick = () => {
    setShowEmailModal(true);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Personal Information":
        return (
          <div
            className={`p-6 space-y-6 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-[#F4F7FC]"
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Personal Information
            </h3>

            <div
              className="relative flex items-end justify-end"
              ref={settingsRef}
            >
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-end"
              >
                <Settings className="w-6 h-6" />
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-md shadow-2xl z-10 p-3">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleEditPersonalClick();
                        setIsSettingsOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-400 hover:text-white w-full text-left"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Personal Information
                    </button>
                    <button
                      onClick={() => {
                        handleEditPasswordClick();
                        setIsSettingsOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-400 hover:text-white w-full text-left"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </button>

                    <button
                      onClick={() => {
                        handleEditEmailClick();
                        setIsSettingsOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-400 hover:text-white w-full text-left"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Change Email
                    </button>
                  </div>
                </div>
              )}
            </div>

            {showPasswordModal && (
              <UpdatePassword
                showModal={showPasswordModal}
                setShowModal={setShowPasswordModal}
                fetchProfile={fetchProfile}
                candidateEmail={profile.candidateInformation.cand_email}
                candidatePassword={profile.candidateInformation.cand_password}
                candidateAlternateEmail={
                  profile.candidateInformation.cand_alternateEmail
                }
              />
            )}

            {showEmailModal && (
              <UpdateEmail
                showModal={showEmailModal}
                setShowModal={setShowEmailModal}
                fetchProfile={fetchProfile}
                candidateEmail={profile.candidateInformation.cand_email}
                candidatePassword={profile.candidateInformation.cand_password}
                candidateAlternateEmail={
                  profile.candidateInformation.cand_alternateEmail
                }
              />
            )}

            {isEditingPersonalInfo && (
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={handleSavePersonalInfo}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditingPersonalInfo(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="text-gray-600 block text-sm font-normal">
                  Name:
                </label>
                {isEditingPersonalInfo ? (
                  <>
                    <input
                      type="text"
                      name="candidateInformation.cand_lastname"
                      value={editData.candidateInformation?.cand_lastname || ""}
                      onChange={handleChangeNotArray}
                      className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                    />
                    <input
                      type="text"
                      name="candidateInformation.cand_firstname"
                      value={
                        editData.candidateInformation?.cand_firstname || ""
                      }
                      onChange={handleChangeNotArray}
                      className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                    />
                    <input
                      type="text"
                      name="candidateInformation.cand_middlename"
                      value={
                        editData.candidateInformation?.cand_middlename || ""
                      }
                      onChange={handleChangeNotArray}
                      className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                    />
                  </>
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_lastname || "N/A"},{" "}
                    {profile.candidateInformation?.cand_firstname || "N/A"}{" "}
                    {profile.candidateInformation?.cand_middlename || "N/A"}
                  </p>
                )}
              </div>

              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  Alternate Email Address:
                </label>
                {isEditingPersonalInfo ? (
                  <input
                    type="email"
                    name="candidateInformation.cand_alternateEmail"
                    value={
                      editData.candidateInformation?.cand_alternateEmail || ""
                    }
                    onChange={handleChangeNotArray}
                    className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_alternateEmail || "N/A"}
                  </p>
                )}
              </div>
            </div>

            {/* contact no */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  Contact No:
                </label>
                {isEditingPersonalInfo ? (
                  <>
                    <input
                      type="number"
                      name="candidateInformation.cand_contactNo"
                      value={
                        editData.candidateInformation?.cand_contactNo || ""
                      }
                      onChange={handleChangeNotArray}
                      className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                    />
                  </>
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_contactNo || "N/A"}
                  </p>
                )}
              </div>
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  Alternate Contact No:
                </label>
                {isEditingPersonalInfo ? (
                  <input
                    type="number"
                    name="candidateInformation.cand_alternatecontactNo"
                    value={
                      editData.candidateInformation?.cand_alternatecontactNo ||
                      ""
                    }
                    onChange={handleChangeNotArray}
                    className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_alternatecontactNo ||
                      "N/A"}
                  </p>
                )}
              </div>
            </div>

            {/* email address */}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div> */}

            {/* Address */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  Present Address:
                </label>
                {isEditingPersonalInfo ? (
                  <>
                    <input
                      type="text"
                      name="candidateInformation.cand_presentAddress"
                      value={
                        editData.candidateInformation?.cand_presentAddress || ""
                      }
                      onChange={handleChangeNotArray}
                      className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                    />
                  </>
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_presentAddress || "N/A"}
                  </p>
                )}
              </div>
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  Permanent Address:
                </label>
                {isEditingPersonalInfo ? (
                  <input
                    type="text"
                    name="candidateInformation.cand_permanentAddress"
                    value={
                      editData.candidateInformation?.cand_permanentAddress || ""
                    }
                    onChange={handleChangeNotArray}
                    className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_permanentAddress ||
                      "N/A"}
                  </p>
                )}
              </div>
            </div>

            {/* date of birth */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  Date of Birth:
                </label>
                {isEditingPersonalInfo ? (
                  <>
                    <input
                      type="date"
                      name="candidateInformation.cand_dateofBirth"
                      value={
                        editData.candidateInformation?.cand_dateofBirth || ""
                      }
                      onChange={handleChangeNotArray}
                      className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                    />
                  </>
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_dateofBirth || "N/A"}
                  </p>
                )}
              </div>
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal mb-2">
                  Gender:
                </label>
                {isEditingPersonalInfo ? (
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="candidateInformation.cand_sex"
                        value="Male"
                        checked={
                          editData.candidateInformation?.cand_sex === "Male"
                        }
                        onChange={handleChangeNotArray}
                        className="form-radio h-5 w-5 text-green-600"
                      />
                      <span className="ml-2 text-gray-700">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="candidateInformation.cand_sex"
                        value="Female"
                        checked={
                          editData.candidateInformation?.cand_sex === "Female"
                        }
                        onChange={handleChangeNotArray}
                        className="form-radio h-5 w-5 text-green-600"
                      />
                      <span className="ml-2 text-gray-700">Female</span>
                    </label>
                  </div>
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_sex || "N/A"}
                  </p>
                )}
              </div>
            </div>

            {/* sss no and tin no */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  SSS NO:
                </label>
                {isEditingPersonalInfo ? (
                  <>
                    <input
                      type="number"
                      name="candidateInformation.cand_sssNo"
                      value={editData.candidateInformation?.cand_sssNo || ""}
                      onChange={handleChangeNotArray}
                      className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                    />
                  </>
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_sssNo || "N/A"}
                  </p>
                )}
              </div>
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  TIN NO:
                </label>
                {isEditingPersonalInfo ? (
                  <input
                    type="gender"
                    name="candidateInformation.cand_tinNo"
                    value={editData.candidateInformation?.cand_tinNo || ""}
                    onChange={handleChangeNotArray}
                    className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_tinNo || "N/A"}
                  </p>
                )}
              </div>
            </div>

            {/* philhealt ug pagibig no */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  Philhealth NO:
                </label>
                {isEditingPersonalInfo ? (
                  <>
                    <input
                      type="number"
                      name="candidateInformation.cand_philhealthNo"
                      value={
                        editData.candidateInformation?.cand_philhealthNo || ""
                      }
                      onChange={handleChangeNotArray}
                      className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                    />
                  </>
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_philhealthNo || "N/A"}
                  </p>
                )}
              </div>
              <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                <label className="block text-gray-600 text-sm font-normal">
                  Pagibig NO:
                </label>
                {isEditingPersonalInfo ? (
                  <input
                    type="gender"
                    name="candidateInformation.cand_pagibigNo"
                    value={editData.candidateInformation?.cand_pagibigNo || ""}
                    onChange={handleChangeNotArray}
                    className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-semibold mt-1">
                    {profile.candidateInformation?.cand_pagibigNo || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "Educational Background":
        return (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Educational Background
            </h3>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedEducation(null); // Empty object for adding new
                  setShowAddModal(true); // Show add modal
                }}
                className="p-2 flex items-center bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 ease-in-out"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Add New Educational Background</span>
              </button>
            </div>

            {/* Add Modal */}
            {showAddModal && (
              <div className="col-span-1 md:col-span-2 mt-4">
                <div className="bg-transparent rounded-lg p-6 w-full">
                  <UpdateEducBac
                    showModalUpdateEduc={showAddModal}
                    setShowModalUpdateEduc={setShowAddModal}
                    selectedEducation={{}} // Empty object for adding
                    courses={courses}
                    courseTypes={courseTypes}
                    courseCategory={courseCategory}
                    institutions={institutions}
                    fetchProfile={fetchProfile}
                  />
                </div>
              </div>
            )}

            {Array.isArray(profile.educationalBackground) &&
            profile.educationalBackground.length > 0 ? (
              profile.educationalBackground.map((education, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 pb-4 sm:pb-6 border-b border-gray-300"
                >
                  <div className="relative">
                    {/* Edit Icon Button */}
                    <div className="absolute top-0 right-0">
                      <button
                        onClick={() => handleEditClick(education, index)}
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-800 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteClick(education.educ_back_id)
                        }
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-800 hover:text-white"
                        title="Edit"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <ConfirmationModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        onConfirm={handleEducationDeleteClick}
                        message="Are you sure you want to delete this educational background?"
                      />
                    </div>

                    {/* Course */}
                    <div className="bg-gray-200 p-3 sm:p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        Course:
                      </label>
                      <p className="text-gray-800 font-semibold mt-1">
                        {education.courses_name || "N/A"}
                      </p>
                    </div>

                    {/* Category Name */}
                    <div className="bg-gray-200 p-3 sm:p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        Course Category:
                      </label>
                      <p className="text-gray-800 font-semibold mt-1">
                        {education.course_categoryName || "N/A"}
                      </p>
                    </div>

                    {/* Institution */}
                    <div className="bg-gray-200 p-3 sm:p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        Institution:
                      </label>
                      <p className="text-gray-800 font-semibold mt-1">
                        {education.institution_name || "N/A"}
                      </p>
                    </div>

                    {/* Date Graduated */}
                    <div className="bg-gray-200 p-3 sm:p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        Date Graduated:
                      </label>
                      <p className="text-gray-800 font-semibold mt-1">
                        {education.educ_dategraduate || "N/A"}
                      </p>
                    </div>

                    {/* Modal */}
                    {selectedIndex === index && showModalUpdateEduc && (
                      <div className="col-span-1 md:col-span-2 mt-4">
                        <div className="bg-transparent rounded-lg p-6 w-full">
                          <UpdateEducBac
                            showModalUpdateEduc={showModalUpdateEduc}
                            setShowModalUpdateEduc={setShowModalUpdateEduc}
                            selectedEducation={selectedEducation}
                            courses={courses}
                            courseTypes={courseTypes}
                            courseCategory={courseCategory}
                            institutions={institutions}
                            fetchProfile={fetchProfile}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm sm:text-base text-gray-600">
                No educational background available.
              </p>
            )}
          </div>
        );

      case "Employment History":
        return (
          <div className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Employment History
            </h3>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowAddModal(true);
                }}
                className="p-2 flex items-center bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 ease-in-out"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Add New Employment History</span>
              </button>
            </div>

            {showAddModal && (
              <div className="col-span-1 md:col-span-1 mt-4">
                <div className="bg-transparent rounded-lg p-6 w-full">
                  <UpdateEmpHis
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    employment={""}
                    fetchProfile={fetchProfile}
                    profile={profile}
                  />
                </div>
              </div>
            )}

            {Array.isArray(profile.employmentHistory) &&
            profile.employmentHistory.length > 0 ? (
              profile.employmentHistory.map((employment, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-1 gap-4 pb-4 border-b border-gray-300"
                >
                  <div className="relative">
                    <div className="absolute top-0 right-0">
                      {isEditingEmploymentInfo ? (
                        <>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEmploymentInfo}
                              className="p-2 rounded-lg bg-green-500 text-white flex items-center space-x-2"
                            >
                              <Check className="w-4 h-4" />
                              <span>Save</span>{" "}
                            </button>
                            <button
                              onClick={() => setIsEditingEmploymentInfo(false)}
                              className="p-2 rounded-lg bg-red-500 text-white flex items-center space-x-2"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>{" "}
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleEditEmploymentClick}
                            className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-800 hover:text-white"
                          >
                            <Edit className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteClick(employment.empH_id)
                            }
                            className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-800 hover:text-white"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <ConfirmationModal
                            isOpen={isModalOpen}
                            onRequestClose={() => setIsModalOpen(false)}
                            onConfirm={handleConfirmEmployementHistoryDelete}
                            message="Are you sure you want to delete this employment record?"
                          />
                        </>
                      )}
                    </div>

                    <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        Position Name:
                      </label>
                      {isEditingEmploymentInfo ? (
                        <input
                          type="text"
                          name={`employmentHistory.${index}.empH_positionName`}
                          value={
                            editData.employmentHistory?.[index]
                              ?.empH_positionName ||
                            employment.empH_positionName ||
                            ""
                          }
                          onChange={handleChange}
                          className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                        />
                      ) : (
                        <p className="text-gray-800 font-semibold mt-1">
                          {employment.empH_positionName || "N/A"}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        Company Name:
                      </label>
                      {isEditingEmploymentInfo ? (
                        <input
                          type="text"
                          name={`employmentHistory.${index}.empH_companyName`}
                          value={
                            editData.employmentHistory?.[index]
                              ?.empH_companyName ||
                            employment.empH_companyName ||
                            "N/A"
                          }
                          onChange={handleChange}
                          className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                        />
                      ) : (
                        <p className="text-gray-800 font-semibold mt-1">
                          {employment.empH_companyName || "N/A"}
                        </p>
                      )}
                    </div>
                    {/* Date Fields */}
                    <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        Start Date:
                      </label>
                      {isEditingEmploymentInfo ? (
                        <input
                          type="date"
                          name={`employmentHistory.${index}.empH_startdate`}
                          value={
                            editData.employmentHistory?.[index]
                              ?.empH_startdate ||
                            employment.empH_startdate ||
                            ""
                          }
                          onChange={handleChange}
                          className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                        />
                      ) : (
                        <p className="text-gray-800 font-semibold mt-1">
                          {employment.empH_startdate || "N/A"}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        End Date:
                      </label>
                      {isEditingEmploymentInfo ? (
                        <input
                          type="date"
                          name={`employmentHistory.${index}.empH_enddate`}
                          value={
                            editData.employmentHistory?.[index]?.empH_enddate ||
                            employment.empH_enddate ||
                            "N/A"
                          }
                          onChange={handleChange}
                          className="text-gray-800 font-semibold mt-1 w-full border-b-2 pb-2 bg-transparent"
                        />
                      ) : (
                        <p className="text-gray-800 font-semibold mt-1">
                          {employment.empH_enddate || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No employment history available.</p>
            )}
          </div>
        );

      case "Skills":
        return (
          <div className="p-4 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Skills</h3>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedSkill({});
                  setShowAddModal(true);
                }}
                className="p-2 flex items-center bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 ease-in-out"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Add New Skill</span>
              </button>
            </div>

            {showAddModal && (
              <div className="col-span-1 md:col-span-1 mt-4">
                <div className="bg-transparent rounded-lg p-6 w-full">
                  <UpdateSkill
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    skill={{}}
                    setUpdateTrigger={setUpdateTrigger}
                    skills={skills}
                    fetchProfile={fetchProfile}
                    profile={profile}
                  />
                </div>
              </div>
            )}

            {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-1 md:grid-cols-1 gap-4 pb-4 border-b border-gray-300"
                >
                  <div className="absolute top-0 right-0">
                    <button
                      onClick={() => handleEditSkillClick(skill, index)}
                      className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-600 hover:text-white"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(skill.skills_id)}
                      className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-800 hover:text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <ConfirmationModal
                      isOpen={isModalOpen}
                      onRequestClose={() => setIsModalOpen(false)}
                      onConfirm={handleConfirmSkillDelete}
                      message="Are you sure you want to delete this skill record?"
                    />
                  </div>

                  <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                    <label className="block text-gray-600 text-sm font-normal">
                      Skills:
                    </label>
                    <p className="text-gray-800 font-semibold mt-1">
                      {skill.perS_name || "N/A"}
                    </p>
                  </div>

                  {/* Modal */}
                  {selectedIndex === index && showSkillModal && (
                    <div className="col-span-1 md:col-span-1 mt-4">
                      <div className="bg-transparent rounded-lg p-6 w-full">
                        <UpdateSkill
                          showModal={showSkillModal}
                          setShowModal={setShowSkillModal}
                          skill={selectedSkill}
                          setUpdateTrigger={setUpdateTrigger}
                          skills={skills}
                          fetchProfile={fetchProfile}
                          profile={profile}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No skills available.</p>
            )}
          </div>
        );

      case "Training":
        return (
          <div className="p-4 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Training</h3>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedTraining({}); // Empty object for adding new skill
                  setShowAddModal(true);
                }}
                className="p-2 flex items-center bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 ease-in-out"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Add New Training</span>
              </button>
            </div>

            {showAddModal && (
              <div className="col-span-1 md:col-span-1 mt-4">
                <div className="bg-transparent rounded-lg p-6 w-full">
                  <UpdateTraining
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    train={{}}
                    trainings={trainings}
                    fetchProfile={fetchProfile}
                    profile={profile}
                  />
                </div>
              </div>
            )}

            {Array.isArray(profile.training) && profile.training.length > 0 ? (
              profile.training.map((train, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-1 md:grid-cols-1 gap-4 pb-4 border-b border-gray-300"
                >
                  <div className="relative">
                    {/* Edit Icon Button */}
                    <div className="absolute top-0 right-0">
                      <button
                        onClick={() => handleEditTrainingClick(train, index)}
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-600 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(train.training_id)}
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-800 hover:text-white"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <ConfirmationModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmTrainingDelete}
                        message="Are you sure you want to delete this Training record?"
                      />
                    </div>

                    <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        Training:
                      </label>
                      <p className="text-gray-800 font-semibold mt-1">
                        {train.perT_name || "N/A"}
                      </p>

                      {train.training_image && (
                        <div className="mt-4">
                          <label className="block text-gray-600 text-sm font-normal">
                            Training Image:
                          </label>
                          <img
                            src={`http://localhost/php-delmonte/api/uploads/${train.training_image}`}
                            alt={train.perT_name}
                            className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedIndex === index && showTrainingModal && (
                    <div className="col-span-1 md:col-span-1 mt-4">
                      <div className="bg-transparent rounded-lg p-6 w-full">
                        <UpdateTraining
                          showModal={showTrainingModal}
                          setShowModal={setShowTrainingModal}
                          train={selectedTraining}
                          trainings={trainings}
                          fetchProfile={fetchProfile}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No Training available.</p>
            )}
          </div>
        );

      case "Knowledge":
        return (
          <div className="p-4 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Knowledge</h3>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedKnowledge({}); // Empty object for adding new skill
                  setShowAddModal(true);
                }}
                className="p-2 flex items-center bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 ease-in-out"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Add New Knowledge</span>
              </button>
            </div>

            {showAddModal && (
              <div className="col-span-1 md:col-span-1 mt-4">
                <div className="bg-transparent rounded-lg p-6 w-full">
                  <UpdateKnowledge
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    know={selectedKnowlegde}
                    knowledges={knowledges}
                    fetchProfile={fetchProfile}
                    profile={profile}
                    handleConfirmKnowledgeDelete={handleConfirmKnowledgeDelete}
                  />
                </div>
              </div>
            )}

            {Array.isArray(profile.knowledge) &&
            profile.knowledge.length > 0 ? (
              profile.knowledge.map((know, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-1 md:grid-cols-1 gap-4 pb-4 border-b border-gray-300"
                >
                  <div className="relative">
                    {/* Edit Icon Button */}
                    <div className="absolute top-0 right-0">
                      <button
                        onClick={() => handleEditKnowledgeClick(know, index)}
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-600 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" /> {/* Lucide Edit Icon */}
                      </button>

                      <button
                        onClick={() => handleDeleteClick(know.canknow_id)}
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-800 hover:text-white"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <ConfirmationModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmKnowledgeDelete}
                        message="Are you sure you want to delete this Knowledge record?"
                      />
                    </div>

                    <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        Knowledge:
                      </label>
                      <p className="text-gray-800 font-semibold mt-1">
                        {know.knowledge_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Modal */}
                  {selectedIndex === index && showKnowledgeModal && (
                    <div className="col-span-1 md:col-span-1 mt-4">
                      <div className="bg-transparent rounded-lg p-6 w-full">
                        <UpdateKnowledge
                          showModal={showKnowledgeModal}
                          setShowModal={setShowKnowledgeModal}
                          know={selectedKnowlegde}
                          knowledges={knowledges}
                          fetchProfile={fetchProfile}
                          handleConfirmKnowledgeDelete
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No Knowledge available.</p>
            )}
          </div>
        );

      case "License":
        return (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:mb-6">
              License
            </h3>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedLicense({});
                  setShowAddModal(true);
                }}
                className="p-2 flex items-center bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 ease-in-out"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Add New License</span>
              </button>
            </div>

            {showAddModal && (
              <div className="col-span-1 md:col-span-1 mt-4">
                <div className="bg-transparent rounded-lg p-6 w-full">
                  <UpdateLicense
                    showLicenseModal={showAddModal}
                    setShowLicenseModal={setShowAddModal}
                    selectedLicense={{}}
                    licenses={licenses}
                    fetchProfile={fetchProfile}
                    profile={profile}
                  />
                </div>
              </div>
            )}

            {Array.isArray(profile.license) && profile.license.length > 0 ? (
              profile.license.map((lic, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 pb-4 sm:pb-6 border-b border-gray-300"
                >
                  <div className="relative">
                    <div className="absolute top-0 right-0">
                      <button
                        onClick={() => handleEditLicenseClick(lic, index)}
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-600 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(lic.license_id)}
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-800 hover:text-white"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <ConfirmationModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmLicenseDelete}
                        message="Are you sure you want to delete this License record?"
                      />
                    </div>

                    {/* License Name */}
                    <div className="bg-gray-200 p-3 sm:p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        License name:
                      </label>
                      <p className="text-gray-800 font-semibold mt-1">
                        {lic.license_master_name || "N/A"}
                      </p>
                    </div>

                    {/* License Type */}
                    <div className="bg-gray-200 p-3 sm:p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        License Type:
                      </label>
                      <p className="text-gray-800 font-semibold mt-1">
                        {lic.license_type_name || "N/A"}
                      </p>
                    </div>

                    {/* License Number */}
                    <div className="bg-gray-200 p-3 sm:p-4 rounded-lg border shadow-lg">
                      <label className="block text-gray-600 text-sm font-normal">
                        License number:
                      </label>
                      <p className="text-gray-800 font-semibold mt-1">
                        {lic.license_number || "N/A"}
                      </p>
                    </div>

                    {/* Modal */}
                    {selectedIndex === index && showLicenseModal && (
                      <div className="col-span-1 md:col-span-2 mt-4">
                        <div className="bg-transparent rounded-lg p-6 w-full">
                          <UpdateLicense
                            showLicenseModal={showLicenseModal}
                            setShowLicenseModal={setShowLicenseModal}
                            selectedLicense={selectedLicense}
                            licenses={licenses}
                            fetchProfile={fetchProfile}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm sm:text-base text-gray-600">
                No licenses available.
              </p>
            )}
          </div>
        );

      case "Resume":
        return (
          <div className="p-4 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Resume</h3>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedTraining({});
                  setShowAddModal(true);
                }}
                className="p-2 flex items-center bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 ease-in-out"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Add New Resume</span>
              </button>
            </div>

            {showAddModal && (
              <div className="col-span-1 md:col-span-1 mt-4">
                <div className="bg-transparent rounded-lg p-6 w-full">
                  <UpdateResume
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    res={{}}
                    // trainings={trainings}
                    fetchProfile={fetchProfile}
                    profile={profile}
                  />
                </div>
              </div>
            )}

            {Array.isArray(profile.resume) && profile.resume.length > 0 ? (
              profile.resume.map((res, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-1 md:grid-cols-1 gap-4 pb-4 border-b border-gray-300"
                >
                  <div className="relative">
                    <div className="absolute top-0 right-0">
                      <button
                        onClick={() => handleEditResumeClick(res, index)}
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-600 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(res.canres_id)}
                        className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-800 hover:text-white"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <ConfirmationModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmResumeDelete}
                        message="Are you sure you want to delete this Resume record?"
                      />
                    </div>

                    <div className="bg-gray-200 p-4 rounded-lg border shadow-lg">
                      {res.canres_image && (
                        <div className="mt-4">
                          <label className="block text-gray-600 text-sm font-normal">
                            Resume Image:
                          </label>
                          <img
                            src={`http://localhost/php-delmonte/api/uploads/${res.canres_image}`}
                            alt={res.canres_name}
                            className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedIndex === index && showResumeModal && (
                    <div className="col-span-1 md:col-span-1 mt-4">
                      <div className="bg-transparent rounded-lg p-6 w-full">
                        <UpdateResume
                          showModal={showResumeModal}
                          setShowModal={setShowResumeModal}
                          res={selectedResume}
                          // trainings={trainings}
                          fetchProfile={fetchProfile}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No Resume available.</p>
            )}
          </div>
        );
      default:
        return <div>Select a section to view.</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div
        ref={modalRef}
        className="flex flex-col md:flex-row w-full md:w-3/4 lg:w-2/3 h-screen md:h-full"
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Hamburger icon for mobile */}
            <button
              className="md:hidden text-white p-4"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FaBars size={24} />
            </button>

            {/* Sidebar (hidden on mobile unless toggled) */}
            <aside
              className={`${
                isSidebarOpen ? "block" : "hidden"
              } md:block w-full md:w-1/3 p-4 md:rounded-l-lg ${
                isDarkMode ? "bg-gray-800" : "bg-[#0A6338]"
              } text-white`}
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-10">
                Account Details
              </h2>
              <ul>
                {[
                  "Personal Information",
                  "Educational Background",
                  "Employment History",
                  "Skills",
                  "Training",
                  "Knowledge",
                  "License",
                  "Resume",
                ].map((section) => (
                  <li
                    key={section}
                    className={`cursor-pointer py-2 px-4 ${
                      activeSection === section ? "bg-green-600" : ""
                    } rounded-md mb-2`}
                    onClick={() => handleSectionClick(section)}
                  >
                    {section}
                  </li>
                ))}
              </ul>
            </aside>

            <main className="flex-1 p-4 md:p-6 md:rounded-r-lg relative h-screen md:h-auto max-h-screen overflow-y-auto scrollbar-custom bg-[#F4F7FC]">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-3xl"
              >
                &times;
              </button>

              <div className="flex-1 overflow-y-auto scrollbar-custom">
                {/* Card for renderSection */}
                <div className="bg-[#F4F7FC] p-1 rounded-lg shadow-md">
                  {renderSection()}
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
