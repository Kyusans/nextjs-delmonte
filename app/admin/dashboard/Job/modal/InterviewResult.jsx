import { retrieveData } from '@/app/utils/storageUtils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/components/ui/spinner'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import ConductInterview from './ConductInterview'
import { toast } from 'sonner'

const InterviewResult = ({ candId, handleInterviewChangeStatus }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [resultData, setResultData] = useState([]);
  const [criteriaScore, setCriteriaScore] = useState([]);
  const [hasCriteria, setHasCriteria] = useState(true);

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
      if (res.data === -1) {
        setHasCriteria(false);
      } else if (res.data !== 0) {
        setHasCriteria(true);
        setResultData(res.data.totalPoints);
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

  // modal for conduct interview
  const [showConductInterview, setShowConductInterview] = useState(false);
  const handleShowConductInterview = () => {
    setShowConductInterview(true);
  };
  const handleCloseConductInterview = () => {
    setShowConductInterview(false);
  };

  useEffect(() => {
    getCandInterviewResult();
  }, [getCandInterviewResult])

  return (
    <div>
      {isLoading ? <Spinner /> :
        <>
          {hasCriteria ? (
            <div>
              <div className='mb-3'>
                <p>Total Score: {resultData.candTotalPoints} / {resultData.criteriaTotalPoints}</p>
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
                      disabled
                    />
                  </div>
                </>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center'>
              <p className="text-center mb-3">Interview criteria updated or deleted</p>
              <Button onClick={() => handleShowConductInterview()}>Reinterview applicant</Button>
            </div>
          )}

        </>
      }
      {showConductInterview && (
        <ConductInterview
          open={showConductInterview}
          onHide={handleCloseConductInterview}
          candId={candId}
          handleInterviewChangeStatus={handleInterviewChangeStatus}
        />
      )}
    </div>
  )
}

export default InterviewResult