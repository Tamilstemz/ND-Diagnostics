import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

interface Service {
  title: string;
  description: string;
  iconPath: string;
  altText: string;
}

@Component({
  selector: 'app-services-offered',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-offered.component.html',
  styleUrls: ['./services-offered.component.css']
})
export class ServicesOfferedComponent {
  services: Service[] = [
    {
      title: 'Australia Immigration Medical Examination (IME)',
      description: 'This primary health assessment includes a physical examination and a review of your medical history, conducted by certified panel physicians.',
      iconPath: 'assets/dentail-fillings-box.jpg',
      altText: 'IME Icon'
    },
    {
      title: 'Chest X-ray (As Per Visa Requirements)',
      description: 'Required for certain applicants, the chest X-ray screens for conditions like tuberculosis and is uploaded directly to eMedical.',
      iconPath: 'assets/img-01.jpg',
      altText: 'Chest X-ray Icon'
    },
    {
      title: 'Blood and Urine Tests',
      description: 'Screening for HIV, Syphilis, and kidney function based on visa subclass and age. Our lab ensures hygienic, accurate processing.',
      iconPath: 'assets/dental-tech-box.jpg',
      altText: 'Blood Tests Icon'
    },
    // {
    //   title: 'Tuberculosis Screening (Mantoux or IGRA)',
    //   description: 'We offer both Mantoux and IGRA tests depending on your travel history and age group, as required by immigration.',
    //   iconPath: 'assets/dental-tech-box.jpg',
    //   altText: 'Tuberculosis Screening Icon'
    // },
    // {
    //   title: 'eMedical Submission',
    //   description: 'Your health results are uploaded securely to the Department of Home Affairs through the eMedical system for quick and reliable processing.',
    //   iconPath: '/path/to/upload-icon.png',
    //   altText: 'eMedical Submission Icon'
    // }
  ];
}
