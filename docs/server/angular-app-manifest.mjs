
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
    'index.csr.html': {size: 34650, hash: '1a45955c17122d815914327eb1b514883aede3ab3921cd4d19c353f551bd837d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 22559, hash: '378431c99bc2c0ef92db87abd6f719b1bc7240f72d612930be1c574052623676', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 68976, hash: '271f90c2b6341ea49d133d8646fdb8c0e925ff5fe46db90ca5e27dd634bb603c', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'TermsOfUse/index.html': {size: 50278, hash: '79061df92ce3cdb3a692e152aeff77b133a86e9ee6028b449a4a7fac902085d8', text: () => import('./assets-chunks/TermsOfUse_index_html.mjs').then(m => m.default)},
    'PrivacyPolicy/index.html': {size: 51930, hash: '516c8ac5ea9237a66160049361785abd7b7f33bc100ce6859e7533b23fc3e5f4', text: () => import('./assets-chunks/PrivacyPolicy_index_html.mjs').then(m => m.default)},
    'BookAppointment/index.html': {size: 64101, hash: '516e4d64e0fc30cbc352ac508a2ad03fba4dcefcad4bc67365e8e9a651c997fd', text: () => import('./assets-chunks/BookAppointment_index_html.mjs').then(m => m.default)},
    'styles-NO7Q5HVD.css': {size: 402076, hash: 'M2q4Ko1pwsw', text: () => import('./assets-chunks/styles-NO7Q5HVD_css.mjs').then(m => m.default)}
  },
};
