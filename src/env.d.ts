/// <reference types="@hcaptcha/types"/>

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly H_CAPTCHA_SITEKEY: string;
  readonly H_CAPTCHA_SECRET_KEY: string;
  readonly HTTPS_ENABLED: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.astro" {
  import type { AstroComponentFactory } from "astro/runtime/server";
  const component: AstroComponentFactory;
  export default component;
}

declare namespace App {
  interface Locals {
    supabase: import("@supabase/supabase-js").SupabaseClient<
      import("./db/types.ts").Database
    >;
    headers: Headers;
    // session: import("./lib/server/session").Session | null;
  }
}
