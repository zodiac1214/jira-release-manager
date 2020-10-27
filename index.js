const JiraApi = require('jira-client');
const { execFileSync } = require('child_process')


module.exports = async ({ url, username, password, releasedCommit, targetCommit, repoPath }) => {
    const jira = new JiraApi({
        protocol: url.split(":")[0],
        host: url.split("://")[1],
        username: username,
        password: password,
        strictSSL: false
    });

    const commitMessages = execFileSync('git', ["log", "--pretty=oneline", `${releasedCommit}...${targetCommit}`], { cwd: repoPath }).toString('utf8')
    const temp = commitMessages.match(/MNS\-[0-9]*/g)
    const jiraTicketNumbers = [...new Set(temp)]
    const promises = []
    let results = []
    for (jiraTicketNumber of jiraTicketNumbers) {
        try {
            const res = await jira.getIssue(jiraTicketNumber, ["summary", "status"])
            results.push({key: res.key, summary: res.fields.summary, status: res.fields.status.name})
        } catch (e) {
            
        }
    }
    results = results.sort((a, b) => a.status.localeCompare(b.status))
    console.table(results)
    
    
}