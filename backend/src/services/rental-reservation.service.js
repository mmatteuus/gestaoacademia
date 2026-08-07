import { getRowById, insertRow, listRows } from '../repositories/sheets.repository.js';
import { withLock } from '../lib/locks.js';
import { normalizeReservationRow, overlaps, toMinutes } from './domain.utils.js';

export async function createRentalReservation(payload) {
  const reservationId = payload.id || `res${Date.now()}`;
  const reservationLockKey = `reservation:${payload.espaco}`;

  return withLock(reservationLockKey, async () => {
    if (payload.id) {
      const existingReservation = await getRowById(payload.id, 'Reservas');
      if (existingReservation) {
        return {
          ok: true,
          status: 200,
          data: {
            id: payload.id,
            conflito: String(existingReservation.conflito || 'false') === 'true',
            status: existingReservation.status || 'confirmada',
            dataInicio: existingReservation.data_inicio || payload.dataInicio,
            dataFim: existingReservation.data_fim || existingReservation.data_inicio || payload.dataInicio,
            horaInicio: existingReservation.hora_inicio || payload.horaInicio,
            horaFim: existingReservation.hora_fim || payload.horaFim,
          },
          warnings: ['Reservation already processed with the same id'],
        };
      }
    }

    const nextReservation = {
      id: reservationId,
      espaco: payload.espaco,
      locatario: payload.locatario,
      locatario_telefone: payload.locatarioTelefone || '',
      data_inicio: payload.dataInicio,
      data_fim: payload.dataFim || payload.dataInicio,
      hora_inicio: payload.horaInicio,
      hora_fim: payload.horaFim,
      valor: payload.valor,
      status: payload.status || 'confirmada',
      observacoes: payload.observacoes || '',
    };

    const startMinutes = toMinutes(nextReservation.hora_inicio);
    const endMinutes = toMinutes(nextReservation.hora_fim);
    if (startMinutes >= endMinutes) {
      return {
        ok: false,
        status: 400,
        error: 'validation_error',
        message: 'End time must be greater than start time',
      };
    }

    const reservations = (await listRows('Reservas')).map(normalizeReservationRow);
    const newStartDate = nextReservation.data_inicio;
    const newEndDate = nextReservation.data_fim || nextReservation.data_inicio;
    const hasConflict = reservations.some((row) => {
      if (row.espaco !== nextReservation.espaco) return false;
      if (String(row.status || '').toLowerCase() === 'cancelada') return false;

      const rowStartDate = row.data_inicio;
      const rowEndDate = row.data_fim || row.data_inicio;
      const datesOverlap = rowStartDate <= newEndDate && rowEndDate >= newStartDate;
      if (!datesOverlap) return false;

      return overlaps(
        toMinutes(row.hora_inicio),
        toMinutes(row.hora_fim),
        startMinutes,
        endMinutes,
      );
    });

    const result = await insertRow({
      ...nextReservation,
      conflito: String(hasConflict),
      sheet_type: 'Reservas',
    });

    if (!result?.success) {
      return { ok: false, status: 500, error: 'operation_failed', message: 'Failed to create reservation' };
    }

    return {
      ok: true,
      status: 201,
      data: {
        id: nextReservation.id,
        conflito: hasConflict,
        status: nextReservation.status,
        dataInicio: nextReservation.data_inicio,
        dataFim: nextReservation.data_fim,
        horaInicio: nextReservation.hora_inicio,
        horaFim: nextReservation.hora_fim,
      },
      warnings: hasConflict ? ['Reservation created with schedule conflict'] : undefined,
    };
  });
}
