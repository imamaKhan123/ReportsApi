import { useState, useEffect, useMemo } from "react";
import React from "react";

import { FileText, Plane } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Alert, AlertDescription } from "./components/ui/alert";
import { YearSelector } from "./components/YearSelector";
import { ReportsTable } from "./components/ReportsTable";
import { reportsApi, Report } from "./services/reportsApi";
import { Button, buttonVariants } from "./components/ui/button";
import { ReportDetailDialog } from "./components/ReportDetailDialog";
import { SearchFilter } from "./components/SearchFilter";
export default function App() {
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearsLoading, setYearsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
 

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const reportsPerPage = 15;

  // Load available years on component mount
  useEffect(() => {
    async function loadYears() {
      try {
        setYearsLoading(true);
        const years = await reportsApi.getAvailableYears();
        setAvailableYears(years);
       // setSelectedYear(years[length]);
        // Auto-select the most recent year
        if (years.length > 0) {
          const latestYear = Math.max(...years);
          setSelectedYear(latestYear);
        }
      } catch (err) {
        setError('Failed to load available years');
        console.error('Error loading years:', err);
      } finally {
        setYearsLoading(false);
      }
    }

    loadYears();
  }, []);

  // Load reports when year changes
  useEffect(() => {
    if (selectedYear === null) return;

    async function loadReports() {
      try {
        setLoading(true);
        setError(null);
        if(selectedYear){
          const yearReports = await reportsApi.getReportsForYear(selectedYear);
          setReports(yearReports);
        }
       
      } catch (err) {
        setError(`Failed to load reports for ${selectedYear}`);
        console.error('Error loading reports:', err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [selectedYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setCurrentPage(1); // Reset to first page when year changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportDialog(true);
  };
   // Filter reports based on search query
   const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) {
      return reports;
    }

    const query = searchQuery.toLowerCase().trim();
    return reports.filter(report => 
      report.reportId.toLowerCase().includes(query) ||
      report.format.toLowerCase().includes(query) ||
      report.publisher.displayName.toLowerCase().includes(query) 
    );
  }, [reports, searchQuery]);
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };
  // Calculate pagination values
  // Calculate pagination values based on filtered results
  const totalReports = filteredReports.length;
  const totalPages = Math.ceil(totalReports / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  return (
    <div className={darkMode ? "dark" : ""}>

    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Plane className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold dark:text-white"  style={{    color: darkMode ? "#f9fafb" : "#000"}}>Safe Sky Airside Sync</h1>
              <p className="text-muted-foreground">Report Archive System</p>
            </div>
          </div>
        </div>
        <Button
            onClick={toggleDarkMode}
            variant="outline"
            className=""
          >
            Toggle Dark Mode
          </Button>

        {/* Info Alert */}
        <Alert className="mb-6 mt-2">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            This is a demonstration using data from Safe Sky API 
            at http://safe-sky.github.io/api/ using aerodrome "DEMO" and the provided API key. By default
            it shows 15 records in one page. I have added pagination to make it efficient.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Archived Reports</CardTitle>
            <CardDescription>
              View and download reports filed through the Airside Sync system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          <div className="flex flex-row md:flex-row gap-4">
              <YearSelector
                years={availableYears}
                selectedYear={selectedYear}
                onYearChange={handleYearChange}
                loading={yearsLoading}
              />
              
              {selectedYear && (
                <div className="flex-1 w-9">
                  <SearchFilter
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    loading={loading}
                  />
                </div>
              )}
            </div>
            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Reports Table */}
            {selectedYear && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3>Reports for {selectedYear}</h3>
                  <span className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : `${totalReports} report${totalReports !== 1 ? 's' : ''} found`}
                  </span>
                </div>
                <ReportsTable 
                  reports={paginatedReports} 
                  loading={loading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalReports={totalReports}
                  onPageChange={handlePageChange}
                  onViewReport={handleViewReport}
                />
              </div>
            )}
          </CardContent>
        </Card>
           {/* Report Detail Dialog */}
           <ReportDetailDialog
          report={selectedReport}
          open={showReportDialog}
          onOpenChange={setShowReportDialog}
        />
      </div>
    </div>
    </div>
  );
}