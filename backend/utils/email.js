import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const emailTemplates = {
  // Existing templates
  doctorVerified: (doctorName) => ({
    subject: 'Your Doctor Account has been Verified',
    html: `
      <h2>Congratulations, Dr. ${doctorName}!</h2>
      <p>Your doctor account has been verified by our admin team. You can now:</p>
      <ul>
        <li>Set up your availability schedule</li>
        <li>Accept appointment bookings</li>
        <li>Access all doctor features</li>
      </ul>
      <p>Log in to your account to get started.</p>
      <p>Best regards,<br>MedDesk Team</p>
    `
  }),

  doctorRejected: (doctorName, reason) => ({
    subject: 'Doctor Account Verification Update',
    html: `
      <h2>Dear Dr. ${doctorName},</h2>
      <p>We regret to inform you that your doctor account verification was not approved.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>You can submit a new verification request with updated information.</p>
      <p>If you believe this was a mistake, please contact our support team.</p>
      <p>Best regards,<br>MedDesk Team</p>
    `
  }),

  adminNewDoctor: (doctorName, doctorEmail) => ({
    subject: 'New Doctor Registration Pending Verification',
    html: `
      <h2>New Doctor Registration</h2>
      <p>A new doctor has registered and is pending verification:</p>
      <ul>
        <li><strong>Name:</strong> Dr. ${doctorName}</li>
        <li><strong>Email:</strong> ${doctorEmail}</li>
      </ul>
      <p>Please review their credentials in the admin dashboard.</p>
    `
  }),

  // New templates for appointments
  appointmentConfirmed: ({ patientName, doctorName, date, time, type }) => ({
    subject: 'Appointment Confirmed',
    html: `
      <h2>Appointment Confirmation</h2>
      <p>Dear ${patientName},</p>
      <p>Your appointment has been confirmed with the following details:</p>
      <ul>
        <li><strong>Doctor:</strong> Dr. ${doctorName}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Type:</strong> ${type}</li>
      </ul>
      <p>Please arrive 10 minutes before your scheduled time.</p>
      <p>If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
      <p>Best regards,<br>MedDesk Team</p>
    `
  }),

  appointmentReminder: ({ patientName, doctorName, date, time, type }) => ({
    subject: 'Appointment Reminder',
    html: `
      <h2>Appointment Reminder</h2>
      <p>Dear ${patientName},</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <ul>
        <li><strong>Doctor:</strong> Dr. ${doctorName}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Type:</strong> ${type}</li>
      </ul>
      <p>Please arrive 10 minutes before your scheduled time.</p>
      <p>Best regards,<br>MedDesk Team</p>
    `
  }),

  appointmentCancelled: ({ patientName, doctorName, date, time, reason }) => ({
    subject: 'Appointment Cancellation',
    html: `
      <h2>Appointment Cancelled</h2>
      <p>Dear ${patientName},</p>
      <p>Your appointment has been cancelled:</p>
      <ul>
        <li><strong>Doctor:</strong> Dr. ${doctorName}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Reason:</strong> ${reason}</li>
      </ul>
      <p>You can book a new appointment through our platform.</p>
      <p>Best regards,<br>MedDesk Team</p>
    `
  }),

  appointmentRescheduled: ({ patientName, doctorName, oldDate, oldTime, newDate, newTime, type }) => ({
    subject: 'Appointment Rescheduled',
    html: `
      <h2>Appointment Rescheduled</h2>
      <p>Dear ${patientName},</p>
      <p>Your appointment has been rescheduled:</p>
      <ul>
        <li><strong>Doctor:</strong> Dr. ${doctorName}</li>
        <li><strong>Original Date/Time:</strong> ${oldDate} at ${oldTime}</li>
        <li><strong>New Date/Time:</strong> ${newDate} at ${newTime}</li>
        <li><strong>Type:</strong> ${type}</li>
      </ul>
      <p>If this new time doesn't work for you, please reschedule through our platform.</p>
      <p>Best regards,<br>MedDesk Team</p>
    `
  }),

  doctorAppointmentReminder: ({ doctorName, patientName, date, time, type }) => ({
    subject: 'Upcoming Appointment Reminder',
    html: `
      <h2>Upcoming Appointment</h2>
      <p>Dear Dr. ${doctorName},</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <ul>
        <li><strong>Patient:</strong> ${patientName}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Type:</strong> ${type}</li>
      </ul>
      <p>Best regards,<br>MedDesk Team</p>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data = {}) => {
  try {
    const { subject, html } = emailTemplates[template](data);

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export { sendEmail }; 