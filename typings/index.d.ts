declare type Options = { port: number, manifest: string }
declare interface Source {
  source();
  size(): number;
  map(options: object): void;
  sourceAndMap(options: object): object;
  node();
  listNode();
  updateHash(hash: string): void;
}
declare module "raw-loader*" {
  const str: string;
  export = str;
}
declare type Socket = {
  text(string: string): any
}

declare type Manifest = { 
 // https://developer.chrome.com/extensions/manifest/manifest_version
 manifest_version: number,
 // https://developer.chrome.com/extensions/manifest/name#name
 name: string,
 // https://developer.chrome.com/extensions/manifest/version
 version: string,
 // https://developer.chrome.com/extensions/manifest/default_locale
 default_locale: string,
 // https://developer.chrome.com/extensions/manifest/description
 description: string,
 // https://developer.chrome.com/extensions/manifest/icons
 icons:{ [key: number]: string; },
 // https://developer.chrome.com/extensions/browserAction
 browser_action: {
  default_icon: object | string    // optional
  default_title: string,  // optional; shown in tooltip
  default_popup: string   // optional
 },
 // https://developer.chrome.com/extensions/pageAction
 page_action: {
  default_icon: object | string    // optional
  default_title: string,  // optional; shown in tooltip
  default_popup: string   // optional
 },
 // ?
 author: string
 // https://developer.chrome.com/extensions/automation
 automation: any
 // https://developer.chrome.com/extensions/background_pages
 background: {
    // https://developer.chrome.com/extensions/event_pages
   persistent?: boolean
   scripts?: Array<string>
   page?: string
 },
 // ?
 background_page: string
 // https://developer.chrome.com/extensions/settings_override
 chrome_settings_overrides: {
  homepage: string,
  search_provider: {
      name: string,
      keyword: string,
      search_url: string,
      favicon_url: string,
      suggest_url: string,
      instant_url: string,
      image_url: string,
      search_url_post_params: string,
      suggest_url_post_params: string,
      instant_url_post_params: string,
      image_url_post_params: string,
      alternate_urls: Array<string>,
      encoding: string,
      is_default: boolean
  },
  startup_pages:  Array<string>
 },
 // https://developer.chrome.com/extensions/ui_override
 chrome_ui_overrides: {
   bookmarks_ui: {
    remove_bookmark_shortcut: boolean,
    remove_button: boolean
   }
 },
 // https://developer.chrome.com/extensions/override
 chrome_url_overrides: {
  pageToOverride: string
 },
// https://developer.chrome.com/extensions/commands
 commands: {
  description: string,
  global: boolean
  "toggle-feature-foo": {
    suggested_key: {
      default: string,
      mac: string
    },
    description: string
  },
  _execute_browser_action: {
    suggested_key: {
      windows: string,
      mac: string,
      chromeos: string,
      linux: string
    }
  },
  _execute_page_action: {
    suggested_key: {
      default: string,
      windows: string,
      mac: string
    }
  }
 },
 // ?
 content_capabilities: string
 // https://developer.chrome.com/extensions/content_scripts
 content_scripts: Array<{
  run_at:string,
  js: Array<string>,
  css: Array<string>,
  matches:Array<string>,
  match_about_blank: boolean,
  exclude_globs:Array<string>,
  include_globs:Array<string>,
  exclude_matches:Array<string>,
  all_frames: boolean
 }>,
 // https://developer.chrome.com/extensions/contentSecurityPolicy
 content_security_policy: string,
 // ?
 converted_from_user_script: string,
 // ?
 current_locale: string,
 // ?
 declarative_net_request: string,
 // https://developer.chrome.com/extensions/devtools
 devtools_page: string,
 // https://developer.chrome.com/extensions/manifest/event_rules
 event_rules: Array<{
  event: string,
  actions: Array<{type:string}>
  conditions: Array<{
    type: string,
    css: Array<string>
  }>
 }>,
 // https://developer.chrome.com/extensions/manifest/externally_connectable
 externally_connectable: {
    ids: Array<string> 
    matches: Array<string>
    accepts_tls_channel_id:boolean
 },
 // https://developer.chrome.com/extensions/fileBrowserHandler
 file_browser_handlers: Array<{
  id: string,
  default_title: string, // What the button will display
  file_filters: Array<string> // To match all files, use "filesystem:*.*"
 }>,
 // https://developer.chrome.com/extensions/fileSystemProvider
 file_system_provider_capabilities: {
    watchable: boolean,
    configurable: boolean,
    multiple_mounts: boolean,
    source: string
 },
 // https://developer.chrome.com/extensions/manifest/homepage_url
 homepage_url: string,
 // https://developer.chrome.com/extensions/shared_modules
 import: Array<{id:string}>,
 // https://developer.chrome.com/extensions/manifest/incognito
 incognito: string,
 // ?
 input_components: string,
 // https://developer.chrome.com/extensions/manifest/key
 key: string,
 // https://developer.chrome.com/extensions/manifest/minimum_chrome_version
 minimum_chrome_version: string,
 // https://developer.chrome.com/extensions/manifest/nacl_modules
 nacl_modules: Array<{
  path:string, 
  mime_type: string
 }>,
 // ?
 oauth2: object,
 // https://developer.chrome.com/extensions/manifest/offline_enabled
 offline_enabled: boolean,
 // https://developer.chrome.com/extensions/omnibox
 omnibox: {
  keyword: string
 },
 // https://developer.chrome.com/extensions/permissions
 optional_permissions: Array<string>,
 // https://developer.chrome.com/extensions/options
 options_page: string,
 // https://developer.chrome.com/extensions/optionsV2
 options_ui: {
    // Required.
    page: string,
    // Recommended.
    chrome_style: boolean,
    // Not recommended; only provided for backwards compatibility,
    // and will be unsupported in a future version of Chrome (TBD).
    open_in_tab: boolean
 },
 // https://developer.chrome.com/extensions/declare_permissions
 permissions: Array<string>,
 // ?
 platforms: string,
 // https://developer.chrome.com/extensions/npapi
 plugins: Array<{path:string}>,
 // https://developer.chrome.com/extensions/manifest/requirements
 requirements: object,
 // https://developer.chrome.com/extensions/manifest/sandbox
 sandbox: Array<{
  pages: Array<string>,
   // content_security_policy is optional.
  content_security_policy: string

 }>,
 // https://developer.chrome.com/extensions/manifest/name#short_name
 short_name: string,
 // ?
 signature: string,
 // ?
 spellcheck: string,
 // https://developer.chrome.com/extensions/manifest/storage
 storage: {
  managed_schema: string
 },
  // ?
 system_indicator: string,
 // https://developer.chrome.com/extensions/ttsEngine
 tts_engine: {
  voices: Array<{
      voice_name: string,
      lang: string,
      gender: string,
      event_types: Array<string>
    }>
 },
 // https://developer.chrome.com/extensions/autoupdate
 update_url: string,
 // https://developer.chrome.com/extensions/manifest/version
 version_name: string,
 // https://developer.chrome.com/extensions/manifest/web_accessible_resources
 web_accessible_resources: Array<string>
}


