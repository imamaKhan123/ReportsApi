import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import React from "react";
interface YearSelectorProps {
  years: number[];
  selectedYear: number | null;
  onYearChange: (year: number) => void;
  loading?: boolean;
}

export function YearSelector({ years, selectedYear, onYearChange, loading }: YearSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="year-select">Select Year</Label>
      <Select 
        disabled={loading}
        value={selectedYear?.toString() || ""} 
        onValueChange={(value) => onYearChange(parseInt(value))}
      >
        <SelectTrigger className="w-48" id="year-select">
          <SelectValue placeholder="Choose a year..." />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}