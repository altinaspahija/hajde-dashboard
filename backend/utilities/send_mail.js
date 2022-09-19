var nodemailer = require('nodemailer');


async function sendResetPassword(email, name, link)
{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASS
        },
      });
      
    let mailOptions = null;

    mailOptions = {
      from: `Hajde <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Kërkesa për ta ndryshuar flajëkalimin në Hajde',
      html: `Dear ${name}, <br/><br/>
              Ju keni kërkuar ta ndryshoni fjalëkalimin në Hajde<br/><br/>
          
              Për ta ndryshuar fjalëkalmin kliko linkun poshtë: <br/><br/>
              ${link}
              <br/>
              Hajde`
    };
      
      await transporter.sendMail(mailOptions);
}

async function sendSuccessResetPass(email, name)
{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASS
        },
      });
      
    let mailOptions = null;

    mailOptions = {
      from: `Hajde <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Fjalëkalimi është ndryshuar me sukses në Hajde',
      html: `<p>Dear ${name}<br/><br/>
            You keni ndryshuar fjalëkalimin me sukses.
            <br/><br/>
            <br/>
            Hajde`
    };
      
      await transporter.sendMail(mailOptions);
}

async function sendVerificationCode(name, email, code)
{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: true,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASS
        },
      });
      
    let mailOptions = null;

    mailOptions = {
      from: `Hajde <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `Kodi verifikues për qasje në Dashboard: ${code}`,
      html: `Dear ${name}, <br/><br/>
              Ju keni kërkuar ta qaseni dashboard-it!<br/><br/>
          
              Për tu qasur dashboard-it perdorni kodin poshtë: <br/>
              <div style="padding: 1rem;">
                <h3>${code}</h3>
              </div>
              <br/><br/>
              Hajde`
    };
      
      await transporter.sendMail(mailOptions);
}

async function sendVerificationOTPCode(name, email, data_url, code)
{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: true,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASS
        },
      });
      
    let mailOptions = null;

    mailOptions = {
      from: `Hajde <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Kodi verifikues për qasje në Dashboard',
      html: `Dear ${name}, <br/><br/>
          Ju lutem skenoni kete QR-Code permes aplikacionit tuaj mobile.
          Ju duhet te perdorni nje OTP Authenticator. ( Google Authenticator, Microsoft Authenticator ) etj..

          <img src="${data_url}" alt="Mountain View" />
          <div class="col-lg-2 col-sm-3 col-xs-6"> OTP : ${code} </div>

              Hajde`
    };
      
      await transporter.sendMail(mailOptions);
}

module.exports = {sendResetPassword, sendSuccessResetPass, sendVerificationCode};
