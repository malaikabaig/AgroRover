🌱 AgroRover – AI-Powered Smart Farming Rover
AgroRover is an AI-based autonomous farming assistant designed to revolutionize precision agriculture. Built on Raspberry Pi with a 3D-printed robotic arm, this rover performs soil monitoring, plant health analysis, and remote field inspection through a mobile app interface.

🚜 Features
Remote Control Movement – Navigate forward, backward, left, and right via mobile app.

Image Capture & AI Detection – Take crop images and run disease detection through an integrated AI model hosted on a Flask web server.

Soil Moisture Sensing – Real-time monitoring and alerting based on sensor data.

User Authentication – Secure sign-up/login system with MongoDB integration.

Live Camera Feed – View real-time visuals of field conditions (optional).

Captured Image Viewer – Inspect and manage field images from the app.

Modular Architecture – Easy integration of new sensors or AI models.

🛠️ Tech Stack
Frontend: React Native (Expo)

Backend: Node.js + Express (API server)

AI Model: Trained CNN (Flask/Python)

Database: MongoDB Atlas

Hardware: Raspberry Pi, Robotic Arm, Soil Moisture Sensor, Pi Camera

📦 Project Structure
/mobile-app: React Native application source code

/server: Node.js backend for auth & data storage

/ai-server: Flask server for image-based disease detection

/hardware: GPIO code and control logic for Raspberry Pi
