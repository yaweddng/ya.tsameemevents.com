import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import dns from "dns";
import webpush from "web-push";
import cors from "cors";
import db from "./src/db.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:info@tsameemevents.com',
    process.env.VAPID_PUBLIC_KEY || 'BAmbzv49ncwG3KaUwfeEmHRL0iRyBNR9Rq-0ckgs98qCp_-OsesHTgWzFmAOImUFVDuxQHFdWHTUNUD2wbeGP6g',
    process.env.VAPID_PRIVATE_KEY || 'w5gfsBXvZ60xD74Gj7aKIfE_aNIaGYRiFf7PuoMZ3Gg'
  );

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  });

  const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("Email credentials not configured. Skipping email send.");
        return false;
      }
      await transporter.sendMail({
        from: `"YA Wedding" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html
      });
      return true;
    } catch (error) {
      console.error("Email send error:", error);
      return false;
    }
  };

  // Background task for unread message notifications (every 5 minutes)
  setInterval(async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    // Find unread messages older than 10 minutes that haven't had a notification sent
    const unreadMessages = db.prepare(`
      SELECT m.*, u.email as receiver_email, u.name as receiver_name, s.name as sender_name
      FROM messages m
      JOIN users u ON m.receiver_id = u.id
      JOIN users s ON m.sender_id = s.id
      WHERE m.is_read = 0 
        AND m.notification_sent = 0 
        AND m.created_at < ?
    `).all(tenMinutesAgo) as any[];

    for (const msg of unreadMessages) {
      const subject = `New message from ${msg.sender_name}`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00C896;">You have a new message!</h2>
          <p>Hi ${msg.receiver_name},</p>
          <p>You have an unread message from <strong>${msg.sender_name}</strong>:</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; font-style: italic;">
            "${msg.content}"
          </div>
          <p>Please log in to your dashboard to reply.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">YA Wedding Platform</p>
        </div>
      `;
      
      const sent = await sendEmail(msg.receiver_email, subject, `You have a new message from ${msg.sender_name}: "${msg.content}"`, html);
      if (sent) {
        db.prepare("UPDATE messages SET notification_sent = 1 WHERE id = ?").run(msg.id);
      }
    }

    // Also check for messages to admin
    const adminUnreadMessages = db.prepare(`
      SELECT m.*, s.name as sender_name
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      WHERE m.receiver_id = 'admin' 
        AND m.is_read = 0 
        AND m.notification_sent = 0 
        AND m.created_at < ?
    `).all(tenMinutesAgo) as any[];

    for (const msg of adminUnreadMessages) {
      const subject = `Admin: New message from ${msg.sender_name}`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00C896;">New Message for Admin</h2>
          <p>A user <strong>${msg.sender_name}</strong> sent a message:</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; font-style: italic;">
            "${msg.content}"
          </div>
          <p>Please log in to the admin portal to reply.</p>
        </div>
      `;
      
      const sent = await sendEmail('info@tsameemevents.com', subject, `New message from ${msg.sender_name}: "${msg.content}"`, html);
      if (sent) {
        db.prepare("UPDATE messages SET notification_sent = 1 WHERE id = ?").run(msg.id);
      }
    }
  }, 5 * 60 * 1000); // Check every 5 minutes

  // API Routes
  const SERVER_VERSION = Date.now().toString();
  app.get("/api/version", (req, res) => {
    res.json({ version: SERVER_VERSION });
  });

  const SERVICES_PATH = path.join(__dirname, "src/data/services.json");
  const BLOGS_PATH = path.join(__dirname, "src/data/blogs.json");
  const SETTINGS_PATH = path.join(__dirname, "src/data/settings.json");
  const RATINGS_PATH = path.join(__dirname, "src/data/ratings.json");
  const PACKAGE_STEPS_PATH = path.join(__dirname, "src/data/package_steps.json");
  const PROMOS_PATH = path.join(__dirname, "src/data/promos.json");
  const PAGES_PATH = path.join(__dirname, "src/data/pages.json");
  const MEDIA_PATH = path.join(__dirname, "src/data/media.json");
  const BOOKING_FORMS_PATH = path.join(__dirname, "src/data/booking_forms.json");
  const PACKAGES_DATA_PATH = path.join(__dirname, "src/data/packages.json");
  const PARTNERSHIPS_PATH = path.join(__dirname, "src/data/partnerships.json");
  const DEVELOPMENT_PATH = path.join(__dirname, "src/data/development.json");
  const WIDGET_PRO_PATH = path.join(__dirname, "src/data/widget_pro.json");
  const CONTAINERS_PATH = path.join(__dirname, "src/data/containers.json");
  const STANDARD_WIDGETS_PATH = path.join(__dirname, "src/data/standard_widgets.json");
  const EMAIL_TEMPLATES_PATH = path.join(__dirname, "src/data/email_templates.json");
  const PDF_TEMPLATES_PATH = path.join(__dirname, "src/data/pdf_templates.json");
  const THEME_BUILDER_PATH = path.join(__dirname, "src/data/theme_builder.json");
  const CUSTOM_POST_TYPES_PATH = path.join(__dirname, "src/data/custom_post_types.json");
  const USERS_PATH = path.join(__dirname, "src/data/users.json");
  const USER_SITES_PATH = path.join(__dirname, "src/data/user_sites.json");
  const ADMIN_SECURITY_PATH = path.join(__dirname, "src/data/admin_security.json");
  const BLOCKED_IPS_PATH = path.join(__dirname, "src/data/blocked_ips.json");
  const REDIRECTIONS_PATH = path.join(__dirname, "src/data/redirections.json");

  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("send_message", (data) => {
      try {
        const { senderId, receiverId, content } = data;
        
        // Save to DB
        const stmt = db.prepare("INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)");
        const result = stmt.run(senderId, receiverId, content);
        const messageId = result.lastInsertRowid;

        const newMessage = {
          id: messageId,
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          created_at: new Date().toISOString(),
          is_read: 0
        };

        // Emit to receiver
        io.to(receiverId).emit("new_message", newMessage);
        // Emit back to sender for confirmation
        io.to(senderId).emit("message_sent", newMessage);

        // Send push notification to receiver
        const subscriptions = db.prepare("SELECT subscription FROM push_subscriptions WHERE user_id = ?").all(receiverId) as any[];
        const sender = db.prepare("SELECT name FROM users WHERE id = ?").get(senderId) as any;

        subscriptions.forEach(sub => {
          try {
            const pushSubscription = JSON.parse(sub.subscription);
            webpush.sendNotification(pushSubscription, JSON.stringify({
              title: `New message from ${sender?.name || 'User'}`,
              body: content,
              url: '/inbox'
            })).catch(err => {
              if (err.statusCode === 404 || err.statusCode === 410) {
                // Subscription has expired or is no longer valid
                db.prepare("DELETE FROM push_subscriptions WHERE subscription = ?").run(sub.subscription);
              }
            });
          } catch (e) {
            console.error("Push notification error:", e);
          }
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // OTP and Messaging API Routes
  app.post("/api/push/subscribe", (req, res) => {
    const { subscription, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });
    
    try {
      // Check if subscription already exists for this user to avoid duplicates
      const subStr = JSON.stringify(subscription);
      const existing = db.prepare("SELECT id FROM push_subscriptions WHERE user_id = ? AND subscription = ?").get(userId, subStr);
      
      if (!existing) {
        db.prepare("INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)").run(userId, subStr);
      }
      res.status(201).json({ success: true });
    } catch (e) {
      console.error("Subscription error:", e);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.post("/api/auth/send-otp", async (req, res) => {
    const { email: rawEmail } = req.body;
    const email = rawEmail?.toLowerCase().trim();
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

    try {
      db.prepare("INSERT OR REPLACE INTO otps (email, otp, expires_at, verified) VALUES (?, ?, ?, 0)").run(email, otp, expiresAt);

      const emailHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00C896; margin: 0; font-size: 28px; letter-spacing: -1px;">YA Wedding</h1>
            <p style="color: #666; margin-top: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Partner Verification</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <p style="margin-top: 0; color: #666; font-size: 16px;">Your verification code is:</p>
            <h2 style="font-size: 48px; margin: 10px 0; color: #1a1a1a; letter-spacing: 10px; font-family: monospace;">${otp}</h2>
            <p style="margin-bottom: 0; color: #999; font-size: 13px;">This code will expire in 10 minutes.</p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #444;">
            Please enter this code on the registration page to verify your email address and complete your account setup.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="font-size: 12px; color: #999; text-align: center; margin-bottom: 0;">
            If you did not request this code, please ignore this email.<br />
            &copy; ${new Date().getFullYear()} YA Wedding. All rights reserved.
          </p>
        </div>
      `;

      await sendEmail(email, `${otp} is your YA Wedding verification code`, `Your YA Wedding verification code is: ${otp}. It expires in 10 minutes.`, emailHtml);

      res.json({ success: true, message: "OTP sent successfully" });
    } catch (e) {
      console.error("OTP Error:", e);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  const getUserIdFromToken = (authHeader: string | undefined) => {
    if (!authHeader) return null;
    if (authHeader === "Bearer ya-admin-secret") return "admin";
    if (authHeader.startsWith("Bearer user-token-")) {
      const userId = authHeader.replace("Bearer user-token-", "");
      const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
      return user ? userId : null;
    }
    return null;
  };

  app.get("/api/messages/:userId", (req, res) => {
    const { userId } = req.params;
    const currentUserId = getUserIdFromToken(req.headers.authorization);
    if (!currentUserId) return res.status(401).json({ error: "Unauthorized" });

    // Users can only chat with admin, and admin can chat with anyone
    if (currentUserId !== 'admin' && userId !== 'admin') {
      return res.status(403).json({ error: "Forbidden" });
    }

    const messages = db.prepare(`
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `).all(currentUserId, userId, userId, currentUserId);

    res.json(messages);
  });

  app.get("/api/admin/conversations", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get unique users who have messaged admin
    const conversations = db.prepare(`
      SELECT DISTINCT u.id, u.name, u.email, 
             (SELECT content FROM messages WHERE (sender_id = u.id OR receiver_id = u.id) ORDER BY created_at DESC LIMIT 1) as last_message,
             (SELECT created_at FROM messages WHERE (sender_id = u.id OR receiver_id = u.id) ORDER BY created_at DESC LIMIT 1) as last_message_at
      FROM users u
      JOIN messages m ON (m.sender_id = u.id OR m.receiver_id = u.id)
      WHERE u.id != 'admin'
      ORDER BY last_message_at DESC
    `).all();

    res.json(conversations);
  });

  // Multi-tenant Middleware: Detect site by Host header
  app.use((req, res, next) => {
    const host = req.headers.host || "";
    const platformDomain = "platform.com"; // Replace with actual platform domain
    
    // Skip for API and static assets
    if (req.path.startsWith("/api") || req.path.includes(".")) {
      return next();
    }

    // If it's a custom domain (not platform domain and not localhost)
    if (host && !host.includes(platformDomain) && !host.includes("localhost") && !host.includes(".run.app")) {
      const sitesData = JSON.parse(fs.readFileSync(USER_SITES_PATH, "utf-8"));
      const site = sitesData.sites.find((s: any) => s.customDomain === host && s.dnsVerified);
      
      if (site) {
        // We can attach site info to request or handle it in frontend
        // For SPA, we usually serve index.html and let frontend handle it
        // But we might want to inject site info
      }
    }
    next();
  });

  // Blocked IP Middleware
  const ensureFile = (filePath: string, defaultData: any) => {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
  };

  ensureFile(USERS_PATH, { users: [] });
  ensureFile(USER_SITES_PATH, { sites: [] });
  ensureFile(ADMIN_SECURITY_PATH, {
    slug: "/admin-portal-access",
    securityQuestions: [
      { q: "Who is Owner", a: process.env.ADMIN_SEC_A1 || "Owner" },
      { q: "Who is Developer", a: process.env.ADMIN_SEC_A2 || "Developer" },
      { q: "What is Security Code", a: process.env.ADMIN_SEC_A3 || "12345" }
    ],
    allowedGeos: ["Sylhet, Bangladesh", "Dubai, UAE"],
    adminCredentials: {
      username: process.env.ADMIN_USERNAME || "admin@example.com",
      password: process.env.ADMIN_PASSWORD || "admin-password"
    }
  });
  ensureFile(BLOCKED_IPS_PATH, { blocked: [] });
  ensureFile(REDIRECTIONS_PATH, { redirections: [] });
  ensureFile(SERVICES_PATH, { services: [] });
  ensureFile(BLOGS_PATH, { blogs: [] });
  ensureFile(SETTINGS_PATH, {});
  ensureFile(RATINGS_PATH, { ratings: [] });
  ensureFile(PACKAGE_STEPS_PATH, []);
  ensureFile(PROMOS_PATH, { promos: [] });
  ensureFile(PAGES_PATH, { pages: [] });
  ensureFile(MEDIA_PATH, {});
  ensureFile(BOOKING_FORMS_PATH, { forms: [] });
  ensureFile(PACKAGES_DATA_PATH, { packages: [] });
  ensureFile(PARTNERSHIPS_PATH, { partnerships: [] });
  ensureFile(DEVELOPMENT_PATH, {});
  ensureFile(WIDGET_PRO_PATH, { items: [] });
  ensureFile(CONTAINERS_PATH, { containers: [] });
  ensureFile(STANDARD_WIDGETS_PATH, { widgets: [] });
  ensureFile(EMAIL_TEMPLATES_PATH, { templates: [] });
  ensureFile(PDF_TEMPLATES_PATH, { templates: [] });
  ensureFile(THEME_BUILDER_PATH, { templates: [] });
  ensureFile(CUSTOM_POST_TYPES_PATH, { postTypes: [] });

  // Redirections Middleware
  app.use((req, res, next) => {
    try {
      if (fs.existsSync(REDIRECTIONS_PATH)) {
        const data = JSON.parse(fs.readFileSync(REDIRECTIONS_PATH, "utf-8"));
        const redirections = data.redirections || [];
        const path = req.path;
        
        const redirection = redirections.find((r: any) => r.from === path && r.status === 'Active');
        
        if (redirection) {
          // Increment hit count
          redirection.hits = (redirection.hits || 0) + 1;
          fs.writeFileSync(REDIRECTIONS_PATH, JSON.stringify({ redirections }, null, 2));
          
          if (redirection.type === 'shortcode') {
            return res.redirect(redirection.to);
          } else {
            const statusCode = parseInt(redirection.type) || 301;
            return res.redirect(statusCode, redirection.to);
          }
        }
      }
    } catch (e) {
      console.error('Redirection error:', e);
    }
    next();
  });

  app.get("/api/theme-builder", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(THEME_BUILDER_PATH, "utf-8"));
      res.json(data.templates);
    } catch (e) {
      res.json([]);
    }
  });

  // Dynamic PWA Manifest
  app.get("/manifest.json", (req, res) => {
    const host = req.headers.host || "";
    const platformDomain = "platform.com";
    
    let manifest: any = {};
    try {
      const manifestPath = path.join(__dirname, "public/manifest.json");
      if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      } else {
        // Fallback if file doesn't exist
        manifest = {
          name: "YA Wedding | Luxury Wedding Planning",
          short_name: "YA Wedding",
          description: "Premium wedding planning and photography services.",
          start_url: "/",
          display: "standalone",
          background_color: "#0a0a0a",
          theme_color: "#00c896",
          icons: [{ src: "/favicon.svg", sizes: "512x512", type: "image/svg+xml" }]
        };
      }
    } catch (e) {
      console.error("Error reading manifest file:", e);
    }

    // Multi-tenant manifest override
    if (host && !host.includes(platformDomain) && !host.includes("localhost") && !host.includes(".run.app")) {
      try {
        const sitesData = JSON.parse(fs.readFileSync(USER_SITES_PATH, "utf-8"));
        const site = sitesData.sites.find((s: any) => s.customDomain === host && s.dnsVerified);
        if (site) {
          manifest.name = site.title || manifest.name;
          manifest.short_name = site.title?.split(' ')[0] || manifest.short_name;
        }
      } catch (e) {}
    }

    res.json(manifest);
  });

  app.get("/service-worker.js", (req, res) => {
    const swPath = path.join(__dirname, "public/service-worker.js");
    if (fs.existsSync(swPath)) {
      res.setHeader("Service-Worker-Allowed", "/");
      res.setHeader("Content-Type", "application/javascript");
      res.sendFile(swPath);
    } else {
      res.status(404).end();
    }
  });

  app.post("/api/theme-builder", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { templates } = req.body;
    fs.writeFileSync(THEME_BUILDER_PATH, JSON.stringify({ templates }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/custom-post-types", (req, res) => {
    try {
      if (!fs.existsSync(CUSTOM_POST_TYPES_PATH)) {
        fs.writeFileSync(CUSTOM_POST_TYPES_PATH, JSON.stringify({ postTypes: [] }, null, 2));
      }
      const data = JSON.parse(fs.readFileSync(CUSTOM_POST_TYPES_PATH, "utf-8"));
      res.json(data.postTypes);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/custom-post-types", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { postTypes } = req.body;
    fs.writeFileSync(CUSTOM_POST_TYPES_PATH, JSON.stringify({ postTypes }, null, 2));
    res.json({ success: true });
  });

  // Installation API
  app.get("/api/install/check", (req, res) => {
    const installed = db.prepare("SELECT value FROM settings WHERE key = 'installed'").get();
    res.json({ installed: !!installed });
  });

  app.post("/api/install", async (req, res) => {
    const { adminEmail, adminPassword, siteTitle } = req.body;
    
    const installed = db.prepare("SELECT value FROM settings WHERE key = 'installed'").get();
    if (installed) return res.status(400).json({ error: "Platform already installed" });

    try {
      // Create Master Admin
      const adminId = 'admin';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      db.prepare(`
        INSERT OR REPLACE INTO users (id, email, password, name, username, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(adminId, adminEmail, hashedPassword, 'Master Admin', 'admin', 'admin');

      // Create Default Site
      const siteId = 'default';
      db.prepare(`
        INSERT OR REPLACE INTO sites (id, user_id, title, subdomain)
        VALUES (?, ?, ?, ?)
      `).run(siteId, adminId, siteTitle, 'admin');

      // Mark as installed
      db.prepare("INSERT INTO settings (key, value) VALUES ('installed', 'true')").run();

      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Installation failed" });
    }
  });
  app.post("/api/auth/register", async (req, res) => {
    const { email: rawEmail, password, name, username, otp: rawOtp } = req.body;
    const email = rawEmail?.toLowerCase().trim();
    const otp = rawOtp?.trim();
    
    try {
      // Verify OTP first
      const otpRecord: any = db.prepare("SELECT * FROM otps WHERE email = ? AND otp = ?").get(email, otp);
      if (!otpRecord) {
        console.log(`OTP verification failed for ${email}. Provided: ${otp}`);
        return res.status(400).json({ error: "Invalid verification code" });
      }
      
      if (new Date(otpRecord.expires_at) < new Date()) {
        return res.status(400).json({ error: "Verification code has expired" });
      }

      const existingUser = db.prepare("SELECT * FROM users WHERE email = ? OR username = ?").get(email, username);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const userId = Math.random().toString(36).substr(2, 9);
      const hashedPassword = await bcrypt.hash(password, 10);
      db.prepare(`
        INSERT INTO users (id, email, password, name, username, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, email, hashedPassword, name, username, 'customer');

      // Delete OTP record after successful registration
      db.prepare("DELETE FROM otps WHERE email = ?").run(email);

      // Send Welcome Email
      const welcomeHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 16px;">
          <h1 style="color: #00C896;">Welcome to YA Wedding!</h1>
          <p>Hi ${name},</p>
          <p>Your account has been successfully created. You can now log in to your dashboard and start building your wedding site.</p>
          <p><strong>Your Details:</strong></p>
          <ul>
            <li>Email: ${email}</li>
            <li>Username: ${username}</li>
          </ul>
          <p>If you have any questions, feel free to reach out to us.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} YA Wedding</p>
        </div>
      `;
      await sendEmail(email, "Account Created Successfully - YA Wedding", "Your account has been successfully created at YA Wedding.", welcomeHtml);

      res.json({ success: true, user: { id: userId, email, name, role: 'customer' } });
    } catch (e) {
      console.error("Registration Error:", e);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    
    // Check for Master Admin first
    const config = JSON.parse(fs.readFileSync(ADMIN_SECURITY_PATH, "utf-8"));
    if (email === config.adminCredentials.username && password === config.adminCredentials.password) {
      return res.json({ 
        success: true, 
        token: 'ya-admin-secret', 
        user: { id: 'admin', email: config.adminCredentials.username, name: 'Master Admin', role: 'admin' } 
      });
    }

    const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ 
      success: true, 
      token: `user-token-${user.id}`, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    });
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    const { email: rawEmail } = req.body;
    const email = rawEmail?.toLowerCase().trim();
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    try {
      db.prepare("INSERT OR REPLACE INTO otps (email, otp, expires_at, verified) VALUES (?, ?, ?, 0)").run(email, otp, expiresAt);

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 16px;">
          <h2 style="color: #00C896;">Password Reset Request</h2>
          <p>You requested to reset your password. Use the code below to proceed:</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `;

      await sendEmail(email, `${otp} is your password reset code`, `Your password reset code is: ${otp}`, emailHtml);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to send reset code" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    const { email: rawEmail, otp: rawOtp, newPassword } = req.body;
    const email = rawEmail?.toLowerCase().trim();
    const otp = rawOtp?.trim();

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const otpRecord: any = db.prepare("SELECT * FROM otps WHERE email = ? AND otp = ?").get(email, otp);
    if (!otpRecord || new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.prepare("UPDATE users SET password = ? WHERE email = ?").run(hashedPassword, email);
      db.prepare("DELETE FROM otps WHERE email = ?").run(email);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // Admin Security Endpoints
  app.get("/api/admin/security/config", (req, res) => {
    const config = JSON.parse(fs.readFileSync(ADMIN_SECURITY_PATH, "utf-8"));
    // Only return the slug and questions (not answers or credentials)
    res.json({
      slug: config.slug,
      questions: config.securityQuestions.map((q: any) => q.q)
    });
  });

  const loginAttempts: Record<string, number> = {};

  app.post("/api/admin/security/verify", (req, res) => {
    const { answers, geo } = req.body;
    const config = JSON.parse(fs.readFileSync(ADMIN_SECURITY_PATH, "utf-8"));
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Verify Q&A
    const isQAValid = config.securityQuestions.every((q: any, idx: number) => {
      return answers[idx]?.toLowerCase() === q.a.toLowerCase();
    });

    // Verify Geo
    const isGeoValid = config.allowedGeos.some((allowed: string) => {
      return geo?.toLowerCase().includes(allowed.toLowerCase().split(',')[0].trim().toLowerCase());
    });

    if (!isQAValid || !isGeoValid) {
      loginAttempts[clientIp as string] = (loginAttempts[clientIp as string] || 0) + 1;
      if (loginAttempts[clientIp as string] >= 3) {
        const blockedData = JSON.parse(fs.readFileSync(BLOCKED_IPS_PATH, "utf-8"));
        blockedData.blocked.push(clientIp);
        fs.writeFileSync(BLOCKED_IPS_PATH, JSON.stringify(blockedData, null, 2));
        return res.status(403).json({ error: "Too many failed attempts. Access blocked." });
      }
      return res.status(401).json({ error: "Security verification failed." });
    }

    res.json({ success: true });
  });

  app.post("/api/admin/security/login", (req, res) => {
    const { username, password } = req.body;
    const config = JSON.parse(fs.readFileSync(ADMIN_SECURITY_PATH, "utf-8"));

    if (username === config.adminCredentials.username && password === config.adminCredentials.password) {
      return res.json({ 
        success: true, 
        token: 'ya-admin-secret', 
        user: { id: 'admin', email: config.adminCredentials.username, name: 'Master Admin', role: 'admin' } 
      });
    }

    res.status(401).json({ error: "Invalid credentials" });
  });

  // Admin Security Management (Protected)
  app.get("/api/admin/security/full-config", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const config = JSON.parse(fs.readFileSync(ADMIN_SECURITY_PATH, "utf-8"));
    res.json(config);
  });

  app.post("/api/admin/security/update", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { currentPassword, newConfig } = req.body;
    const config = JSON.parse(fs.readFileSync(ADMIN_SECURITY_PATH, "utf-8"));

    if (currentPassword !== config.adminCredentials.password) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    fs.writeFileSync(ADMIN_SECURITY_PATH, JSON.stringify(newConfig, null, 2));
    res.json({ success: true });
  });

  // User Management Endpoints (Admin Only)
  app.get("/api/admin/users", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const users = db.prepare("SELECT * FROM users").all();
    res.json(users);
  });

  app.post("/api/admin/users/update", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { userId, updates } = req.body;
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(", ");
    const values = [...Object.values(updates), userId];
    
    try {
      db.prepare(`UPDATE users SET ${fields} WHERE id = ?`).run(...values);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.post("/api/admin/users/delete", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { userId } = req.body;
    db.prepare("DELETE FROM users WHERE id = ?").run(userId);
    res.json({ success: true });
  });

  // User Dashboard APIs (Multi-tenant)
  app.get("/api/user/site", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const site = db.prepare("SELECT * FROM sites WHERE user_id = ?").get(userId);
    res.json(site || null);
  });

  app.post("/api/user/site/verify-domain", async (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required" });

    try {
      // Real DNS check
      let isVerified = false;
      const targetCname = "sites.platform.com";
      const targetA = "76.76.21.21";

      try {
        const cnames = await dns.promises.resolveCname(domain);
        if (cnames.includes(targetCname)) isVerified = true;
      } catch (e) {}

      if (!isVerified) {
        try {
          const addresses = await dns.promises.resolve4(domain);
          if (addresses.includes(targetA)) isVerified = true;
        } catch (e) {}
      }
      
      db.prepare(`
        UPDATE sites 
        SET custom_domain = ?, dns_verified = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?
      `).run(domain, isVerified ? 1 : 0, userId);
      
      res.json({ success: true, verified: isVerified });
    } catch (e) {
      res.status(500).json({ error: "Verification failed" });
    }
  });

  app.post("/api/user/site/provision-ssl", async (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required" });

    try {
      // In a real production environment, this would trigger a process to:
      // 1. Request a certificate from Let's Encrypt (e.g., via ACME protocol)
      // 2. Update the load balancer or reverse proxy configuration
      // 3. Reload the proxy to apply the new certificate
      
      // Simulation: SSL provisioning
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work
      
      db.prepare(`
        UPDATE sites 
        SET ssl_enabled = 1, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ? AND custom_domain = ?
      `).run(userId, domain);
      
      res.json({ success: true, message: "SSL certificate provisioned successfully" });
    } catch (e) {
      res.status(500).json({ error: "SSL provisioning failed" });
    }
  });

  app.get("/api/site-lookup", (req, res) => {
    const host = req.query.host as string;
    if (!host) return res.status(400).json({ error: "Host is required" });

    // Check custom domain first
    let site: any = db.prepare("SELECT * FROM sites WHERE custom_domain = ? AND dns_verified = 1").get(host);
    
    // Check subdomain if not custom domain
    if (!site && host.includes(".platform.com")) {
      const subdomain = host.split(".")[0];
      site = db.prepare("SELECT * FROM sites WHERE subdomain = ?").get(subdomain);
    }

    if (site) {
      const user: any = db.prepare("SELECT * FROM users WHERE id = ?").get(site.user_id);
      res.json({ 
        siteId: site.id, 
        username: user?.username,
        title: site.title,
        themeConfig: site.theme_config ? JSON.parse(site.theme_config) : {}
      });
    } else {
      res.status(404).json({ error: "Site not found" });
    }
  });

  app.post("/api/user/site", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const updates = req.body;
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(", ");
    const values = [...Object.values(updates), userId];

    try {
      db.prepare(`UPDATE sites SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`).run(...values);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Update failed" });
    }
  });

  const STORAGE_PATH = path.join(__dirname, "storage/users");

  // Ensure user storage exists
  const ensureUserStorage = (userId: string) => {
    const userPath = path.join(STORAGE_PATH, userId);
    const folders = ["uploads", "media", "assets", "theme", "pages", "posts", "widgets"];
    folders.forEach(f => {
      const folderPath = path.join(userPath, f);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    });
    
    // Ensure default files
    const pagesFile = path.join(userPath, "pages/data.json");
    if (!fs.existsSync(pagesFile)) fs.writeFileSync(pagesFile, JSON.stringify({ pages: [] }, null, 2));
    
    const postsFile = path.join(userPath, "posts/data.json");
    if (!fs.existsSync(postsFile)) fs.writeFileSync(postsFile, JSON.stringify({ posts: [] }, null, 2));
    
    const widgetsFile = path.join(userPath, "widgets/data.json");
    if (!fs.existsSync(widgetsFile)) fs.writeFileSync(widgetsFile, JSON.stringify({ widgets: [] }, null, 2));
    
    const themeFile = path.join(userPath, "theme/data.json");
    if (!fs.existsSync(themeFile)) fs.writeFileSync(themeFile, JSON.stringify({ theme: {} }, null, 2));
  };

  app.get("/api/page/:id", (req, res) => {
    const { id } = req.params;
    const type = req.query.type as string || 'page';
    const userId = getUserIdFromToken(req.headers.authorization);
    
    let item: any = null;
    
    if (userId) {
      ensureUserStorage(userId);
      const filePath = path.join(STORAGE_PATH, userId, type === 'blog' ? "posts/data.json" : "pages/data.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const items = type === 'blog' ? data.posts : data.pages;
      item = items.find((p: any) => p.id === id);
    } else {
      const filePath = type === 'blog' ? BLOGS_PATH : PAGES_PATH;
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const items = type === 'blog' ? data.blogs : data.pages;
      item = items.find((p: any) => p.id === id);
    }
    
    if (!item) return res.status(404).json({ error: `${type} not found` });
    res.json(item);
  });

  app.post("/api/page/save", (req, res) => {
    const { id, visualLayout, title, slug, widgets, type = 'page' } = req.body;
    const userId = getUserIdFromToken(req.headers.authorization);
    
    if (userId) {
      ensureUserStorage(userId);
      const filePath = path.join(STORAGE_PATH, userId, type === 'blog' ? "posts/data.json" : "pages/data.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const items = type === 'blog' ? data.posts : data.pages;
      const index = items.findIndex((p: any) => p.id === id);
      
      const itemData = { id, visualLayout, title, slug, widgets, updatedAt: new Date().toISOString() };
      
      if (index !== -1) {
        items[index] = { ...items[index], ...itemData };
      } else {
        items.push({ ...itemData, createdAt: new Date().toISOString() });
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } else {
      if (req.headers.authorization !== "Bearer ya-admin-secret") {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const filePath = type === 'blog' ? BLOGS_PATH : PAGES_PATH;
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const items = type === 'blog' ? data.blogs : data.pages;
      const index = items.findIndex((p: any) => p.id === id);
      
      const itemData = { id, visualLayout, title, slug, widgets, updatedAt: new Date().toISOString() };
      
      if (index !== -1) {
        items[index] = { ...items[index], ...itemData };
      } else {
        items.push({ ...itemData, createdAt: new Date().toISOString() });
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.json({ success: true });
    }
  });

  app.post("/api/page/publish", (req, res) => {
    const { id, published } = req.body;
    const userId = getUserIdFromToken(req.headers.authorization);
    
    if (userId) {
      ensureUserStorage(userId);
      const pagesPath = path.join(STORAGE_PATH, userId, "pages/data.json");
      const data = JSON.parse(fs.readFileSync(pagesPath, "utf-8"));
      const index = data.pages.findIndex((p: any) => p.id === id);
      
      if (index !== -1) {
        data.pages[index].published = published;
        fs.writeFileSync(pagesPath, JSON.stringify(data, null, 2));
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Page not found" });
      }
    } else {
      if (req.headers.authorization !== "Bearer ya-admin-secret") {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const data = JSON.parse(fs.readFileSync(PAGES_PATH, "utf-8"));
      const index = data.pages.findIndex((p: any) => p.id === id);
      
      if (index !== -1) {
        data.pages[index].published = published;
        fs.writeFileSync(PAGES_PATH, JSON.stringify(data, null, 2));
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Page not found" });
      }
    }
  });

  app.get("/api/components", (req, res) => {
    const components = [
      { type: 'section', label: 'Section', icon: 'Layout' },
      { type: 'column', label: 'Column', icon: 'Columns' },
      { type: 'heading', label: 'Heading', icon: 'Type' },
      { type: 'text', label: 'Text Block', icon: 'AlignLeft' },
      { type: 'image', label: 'Image', icon: 'Image' },
      { type: 'button', label: 'Button', icon: 'Square' },
      { type: 'form', label: 'Form', icon: 'ClipboardList' },
      { type: 'slider', label: 'Slider', icon: 'GalleryHorizontal' },
      { type: 'gallery', label: 'Gallery', icon: 'Grid' },
      { type: 'card', label: 'Card', icon: 'CreditCard' },
      { type: 'video', label: 'Video', icon: 'Video' },
      { type: 'map', label: 'Map', icon: 'Map' },
      { type: 'review_widget', label: 'Reviews', icon: 'Star' },
      { type: 'cta_block', label: 'CTA Block', icon: 'Megaphone' }
    ];
    res.json(components);
  });

  // Simple media upload simulation
  app.post("/api/media/upload", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    
    // In a real app, use multer to handle file uploads
    // For this demo, we'll just simulate a successful upload
    const { name, type, size } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const url = `https://picsum.photos/seed/${id}/800/600`; // Simulated URL
    
    const mediaItem = {
      id,
      url,
      name: name || "Uploaded File",
      type: type || "image",
      size: size || 0,
      createdAt: new Date().toISOString()
    };
    
    // Store in global media for now or user media
    try {
      const data = JSON.parse(fs.readFileSync(MEDIA_PATH, "utf-8"));
      data.media.push(mediaItem);
      fs.writeFileSync(MEDIA_PATH, JSON.stringify(data, null, 2));
    } catch (e) {}
    
    res.json(mediaItem);
  });

  app.get("/api/user/pages", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    ensureUserStorage(userId);
    const data = JSON.parse(fs.readFileSync(path.join(STORAGE_PATH, userId, "pages/data.json"), "utf-8"));
    res.json(data.pages);
  });

  app.post("/api/user/pages", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    ensureUserStorage(userId);
    const { pages } = req.body;
    fs.writeFileSync(path.join(STORAGE_PATH, userId, "pages/data.json"), JSON.stringify({ pages }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/user/blogs", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    ensureUserStorage(userId);
    const data = JSON.parse(fs.readFileSync(path.join(STORAGE_PATH, userId, "posts/data.json"), "utf-8"));
    res.json(data.posts);
  });

  app.post("/api/user/blogs", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    ensureUserStorage(userId);
    const { posts } = req.body;
    fs.writeFileSync(path.join(STORAGE_PATH, userId, "posts/data.json"), JSON.stringify({ posts }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/user/widgets", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    ensureUserStorage(userId);
    const data = JSON.parse(fs.readFileSync(path.join(STORAGE_PATH, userId, "widgets/data.json"), "utf-8"));
    res.json(data.widgets);
  });

  app.post("/api/user/widgets", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    ensureUserStorage(userId);
    const { widgets } = req.body;
    fs.writeFileSync(path.join(STORAGE_PATH, userId, "widgets/data.json"), JSON.stringify({ widgets }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/user/theme", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    ensureUserStorage(userId);
    const data = JSON.parse(fs.readFileSync(path.join(STORAGE_PATH, userId, "theme/data.json"), "utf-8"));
    res.json(data.theme);
  });

  app.post("/api/user/theme", (req, res) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    ensureUserStorage(userId);
    const { theme } = req.body;
    fs.writeFileSync(path.join(STORAGE_PATH, userId, "theme/data.json"), JSON.stringify({ theme }, null, 2));
    res.json({ success: true });
  });

  // Public User Site APIs
  app.get("/api/public/user/:username/pages", (req, res) => {
    const { username } = req.params;
    const user: any = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    ensureUserStorage(user.id);
    const data = JSON.parse(fs.readFileSync(path.join(STORAGE_PATH, user.id, "pages/data.json"), "utf-8"));
    res.json(data.pages.filter((p: any) => p.published));
  });

  app.get("/api/public/user/:username/theme", (req, res) => {
    const { username } = req.params;
    const user: any = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    ensureUserStorage(user.id);
    const data = JSON.parse(fs.readFileSync(path.join(STORAGE_PATH, user.id, "theme/data.json"), "utf-8"));
    res.json(data.theme);
  });

  app.get("/api/pages", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(PAGES_PATH, "utf-8"));
      res.json(data.pages);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/pages", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { pages } = req.body;
    fs.writeFileSync(PAGES_PATH, JSON.stringify({ pages }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/package-steps", (req, res) => {
    const data = JSON.parse(fs.readFileSync(PACKAGE_STEPS_PATH, "utf-8"));
    res.json(data);
  });

  app.post("/api/package-steps", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    fs.writeFileSync(PACKAGE_STEPS_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  });

  app.get("/api/settings", (req, res) => {
    const data = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
    res.json(data);
  });

  app.post("/api/settings", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  });

  app.get("/sitemap.xml", (req, res) => {
    const services = JSON.parse(fs.readFileSync(SERVICES_PATH, "utf-8")).services;
    const blogs = JSON.parse(fs.readFileSync(BLOGS_PATH, "utf-8")).blogs;
    const promos = JSON.parse(fs.readFileSync(PROMOS_PATH, "utf-8")).promos;
    const packages = JSON.parse(fs.readFileSync(PACKAGES_DATA_PATH, "utf-8")).packages;
    const baseUrl = "https://ya.tssmeemevents.com";

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/services</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/gallery</loc><priority>0.7</priority></url>
  <url><loc>${baseUrl}/blog</loc><priority>0.7</priority></url>
  <url><loc>${baseUrl}/contact</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/about</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/faq</loc><priority>0.7</priority></url>
  <url><loc>${baseUrl}/discounts</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/package-builder</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/packages</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/search</loc><priority>0.6</priority></url>`;

    services.forEach((s: any) => {
      sitemap += `\n  <url><loc>${baseUrl}/services/${s.id}</loc><priority>0.9</priority></url>`;
    });

    blogs.forEach((b: any) => {
      sitemap += `\n  <url><loc>${baseUrl}/blog/${b.id}</loc><priority>0.6</priority></url>`;
    });

    promos.forEach((p: any) => {
      sitemap += `\n  <url><loc>${baseUrl}/discounts#${p.id}</loc><priority>0.6</priority></url>`;
    });

    packages.forEach((pkg: any) => {
      sitemap += `\n  <url><loc>${baseUrl}/packages#${pkg.id}</loc><priority>0.7</priority></url>`;
    });

    sitemap += "\n</urlset>";
    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  });

  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: https://ya.tssmeemevents.com/sitemap.xml");
  });

  app.get("/api/services", (req, res) => {
    const data = JSON.parse(fs.readFileSync(SERVICES_PATH, "utf-8"));
    res.json(data.services);
  });

  app.post("/api/services", (req, res) => {
    // Simple Auth check (in a real app, use a proper token)
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { services } = req.body;
    fs.writeFileSync(SERVICES_PATH, JSON.stringify({ services }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/blogs", (req, res) => {
    const data = JSON.parse(fs.readFileSync(BLOGS_PATH, "utf-8"));
    res.json(data.blogs);
  });

  app.post("/api/bookings", async (req, res) => {
    const booking = req.body;
    const inquiryType = booking.inquiryType || (booking.isCustomForm ? 'Package Builder' : 'Event Package');
    console.log(`New ${inquiryType} Received:`, booking);

    // Load Development Settings
    let devSettings = {
      smtpHost: process.env.SMTP_HOST || "smtp.example.com",
      smtpPort: process.env.SMTP_PORT || "587",
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASS,
      adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
      fromEmail: process.env.FROM_EMAIL || "noreply@example.com"
    };

    try {
      if (fs.existsSync(DEVELOPMENT_PATH)) {
        const fileData = JSON.parse(fs.readFileSync(DEVELOPMENT_PATH, "utf-8"));
        // Only override if value is not empty
        if (fileData.smtpHost) devSettings.smtpHost = fileData.smtpHost;
        if (fileData.smtpPort) devSettings.smtpPort = fileData.smtpPort;
        if (fileData.smtpUser) devSettings.smtpUser = fileData.smtpUser;
        if (fileData.smtpPass) devSettings.smtpPass = fileData.smtpPass;
        if (fileData.adminEmail) devSettings.adminEmail = fileData.adminEmail;
        if (fileData.fromEmail) devSettings.fromEmail = fileData.fromEmail;
      }
    } catch (e) {
      console.error("Error loading development settings:", e);
    }

    // Email Configuration
    const transporter = nodemailer.createTransport({
      host: devSettings.smtpHost,
      port: parseInt(devSettings.smtpPort),
      secure: devSettings.smtpPort === "465",
      auth: {
        user: devSettings.smtpUser,
        pass: devSettings.smtpPass,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      },
      // Add connection timeout
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const adminEmail = devSettings.adminEmail;
    const fromEmail = devSettings.fromEmail;

    // Respond to the client immediately
    res.json({ success: true, message: "Inquiry received. Processing notifications..." });

    // Handle email sending in the background
    (async () => {
      if (!devSettings.smtpUser || !devSettings.smtpPass) {
        console.warn("SMTP credentials missing. Skipping email notifications.");
        return;
      }

      const sendWithRetry = async (mailOptions: any, maxRetries = 3) => {
        for (let i = 0; i < maxRetries; i++) {
          try {
            return await transporter.sendMail(mailOptions);
          } catch (error: any) {
            const isLastRetry = i === maxRetries - 1;
            const isRetryable = error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ESOCKET';
            
            if (isLastRetry || !isRetryable) {
              throw error;
            }
            
            console.warn(`Email sending failed (attempt ${i + 1}/${maxRetries}), retrying in 2s...`, error.message);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      };

      try {
        const emailTemplate = (() => {
          try {
            const data = JSON.parse(fs.readFileSync(EMAIL_TEMPLATES_PATH, "utf-8"));
            return data.templates[0]; // Use first template as default for now
          } catch (e) {
            return null;
          }
        })();

        const brandColor = emailTemplate?.header.textColor || "#00C896";
        const darkBg = emailTemplate?.header.bgColor || "#0B0F14";
        const bodyBg = emailTemplate?.body.bgColor || "#FFFFFF";
        const bodyText = emailTemplate?.body.textColor || "#141414";
        const mutedText = "#9CA3AF";

        // Prepare all input values for the admin email
        const allFieldsHtml = Object.entries(booking)
          .filter(([key]) => !['inquiryType', 'pageLocation', 'geotag', 'isCustomForm'].includes(key))
          .map(([key, value]) => `
            <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.05);">
              <span style="color: ${mutedText}; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 4px; font-weight: bold;">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span style="color: ${bodyText}; font-size: 14px; font-family: 'Inter', sans-serif;">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
            </div>
          `)
          .join('');

        const emailHeader = `
          <div style="background-color: ${darkBg}; padding: 50px 20px; text-align: center; border-bottom: 2px solid ${brandColor};">
            <div style="display: inline-block; width: 60px; height: 60px; background-color: ${emailTemplate?.header.centerIcon.bgColor || brandColor}; color: ${emailTemplate?.header.centerIcon.textColor || '#141414'}; border-radius: 12px; line-height: 60px; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
              ${emailTemplate?.header.centerIcon.text || 'YA'}
            </div>
            <div style="color: ${emailTemplate?.header.contactInfo.color || brandColor}; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
              ${emailTemplate?.header.contactInfo.whatsapp ? `<span>${emailTemplate.header.contactInfo.whatsapp}</span> &nbsp; ● &nbsp; ` : ''}
              ${emailTemplate?.header.contactInfo.email ? `<span>${emailTemplate.header.contactInfo.email}</span> &nbsp; ● &nbsp; ` : ''}
              ${emailTemplate?.header.contactInfo.website ? `<span>${emailTemplate.header.contactInfo.website}</span>` : ''}
            </div>
          </div>
        `;

        const emailFooter = `
          <div style="background-color: ${emailTemplate?.footer.bgColor || darkBg}; padding: 40px 20px; text-align: center; border-top: 1px solid rgba(0,0,0,0.05); margin-top: 0;">
            <div style="margin-bottom: 20px;">
              ${(emailTemplate?.footer.links || []).map((link: any, i: number) => link.show ? `
                <a href="${link.url}" style="color: ${link.color || brandColor}; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">${link.label}</a>
                ${i < (emailTemplate?.footer.links.length - 1) ? '<span style="color: rgba(0,0,0,0.1); margin: 0 10px;">●</span>' : ''}
              ` : '').join('')}
            </div>
            <p style="color: ${emailTemplate?.footer.platformName.color || brandColor}; font-size: 18px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 2px;">${emailTemplate?.footer.platformName.text || 'YA WEDDING'}</p>
            <p style="color: ${emailTemplate?.footer.shortDescription.color || mutedText}; font-size: 11px; margin-bottom: 20px; font-family: 'Inter', sans-serif; max-width: 300px; margin-left: auto; margin-right: auto;">${emailTemplate?.footer.shortDescription.text || 'Luxury Event Planning & Design'}</p>
            <p style="color: ${emailTemplate?.footer.copyright.color || emailTemplate?.footer.textColor || mutedText}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.5;">${emailTemplate?.footer.copyright.text || '&copy; 2026 YA Wedding Dubai. All rights reserved.'}</p>
          </div>
        `;

        const commonStyles = `
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Germania+One&display=swap" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Germania+One&display=swap');
            body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: ${darkBg}; color: ${bodyText}; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 0 auto; background-color: ${bodyBg}; }
            .content { padding: 50px 40px; position: relative; overflow: hidden; }
            .overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: ${emailTemplate?.body.overlayIcon.opacity || 0.05}; font-size: 300px; color: ${emailTemplate?.body.overlayIcon.color || bodyText}; pointer-events: none; z-index: 0; }
            .card { background-color: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.05); border-radius: 24px; padding: 30px; margin-bottom: 30px; position: relative; z-index: 1; }
            h2, h3 { font-family: 'Inter', Helvetica, Arial, sans-serif; font-weight: 700; }
            .btn { display: inline-block; background-color: ${brandColor}; color: ${emailTemplate?.header.bgColor || '#141414'}; padding: 16px 35px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 10px; }
          </style>
        `;

        // 1. Send Email to Admin
        await sendWithRetry({
          from: `"YA Wedding Admin" <${fromEmail}>`,
          to: adminEmail,
          subject: `[${inquiryType}] New Submission: ${booking.name || "Unknown"}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>${commonStyles}</head>
            <body>
              <div class="container">
                ${emailHeader}
                <div class="content">
                  ${emailTemplate?.body.overlayIcon.show ? `<div class="overlay">✉</div>` : ''}
                  <div style="position: relative; z-index: 1; text-align: center;">
                    <h2 style="color: ${bodyText}; font-size: 32px; margin-bottom: 10px;">
                      <span style="font-weight: 300;">${emailTemplate?.body.title.part1 || 'New'}</span>
                      <span style="display: block; font-weight: 900; font-size: 48px; color: ${emailTemplate?.body.title.color || brandColor};">${emailTemplate?.body.title.part2 || 'Submission'}</span>
                    </h2>
                    <p style="color: ${emailTemplate?.body.subheading.color || mutedText}; font-size: 14px; margin-bottom: 30px; font-style: italic;">${emailTemplate?.body.subheading.text || `New ${inquiryType} received.`}</p>
                    
                    <div style="margin-bottom: 30px;">
                      ${(emailTemplate?.cta.buttons || []).map((btn: any) => btn.show ? `
                        <a href="${btn.url}" class="btn" style="background-color: ${btn.bgColor || brandColor}; color: ${btn.textColor || '#141414'};">${btn.text}</a>
                      ` : '').join('')}
                    </div>
                  </div>

                  <div class="card">
                    <h3 style="color: ${brandColor}; font-size: 18px; margin-top: 0; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Submission Details</h3>
                    ${allFieldsHtml}
                  </div>

                  <div class="card" style="background-color: rgba(0,200,150,0.05); border-color: ${brandColor}33;">
                    <h3 style="color: ${brandColor}; font-size: 16px; margin-top: 0; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Tracking Metadata</h3>
                    <div style="margin-bottom: 10px;">
                      <span style="color: ${mutedText}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block;">Page Location</span>
                      <a href="${booking.pageLocation || '#'}" style="color: ${brandColor}; font-size: 13px; text-decoration: none;">${booking.pageLocation || 'N/A'}</a>
                    </div>
                    <div>
                      <span style="color: ${mutedText}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block;">Customer Geotag</span>
                      <span style="color: ${bodyText}; font-size: 13px;">${booking.geotag || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
                ${emailFooter}
              </div>
            </body>
            </html>
          `,
        });

        // 2. Send Confirmation Email to Client
        if (booking.email) {
          await sendWithRetry({
            from: `"YA Wedding" <${fromEmail}>`,
            to: booking.email,
            subject: `We've Received Your ${inquiryType} - YA Wedding`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>${commonStyles}</head>
              <body>
                <div class="container">
                  ${emailHeader}
                  <div class="content" style="text-align: center;">
                    <h2 style="color: ${bodyText}; font-size: 36px; margin-bottom: 15px;">
                      <span style="font-weight: 300;">Thank You,</span>
                      <span style="display: block; font-weight: 900; font-size: 48px; color: ${emailTemplate?.body.title.color || brandColor};">${booking.name}!</span>
                    </h2>
                    <p style="color: ${emailTemplate?.body.subheading.color || mutedText}; font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
                      Your inquiry regarding <strong>${inquiryType}</strong> has been received. Our luxury event specialists are already reviewing your details.
                    </p>
                    
                    <div class="card" style="text-align: left;">
                      <h3 style="color: ${brandColor}; font-size: 18px; margin-top: 0; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Your Details</h3>
                      <div style="margin-bottom: 15px;">
                        <span style="color: ${mutedText}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Event Date</span>
                        <span style="color: ${bodyText}; font-size: 15px; font-weight: bold;">${booking.date || 'To be confirmed'}</span>
                      </div>
                      <div style="margin-bottom: 15px;">
                        <span style="color: ${mutedText}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Location</span>
                        <span style="color: ${bodyText}; font-size: 15px; font-weight: bold;">${booking.location || 'To be confirmed'}</span>
                      </div>
                      ${booking.finalPrice ? `
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.05);">
                          <span style="color: ${mutedText}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Estimated Investment</span>
                          <span style="color: ${brandColor}; font-size: 24px; font-weight: bold;">AED ${booking.finalPrice.toLocaleString()}</span>
                        </div>
                      ` : ''}
                    </div>

                    <div style="margin-top: 40px;">
                      <p style="color: ${bodyText}; font-weight: bold; margin-bottom: 10px;">What's Next?</p>
                      <p style="color: ${mutedText}; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                        One of our senior planners will reach out to you within 24 hours for a personalized consultation.
                      </p>
                      ${(emailTemplate?.cta.buttons || []).map((btn: any) => btn.show ? `
                        <a href="${btn.url}" class="btn" style="background-color: ${btn.bgColor || brandColor}; color: ${btn.textColor || '#141414'};">${btn.text}</a>
                      ` : '').join('')}
                    </div>
                  </div>
                  ${emailFooter}
                </div>
              </body>
              </html>
            `,
          });
        }
        console.log(`Notification emails for ${inquiryType} sent successfully.`);
      } catch (error) {
        console.error("Error sending emails in background:", error);
      }
    })();
  });

  app.post("/api/blogs", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { blogs } = req.body;
    fs.writeFileSync(BLOGS_PATH, JSON.stringify({ blogs }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/promos", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(PROMOS_PATH, "utf-8"));
      res.json(data.promos);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/promos", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { promos } = req.body;
    fs.writeFileSync(PROMOS_PATH, JSON.stringify({ promos }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/media", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(MEDIA_PATH, "utf-8"));
      res.json(data);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/media", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    fs.writeFileSync(MEDIA_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  });

  app.get("/api/booking-forms", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(BOOKING_FORMS_PATH, "utf-8"));
      res.json(data.forms);
    } catch (e) {
      res.json([]);
    }
  });

  app.get("/api/packages", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(PACKAGES_DATA_PATH, "utf-8"));
      res.json(data.packages);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/booking-forms", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { forms } = req.body;
    fs.writeFileSync(BOOKING_FORMS_PATH, JSON.stringify({ forms }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/ratings", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(RATINGS_PATH, "utf-8"));
      if (req.headers.authorization === "Bearer ya-admin-secret") {
        res.json(data.ratings);
      } else {
        res.json(data.ratings.filter((r: any) => r.status === 'approved'));
      }
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/ratings", (req, res) => {
    const rating = {
      id: Math.random().toString(36).substr(2, 9),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const data = JSON.parse(fs.readFileSync(RATINGS_PATH, "utf-8"));
    data.ratings.push(rating);
    fs.writeFileSync(RATINGS_PATH, JSON.stringify(data, null, 2));
    
    res.json({ success: true, message: "Rating submitted for approval." });
  });

  app.post("/api/admin/ratings", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { ratings } = req.body;
    fs.writeFileSync(RATINGS_PATH, JSON.stringify({ ratings }, null, 2));
    res.json({ success: true });
  });

  app.get("/api/partnerships", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const data = JSON.parse(fs.readFileSync(PARTNERSHIPS_PATH, "utf-8"));
      res.json(data.applications);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/partnerships", (req, res) => {
    try {
      const application = {
        id: Math.random().toString(36).substr(2, 9),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      const data = JSON.parse(fs.readFileSync(PARTNERSHIPS_PATH, "utf-8"));
      data.applications.push(application);
      fs.writeFileSync(PARTNERSHIPS_PATH, JSON.stringify(data, null, 2));
      res.json({ success: true, message: "Application submitted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  app.delete("/api/partnerships/:id", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { id } = req.params;
      const data = JSON.parse(fs.readFileSync(PARTNERSHIPS_PATH, "utf-8"));
      data.applications = data.applications.filter((a: any) => a.id !== id);
      fs.writeFileSync(PARTNERSHIPS_PATH, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  app.get("/api/development", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      if (fs.existsSync(DEVELOPMENT_PATH)) {
        const data = JSON.parse(fs.readFileSync(DEVELOPMENT_PATH, "utf-8"));
        res.json(data);
      } else {
        res.json({});
      }
    } catch (e) {
      res.json({});
    }
  });

  app.post("/api/development", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    fs.writeFileSync(DEVELOPMENT_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  });

  // Widget Pro API
  app.get("/api/widget-pro", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(WIDGET_PRO_PATH, "utf-8"));
      res.json(data.items);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/widget-pro", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { items } = req.body;
    fs.writeFileSync(WIDGET_PRO_PATH, JSON.stringify({ items }, null, 2));
    res.json({ success: true });
  });

  // Containers API
  app.get("/api/containers", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(CONTAINERS_PATH, "utf-8"));
      res.json(data.containers);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/containers", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { containers } = req.body;
    fs.writeFileSync(CONTAINERS_PATH, JSON.stringify({ containers }, null, 2));
    res.json({ success: true });
  });

  // Standard Widgets API
  app.get("/api/standard-widgets", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(STANDARD_WIDGETS_PATH, "utf-8"));
      res.json(data.widgets);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/standard-widgets", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { widgets } = req.body;
    fs.writeFileSync(STANDARD_WIDGETS_PATH, JSON.stringify({ widgets }, null, 2));
    res.json({ success: true });
  });

  // Email Templates API
  app.get("/api/email-templates", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(EMAIL_TEMPLATES_PATH, "utf-8"));
      res.json(data.templates);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/email-templates", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { templates } = req.body;
    fs.writeFileSync(EMAIL_TEMPLATES_PATH, JSON.stringify({ templates }, null, 2));
    res.json({ success: true });
  });

  // PDF Templates API
  app.get("/api/pdf-templates", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(PDF_TEMPLATES_PATH, "utf-8"));
      res.json(data.templates);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/pdf-templates", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { templates } = req.body;
    fs.writeFileSync(PDF_TEMPLATES_PATH, JSON.stringify({ templates }, null, 2));
    res.json({ success: true });
  });

  // Redirections API
  app.get("/api/redirections", (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(REDIRECTIONS_PATH, "utf-8"));
      res.json(data.redirections);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/redirections", (req, res) => {
    if (req.headers.authorization !== "Bearer ya-admin-secret") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { redirections } = req.body;
    fs.writeFileSync(REDIRECTIONS_PATH, JSON.stringify({ redirections }, null, 2));
    res.json({ success: true });
  });

  const injectSEO = (html: string, url: string) => {
    try {
      const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
      let title = settings.siteName || "YA Wedding";
      let description = settings.siteDescription || "Luxury Wedding Planner Dubai";
      let image = settings.siteLogo || "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp";

      if (url.startsWith('/services/')) {
        const id = url.split('/')[2];
        const services = JSON.parse(fs.readFileSync(SERVICES_PATH, "utf-8")).services;
        const service = services.find((s: any) => s.id === id);
        if (service) {
          title = `${service.name} | ${settings.siteName}`;
          description = service.seoDescription || service.description;
          image = service.image || image;
        }
      } else if (url.startsWith('/blog/')) {
        const id = url.split('/')[2];
        const blogs = JSON.parse(fs.readFileSync(BLOGS_PATH, "utf-8")).blogs;
        const blog = blogs.find((b: any) => b.id === id);
        if (blog) {
          title = `${blog.title} | ${settings.siteName}`;
          description = blog.excerpt;
          image = blog.image || image;
        }
      } else {
        const slug = url === '/' ? 'home' : url.split('/')[1];
        const pages = JSON.parse(fs.readFileSync(PAGES_PATH, "utf-8"))?.pages || [];
        const page = pages.find((p: any) => p.slug === slug);
        if (page) {
          title = `${page.title} | ${settings.siteName}`;
          description = page.description || description;
        }
      }

      const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
      `;

      let newHtml = html.replace(/<title>.*?<\/title>/, '');
      newHtml = newHtml.replace(/<meta name="description".*?>/, '');
      return newHtml.replace('</head>', `${metaTags}</head>`);
    } catch (e) {
      console.error("SEO Injection Error:", e);
      return html;
    }
  };

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/') || url.includes('.')) {
        return next();
      }

      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        template = injectSEO(template, url);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, "dist"), { index: false }));
    app.use("*", (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/') || url.includes('.')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.join(__dirname, "dist/index.html"), "utf-8");
        template = injectSEO(template, url);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        res.sendFile(path.join(__dirname, "dist/index.html"));
      }
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
