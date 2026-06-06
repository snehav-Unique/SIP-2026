"use client"
import * as React from "react"
import { Calendar } from "./ui/calendar"

interface CalendarWithTimeProps {
  selectedDate: string // ISO format (YYYY-MM-DD)
  selectedTime?: string // HH:MM format
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
}

export function CalendarWithTime({
  selectedDate,
  selectedTime = "",
  onDateChange,
  onTimeChange,
}: CalendarWithTimeProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : new Date()
  )

  // Extract time from the selected date
  const selectedDateObj = date ?? new Date()
  const hours = selectedTime
    ? parseInt(selectedTime.split(":")[0])
    : selectedDateObj.getHours()
  const minutes = selectedTime
    ? parseInt(selectedTime.split(":")[1])
    : selectedDateObj.getMinutes()

  // Format time as HH:MM for <input type="time">
  const timeValue = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      const isoDate = newDate.toISOString().split("T")[0]
      onDateChange(isoDate)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value
    onTimeChange(timeStr)

    // Update the date object with the new time
    if (date) {
      const [h, m] = timeStr.split(":").map(Number)
      const updated = new Date(date)
      updated.setHours(h, m)
      setDate(updated)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Date
        </label>
        <div className="border-2 border-gray-200 rounded-lg p-3 bg-white">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-lg"
            captionLayout="dropdown"
          />
        </div>
      </div>

      {/* Time picker — defaults to current system time */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Time (optional)
        </label>
        <input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Display selected date and time */}
      {date && (
        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Selected:</strong> {date.toLocaleDateString()} at {timeValue}
        </p>
      )}
    </div>
  )
}
