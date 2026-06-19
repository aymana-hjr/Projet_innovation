pipeline {
    agent any 

    stages { 

        stage('Checkout') { 
            steps { 
                git branch: 'main', url: 'https://github.com/aymana-hjr/Projet_innovation.git' 
            } 
        }
        stage('Build & Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                credentialsId: 'docker-hub-credentials',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )]) {
                sh 'docker compose build --no-cache'
                sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                sh 'docker compose push'
        }
    }
}  
        stage('Deploy') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }

        

    }

    post {
        success {
            echo 'Déploiement réussi !'
        }
        failure {
            echo 'Echec du pipeline'
        }
    }
}