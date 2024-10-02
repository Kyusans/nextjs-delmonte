import { retrieveData } from '@/app/utils/storageUtils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import { DialogTrigger } from '@radix-ui/react-dialog'
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
      if (res.data !== 0) {
        setResultData(res.data);
        setCriteriaScore(res.data.criteriaScore);
      } else {
        setResultData({});
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
      <Dialog>
        <DialogTrigger>
          <Button>Interview result</Button>
        </DialogTrigger>
        <DialogContent>
          <ScrollArea>
            <DialogTitle className="mb-3">Interview result</DialogTitle>
            <DialogDescription></DialogDescription>
            {isLoading ? <Spinner /> :
              <>
                <Card>
                  <CardContent>
                    {/* <pre>{JSON.stringify(resultData, null, 2)}</pre> */}
                    {criteriaScore.map((element, index) => (
                      <>
                        <div className="mt-3" key={index}>
                          <Label htmlFor="name" className="text-right">
                            {element.inter_criteria_name}
                          </Label>
                          <Input
                            id="name"
                            defaultValue={`${element.candPoints} / ${element.totalPoints}`}
                            className="col-span-3"
                            readOnly
                          />
                        </div>
                      </>
                    ))}
                    <Separator className="my-3" />
                    <div className='mt-3 grid grid-cols-2'>
                      <p>Total Score</p>
                      <p className={`text-right `}>
                        {resultData.candTotalPoints} / {resultData.totalPoints}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            }
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InterviewResult