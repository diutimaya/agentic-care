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

        stage('Setup Env') {
            steps {
                echo 'Creating environment files...'
                sh '''
                    cat > backend/.env << EOF
PORT=5000
MONGO_URI=mongodb://mongo:27017/agentic-care
JWT_SECRET=super_secret_jenkins_key_change_in_prod
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=production
EOF
                '''
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
                sh 'sleep 20'
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
            sh 'docker compose logs --tail=30 || true'
        }
        always {
            echo 'Cleaning up...'
            sh 'docker compose down || true'
        }
    }
}