const express = require('express');
const router = express.Router();
const marathonController = require('../controllers/marathonController');
const Invitation = require('../models/invitation');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendInviteEmail(email, code, club_id) {
  const signupUrl = `${process.env.FRONTEND_URL}/signup?code=${code}&club=${club_id}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Join Your Running Club!',
    text: `Hello,\n\nYou’ve been invited to join your running club! Use this link to sign up: ${signupUrl}\n\nYour invitation code is: ${code}\n\nHappy running!`,
    html: `<p>Hello,</p><p>You’ve been invited to join your running club! Click <a href="${signupUrl}">here</a> to sign up.</p><p>Your invitation code is: <strong>${code}</strong></p><p>Happy running!</p>`
  };
  await transporter.sendMail(mailOptions);
}

router.post('/marathon', auth, admin, marathonController.createMarathon);
router.patch('/marathon/:id', auth, admin, marathonController.updateMarathon);

router.post('/invitations', auth, admin, async (req, res) => {
  const { code, email } = req.body;
  if (!code || !email) return res.status(400).json({ error: 'Code and email are required' });
  try {
    const codeExists = await Invitation.exists(code);
    if (codeExists) return res.status(409).json({ error: `Invitation code '${code}' is already in use` });
    const hasUnused = await Invitation.hasUnusedByEmail(email, req.user.club_id);
    if (hasUnused) return res.status(409).json({ error: `An unused invitation already exists for '${email}'` });
    const invitation = await Invitation.create({ code, email, club_id: req.user.club_id });
    res.status(201).json(invitation);
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'invitations_code_key') {
      return res.status(409).json({ error: `Invitation code '${code}' is already in use` });
    }
    console.error('Error creating invitation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/invite-members', auth, admin, async (req, res) => {
  const { emails } = req.body; // Array of emails
  const club_id = req.user.club_id; // Assume admin's club_id is in JWT

  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'Emails must be a non-empty array' });
  }

  if (emails.length > 100) { // Arbitrary limit for performance
    return res.status(400).json({ error: 'Too many emails (max 100 at a time)' });
  }

  try {
    const invitations = [];
    const skipped = [];

    for (const email of emails) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        skipped.push({ email, reason: 'Invalid email format' });
        continue;
      }

      const hasUnused = await Invitation.hasUnusedByEmail(email, club_id);
      if (hasUnused) {
        skipped.push({ email, reason: 'Already has an unused invitation' });
        continue;
      }

      let code;
      let codeExists;
      do {
        code = uuidv4().slice(0, 8).toUpperCase();
        codeExists = await Invitation.exists(code);
      } while (codeExists);

      invitations.push({ code, email, club_id });
    }

    if (invitations.length === 0) {
      return res.status(400).json({ error: 'No valid emails to invite', skipped });
    }

    const createdInvitations = await Invitation.bulkCreate(invitations);

    // Send emails asynchronously
    // const emailPromises = createdInvitations.map(inv => sendInviteEmail(inv.email, inv.code, club_id));
    // await Promise.all(emailPromises);

    res.status(201).json({
      message: 'Invitations created and emails sent',
      invited: createdInvitations.map(inv => ({ email: inv.email, code: inv.code })),
      skipped
    });
  } catch (error) {
    console.error('Error inviting members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;