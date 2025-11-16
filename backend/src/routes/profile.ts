import express from 'express';
import { getProfileFromMongoDB, updateProfileInMongoDB } from '../data/profile';

const router = express.Router();
const HARDCODED_USER_ID = 'main_user';

// Get profile
router.get('/', async (req, res) => {
    try {
        const profile = await getProfileFromMongoDB(HARDCODED_USER_ID);
        res.json(profile);
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update profile
router.put('/', async (req, res) => {
    const { fullName, username, email } = req.body;
    try {
        const updatedProfile = await updateProfileInMongoDB(HARDCODED_USER_ID, { fullName, username, email });
        res.json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
