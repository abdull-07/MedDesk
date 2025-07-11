const PaymentService = require('../services/payment.service');
const AppointmentService = require('../services/appointment.service');
const NotificationService = require('../services/notification.service');

exports.createJazzCashPayment = async (req, res) => {
  try {
    const { appointmentId, amount, customerEmail, customerPhone, description } = req.body;

    if (!appointmentId || !amount || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment information'
      });
    }

    const paymentData = {
      appointmentId,
      amount,
      customerEmail,
      customerPhone,
      description: description || `Payment for appointment ${appointmentId}`
    };

    const paymentResponse = await PaymentService.createJazzCashPayment(paymentData);

    res.status(200).json({
      success: true,
      redirectUrl: paymentResponse.redirectUrl,
      formData: paymentResponse.formData
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment'
    });
  }
};

exports.handlePaymentCallback = async (req, res) => {
  try {
    const paymentResponse = req.body;
    const verificationResult = await PaymentService.verifyPayment(paymentResponse);

    if (verificationResult.success) {
      // Update appointment payment status
      const appointmentId = paymentResponse.pp_BillReference;
      await AppointmentService.updatePaymentStatus(appointmentId, 'paid');

      // Send notifications
      await NotificationService.sendPaymentConfirmation({
        appointmentId,
        transactionId: verificationResult.transactionId,
        amount: verificationResult.amount
      });

      // Redirect to success page
      res.redirect('/payment/success');
    } else {
      // Redirect to failure page
      res.redirect(`/payment/failure?message=${encodeURIComponent(verificationResult.message)}`);
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    res.redirect('/payment/failure?message=Payment verification failed');
  }
}; 