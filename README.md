# DCIM-Pro 🚀

**DCIM-Pro** (Data Center Infrastructure Management) is a robust and modern platform designed for managing data center assets, physical infrastructure, and hardware configurations.

![Dashboard Preview](file:///home/kubuntu/.gemini/antigravity/brain/45d44156-03a9-4c29-a12c-3476a6e25f83/final_verification_successful_dashboard_1774025657988.webp)

## ✨ Features

- **🌐 Infrastructure Oversight**: Manage multiple Datacenters and their geographic locations.
- **📍 Rack Management**: Track physical rack units (U), availability, and equipment placement.
- **🖥️ Server Inventory**: Detailed tracking of server assets, serial numbers, management IPs, and live status (Active/Failed/Maintenance).
- **🛠️ Hardware Catalog**: Comprehensive catalog for CPUs, RAM, and Storage components.
- **🔌 Network Devices**: Monitor switches and other network hardware within your racks.
- **📊 Real-time Dashboard**: Quick overview of your entire infrastructure's health and distribution.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Styling**: Modern Glassmorphism CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd DCIM-Pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## 📁 Project Structure

- `src/app`: Next.js pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Shared utilities and Prisma client singleton.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets.

## 📝 License

This project is private and intended for internal use.
