import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'health-ai-secret-key-2026';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup file uploads directory
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/media', express.static(uploadsDir));

const upload = multer({ dest: uploadsDir });

// In-memory Database Models & Seed Data
let nextUserId = 1;
let nextDoctorId = 1;
let nextPatientId = 1;
let nextAppointmentId = 1;
let nextPrescriptionId = 1;
let nextReportId = 1;
let nextArticleId = 1;
let nextChatId = 1;

const users: any[] = [];
const doctorProfiles: any[] = [];
const patientProfiles: any[] = [];
const appointments: any[] = [];
const prescriptions: any[] = [];
const reports: any[] = [];
const medicalArticles: any[] = [];
const chats: any[] = [];

// Seed Default Admin, Doctor and Patient
const passwordHash = bcrypt.hashSync('password123', 10);

// Demo Doctor User
const doctorUser = {
  id: nextUserId++,
  email: 'doctor@healthai.com',
  username: 'dr_jenkins',
  first_name: 'Sarah',
  last_name: 'Jenkins',
  role: 'doctor',
  phone: '+1-555-0192',
  password: passwordHash,
  created_at: new Date().toISOString()
};
users.push(doctorUser);

const doctorProfile = {
  id: nextDoctorId++,
  user: doctorUser,
  name: 'Dr. Sarah Jenkins',
  specialization: 'Cardiology & General Health',
  experience_years: 12,
  bio: 'Board-certified cardiologist specializing in preventive cardiovascular care and digital health interventions.',
  contact_number: '+1-555-0192',
  consultation_fee: '150.00',
  available_days: 'Mon, Wed, Fri'
};
doctorProfiles.push(doctorProfile);

// Demo Patient User
const patientUser = {
  id: nextUserId++,
  email: 'patient@healthai.com',
  username: 'john_doe',
  first_name: 'John',
  last_name: 'Doe',
  role: 'patient',
  phone: '+1-555-0144',
  password: passwordHash,
  created_at: new Date().toISOString()
};
users.push(patientUser);

const patientProfile = {
  id: nextPatientId++,
  user: patientUser,
  name: 'John Doe',
  age: 34,
  gender: 'Male',
  blood_group: 'O+',
  medical_history: 'Mild Hypertension, Asthma',
  emergency_contact: '+1-555-9988',
  address: '742 Evergreen Terrace, Springfield'
};
patientProfiles.push(patientProfile);

// Seed Initial Appointment
const initialAppt = {
  id: nextAppointmentId++,
  doctor: doctorProfile,
  patient: patientProfile,
  appointment_date: '2026-08-10',
  appointment_time: '10:00:00',
  reason: 'Routine Cardiovascular Checkup and Blood Pressure Review',
  status: 'scheduled',
  created_at: new Date().toISOString()
};
appointments.push(initialAppt);

// Seed Initial Prescription
const initialPrescription = {
  id: nextPrescriptionId++,
  appointment: initialAppt,
  doctor: doctorProfile,
  patient: patientProfile,
  diagnosis: 'Essential Hypertension (Stage 1)',
  medicines: 'Amlodipine 5mg once daily morning, Salbutamol inhaler as needed',
  instructions: 'Monitor BP twice daily. Low sodium diet, daily 30-min walk.',
  created_at: new Date().toISOString()
};
prescriptions.push(initialPrescription);

// Seed Initial Report
const initialReport = {
  id: nextReportId++,
  appointment: initialAppt,
  doctor: doctorProfile,
  patient: patientProfile,
  report_type: 'Comprehensive Blood Panel & Lipid Profile',
  report_file: '/media/sample_lipid_panel.pdf',
  uploaded_at: new Date().toISOString()
};
reports.push(initialReport);

