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
