
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
    'index.csr.html': {size: 34650, hash: '158ff48ef39f9d29680c88367b92c1ebb632429fa2a5859f81eae34e53ab41f8', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 22559, hash: '9243fc88780cf02737f9281256353236055fb45f402dad2413ac0cafca308946', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'TermsOfUse/index.html': {size: 51497, hash: 'd6ac4ea9aeed8bb442841ccbd08c1d04ae79a6dee1af0e6683ccbb1eb7e24ac1', text: () => import('./assets-chunks/TermsOfUse_index_html.mjs').then(m => m.default)},
    'index.html': {size: 67099, hash: '0139196e646574d7aab1a8bd0e84ccb3f832a23f4adf49fc1b73aa46deeea8b4', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'PrivacyPolicy/index.html': {size: 52228, hash: 'bb0011b6dd5c89c50405911b98124bc5d232085ea44500476b00008b2861b384', text: () => import('./assets-chunks/PrivacyPolicy_index_html.mjs').then(m => m.default)},
    'BookAppointment/index.html': {size: 64101, hash: '2f202bf64de18fa030ada2b17ba975679eacc6572bab1566cbee0f3958fb59f9', text: () => import('./assets-chunks/BookAppointment_index_html.mjs').then(m => m.default)},
    'styles-NO7Q5HVD.css': {size: 402076, hash: 'M2q4Ko1pwsw', text: () => import('./assets-chunks/styles-NO7Q5HVD_css.mjs').then(m => m.default)}
  },
};