// Seed Medical Articles
medicalArticles.push(
  {
    id: nextArticleId++,
    title: 'Breakthroughs in AI-Assisted Early Cardiac Biomarker Detection',
    category: 'Cardiology',
    short_description: 'Recent clinical trials demonstrate that continuous wearable signal processing combined with LLMs improves heart anomaly detection by 40%.',
    full_content: 'Cardiologists at major medical centers have integrated multimodal sensor networks with clinical generative models...',
    author: 'Dr. Sarah Jenkins',
    published_date: '2026-07-20',
    executive_summary: '',
    key_findings: '',
    why_this_matters: '',
    doctor_perspective: ''
  },
  {
    id: nextArticleId++,
    title: 'Metabolic Optimization & Digital Biomarker Tracking for Longevity',
    category: 'Endocrinology',
    short_description: 'Understanding continuous glucose monitoring and personalized glycemic index scoring for long-term healthspan extension.',
    full_content: 'A comprehensive longitudinal study highlights how real-time glycemic variability metrics offer early diagnostic markers...',
    author: 'HealthAI Editorial Team',
    published_date: '2026-07-18',
    executive_summary: '',
    key_findings: '',
    why_this_matters: '',
    doctor_perspective: ''
  }
);

// Auth Middleware Helper
const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'Authentication credentials were not provided.' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.user_id || u.email === decoded.email);
    if (!user) {
      return res.status(401).json({ detail: 'User not found or token invalid.' });
    }

    req.user = {
      ...user,
      doctor_profile: doctorProfiles.find(d => d.user.id === user.id),
      patient_profile: patientProfiles.find(p => p.user.id === user.id)
    };
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Token is invalid or expired.' });
  }
};

// ---------------- API ROUTES ----------------

// JWT Token Endpoints
app.post('/api/token/', (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const identifier = email || username;

  const user = users.find(u => u.email === identifier || u.username === identifier);
  if (!user || !bcrypt.compareSync(password || '', user.password)) {
    return res.status(401).json({ detail: 'No active account found with the given credentials' });
  }

  const payload = {
    user_id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

  return res.json({
    access: accessToken,
    refresh: refreshToken
  });
});

app.post('/api/token/refresh/', (req: Request, res: Response) => {
  const { refresh } = req.body;
  if (!refresh) {
    return res.status(400).json({ detail: 'Refresh token is required' });
  }

  try {
    const decoded: any = jwt.verify(refresh, JWT_SECRET);
    const newAccessToken = jwt.sign(
      { user_id: decoded.user_id, email: decoded.email, username: decoded.username, role: decoded.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ access: newAccessToken });
  } catch (e) {
    return res.status(401).json({ detail: 'Invalid or expired refresh token' });
  }
});

// Accounts Routes
app.post('/accounts/register/', (req: Request, res: Response) => {
  const { email, username, password, role, first_name, last_name, phone } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  if (users.some(u => u.email === email)) {
    return res.status(400).json({ email: ['User with this email already exists.'] });
  }

  const newUser = {
    id: nextUserId++,
    email,
    username: username || email.split('@')[0],
    first_name: first_name || '',
    last_name: last_name || '',
    role,
    phone: phone || '',
    password: bcrypt.hashSync(password, 10),
    created_at: new Date().toISOString()
  };
  users.push(newUser);

  if (role === 'doctor') {
    const newDoc = {
      id: nextDoctorId++,
      user: newUser,
      name: `Dr. ${newUser.first_name || ''} ${newUser.last_name || newUser.username}`.trim(),
      specialization: 'General Medicine',
      experience_years: 1,
      bio: '',
      contact_number: phone || '',
      consultation_fee: '100.00',
      available_days: 'Mon-Fri'
    };
    doctorProfiles.push(newDoc);
  } else if (role === 'patient') {
    const newPat = {
      id: nextPatientId++,
      user: newUser,
      name: `${newUser.first_name || ''} ${newUser.last_name || newUser.username}`.trim(),
      age: 30,
      gender: 'Other',
      blood_group: 'A+',
      medical_history: 'None reported',
      emergency_contact: phone || '',
      address: ''
    };
    patientProfiles.push(newPat);
  }

  return res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    role: newUser.role,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    phone: newUser.phone
  });
});

