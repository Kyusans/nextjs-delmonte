import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import React, { useState } from 'react'
import AddJobMaster from './AddJobStep/AddJobMaster';
import { Separator } from '@/components/ui/separator';

function AddJob() {

  return (
    <>
      <Card>
        <CardContent>
          <AddJobMaster />
          <Separator />
        </CardContent>
      </Card>
    </>
  )
}

export default AddJob
