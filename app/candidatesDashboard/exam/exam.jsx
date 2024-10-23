import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { retrieveData } from "@/app/utils/storageUtils";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ExamModal = ({ jobMId, jobTitle, onClose, jobPercentage }) => {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [examId, setExamId] = useState(null);
  const [questionPoints, setQuestionPoints] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // New state for pagination

  const questionsPerPage = 5; // Limit of questions per page

  console.log("examid:", examId);

  console.log("jobpercentage", jobPercentage);

  const fetchExamData = useCallback(async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";
    const jobId = retrieveData("jobMId");

    const jsonData = { jobM_id: jobMId };

    const formData = new FormData();
    formData.append("operation", "getJobExam");
    formData.append("json", JSON.stringify(jsonData));

    console.log("id:", jobId);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response data:", response.data);

      if (response.data && response.data.examQuestions) {
        setExamData(response.data.examQuestions);
        setExamId(response.data.examQuestions[0]?.exam_id);

        const pointsArray = response.data.examQuestions.map(
          (q) => q.examQ_points
        );
        setQuestionPoints(pointsArray);
        setLoading(false);
      } else {
        throw new Error("No exam questions found");
      }
    } catch (error) {
      console.error("Error fetching exam data:", error);
      setError("Failed to load exam data.");
      setLoading(false);
    }
  }, [jobMId]);

  useEffect(() => {
    fetchExamData();
  }, [fetchExamData]);

  const handleAnswerChange = (questionId, choiceId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleSubmit = async () => {
    const candidateId = retrieveData("user_id");
    const url = process.env.NEXT_PUBLIC_API_URL + "users.php";

    try {
      let totalScore = 0;
      const totalPoints = questionPoints.reduce(
        (acc, points) => acc + points,
        0
      );
      const passingScore = (totalPoints * jobPercentage) / 100;
      console.log("pass score:", passingScore);

      const answers = Object.keys(selectedAnswers).map((questionId) => {
        const question = examData.find(
          (q) => q.examQ_id.toString() === questionId
        );
        const selectedChoiceId = selectedAnswers[questionId];

        if (!question) {
          console.error(
            `Question with ID ${questionId} not found in examData.`
          );
          return {
            question_id: questionId,
            multiple_choice_answer: selectedChoiceId,
            essay_answer: null,
            points_earned: 0,
          };
        }

        const selectedChoice = question.choices.find(
          (choice) => choice.examC_id === selectedChoiceId
        );
        let pointsEarned = 0;

        if (selectedChoice && selectedChoice.examC_isCorrect === 1) {
          const questionIndex = examData.findIndex(
            (q) => q.examQ_id.toString() === questionId
          );
          totalScore += questionPoints[questionIndex];
          pointsEarned = questionPoints[questionIndex];
        }

        return {
          question_id: questionId,
          multiple_choice_answer: selectedChoiceId,
          essay_answer: null,
          points_earned: pointsEarned,
        };
      });

      const resultData = {
        examR_candId: candidateId,
        examR_examId: examId,
        examR_score: totalScore,
        examR_status: totalScore > passingScore ? 1 : 0,
        examR_totalscore: totalPoints,
        app_id: retrieveData("app_id"),
      };

      console.log("Result data:", resultData);

      const resultFormData = new FormData();
      resultFormData.append("operation", "insertExamResult");
      resultFormData.append("json", JSON.stringify(resultData));

      const resultResponse = await axios.post(url, resultFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Insert exam result response:", resultResponse.data);

      const { success, examR_id } = resultResponse.data;
      if (!success || !examR_id) {
        throw new Error("Failed to insert exam result.");
      }

      const answerData = {
        examR_id: examR_id,
        answers: answers,
      };

      const answerFormData = new FormData();
      answerFormData.append("operation", "insertCandidateAnswers");
      answerFormData.append("json", JSON.stringify(answerData));

      const answerResponse = await axios.post(url, answerFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Insert candidate answers response:", answerResponse.data);

      if (answerResponse.data.success) {
        toast.success("Exam submitted successfully!");
        window.location.reload();
      } else {
        toast.error("Error submitting answers: " + answerResponse.data.message);
      }
    } catch (error) {
      console.error("Error during exam submission:", error);
      alert("Failed to submit exam and answers.");
    }
  };

  const calculateProgress = () => {
    if (!examData) return 0;
    const answered = Object.keys(selectedAnswers).length;
    return (answered / examData.length) * 100;
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(examData.length / questionsPerPage) - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const isAllAnswered = () => {
    return examData.every((question) => selectedAnswers[question.examQ_id]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-gray-100 shadow-md">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">
            <span className="text-3xl font-bold text-blue-500">{jobTitle}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <p className="text-gray-600">Loading exam data...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : examData && examData.length > 0 ? (
            <>
              {/* Progress Bar */}
              <div className="w-full bg-gray-300 rounded-full h-2 sticky top-0 z-10">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                {examData
                  .slice(
                    currentPage * questionsPerPage,
                    (currentPage + 1) * questionsPerPage
                  )
                  .map((question) => (
                    <div
                      key={question.examQ_id}
                      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl border border-gray-200"
                    >
                      <p className="text-lg font-semibold mb-4 text-gray-800">
                        {question.examQ_text}
                      </p>
                      <div className="space-y-3">
                        {question.choices.map((choice) => (
                          <label
                            key={choice.examC_id}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="radio"
                              name={`question-${question.examQ_id}`}
                              value={choice.examC_id}
                              checked={
                                selectedAnswers[question.examQ_id] ===
                                choice.examC_id
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  question.examQ_id,
                                  choice.examC_id
                                )
                              }
                              className={`appearance-none h-4 w-4 border-2 rounded-full transition-all duration-200
                                ${
                                  selectedAnswers[question.examQ_id] ===
                                  choice.examC_id
                                    ? "bg-green-600  ring-2 ring-gray-600"
                                    : "border-gray-600"
                                }`}
                            />
                            <span className="text-gray-700 text-md">
                              {choice.examC_text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between p-4">
                {currentPage > 0 && ( // Show Previous button only if not on the first page
                  <button
                    onClick={handlePreviousPage}
                    className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400 transition"
                  >
                    Previous
                  </button>
                )}
                <div className="flex-grow" />{" "}
                {/* This div takes up space to push the Next button to the right */}
                {currentPage <
                  Math.ceil(examData.length / questionsPerPage) - 1 && ( // Show Next button only if not on the last page
                  <button
                    onClick={handleNextPage}
                    className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400 transition"
                  >
                    Next
                  </button>
                )}
              </div>

              {/* Submit Button */}
              {isAllAnswered() && (
                <div className="p-4 border-t flex justify-end bg-gray-100">
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white rounded px-6 py-2 hover:bg-green-700 transition"
                  >
                    Submit Exam
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600">No exam data found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
