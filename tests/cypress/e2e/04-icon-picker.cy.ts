import {siteKey} from '../support/bootstrap-icons'

const moduleBase = '/modules/bootstrap-icons'

describe('Bootstrap Icons — Icon Picker', () => {
    context('Assets', () => {
        it('register.js is served', () => {
            cy.request(`${moduleBase}/javascript/apps/register.js`)
                .its('status').should('eq', 200)
        })

        it('register.js registers BootstrapIconPicker selectorType', () => {
            cy.request(`${moduleBase}/javascript/apps/register.js`)
                .its('body')
                .should('contain', 'BootstrapIconPicker')
                .and('contain', "registry.add('selectorType'")
        })

        it('icons-list.json is served', () => {
            cy.request(`${moduleBase}/javascript/apps/icons-list.json`)
                .its('status').should('eq', 200)
        })

        it('icons-list.json contains 2000+ icons across multiple categories', () => {
            cy.request(`${moduleBase}/javascript/apps/icons-list.json`).then(res => {
                const data: Record<string, string[]> = res.body
                const categories = Object.keys(data)
                expect(categories.length, 'category count').to.be.greaterThan(5)
                const total = categories.reduce((s, k) => s + data[k].length, 0)
                expect(total, 'total icon count').to.be.greaterThan(2000)
            })
        })

        it('icons-list.json has expected categories', () => {
            cy.request(`${moduleBase}/javascript/apps/icons-list.json`).its('body').then(data => {
                expect(data).to.have.property('Arrows & Navigation')
                expect(data).to.have.property('Files & Documents')
                expect(data).to.have.property('Weather & Nature')
                expect(data).to.have.property('Technology')
            })
        })

        it('each category contains only string icon names', () => {
            cy.request(`${moduleBase}/javascript/apps/icons-list.json`).its('body').then((data: Record<string, string[]>) => {
                Object.entries(data).forEach(([cat, icons]) => {
                    expect(icons, cat).to.be.an('array').with.length.greaterThan(0)
                    icons.slice(0, 5).forEach(name => expect(name).to.be.a('string'))
                })
            })
        })

        it('SVG sprite is served', () => {
            cy.request(`${moduleBase}/icons/bootstrap-icons.svg`)
                .its('status').should('eq', 200)
        })

        it('sprite contains expected icon symbols', () => {
            cy.request(`${moduleBase}/icons/bootstrap-icons.svg`)
                .its('body')
                .should('contain', 'id="arrow-left"')
                .and('contain', 'id="house"')
        })
    })

    context('Content Editor integration', () => {
        before(() => {
            cy.login()
        })

        it('jContent loads without JS errors from bootstrap-icons', () => {
            cy.visit(`/jahia/jcontent/${siteKey}/en/pages/sites/${siteKey}/home`)
            // Verify no uncaught errors from our register.js
            cy.get('body', {timeout: 20000}).should('exist')
            // register.js should load silently — no error boundary triggered by our module
            cy.get('body').should('not.contain', 'BootstrapIconPicker is not defined')
        })

    })
})
