import { Calendar, User, FileText, Download, AlertTriangle,Mail } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Report, downloadReportPDF } from "../services/reportsApi";
import React from "react";
interface ReportDetailDialogProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportDetailDialog({ report, open, onOpenChange }: ReportDetailDialogProps) {
  if (!report) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SNOWTAM':
        return 'secondary';
      case 'RCR':
        return 'default';
      case 'ATIS':
        return 'destructive';
      default:
        return 'outline';
    }
  
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SNOWTAM':
        return <AlertTriangle className="h-4 w-4" />;
      case 'RCR':
        return <FileText className="h-4 w-4" />;
      case 'ATIS':
        return <Calendar className="h-4 w-4" />;
      case 'training report':
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between mt-2">
            <div className="space-y-2">
              <DialogTitle className="text-xl">
                Report No {report.reportId}
              </DialogTitle>
              <DialogDescription>
                Detailed view of report information and metadata
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadReportPDF(report.reportId)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Report ID</label>
                <p className="font-mono text-sm mt-1 p-2 bg-muted rounded">{report.reportId}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date Filed</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{formatDate(report.published)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Report Type</label>
                <div className="flex items-center gap-2 mt-1">
                  {getTypeIcon(report.format)}
                  <Badge variant={getTypeColor(report.format)}>
                    {report.format}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Publisher</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p>{report.publisher.displayName}  </p>
                  <Mail className="h-4 w-4 text-muted-foreground" /><span>{report.publisher.email}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Report Content */}
          <div className="space-y-4">
            {report.reportId && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                {Array.isArray(report.status) ? (
                      report.status.map((status, index) => (
                         <p  key={index} className="mt-1 p-3 bg-muted/50 rounded-lg" > Sent at: {formatDate(status.sent )}   to: {status.recipient }</p>)))
                          : (  <p className="mt-1 p-3 bg-muted/50 rounded-lg">No additional details available for this report.Download the PDF to view the full content.</p>
                            
                          )}
                          </div>  )}

                          {Array.isArray(report.status) && report.status.length === 0 && (
                           <div>
                               <p className="mt-1 p-3 bg-muted/50 rounded-lg">
                                 No additional details available for this report. Download the PDF to view the full content.
                               </p>
                            </div>
                              )}


          
          </div>

          <Separator />

          {/* Status and Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              Report archived and available for download
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => downloadReportPDF(report.reportId)}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}