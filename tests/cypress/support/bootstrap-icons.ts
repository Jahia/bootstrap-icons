import {createSite as jahiaCreateSite, deleteSite as jahiaDeleteSite, enableModule} from '@jahia/cypress'

export const siteKey = 'bootstrapiconstest'
export const testIconName = 'arrow-left'
export const testIconLabel = 'Arrow left'

export const pageUrl = (pageName: string) =>
    `/cms/render/live/en/sites/${siteKey}/home/${pageName}.html`

export const deployEmptyTemplates = () => {
    const jahiaUrl = Cypress.env('JAHIA_URL') || 'http://localhost:8080'
    const password = Cypress.env('SUPER_USER_PASSWORD') || 'root1234'
    const jar = `${Cypress.config('projectRoot')}/cypress/fixtures/modules/empty-templates-1.0.0.jar`

    cy.exec(
        `curl -sf -u "root:${password}" ` +
        `-X POST "${jahiaUrl}/modules/api/provisioning" ` +
        `--form "script=[{\\"installAndStartBundle\\":\\"empty-templates-1.0.0.jar\\",\\"forceUpdate\\":false}]" ` +
        `--form "file=@${jar}"`,
        {timeout: 60000}
    ).its('code').should('eq', 0)
    cy.wait(3000)
}

export const deployBootstrapIconsModule = () => {
    const jahiaUrl = Cypress.env('JAHIA_URL') || 'http://localhost:8080'
    const password = Cypress.env('SUPER_USER_PASSWORD') || 'root1234'
    const targetDir = `${Cypress.config('projectRoot')}/../target`

    // Try local JAR first; fall back to Nexus snapshot if not built yet
    cy.exec(`ls "${targetDir}"/bootstrap-icons-*.jar 2>/dev/null | grep -v sources | head -1`, {
        failOnNonZeroExit: false
    }).then(result => {
        const jar = result.stdout.trim()
        if (jar) {
            const jarName = jar.split('/').pop()
            cy.exec(
                `curl -sf -u "root:${password}" ` +
                `-X POST "${jahiaUrl}/modules/api/provisioning" ` +
                `--form "script=[{\\"installAndStartBundle\\":\\"${jarName}\\",\\"forceUpdate\\":true,\\"uninstallPreviousVersion\\":true}]" ` +
                `--form "file=@${jar}"`,
                {timeout: 60000}
            )
        } else {
            cy.log('No local JAR found — installing bootstrap-icons from Nexus')
            cy.exec(
                `curl -sf -u "root:${password}" ` +
                `-X POST "${jahiaUrl}/modules/api/provisioning" ` +
                `-H "Content-Type: application/json" ` +
                `--data '[{"addMavenRepository":"https://devtools.jahia.com/nexus/content/groups/public@id=jahia-public"},{"installOrUpgradeBundle":"mvn:org.jahiacommunity.modules/bootstrap-icons","autoStart":true}]'`,
                {timeout: 120000}
            )
        }
    })
    cy.wait(5000)
}

export const createTestSite = () => {
    jahiaCreateSite(siteKey, {
        templateSet: 'empty-templates',
        serverName: 'localhost',
        locale: 'en'
    })
    enableModule('bootstrap-icons', siteKey)
}

export const deleteTestSite = () => {
    jahiaDeleteSite(siteKey)
}

export const createTestPage = (pageName: string) => {
    cy.apollo({
        mutationFile: 'graphql/jcr/mutation/addNode.graphql',
        variables: {
            parentPathOrId: `/sites/${siteKey}/home`,
            name: pageName,
            primaryNodeType: 'jnt:page',
            properties: [
                {name: 'jcr:title', value: pageName, language: 'en'},
                {name: 'j:templateName', value: 'empty'}
            ],
            children: [{name: 'pagecontent', primaryNodeType: 'jnt:contentList'}]
        }
    })
}

export const createIconNode = (pageName: string, nodeName: string, usage: string, decorative = false) => {
    cy.apollo({
        mutationFile: 'graphql/jcr/mutation/addNode.graphql',
        variables: {
            parentPathOrId: `/sites/${siteKey}/home/${pageName}/pagecontent`,
            name: nodeName,
            primaryNodeType: 'bootstrapiconsnt:icon',
            properties: [
                {name: 'bootstrapIcon', value: testIconName},
                {name: 'usage', value: usage},
                {name: 'decorative', value: String(decorative)}
            ]
        }
    })
}

export const publishNode = (pathOrId: string, options: {includeSubTree?: boolean; waitMs?: number} = {}) => {
    cy.apollo({
        mutationFile: 'graphql/jcr/mutation/publishNode.graphql',
        variables: {
            pathOrId,
            languages: ['en'],
            publishSubNodes: true,
            includeSubTree: options.includeSubTree ?? true
        }
    })
    cy.wait(options.waitMs ?? 3000)
}

export const flushHtmlCache = () => {
    cy.executeGroovy('groovy/bootstrap-icons/flushHtmlCache.groovy')
}
