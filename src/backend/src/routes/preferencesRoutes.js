import express from 'express';
import {
    getPreferences,
    createPreferences,
    updatePreferences,
    deletePreferences,
} from '../controllers/PreferencesController.js';

const router = express.Router();

router.get('/', getPreferences);
router.post('/', createPreferences);
router.put('/', updatePreferences);
// router.delete('/', deletePreferences); I dont think we need this

export default router;