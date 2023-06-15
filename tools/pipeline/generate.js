const { writeFileSync } = require('fs');

const createStages = () => `
stages:
  - build
  - deploy
`;

const createEmptyJob = (app) => `
build:empty:
  stage: build
  extends: .base
  script:
    - echo 'No apps affected!'
`;

const createJob = (app) => `
build:${app}:
  stage: build
  extends: .base
  script:
    - npx nx build --project ${app}
  artifacts:
    paths:
      - 'dist/apps/${app}'
    when: on_success
    expire_in: '1 day'

build:${app}:image:
  extends: .docker-build
  variables:
    IMAGE_PATH: $DVB_DOCKER_REGISTRY/$CI_PROJECT_ROOT_NAMESPACE/stip/${app}:$CI_COMMIT_SHORT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
    - if: $CI_COMMIT_BRANCH
      variables:
        KANIKO_ARGS: '--no-push'
  needs:
    - job: build:gesuch-app
      artifacts: true

deploy:${app}:
  stage: deploy
  image: '$DVB_DOCKER_REGISTRY/devops/docker/tools/k8s/main'
  tags: [ 'os:linux', 'type:docker', 'zone:tz' ]
  variables:
    STAGE: dev
    IMAGE_PATH: $DVB_DOCKER_REGISTRY/$CI_PROJECT_ROOT_NAMESPACE/stip/${app}:$CI_COMMIT_SHORT_SHA
  script:
    - git fetch origin $CI_COMMIT_BRANCH
    - cd deploy/$STAGE
    - kustomize edit set image $IMAGE
    - 'git commit --no-verify -a -m "ci($STAGE): deploy image $IMAGE_PATH [ci skip]"'
    - git push -o ci.skip https://deploy:$DEPLOYMENT_TOKEN@github.com/dvbern/stip-frontend.git HEAD:$CI_COMMIT_BRANCH
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
`;

const createPiplineFile = (projects) => {
  if (!projects.length) {
    return createStages().concat(createEmptyJob());
  }

  return createStages().concat(projects.map(createJob).join('\n'));
};

const createPipeline = () => {
  const [stringifiedAffected] = process.argv.slice(2);

  const { projects } = JSON.parse(stringifiedAffected);

  const content = createPiplineFile(projects);

  writeFileSync('affected-apps.gitlab-ci.yml', content);
};

createPipeline();
