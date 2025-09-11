import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendForgotPasswordEmail(email: string, otp: string) {
  const mailOptions = {
    from: "forgot-password <forgot-password@avenping.com>",
    to: email,
    subject: "[No Reply] Password Reset OTP - AvenPing",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">AvenPing</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="color: #666; line-height: 1.6;">
          You have requested to reset your password. Please use the following OTP to proceed:
        </p>
        <div style="background: #fff; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center;">
          <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666; line-height: 1.6;">
          This OTP will expire in 5 minutes for security reasons.
        </p>
        <p style="color: #666; line-height: 1.6;">
          If you didn't request this password reset, please ignore this email.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    </div>
  `,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

export async function sendSignupEmail(
  email: string,
  name: string,
  industry: string,
  size: string
) {
  const mailOptions = {
    from: "sign-in <sign-in@avenping.com>",
    to: email,
    subject: "🎉 Welcome to AvenPing! Your WhatsApp Automation Journey Begins",
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header with Gradient -->
      <div style="background: linear-gradient(135deg, #43A2C9 0%, #667eea 50%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 32px; color: white;">🚀</span>
        </div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Welcome to AvenPing!</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Your WhatsApp automation platform</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #2d3748; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
          <p style="color: #4a5568; line-height: 1.7; font-size: 16px; margin: 0;">
            Thank you for joining AvenPing! We're excited to have you on board and can't wait to help you transform your WhatsApp communication with powerful automation tools.
          </p>
        </div>

        <!-- Welcome Features -->
        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #43A2C9;">
          <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600;">🎯 What's Next?</h3>
          <ul style="color: #4a5568; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>Complete Your Setup:</strong> Connect your WhatsApp account and configure your preferences</li>
            <li style="margin-bottom: 8px;"><strong>Choose Your Plan:</strong> Select the perfect plan for your business needs</li>
            <li style="margin-bottom: 8px;"><strong>Explore Add-ons:</strong> Enhance your experience with powerful features</li>
            <li style="margin-bottom: 0;"><strong>Start Automating:</strong> Create flows, campaigns, and templates</li>
          </ul>
        </div>

        <!-- Industry Specific Welcome -->
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="color: #6c757d; margin: 0; font-size: 14px;">
            <strong>Industry:</strong> ${industry} | <strong>Business Size:</strong> ${size}
          </p>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="https://app.avenping.com/login" 
             style="display: inline-block; background: linear-gradient(135deg, #43A2C9 0%, #667eea 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(67, 162, 201, 0.3); transition: all 0.3s ease;">
            🚀 Get Started Now
          </a>
        </div>

        <!-- Support Section -->
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h4 style="color: #2d3748; margin: 0 0 10px; font-size: 16px; font-weight: 600;">💬 Need Help?</h4>
          <p style="color: #6c757d; margin: 0; font-size: 14px; line-height: 1.6;">
            Our support team is here to help you get started. Reach out anytime!
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #2d3748; padding: 25px; text-align: center; border-radius: 0 0 12px 12px;">
        <div style="margin-bottom: 15px;">
          <span style="color: #a0aec0; font-size: 14px;">© 2024 AvenPing. All rights reserved.</span>
        </div>
        <div style="margin-bottom: 15px;">
          <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
          <span style="color: #a0aec0; font-size: 12px;">•</span>
          <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
        </div>
        <div style="color: #718096; font-size: 11px; line-height: 1.5;">
          <p style="margin: 0;">This is an automated welcome email. Please do not reply to this message.</p>
          <p style="margin: 5px 0 0;">If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  `,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

export async function sendPaymentSuccessEmail(email: string, name: string, plan: string, amount: number, period: string) {
  const mailOptions = {
    from: "sign-in <sign-in@avenping.com>",
    to: email,
    subject: "🎉 Payment Successful! Welcome to AvenPing ${plan} Plan",
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header with Gradient -->
      <div style="background: linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 32px; color: white;">✅</span>
        </div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Payment Successful!</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Your ${plan} plan is now active</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #2d3748; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Hello ${name}! 🎉</h2>
          <p style="color: #4a5568; line-height: 1.7; font-size: 16px; margin: 0;">
            Thank you for your payment! Your ${plan} plan has been successfully activated and you now have access to all premium features.
          </p>
        </div>

        <!-- Payment Details -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #10B981;">
          <h3 style="color: #2d3748; margin: 0 0 20px; font-size: 18px; font-weight: 600;">💰 Payment Details</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #4a5568; font-weight: 500;">Plan:</span>
            <span style="color: #2d3748; font-weight: 600;">${plan}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #4a5568; font-weight: 500;">Billing Period:</span>
            <span style="color: #2d3748; font-weight: 600;">${period}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #4a5568; font-weight: 500;">Amount Paid:</span>
            <span style="color: #10B981; font-weight: 600; font-size: 18px;">$${amount.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #4a5568; font-weight: 500;">Status:</span>
            <span style="color: #10B981; font-weight: 600; background: #dcfce7; padding: 4px 12px; border-radius: 20px; font-size: 14px;">✅ Paid</span>
          </div>
        </div>

        <!-- What's Next -->
        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #667eea;">
          <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600;">🚀 What's Next?</h3>
          <ul style="color: #4a5568; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>Access Your Dashboard:</strong> Log in to start using your new features</li>
            <li style="margin-bottom: 8px;"><strong>Explore Premium Features:</strong> Unlock advanced automation tools</li>
            <li style="margin-bottom: 8px;"><strong>Create Flows:</strong> Set up automated WhatsApp workflows</li>
            <li style="margin-bottom: 0;"><strong>Manage Contacts:</strong> Import and organize your contact lists</li>
          </ul>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="https://app.avenping.com/dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
            🚀 Access Your Dashboard
          </a>
        </div>

        <!-- Support Section -->
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h4 style="color: #2d3748; margin: 0 0 10px; font-size: 16px; font-weight: 600;">💬 Need Help?</h4>
          <p style="color: #6c757d; margin: 0; font-size: 14px; line-height: 1.6;">
            Our support team is here to help you make the most of your new plan. Reach out anytime!
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #2d3748; padding: 25px; text-align: center; border-radius: 0 0 12px 12px;">
        <div style="margin-bottom: 15px;">
          <span style="color: #a0aec0; font-size: 14px;">© 2024 AvenPing. All rights reserved.</span>
        </div>
        <div style="margin-bottom: 15px;">
          <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
          <span style="color: #a0aec0; font-size: 12px;">•</span>
          <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
        </div>
        <div style="color: #718096; font-size: 11px; line-height: 1.5;">
          <p style="margin: 0;">This is an automated payment confirmation email. Please do not reply to this message.</p>
          <p style="margin: 5px 0 0;">If you have any questions about your payment, please contact our support team.</p>
        </div>
      </div>
    </div>
  `,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

export async function sendSignupCompleteEmail(email: string, name: string) {
  const mailOptions = {
    from: "sign-in <sign-in@avenping.com>",
    to: email,
    subject: "🎉 Signup Complete! Welcome to AvenPing",
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header with Gradient -->
      <div style="background: linear-gradient(135deg, #43A2C9 0%, #667eea 50%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 32px; color: white;">✅</span>
        </div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Signup Complete!</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Your AvenPing account is ready</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #2d3748; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Hello ${name}! 🎉</h2>
          <p style="color: #4a5568; line-height: 1.7; font-size: 16px; margin: 0;">
            Congratulations! Your AvenPing account has been successfully created. You're now ready to revolutionize your WhatsApp communication with powerful automation tools.
          </p>
        </div>

        <!-- Success Features -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #10B981;">
          <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600;">🚀 Your Account is Ready!</h3>
          <ul style="color: #4a5568; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>✅ Account Created:</strong> Your profile is set up and ready to use</li>
            <li style="margin-bottom: 8px;"><strong>✅ Dashboard Access:</strong> Log in to explore your new workspace</li>
            <li style="margin-bottom: 8px;"><strong>✅ Free Features:</strong> Start with our free tier and upgrade anytime</li>
            <li style="margin-bottom: 0;"><strong>✅ 24/7 Support:</strong> Our team is here to help you succeed</li>
          </ul>
        </div>

        <!-- Next Steps -->
        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #43A2C9;">
          <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600;">🎯 What's Next?</h3>
          <ul style="color: #4a5568; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>Connect WhatsApp:</strong> Link your WhatsApp Business account</li>
            <li style="margin-bottom: 8px;"><strong>Explore Templates:</strong> Browse our pre-built message templates</li>
            <li style="margin-bottom: 8px;"><strong>Create Your First Flow:</strong> Set up automated workflows</li>
            <li style="margin-bottom: 0;"><strong>Import Contacts:</strong> Add your customer database</li>
          </ul>
        </div>

        <!-- Quick Start Guide -->
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h4 style="color: #2d3748; margin: 0 0 10px; font-size: 16px; font-weight: 600;">📚 Quick Start Guide</h4>
          <p style="color: #6c757d; margin: 0; font-size: 14px; line-height: 1.6;">
            New to WhatsApp automation? Check out our comprehensive guides and tutorials to get started quickly.
          </p>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="https://app.avenping.com/dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #43A2C9 0%, #667eea 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(67, 162, 201, 0.3); transition: all 0.3s ease;">
            🚀 Access Your Dashboard
          </a>
        </div>

        <!-- Support Section -->
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h4 style="color: #2d3748; margin: 0 0 10px; font-size: 16px; font-weight: 600;">💬 Need Help Getting Started?</h4>
          <p style="color: #6c757d; margin: 0; font-size: 14px; line-height: 1.6;">
            Our support team is here to help you make the most of your new AvenPing account. Reach out anytime!
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #2d3748; padding: 25px; text-align: center; border-radius: 0 0 12px 12px;">
        <div style="margin-bottom: 15px;">
          <span style="color: #a0aec0; font-size: 14px;">© 2024 AvenPing. All rights reserved.</span>
        </div>
        <div style="margin-bottom: 15px;">
          <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
          <span style="color: #a0aec0; font-size: 12px;">•</span>
          <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
        </div>
        <div style="color: #718096; font-size: 11px; line-height: 1.5;">
          <p style="margin: 0;">This is an automated signup confirmation email. Please do not reply to this message.</p>
          <p style="margin: 5px 0 0;">If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  `,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}