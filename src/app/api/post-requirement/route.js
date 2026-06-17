import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const product =
      formData.get("product");

    const image =
      formData.get("image");

        const requirement = formData.get("requirement");

    let attachments = [];

    if (image) {
      const bytes =
        await image.arrayBuffer();

      const buffer =
        Buffer.from(bytes);

      attachments.push({
        filename: image.name,
        content: buffer,
      });
    }

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
await transporter.verify();
console.log("Gmail SMTP Connected");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "inquiry.promozione@gmail.com",
      subject: "New RFQ Requirement",

      html: `
        <h2>New Requirement</h2>

        <p>
          <strong>Product:</strong>
          ${product}
        </p>

          <p>
          <strong>Product:</strong>
         <p>${requirement || "Not Provided"}</p>
        </p>
      `,

      attachments,
    });

    return Response.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    return Response.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}