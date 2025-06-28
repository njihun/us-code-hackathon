const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
require('dotenv').config();
const db = require('./module/db');

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

app.get('/login', async (req, res) => {
  const { email, pwd } = req.query;
  const users = await db.getData();
  if (users.docs.some((user) => user.data().email == email)) {
    const userDoc = users.docs.find(user => user.data().email === email);
    if (userDoc.data().pwd == pwd) {
      res.send({success: true});
    } else {
      return res.send({success: false, msg: "비밀번호가 일치하지 않습니다."});
    }
  } else {
    return res.send({success: false, msg: "해당 이메일로 생성된 계정이 존재하지 않습니다."});
  }
});

app.get('/register', async (req, res) => {
  const { token } = req.query;
  const users = await db.getData();
  if (Object.keys(pending).indexOf(token)!=-1) {
    email = pending[token][0];
    pwd = pending[token][1];
    name = pending[token][2];
    if (users.docs.some((user) => user.data().email == email)) {
      return res.send("이미 해당 이메일로 생성된 계정이 존재합니다.");
    }
    db.setData('users', {
      email: email,
      pwd: pwd,
      name: name,
      score: 0
    }).then(()=>res.send("계정이 생성되었습니다."));
  }
});

const pending = {};
app.get('/email', (req, res) => {
  const { email, pwd, name } = req.query;
  const token = Math.floor(Math.random()*99999);
  pending[token] = [email, pwd, name];
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
  console.log(token);
  
  
  // 이메일 보내기
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending failed:', error);
      return res.status(500).send({ success: false, msg: 'Failed to send email' });
    } else {
      console.log(`Email successfully sent to ${email}. SMTP response: ${info.response}`);
      return res.send({ success: true, msg: 'Email sent successfully' });
    }
  });
});



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});