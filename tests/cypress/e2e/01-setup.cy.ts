import {
    deployEmptyTemplates,
    deployBootstrapIconsModule,
    createTestSite,
    deleteTestSite,
    createTestPage,
    createIconNode,
    publishNode,
    pageUrl,
    siteKey
} from '../support/bootstrap-icons'

const usages = ['embedded', 'sprite', 'external-image', 'icon-font'] as const

describe('Bootstrap Icons — Setup', () => {
    before(() => {
        cy.login()
        deployEmptyTemplates()
        deployBootstrapIconsModule()
        deleteTestSite()
        createTestSite()
        cy.wait(2000)

        createTestPage('page-informative')
        usages.forEach(usage => createIconNode('page-informative', `icon-${usage}`, usage, false))

        createTestPage('page-decorative')
        usages.forEach(usage => createIconNode('page-decorative', `icon-${usage}`, usage, true))

        publishNode(`/sites/${siteKey}/home`, {includeSubTree: true, waitMs: 5000})
    })

    it('bootstrap-icons module is deployed and started', () => {
        cy.apollo({
            queryFile: 'graphql/jcr/query/getStartedModulesVersion.graphql'
        }).then((resp: any) => {
            const modules: any[] = resp?.data?.dashboard?.modules ?? []
            const mod = modules.find((m: any) => m.id === 'bootstrap-icons')
            expect(mod, 'bootstrap-icons module not found — check module deployment step').to.exist
        })
    })

    it('page-informative is accessible in live mode', () => {
        cy.request({url: pageUrl('page-informative'), failOnStatusCode: false})
            .its('status').should('eq', 200)
    })

    it('page-informative contains rendered content', () => {
        cy.request(pageUrl('page-informative')).its('body').should('contain', '</body>')
    })

    it('page-decorative is accessible in live mode', () => {
        cy.request({url: pageUrl('page-decorative'), failOnStatusCode: false})
            .its('status').should('eq', 200)
    })
})
