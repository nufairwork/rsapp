pipeline {
    agent any

    tools {
        nodejs "node24"    // name of your NodeJS install in Jenkins
        maven  "maven3"    // name of your Maven install in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/nufairwork/rsapp.git'
            }
        }

        stage('Build Frontends') {
            steps {
                dir('host-frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
                dir('hr-frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
                dir('inventory-frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Copy Builds into Backend') {
            steps {
                sh 'rm -rf portal/src/main/resources/static/*'
                sh 'cp -r host-frontend/dist/* portal/src/main/resources/static/'
                sh 'cp -r hr-frontend/dist/* portal/src/main/resources/static/hrApp/'
                sh 'cp -r inventory-frontend/dist/* portal/src/main/resources/static/inventoryApp/'
            }
        }

        stage('Build WAR') {
            steps {
                dir('portal') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                sh 'cp portal/target/*.war /opt/tomcat/webapps/portal.war'
            }
        }
    }
}

