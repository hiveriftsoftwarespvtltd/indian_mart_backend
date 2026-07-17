import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enquiry } from './schemas/enquiry.schema';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EnquiriesService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<Enquiry>,
    private configService: ConfigService,
  ) {
    this.initMailTransporter();
  }

  private initMailTransporter() {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT') || 587;
    const secure = this.configService.get<string>('EMAIL_SECURE') === 'true';
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
      console.log('[EnquiriesService] Mail transporter initialized successfully.');
    } else {
      console.log('[EnquiriesService] Mail credentials not fully set. Email notifications disabled.');
    }
  }

  async create(createDto: any): Promise<Enquiry> {
    const created = new this.enquiryModel(createDto);
    const saved = await created.save();

    // Email notification disabled per user request (WhatsApp handling is done on frontend)
    /*
    this.sendNotificationEmail(saved).catch((err) => {
      console.error('[EnquiriesService] Background notification email failed:', err);
    });
    */

    return saved;
  }

  async findAll(): Promise<Enquiry[]> {
    return this.enquiryModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateStatus(id: string, status: string): Promise<Enquiry> {
    const updated = await this.enquiryModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Enquiry not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.enquiryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Enquiry not found');
    }
  }

  private async sendNotificationEmail(enquiry: Enquiry) {
    if (!this.transporter) return;

    const receiverEmail = this.configService.get<string>('CONTACT_RECEIVER_EMAIL') || 'samunder2611@gmail.com';
    const mailFrom = this.configService.get<string>('MAIL_FROM') || 'samunder2611@gmail.com';

    const mailOptions = {
      from: mailFrom,
      to: receiverEmail,
      subject: `New Lead: ${enquiry.subject}`,
      html: `
        <h3>New Enquiry Received</h3>
        <p><strong>Name:</strong> ${enquiry.name}</p>
        <p><strong>Phone:</strong> ${enquiry.phone}</p>
        <p><strong>Email:</strong> ${enquiry.email || 'N/A'}</p>
        <p><strong>Subject:</strong> ${enquiry.subject}</p>
        <p><strong>Message:</strong> ${enquiry.message || 'No additional message.'}</p>
        <p><strong>Date:</strong> ${enquiry.date}</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`[EnquiriesService] Notification email sent to: ${receiverEmail}`);
  }
}
