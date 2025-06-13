
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/ND-Diagnostics/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/ND-Diagnostics"
  },
  {
    "renderMode": 2,
    "route": "/ND-Diagnostics/BookAppointment"
  },
  {
    "renderMode": 2,
    "route": "/ND-Diagnostics/TermsOfUse"
  },
  {
    "renderMode": 2,
    "route": "/ND-Diagnostics/PrivacyPolicy"
  },
  {
    "renderMode": 2,
    "redirectTo": "/ND-Diagnostics",
    "route": "/ND-Diagnostics/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 34650, hash: '0679957ba5b4a0647801d2f71027266d5d0c6c3706e5abd10d7e0269787ae8d0', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 22559, hash: '7e3332c2c051ccacd754034f4e549e00d83ac44ed15c69799ed7eb04b1d1cc94', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 67904, hash: '61984151b4547ccce4a99496a51c223edef3680bf724ae4631131364b12385a6', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'TermsOfUse/index.html': {size: 56129, hash: '14a17f88e5faf3f0b9a5f0cb58629dba82374fe7b8bdc254b86441f719043873', text: () => import('./assets-chunks/TermsOfUse_index_html.mjs').then(m => m.default)},
    'PrivacyPolicy/index.html': {size: 57733, hash: '75b6e59891443b5840ac4cf09232b6764a15e2c91f0f41f2e0f9d43efb0c5d5c', text: () => import('./assets-chunks/PrivacyPolicy_index_html.mjs').then(m => m.default)},
    'BookAppointment/index.html': {size: 62892, hash: '079c057f4920f046822d36246bfaee6d46704cf0de6f1b27b8dcc2aefd90ed4e', text: () => import('./assets-chunks/BookAppointment_index_html.mjs').then(m => m.default)},
    'styles-NO7Q5HVD.css': {size: 402076, hash: 'M2q4Ko1pwsw', text: () => import('./assets-chunks/styles-NO7Q5HVD_css.mjs').then(m => m.default)}
  },
};
