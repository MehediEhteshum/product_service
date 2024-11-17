# VM swap memory commands

sudo swapoff /swapfile
sudo rm /swapfile
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
free -h
htop

# Some linux commands

<!-- Update the Package List -->

sudo apt update

<!-- Install packages to allow apt to use a repository over HTTPS -->

sudo apt install apt-transport-https ca-certificates curl software-properties-common

<!-- Add Docker’s Official GPG Key -->

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

<!-- Set Up Docker Repository -->

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

<!-- Install Docker and Docker Compose -->

sudo apt install docker-ce docker-compose -y

<!-- Install Nginx -->

sudo apt install nginx -y

sudo systemctl start nginx
sudo systemctl enable nginx

<!-- Install Node.js (LTS version) -->

sudo apt install -y nodejs npm

<!-- Create or Open the Nginx Service Override File -->

sudo mkdir -p /etc/systemd/system/nginx.service.d
sudo nano /etc/systemd/system/nginx.service.d/override.conf

<!-- Reload the systemd Daemon: Reload systemd so it recognizes the new environment variables. -->

sudo systemctl daemon-reload

<!-- Restart the Nginx Service -->

sudo systemctl restart nginx

<!-- Check the Status of the Nginx Service -->

sudo systemctl status nginx

sudo chmod 600 /etc/nginx/api_keys.conf # Only owner can read/write
sudo chown nginx:nginx /etc/nginx/api_keys.conf # Nginx owns the file

<!-- Create Nginx User and Group -->

sudo groupadd nginx
sudo useradd -g nginx -s /sbin/nologin -r nginx

<!-- Delete Nginx User and Group -->

sudo userdel nginx
sudo groupdel nginx

<!-- Check Nginx User and Group -->

getent passwd nginx
getent group nginx
