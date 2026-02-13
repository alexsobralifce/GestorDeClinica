import { Hono } from 'hono';
import pool from '../db/connection';
import { authMiddleware } from '../middleware/auth';
import { canViewEHR, canEditEHR } from '../middleware/abac';
import { v4 as uuidv4 } from 'uuid';

const app = new Hono();

app.use('*', authMiddleware);

// POST /documents (Draft)
app.post('/', async (c) => {
  const user = c.get('user');
  const { event_id, template_id, content_html, type } = await c.req.json();

  // Validate permission (linked to event)
  // If event_id provided, check if user can edit that event/patient
  let patientId = null;
  if (event_id) {
    const eventRes = await pool.query('SELECT patient_id FROM ehr_events WHERE id = $1', [event_id]);
    if (eventRes.rows.length > 0) {
      patientId = eventRes.rows[0].patient_id;
      if (!await canEditEHR(c, patientId)) {
        return c.json({ error: 'Access Denied' }, 403);
      }
    }
  }

  try {
    const result = await pool.query(`
      INSERT INTO documents (
        event_id, content_html, status, created_at
      ) VALUES ($1, $2, 'draft', NOW())
      RETURNING id
    `, [event_id, content_html]);

    return c.json({ id: result.rows[0].id, status: 'draft' }, 201);
  } catch (err: any) {
    console.error('Error creating document:', err);
    return c.json({ error: err.message }, 500);
  }
});

// POST /documents/:id/sign
app.post('/:id/sign', async (c) => {
  const documentId = c.req.param('id');
  const user = c.get('user');
  const { certificate_token } = await c.req.json(); // For ICP-Brasil simulation

  try {
    const docRes = await pool.query('SELECT * FROM documents WHERE id = $1', [documentId]);
    if (docRes.rows.length === 0) return c.json({ error: 'Document not found' }, 404);
    const doc = docRes.rows[0];

    if (doc.status === 'signed') return c.json({ error: 'Document already signed' }, 400);

    // Get patient ID from event to check permission
    if (doc.event_id) {
      const eventRes = await pool.query('SELECT patient_id FROM ehr_events WHERE id = $1', [doc.event_id]);
      if (eventRes.rows.length > 0) {
        if (!await canEditEHR(c, eventRes.rows[0].patient_id)) {
          return c.json({ error: 'Access Denied' }, 403);
        }
      }
    }

    // Simulate Signature Process
    // 1. Generate hash of content
    const signatureData = `SIMULATED_SIGNATURE_${uuidv4()}_${user.id}`;

    await pool.query('BEGIN');

    // Update document status
    await pool.query(`
      UPDATE documents 
      SET status = 'signed' 
      WHERE id = $1
    `, [documentId]);

    // Record signature
    await pool.query(`
      INSERT INTO document_signatures (
        document_id, signer_id, signature_data, signed_at, certificate_info
      ) VALUES ($1, $2, $3, NOW(), $4)
    `, [
      documentId,
      user.id,
      signatureData,
      JSON.stringify({ issuer: 'ICP-Brasil Simulada', serial: '123456' })
    ]);

    // Audit
    await pool.query(
      `INSERT INTO audit_logs (actor_id, resource_id, resource_type, action, performed_at)
       VALUES ($1, $2, 'document', 'sign', NOW())`,
      [user.id, documentId]
    );

    await pool.query('COMMIT');
    return c.json({ status: 'signed', signature_id: signatureData });

  } catch (err: any) {
    await pool.query('ROLLBACK');
    console.error('Error signing document:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET /documents/:id
app.get('/:id', async (c) => {
  const documentId = c.req.param('id');
  try {
    const result = await pool.query(`
      SELECT d.*, ds.signed_at, ds.signer_id
      FROM documents d
      LEFT JOIN document_signatures ds ON d.id = ds.document_id
      WHERE d.id = $1
    `, [documentId]);

    if (result.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    return c.json(result.rows[0]);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;
