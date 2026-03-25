pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'agentic-care'
        RENDER_BACKEND_HOOK  = credentials('RENDER_BACKEND_HOOK')
        RENDER_FRONTEND_HOOK = credentials('RENDER_FRONTEND_HOOK')
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
                echo 'Running health checks...'
                sh 'docker compose up -d'
                sh 'sleep 10'
                sh 'curl -f http://localhost:5000/health || exit 1'
                echo 'All health checks passed!'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Render...'
                sh 'curl -X POST $RENDER_BACKEND_HOOK'
                sh 'curl -X POST $RENDER_FRONTEND_HOOK'
                echo 'Deploy hooks triggered!'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed — check logs above.'
            sh 'docker compose logs --tail=50'
        }
        always {
            echo 'Cleaning up containers...'
            sh 'docker compose down'
        }
    }
}