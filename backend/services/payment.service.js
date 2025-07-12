import Payment from '../models/payment.model.js';
import Appointment from '../models/appointment.model.js';
import NotificationService from './notification.service.js';
import crypto from 'crypto';
import axios from 'axios';

class PaymentService {
  constructor() {
    this.merchantId = process.env.JAZZCASH_MERCHANT_ID;
    this.password = process.env.JAZZCASH_PASSWORD;
    this.returnUrl = process.env.JAZZCASH_RETURN_URL || 'http://localhost:3000/payment/callback';
    this.isTestMode = process.env.NODE_ENV !== 'production';
  }

  async createJazzCashPayment(paymentData) {
    try {
      const {
        appointmentId,
        amount,
        customerEmail,
        customerPhone,
        description
      } = paymentData;

      // Get appointment details
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Create or get existing payment
      let payment = await Payment.findOne({
        appointment: appointmentId,
        status: 'pending'
      });

      if (!payment) {
        payment = new Payment({
          appointment: appointmentId,
          patient: appointment.patient,
          doctor: appointment.doctor,
          amount: amount,
          currency: 'PKR',
          status: 'pending'
        });
        await payment.save();
      }

      // Generate a unique transaction ID
      const txnId = `TXN_${Date.now()}_${appointmentId}`;
      
      // Calculate expiry time (30 minutes from now)
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 30);
      const ppExpiry = expiryTime.toISOString().replace(/[-:T]/g, '').slice(0, 14);
      
      // Prepare data for hash calculation
      const hashString = `${this.merchantId}&${txnId}&${amount}&PKR&${description}&${this.returnUrl}&${this.password}`;
      const secureHash = crypto.createHash('sha256').update(hashString).digest('hex');

      const payload = {
        pp_Version: '1.1',
        pp_TxnType: 'MWALLET',
        pp_Language: 'EN',
        pp_MerchantID: this.merchantId,
        pp_SubMerchantID: '',
        pp_Password: this.password,
        pp_BankID: 'TBANK',
        pp_ProductID: 'RETL',
        pp_TxnRefNo: txnId,
        pp_Amount: amount * 100, // Convert to lowest currency unit (paisa)
        pp_TxnCurrency: 'PKR',
        pp_TxnDateTime: new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14),
        pp_BillReference: appointmentId,
        pp_Description: description,
        pp_TxnExpiryDateTime: ppExpiry,
        pp_SecureHash: secureHash,
        pp_ReturnURL: this.returnUrl,
        ppmpf_1: customerEmail,
        ppmpf_2: customerPhone,
      };

      // Save transaction reference
      payment.transactionId = txnId;
      await payment.save();

      // JazzCash API endpoint (test/production)
      const apiUrl = this.isTestMode
        ? 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform'
        : 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform';

      return {
        redirectUrl: apiUrl,
        formData: payload
      };
    } catch (error) {
      console.error('JazzCash payment creation error:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  async verifyPayment(paymentResponse) {
    try {
      const {
        pp_ResponseCode,
        pp_ResponseMessage,
        pp_TxnRefNo,
        pp_Amount,
        pp_SecureHash,
        pp_BillReference
      } = paymentResponse;

      // Find the payment by transaction ID
      const payment = await Payment.findOne({ transactionId: pp_TxnRefNo });
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Verify secure hash to ensure response integrity
      // Implementation depends on JazzCash documentation

      const success = pp_ResponseCode === '000';
      
      // Update payment status
      payment.status = success ? 'completed' : 'failed';
      payment.lastResponseCode = pp_ResponseCode;
      payment.lastResponseMessage = pp_ResponseMessage;
      await payment.save();

      if (success) {
        // Update appointment status
        const appointment = await Appointment.findById(payment.appointment);
        if (appointment) {
          appointment.status = 'confirmed';
          appointment.paymentStatus = 'paid';
          await appointment.save();

          // Send notifications
          await NotificationService.createNotification({
            recipient: payment.patient,
            type: 'PAYMENT_CONFIRMED',
            title: 'Payment Confirmed',
            message: `Your payment of PKR ${payment.amount} has been confirmed`,
            relatedTo: {
              model: 'Payment',
              id: payment._id
            }
          });

          await NotificationService.createNotification({
            recipient: payment.doctor,
            type: 'PAYMENT_RECEIVED',
            title: 'Payment Received',
            message: `You have received a payment of PKR ${payment.amount} for an appointment`,
            relatedTo: {
              model: 'Payment',
              id: payment._id
            }
          });
        }
      }

      return {
        success,
        message: pp_ResponseMessage,
        transactionId: pp_TxnRefNo,
        amount: pp_Amount / 100, // Convert from paisa to PKR
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  async getPaymentDetails(paymentId, userId) {
    try {
      const payment = await Payment.findOne({
        _id: paymentId,
        $or: [{ patient: userId }, { doctor: userId }]
      })
        .populate('appointment')
        .populate('patient', 'name email')
        .populate('doctor', 'name email');

      if (!payment) {
        throw new Error('Payment not found');
      }

      return payment;
    } catch (error) {
      console.error('Get payment details error:', error);
      throw error;
    }
  }

  async getUserPayments(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status
      } = options;

      const skip = (page - 1) * limit;

      const query = {
        $or: [{ patient: userId }, { doctor: userId }]
      };

      if (status) {
        query.status = status;
      }

      const [payments, total] = await Promise.all([
        Payment.find(query)
          .populate('appointment')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Payment.countDocuments(query)
      ]);

      return {
        payments,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Get user payments error:', error);
      throw error;
    }
  }
}

const paymentService = new PaymentService();
export default paymentService; 