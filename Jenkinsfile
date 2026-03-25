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
        sh 'sleep 30'
        sh '''
            echo "=== Backend logs ==="
            docker compose logs backend --tail=10
        '''
        sh '''
            STATUS=$(docker inspect --format="{{.State.Status}}" agentic-backend)
            echo "Backend status: $STATUS"
            if [ "$STATUS" = "running" ]; then
                docker compose exec -T backend wget -qO- http://localhost:5000/health
                echo "Health check passed!"
            else
                echo "Backend not running"
                exit 1
            fi
        '''
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
            sh 'docker compose logs --tail=50 || true'
        }
        always {
            echo 'Cleaning up...'
            sh 'docker compose down || true'
        }
    }
}