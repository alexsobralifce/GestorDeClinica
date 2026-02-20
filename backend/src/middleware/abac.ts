import { Context } from 'hono';
import pool from '../db/connection.js';

/**
 * Checks if the current user can view the EHR (Timeline) of a specific patient.
 * Rules:
 * - Admin: Access allowed (Logged)
 * - Patient: Access allowed to own record
 * - Professional:
 *   1. MVP: Any active professional can view (will be tightened later)
 *   2. Production: Requires encounter or explicit share
 */
export async function canViewEHR(c: Context, patientId: string): Promise<boolean> {
  const user = c.get('user');

  if (!user) return false;

  // 1. Admin allows everything
  if (user.role === 'ADMIN') return true;

  // 2. Patient accessing own record
  // TODO: Implement Patient role
  /*
  if (user.role === 'PATIENT') {
    return user.id === patientId;
  }
  */

  // 3. Professional Rules (USER = Professional in current schema)
  if (user.role === 'USER') {
    // MVP: Allow any professional to view any patient's EHR
    // This enables the frontend integration without requiring encounter setup
    // TODO: Tighten this for production with encounter/share checks
    return true;
  }

  return false;
}

/**
 * Checks if the current user can edit the EHR (create events) for a patient.
 * Rules:
 * - Professional:
 *   1. MVP: Any active professional can edit (will be tightened later)
 *   2. Production: Requires active encounter or write share
 */
export async function canEditEHR(c: Context, patientId: string): Promise<boolean> {
  const user = c.get('user');

  if (!user) return false;

  // Only professionals can write (USER role)
  if (user.role !== 'USER' && user.role !== 'ADMIN') return false;

  // MVP: Allow any professional to write to any patient's EHR
  // TODO: Tighten with encounter/share checks for production
  return true;
}
