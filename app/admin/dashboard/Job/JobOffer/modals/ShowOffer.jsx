"use client"
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, Edit2, FileText, Trash2, User2 } from "lucide-react";

const ShowOffer = ({ open, onHide, candidate }) => {
  const [currentCandidate, setCurrentCandidate] = useState(candidate);

  useEffect(() => {
    console.log("candidate", candidate);

    setCurrentCandidate(candidate);
  }, [candidate]);

  if (!currentCandidate) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onHide}>
      <DialogContent className="w-[95vw] max-w-[600px] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Job Offer Details</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Offer information for <span className="font-semibold">{currentCandidate.fullName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card>
            <CardContent className="grid gap-4 p-3">
              <div className='flex items-center gap-4 justify-end'>
                <Edit2 className="h-5 w-5 text-muted-foreground shrink-0 cursor-pointer" />
                <Trash2 className="h-5 w-5 text-muted-foreground shrink-0 cursor-pointer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  {/* <p className="text-sm font-medium">Document</p> */}
                  <p className="text-sm text-muted-foreground break-words">{currentCandidate.joboffer_document}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground shrink-0">₱</span>
                  <div>
                    <p className="text-sm font-medium">Salary</p>
                    <p className="text-sm text-muted-foreground">{currentCandidate.joboffer_salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Date Offered</p>
                    <p className="text-sm text-muted-foreground">{currentCandidate.joboffer_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Expiry Date</p>
                    <p className="text-sm text-muted-foreground">{currentCandidate.joboffer_expiryDate}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-medium">Status</span>
                <Badge className={`${getStatusColor(currentCandidate.jobOfferStatus)}`}>
                  {currentCandidate.jobOfferStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button className="w-full sm:w-auto" variant="outline" onClick={onHide}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShowOffer;
