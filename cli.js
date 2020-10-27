#!/usr/bin/env node

const program = require('commander')
const main = require('.');
var pjson = require('./package.json');

program
    .version(pjson.version)
    .option('--url <url>', 'JIRA URL')
    .option('--username <username>', 'JIRA username')
    .option('--password <password>', 'JIRA password')
    .option('--releasedCommit <releasedCommit>', 'Commit id')
    .option('--targetCommit <targetCommit>', 'Commit id')
    .option('--repoPath <repoPath>', 'Path to git repo')
    .parse(process.argv);

if (!program.url ||
    !program.username ||
    !program.password ||
    !program.releasedCommit ||
    !program.targetCommit
) {
    program.help();
}

((async () => {
    try {
        await main({
            url: program.url,
            username: program.username,
            password: program.password,
            releasedCommit: program.releasedCommit,
            targetCommit: program.targetCommit,
            repoPath: program.repoPath || process.cwd()
        });
    }catch(e) {
        console.error(e);
        process.exit(1);
    }
})())