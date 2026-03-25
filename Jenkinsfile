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
                sh 'docker compose build'
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
                echo 'Deploy stage - Render hooks will go here'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed — check logs above.'
            sh 'docker compose logs --tail=30'
        }
        always {
            echo 'Cleaning up...'
            sh 'docker compose down || true'
        }
    }
}