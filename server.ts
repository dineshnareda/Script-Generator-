import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import admin from "firebase-admin";
import { Resend } from 'resend';

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Firebase Admin
// Note: In a real production app, you'd use a service account JSON.
// For this environment, we'll initialize with project ID if possible, 
// or just use it for token verification if the environment allows.
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "script-generator-91bc4"
  });
}

const JWT_SECRET = process.env.JWT_SECRET || "viral-scripts-secret-key-123";

// Mock Database
const users: any[] = [];
const otps: Record<string, { code: string; expires: number }> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/register", [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one symbol')
      .custom((value) => {
        const hindiRegex = /[\u0900-\u097F]/;
        if (hindiRegex.test(value)) {
          throw new Error('Hindi characters are not allowed in password');
        }
        return true;
      })
  ], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: hashedPassword,
      credits: 100,
      exhaustedCredits: 0,
      authMode: 'password',
      theme: 'light',
      usageHistory: []
    };

    users.push(newUser);
    
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ user: userWithoutPassword, token });
  });

  app.post("/api/auth/login", async (req: any, res: any) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  });

  // Firebase Sync Route
  app.post("/api/auth/firebase-sync", async (req: any, res: any) => {
    const authHeader = req.headers['authorization'];
    const idToken = authHeader && authHeader.split(' ')[1];

    if (!idToken) return res.status(401).json({ error: "No token provided" });

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name: tokenName, picture } = decodedToken;
      const { name: bodyName } = req.body;

      let user = users.find(u => u.firebaseUid === uid || u.email === email);

      if (!user) {
        // Create new user from Firebase data
        user = {
          id: Math.random().toString(36).substr(2, 9),
          firebaseUid: uid,
          name: bodyName || tokenName || email?.split('@')[0] || 'User',
          email: email,
          profilePic: picture || '',
          credits: 100,
          exhaustedCredits: 0,
          authMode: 'firebase',
          theme: 'light',
          usageHistory: []
        };
        users.push(user);
      } else {
        // Update existing user with Firebase UID if not set
        if (!user.firebaseUid) user.firebaseUid = uid;
        if ((bodyName || tokenName) && !user.name) user.name = bodyName || tokenName;
        if (picture && !user.profilePic) user.profilePic = picture;
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      res.status(401).json({ error: "Invalid Firebase token" });
    }
  });

  // Profile Updates
  app.patch("/api/user/profile", authenticateToken, (req: any, res: any) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { name, profilePic, theme } = req.body;
    if (name) user.name = name;
    if (profilePic !== undefined) user.profilePic = profilePic;
    if (theme) user.theme = theme;

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // OTP Routes (Login Only)
  app.post("/api/auth/otp/send", async (req: any, res: any) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ error: "No account found with this email. Please sign up first." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = {
      code,
      expires: Date.now() + 10 * 60 * 1000 // Increased to 10 minutes
    };

    console.log(`\n--- OTP DEBUG ---\nTo: ${email}\nCode: ${code}\nExpires: ${new Date(otps[email].expires).toLocaleTimeString()}\n-----------------\n`);

    if (resend) {
      try {
        await resend.emails.send({
          from: 'Viral Scripts <onboarding@resend.dev>',
          to: email,
          subject: `${code} is your Viral Scripts verification code`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
              <h1 style="color: #4f46e5; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Verification Code</h1>
              <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">Use the code below to sign in to your Viral Scripts account. This code will expire in 10 minutes.</p>
              <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #1e293b;">${code}</span>
              </div>
              <p style="color: #94a3b8; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
          `
        });
      } catch (err) {
        console.error('Failed to send email via Resend:', err);
        // We still return success in debug mode if the console log worked, 
        // but in production this would be a real error.
      }
    }

    res.json({ message: "OTP sent successfully" });
  });

  app.post("/api/auth/otp/verify", async (req: any, res: any) => {
    const { email, code } = req.body;
    const otpData = otps[email];

    if (!otpData) {
      return res.status(400).json({ error: "No OTP requested for this email. Please click 'Send OTP' first." });
    }

    if (otpData.expires < Date.now()) {
      delete otps[email];
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (otpData.code !== code) {
      return res.status(400).json({ error: "Invalid OTP code. Please check and try again." });
    }

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: "User not found" });

    delete otps[email];

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  });

  // User Profile & Credits
  app.get("/api/user/profile", authenticateToken, (req: any, res: any) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post("/api/user/credits/use", authenticateToken, (req: any, res: any) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { topic } = req.body;

    if (user.credits < 20) {
      return res.status(400).json({ error: "Insufficient credits" });
    }

    user.credits -= 20;
    user.exhaustedCredits += 20;
    user.usageHistory.unshift({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      topic: topic || "Generated Script",
      creditsUsed: 20
    });

    res.json({ credits: user.credits, exhaustedCredits: user.exhaustedCredits, usageHistory: user.usageHistory });
  });

  // Catch-all for API routes that don't exist
  app.all("/api/*all", (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
