// eslint-disable-next-line @typescript-eslint/no-var-requires
require('cypress-terminal-report/src/installLogsCollector')()
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@jahia/cypress/dist/support/registerSupport').registerSupport()
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('cypress-wait-until')

Cypress.on('uncaught:exception', () => false)

if (Cypress.browser.family === 'chromium') {
    Cypress.automation('remote:debugger:protocol', {command: 'Network.enable', params: {}})
    Cypress.automation('remote:debugger:protocol', {command: 'Network.setCacheDisabled', params: {cacheDisabled: true}})
}
