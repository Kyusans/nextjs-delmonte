"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { retrieveData } from "@/app/utils/storageUtils";
import Select from "react-select";
import { toast } from "sonner";
import Tesseract from "tesseract.js";
import stringSimilarity from "string-similarity";

const UpdateTraining = ({
  showModal,
  setShowModal,
  train,
  fetchProfile,
  trainings,
  selectedTraining,
  profile,
}) => {
  const [data, setData] = useState({
    training_id: train?.training_id || "",
    perT_id: train?.training_perTId || "",
    perT_name: train?.perT_name || "",
    training_title: "", // New field for training title
    image: null,
    training_image: train?.training_image || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (train) {
      setData({
        training_id: train.training_id || "",
        perT_id: train.training_perTId || "",
        perT_name: train.perT_name || "",
        training_image: train.training_image || "",
        training_title: "", // Clear title when train changes
      });
    }
  }, [train]);

  useEffect(() => {
    if (selectedTraining) {
      setData({
        training_id: selectedTraining.training_id || "",
        perT_id: selectedTraining.training_perTId || "",
        perT_name: selectedTraining.perT_name || "",
        training_image: selectedTraining.training_image || "",
        training_title: "", // Clear title when selected training changes
      });
    }
  }, [selectedTraining]);

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
      perT_id: selectedOption ? selectedOption.value : "",
      perT_name: selectedOption ? selectedOption.label : "",
    });
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
      const cand_id = retrieveData("user_id");

      let textFromImage = "";
      if (data.image) {
        textFromImage = await processImage(data.image);
      }

      const normalizedTextFromImage = textFromImage.trim().toLowerCase();
      const normalizedTrainingTitle = data.training_title.trim().toLowerCase(); // Compare with title
      const normalizedTrainingName = data.perT_name.trim().toLowerCase();

      // First, check the image text against the training title
      if (
        data.image &&
        !normalizedTextFromImage.includes(normalizedTrainingTitle) &&
        !normalizedTrainingTitle.includes(normalizedTextFromImage)
      ) {
        toast.error("The certificate image does not match the training title.");
        setLoading(false);
        return;
      }

      // Then, check if the title matches or is similar to the selected training name
      const similarity = stringSimilarity.compareTwoStrings(
        normalizedTrainingTitle,
        normalizedTrainingName
      );

      const similarityThreshold = 0.6;
      if (similarity < similarityThreshold) {
        toast.error("The training title does not match the selected training.");
        setLoading(false);
        return;
      }

      const updatedData = {
        cand_id: cand_id,
        training: [
          {
            training_id: data.training_id || null,
            perT_id: data.perT_id || train?.training_perTId,
            image: data.image ? data.image.name : data.training_image,
          },
        ],
      };

      console.log("Update Training:", updatedData);

      const formData = new FormData();
      formData.append("operation", "updateCandidateTraining");
      formData.append("json", JSON.stringify(updatedData));

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.data === 1) {
        console.log("Training updated successfully.");
        toast.success("Training updated successfully.");
        if (fetchProfile) {
          fetchProfile();
        }
        setShowModal(false);
      } else {
        console.error("Failed to update training:", response.data);
      }
    } catch (error) {
      console.error("Error updating training:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedOption = (options, value) =>
    options.find((option) => option.value === value);

  return (
    <div className={`modal ${showModal ? "block" : "hidden"}`}>
      <div className="modal-content bg-gray-200 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Update Training
        </h3>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Select Training:
          </label>
          <Select
            name="perT_id"
            value={getSelectedOption(
              trainings.map((training) => ({
                value: training.perT_id,
                label: training.perT_name,
              })),
              data.perT_id
            )}
            onChange={handleSelectChange}
            options={trainings.map((training) => ({
              value: training.perT_id,
              label: training.perT_name,
            }))}
            placeholder={data.perT_name || "Select Training"}
            isSearchable
            className="w-full"
          />
        </div>

        {/* Training Title Field */}
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Training Title:
          </label>
          <input
            type="text"
            name="training_title"
            value={data.training_title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Training Title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-normal">
            Current Image:
          </label>

          {data.training_image && (
            <div className="mb-2">
              <img
                src={`http://localhost/php-delmonte/api/uploads/${data.training_image}`}
                alt="Current Training"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-500 mt-2">
                Current image: {data.training_image}
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

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-8 h-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
            <p className="ml-2 text-green-500">Processing image...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTraining;
