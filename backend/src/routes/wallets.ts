import express from 'express';
import { addWalletToDB, getWalletsFromDB, deleteWalletFromDB } from '../data/wallets';
import { deleteTransactionsByWallet } from '../data/transactions'; // Now correctly imported

const router = express.Router();

// Hardcoded user ID for now
const HARDCODED_USER_ID = 'main_user';

// GET all wallets for the user
router.get('/', async (req, res) => {
  try {
    const wallets = await getWalletsFromDB(HARDCODED_USER_ID);
    res.json(wallets);
  } catch (error: any) {
    console.error('Error getting wallets:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST a new wallet
router.post('/', async (req, res) => {
  const { name, address, chain } = req.body;
  if (!name || !address || !chain) {
    return res.status(400).json({ error: 'Wallet name, address, and chain are required.' });
  }
  try {
    const newWallet = await addWalletToDB(HARDCODED_USER_ID, name, address, chain);
    res.status(201).json(newWallet);
  } catch (error: any) {
    console.error('Error adding wallet:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE a wallet
router.delete('/:walletId', async (req, res) => {
  const { walletId } = req.params;
  try {
    // Before deleting the wallet, get its details to delete associated transactions
    const wallets = await getWalletsFromDB(HARDCODED_USER_ID);
    const walletToDelete = wallets.find(w => w._id?.toString() === walletId);

    if (!walletToDelete) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }

    // Delete associated transactions
    await deleteTransactionsByWallet(walletToDelete.address, walletToDelete.chain);

    // Delete the wallet itself
    const deleted = await deleteWalletFromDB(walletId);
    if (deleted) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'Wallet not found or could not be deleted.' });
    }
  } catch (error: any) {
    console.error('Error deleting wallet:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
