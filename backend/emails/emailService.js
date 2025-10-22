import SendEmail from './sendEmail.js';
import RenderTemplate from './renderTemplate.js';

class EmailService {
  constructor() {
    this.sendEmail = SendEmail;
    this.renderTemplate = RenderTemplate;
  }

  // Initialize email service
  async initialize() {
    try {
      const isConnected = await this.sendEmail.verifyConnection();
      if (!isConnected) {
        console.warn('Email service connection failed - emails will not be sent');
      }
      return isConnected;
    } catch (error) {
      console.error('Email service initialization error:', error);
      return false;
    }
  }

  // Send appointment created email
  async sendAppointmentCreated(appointmentData) {
    try {
      const { recipientEmail, recipientType } = appointmentData;
      
      const html = await this.renderTemplate.renderAppointmentTemplate('appointmentCreated', appointmentData);
      
      const subject = `Appointment Confirmed - ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime}`;
      
      return await this.sendEmail.send({
        to: recipientEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send appointment created email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send appointment cancelled email
  async sendAppointmentCancelled(appointmentData) {
    try {
      const { recipientEmail } = appointmentData;
      
      const html = await this.renderTemplate.renderAppointmentTemplate('appointmentCancelled', appointmentData);
      
      const subject = `Appointment Cancelled - ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime}`;
      
      return await this.sendEmail.send({
        to: recipientEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send appointment cancelled email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send appointment completed email
  async sendAppointmentCompleted(appointmentData) {
    try {
      const { recipientEmail } = appointmentData;
      
      const html = await this.renderTemplate.renderAppointmentTemplate('appointmentCompleted', appointmentData);
      
      const subject = `Appointment Completed - Thank you for your visit`;
      
      return await this.sendEmail.send({
        to: recipientEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send appointment completed email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send appointment expired email
  async sendAppointmentExpired(appointmentData) {
    try {
      const { recipientEmail } = appointmentData;
      
      const html = await this.renderTemplate.renderAppointmentTemplate('appointmentExpired', appointmentData);
      
      const subject = `Appointment Expired - ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime}`;
      
      return await this.sendEmail.send({
        to: recipientEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send appointment expired email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send appointment reminder email (24 hours advance)
  async sendAppointmentReminder(appointmentData) {
    try {
      const { recipientEmail } = appointmentData;
      
      const html = await this.renderTemplate.renderAppointmentTemplate('appointmentReminder', appointmentData);
      
      const subject = `📅 Appointment Reminder - ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime}`;
      
      return await this.sendEmail.send({
        to: recipientEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send appointment reminder email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send appointment expiry reminder email (urgent - 1 hour)
  async sendAppointmentExpiryReminder(appointmentData) {
    try {
      const { recipientEmail } = appointmentData;
      
      const html = await this.renderTemplate.renderExpiryReminder(appointmentData);
      
      const subject = `⚠️ Appointment Starting Soon - Join Now`;
      
      return await this.sendEmail.send({
        to: recipientEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send appointment expiry reminder email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send appointment rescheduled email
  async sendAppointmentRescheduled(appointmentData) {
    try {
      const { recipientEmail } = appointmentData;
      
      const html = await this.renderTemplate.renderRescheduled(appointmentData);
      
      const subject = `Appointment Rescheduled - New Time: ${appointmentData.newAppointmentDate} at ${appointmentData.newAppointmentTime}`;
      
      return await this.sendEmail.send({
        to: recipientEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send appointment rescheduled email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send doctor signup pending email
  async sendDoctorSignupPending(doctorData) {
    try {
      const { doctorEmail } = doctorData;
      
      const html = await this.renderTemplate.renderDoctorTemplate('doctorSignupPending', doctorData);
      
      const subject = `Application Received - Under Review`;
      
      return await this.sendEmail.send({
        to: doctorEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send doctor signup pending email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send doctor approved email
  async sendDoctorApproved(doctorData) {
    try {
      const { doctorEmail } = doctorData;
      
      const html = await this.renderTemplate.renderDoctorTemplate('doctorApproved', doctorData);
      
      const subject = `🎉 Application Approved - Welcome to HealthCare Platform!`;
      
      return await this.sendEmail.send({
        to: doctorEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send doctor approved email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send doctor rejected email
  async sendDoctorRejected(doctorData) {
    try {
      const { doctorEmail } = doctorData;
      
      const html = await this.renderTemplate.renderDoctorTemplate('doctorRejected', doctorData);
      
      const subject = `Application Status Update - Additional Information Required`;
      
      return await this.sendEmail.send({
        to: doctorEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send doctor rejected email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send patient verification email
  async sendPatientVerification(patientData) {
    try {
      const { patientEmail } = patientData;
      
      const html = await this.renderTemplate.renderPatientTemplate('patientVerification', patientData);
      
      const subject = `Verify Your Email Address - Healthcare Platform`;
      
      return await this.sendEmail.send({
        to: patientEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send patient verification email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send patient verified email
  async sendPatientVerified(patientData) {
    try {
      const { patientEmail } = patientData;
      
      const html = await this.renderTemplate.renderPatientTemplate('patientVerified', patientData);
      
      const subject = `🎉 Welcome to Healthcare Platform - Account Verified!`;
      
      return await this.sendEmail.send({
        to: patientEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Send patient verified email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send bulk emails (for reminders, notifications, etc.)
  async sendBulkEmails(emailsData) {
    try {
      const emails = [];
      
      for (const emailData of emailsData) {
        const { templateName, recipientEmail, subject, data } = emailData;
        
        let html;
        if (templateName.startsWith('appointment')) {
          html = await this.renderTemplate.renderAppointmentTemplate(templateName, data);
        } else if (templateName.startsWith('doctor')) {
          html = await this.renderTemplate.renderDoctorTemplate(templateName, data);
        } else if (templateName.startsWith('patient')) {
          html = await this.renderTemplate.renderPatientTemplate(templateName, data);
        } else {
          html = await this.renderTemplate.render(templateName, data);
        }
        
        emails.push({
          to: recipientEmail,
          subject: subject || `Healthcare Platform Notification`,
          html
        });
      }
      
      return await this.sendEmail.sendBulk(emails);
    } catch (error) {
      console.error('Send bulk emails error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send custom email with template
  async sendCustomEmail(templateName, recipientEmail, data, subject) {
    try {
      // Validate template data
      const validation = this.renderTemplate.validateTemplateData(templateName, data);
      if (!validation.valid) {
        throw new Error(`Missing required fields: ${validation.missingFields.join(', ')}`);
      }

      const html = await this.renderTemplate.render(templateName, data);
      
      return await this.sendEmail.send({
        to: recipientEmail,
        subject: subject || 'Healthcare Platform Notification',
        html
      });
    } catch (error) {
      console.error('Send custom email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send test email
  async sendTestEmail(recipientEmail) {
    try {
      return await this.sendEmail.sendTestEmail(recipientEmail);
    } catch (error) {
      console.error('Send test email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get available templates
  async getAvailableTemplates() {
    return await this.renderTemplate.getAvailableTemplates();
  }

  // Helper method to format appointment data for emails
  formatAppointmentData(appointment, recipient, recipientType) {
    return {
      appointmentId: appointment._id || appointment.id,
      appointmentDate: this.formatDate(appointment.startTime || appointment.date),
      appointmentTime: this.formatTime(appointment.startTime || appointment.time),
      duration: appointment.duration || 30,
      appointmentType: appointment.type,
      location: appointment.location,
      notes: appointment.notes,
      
      recipientName: recipient.name,
      recipientEmail: recipient.email,
      recipientType,
      
      doctorName: appointment.doctor?.name,
      doctorSpecialization: appointment.doctor?.specialization,
      
      patientName: appointment.patient?.name,
      patientPhone: appointment.patient?.phone,
      
      dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
      rescheduleUrl: `${process.env.FRONTEND_URL}/appointments/${appointment._id}/reschedule`,
      joinUrl: `${process.env.FRONTEND_URL}/appointments/${appointment._id}/join`
    };
  }

  // Helper method to format dates
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Helper method to format times
  formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

export default new EmailService();