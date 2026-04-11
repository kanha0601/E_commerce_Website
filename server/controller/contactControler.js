const Contact = require("../model/Contact");
const nodemailer = require("nodemailer");

const AddContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    return res.json({
      message: "contact created successfully",
      contact: contact,
      status: true,
    });
  } catch (err) {
    return res.json({
      message: "Error while create contact",
      status: false,
    });
  }
};

const GetContact = async (req, res) => {
  try {
    const dfghj = await Contact.find();
    return res.json({
      message: "lets get contacts",
      contact: dfghj,
      status: true,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      message: "error while fetch",
      status: false,
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body);
    return res.json({
      message: "lets update",
      status: true,
      updatedContact,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      message: "error while update",
      status: false,
    });
  }
};

const DeleteContact = async (req, res) => {
  try {
    const DeleteContact = await Contact.findByIdAndDelete(req.params.id);
    return res.json({
      message: "delte successfully",
      status: true,
      DeleteContact,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      message: "error while update",
      status: false,
    });
  }
};

const ReplyContact = async (req, res) => {
  try {
    const { email, name, replyMessage } = req.body;

    if (!email || !replyMessage) {
      return res.json({ status: false, message: "Email and message are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admin Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Reply to your message`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 32px; border-radius: 8px;">
          <div style="background: #03060f; padding: 24px; border-radius: 6px; margin-bottom: 24px;">
            <h1 style="color: #388bfd; font-size: 20px; margin: 0;">Support Reply</h1>
          </div>
          <p style="color: #333; font-size: 15px; line-height: 1.7;">Hello <strong>${name}</strong>,</p>
          <p style="color: #555; font-size: 15px; line-height: 1.8;">${replyMessage}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0;" />
          <p style="color: #999; font-size: 12px;">This is a reply to your contact form submission. Please do not reply to this email directly.</p>
        </div>
      `,
    });

    return res.json({ status: true, message: "Reply sent successfully" });
  } catch (err) {
    console.log("REPLY ERROR:", err);
    return res.json({ status: false, message: "Failed to send reply: " + err.message });
  }
};

module.exports = {
  AddContact,
  GetContact,
  updateContact,
  DeleteContact,
  ReplyContact,
};