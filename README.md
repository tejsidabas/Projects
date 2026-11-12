# Sahayata — Smart Help for Every Home

> **Minor Project – I (MCA I, Shift – I)**  
> **Student Name:** TEJSI  
> **Enrollment No.:** 03814004426  
> **Institution:** Jagan Institute of Management Studies (JIMS), Sector-5, Rohini, Delhi  
> **Affiliated to:** Guru Gobind Singh Indraprastha University (GGSIPU)  

---

## 1. Project Overview

**Sahayata** is an automated household-help booking and domestic-worker management platform. It addresses the challenges of informal domestic help arrangements (such as verbal commitments, unmanaged cancellations, and lack of scheduling records) by providing:

1. **Role-Based Access:** Distinct portals for **Household Users**, **House Help (Workers)**, and **Administrators**.
2. **Rule-Based Smart Matching Engine:** Algorithmic ranking based on worker availability, service skills, conflict-free slot validation, geographic proximity, historical rating, and workload balancing.
3. **Automated Replacement Workflow:** Seamlessly reallocates the next highest-ranking eligible worker when an assigned helper is unavailable or cancels.
4. **Attendance Tracking:** Check-in and Check-out timestamps with automated working time calculation.
5. **Rating & Reviews:** Transparent 5-star customer feedback with live recalculation of helper ratings.
6. **Simulated Payments & Earnings:** Transparent tracking of amounts, payment methods (UPI, Cash, Card), and earnings.

---

## 2. System Architecture & Tech Stack

- **Frontend:** React 18, Vite, Modern CSS (Responsive, Mobile-friendly, Component-scoped)
- **Backend:** Node.js, Express.js RESTful API, JSON Web Tokens (JWT), Bcrypt password hashing
- **Data Layer:** Local file-based JSON database (`/server/data/`) with zero external database configuration required for academic viva and local demonstrations.

```
sahayata-project/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Cards, Modals)
│   │   ├── pages/              # Role dashboards and views
│   │   ├── services/           # API integration client
│   │   ├── App.jsx             # Main state container & router
│   │   ├── main.jsx            # React root mount point
│   │   └── styles.css          # Application styles
│   └── package.json
│
├── server/                     # Node.js & Express REST API
│   ├── data/                   # JSON database files (users, bookings, services, reviews)
│   ├── middleware/             # JWT authentication & role-based authorization
│   ├── routes/                 # Modular API routes (auth, helpers, bookings, admin, services)
│   ├── utils/                  # Matching algorithm and JSON storage handlers
│   ├── index.js                # Server entry point
│   └── package.json
│
├── package.json                # Project root workspace script
└── README.md
```

---

## 3. Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher)
- Visual Studio Code or any modern code editor

### Installation & Execution Steps

1. **Open the project directory:**
   ```bash
   cd sahayata-project
   ```

2. **Install all dependencies for root, client, and server:**
   ```bash
   npm run install:all
   ```
   *(Or individually: `cd client && npm install`, then `cd ../server && npm install`)*

3. **Start both backend server and frontend client concurrently:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - **Frontend UI:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 4. Pre-configured Demo Accounts

For project presentation and evaluation, pre-seeded accounts are provided with password `password123`:

| Role | Name | Email | Password | Features to Test |
| :--- | :--- | :--- | :--- | :--- |
| **Household** | Rahul Mehta | `rahul@demo.com` | `password123` | Book services, view smart matching, mark paid, leave ratings, urgent dispatch. |
| **Helper** | Priya Sharma | `priya@demo.com` | `password123` | Toggle availability, check in/out on jobs, view schedule and earnings. |
| **Admin** | System Admin | `admin@demo.com` | `password123` | Verify helper profiles, view platform revenue, audit all bookings. |

---

## 5. Algorithmic Matching Logic (Section 3.3 & 3.4 of Synopsis)

The matching algorithm (`server/utils/matching.js`) ranks available domestic helpers using a Multi-Criteria Decision Model:

$$\text{Suitability Score} = S_{\text{rating}} + S_{\text{experience}} + S_{\text{location}} + S_{\text{workload}}$$

1. **Rating Component (30%):** $\frac{\text{Rating}}{5.0} \times 30$
2. **Experience Component (25%):** $\min\left(\frac{\text{Experience}}{10}, 1\right) \times 25$
3. **Proximity / Location Match (25%):** Locality matching between household address and helper service area.
4. **Workload Balancing (20%):** $\max\left(0, 20 - \text{Active Bookings Today} \times 7\right)$ to distribute jobs equitably across workers.