app.get('/accounts/me/', authenticateToken, (req: any, res: Response) => {
  const user = req.user;
  return res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone
  });
});

app.put('/accounts/update/:pk/', authenticateToken, (req: any, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const user = users.find(u => u.id === pk);
  if (!user) return res.status(404).json({ error: 'User not found' });

  Object.assign(user, req.body);
  return res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone
  });
});

app.patch('/accounts/update/:pk/', authenticateToken, (req: any, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const user = users.find(u => u.id === pk);
  if (!user) return res.status(404).json({ error: 'User not found' });

  Object.assign(user, req.body);
  return res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone
  });
});

app.post('/accounts/change_password/:pk/', authenticateToken, (req: any, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const { old_password, new_password } = req.body;
  const user = users.find(u => u.id === pk);

  if (!user || !bcrypt.compareSync(old_password || '', user.password)) {
    return res.status(400).json({ error: 'Old password is incorrect' });
  }

  user.password = bcrypt.hashSync(new_password, 10);
  return res.json({ message: 'Password changed successfully' });
});

// Doctor Profiles Routes
app.get('/doctors/profile/', (req: Request, res: Response) => {
  return res.json(doctorProfiles);
});

app.get('/doctors/profile/:pk/', (req: Request, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const doc = doctorProfiles.find(d => d.id === pk || d.user.id === pk);
  if (!doc) return res.status(404).json({ error: 'Doctor profile not found.' });
  return res.json(doc);
});

app.post('/doctors/profile/', authenticateToken, (req: any, res: Response) => {
  const newDoc = {
    id: nextDoctorId++,
    user: req.user,
    ...req.body
  };
  doctorProfiles.push(newDoc);
  return res.status(201).json(newDoc);
});

app.patch('/doctors/profile/:pk/', authenticateToken, (req: Request, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const doc = doctorProfiles.find(d => d.id === pk);
  if (!doc) return res.status(404).json({ error: 'Doctor profile not found.' });

  Object.assign(doc, req.body);
  return res.json(doc);
});

app.delete('/doctors/profile/:pk/', authenticateToken, (req: Request, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const index = doctorProfiles.findIndex(d => d.id === pk);
  if (index === -1) return res.status(404).json({ error: 'Doctor profile not found.' });

  doctorProfiles.splice(index, 1);
  return res.json({ message: 'Doctor profile deleted successfully.' });
});

// Patient Profiles Routes
app.get('/patients/profile/', authenticateToken, (req: any, res: Response) => {
  if (req.user.role === 'doctor') {
    return res.json(patientProfiles);
  }
  return res.json(patientProfiles.filter(p => p.user.id === req.user.id));
});

app.get('/patients/profile/:pk/', authenticateToken, (req: Request, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const pat = patientProfiles.find(p => p.id === pk || p.user.id === pk);
  if (!pat) return res.status(404).json({ error: 'Patient profile not found.' });
  return res.json(pat);
});

app.post('/patients/profile/', authenticateToken, (req: any, res: Response) => {
  const newPat = {
    id: nextPatientId++,
    user: req.user,
    ...req.body
  };
  patientProfiles.push(newPat);
  return res.status(201).json(newPat);
});

app.patch('/patients/profile/:pk/', authenticateToken, (req: Request, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const pat = patientProfiles.find(p => p.id === pk);
  if (!pat) return res.status(404).json({ error: 'Patient profile not found.' });

  Object.assign(pat, req.body);
  return res.json(pat);
});

