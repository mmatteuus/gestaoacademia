import { Router } from 'express';
import { asyncHandler } from '../middlewares/error.middleware.js';
import {
  batchListRowsController,
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
import { publicCadastroAlunoController } from '../controllers/public.controller.js';

export function createAppRouter() {
  const router = Router();

  router.get('/rows', asyncHandler(listRowsController));
  router.get('/rows/batch', asyncHandler(batchListRowsController));
  router.get('/rows/:id', asyncHandler(getRowController));
  router.post('/rows', asyncHandler(createRowController));
  router.put('/rows/:id', asyncHandler(updateRowController));
  router.get('/status', statusController);

  router.post('/api/sales', asyncHandler(createSaleController));
  router.post('/api/finance/payments', asyncHandler(createFinancePaymentController));
  router.post('/api/rentals/reservations', asyncHandler(createRentalReservationController));

  // Endpoint público (sem API key) para cadastro via formulário compartilhado.
  // Rate limit global ainda se aplica.
  router.post('/api/public/aluno-cadastro', asyncHandler(publicCadastroAlunoController));

  return router;
}
