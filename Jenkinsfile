pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "your-registry.com"
        DOCKER_CREDENTIALS_ID = "docker-credentials"
        KUBERNETES_CREDENTIALS_ID = "kubernetes-credentials"
        PROJECT_NAME = "e-learning"
        GIT_BRANCH = "${env.BRANCH_NAME}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build and Test') {
            steps {
                dir('e-learning-platform/backend') {
                    sh "./mvnw clean verify"
                }
                dir('e-learning-platform/frontend') {
                    sh "npm ci"
                    sh "npm run test"
                    sh "npm run build"
                }
            }
        }
        
        stage('SonarQube Analysis') {
            when {
                branch 'develop'
            }
            steps {
                dir('e-learning-platform/backend') {
                    withSonarQubeEnv('SonarQube') {
                        sh "./mvnw sonar:sonar"
                    }
                }
            }
        }
        
        stage('Build and Push Docker Images') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} ${DOCKER_REGISTRY}"
                    
                    // Build and push backend services
                    dir('e-learning-platform/backend') {
                        sh "docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/api-gateway:${GIT_BRANCH} -f api-gateway/Dockerfile ."
                        sh "docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/api-gateway:${GIT_BRANCH}"
                        
                        sh "docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/auth-service:${GIT_BRANCH} -f auth-service/Dockerfile ."
                        sh "docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/auth-service:${GIT_BRANCH}"
                        
                        sh "docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/user-service:${GIT_BRANCH} -f user-service/Dockerfile ."
                        sh "docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/user-service:${GIT_BRANCH}"
                        
                        sh "docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/course-service:${GIT_BRANCH} -f course-service/Dockerfile ."
                        sh "docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/course-service:${GIT_BRANCH}"
                        
                        sh "docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/video-service:${GIT_BRANCH} -f video-service/Dockerfile ."
                        sh "docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/video-service:${GIT_BRANCH}"
                    }
                    
                    // Build and push frontend
                    dir('e-learning-platform/frontend') {
                        sh "docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}/frontend:${GIT_BRANCH} ."
                        sh "docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}/frontend:${GIT_BRANCH}"
                    }
                }
            }
        }
        
        stage('Update Kubernetes Manifests') {
            when {
                branch 'main'
            }
            steps {
                dir('e-learning-platform/k8s') {
                    // Update image tags in manifests
                    sh "find . -name '*.yaml' -type f -exec sed -i 's|\\\${DOCKER_REGISTRY:-localhost:5000}|${DOCKER_REGISTRY}|g' {} \\;"
                    sh "find . -name '*.yaml' -type f -exec sed -i 's|:latest|:${GIT_BRANCH}|g' {} \\;"
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([file(credentialsId: "${KUBERNETES_CREDENTIALS_ID}", variable: 'KUBECONFIG')]) {
                    dir('e-learning-platform/k8s') {
                        sh "kubectl --kubeconfig=${KUBECONFIG} apply -k ./"
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([file(credentialsId: "${KUBERNETES_CREDENTIALS_ID}", variable: 'KUBECONFIG')]) {
                    sh "kubectl --kubeconfig=${KUBECONFIG} get pods -n e-learning"
                    sh "kubectl --kubeconfig=${KUBECONFIG} get services -n e-learning"
                }
            }
        }
    }
    
    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
        always {
            // Clean up workspace
            cleanWs()
        }
    }
} 