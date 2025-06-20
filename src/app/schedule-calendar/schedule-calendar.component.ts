// calendar.component.ts
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

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

interface SelectedSlot {
  date: Date;
  time: string;
  available: boolean;
  booked: boolean;
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
  bookingType: string = 'self';
  numberOptions = Array.from({ length: 9 }, (_, i) => i + 1);
  upcomingDatesWithSlots: { date: Date; slots: any[] }[] = [];
  selectedslot: SelectedSlot | null = null;
  selectedFamilyMembers = 0;
  selectedSlots: any[] = [];
  AvailCenter: any;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.appointmentForm = this.fb.group({
      patientName: ['', Validators.required],
      hapId: [''],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      alternativeNumber: ['', [Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      visaCategory: [''],
      passportNo: ['', Validators.required],
      paymentPreference: [''],
      TransactionId: '',
      dob: ['', Validators.required],
      payment_method: 'QR',
      servicecode: this.fb.control([], Validators.required),
      memberCount: [0],
      familyMembers: this.fb.array([]),
    });
  }
  timeSlots: any[] = [];
  // @Input() timeSlots: TimeSlot[] = [];
  slots1: { time: string; available: boolean; booked: boolean }[] = [];
  slotsData: {
    [date: string]: { time: string; available: boolean; booked: boolean }[];
  } = {};

  calendarSlotMap: { [key: string]: any[] } = {};
  bookedEvents: CalendarEvent[] = [];
  familyForm = new FormGroup({
    adults: new FormControl(''),
    children: new FormControl(''),
  });
  accesstoken: string = '';
  serviceList: any[] = [];
  today: string = new Date().toISOString().split('T')[0];

  dropdownOpen = false;
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;

  toggleServiceDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.dropdownWrapper?.nativeElement.contains(
      event.target
    );
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }

