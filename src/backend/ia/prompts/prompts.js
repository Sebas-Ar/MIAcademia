import dbDescription from './dbDescription'

export const formatConfig = (config = { introduction: '', rules: [] }) => {
    const prompt = `
        <instructions>
            <introduction>${config.introduction}</introduction>
            <dbDescription>${dbDescription}</dbDescription>
            <rulesList>${formatRules(config.rules)}</rulesList>
        </instructions>
    `

    return replaceBreakLinesBySpaces(prompt)
}

// formatRules filters the rules that are enabled and returns a string with the rules in XML format
const formatRules = (rulesList) => {
    const rulesListFiltered = rulesList
        .filter(rule => rule.enabled)
        .map(rule => ({ rule: rule.rule }))

    const rulesListModified = rulesListFiltered
        .map(rule => `<rule>${rule.rule}</rule>`)
        .join('')

    return rulesListModified
}

// replaceBreakLinesBySpaces remove multiple spaces then remove extra spaces
const replaceBreakLinesBySpaces = (text) => {
    return text
        .replace(/[\r\n]/gm, ' ')
        .replace(/\s+/g, ' ')
}
