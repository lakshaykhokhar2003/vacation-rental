# StayHere - Vacation Rental Platform

### A modern, full-featured vacation rental platform built with Next.js, Firebase, and Stripe


## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots)
    - [🏠 Home & Property Discovery](#-home--property-discovery)
    - [🏡 Property Details & Booking Flow](#-property-details--booking-flow)
    - [💳 Payment & Booking Confirmation](#-payment--booking-confirmation)
    - [📅 Availability Calendar View](#-availability-calendar-view)
    - [📊 Dashboard & Booking Management](#-dashboard--booking-management)
    - [🧰 Add & Edit Property](#-add--edit-property)
    - [🔐 Authentication (Login / Signup)](#-authentication-login--signup)
- [🧱 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
    - [📦 Prerequisites](#-prerequisites)
    - [🔧 Installation](#-installation)
    - [📖 Environment Variables](#-environment-variables)
- [📄 License](#-license)

## 🌟 Overview

StayHere is a comprehensive vacation rental platform that connects property owners with travelers looking for unique
accommodations. The platform provides a seamless experience for browsing, booking, and managing vacation rentals with
features like real-time availability, secure payments, and property management tools.

The application is built using modern web technologies including Next.js, React, TypeScript, and Tailwind CSS for the
frontend, with Firebase providing backend services for authentication, database, and storage. Additional integrations
include Stripe for payment processing, UploadThing for image uploads, and Resend for email notifications.

## ✨ Features

### 🏘️ Property Listings

- Browse all available properties with image galleries
- Filter by location, price range, and amenities
- View detailed property information including reviews, amenities, and map location
- Automatic image rotation on property cards

### 📅 Booking & Payments

- Check property availability for selected dates
- Streamlined booking process with secure Stripe payments
- Receive instant booking confirmations via email
- View and manage booking history

### 👤 User Accounts

- User authentication and profile management
- Save favorite properties for quick access
- Fully responsive design for seamless use on desktop, tablet, and mobile
- Smooth page transitions with loading indicators

### 🛠️ Property Management Tools

- Create, edit, and manage property listings
- Upload and organize property images
- Set pricing, availability, and manage booking requests
- Calendar interface to view and block dates

### 📊 Insights & Analytics

- Dashboard to track property performance and earnings
- View booking statistics and guest review summaries

---

## 📸 Screenshots

A quick look at StayScape's UI and user experience, from browsing properties to managing bookings and listings.

---

### 🏠 Home & Property Discovery

- ![Home 1](/public/screenshots/home1.png)
- ![Home 2](/public/screenshots/home2.png)
- ![Home 3](/public/screenshots/home3.png)
- ![All Properties](/public/screenshots/properties.png)

---

### 🏡 Property Details & Booking Flow

- ![Property Details 1](/public/screenshots/property1.png)
- ![Property Details 2](/public/screenshots/property2.png)
- ![Property Details 3](/public/screenshots/property3.png)

---

### 💳 Payment & Booking Confirmation

- ![Payment](/public/screenshots/payment.png)
- ![Booking Confirmation](/public/screenshots/booking-confirmed.png)

---

### 📅 Availability Calendar View

- ![Availability](/public/screenshots/availability.png)

---

### 📊 Dashboard & Booking Management

- ![Dashboard Overview](/public/screenshots/dashboard1.png)
- ![Booking Management](/public/screenshots/dashboard2.png)

---

### 🛠️ Add & Edit Property

- ![Add Property](/public/screenshots/add-property.png)
- ![Edit Property](/public/screenshots/edit-property.png)

---

### 🔐 Authentication (Login / Signup)

- ![Login](/public/screenshots/login.png)
- ![Signup](/public/screenshots/signup.png)

---

## 🧱 Tech Stack

A modern stack combining cutting-edge frontend technologies with powerful backend services to deliver a seamless
vacation rental experience.

---

### 🖥️ Frontend

| Tech                                                                                                              | Description                                                                        |
|-------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs&logoColor=white)                          | **Next.js 15** – React framework with App Router for server components and routing |
| ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)                                 | **React 19** – UI library for building component-based interfaces                  |
| ![TypeScript](https://img.shields.io/badge/TypeScript-TypeSafe-3178C6?logo=typescript&logoColor=white)            | **TypeScript** – Type-safe JavaScript for better developer experience              |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Utility--First-38B2AC?logo=tailwindcss&logoColor=white) | **Tailwind CSS** – Utility-first CSS framework for styling                         |
| ![ShadCN UI](https://img.shields.io/badge/ShadCN%2FUI-Built%20on%20Radix%20UI-blueviolet?logo=radixui)            | **ShadCN/UI** – High-quality UI components using Radix UI and Tailwind             |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-black?logo=framer&logoColor=white)          | **Framer Motion** – Smooth transitions and animations                              |
| ![Lucide](https://img.shields.io/badge/Lucide%20React-Icon%20Library-orange?logo=react)                           | **Lucide React** – Clean, modern icon library                                      |
| ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-Forms-red?logo=reacthookform&logoColor=white)     | **React Hook Form** – Form handling with built-in validation                       |
| ![Zod](https://img.shields.io/badge/Zod-Schema_Validation-blue?logo=zod)                                          | **Zod** – Type-safe schema validation                                              |
| ![date-fns](https://img.shields.io/badge/date--fns-Date_Utils-lightgrey?logo=calendar&logoColor=black)            | **date-fns** – Lightweight date utility library                                    |

---

### 🔧 Backend & Services

| Service                                                                                                            | Description                                                           |
|--------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| ![Firebase](https://img.shields.io/badge/Firebase-Backend-yellow?logo=firebase)                                    | 🔥 **Firebase** – Cloud services for auth, database, and file storage |
| ![Authentication](https://img.shields.io/badge/Auth-Secure-green?logo=lock&logoColor=white)                        | 🔐 **Authentication** – User login and registration                   |
| ![Firestore](https://img.shields.io/badge/Firestore-NoSQL_DB-orange?logo=firebase)                                 | 🗃️ **Firestore** – Scalable NoSQL cloud database                     |
| ![Storage](https://img.shields.io/badge/Storage-File_Uploads-yellow?logo=googlecloud&logoColor=white)              | 🖼️ **Storage** – File uploads for property images                    |
| ![TanStack](https://img.shields.io/badge/TanStack_Query-React_Query-informational?logo=reactquery&logoColor=white) | 📦 **TanStack Query** – Data fetching and caching                     |
| ![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)                         | 💳 **Stripe** – Secure and seamless payment processing                |
| ![UploadThing](https://img.shields.io/badge/UploadThing-File_Service-5865F2?style=flat&logo=cloudflare)            | ☁️ **UploadThing** – Easy file upload API                             |
| ![Resend](https://img.shields.io/badge/Resend-Transactional_Emails-000000?logo=gmail&logoColor=white)              | 📧 **Resend** – Email delivery for confirmations and notifications    |

### 🧰 Development Tools

- 🧹 **ESLint** – JavaScript and TypeScript code linting
- 🎯 **Prettier** – Code formatting for consistency
- ▲ **Vercel** – Fast deployment and hosting for frontend and serverless functions

## 🚀 Getting Started

Kickstart your StayScape project in just a few steps.

---

### 📦 Prerequisites

Before you begin, make sure the following tools and services are ready to go:

#### 🧰 Developer Tools

- ![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?logo=node.js&logoColor=white) – Runtime environment
- ![npm](https://img.shields.io/badge/npm-latest-red?logo=npm)
  or ![yarn](https://img.shields.io/badge/yarn-latest-blue?logo=yarn) – Package manager
- ![Git](https://img.shields.io/badge/Git-Installed-orange?logo=git) – Version control system

#### 🛠️ Service Accounts

You'll need active accounts for these services to integrate and deploy:

- 🔥 **Firebase** – Auth, Firestore DB, and Storage  
  ![Firebase](https://img.shields.io/badge/Firebase-Setup-yellow?logo=firebase)

- 💳 **Stripe** – For secure payment processing  
  ![Stripe](https://img.shields.io/badge/Stripe-Configured-635BFF?logo=stripe&logoColor=white)

- ☁️ **UploadThing** – For handling image uploads  
  ![UploadThing](https://img.shields.io/badge/UploadThing-Ready-5865F2?style=flat&logo=cloudflare)

- 📧 **Resend** – For email confirmations  
  ![Resend](https://img.shields.io/badge/Resend-API%20Key%20Set-000000?logo=gmail&logoColor=white)

---

### 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lakshaykhokhar2003/vacation-rental
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` to view the application.

### 🛠️ Environment Variables

   ```
   #Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Resend (for emails)
   RESEND_API_KEY=your_resend_api_key
   
   # UploadThing
   UPLOADTHING_TOKEN=your_uploadthing_token
   ```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/lakshaykhokhar2003/vacation-rental?tab=MIT-1-ov-file) file for details.