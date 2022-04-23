pipeline {
  agent any
  stages {
    stage('Verifying Build Environment') {
      steps {
        sh 'bash ./scripts/node.sh'
        sh 'bash ./scripts/chromium.sh'
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
  }
}
