const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
require('dotenv').config();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/html/home.html');
});

app.get('/mypage', (req, res) => {
  res.sendFile(__dirname + '/static/html/mypage.html');
});

app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/static/html/signin.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/static/html/signup.html');
});

app.get('/arTracking', (req, res) => {
  res.sendFile(__dirname + '/static/html/arTracking.html');
});

const users = {};

app.get('/login', (req, res) => {
  const { email, pwd } = req.query;
  if (Object.keys(users).indexOf(email)!=-1 && users[email] == pwd) {
    return res.send({success: true})
  } else {
    return res.send({success: false})

  }
});

app.get('/register', (req, res) => {
  const { token } = req.query;
  if (Object.keys(pending).indexOf(token)!=-1) {
    email = pending[token][0];
    pwd = pending[token][1];
    users[email] = pwd;
  }
});

const pending = {};
app.get('/email', (req, res) => {
  const { email, pwd } = req.query;
  const token = Math.floor(Math.random()*99999);
  pending[token] = [email, pwd];
  // 인증 메일 발송
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_AUTH_ADDRESS,
      pass: process.env.EMAIL_APP_PASSWORD,
    }
  });

  const mailOptions = {
    from: '유스탬프 '+process.env.EMAIL_AUTH_ADDRESS, // 발신자 이메일
    to: email, // 수신자 이메일
    subject: '이메일 인증',
    html: `안녕하세요!<br><br>아래 링크를 누르시면 회원가입 창에서 입력했던 정보로 계정이 생성됩니다.<br><br><a href="${req.protocol}://${req.get('host')}/register?token=${token}" target="_blank" rel="noopener noreferrer">${req.protocol}://${req.get('host')}/register?token=${token}</a>`
  };
  
  // 이메일 보내기
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending failed:', error);
      res.status(500).json({ success: false, msg: 'Failed to send email' });
    } else {
      console.log(`Email successfully sent to ${email}. SMTP response: ${info.response}`);
      startTokenExpirationInterval();
      res.json({ success: true, msg: 'Email sent successfully' });
    }
  });
});



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});