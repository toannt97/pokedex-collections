interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SPRITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
