# Before It Becomes Trash

Aplicacion web full-stack para decidir que hacer con objetos danados antes de desecharlos.

Stack principal:
- Next.js 14 (App Router) + TypeScript
- Auth0 (`@auth0/nextjs-auth0`)
- Gemini (`@google/generative-ai`)
- Supabase Postgres
- SQLite local fallback (`better-sqlite3`)
- Solana Devnet (`@solana/web3.js`)
- UI responsive con React + Tailwind CSS

## Flujo principal

1. El usuario inicia sesion con Auth0.
2. Registra objeto y contexto del dano.
3. Gemini entrega analisis estructurado.
4. Se persiste en Supabase (item + analisis + accion + badge).
5. Se intenta registrar constancia simbolica en Solana Devnet.
6. Se muestra historial personal y metricas reales.

## Requisitos previos

- Node.js 18+
- Proyecto Supabase
- Tenant Auth0
- API key de Gemini
- Wallet Solana Devnet (clave privada como arreglo JSON)

## Variables de entorno

1. Copia `.env.example` como `.env.local`.
2. Completa todos los valores.

## Esquema de base de datos

Ejecuta el contenido de `supabase/schema.sql` en SQL Editor de Supabase.

Tablas incluidas:
- `profiles`
- `items`
- `analyses`
- `rescue_actions`
- `badges`
- `blockchain_records`

## Ejecutar en local

1. `npm install`
2. `npm run dev`
3. abrir `http://localhost:3000`

## Verificar build

1. `npm run typecheck`
2. `npm run build`

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Configura todas las variables de entorno de `.env.example`.
4. Despliega.

Notas:
- El fallback SQLite es para respaldo local en desarrollo y no reemplaza la DB principal.
- En Vercel, la persistencia durable se realiza en Supabase.
