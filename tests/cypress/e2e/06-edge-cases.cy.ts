import {createTestPage, publishNode, siteKey} from '../support/bootstrap-icons'

const edgePage = 'page-edge-cases'
const edgePageUrl = `/cms/render/live/en/sites/${siteKey}/home/${edgePage}.html`

describe('Bootstrap Icons — Edge Cases', () => {
    before(() => {
        cy.login()
        createTestPage(edgePage)

        // Icon with no bootstrapIcon property (unset)
        cy.apollo({
            mutationFile: 'graphql/jcr/mutation/addNode.graphql',
            variables: {
                parentPathOrId: `/sites/${siteKey}/home/${edgePage}/pagecontent`,
                name: 'icon-missing-name',
                primaryNodeType: 'bootstrapiconsnt:icon',
                properties: [
                    {name: 'usage', value: 'embedded'},
                    {name: 'decorative', value: 'false'}
                ]
            }
        })

        // Icon with a name that matches no bundled SVG file
        cy.apollo({
            mutationFile: 'graphql/jcr/mutation/addNode.graphql',
            variables: {
                parentPathOrId: `/sites/${siteKey}/home/${edgePage}/pagecontent`,
                name: 'icon-unknown-name',
                primaryNodeType: 'bootstrapiconsnt:icon',
                properties: [
                    {name: 'bootstrapIcon', value: 'this-icon-does-not-exist'},
                    {name: 'usage', value: 'embedded'},
                    {name: 'decorative', value: 'false'}
                ]
            }
        })

        // Icon-font usage with no bootstrapIcon selected
        cy.apollo({
            mutationFile: 'graphql/jcr/mutation/addNode.graphql',
            variables: {
                parentPathOrId: `/sites/${siteKey}/home/${edgePage}/pagecontent`,
                name: 'icon-font-no-name',
                primaryNodeType: 'bootstrapiconsnt:icon',
                properties: [
                    {name: 'usage', value: 'icon-font'},
                    {name: 'decorative', value: 'false'}
                ]
            }
        })

        // Sprite usage with no bootstrapIcon selected
        cy.apollo({
            mutationFile: 'graphql/jcr/mutation/addNode.graphql',
            variables: {
                parentPathOrId: `/sites/${siteKey}/home/${edgePage}/pagecontent`,
                name: 'icon-sprite-no-name',
                primaryNodeType: 'bootstrapiconsnt:icon',
                properties: [
                    {name: 'usage', value: 'sprite'},
                    {name: 'decorative', value: 'false'}
                ]
            }
        })

        publishNode(`/sites/${siteKey}/home/${edgePage}`, {languages: ['en']})
    })

    it('page returns 200 when bootstrapIcon is unset (embedded)', () => {
        cy.request({url: edgePageUrl, failOnStatusCode: false})
            .its('status').should('eq', 200)
    })

    it('no exception or error message exposed in live mode when icon name is missing', () => {
        cy.visit(edgePageUrl)
        cy.get('body').should('not.contain', 'Unexpected error')
        cy.get('body').should('not.contain', 'Exception')
        cy.get('body').should('not.contain', 'NullPointerException')
    })

    it('unknown icon name renders empty — no broken img tag', () => {
        cy.visit(edgePageUrl)
        cy.get('img[src*="this-icon-does-not-exist"]').should('not.exist')
    })

    it('unknown icon name does not expose error to visitors', () => {
        cy.visit(edgePageUrl)
        cy.get('body').should('not.contain', 'Unexpected error')
        cy.get('body').should('not.contain', 'Could not get SVG')
    })

    it('icon-font with no icon name renders without 500', () => {
        cy.request({url: edgePageUrl, failOnStatusCode: false})
            .its('status').should('eq', 200)
    })

    it('icon-font with no icon name does not emit class="bi-" with empty suffix', () => {
        cy.visit(edgePageUrl)
        cy.get('body').then($body => {
            expect($body.html()).not.to.match(/class="bi- "/)
        })
    })
})
