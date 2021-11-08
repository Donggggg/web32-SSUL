pipeline {
    environment {
        repository = 'whoishu'
        serverImageName = 'ssul-api'
        frontImageName = 'ssul-front'
        registryCredential = 'dockerhub-whoishu'
        version = '0.1'
    }
    agent any
    stages {
        stage("deploy for dev") {
            when {
                branch "develop"
            }
            stages {
                stage('Build docker image'){
                    steps {
                        echo 'Build BE image'
                        sh 'docker build -t $serverImageName:$version ./server/'
                        sh 'docker tag $serverImageName:$version $repository/$serverImageName:$version'
                        echo 'Build FE image'
                        sh 'docker build -t $frontImageName:$version ./client/'
                        sh 'docker tag $frontImageName:$version $repository/$frontImageName:$version'
                    }
                }
                stage('Push docker images'){
                    steps {
                        withDockerRegistry([credentialsId: registryCredential, url: ""]){
                            sh 'docker push $repository/$serverImageName:$version'
                            sh 'docker push $repository/$frontImageName:$version'
                        }
                    }
                }
                stage('Clean docker image'){
                    steps {
                        sh 'docker rmi $serverImageName:$version'
                        sh 'docker rmi $frontImageName:$version'
                    }
                }
                stage('Run docker over SSH'){
                   steps {
                       sshagent(['ssul-ssh-key']){
                           sh "ssh -p 4781 -o StrictHostKeyChecking=no root@106.10.34.157 'docker pull whoishu/ssul-front'"
                           sh "ssh -p 4781 -o StrictHostKeyChecking=no root@106.10.34.157 'docker pull whoishu/ssul-api'"
                           sh "ssh -p 4781 -o StrictHostKeyChecking=no root@106.10.34.157 'cd /root/web32-SSUL && docker-compose up -d'"
                       }
                   }
                }
            }
        }
        stage("deploy for main") {
            when {
                branch "main"
            }
            steps {
                echo "do deploy"
            }
        }
        stage("ci test for PR"){
            when {
                branch "PR-*"
            }
            steps {
                echo "just fine."
            }
        }
    }
}