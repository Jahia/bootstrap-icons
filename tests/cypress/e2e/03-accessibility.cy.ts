import {pageUrl, testIconLabel} from '../support/bootstrap-icons'

describe('Bootstrap Icons — Accessibility (WCAG 2.1 AA)', () => {

    context('Informative icons (decorative=false) — 1.1.1 Non-text Content', () => {
        context('Embedded SVG', () => {
            it('has role="img"', () => {
                cy.request(pageUrl('page-informative')).its('body')
                    .should('contain', 'role="img"')
            })

            it(`has aria-label="${testIconLabel}"`, () => {
                cy.request(pageUrl('page-informative')).its('body')
                    .should('contain', `aria-label="${testIconLabel}"`)
            })

            it('does not have aria-hidden', () => {
                cy.visit(pageUrl('page-informative'))
                cy.get('svg.bi-arrow-left').should('not.have.attr', 'aria-hidden')
            })
        })

        context('Sprite SVG', () => {
            it('has role="img"', () => {
                cy.visit(pageUrl('page-informative'))
                cy.get('svg.bi').should('have.attr', 'role', 'img')
            })

            it(`has aria-label="${testIconLabel}"`, () => {
                cy.visit(pageUrl('page-informative'))
                cy.get('svg.bi').should('have.attr', 'aria-label', testIconLabel)
            })
        })

        context('External image', () => {
            it(`has non-empty alt="${testIconLabel}"`, () => {
                cy.visit(pageUrl('page-informative'))
                cy.get('img[src*="arrow-left"]').should('have.attr', 'alt', testIconLabel)
            })

            it('alt is not the raw icon filename', () => {
                cy.visit(pageUrl('page-informative'))
                cy.get('img[src*="arrow-left"]')
                    .invoke('attr', 'alt')
                    .should('not.equal', 'arrow-left')
            })
        })

        context('Icon font', () => {
            it('has role="img"', () => {
                cy.visit(pageUrl('page-informative'))
                cy.get('i.bi-arrow-left').should('have.attr', 'role', 'img')
            })

            it(`has aria-label="${testIconLabel}"`, () => {
                cy.visit(pageUrl('page-informative'))
                cy.get('i.bi-arrow-left').should('have.attr', 'aria-label', testIconLabel)
            })

            it('does not have aria-hidden', () => {
                cy.visit(pageUrl('page-informative'))
                cy.get('i.bi-arrow-left').should('not.have.attr', 'aria-hidden')
            })
        })
    })

    context('Decorative icons (decorative=true) — 1.1.1 Non-text Content', () => {
        context('Embedded SVG', () => {
            it('has aria-hidden="true"', () => {
                cy.visit(pageUrl('page-decorative'))
                cy.get('svg.bi-arrow-left').should('have.attr', 'aria-hidden', 'true')
            })

            it('has focusable="false"', () => {
                cy.visit(pageUrl('page-decorative'))
                cy.get('svg.bi-arrow-left').should('have.attr', 'focusable', 'false')
            })

            it('does not have role="img"', () => {
                cy.visit(pageUrl('page-decorative'))
                cy.get('svg.bi-arrow-left').should('not.have.attr', 'role')
            })
        })

        context('Sprite SVG', () => {
            it('has aria-hidden="true"', () => {
                cy.visit(pageUrl('page-decorative'))
                cy.get('svg.bi').should('have.attr', 'aria-hidden', 'true')
            })

            it('has focusable="false"', () => {
                cy.visit(pageUrl('page-decorative'))
                cy.get('svg.bi').should('have.attr', 'focusable', 'false')
            })
        })

        context('External image', () => {
            it('has alt="" (empty string)', () => {
                cy.visit(pageUrl('page-decorative'))
                cy.get('img[src*="arrow-left"]').should('have.attr', 'alt', '')
            })
        })

        context('Icon font', () => {
            it('has aria-hidden="true"', () => {
                cy.visit(pageUrl('page-decorative'))
                cy.get('i.bi-arrow-left').should('have.attr', 'aria-hidden', 'true')
            })

            it('has focusable="false"', () => {
                cy.visit(pageUrl('page-decorative'))
                cy.get('i.bi-arrow-left').should('have.attr', 'focusable', 'false')
            })

            it('does not have role="img"', () => {
                cy.visit(pageUrl('page-decorative'))
                cy.get('i.bi-arrow-left').should('not.have.attr', 'role')
            })
        })
    })
})
