import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit2, PlusCircle, Trash2 } from 'lucide-react'
import React from 'react'

function InterviewPage({ interviewData }) {
  return (
    <div>
      {interviewData.interviewMaster === 0 ? (
        <div className='flex flex-col justify-center items-center gap-3'>
          <div className='font-bold text-xl'>No criteria for interview</div>
          <Button><PlusCircle className='h-5 w-5 mr-1' />Add criteria</Button>
        </div>
      ) : (
        <div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="mt-2">View Criteria</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Interview Criteria</DrawerTitle>
                <DrawerDescription>Manage interview criteria: view, edit, or remove</DrawerDescription>
              </DrawerHeader>
              <Separator />
              <ScrollArea className="w-full h-[calc(100vh-200px)]">
                <div className='p-3'>
                  <Button><PlusCircle className='h-5 w-5 mr-1' /> Add criteria</Button>
                </div>
                <Card className="mx-3">
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableHead>#</TableHead>
                        <TableHead>Criteria</TableHead>
                        <TableHead className="text-center">points</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableHeader>
                      <TableBody>
                        {interviewData.interviewCriteria.map((item, index) => (
                          <>
                            <TableRow>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell >{item.inter_criteria_name}</TableCell>
                              <TableCell className="text-center">{item.inter_criteria_points}</TableCell>
                              <TableCell>
                                <div className='flex justify-center'>
                                  <button onClick={() => handleEdit(data.jeduc_id, data.jeduc_categoryId, data.jeduc_points, data.jeduc_text)}>
                                    <Edit2 className="h-4 w-4 mr-4" />
                                  </button>
                                  <button className="h-4 w-4" onClick={() => handleRemoveList(data.jeduc_id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </ScrollArea>
              <DrawerFooter>
                <DrawerClose asChild>
                  <div className="flex justify-end">
                    <Button variant='outline'>
                      Close
                    </Button>
                  </div>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewPage