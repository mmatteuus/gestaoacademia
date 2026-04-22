import { getRowById, insertRow, listRows, updateRow } from '../repositories/sheets.repository.js';

export async function listRowsByType(type) {
  return listRows(type);
}

export async function getRow(type, id) {
  return getRowById(id, type);
}

export async function createRow(payload) {
  return insertRow(payload);
}

export async function editRow(type, id, payload) {
  return updateRow(id, payload, type);
}
