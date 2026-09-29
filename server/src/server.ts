import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { getExchangeRates } from './services/exchangeRateService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const clientUrl = process.env.CLIENT_URL || 'https://stocksenseims.web.app';

// Middleware
app.use(cors({
  origin: clientUrl,
  credentials: true
}));
app.use(express.json());

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  }
});

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StockSense API is running' });
});

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.get('/api/exchange-rates', async (req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json({ status: 'success', rates });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        category: true,
        stockLevels: true
      }
    });

    const products = dbProducts.map(p => {
      // Map Prisma schema to the expected frontend structure
      const totalStock = p.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);
      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: 50000.00, // Dummy price as it's missing in DB schema
        stock: totalStock,
        category: p.category.name,
        image: "" // Empty image string
      };
    });

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

import bcrypt from 'bcrypt';

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password_hash, name, role: 'USER' }
    });
    res.json({ status: 'success', user: { name: user.name, email: user.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    
    // Check if it's a Google user without a password
    if (user.password_hash === 'GOOGLE_AUTH') {
      return res.status(400).json({ error: "Please log in with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    
    res.json({ status: 'success', user: { name: user.name, email: user.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, password_hash: 'GOOGLE_AUTH', role: 'USER' }
      });
    }
    res.json({ status: 'success', user: { name: user.name, email: user.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start Server locally
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