  createFamilyMember(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      gender: ['', Validators.required],
      passportNo: ['', Validators.required],
      hapId: [''],
      dob: ['', Validators.required],
    });
  }

  get familyMembers(): FormArray {
    return this.appointmentForm.get('familyMembers') as FormArray;
  }

  generateFamilyMemberRows(count: number): void {
    this.familyMembers.clear();
    for (let i = 0; i < count; i++) {
      this.familyMembers.push(this.createFamilyMember());
    }
  }
  familySlotAssignments: { time: string }[] = [];

  assignFamilyMembersToSlots(): void {
    const count = this.appointmentForm.get('memberCount')?.value;
    const selectedDate = this.selectedDate;

    if (!count || !selectedDate) return;

    const matchingSlots = this.timeSlots.filter(
      (slot) => slot.slot.date === selectedDate && slot.slot.slottime?.length
    );

    const flatTimeSlots = matchingSlots
      .flatMap((slot) =>
        slot.slot.slottime.map((time: any) => ({
          start_time: time.start_time,
          end_time: time.end_time,
          remaining: time.remaining,
        }))
      )
      .filter((slot) => slot.remaining > 0);

    const assignedSlots: any[] = [];

    let membersLeft = count;
    for (const slot of flatTimeSlots) {
      const canAssign = Math.min(slot.remaining, membersLeft);
      for (let i = 0; i < canAssign; i++) {
        assignedSlots.push({
          time: `${slot.start_time} - ${slot.end_time}`,
        });
      }
      membersLeft -= canAssign;
      if (membersLeft <= 0) break;
    }

    if (membersLeft > 0) {
      this.toastr.error(
        `Only ${
          count - membersLeft
        } members could be assigned to available slots`
      );
    }

    console.log('Assigned:', assignedSlots);

    // Example: you can use this to display slots next to each member form row
    this.familySlotAssignments = assignedSlots;
  }

  onMemberCountChange(): void {
    const count = this.appointmentForm.get('memberCount')?.value;
    if (!isNaN(count) && count > 0) {
      this.generateFamilyMemberRows(count);
      this.assignFamilyMembersToSlots();
    } else {
      this.familyMembers.clear();
    }
  }

  closeDropdown() {
    setTimeout(() => {
      this.dropdownOpen = false;
    }, 200); // allow checkbox click before closing
  }

  getSelectedServiceNames(): string {
    const selected = this.appointmentForm.get('servicecode')?.value || [];
    return this.serviceList
      .filter((s) => selected.includes(s.code))
      .map((s) => s.name)
      .join(', ');
  }

  onFocusOut(event: FocusEvent) {
    // Delay dropdown close to allow checkbox click
    setTimeout(() => {
      const active = document.activeElement as HTMLElement;
      const parent = (event.currentTarget as HTMLElement)?.parentElement;
      if (!parent?.contains(active)) {
        this.dropdownOpen = false;
      }
    }, 150);
  }

  isSelected1(code: string): boolean {
    return (this.appointmentForm.get('servicecode')?.value || []).includes(
      code
    );
  }

  isAllSelected(): boolean {
    const selected = this.appointmentForm.get('servicecode')?.value || [];
    return selected.length === this.serviceList.length;
  }
  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const allCodes = this.serviceList.map((s) => s.code);
    this.appointmentForm
      .get('servicecode')
      ?.setValue(isChecked ? allCodes : []);
  }
  totalServicePrice: number = 0;

  onServiceCheckboxChange(event: Event, code: string): void {
    const selectedServices =
      this.appointmentForm.get('servicecode')?.value || [];
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      if (!selectedServices.includes(code)) {
        selectedServices.push(code);
      }
    } else {
      const index = selectedServices.indexOf(code);
      if (index !== -1) {
        selectedServices.splice(index, 1);
      }
    }

    // ✅ Update the form control
    this.appointmentForm.get('servicecode')?.setValue([...selectedServices]);
    this.appointmentForm.get('servicecode')?.markAsTouched();

    console.log(selectedServices);

    // ✅ Calculate total price
    this.totalServicePrice = selectedServices.reduce(
      (total: number, code: string) => {
        const service = this.serviceList.find((s) => s.code === code);
        return total + Number(service?.price || 0);
      },
      0
    );

    console.log('Selected services:', selectedServices);
    console.log('Total Price:', this.totalServicePrice);
  }

  ngOnInit() {
    console.log(this.appointmentForm);
    console.log('timeSlots:', this.timeSlots);
    this.parseTimeSlotsFromData(this.timeSlots); // <-- Add this
    this.processSlots(this.slots1); // You can remove this if not needed
    this.familyForm = this.fb.group({
      adults: [''],
      children: [''],
    });
    this.appointmentForm
      .get('dob')
      ?.valueChanges.subscribe((dobStr: string) => {
        if (dobStr) {
          const dob = new Date(dobStr);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }
          this.appointmentForm.get('age')?.setValue(age, { emitEvent: false });
        }
      });

    this.appointmentForm
      .get('age')
      ?.valueChanges.subscribe((ageVal: string) => {
        const age = parseInt(ageVal, 10);
        if (!isNaN(age) && ageVal.length <= 3) {
          const today = new Date();
          const birthYear = today.getFullYear() - age;
          const dob = new Date(birthYear, 0, 1); // 01 Jan birth year
          const dobStr = this.formatDate1(dob);
          this.appointmentForm
            .get('dob')
            ?.setValue(dobStr, { emitEvent: false });
        }
      });
    this.getAvailableSlots();
  }
  formatDate1(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  stepIndex = 0;
  selectedCenterCode: string = '';
  cancelapptmodal() {
    this.dialogRef.close();
    this.selectedslot = null;
  }
  onCenterChange(event: Event): void {
    this.upcomingDatesWithSlots = [];
    const selectedCode = (event.target as HTMLSelectElement).value;
    console.log('Selected Center Code:', selectedCode);
    this.selectedCenterCode = selectedCode;
    const selectedCenter = this.AvailCenter.find(
      (center: any) => center.code === selectedCode
    );
    console.log('Selected Center Details:', selectedCenter);
    const apiUrl = `${environment.AVAILABLE_SERVIVCE_API}&center=${selectedCode}`;
    this.http
      .get(apiUrl, {
        headers: { Authorization: `Bearer ${this.accesstoken}` },
      })
      .subscribe((res: any) => {
        console.log('Services for selected center:', res.data);
        this.serviceList = res.data;
      });
    const formData = new FormData();
    formData.append('application', '1');
    formData.append('center', selectedCode);
    fetch(environment.AVAILABLE_SLOTS_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accesstoken}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        this.timeSlots = data.data;
        this.parseTimeSlotsFromData(this.timeSlots);
        this.processSlots(this.slots1);
      })
      .catch((err) => {});
  }
  today1 = new Date().toISOString().split('T')[0]; // "2025-06-13"

  nextStep() {
    const form = this.appointmentForm;
    const requiredFields = [
      'patientName',
      'age',
      'gender',
      'passportNo',
      'email',
      'contactNumber',
      // 'dob',
    ];
    const missing = requiredFields.filter((field) => {
      const control = form.get(field);
      return !control || control.invalid || !control.value;
    });
    if (missing.length > 0) {
      missing.forEach((field) => form.get(field)?.markAsTouched());
      return;
    }
    this.stepIndex = 1;
  }

  prevStep() {
    if (this.stepIndex > 0) {
      this.stepIndex--;
    }
  }
  formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-'); // '2025-06-13'
    return `${day}-${month}-${year}`; // '13-06-2025'
  }

  onSubmit() {
    const formData = this.appointmentForm.value;
    console.log('Final form data:', formData);
    console.log(this.selectedslot);
    console.log(this.selectedDate);
    console.log('service', this.serviceList[0]);

    // Helper to format ISO string to yyyy-mm-dd
    function formatISOToYYYYMMDD(isoString: any): string {
      if (!isoString) return '';
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    console.log(this.serviceList[0]);

    // [
    // {
    //     "type": "I",
    //     "applicant_number": "",
    //     "fullname": "test4",
    //     "email": "fsdev4@stemzglobal.com",
    //     "contact_number": "+919566755827",
    //     "alt_number": "+919569755427",
    //     "hap_id": "14254845486",
    //     "relationship": "Self",
    //     "reference_applicant_number": "",
    //     "passport_number": "A1275574367854657",
    //     "dob": "15-06-1999",
    //     "gender": "Male",
    //     "address": "123 Street, City",
    //     "transaction_id":"54342635275468",
    //     "payment_method":"QR",
    //     "transaction_amt":"100",
    //     "center":"NDK",
    //     "status": 1,
    //     "created_by": 1,
    //     "slot_booking": [
    //         {
    //             "action_date": "2025-06-13",
    //             "booked_time": "07:00 PM to 08:00 PM",
    //             "booking_from": 3,
    //             "booking_status": 1,
    //             "date_booked": "2025-06-13",
    //             "department": "AU",
    //             "description": "Test Service",
    //             "service_code":["APPT","LAN"]
    //         }
    //     ]
    // },
    // {
    //     "type": "I",
    //     "applicant_number": "",
    //     "fullname": "Test5",
    //     "email": "fsdev4@stemzglobal.com",
    //     "contact_number": "+919566555427",
    //     "alt_number": "+919566555427",
    //     "hap_id": "14254845486",
    //     "relationship": "Child",
    //     "reference_applicant_number": "",
    //     "passport_number": "A825879543896557",
    //     "dob": "15-06-1999",
    //     "gender": "Male",
    //     "address": "123 Street, City",
    //     "transaction_id":"5434263527468",
    //     "payment_method":"QR",
    //     "transaction_amt":"100",
    //     "status": 1,
    //     "created_by": 1,
    //      "center":"NDK",
    //     "slot_booking": [
    //         {
    //             "action_date": "2025-06-13",
    //             "booked_time": "07:00 PM to 08:00 PM",
    //             "booking_from": 3,
    //             "booking_status": 1,
    //             "date_booked": "2025-06-13",
    //             "department": "AU",
    //             "description": "Test Service",
    //             "service_code": ["APPT","LAN"]
    //         }
    //     ]
    // }
    // ]

    var finalDtaa = [
      {
        type: 'I',
        applicant_number: '',
        fullname: formData.patientName,
        email: formData.email,
        contact_number: formData.contactNumber,
        alt_number: formData.alternativeNumber,
        hap_id: formData.hapId,
        relationship: 'Self',
        reference_applicant_number: '',
        passport_number: formData.passportNo,
        dob: this.formatDate(formData.dob),
        gender: formData.gender,
        address: '123 Street, City',
        transaction_id: formData.TransactionId,
        payment_method: formData.payment_method,
        transaction_amt: this.serviceList[0]?.price,
        center: this.selectedCenterCode,
        status: 1,
        created_by: 1,
        slot_booking: [
          {
            action_date: formatISOToYYYYMMDD(new Date()),
            booked_time: this.selectedslot?.time,
            booking_from: 3,
            booking_status: 1,
            date_booked: formatISOToYYYYMMDD(this.selectedslot?.date),
            department: this.serviceList[0]?.department?.name,
            description: this.serviceList[0]?.description,
            service_code: formData.servicecode,
          },
        ],
      },
    ];
    console.log(finalDtaa);

    this.http
      .post(environment.APPLICANT_WITH_APPT_API, finalDtaa, {
        headers: { Authorization: `Bearer ${this.accesstoken}` },
      })
      .subscribe((res: any) => {
        console.log(res.data);

        if (res.appointments.status === 'success' && res.data?.length) {
          const applicant = res.data[0];
          const applicantNumber = applicant.applicant_number;
          const appointments = applicant.appointments;

          if (
            appointments.status === 'success' &&
            appointments.errors.length === 0
          ) {
            const booking = appointments.bookings[0];
            const bookedDate = booking.date;
            const bookedTime = booking.time;

            const message = `✅ Applicant ${applicantNumber} booked on ${bookedDate} at ${bookedTime}`;
            this.toastr.success(message, 'Booking Successful');
            this.dialogRef.close();
          } else if (appointments.errors.length > 0) {
            this.toastr.error(
              'Some appointment bookings failed.',
              'Booking Error'
            );
          }
        } else {
          this.toastr.error('Applicant creation or booking failed.', 'Error');
        }
      });

    // fetch(environment.APPLICANT_WITH_APPT_API, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${this.accesstoken}`,
    //   }, finalDtaa,
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data.data);
    //   })
    //   .catch((err) => {});

    // Submit to API here
  }

  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^\d$/.test(charCode)) {
      event.preventDefault();
    }
  }

  onContactInput(event: any, controlName: string) {
    let input = event.target.value;

    input = input.replace(/\D/g, ''); // Remove non-digits
    if (input.length > 10) {
      input = input.substring(0, 10);
    }

    console.log(input);

    this.appointmentForm
      .get(controlName)
      ?.setValue(input, { emitEvent: false });
  }

  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
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

  isPastDay(day: Date): boolean {
    const today = new Date();
    // Remove time portion for accurate comparison
    today.setHours(0, 0, 0, 0);
    const dayCopy = new Date(day);
    dayCopy.setHours(0, 0, 0, 0);
    return dayCopy < today;
  }

  onDayClick(day: Date): void {
    if (this.isPastDay(day)) {
      return; // do nothing
    }

    if (!this.selectedCenterCode) {
      this.toastr.warning('Select center');
      return;
    }
    if (this.bookingType === 'self') {
      this.selectDate(day);
    } else if (this.bookingType === 'family') {
      this.assignFamilyMembersToSlots();
    }
  }

  onBookingTypeChange(event: any) {
    this.bookingType = event.target.value;
    if (event.target.value === 'family') {
      this.appointmentForm.reset();
      this.upcomingDatesWithSlots = [];
    } else {
      this.selectedFamilyMembers = 0;
      this.selectedSlots = [];
    }
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
    this.slots1 = [];

    this.upcomingDatesWithSlots = [];

    for (let i = 0; i < 4; i++) {
      const day = new Date(date);
      day.setDate(date.getDate() + i);

      const dateStr = this.formatDateToYYYYMMDD(day);
      const slots = this.slotsData[dateStr] || [];

      const enrichedSlots = slots.map((slot) => ({
        ...slot,
        booked: this.isTimeSlotBooked(day, slot.time),
        date: day,
      }));

      this.upcomingDatesWithSlots.push({
        date: new Date(day),
        slots: enrichedSlots,
      });
    }
  }

  groupSlotsByDate(slots: any[]): { date: string; slots: any[] }[] {
    const grouped: { [key: string]: any[] } = {};

    for (const slot of slots) {
      const dateStr = this.formatDateToYYYYMMDD(new Date(slot.date));
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(slot);
    }

    return Object.keys(grouped).map((dateStr) => ({
      date: dateStr,
      slots: grouped[dateStr],
    }));
  }

  isTimeSlotBooked(date: Date, timeSlot: string): boolean {
    const dateStr = this.formatDateToYYYYMMDD(date);

    return this.bookedEvents.some(
      (event) => event.date === dateStr && event.timeSlot === timeSlot
    );
  }

  // bookTimeSlot(slot: any, templateRef: TemplateRef<any>): void {
  //   console.log(slot);
  //   if (this.bookingType === 'self') {
  //     this.selectedslot = slot;
  //   }

  //   slot.available = true;
  //   this.dialogRef = this.dialog.open(templateRef, {
  //     width: '600px',
  //   });
  // }
  bookTimeSlot(slot: any, templateRef: TemplateRef<any>) {
    const servicecode = this.appointmentForm.get('servicecode')?.value || [];

    this.appointmentForm.reset({
      patientName: '',
      hapId: '',
      email: '',
      contactNumber: '',
      alternativeNumber: '',
      gender: '',
      age: '',
      visaCategory: '',
      passportNo: '',
      paymentPreference: '',
      TransactionId: '',
      dob: '',
      payment_method: 'QR',
      servicecode: servicecode,
    });

    this.stepIndex = 0;
    if (this.bookingType === 'family') {
      const exists = this.selectedSlots.find(
        (s) => s.time === slot.time && s.date === slot.date
      );
      if (exists) {
        this.selectedSlots = this.selectedSlots.filter((s) => s !== exists);
      } else if (this.selectedSlots.length < this.selectedFamilyMembers) {
        this.selectedSlots.push(slot);
      }
    } else {
      this.selectedslot = slot;
      this.dialogRef = this.dialog.open(templateRef, {
        width: '600px',
      });
    }
  }

  // parseTimeSlotsFromData(data: TimeSlot[]) {
  //   this.slotsData = {};

  //   data.forEach((entry: TimeSlot) => {
  //     const dateStr = entry.slot.date;
  //     const slotInfo = entry.slot.slottime[0];
  //     const start = new Date(`${dateStr}T${slotInfo.start_time}`);
  //     const end = new Date(`${dateStr}T${slotInfo.end_time}`);

  //     const slots = [];
  //     let current = new Date(start);
  //     let count = 0;

  //     // Only generate slots equal to 'available' count
  //     while (current < end && count < slotInfo.available) {
  //       const next = new Date(current);
  //       next.setMinutes(current.getMinutes() + 30);

  //       const slotTimeStr = `${current.toTimeString().slice(0, 5)} - ${next
  //         .toTimeString()
  //         .slice(0, 5)}`;

  //       slots.push({ time: slotTimeStr, available: true, booked: false });
  //       current.setMinutes(current.getMinutes() + 30);
  //       count++;
  //     }

  //     if (!this.slotsData[dateStr]) {
  //       this.slotsData[dateStr] = [];
  //     }

  //     this.slotsData[dateStr].push(...slots);
  //   });
  // }
  convertTo12HourFormat(time24: string): string {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;
    if (hour === 0) hour = 12;

    const hourFormatted = hour < 10 ? `0${hour}` : `${hour}`;

    return `${hourFormatted}:${minute} ${ampm}`;
  }

  parseTimeSlotsFromData(data: TimeSlot[]) {
    console.log(data);

    this.slotsData = {}; // Reset the data

    data.forEach((entry: TimeSlot) => {
      const dateStr = entry.slot.date;
      const slotInfos = entry.slot.slottime;

      if (!this.slotsData[dateStr]) {
        this.slotsData[dateStr] = [];
      }

      const existingTimes = new Set(
        this.slotsData[dateStr].map((slot) => slot.time)
      );

      slotInfos.forEach((timeSlot) => {
        const startTime12 = this.convertTo12HourFormat(
          timeSlot.start_time.slice(0, 5)
        );
        const endTime12 = this.convertTo12HourFormat(
          timeSlot.end_time.slice(0, 5)
        );
        const formattedTime = `${startTime12} to ${endTime12}`;

        if (!existingTimes.has(formattedTime)) {
          this.slotsData[dateStr].push({
            time: formattedTime,
            available: timeSlot.available > 0,
            booked: false,
          });
          existingTimes.add(formattedTime); // update the set
        }
      });
    });

    console.log('Parsed slot data by date:', this.slotsData);
  }

  getAvailableSlots(): void {
    const userdata = {
      loginname: 'Superadmin',
      password: '@@@@@@',
    };

    this.http.post(environment.TOKEN_API, userdata).subscribe(
      (tokenResponse: any) => {
        const token = tokenResponse?.token || tokenResponse?.access || '';
        this.accesstoken = token;
        if (!token) {
          console.error('No token received.');
          return;
        }

        this.http
          .get(environment.AVAILABLE_CENTER_API, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .subscribe((res: any) => {
            this.AvailCenter = res.data;
            console.log('Centers:', this.AvailCenter);
          });
      },
      (tokenError: HttpErrorResponse) => {}
    );
  }
}
