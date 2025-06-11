// calendar.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

interface TimeSlot {
  id: number;
  slot: {
    id: number;
    center: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
      city: {
        id: number;
        name: string;
      };
      state: number;
      timezone: string;
      code: string;
    };
    date: string;
    status: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    created_by: number;
    modified_by: number | null;
    application: number;
    depart_detail: {
      id: number;
      name: string;
      code: string;
    }[];
    slottime: {
      start_time: string;
      end_time: string;
      available: number;
      remaining: number;
    }[];
    available: number;
    remaining: number;
  };
  department: {
    id: number;
    name: string;
    code: string;
    description: string | null;
    status: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    application: number;
    created_by: number;
    modified_by: number | null;
  };
  start_time: string;
  end_time: string;
  available: number;
  remaining: number;
  status: number;
  department_name: string;
  department_details: {
    department__name: string;
    department__id: number;
  }[];
  department_status: number;

  // These two are not in the sample data, so optional
  time?: string;
  booked?: boolean;
}

interface CalendarEvent {
  date: string;
  title: string;
  timeSlot: string;
}

@Component({
  imports: [
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.css'],
  exportAs: 'scheduleCalendar',
})
export class ScheduleCalendarComponent implements OnInit {
  currentDate = new Date();
  selectedDate: any | null = null;
  viewMode: 'month' | 'week' | 'day' = 'month';
  appointmentForm!: FormGroup;
  dialogRef!: MatDialogRef<any>;
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      patientName: ['', Validators.required],
    });
  }
  @Input() slots: any[] = [];
  slots1: { time: string; available: boolean; booked: boolean }[] = [];
  slotsData: {
    [date: string]: { time: string; available: boolean; booked: boolean }[];
  } = {};
  timeSlots: TimeSlot[] = [
    {
      id: 7930,
      slot: {
        id: 1456,
        center: {
          id: 174,
          name: 'Australian Visa Medical Examination Centre',
          country: {
            id: 109,
            name: 'AUSTRALIA',
          },
          city: {
            id: 509,
            name: 'Maroochydore',
          },
          state: 271,
          timezone: 'Australia/Queensland',
          code: 'AVMEC',
        },
        date: '2025-06-11',
        status: 1,
        created_on: '2025-06-09T18:27:58.305541',
        created_ip: '13.215.112.134',
        modified_on: '2025-06-09T18:27:58.305306',
        modified_ip: null,
        created_by: 2,
        modified_by: null,
        application: 1,
        depart_detail: [
          {
            id: 43,
            name: 'GP',
            code: 'GP',
          },
        ],
        slottime: [
          {
            start_time: '10:00:00',
            end_time: '18:30:00',
            available: 5,
            remaining: 5,
          },
        ],
        available: 5,
        remaining: 5,
      },
      department: {
        id: 43,
        name: 'GP',
        code: 'GP',
        description: null,
        status: 1,
        created_on: '2025-06-09T18:26:54.729430',
        created_ip: '13.215.112.134',
        modified_on: '2025-06-09T18:26:54.729032',
        modified_ip: null,
        application: 1,
        created_by: 2,
        modified_by: null,
      },
      start_time: '10:00:00',
      end_time: '18:30:00',
      available: 5,
      remaining: 5,
      status: 1,
      department_name: 'GP',
      department_details: [
        {
          department__name: 'GP',
          department__id: 43,
        },
      ],
      department_status: 1,
    },
    {
      id: 7930,
      slot: {
        id: 1456,
        center: {
          id: 174,
          name: 'Australian Visa Medical Examination Centre',
          country: {
            id: 109,
            name: 'AUSTRALIA',
          },
          city: {
            id: 509,
            name: 'Maroochydore',
          },
          state: 271,
          timezone: 'Australia/Queensland',
          code: 'AVMEC',
        },
        date: '2025-06-12',
        status: 1,
        created_on: '2025-06-09T18:27:58.305541',
        created_ip: '13.215.112.134',
        modified_on: '2025-06-09T18:27:58.305306',
        modified_ip: null,
        created_by: 2,
        modified_by: null,
        application: 1,
        depart_detail: [
          {
            id: 43,
            name: 'GP',
            code: 'GP',
          },
        ],
        slottime: [
          {
            start_time: '10:00:00',
            end_time: '18:30:00',
            available: 7,
            remaining: 5,
          },
        ],
        available: 5,
        remaining: 5,
      },
      department: {
        id: 43,
        name: 'GP',
        code: 'GP',
        description: null,
        status: 1,
        created_on: '2025-06-09T18:26:54.729430',
        created_ip: '13.215.112.134',
        modified_on: '2025-06-09T18:26:54.729032',
        modified_ip: null,
        application: 1,
        created_by: 2,
        modified_by: null,
      },
      start_time: '10:00:00',
      end_time: '18:30:00',
      available: 5,
      remaining: 5,
      status: 1,
      department_name: 'GP',
      department_details: [
        {
          department__name: 'GP',
          department__id: 43,
        },
      ],
      department_status: 1,
    },
  ];

  calendarSlotMap: { [key: string]: any[] } = {};
  bookedEvents: CalendarEvent[] = [];

  ngOnInit() {
    console.log('Slots:', this.slots);
    this.parseTimeSlotsFromData(this.timeSlots); // <-- Add this
    this.processSlots(this.slots1); // You can remove this if not needed

    // Sample events
    this.bookedEvents = [
      { date: '2025-06-15', title: 'Meeting', timeSlot: '11:00 AM' },
      { date: '2025-06-20', title: 'Appointment', timeSlot: '03:00 PM' },
    ];
  }

  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5); // "HH:MM"
  }

  processSlots(data: any[]) {
    data.forEach((entry) => {
      const date = entry.slot.date;
      if (!this.calendarSlotMap[date]) {
        this.calendarSlotMap[date] = [];
      }
      this.calendarSlotMap[date].push(entry);
    });
  }

  // Navigation methods
  goToToday() {
    this.currentDate = new Date();
    this.selectedDate = null;
  }

  goToPrevious() {
    if (this.viewMode === 'month') {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
    }
  }

  goToNext() {
    if (this.viewMode === 'month') {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
    }
  }

  setViewMode(mode: 'month' | 'week' | 'day') {
    this.viewMode = mode;
    this.selectedDate = null;
  }

  // Calendar generation methods
  getMonthName(): string {
    return this.currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  }

  getCalendarDays(): Date[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

  hasEvent(day: Date): boolean {
    const dateStr = this.formatDateToYYYYMMDD(day);
    return !!this.slotsData[dateStr]?.length;
  }

  getAvailableCount(day: Date): number {
    const dateStr = this.formatDateToYYYYMMDD(day);
    return (
      this.slotsData[dateStr]?.filter((slot) => slot.available && !slot.booked)
        .length || 0
    );
  }

  formatDateToYYYYMMDD(date: Date): string {
    return date.toLocaleDateString('en-CA'); // outputs in YYYY-MM-DD format
  }

  selectDate(date: Date): void {
    this.selectedDate = date;

    const dateStr = this.formatDateToYYYYMMDD(date);

    const slots = this.slotsData[dateStr] || [];

    this.slots1 = slots.map((slot) => ({
      ...slot,
      booked: this.isTimeSlotBooked(date, slot.time),
    }));
  }

  isTimeSlotBooked(date: Date, timeSlot: string): boolean {
    const dateStr = this.formatDateToYYYYMMDD(date);

    return this.bookedEvents.some(
      (event) => event.date === dateStr && event.timeSlot === timeSlot
    );
  }

  bookTimeSlot(slot: any, templateRef: TemplateRef<any>): void {
    slot.available = true;
    this.dialogRef = this.dialog.open(templateRef, {
      width: '600px',
    });
  }

  parseTimeSlotsFromData(data: TimeSlot[]) {
    this.slotsData = {};

    data.forEach((entry: TimeSlot) => {
      const dateStr = entry.slot.date;
      const slotInfo = entry.slot.slottime[0];
      const start = new Date(`${dateStr}T${slotInfo.start_time}`);
      const end = new Date(`${dateStr}T${slotInfo.end_time}`);

      const slots = [];
      let current = new Date(start);
      let count = 0;

      // Only generate slots equal to 'available' count
      while (current < end && count < slotInfo.available) {
        const next = new Date(current);
        next.setMinutes(current.getMinutes() + 30);

        const slotTimeStr = `${current.toTimeString().slice(0, 5)} - ${next
          .toTimeString()
          .slice(0, 5)}`;

        slots.push({ time: slotTimeStr, available: true, booked: false });
        current.setMinutes(current.getMinutes() + 30);
        count++;
      }

      if (!this.slotsData[dateStr]) {
        this.slotsData[dateStr] = [];
      }

      this.slotsData[dateStr].push(...slots);
    });
  }
}
