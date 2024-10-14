import { formatDate } from '@/app/signup/page';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import CreateExamMaster from './modal/CreateExamMaster';
import AddExamQuestion from './modal/AddExamQuestion';
import UpdateExamQuestion from './modal/UpdateExamQuestion';

function ExamPage({ examData, getSelectedJob }) {
  const [examMaster, setExamMaster] = useState([]);
  const [questionMaster, setQuestionMaster] = useState([]);

  useEffect(() => {
    if (examData !== 0) {
      setExamMaster(examData.examMaster[0]);
      setQuestionMaster(examData.questionMaster.questions);
    }
    console.log("examData: ", examData);
  }, [examData]);

  return (
    <div className='rounded-md p-4'>
      {examData === 0 ? (
        <div className='flex flex-col justify-center items-center gap-4'>
          <p>No exam created yet</p>
          <CreateExamMaster />
        </div>
      ) : (
        <>
          <AddExamQuestion examId={examMaster.exam_id} getSelectedJob={getSelectedJob} />
          <div className='flex flex-col'>
            <div className='flex md:justify-center'>
              <Card className='mb-3 flex flex-col gap-1 bg-background w-full md:w-1/2'>
                <CardContent className='p-3'>
                  <div className='flex flex-row justify-between'>
                    <h1 className='text-2xl font-boldtext-start'>
                      {examMaster.exam_name}
                    </h1>
                    <Edit2 className='cursor-pointer w-5 h-5 md:mr-2' />
                  </div>
                  <p>Exam duration: {examMaster.exam_duration} minutes</p>
                  <p className='text-sm'>Date created: {examMaster.exam_createdAt ? formatDate(examMaster.exam_createdAt) : 'N/A'}</p>
                  <p className='text-sm'>Date updated: {examMaster.exam_updatedAt ? formatDate(examMaster.exam_updatedAt) : 'N/A'}</p>
                </CardContent>
              </Card>
            </div>
            {questionMaster.length === 0 ? (
              <div className='flex justify-center items-center mt-4'>
                <p>No questions have been added to this exam yet.</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 ${questionMaster.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
                {questionMaster.map((question, index) => (
                  <Card key={index} className='mb-3 bg-background w-full flex flex-col'>
                    <CardContent className="p-3 flex-grow">
                      <div className='grid grid-cols-3 gap-2'>
                        <p className='mb-4 text-lg font-bold col-span-2'>{index + 1}. {question.examQ_text}</p>
                        <div className='flex flex-row gap-4 justify-end'>
                          <UpdateExamQuestion examQuestionData={question} getSelectedJob={getSelectedJob} />
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
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ExamPage