// Appointments Routes
app.get('/appointments/appointments/', authenticateToken, (req: any, res: Response) => {
  const role = req.user.role;
  let result = [];

  if (role === 'doctor') {
    const docProfile = req.user.doctor_profile || doctorProfiles[0];
    result = appointments.filter(a => a.doctor.id === docProfile?.id || a.doctor.user?.id === req.user.id);
  } else if (role === 'patient') {
    const patProfile = req.user.patient_profile || patientProfiles[0];
    result = appointments.filter(a => a.patient.id === patProfile?.id || a.patient.user?.id === req.user.id);
  } else {
    return res.status(403).json({ error: 'Invalid role' });
  }

  const statusFilter = req.query.status;
  if (statusFilter) {
    result = result.filter(a => a.status === statusFilter);
  }

  return res.json(result);
});

app.get('/appointments/appointments/:pk/', authenticateToken, (req: any, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const appt = appointments.find(a => a.id === pk);
  if (!appt) return res.status(404).json({ error: 'Appointment not found.' });
  return res.json(appt);
});

app.post('/appointments/appointments/', authenticateToken, (req: any, res: Response) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Only patients can create appointments.' });
  }

  const { doctor: doctorId, appointment_date, appointment_time, reason } = req.body;
  if (!doctorId) {
    return res.status(400).json({ error: 'Doctor ID is required.' });
  }

  const targetDoctor = doctorProfiles.find(d => d.id === parseInt(doctorId, 10) || d.user.id === parseInt(doctorId, 10));
  if (!targetDoctor) {
    return res.status(404).json({ error: 'Doctor profile not found.' });
  }

  const patProfile = req.user.patient_profile || patientProfiles[0];

  const newAppt = {
    id: nextAppointmentId++,
    doctor: targetDoctor,
    patient: patProfile,
    appointment_date: appointment_date || new Date().toISOString().split('T')[0],
    appointment_time: appointment_time || '09:00:00',
    reason: reason || 'General Consultation',
    status: 'scheduled',
    created_at: new Date().toISOString()
  };

  appointments.push(newAppt);
  return res.status(201).json({
    message: 'Appointment created successfully',
    data: newAppt
  });
});

app.patch('/appointments/appointments/:pk/', authenticateToken, (req: any, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const appt = appointments.find(a => a.id === pk);
  if (!appt) return res.status(404).json({ error: 'Appointment not found.' });

  if (appt.status === 'cancelled') {
    return res.status(400).json({ error: 'Cancelled appointments cannot be modified.' });
  }

  if (req.body.status && req.user.role === 'patient') {
    return res.status(403).json({ error: 'Only doctors can update appointment status.' });
  }

  Object.assign(appt, req.body);
  return res.json({
    message: 'Appointment updated successfully.',
    data: appt
  });
});

app.delete('/appointments/appointments/:pk/', authenticateToken, (req: any, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const appt = appointments.find(a => a.id === pk);
  if (!appt) return res.status(404).json({ error: 'Appointment not found.' });

  appt.status = 'cancelled';
  return res.json({ message: 'Appointment cancelled successfully.' });
});

// Prescriptions Routes
app.get('/prescriptions/prescriptions/', authenticateToken, (req: any, res: Response) => {
  const role = req.user.role;
  let result = [];

  if (role === 'doctor') {
    const docProfile = req.user.doctor_profile || doctorProfiles[0];
    result = prescriptions.filter(p => p.doctor.id === docProfile?.id || p.doctor.user?.id === req.user.id);
  } else if (role === 'patient') {
    const patProfile = req.user.patient_profile || patientProfiles[0];
    result = prescriptions.filter(p => p.patient.id === patProfile?.id || p.patient.user?.id === req.user.id);
  } else {
    result = prescriptions;
  }

  return res.json(result);
});

app.get('/prescriptions/prescriptions/:pk/', authenticateToken, (req: Request, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const p = prescriptions.find(item => item.id === pk);
  if (!p) return res.status(404).json({ error: 'Prescription not found' });
  return res.json(p);
});

