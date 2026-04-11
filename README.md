# Healix Full Project

This project is built from the Healix PPT topic:
- Online Hospital Management System
- Patient / Doctor / Admin roles
- Appointment booking
- Medical records
- Live chat
- Admin dashboard
- MongoDB database

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB

## Backend setup
```bash
cd backend
npm install
copy .env.example .env
# update MONGO_URI if needed
npm run seed
npm run dev
```

## Frontend setup
```bash
cd frontend
npm install
npm run dev
```

## Demo accounts
- Admin: admin@healix.com / 123456
- Doctor: doctor@healix.com / 123456
- Patient: patient@healix.com / 123456

## Important notes
This is a working academic project version.  
The PPT also mentions AI chatbot, video consultation, and 3D virtual doctor.  
Those advanced modules are not fully implemented here, but the structure is ready for next-step extension.
