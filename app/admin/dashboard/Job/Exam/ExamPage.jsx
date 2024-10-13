import { formatDate } from '@/app/signup/page';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function ExamPage({ examData, getSelectedJob }) {
  const [examMaster, setExamMaster] = useState([]);
  const [questionMaster, setQuestionMaster] = useState([]);

  useEffect(() => {
    setExamMaster(examData.examMaster[0]);
    setQuestionMaster(examData.questionMaster.questions);
    console.log("examData: ", examData);
  }, [examData]);

  return (
    <div className='rounded-md p-4'>
      {examData === 0 ? (
        <>
          <p>No exam created yet</p>
        </>
      ) : (
        <>
          <div className='flex flex-col'>
            <div className='flex md:justify-center'>
              <Card className='mb-3 flex flex-col gap-1 bg-background w-full md:w-1/2'>
                <CardContent className='p-3'>
                  <h1 className='text-2xl font-boldtext-start'>
                    {examMaster.exam_name}
                  </h1>
                  <p>Exam duration: {examMaster.exam_duration} minutes</p>
                  <p className='text-sm'>Date created: {examMaster.exam_createdAt ? formatDate(examMaster.exam_createdAt) : 'N/A'}</p>
                  <p className='text-sm'>Date updated: {examMaster.exam_updatedAt ? formatDate(examMaster.exam_updatedAt) : 'N/A'}</p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
              {questionMaster.map((question, index) => (
                <Card key={index} className='mb-3 bg-background w-full flex flex-col'>
                  <CardContent className="p-3 flex-grow">
                    <div className='grid grid-cols-3 gap-2'>
                      <p className='mb-4 text-lg font-bold col-span-2'>{question.examQ_text}</p>
                      <div className='flex flex-row gap-4 justify-end'>
                        <Edit2 size={20} className='cursor-pointer' />
                        <Trash2 size={20} className='cursor-pointer' />
                      </div>
                    </div>
                    <RadioGroup defaultValue={question.options.find(opt => opt.examC_isCorrect === 1)?.examC_id.toString()}>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                          <RadioGroupItem
                            value={option.examC_id.toString()}
                            id={`${option.examC_id}`}
                            disabled
                            checked={option.examC_isCorrect === 1}
                          />
                          <Label htmlFor={`${option.examC_id}`}>{option.examC_text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Badge className="ml-auto">Points {question.examQ_points}</Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ExamPage
