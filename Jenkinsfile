pipeline {
  agent any
  stages {
    stage('Verifying Build Environment') {
      steps {
        sh 'bash ./scripts/node.sh'
        sh 'bash ./scripts/chromium.sh'
        sh 'bash ./scripts/docker.sh'
        sh 'bash ./scripts/golang.sh'
      }
    }
    stage('Building Protobuf') {
      steps {
        sh 'bash ./scripts/protobuf.sh'
      }
    }
    stage('Bulding all the stuff') {
        parallel {
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
          stage('Building realtime') {
            steps {
              sh 'bash ./scripts/realtime.sh'
            }
          }
        }
    }
    stage('Stopping docker containers') {
      when {
        branch 'main'
      }
      steps {
        sh 'bash ./scripts/deploy/stop.sh'
      }
    }

    stage('Building Images') {
      parallel {
        stage('Building frontend image') {
          when {
            branch 'main'
          }
          steps {
            sh 'export JENKINS_NODE_COOKIE=dontKillMe && bash ./scripts/deploy/frontend.sh'
          }
        }
        stage('Building backend image') {
          when {
            branch 'main'
          }
          steps {
            sh 'export JENKINS_NODE_COOKIE=dontKillMe && bash ./scripts/deploy/backend.sh'
          }
        }
        stage('Building realtime image') {
          when {
            branch 'main'
          }
          steps {
            sh 'export JENKINS_NODE_COOKIE=dontKillMe && bash ./scripts/deploy/realtime.sh'
          }
        }
      }
    }
    
    stage('Deployyyyyy') {
      when {
        branch 'main'
      }
      steps {
        sh 'sleep 5'
        sh 'docker-compose up -d'
      }
    }
  }
}