app.post('/prescriptions/prescriptions/', authenticateToken, (req: any, res: Response) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Only doctors can issue prescriptions.' });
  }

  const { appointment: apptId, diagnosis, medicines, instructions } = req.body;
  const targetAppt = appointments.find(a => a.id === parseInt(apptId, 10));

  if (!targetAppt) {
    return res.status(404).json({ error: 'Associated appointment not found.' });
  }

  const newPrescription = {
    id: nextPrescriptionId++,
    appointment: targetAppt,
    doctor: targetAppt.doctor,
    patient: targetAppt.patient,
    diagnosis: diagnosis || 'General Health Consultation',
    medicines: medicines || '',
    instructions: instructions || '',
    created_at: new Date().toISOString()
  };

  prescriptions.push(newPrescription);
  return res.status(201).json(newPrescription);
});

// Reports Routes
app.get('/reports/reports/', authenticateToken, (req: any, res: Response) => {
  const role = req.user.role;
  let result = [];

  if (role === 'doctor') {
    const docProfile = req.user.doctor_profile || doctorProfiles[0];
    result = reports.filter(r => r.doctor?.id === docProfile?.id || r.appointment?.doctor?.id === docProfile?.id);
  } else if (role === 'patient') {
    const patProfile = req.user.patient_profile || patientProfiles[0];
    result = reports.filter(r => r.patient?.id === patProfile?.id || r.appointment?.patient?.id === patProfile?.id);
  } else {
    result = reports;
  }

  return res.json(result);
});

app.post('/reports/reports/', authenticateToken, upload.single('report_file'), (req: any, res: Response) => {
  const { appointment: apptId, report_type } = req.body;
  const targetAppt = appointments.find(a => a.id === parseInt(apptId, 10));

  if (!targetAppt) {
    return res.status(400).json({ error: 'Valid appointment required for report' });
  }

  const filePath = req.file ? `/media/${req.file.filename}` : '/media/sample_medical_report.pdf';

  const newReport = {
    id: nextReportId++,
    appointment: targetAppt,
    doctor: targetAppt.doctor,
    patient: targetAppt.patient,
    report_type: report_type || 'Diagnostic Lab Report',
    report_file: filePath,
    uploaded_at: new Date().toISOString()
  };

  reports.push(newReport);
  return res.status(201).json(newReport);
});

// Dashboard Routes
app.get('/dashboard/doctor/', authenticateToken, (req: any, res: Response) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Only doctors can access this dashboard.' });
  }

  const doctor = req.user.doctor_profile || doctorProfiles[0];
  const docAppts = appointments.filter(a => a.doctor.id === doctor.id);

  const totalPatients = new Set(docAppts.map(a => a.patient.id)).size;
  const recentScheduled = docAppts.filter(a => a.status === 'scheduled').slice(0, 5);
  const recentReports = reports.filter(r => r.appointment?.doctor?.id === doctor.id).slice(0, 5);

  return res.json({
    total_patients: totalPatients,
    total_appointments: docAppts.length,
    scheduled_appointments: docAppts.filter(a => a.status === 'scheduled').length,
    completed_appointments: docAppts.filter(a => a.status === 'completed').length,
    cancelled_appointments: docAppts.filter(a => a.status === 'cancelled').length,
    total_reports: reports.filter(r => r.appointment?.doctor?.id === doctor.id).length,
    total_prescriptions: prescriptions.filter(p => p.appointment?.doctor?.id === doctor.id).length,
    recent_appointments: recentScheduled,
    recent_reports: recentReports
  });
});

app.get('/dashboard/patient/', authenticateToken, (req: any, res: Response) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Only patients can access this dashboard.' });
  }

  const patient = req.user.patient_profile || patientProfiles[0];
  const patAppts = appointments.filter(a => a.patient.id === patient.id);

  return res.json({
    upcoming_appointments: patAppts.filter(a => a.status === 'scheduled').length,
    completed_appointments: patAppts.filter(a => a.status === 'completed').length,
    cancelled_appointments: patAppts.filter(a => a.status === 'cancelled').length,
    total_reports: reports.filter(r => r.patient?.id === patient.id).length,
    total_prescriptions: prescriptions.filter(p => p.patient?.id === patient.id).length,
    recent_appointments: patAppts.slice(0, 5)
  });
});

