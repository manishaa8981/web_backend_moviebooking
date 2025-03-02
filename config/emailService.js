const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

const sendRegistrationEmail = async (to, username) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Welcome to Our Platform!",
      html: `
        <h2>Welcome, ${username}!</h2>
        <p>Thank you for registering with us. We are excited to have you on board.</p>
        <p>If you have any questions, feel free to reach out.</p>
        <br>
        <p>Best Regards,<br>Team</p>
      `,
    });

    console.log("Registration email sent successfully!");
  } catch (error) {
    console.error("Error sending registration email:", error);
  }
};

const sendResetPasswordEmail = async (to, resetToken) => {
  try {
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("here", resetURL);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}" target="_blank">${resetURL}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    console.log("Reset password email sent successfully!");
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};

const sendBookingConfirmationEmail = async (email, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎟 Booking Confirmation",
      html: `
        <h2>🎉 Booking Confirmed!</h2>
        <p><strong>Movie:</strong> ${bookingDetails.movie}</p>
        <p><strong>Hall:</strong> ${bookingDetails.hall}</p>
        <p><strong>Showtime:</strong> ${bookingDetails.start_time} - ${
        bookingDetails.end_time
      }</p>
        <p><strong>Seats:</strong> ${bookingDetails.seats.join(", ")}</p>
        <p><strong>Total Price:</strong> ₹${bookingDetails.total_price}</p>
        <p><strong>Payment Status:</strong> ${bookingDetails.payment_status}</p>
        <br/>
        <p>Thank you for booking with us! Enjoy your movie! 🍿</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(" Booking confirmation email sent to:", email);
  } catch (error) {
    console.error("Error sending booking email:", error);
  }
};

module.exports = {
  sendRegistrationEmail,
  sendResetPasswordEmail,
  sendBookingConfirmationEmail,
};
