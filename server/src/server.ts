import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { getExchangeRates } from './services/exchangeRateService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

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

app.get('/api/exchange-rates', async (req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json({ status: 'success', rates });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start Server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