// AI Engine Services (Gemini API integration)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

app.get('/ai-engine/appointment/:pk/generate-insight/', authenticateToken, async (req: any, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const appt = appointments.find(a => a.id === pk);

  if (!appt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  const rx = prescriptions.find(p => p.appointment.id === appt.id);
  const rep = reports.find(r => r.appointment.id === appt.id);

  if (!rx) {
    return res.status(400).json({ error: 'Create a prescription before generating insights.' });
  }
  if (!rep) {
    return res.status(400).json({ error: 'Upload a medical report first.' });
  }

  const prompt = `You are a clinical AI medical insights system. Analyze the following medical case and provide structured advice.
Reason for Appointment: ${appt.reason}
Diagnosis: ${rx.diagnosis}
Prescribed Medicines: ${rx.medicines}
Instructions: ${rx.instructions}
Medical Report Type: ${rep.report_type}

Return ONLY a valid JSON object matching this structure:
{
  "summary": "Clear, patient-friendly summary of the diagnosis and care plan.",
  "key_findings": ["Key finding 1", "Key finding 2"],
  "medication_guidance": ["Guidance on taking prescribed medicines"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "foods_to_eat": ["Nutritious food 1", "Nutritious food 2"],
  "foods_to_avoid": ["Food to avoid 1", "Food to avoid 2"],
  "home_care_tips": ["Home care tip 1", "Home care tip 2"],
  "follow_up_questions": [
    { "question": "Question to ask during follow-up?", "answer": "Informative answer." }
  ],
  "risk_factors": ["Potential risk factor to monitor"],
  "confidence_level": "high"
}`;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const text = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (e) {
      console.error('Gemini error:', e);
    }
  }

  // Fallback response when API key is missing or offline
  return res.json({
    summary: `Based on the diagnosis of ${rx.diagnosis}, follow your prescribed dosage of ${rx.medicines} consistently and maintain regular blood pressure monitoring.`,
    key_findings: [
      `Primary Diagnosis: ${rx.diagnosis}`,
      `Active Medication: ${rx.medicines}`,
      `Report Verified: ${rep.report_type}`
    ],
    medication_guidance: [
      'Take medications at the same time each day with water.',
      'Do not abruptly discontinue without consulting your physician.'
    ],
    recommendations: [
      'Maintain continuous blood pressure monitoring logs.',
      'Schedule a follow-up consultation in 4 weeks.'
    ],
    foods_to_eat: ['Leafy green vegetables', 'Whole grains & oats', 'Potassium-rich fruits (bananas, avocados)'],
    foods_to_avoid: ['High-sodium processed snacks', 'Excessive caffeine', 'Saturated fats'],
    home_care_tips: ['Perform 30 minutes of moderate aerobic walking daily', 'Practice 10 minutes of deep breathing exercises'],
    follow_up_questions: [
      {
        question: 'When should I report back for my next blood test?',
        answer: 'Typically after 4 to 6 weeks of continuous medication adherence.'
      }
    ],
    risk_factors: ['Elevated resting pulse', 'Sodium sensitivity'],
    confidence_level: 'high'
  });
});

// Medical News & Articles
app.get('/ai-engine/news/', (req: Request, res: Response) => {
  const category = req.query.category as string;
  let articles = medicalArticles;
  if (category && category !== 'All') {
    articles = articles.filter(a => a.category.toLowerCase().includes(category.toLowerCase()));
  }
  return res.json(articles);
});

