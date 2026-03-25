pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'agentic-care'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker images...'
                sh 'docker compose build --no-cache'
            }
        }

        stage('Test') {
            steps {
                echo 'Starting containers...'
                sh 'docker compose up -d'
                sh 'sleep 15'
                sh 'curl -f http://host.docker.internal:5000/health || exit 1'
                echo 'Health check passed!'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploy stage - configure Render hooks when ready'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed — check logs above.'
        }
        always {
            echo 'Done.'
        }
    }
}