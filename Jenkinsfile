pipeline {
  agent any
  stages {
    stage('Verifying Build Environment') {
      steps {
        sh 'bash ./scripts/node.sh'
        sh 'bash ./scripts/chromium.sh'
        sh 'bash ./scripts/docker.sh'
      }
    }
    stage('Building frontend') {
      steps {
        sh 'bash ./scripts/frontend.sh'
      }
    }
    stage('Building backend') {
      steps {
        sh 'bash ./scripts/backend.sh'
      }
    }
    stage('Stopping docker containers') {
      steps {
        sh 'bash ./scripts/deploy/stop.sh'
      }
    }
    stage('Deploy frontend') {
//       when {
//         branch 'main'
//       }
      steps {
        sh 'export JENKINS_NODE_COOKIE=dontKillMe && bash ./scripts/deploy/frontend.sh'
      }
    }
//     stage('Deploy backend') {
// //       when {
// //         branch 'main'
// //       }
//       steps {
//         sh 'JENKINS_NODE_COOKIE=dontKillMe bash ./scripts/deploy/backend.sh'
//       }
//     }
  }
}
