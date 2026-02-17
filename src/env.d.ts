interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.astro" {
  import type { AstroComponentFactory } from "astro/runtime/server";
  const component: AstroComponentFactory;
  export default component;
}
