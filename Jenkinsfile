pipeline {
    agent any 
    
    environment {
        COMPOSE = '/usr/local/bin/docker-compose'
    }


    stages { 

        stage('Checkout') { 
            steps { 
                git branch: 'main', url: 'https://github.com/aymana-hjr/Projet_innovation.git' 
            } 
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker-compose push'
                }
            }
        }


        
       stage('Deploy') {
    steps {
        sh 'docker stop mysql backend frontend || true'
        sh 'docker rm mysql backend frontend || true'
        sh '/usr/local/bin/docker-compose down || true'
        sh '/usr/local/bin/docker-compose up -d'
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
