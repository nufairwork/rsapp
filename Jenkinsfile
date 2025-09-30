pipeline {
    agent any

    tools {
        nodejs "node24"    // name of NodeJS installation in Jenkins
        maven  "maven3"    // name of Maven installation in Jenkins
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

        stage('Assemble Backend WAR') {
            steps {
                dir('portal') {
                    // clean static first
                    sh 'rm -rf src/main/resources/static/*'

                    // copy frontend builds into backend static
                    sh 'cp -r ../host-frontend/dist/* src/main/resources/static/'
                    sh 'cp -r ../hr-frontend/dist/* src/main/resources/static/'
                    sh 'cp -r ../inventory-frontend/dist/* src/main/resources/static/'

                    // build Spring Boot war using Jenkins Maven tool
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                // copy final WAR into Tomcat webapps
                sh 'cp portal/target/portal-0.0.1-SNAPSHOT.war /opt/AMP/share/amp-scr/webapps/portal.war'
            }
        }
    }
}

