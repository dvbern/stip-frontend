const { writeFileSync, readFileSync } = require('fs');
const handlebars = require('handlebars');

const templatePipeline = () => {
  const [stringifiedAffected] = process.argv.slice(2);

  const projects = stringifiedAffected.split('\n');

  const source = readFileSync(
    '.gitlab/affected-apps.gitlab-ci.template.yml'
  ).toString();
  const template = handlebars.compile(source);

  const contents = template({ projects });
  writeFileSync(`affected-apps.gitlab-ci.yml`, contents);
};

templatePipeline();
