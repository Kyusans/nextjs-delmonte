"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { retrieveData } from "@/app/utils/storageUtils";
import { toast } from "sonner";
import Tesseract from "tesseract.js";
import stringSimilarity from "string-similarity";

const UpdateResume = ({
  showModal,
  setShowModal,
  res,
  fetchProfile,
  selectedResume,
}) => {
  const [data, setData] = useState({
    canres_id: res?.canres_id || "",
    image: null,
    canres_image: res?.canres_image || "",
  });
  //   const [expectedResumeKeywords, setExpectedResumeKeywords] = useState([]);

  const [profileData, setProfileData] = useState({
    candidateInfo: [],
    educationalBackground: [],
    employmentHistory: [],
    skills: [],
  });

  const [loading, setLoading] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);

  useEffect(() => {
    if (res) {
      setData({
        canres_id: res?.canres_id || "",
        image: null,
        canres_image: res?.canres_image || "",
      });
    }
  }, [res]);

  useEffect(() => {
    if (selectedResume) {
      setData({
        canres_id: selectedResume.canres_id || "",
        canres_image: selectedResume.canres_image || "",
      });
    }
  }, [selectedResume]);

  useEffect(() => {
    fetchProfileKeywords();
  }, []);

  const fetchProfileKeywords = async () => {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const cand_id = retrieveData("user_id");
      const jsonData = { cand_id };
      const formData = new FormData();
      formData.append("operation", "getCandidateExpectedKeywords");
      formData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, formData);
      if (response.data) {
        const {
          candidateInfo = [],
          educationalBackground = [],
          employmentHistory = [],
          skills = [],
        } = response.data;
        setProfileData({
          candidateInfo,
          educationalBackground,
          employmentHistory,
          skills,
        });
      } else {
        console.error("No data received from response");
      }
    } catch (error) {
      console.error("Error fetching candidate profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, image: file });
    }
  };

  const processImage = async (file) => {
    const result = await Tesseract.recognize(file, "eng", {
      logger: (info) => console.log(info),
    });
    return result.data.text;
  };

  const normalizeText = (text) =>
    text
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[-.,]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const validateResume = (extractedText) => {
    const normalizedText = normalizeText(extractedText);

    const expectedResumeKeywords = [
      profileData.candidateInfo.fullName,
      ...profileData.educationalBackground.courses,
      ...profileData.educationalBackground.institutions,
      ...profileData.employmentHistory.companies,
      ...profileData.employmentHistory.positions,
      ...profileData.skills,
    ];

    let allKeywordsPresent = true;

    expectedResumeKeywords.forEach((keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      if (!normalizedText.includes(normalizedKeyword)) {
        console.log(`Keyword not found: "${normalizedKeyword}"`);
        allKeywordsPresent = false;  
      }
    });

    return allKeywordsPresent;
  };

  const handleSave = async () => {
    if (
      profileData.skills.length === 0 ||
      profileData.employmentHistory.length === 0 ||
      profileData.educationalBackground.length === 0
    ) {
      toast.error(
        "Please complete your profile information before uploading the resume."
      );
      return;
    }

    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const cand_id = retrieveData("user_id");
      let textFromImage = "";

      if (data.image) {
        setProcessingImage(true);
        textFromImage = await processImage(data.image);
        setProcessingImage(false);
      }

      if (data.image && !validateResume(textFromImage)) {
        toast.error("Resume content does not match the expected profile data.");
        setLoading(false);
        return;
      }

      const updatedData = {
        cand_id: cand_id,
        resume: [
          {
            canres_id: data.canres_id || null,
            image: data.image ? data.image.name : data.canres_image,
          },
        ],
      };

      const formData = new FormData();
      formData.append("operation", "updateCandidateResume");
      formData.append("json", JSON.stringify(updatedData));

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        toast.success("Resume updated successfully.");
        if (fetchProfile) {
          fetchProfile();
        }
        setShowModal(false);
      } else {
        console.error("Failed to update resume:", response.data);
      }
    } catch (error) {
      console.error("Error updating resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal ${showModal ? "block" : "hidden"}`}>
      <div className="modal-content bg-gray-200 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Update Resume
        </h3>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Current Image:
          </label>
          {data.canres_image && (
            <div className="mb-2">
              <img
                src={`http://localhost/php-delmonte/api/uploads/${data.canres_image}`}
                alt="Current Resume"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-500 mt-2">
                Current image: {data.canres_image}
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-2">Choose a new image:</p>
          <div className="relative w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 16.5V7a2 2 0 012-2h2.586a2 2 0 011.414.586l1.828 1.828a2 2 0 001.414.586H19a2 2 0 012 2v7.5m-8 0v6m-4-6v6m8-6v6"
                />
              </svg>
              <span className="ml-2 text-gray-600">
                {data.image ? data.image.name : "Choose File"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 mr-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400 transition"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
        {processingImage && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-8 h-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
            <p className="ml-2 text-green-500">Processing image...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateResume;
