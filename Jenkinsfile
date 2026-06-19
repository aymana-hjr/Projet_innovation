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
