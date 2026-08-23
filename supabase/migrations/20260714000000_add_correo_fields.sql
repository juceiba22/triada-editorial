-- Agregamos las nuevas columnas para soportar la integración completa con API MiCorreo
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS correo_tracking varchar(255),
ADD COLUMN IF NOT EXISTS correo_status varchar(255) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS correo_order varchar(255),
ADD COLUMN IF NOT EXISTS correo_service varchar(255),
ADD COLUMN IF NOT EXISTS correo_price numeric(10,2),
ADD COLUMN IF NOT EXISTS correo_delivery_type char(1),
ADD COLUMN IF NOT EXISTS correo_agency varchar(255),
ADD COLUMN IF NOT EXISTS correo_imported boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS correo_response jsonb;

COMMENT ON COLUMN orders.correo_tracking IS 'Número de seguimiento de Correo Argentino';
COMMENT ON COLUMN orders.correo_status IS 'Estado del envío según API MiCorreo (e.g. EN VIAJE, ENTREGADO)';
COMMENT ON COLUMN orders.correo_order IS 'ID de orden externa asignada en Correo Argentino';
COMMENT ON COLUMN orders.correo_service IS 'Servicio utilizado (ej. Correo Argentino Clásico)';
COMMENT ON COLUMN orders.correo_price IS 'Costo de envío cotizado y cobrado';
COMMENT ON COLUMN orders.correo_delivery_type IS 'D para Domicilio, S para Sucursal';
COMMENT ON COLUMN orders.correo_agency IS 'Código de agencia/sucursal si el tipo es S';
COMMENT ON COLUMN orders.correo_imported IS 'Indica si el envío ya fue importado exitosamente a MiCorreo';
COMMENT ON COLUMN orders.correo_response IS 'Copia íntegra de la respuesta JSON del import de MiCorreo';
