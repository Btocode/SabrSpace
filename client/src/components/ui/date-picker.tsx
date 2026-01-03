import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const currentYear = new Date().getFullYear()
// Show years for ages 18-80 (current year - 18 down to current year - 80)
const minAge = 18
const maxAge = 80
const years = Array.from(
  { length: maxAge - minAge + 1 },
  (_, i) => currentYear - minAge - i
).reverse()

export function DatePicker({
  date,
  onSelect,
  placeholder = "Select month and year",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedMonth, setSelectedMonth] = React.useState<number>(date ? date.getMonth() : new Date().getMonth())
  const [selectedYear, setSelectedYear] = React.useState<number>(date ? date.getFullYear() : currentYear - 20)

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0) // Midnight to avoid time components
    onSelect?.(newDate)
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-11",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select Month and Year</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
