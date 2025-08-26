const generateEmailTemplate = (verificationCode) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Soundest OTP Verification</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #ffffff ;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #1c1c1c;
        }

        .container {
          max-width: 560px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        .header {
          padding: 24px;
          background-color: #000000;
          text-align: center;
        }

        .logo {
          width: 80px;
          height: auto;
        }

        .body {
          padding: 32px 24px;
        }

        .title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .text {
          font-size: 15px;
          line-height: 1.6;
          color: #555;
        }

        .otp-box {
          display: inline-block;
          margin: 24px 0;
          padding: 16px 28px;
          font-size: 28px;
          letter-spacing: 6px;
          background-color: #f0f0f0;
          border-radius: 10px;
          font-weight: bold;
          color: #000000;
        }

        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #999999;
          background-color: #fafafa;
        }

        @media only screen and (max-width: 600px) {
          .body {
            padding: 24px 16px;
          }

          .otp-box {
            font-size: 22px;
            padding: 12px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img 
            src="https://i.pinimg.com/736x/af/be/11/afbe11d53109bfdd3f13b21b8d9fa8b1.jpg" 
            alt="Soundest Logo" 
            class="logo" />
        </div>

        <div class="body">
          <div class="title">Your Soundest Verification Code</div>
          <p class="text">Hello,<br><br>
          Use the code below to verify your email address for Soundest. This helps us secure your account and personalize your experience.
          </p>

          <div class="otp-box">${verificationCode}</div>


  
          <a href="http://localhost:5173/Emailotp">
           <button
    style="
      background-color: #4CAF50;
      color: white;
      padding: 12px 25px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease;
    "
    onmouseover="this.style.backgroundColor='#45a049'"
    onmouseout="this.style.backgroundColor='#4CAF50'"
  >
    click to Verify Your Email
  </button>
</a>


          <p class="text">
            This code is valid for the next <strong>1 minute</strong>. If you did not request this, you can safely ignore it.
          </p>

          <p class="text">— The Soundest Team</p>
        
        </div>

        <div class="footer">
          &copy; 2025 Soundest, Inc. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};

module.exports = generateEmailTemplate;
