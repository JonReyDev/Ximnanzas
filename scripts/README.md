# Scripts operativos

## Restaurar una copia de seguridad de Supabase

El script `restore-supabase-backup.sh` acepta un volcado PostgreSQL sin comprimir (`.backup`) o comprimido con gzip (`.backup.gz`). No modifica el archivo original y elimina el temporal descomprimido al terminar.

1. Crea un proyecto nuevo en Supabase y restablece su contraseña de base de datos.
2. Obtén la cadena de conexión del pool de sesiones desde **Conectar > Método de sesión**.
3. Instala PostgreSQL para disponer de `psql`.
4. Ejecuta el script con la URL solo en la variable de entorno:

```sh
SUPABASE_DB_URL='postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres' \
  ./scripts/restore-supabase-backup.sh ./backup_name.backup.gz
```

No incluyas la URL, la contraseña ni el archivo de respaldo en commits o capturas. Los metadatos de Storage pueden restaurarse, pero los objetos almacenados en S3 deben migrarse por separado. Después de restaurar, vuelve a configurar Auth, claves API, Edge Functions, Realtime, extensiones y réplicas en el proyecto nuevo.

Si el proyecto o el ISP soporta IPv6, puedes usar la cadena de conexión directa de Supabase en lugar del pool de sesiones.
