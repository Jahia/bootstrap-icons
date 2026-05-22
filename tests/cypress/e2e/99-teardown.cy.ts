import {deleteTestSite} from '../support/bootstrap-icons'

describe('Bootstrap Icons — Teardown', () => {
    it('deletes the test site', () => {
        cy.login()
        deleteTestSite()
    })
})
