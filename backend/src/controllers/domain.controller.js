import { HttpError } from '../middlewares/error.middleware.js';
import { executeSale, registerFinancePayment, createRentalReservation } from '../services/domain.service.js';
import {
  paymentPayloadSchema,
  reservationPayloadSchema,
  salesPayloadSchema,
  validate,
} from '../validators/api.schemas.js';

function parse(schema, body) {
  const parsed = validate(schema, body);
  if (!parsed.ok) {
    throw new HttpError(400, 'validation_error', 'Invalid payload', parsed.details);
  }
  return parsed.data;
}

function respondDomainResult(res, result) {
  if (!result.ok) {
    const status = result.status || 500;
    const payload = {
      ok: false,
      error: result.error || 'operation_failed',
      message: result.message || 'Operation failed',
    };
    if (result.details) payload.details = result.details;
    if (result.warnings) payload.warnings = result.warnings;
    return res.status(status).json(payload);
  }

  const payload = {
    ok: true,
    data: result.data,
  };
  if (result.warnings && result.warnings.length) payload.warnings = result.warnings;
  return res.status(result.status || 200).json(payload);
}

export async function createSaleController(req, res) {
  const payload = parse(salesPayloadSchema, req.body || {});
  const result = await executeSale(payload);
  return respondDomainResult(res, result);
}

export async function createFinancePaymentController(req, res) {
  const payload = parse(paymentPayloadSchema, req.body || {});
  const result = await registerFinancePayment(payload);
  return respondDomainResult(res, result);
}

export async function createRentalReservationController(req, res) {
  const payload = parse(reservationPayloadSchema, req.body || {});
  const result = await createRentalReservation(payload);
  return respondDomainResult(res, result);
}
