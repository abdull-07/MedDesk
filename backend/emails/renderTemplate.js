import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RenderTemplate {
  constructor() {
    this.templatesPath = path.join(__dirname, 'templates');
  }

  async render(templateName, data = {}) {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);
      
      // Check if template exists
      try {
        await fs.access(templatePath);
      } catch (error) {
        throw new Error(`Template '${templateName}' not found at ${templatePath}`);
      }

      // Render template with data
      const html = await ejs.renderFile(templatePath, data, {
        async: true,
        cache: process.env.NODE_ENV === 'production'
      });

      return html;
    } catch (error) {
      console.error('Template rendering error:', {
        template: templateName,
        error: error.message
      });
      throw error;
    }
  }

  // Render appointment-related templates
  async renderAppointmentTemplate(templateName, appointmentData) {
    const baseData = {
      // Common appointment data
      appointmentId: appointmentData.appointmentId,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      duration: appointmentData.duration || 30,
      appointmentType: appointmentData.appointmentType,
      location: appointmentData.location,
      notes: appointmentData.notes,
      
      // URLs
      dashboardUrl: appointmentData.dashboardUrl,
      rescheduleUrl: appointmentData.rescheduleUrl,
      joinUrl: appointmentData.joinUrl,
      
      // Recipient info
      recipientName: appointmentData.recipientName,
      recipientType: appointmentData.recipientType, // 'patient' or 'doctor'
      
      // Doctor info
      doctorName: appointmentData.doctorName,
      doctorSpecialization: appointmentData.doctorSpecialization,
      
      // Patient info
      patientName: appointmentData.patientName,
      patientPhone: appointmentData.patientPhone,
      
      // Additional data based on template
      ...appointmentData.additionalData
    };

    return await this.render(templateName, baseData);
  }

  // Render doctor-related templates
  async renderDoctorTemplate(templateName, doctorData) {
    const baseData = {
      doctorName: doctorData.doctorName,
      doctorEmail: doctorData.doctorEmail,
      doctorId: doctorData.doctorId,
      applicationId: doctorData.applicationId,
      specialization: doctorData.specialization,
      licenseNumber: doctorData.licenseNumber,
      
      // Dates
      submittedDate: doctorData.submittedDate,
      approvalDate: doctorData.approvalDate,
      reviewDate: doctorData.reviewDate,
      
      // URLs
      loginUrl: doctorData.loginUrl,
      setupGuideUrl: doctorData.setupGuideUrl,
      reapplyUrl: doctorData.reapplyUrl,
      supportUrl: doctorData.supportUrl,
      
      // Additional data
      temporaryPassword: doctorData.temporaryPassword,
      rejectionReasons: doctorData.rejectionReasons,
      canReapply: doctorData.canReapply,
      additionalNotes: doctorData.additionalNotes,
      
      ...doctorData.additionalData
    };

    return await this.render(templateName, baseData);
  }

  // Render patient-related templates
  async renderPatientTemplate(templateName, patientData) {
    const baseData = {
      patientName: patientData.patientName,
      patientEmail: patientData.patientEmail,
      patientId: patientData.patientId,
      
      // Verification data
      verificationCode: patientData.verificationCode,
      expiryTime: patientData.expiryTime || 15,
      
      // Dates
      registrationDate: patientData.registrationDate,
      verificationDate: patientData.verificationDate,
      
      // URLs
      verificationUrl: patientData.verificationUrl,
      resendUrl: patientData.resendUrl,
      dashboardUrl: patientData.dashboardUrl,
      findDoctorUrl: patientData.findDoctorUrl,
      mobileAppUrl: patientData.mobileAppUrl,
      
      ...patientData.additionalData
    };

    return await this.render(templateName, baseData);
  }

  // Render appointment expiry reminder template
  async renderExpiryReminder(appointmentData) {
    const timeRemaining = this.calculateTimeRemaining(appointmentData.expiryTime);
    
    const data = {
      ...appointmentData,
      timeRemaining
    };

    return await this.renderAppointmentTemplate('appointmentExpiryReminder', data);
  }

  // Render appointment rescheduled template
  async renderRescheduled(appointmentData) {
    const data = {
      ...appointmentData,
      oldAppointmentDate: appointmentData.oldAppointmentDate,
      oldAppointmentTime: appointmentData.oldAppointmentTime,
      newAppointmentDate: appointmentData.newAppointmentDate,
      newAppointmentTime: appointmentData.newAppointmentTime,
      rescheduledBy: appointmentData.rescheduledBy,
      rescheduleDate: appointmentData.rescheduleDate,
      rescheduleReason: appointmentData.rescheduleReason,
      addToCalendarUrl: appointmentData.addToCalendarUrl
    };

    return await this.renderAppointmentTemplate('appointmentRescheduled', data);
  }

  // Helper method to calculate time remaining
  calculateTimeRemaining(expiryTime) {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry - now;

    if (diff <= 0) {
      return 'Expired';
    }

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${remainingMinutes} minutes`;
    }
  }

  // Get list of available templates
  async getAvailableTemplates() {
    try {
      const files = await fs.readdir(this.templatesPath);
      return files
        .filter(file => file.endsWith('.ejs'))
        .map(file => file.replace('.ejs', ''));
    } catch (error) {
      console.error('Error reading templates directory:', error);
      return [];
    }
  }

  // Validate template data
  validateTemplateData(templateName, data) {
    const requiredFields = {
      appointmentCreated: ['recipientName', 'appointmentId', 'appointmentDate', 'appointmentTime'],
      appointmentCancelled: ['recipientName', 'appointmentId', 'appointmentDate', 'appointmentTime'],
      appointmentCompleted: ['recipientName', 'appointmentId', 'appointmentDate', 'appointmentTime'],
      appointmentExpired: ['recipientName', 'appointmentId', 'appointmentDate', 'appointmentTime'],
      appointmentReminder: ['recipientName', 'appointmentId', 'appointmentDate', 'appointmentTime'],
      appointmentExpiryReminder: ['recipientName', 'appointmentId', 'appointmentDate', 'appointmentTime'],
      appointmentRescheduled: ['recipientName', 'appointmentId', 'newAppointmentDate', 'newAppointmentTime'],
      doctorSignupPending: ['doctorName', 'applicationId', 'submittedDate'],
      doctorApproved: ['doctorName', 'doctorEmail', 'approvalDate'],
      doctorRejected: ['doctorName', 'applicationId', 'reviewDate'],
      patientVerification: ['patientName', 'patientEmail', 'verificationCode'],
      patientVerified: ['patientName', 'patientEmail', 'verificationDate']
    };

    const required = requiredFields[templateName];
    if (!required) {
      return { valid: true };
    }

    const missing = required.filter(field => !data[field]);
    if (missing.length > 0) {
      return {
        valid: false,
        missingFields: missing
      };
    }

    return { valid: true };
  }
}

export default new RenderTemplate();