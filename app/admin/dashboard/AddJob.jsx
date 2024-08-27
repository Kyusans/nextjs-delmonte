"use client";
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import AddJobMaster from './AddJobStep/AddJobMaster';
import { Separator } from '@/components/ui/separator';
import AddDutiesMaster from './AddJobStep/AddDutiesMaster';
import { ScrollArea } from '@/components/ui/scroll-area';
import { retrieveData, storeData } from '@/app/utils/storageUtils';

function AddJob() {
  useEffect(() => {
    if(retrieveData("duties") === null) {
      storeData("duties", "[]");
    }
  },[])

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <Card className="rounded-md border-4 border-secondary">
        <CardContent>
          <AddJobMaster />
          <Separator className="my-6" />
          <AddDutiesMaster />
        </CardContent>
      </Card>
    </ScrollArea>
  )
}

export default AddJob
