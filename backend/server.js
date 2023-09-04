const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userSecrets = {};

app.post('/register', (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send('Email is required.');
  }

  const secret = speakeasy.generateSecret({ length: 20 });
  const userSecretKey = secret.base32;

  userSecrets[email] = userSecretKey;

  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error generating QR code');
    } else {
      res.send({ userSecretKey, email, data_url });
    }
  });
});

app.post('/verify', (req, res) => {
  const email = req.body.email;
  const userEnteredCode = req.body.code;

  if (!email || !userEnteredCode) {
    return res.status(400).send('Email and code are required.');
  }

  const userSecretKey = userSecrets[email];

  if (!userSecretKey) {
    return res.status(404).send('User not found');
  }

  const verified = speakeasy.totp.verify({
    secret: userSecretKey,
    encoding: 'base32',
    token: userEnteredCode,
    window: 1,
  });

  if (verified) {
    res.send('Authentication successful');
  } else {
    res.status(401).send('Authentication failed');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
