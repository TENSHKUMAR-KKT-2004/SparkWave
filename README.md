# SparkWave

![SparkWave](https://github.com/user-attachments/assets/042d20e9-f6fd-4681-be8b-252e309d5049)

SparkWave is a real-time chat application that enables users to connect with friends through text, emojis, voice messages, and multimedia sharing, including images and GIFs. It also supports voice and video calls. Built with modern technologies such as Next.js, WebRTC, Socket.io, Node.js, and Firebase. SparkWave offers a seamless user experience with real-time synchronization


## Features

- **Google Authentication**: Create and manage your profile using your Google account
- **Real-Time Messaging**: Engage in real-time chats with friends, including send & receive text messages, images, GIFs, emojis
- **Voice Messages**: Record and send voice messages with your friends
- **Video & Voice Calls**: Make video and voice calls with friends directly from the app
- **Message Status**: View real-time updates on message delivery and read status
- **User List**: Easily find and start chats with users through a user-friendly interface


## Tech Stack

- **Frontend**: 
  - **Next.js**: A React framework for building server-side rendered and statically generated web applications
  - **Tailwind CSS**: A utility-first CSS framework for styling and creating a modern design

- **Backend**:
  - **Node.js**: JavaScript runtime for building scalable network applications
  - **Express**: A minimal and flexible Node.js web application framework for handling API requests and routing
  - **Prisma**: An ORM (Object-Relational Mapper) for interacting with PostgreSQL DB and simplifying data query process

- **Database**:
  - **PostgreSQL**: A powerful, open-source relational database system for storing user data, messages

- **Authentication**:
  - **Firebase**: Provides services for secure user authentication and profile management

- **Real-Time Communication**:
  - **Socket.io**: Enables bi-directional communication between web clients and servers for real-time messaging and updates

- **Video and Voice Communication**:
  - **WebRTC**: Provides peer-to-peer audio, video data sharing for stream video and voice calls


## How to Run the App Locally ?

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [PostgreSQL](https://www.postgresql.org/) (installed and running)
- [Firebase Account](https://firebase.google.com/) (create a new project and enable Google Authentication)

### Setup Instructions

1. **Clone the Repository**

    ```bash
    git clone https://github.com/TENSHKUMAR-KKT-2004/SparkWave.git
    ```

2. **Navigate to the Project Directory**
    
    ```bash
    cd SparkWave
    ```


3. **Install Dependencies**

    ***For the frontend:***

    ```bash
    cd sparkwave-client
    npm install
    ```

    ***For the backend:***

    ```bash
    cd sparkwave-server
    npm install
    ```


4. **Configure Environment Variables**

    Create a `.env` file in the root directory and add the following variables. Replace the placeholders with your actual values

    ***In frontend side:***

    ```env
    NEXT_PUBLIC_TENOR_API_KEY=your_google_cloud_tenor_api_key
    NEXT_PUBLIC_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_APP_ID=your_firebase_app_id
    NEXT_PUBLIC_MEASUREMENT_ID=your_firebase_measurement_id
    ```

    ***In backend side:***

    ```env
    DATABASE_URL=your_postgresql_database_url
    ```


5. **Run Prisma Studio:**

    ***From backend directory:***

    ```bash
    npx prisma generate
    npx prisma db push
    npx prisma studio
    ```


6. **Start the Development Server to Run the Application**

    ***For the frontend:***

    ```bash
    npm run dev
    ```

    ***For the backend:***

    ```bash
    node server.js
    ```


7. **Open the App in your Browser**

    Navigate to `http://localhost:3000` to view the application


## Key Technologies

### WebRTC

![WebRTC](https://www.wowza.com/wp-content/uploads/WebRTC.gif)

WebRTC (Web Real-Time Communication) is a powerful technology that enables real-time audio, video, and data communication directly in the browser without needing plugins. In SparkWave, WebRTC is used to facilitate seamless video and voice calls, providing a high-quality and interactive communication experience between users. It leverages peer-to-peer connections and supports various media types, making it ideal for real-time communication applications

### Socket.io

![Socket.io](https://media.licdn.com/dms/image/D4D22AQG7d-bLIeIvKw/feedshare-shrink_800/0/1701789516031?e=2147483647&v=beta&t=TlgJSIXlBBHPlmZvkJIm-O-VwqjsaUKIKIw4-5Zfejo)

Socket.io enables real-time, bidirectional communication between clients and servers. It is used in SparkWave to handle real-time messaging, ensuring that users receive messages and updates instantaneously


## Screenshots

### Home Page

![home-page](https://github.com/user-attachments/assets/3b8dfebc-a253-493c-beb6-415056a5a71b)

### Login Page

![login](https://github.com/user-attachments/assets/c33f3396-7eca-48f2-b531-d84dc83dfc0a)

### Onboarding Page

![onboarding](https://github.com/user-attachments/assets/c8f4b832-0f9c-4b5f-a8c9-c83e263daec5)

### Users List

![users-list](https://github.com/user-attachments/assets/9042b016-0234-4f0e-b8ae-eb8f3df6d67e)

### Chatting

![chat-interface](https://github.com/user-attachments/assets/a03ef46f-333b-43b0-8097-03f1b329493c)

![chat-interface-2](https://github.com/user-attachments/assets/1977c831-8df5-4614-9f85-5178e4074e46)

![chat-interface-3](https://github.com/user-attachments/assets/acf9ba84-37e9-4e09-98a2-9b2829adf416)

### Video Calling

![video-call](https://github.com/user-attachments/assets/a4789395-0b0f-478d-a6d6-6146014a7849)

![video-call-2](https://github.com/user-attachments/assets/bcb88dbc-92a1-45ac-ad15-95b5c12002e5)

![video-call-3](https://github.com/user-attachments/assets/4665bc34-fcbb-4012-baa6-252ba164fc48)

### Voice Calling

![voice-call](https://github.com/user-attachments/assets/d206934a-4f31-40a1-8950-af2ebf679589)

![voice-call-2](https://github.com/user-attachments/assets/8ebe6b9e-1939-4047-b4f4-be2873719173)

![voice-call-3](https://github.com/user-attachments/assets/6360888c-0c57-4481-8c90-2150852c522e)

### Search Messages

![search-message](https://github.com/user-attachments/assets/af29de5a-624a-4302-afa9-4668372d6c5f)


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.io](https://socket.io/)
- [WebRTC](https://webrtc.org/)
- [Firebase](https://firebase.google.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
