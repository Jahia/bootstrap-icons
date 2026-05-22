import {pageUrl, testIconName} from '../support/bootstrap-icons'

describe('Bootstrap Icons — Render', () => {
    context('Embedded SVG', () => {
        it('renders an inline <svg> element', () => {
            cy.request(pageUrl('page-informative')).its('body')
                .should('contain', '<svg')
        })

        it('SVG carries the Bootstrap Icons class', () => {
            cy.request(pageUrl('page-informative')).its('body')
                .should('contain', `bi-${testIconName}`)
        })

        it('SVG has a viewBox attribute', () => {
            cy.request(pageUrl('page-informative')).its('body')
                .should('match', /viewbox="0 0 16 16"/i)
        })

        it('SVG uses fill="currentColor" for theme inheritance', () => {
            cy.request(pageUrl('page-informative')).its('body')
                .should('contain', 'fill="currentColor"')
        })
    })

    context('Sprite', () => {
        it('renders an <svg> with a <use> reference to the sprite', () => {
            cy.request(pageUrl('page-informative')).its('body')
                .should('contain', 'bootstrap-icons.svg')
                .and('contain', `#${testIconName}`)
        })

        it('<svg> carries the bi class', () => {
            cy.request(pageUrl('page-informative')).its('body')
                .should('contain', 'class="bi"')
        })
    })

    context('External image', () => {
        it('renders an <img> tag', () => {
            cy.request(pageUrl('page-informative')).its('body')
                .should('contain', '<img')
        })

        it('<img> src points to the SVG file', () => {
            cy.request(pageUrl('page-informative')).its('body')
                .should('contain', `${testIconName}.svg`)
        })
    })

    context('Icon font', () => {
        it('renders an <i> tag with the correct class', () => {
            cy.request(pageUrl('page-informative')).its('body')
                .should('contain', `class="bi-${testIconName}"`)
        })

        it('bootstrap-icons CSS rules are delivered (direct link or aggregated bundle)', () => {
            cy.visit(pageUrl('page-informative'))
            cy.get('link[rel="stylesheet"]').first().invoke('attr', 'href').then(href => {
                cy.request(href as string).then(res => {
                    expect(res.status).to.eq(200)
                    expect(res.body, 'aggregated CSS bundle should contain bootstrap-icons font-face rule').to.match(/bi-arrow-left|bootstrap-icons/)
                })
            })
        })
    })
})
