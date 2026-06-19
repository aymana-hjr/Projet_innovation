pipeline {
    agent any 

    stages { 

        stage('Checkout') {
    steps {
        retry(3) {
            checkout scmGit(
                branches: [[name: '*/main']],
                extensions: [
                    cloneOption(depth: 1, shallow: true, timeout: 60)
                ],
                userRemoteConfigs: [[
                    url: 'git@github.com:aymana-hjr/Projet_innovation.git',
                    credentialsId: 'github-ssh'
                ]]
            )
        }
<<<<<<< HEAD

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Push Docker Hub') {
=======
    }
}
        stage('Build & Push Docker Images') {
>>>>>>> b8b599d404e4b8861c3e62f4b6f588a1ed77056f
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
