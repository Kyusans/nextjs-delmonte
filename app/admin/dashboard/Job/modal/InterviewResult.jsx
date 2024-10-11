import { retrieveData } from '@/app/utils/storageUtils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const InterviewResult = ({ candId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [resultData, setResultData] = useState([]);
  const [criteriaScore, setCriteriaScore] = useState([]);

  const getCandInterviewResult = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "admin.php";
      const jsonData = {
        jobId: retrieveData("jobId"),
        candId: candId
      }
      console.log("jsonData: ", JSON.stringify(jsonData));
      const formData = new FormData();
      formData.append("operation", "getCandInterviewResult");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("getCandInterviewResult: ", res.data);
      if (res.data !== 0) {
        setResultData(res.data.totalPoints[0]);
        setCriteriaScore(res.data.candCriteriaPoints);
      } else {
        setResultData([]);
      }
      console.log("getCandInterviewResult: ", res.data);
    } catch (error) {
      toast.error("Network error");
      console.log("InterviewResult.jsx => getCandInterviewResult error: " + error);
    } finally {
      setIsLoading(false);
    }
  }, [candId])

  useEffect(() => {
    getCandInterviewResult();
  }, [getCandInterviewResult])

  return (
    <div>
      {isLoading ? <Spinner /> :
        <>
          <div>
            <div className='mb-3 grid grid-cols-2'>
              <p>Total Score</p>
              <p>
                {resultData.candTotalPoints} / {resultData.criteriaTotalPoints}
              </p>
            </div>
            {criteriaScore.map((element, index) => (
              <>
                <div className="mt-3" key={index}>
                  <Label htmlFor="name">
                    {element.criteria_inter_name}
                  </Label>
                  <Input
                    id="name"
                    defaultValue={`${element.CandPoints} / ${element.CriteriaPoint}`}
                    className="col-span-3"
                    readOnly
                  />
                </div>
              </>
            ))}

          </div>
        </>
      }

    </div>
  )
}

export default InterviewResult