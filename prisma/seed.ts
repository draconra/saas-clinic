import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinic.com' },
    update: {},
    create: {
      email: 'admin@clinic.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create doctor user
  const doctorPassword = await bcrypt.hash('doctor123', 12)
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@clinic.com' },
    update: {},
    create: {
      email: 'doctor@clinic.com',
      password: doctorPassword,
      name: 'Dr. Sarah Johnson',
      role: 'DOCTOR',
    },
  })

  // Create clinic
  const clinic = await prisma.clinic.upsert({
    where: { id: 'clinic-1' },
    update: {},
    create: {
      id: 'clinic-1',
      name: 'City Health Clinic',
      address: '123 Main St, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@cityhealth.com',
      website: 'https://cityhealth.com',
      description: 'A comprehensive healthcare facility serving the community',
      ownerId: admin.id,
    },
  })

  // Create sample patients
  const patients = await Promise.all([
    prisma.patient.upsert({
      where: { id: 'patient-1' },
      update: {},
      create: {
        id: 'patient-1',
        firstName: 'John',
        lastName: 'Anderson',
        email: 'john.anderson@email.com',
        phone: '(555) 123-4567',
        dateOfBirth: new Date('1985-05-15'),
        gender: 'MALE',
        address: '456 Oak Ave, City, State 12345',
        emergencyContact: 'Jane Anderson - (555) 987-6543',
        insuranceNumber: 'INS123456',
        bloodType: 'O+',
        allergies: 'Penicillin, Peanuts',
        medications: 'Lisinopril 10mg daily, Multivitamin',
        medicalHistory: 'Hypertension, controlled with medication',
        clinicId: clinic.id,
      },
    }),
    prisma.patient.upsert({
      where: { id: 'patient-2' },
      update: {},
      create: {
        id: 'patient-2',
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@email.com',
        phone: '(555) 234-5678',
        dateOfBirth: new Date('1992-08-22'),
        gender: 'FEMALE',
        address: '789 Pine St, City, State 12345',
        emergencyContact: 'Michael Williams - (555) 876-5432',
        insuranceNumber: 'INS789012',
        bloodType: 'A+',
        allergies: 'None',
        medications: 'Vitamin D3, Iron supplements',
        medicalHistory: 'Mild anemia, otherwise healthy',
        clinicId: clinic.id,
      },
    }),
    prisma.patient.upsert({
      where: { id: 'patient-3' },
      update: {},
      create: {
        id: 'patient-3',
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.johnson@email.com',
        phone: '(555) 345-6789',
        dateOfBirth: new Date('1978-12-10'),
        gender: 'MALE',
        address: '321 Elm St, City, State 12345',
        emergencyContact: 'Mary Johnson - (555) 765-4321',
        insuranceNumber: 'INS345678',
        bloodType: 'B+',
        allergies: 'Sulfa drugs, Shellfish',
        medications: 'Metformin 500mg twice daily, Aspirin 81mg daily',
        medicalHistory: 'Type 2 Diabetes, Hypertension',
        clinicId: clinic.id,
      },
    }),
    prisma.patient.upsert({
      where: { id: 'patient-4' },
      update: {},
      create: {
        id: 'patient-4',
        firstName: 'Emily',
        lastName: 'Martinez',
        email: 'emily.martinez@email.com',
        phone: '(555) 456-7890',
        dateOfBirth: new Date('2005-09-12'),
        gender: 'FEMALE',
        address: '654 Maple Dr, City, State 12345',
        emergencyContact: 'Carlos Martinez - (555) 654-3210',
        insuranceNumber: 'INS456789',
        bloodType: 'O-',
        allergies: 'Dust mites, Pollen',
        medications: 'Albuterol inhaler as needed',
        medicalHistory: 'Mild asthma, seasonal allergies',
        clinicId: clinic.id,
      },
    }),
    prisma.patient.upsert({
      where: { id: 'patient-5' },
      update: {},
      create: {
        id: 'patient-5',
        firstName: 'Michael',
        lastName: 'Thompson',
        email: 'michael.thompson@email.com',
        phone: '(555) 567-8901',
        dateOfBirth: new Date('1967-03-28'),
        gender: 'MALE',
        address: '987 Cedar Ln, City, State 12345',
        emergencyContact: 'Lisa Thompson - (555) 543-2109',
        insuranceNumber: 'INS567890',
        bloodType: 'AB+',
        allergies: 'None known',
        medications: 'Atorvastatin 20mg daily, Metoprolol 50mg twice daily',
        medicalHistory: 'Hyperlipidemia, Previous myocardial infarction (2019)',
        clinicId: clinic.id,
      },
    }),
  ])

  // Create sample appointments
  const appointments = await Promise.all([
    // John Anderson's appointments
    prisma.appointment.create({
      data: {
        title: 'Annual Checkup',
        description: 'Routine annual health examination',
        startTime: new Date('2024-12-25T10:00:00Z'),
        endTime: new Date('2024-12-25T11:00:00Z'),
        status: 'SCHEDULED',
        type: 'CONSULTATION',
        notes: 'Patient due for annual physical',
        clinicId: clinic.id,
        patientId: patients[0].id,
        doctorId: doctor.id,
      },
    }),
    prisma.appointment.create({
      data: {
        title: 'Blood Pressure Review',
        description: 'Hypertension management follow-up',
        startTime: new Date('2024-01-15T14:00:00Z'),
        endTime: new Date('2024-01-15T14:30:00Z'),
        status: 'COMPLETED',
        type: 'FOLLOW_UP',
        notes: 'BP well controlled with current medication',
        clinicId: clinic.id,
        patientId: patients[0].id,
        doctorId: doctor.id,
      },
    }),
    // Sarah Williams' appointments
    prisma.appointment.create({
      data: {
        title: 'Initial Consultation',
        description: 'New patient comprehensive evaluation',
        startTime: new Date('2024-11-20T09:30:00Z'),
        endTime: new Date('2024-11-20T10:30:00Z'),
        status: 'COMPLETED',
        type: 'CONSULTATION',
        notes: 'Healthy young adult, mild anemia noted',
        clinicId: clinic.id,
        patientId: patients[1].id,
        doctorId: doctor.id,
      },
    }),
    // Robert Johnson's appointments
    prisma.appointment.create({
      data: {
        title: 'Diabetes Management',
        description: 'Quarterly diabetes follow-up',
        startTime: new Date('2024-12-26T14:00:00Z'),
        endTime: new Date('2024-12-26T15:00:00Z'),
        status: 'SCHEDULED',
        type: 'FOLLOW_UP',
        notes: 'Review blood sugar levels and medication adjustment',
        clinicId: clinic.id,
        patientId: patients[2].id,
        doctorId: doctor.id,
      },
    }),
    prisma.appointment.create({
      data: {
        title: 'Lab Results Review',
        description: 'Diabetes lab work follow-up',
        startTime: new Date('2024-01-10T11:00:00Z'),
        endTime: new Date('2024-01-10T11:30:00Z'),
        status: 'COMPLETED',
        type: 'FOLLOW_UP',
        notes: 'HbA1c improved, continue current regimen',
        clinicId: clinic.id,
        patientId: patients[2].id,
        doctorId: doctor.id,
      },
    }),
    // Emily Martinez's appointments
    prisma.appointment.create({
      data: {
        title: 'Asthma Review',
        description: 'Asthma control assessment',
        startTime: new Date('2024-12-28T15:30:00Z'),
        endTime: new Date('2024-12-28T16:00:00Z'),
        status: 'SCHEDULED',
        type: 'FOLLOW_UP',
        notes: 'Seasonal allergy symptoms review',
        clinicId: clinic.id,
        patientId: patients[3].id,
        doctorId: doctor.id,
      },
    }),
    // Michael Thompson's appointments
    prisma.appointment.create({
      data: {
        title: 'Cardiac Follow-up',
        description: 'Post-MI medication review',
        startTime: new Date('2024-01-18T08:30:00Z'),
        endTime: new Date('2024-01-18T09:00:00Z'),
        status: 'COMPLETED',
        type: 'FOLLOW_UP',
        notes: 'Stable cardiac function, continue current medications',
        clinicId: clinic.id,
        patientId: patients[4].id,
        doctorId: doctor.id,
      },
    }),
  ])

  // Create sample medical records
  const medicalRecords = await Promise.all([
    // John Anderson's medical records
    prisma.medicalRecord.create({
      data: {
        diagnosis: 'Essential Hypertension',
        symptoms: 'Occasional headaches, elevated blood pressure readings',
        treatment: 'Lifestyle modifications, ACE inhibitor therapy',
        prescription: 'Lisinopril 10mg once daily',
        notes: 'Patient educated on low-sodium diet and regular exercise',
        vitalSigns: 'BP: 135/85, HR: 72, Temp: 98.6°F, Weight: 180 lbs',
        labResults: 'CBC: Normal, CMP: Normal, Lipid Panel: LDL 125, HDL 45',
        followUpDate: new Date('2024-12-25'),
        clinicId: clinic.id,
        patientId: patients[0].id,
        doctorId: doctor.id,
      },
    }),
    // Sarah Williams' medical records
    prisma.medicalRecord.create({
      data: {
        diagnosis: 'Mild Iron Deficiency Anemia',
        symptoms: 'Mild fatigue, occasional dizziness',
        treatment: 'Iron supplementation, dietary modifications',
        prescription: 'Ferrous sulfate 325mg daily with Vitamin C',
        notes: 'Comprehensive physical exam completed, otherwise healthy',
        vitalSigns: 'BP: 118/75, HR: 68, Temp: 98.4°F, Weight: 135 lbs',
        labResults: 'Hemoglobin: 11.2 g/dL, Hematocrit: 34%, Ferritin: 15 ng/mL',
        followUpDate: new Date('2025-01-25'),
        clinicId: clinic.id,
        patientId: patients[1].id,
        doctorId: doctor.id,
      },
    }),
    // Robert Johnson's medical records
    prisma.medicalRecord.create({
      data: {
        diagnosis: 'Type 2 Diabetes Mellitus',
        symptoms: 'Occasional fatigue, increased thirst',
        treatment: 'Metformin therapy, dietary modifications',
        prescription: 'Metformin 500mg twice daily with meals',
        notes: 'Blood glucose monitoring education provided',
        vitalSigns: 'BP: 142/88, HR: 76, Temp: 98.2°F, Weight: 210 lbs',
        labResults: 'HbA1c: 7.2%, Fasting Glucose: 145 mg/dL',
        followUpDate: new Date('2024-12-26'),
        clinicId: clinic.id,
        patientId: patients[2].id,
        doctorId: doctor.id,
      },
    }),
    // Emily Martinez's medical records
    prisma.medicalRecord.create({
      data: {
        diagnosis: 'Mild Persistent Asthma',
        symptoms: 'Occasional wheezing, shortness of breath with exercise',
        treatment: 'Inhaled bronchodilator as needed',
        prescription: 'Albuterol inhaler 2 puffs PRN',
        notes: 'Asthma action plan reviewed with patient and family',
        vitalSigns: 'BP: 110/70, HR: 80, Temp: 98.6°F, Weight: 110 lbs',
        labResults: 'CBC: Normal, Allergy testing: Positive for dust mites',
        followUpDate: new Date('2024-12-28'),
        clinicId: clinic.id,
        patientId: patients[3].id,
        doctorId: doctor.id,
      },
    }),
    // Michael Thompson's medical records
    prisma.medicalRecord.create({
      data: {
        diagnosis: 'Coronary Artery Disease, Post-MI',
        symptoms: 'Stable, no chest pain or shortness of breath',
        treatment: 'Antiplatelet therapy, statin, beta-blocker',
        prescription: 'Aspirin 81mg daily, Atorvastatin 20mg daily, Metoprolol 25mg twice daily',
        notes: 'Cardiac rehabilitation completed, maintaining heart-healthy lifestyle',
        vitalSigns: 'BP: 125/78, HR: 62, Temp: 98.5°F, Weight: 195 lbs',
        labResults: 'Lipid Panel: LDL 78, HDL 52, Triglycerides: 120',
        imaging: 'Echocardiogram: EF 55%, no wall motion abnormalities',
        followUpDate: new Date('2024-03-18'),
        clinicId: clinic.id,
        patientId: patients[4].id,
        doctorId: doctor.id,
      },
    }),
  ])

  // Create sample invoices
  const invoices = await Promise.all([
    // John Anderson's invoices
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-001',
        amount: 150.00,
        status: 'PAID',
        description: 'Annual Checkup and consultation',
        dueDate: new Date('2024-12-25'),
        paidAt: new Date('2024-12-20'),
        clinicId: clinic.id,
        patientId: patients[0].id,
        createdBy: admin.id,
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-002',
        amount: 75.00,
        status: 'PENDING',
        description: 'Blood pressure follow-up visit',
        dueDate: new Date('2024-02-14'),
        clinicId: clinic.id,
        patientId: patients[0].id,
        createdBy: admin.id,
      },
    }),
    // Sarah Williams' invoices
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-003',
        amount: 200.00,
        status: 'PAID',
        description: 'Initial consultation and lab tests',
        dueDate: new Date('2024-12-20'),
        paidAt: new Date('2024-11-20'),
        clinicId: clinic.id,
        patientId: patients[1].id,
        createdBy: admin.id,
      },
    }),
    // Robert Johnson's invoices
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-004',
        amount: 175.00,
        status: 'OVERDUE',
        description: 'Diabetes management consultation',
        dueDate: new Date('2024-01-10'),
        clinicId: clinic.id,
        patientId: patients[2].id,
        createdBy: admin.id,
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-005',
        amount: 125.00,
        status: 'PENDING',
        description: 'Lab results review and medication adjustment',
        dueDate: new Date('2024-02-10'),
        clinicId: clinic.id,
        patientId: patients[2].id,
        createdBy: admin.id,
      },
    }),
    // Emily Martinez' invoices
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-006',
        amount: 100.00,
        status: 'PENDING',
        description: 'Asthma review and inhaler prescription',
        dueDate: new Date('2024-12-28'),
        clinicId: clinic.id,
        patientId: patients[3].id,
        createdBy: admin.id,
      },
    }),
    // Michael Thompson's invoices
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-007',
        amount: 250.00,
        status: 'PAID',
        description: 'Cardiology consultation and EKG',
        dueDate: new Date('2024-02-17'),
        paidAt: new Date('2024-01-18'),
        clinicId: clinic.id,
        patientId: patients[4].id,
        createdBy: admin.id,
      },
    }),
  ])

  // Create body charts for some medical records
  const bodyCharts = await Promise.all([
    // Body chart for John Anderson (Hypertension patient)
    prisma.bodyChart.create({
      data: {
        bodyRegion: 'chest',
        findings: 'Normal heart sounds, no murmurs',
        severity: 'MILD',
        description: 'Cardiovascular examination within normal limits',
        coordinates: '250,180',
        bodyPart: 'Heart',
        side: 'CENTER',
        medicalRecordId: medicalRecords[0].id,
      },
    }),
    // Body chart for Emily Martinez (Asthma patient)
    prisma.bodyChart.create({
      data: {
        bodyRegion: 'lungs',
        findings: 'Mild wheezing on exertion, clear at rest',
        severity: 'MILD',
        description: 'Asthma symptoms well controlled with medication',
        coordinates: '230,160',
        bodyPart: 'Lungs',
        side: 'BILATERAL',
        medicalRecordId: medicalRecords[3].id,
      },
    }),
    // Body chart for Michael Thompson (Cardiac patient)
    prisma.bodyChart.create({
      data: {
        bodyRegion: 'chest',
        findings: 'Healed sternotomy scar, normal heart rhythm',
        severity: 'MODERATE',
        description: 'Post-MI status, stable cardiac function',
        coordinates: '250,190',
        bodyPart: 'Heart',
        side: 'CENTER',
        medicalRecordId: medicalRecords[4].id,
      },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log(`\n📊 Created ${patients.length} patients`)
  console.log(`👨‍⚕️ Created doctors: admin@clinic.com, doctor@clinic.com`)
  console.log(`📅 Created ${appointments.length} appointments`)
  console.log(`🏥 Created ${medicalRecords.length} medical records`)
  console.log(`💳 Created ${invoices.length} invoices`)
  console.log(`🫀 Created ${bodyCharts.length} body charts`)
  console.log(`🏢 Created clinic: ${clinic.name}`)
  console.log('\nLogin credentials:')
  console.log('Admin: admin@clinic.com / admin123')
  console.log('Doctor: doctor@clinic.com / doctor123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })