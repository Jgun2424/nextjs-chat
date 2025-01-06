# Next.js Chat

> ⚠️ **Note:** This project is currently under active development and is not yet complete. Many features are still being implemented and the codebase is subject to significant changes.

An open-source chat application built using Next.js. This project demonstrates real-time messaging, user authentication, Cloudinary image uploads, and a modern user interface. It is designed to showcase my skills in building functional and responsive web applications, and can also serve as a learning resource or foundation for others.

## Development Status
- 🚧 This is a work in progress
- ⚠️ Many features are not yet implemented
- 📝 Documentation may be incomplete or subject to change
- 🔄 Breaking changes might occur frequently

## Features
- Real-time messaging
- User authentication
- Cloudinary image uploads
- Responsive design
- Modern UI components using [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A Firebase project with Firestore and Authentication enabled
- A Cloudinary account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nextjs-chat.git
   cd nextjs-chat
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Install shadcn/ui components:
   ```bash
   npx shadcn-ui@latest init
   ```
4. Create a `.env.local` file in the root directory and add your Firebase and Cloudinary configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   NODEMAILEREMAIL=your-nodemailer-email //optional *todo feature
   NODEMAILERPASS=your-nodemailer-password //optional *todo feature
   ```
5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
6. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure
```plaintext
nextjs-chat/
├── components/
│   ├── chat/
│   │   ├── chat-screen.tsx
│   │   └── chat-skeleton.tsx
│   ├── sidebar/
│   │   ├── app-sidebar.tsx
│   │   └── chats-sidebar.tsx
│   └── ui/
│       ├── avatar-group.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── popover.tsx
│       └── sidebar.tsx
├── context/
│   └── authContext.js
├── firebaseConfig.js
├── pages/
│   ├── _app.js
│   ├── index.js
│   └── chat/
│       └── [chatId].js
├── public/
│   └── avatars/
│       └── gerald.jpg
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
Special thanks to the open-source community for inspiration and resources.
