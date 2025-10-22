import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class SendEmail {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Configure based on email service provider
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    
    if (emailService === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD // Use app password for Gmail
        }
      });
    } else if (emailService === 'smtp') {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
    } else if (emailService === 'sendgrid') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    }
    
    // Default fallback
    return nodemailer.createTransport({
      host: 'localhost',
      port: 587,
      secure: false
    });
  }

  async send(mailOptions) {
    try {
      // Validate required fields
      if (!mailOptions.to || !mailOptions.subject || !mailOptions.html) {
        throw new Error('Missing required email fields: to, subject, or html');
      }

      // Set default from address if not provided
      if (!mailOptions.from) {
        mailOptions.from = process.env.EMAIL_FROM || 'noreply@healthcareplatform.com';
      }

      // Send email
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      console.error('Email sending failed:', {
        error: error.message,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendBulk(emails) {
    const results = [];
    
    for (const email of emails) {
      const result = await this.send(email);
      results.push({
        to: email.to,
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
    }

    return results;
  }

  // Verify transporter configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error.message);
      return false;
    }
  }

  // Test email functionality
  async sendTestEmail(to) {
    const testEmail = {
      to,
      subject: 'Healthcare Platform - Test Email',
      html: `
        <h2>Email Service Test</h2>
        <p>This is a test email from the Healthcare Platform.</p>
        <p>If you received this email, the email service is working correctly.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `
    };

    return await this.send(testEmail);
  }
}

export default new SendEmail();