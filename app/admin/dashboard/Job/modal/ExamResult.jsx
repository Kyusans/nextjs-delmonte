import { retrieveData } from '@/app/utils/storageUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/app/signup/page';

const ExamResult = ({ candId }) => {
  const [examResult, setExamResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCandidateExamPoints = useCallback(async () => {
    setIsLoading(true);
    try {
      const examId = retrieveData("examId");
      const url = process.env.NEXT_PUBLIC_API_URL + "admin.php";
      const jsonData = { candidateId: candId, examId: examId }
      const formData = new FormData();
      formData.append("operation", "getCandidateExamPoints");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      if (res.data && res.data.length > 0) {
        setExamResult(res.data[0]);
      } else {
        setExamResult(null);
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [candId]);

  useEffect(() => {
    getCandidateExamPoints();
  }, [getCandidateExamPoints]);

  const calculatePercentage = (score, totalScore) => {
    return (score / totalScore) * 100;
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <Spinner />
      ) : examResult ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Exam Result</h2>
          <div>
            <p className="text-sm font-medium">Score</p>
            <p className="text-2xl font-bold">{examResult.examR_score} / {examResult.examR_totalscore}</p>
          </div>
          <Progress value={calculatePercentage(examResult.examR_score, examResult.examR_totalscore)} className="w-full" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Date Taken</p>
              <p>{formatDate(examResult.examR_date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p>{examResult.examR_status === 1 ? 'Passed' : 'Failed'}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No exam result found</p>
      )}
    </div>
  )
}

export default ExamResult
