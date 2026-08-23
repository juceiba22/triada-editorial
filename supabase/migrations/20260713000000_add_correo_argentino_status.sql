-- Add the correo_argentino_status column to the orders table
ALTER TABLE orders
ADD COLUMN correo_argentino_status text DEFAULT 'pending';

-- Add a comment explaining the purpose of the column
COMMENT ON COLUMN orders.correo_argentino_status IS 'Tracks the import status with MiCorreo API: pending, imported, or failed';
