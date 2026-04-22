import { Router } from 'express';
import { asyncHandler } from '../middlewares/error.middleware.js';
import {
  createRowController,
  getRowController,
  listRowsController,
  statusController,
  updateRowController,
} from '../controllers/rows.controller.js';
import {
  createFinancePaymentController,
  createRentalReservationController,
  createSaleController,
} from '../controllers/domain.controller.js';

export function createAppRouter() {
  const router = Router();

  router.get('/rows', asyncHandler(listRowsController));
  router.get('/rows/:id', asyncHandler(getRowController));
  router.post('/rows', asyncHandler(createRowController));
  router.put('/rows/:id', asyncHandler(updateRowController));
  router.get('/status', statusController);

  router.post('/api/sales', asyncHandler(createSaleController));
  router.post('/api/finance/payments', asyncHandler(createFinancePaymentController));
  router.post('/api/rentals/reservations', asyncHandler(createRentalReservationController));

  return router;
}
