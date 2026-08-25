import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { SpeakersController } from '../controllers/speakersController.js';
import { RentalsController } from '../controllers/rentalsController.js';
import { ExpensesController } from '../controllers/expensesController.js';
import { GpsController } from '../controllers/gpsController.js';
import { ReportsController, SettingsController } from '../controllers/reportsController.js';
import { PaymentController } from '../controllers/paymentController.js';
import { ReviewsController } from '../controllers/reviewsController.js';
import { authenticate, optionalAuth, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import { authRateLimiter, gpsRateLimiter } from '../middlewares/security.js';
import {
  loginSchema,
  createSpeakerSchema,
  updateSpeakerSchema,
  createRentalSchema,
  updateRentalStatusSchema,
  createExpenseSchema,
  gpsPingSchema
} from '../schemas/index.js';

export const router = Router();

// ─── 1. Health Check ───
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ─── 2. Auth Routes ───
router.post('/auth/register', authRateLimiter, AuthController.register);
router.post('/auth/login', authRateLimiter, validate(loginSchema), AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.post('/auth/refresh', AuthController.refreshToken);
router.get('/auth/me', authenticate, AuthController.getCurrentUser);
router.get('/auth/session-check', authenticate, AuthController.sessionCheck);

// ─── 3. Speakers & Inventory Routes ───
router.get('/speakers', optionalAuth, SpeakersController.getAll);
router.get('/speakers/:id', optionalAuth, SpeakersController.getById);
router.post('/speakers', optionalAuth, validate(createSpeakerSchema), SpeakersController.create);
router.patch('/speakers/:id', optionalAuth, validate(updateSpeakerSchema), SpeakersController.update);

// ─── 4. Rentals & Orders Routes ───
router.get('/rentals', optionalAuth, RentalsController.getAll);
router.post('/rentals', optionalAuth, validate(createRentalSchema), RentalsController.create);
router.patch('/rentals/:id/status', optionalAuth, validate(updateRentalStatusSchema), RentalsController.updateStatus);

// ─── 5. Expenses Routes ───
router.get('/expenses', optionalAuth, ExpensesController.getAll);
router.post('/expenses', optionalAuth, validate(createExpenseSchema), ExpensesController.create);
router.patch('/expenses/:id/approve', optionalAuth, ExpensesController.approve);

// ─── 6. GPS Routes ───
router.post('/gps/ping', gpsRateLimiter, validate(gpsPingSchema), GpsController.ping);
router.get('/gps/history/:speakerId', optionalAuth, GpsController.getHistory);

// ─── 7. Reports & Settings Routes ───
router.get('/reports/summary', optionalAuth, ReportsController.getSummary);
router.get('/settings', optionalAuth, SettingsController.getSettings);
router.put('/settings', optionalAuth, SettingsController.updateSettings);

// ─── 8. Payment & Bank Webhook Routes (100% Auto Detection) ───
router.post('/payment/webhook', PaymentController.handleWebhook);
router.get('/payment/check', PaymentController.checkRecentPayment);
router.post('/payment/simulate-success', PaymentController.simulateSuccess);

// ─── 9. Customer Reviews & Owner Replies Routes ───
router.get('/reviews', optionalAuth, ReviewsController.getAll);
router.post('/reviews', ReviewsController.create);
router.patch('/reviews/:id/reply', optionalAuth, ReviewsController.reply);
router.delete('/reviews/:id', optionalAuth, ReviewsController.delete);
