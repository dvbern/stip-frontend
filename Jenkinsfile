pipeline {
    agent none

    options {
        skipDefaultCheckout()
        buildDiscarder(logRotator(numToKeepStr: "5", artifactNumToKeepStr: '1'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Sync') {
            agent {
                label 'unix'
            }
            steps {
                cleanWs()
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'jenkins-github-token', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_TOKEN']]) {
                    sh('git clone --mirror https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/dvbern/stip-frontend.git .')
                }
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'gitlab-kibon-stip-frontend', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_TOKEN']]) {
                    sh('git remote set-url --push origin https://${GIT_USERNAME}:${GIT_TOKEN}@gitlab.dvbern.ch/kibon/stip-frontend.git')
                    sh('git push --mirror')
                }
            }
        }
    }
}
