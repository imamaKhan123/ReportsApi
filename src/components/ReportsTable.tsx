import { Download, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Report, downloadReportPDF } from "../services/reportsApi";
import React from "react";

 

interface ReportsTableProps {
  reports: Report[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalReports?: number;
  onViewReport?: (report: Report) => void;
  onPageChange?: (page: number) => void;
}

export function ReportsTable({ 
  reports, 
  loading, 
  currentPage = 1, 
  totalPages = 1, 
  totalReports = 0, 
  onPageChange ,
  onViewReport 
}: ReportsTableProps) {
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

  if (loading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Report Type</TableHead>
              <TableHead>Report ID</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse w-28"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-muted rounded animate-pulse w-16"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No reports found for the selected year.</p>
      </div>
    );
  }

  const renderPaginationItems = () => {
    const items: React.ReactNode[] = [];

    const maxVisiblePages = 15;
  
    // Always show first page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange?.(1)}
            isActive={currentPage === 1}          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    // Show left ellipsis
    if (currentPage > 3 && totalPages > maxVisiblePages) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
  
    // Calculate range of middle pages
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
  
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => onPageChange?.(page)}
            isActive={currentPage === page}          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    // Show right ellipsis
    if (currentPage < totalPages - 2 && totalPages > maxVisiblePages) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
  
    // Always show last page if > 1
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange?.(totalPages)}
            isActive={currentPage === totalPages}         >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    return items;
  };
  

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Report Type</TableHead>
              <TableHead>Report ID</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.reportId}>
                <TableCell>
                  {formatDate(report.published)}
                </TableCell>
                <TableCell>
                  <Badge variant={getTypeColor(report.format)}>
                    {report.format}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {report.reportId}
                </TableCell>
                <TableCell>
                  {report.publisher.displayName}
                </TableCell>
                <TableCell>
                <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewReport?.(report)}
                      className="h-8 w-8 p-0"
                      title={`View ${report.reportId} details`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadReportPDF(report.reportId)}
                    className="h-8 w-8 p-0"
                    title={`Download ${report.reportId} PDF`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between cursor-default p-2 bg-gray-100 rounded-lg hover:bg-gray-200 ">
        <div className="text-sm dark-color dark:bg-accent/50">
            Showing {((currentPage - 1) * 15) + 1} to {Math.min(currentPage * 15, totalReports)} of {totalReports} reports
          </div>
         
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} size={undefined}               />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} size={undefined}               />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}