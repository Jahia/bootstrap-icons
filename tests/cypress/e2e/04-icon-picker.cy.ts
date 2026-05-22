import {siteKey, pageUrl} from '../support/bootstrap-icons'

const editUrl = (nodePath: string) =>
    `/jahia/jcontent/${siteKey}/en/content-folders${nodePath}`

const iconNodePath = `/sites/${siteKey}/home/page-informative/pagecontent/icon-embedded`

describe('Bootstrap Icons — Icon Picker', () => {
    before(() => {
        cy.login()
    })

    context('Picker structure', () => {
        it('opens Content Editor with the BootstrapIconPicker for bootstrapIcon field', () => {
            cy.visit(editUrl(iconNodePath))
            cy.get('.bip-root', {timeout: 15000}).should('exist')
        })

        it('renders search input', () => {
            cy.get('.bip-search').should('be.visible')
            cy.get('.bip-search').invoke('attr', 'placeholder').should('match', /Search \d+ icons/)
        })

        it('renders category tabs including All', () => {
            cy.get('.bip-tabs').should('exist')
            cy.get('.bip-tab').should('have.length.greaterThan', 1)
            cy.get('.bip-tab').first().should('have.text', 'All')
        })

        it('renders icon grid with items', () => {
            cy.get('.bip-item').should('have.length.greaterThan', 10)
        })

        it('pre-selects the category of the existing icon value', () => {
            // icon-embedded node has bootstrapIcon=arrow-left → Arrows & Navigation
            cy.get('.bip-tab.active').should('not.have.text', 'All')
            cy.get('.bip-tab.active').invoke('text').should('match', /Arrow/i)
        })

        it('shows selected icon as highlighted', () => {
            cy.get('.bip-item.selected').should('exist')
        })
    })

    context('Search', () => {
        it('filters icons as user types', () => {
            cy.get('.bip-search').clear().type('alarm')
            cy.get('.bip-item').each($el => {
                cy.wrap($el).invoke('attr', 'title').should('include', 'alarm')
            })
        })

        it('switches active tab to All when typing', () => {
            cy.get('.bip-search').clear().type('arrow')
            cy.get('.bip-tab.active').should('have.text', 'All')
        })

        it('clears search and restores full grid', () => {
            cy.get('.bip-search').clear()
            cy.get('.bip-item').should('have.length.greaterThan', 100)
        })
    })

    context('Category tabs', () => {
        it('clicking a tab filters to that category only', () => {
            cy.get('.bip-tab').contains('Weather').click()
            cy.get('.bip-cat-label').should('have.length', 1)
            cy.get('.bip-cat-label').invoke('text').should('match', /Weather/i)
        })

        it('clicking All restores all categories', () => {
            cy.get('.bip-tab').first().click()
            cy.get('.bip-cat-label').should('have.length.greaterThan', 5)
        })
    })

    context('Icon selection', () => {
        it('clicking an icon updates the selected label', () => {
            cy.get('.bip-tab').first().click()
            cy.get('.bip-search').clear().type('sun')
            cy.get('.bip-item').first().then($item => {
                const name = $item.attr('title')
                cy.wrap($item).click()
                cy.get('.bip-bar').should('contain', 'Selected: ' + name)
                cy.get('.bip-item.selected').should('have.attr', 'title', name)
            })
        })

        it('clear button removes selection', () => {
            cy.get('.bip-clear').click()
            cy.get('.bip-bar').should('not.contain', 'Selected:')
            cy.get('.bip-item.selected').should('not.exist')
        })
    })
})
