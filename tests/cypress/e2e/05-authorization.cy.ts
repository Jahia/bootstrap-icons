import {pageUrl, siteKey} from '../support/bootstrap-icons'

describe('Bootstrap Icons — Authorization', () => {
    context('Live workspace — public access', () => {
        it('page-informative is accessible without login', () => {
            cy.request({url: pageUrl('page-informative'), failOnStatusCode: false})
                .its('status').should('eq', 200)
        })

        it('page-decorative is accessible without login', () => {
            cy.request({url: pageUrl('page-decorative'), failOnStatusCode: false})
                .its('status').should('eq', 200)
        })

        it('visiting live page does not redirect to login', () => {
            cy.visit(pageUrl('page-informative'))
            cy.url().should('not.include', '/login')
        })
    })

    context('Default workspace — protected', () => {
        it('unauthenticated request to default workspace is not openly accessible', () => {
            cy.request({
                url: `/cms/render/default/en/sites/${siteKey}/home/page-informative.html`,
                failOnStatusCode: false,
                followRedirect: false
            }).then(res => {
                // Jahia denies unauthenticated default workspace access:
                // 302/301 = redirect to login, 401/403 = explicit deny, 404 = path obscured
                expect(res.status, 'default workspace must not serve content to anonymous users').to.be.oneOf([301, 302, 401, 403, 404])
            })
        })
    })

    context('Admin access', () => {
        beforeEach(() => cy.login())
        afterEach(() => cy.logout())

        it('authenticated visit to default workspace succeeds', () => {
            cy.visit(`/cms/render/default/en/sites/${siteKey}/home/page-informative.html`)
            cy.url().should('not.include', '/login')
            cy.get('body').should('be.visible')
        })

        it('admin can access jcontent for the site', () => {
            cy.visit(`/jahia/jcontent/${siteKey}/en/pages`)
            cy.get('body').should('be.visible')
            cy.url().should('not.include', '/login')
        })
    })
})
