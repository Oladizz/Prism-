import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
console.log('ETHERSCAN_API_KEY:', process.env.ETHERSCAN_API_KEY);
import ethereumRouter from './routes/ethereum';
import solanaRouter from './routes/solana';
import bitcoinRouter from './routes/bitcoin';
import tonRouter from './routes/ton';
import portfolioRouter from './routes/portfolio';
import profileRouter from './routes/profile';
import walletRouter from './routes/wallets'; // Import the new wallet router
import marketsRouter from './routes/markets';
import path from 'path';
import { connectToMongoDB } from './config/mongodb'; // Import MongoDB connection

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.use('/api/profile', profileRouter);
app.use('/api/wallets', walletRouter); // Add the new wallet router
app.use('/api/markets', marketsRouter);
app.use('/portfolio', portfolioRouter);

const chainRouter = (req: Request, res: Response, next: NextFunction) => {
    const { chain } = req.params;
    req.chain = chain;
    switch (chain) {
        case 'ethereum':
        case 'polygon':
        case 'avalanche':
        case 'binance-smart-chain':
        case 'optimism':
        case 'arbitrum':
        case 'base':
            return ethereumRouter(req, res, next);
        case 'solana':
            return solanaRouter(req, res, next);
        case 'bitcoin':
            return bitcoinRouter(req, res, next);
        case 'ton':
            return tonRouter(req, res, next);
        default:
            res.status(400).json({ error: 'Unsupported chain' });
    }
};

app.use('/:chain', chainRouter);

app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Connect to MongoDB before starting the server
connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error("Failed to connect to MongoDB, server not started:", error);
  process.exit(1);
});