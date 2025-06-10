import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css'],
})
export class BookAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  isGroupBooking = false;
  submitting = false;

  numberOptions: number[] = Array.from({ length: 10 }, (_, i) => i); // [0,1,2,...,9]

  paymentOptions = [
    { value: 'full', label: 'Pay Full Package Amount' },
    { value: 'booking', label: 'Pay Booking Amount (Minimum ₹300 – ₹500)' },
    { value: 'center', label: 'Choose to Pay at the Center' },
  ];

  visaCategories = [
    'Student',
    'Work',
    'Visitor',
    'Partner',
    'Skilled Migration',
    'Other',
  ];

  times = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM']; // no longer needed for datetime-local, but can keep if you want

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      isGroup: [false],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      alternateContactNumber: [''],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      visaCategory: ['', Validators.required],
      hapId: ['', Validators.required],
      passportNo: ['', Validators.required],
      preferredDateTime: ['', [Validators.required, this.timeWindowValidator]],
      paymentPreference: ['', Validators.required],
      adults: [0, [Validators.required, Validators.min(1)]],
      children: [0, [Validators.required, Validators.min(0)]],
      groupMembers: this.fb.array([]),
    });

    this.appointmentForm.get('isGroup')?.valueChanges.subscribe((isGroup) => {
      this.isGroupBooking = isGroup;
      if (isGroup) {
        this.appointmentForm
          .get('adults')
          ?.setValidators([Validators.required, Validators.min(1)]);
        this.appointmentForm
          .get('children')
          ?.setValidators([Validators.min(0)]);
        this.appointmentForm.get('adults')?.updateValueAndValidity();
        this.appointmentForm.get('children')?.updateValueAndValidity();
        this.addGroupMembers();
      } else {
        this.appointmentForm.get('adults')?.clearValidators();
        this.appointmentForm.get('children')?.clearValidators();
        this.appointmentForm.get('adults')?.updateValueAndValidity();
        this.appointmentForm.get('children')?.updateValueAndValidity();
        this.clearGroupMembers();
      }
    });

    this.appointmentForm.get('adults')?.valueChanges.subscribe(() => {
      if (this.isGroupBooking) this.addGroupMembers();
    });

    this.appointmentForm.get('children')?.valueChanges.subscribe(() => {
      if (this.isGroupBooking) this.addGroupMembers();
    });
  }
  get groupMembers(): FormArray {
    return this.appointmentForm.get('groupMembers') as FormArray;
  }

  timeWindowValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const selected = new Date(value);
    const now = new Date();

    // Reject if the selected datetime is in the past
    if (selected < now) {
      return { pastDateTime: true };
    }

    const hours = selected.getHours();
    const minutes = selected.getMinutes();

    // Allow times from 10:00 to 16:00 (4:00 PM)
    const isValidTime =
      (hours > 10 && hours < 16) ||
      (hours === 10 && minutes >= 0) ||
      (hours === 16 && minutes === 0); // exactly 4:00 PM

    return isValidTime ? null : { invalidTimeWindow: true };
  }

  addGroupMembers(): void {
    const totalMembers =
      Number(this.appointmentForm.get('adults')?.value || 0) +
      Number(this.appointmentForm.get('children')?.value || 0);
    const currentLength = this.groupMembers.length;

    if (totalMembers > currentLength) {
      for (let i = currentLength; i < totalMembers; i++) {
        this.groupMembers.push(
          this.fb.group({
            fullName: ['', Validators.required],
            gender: ['', Validators.required],
            age: ['', [Validators.required, Validators.min(0)]],
            passportNo: ['', Validators.required],
            hapId: ['', Validators.required],
            preferredDateTime: [
              '',
              [Validators.required, this.timeWindowValidator],
            ],
          })
        );
      }
    } else if (totalMembers < currentLength) {
      for (let i = currentLength - 1; i >= totalMembers; i--) {
        this.groupMembers.removeAt(i);
      }
    }
  }

  clearGroupMembers(): void {
    this.groupMembers.clear();
    this.appointmentForm.patchValue({ adults: 0, children: 0 });
  }

  get showProceedButton(): boolean {
    const payment = this.appointmentForm.get('paymentPreference')?.value;
    return payment === 'full' || payment === 'booking';
  }

  get todayDateTimeLocal(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM'
  }

  handleProceedClick(): void {
    alert('Proceed to payment flow (not implemented)');
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }
    this.submitting = true;

    // Simulate submission (or call API)
    console.log('Submitting:', this.appointmentForm.value);

    setTimeout(() => {
      alert('Appointment request submitted! Confirmation email will be sent.');
      this.submitting = false;
      this.appointmentForm.reset();
      this.clearGroupMembers();
    }, 1500);
  }

 
}
