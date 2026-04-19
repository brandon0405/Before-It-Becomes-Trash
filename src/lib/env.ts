import { z } from "zod";

const envSchema = z.object({
  APP_BASE_URL: z.string().url(),
  AUTH0_SECRET: z.string().min(16),
  AUTH0_BASE_URL: z.string().url(),
  AUTH0_DOMAIN: z.string().min(1),
  AUTH0_CLIENT_ID: z.string().min(1),
  AUTH0_CLIENT_SECRET: z.string().min(1),
  AUTH0_AUDIENCE: z.string().optional(),
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().default("gemini-1.5-flash"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SQLITE_BACKUP_PATH: z.string().default("./.data/local-backup.db"),
  SQLITE_BACKUP_ENABLED: z.enum(["true", "false"]).default("true"),
  SOLANA_NETWORK: z.string().default("devnet"),
  SOLANA_PRIVATE_KEY_JSON: z.string().optional(),
});

type RuntimeEnv = z.infer<typeof envSchema> & {
  sqliteBackupEnabled: boolean;
};

let cachedEnv: RuntimeEnv | null = null;

export function getEnv(): RuntimeEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse({
    APP_BASE_URL: process.env.APP_BASE_URL,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SQLITE_BACKUP_PATH: process.env.SQLITE_BACKUP_PATH,
    SQLITE_BACKUP_ENABLED: process.env.SQLITE_BACKUP_ENABLED,
    SOLANA_NETWORK: process.env.SOLANA_NETWORK,
    SOLANA_PRIVATE_KEY_JSON: process.env.SOLANA_PRIVATE_KEY_JSON,
  });

  if (!parsed.success) {
    const reason = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid environment configuration: ${reason}`);
  }

  cachedEnv = {
    ...parsed.data,
    sqliteBackupEnabled: parsed.data.SQLITE_BACKUP_ENABLED === "true",
  };

  return cachedEnv;
}