app.post('/ai-engine/news/:pk/analyze/', async (req: Request, res: Response) => {
  const pk = parseInt(req.params.pk, 10);
  const article = medicalArticles.find(a => a.id === pk);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  if (!article.executive_summary) {
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `Analyze this medical article. Return ONLY valid JSON:
{
  "executive_summary": "2-3 sentence overview.",
  "key_findings": ["Finding 1", "Finding 2"],
  "why_this_matters": "Impact on healthcare.",
  "doctor_perspective": "Clinical practice view."
}
Title: ${article.title}
Content: ${article.short_description}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });
        const parsed = JSON.parse((response.text || '').replace(/```json/g, '').replace(/```/g, '').trim());
        article.executive_summary = parsed.executive_summary;
        article.key_findings = (parsed.key_findings || []).join('\n');
        article.why_this_matters = parsed.why_this_matters;
        article.doctor_perspective = parsed.doctor_perspective;
      } catch (e) {
        console.error('Gemini news analysis error:', e);
      }
    }

    if (!article.executive_summary) {
      article.executive_summary = 'Recent clinical developments demonstrate key insights for early disease prevention and digital health tracking.';
      article.key_findings = 'Early biomarker detection improves outcomes.\nWearable integration enhances real-time monitoring.';
      article.why_this_matters = 'Allows preventive clinical intervention prior to symptom escalation.';
      article.doctor_perspective = 'Doctors can utilize continuous patient telemetry for safer medication titration.';
    }
  }

  return res.json({
    executive_summary: article.executive_summary,
    key_findings: article.key_findings ? article.key_findings.split('\n') : [],
    why_this_matters: article.why_this_matters,
    doctor_perspective: article.doctor_perspective
  });
});

// Health Assistant Chatbot
app.get('/ai-engine/chat/', authenticateToken, (req: any, res: Response) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Only patients can access chat history.' });
  }

  const patient = req.user.patient_profile || patientProfiles[0];
  const userChats = chats.filter(c => c.patient_id === patient.id);
  return res.json(userChats.map(c => ({ role: c.role, text: c.message })));
});

app.post('/ai-engine/chat/', authenticateToken, async (req: any, res: Response) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Only patients can use the health assistant.' });
  }

  const patient = req.user.patient_profile || patientProfiles[0];

  // Store user message
  chats.push({ id: nextChatId++, patient_id: patient.id, role: 'user', message: question, timestamp: new Date() });

  const patientAppts = appointments.filter(a => a.patient.id === patient.id);
  let contextData = `Patient Name: ${patient.name}\nAge: ${patient.age}\nMedical History: ${patient.medical_history}\n`;

  patientAppts.forEach(a => {
    const rx = prescriptions.find(p => p.appointment.id === a.id);
    contextData += `\nAppointment Date: ${a.appointment_date}\nReason: ${a.reason}\nStatus: ${a.status}\n`;
    if (rx) {
      contextData += `Diagnosis: ${rx.diagnosis}\nMedicines: ${rx.medicines}\nInstructions: ${rx.instructions}\n`;
    }
  });

  let answerText = '';
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are HealthAI, a friendly, empathetic medical AI assistant speaking directly to the patient.
Rules:
1. Speak directly to the patient ("you").
2. Be concise, warm, and professional.
3. Use the patient's medical records context below if relevant:
${contextData}

Patient Question: "${question}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      answerText = (response.text || '').trim();
    } catch (e) {
      console.error('Gemini chat error:', e);
    }
  }

  if (!answerText) {
    answerText = `Hello ${patient.name}! Based on your records, you are currently being treated for ${patient.medical_history}. Please ensure you follow your prescribed medication routine and reach out to Dr. Sarah Jenkins if you experience any unusual symptoms. Is there a specific symptom or prescription detail you would like me to review with you?`;
  }

  // Store assistant response
  chats.push({ id: nextChatId++, patient_id: patient.id, role: 'assistant', message: answerText, timestamp: new Date() });

  return res.json({ answer: answerText });
});

// ---------------- VITE & STATIC SERVING ----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Health AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
