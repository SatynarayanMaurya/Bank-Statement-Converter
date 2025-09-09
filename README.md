# 💰 SpendzAI  

SpendzAI is a smart financial dashboard that helps you **analyze and visualize your spending patterns** directly from your bank statements (PDFs).  
Simply upload your bank PDF, and SpendzAI will parse the data, categorize your expenses, and provide insightful graphs and comparisons.  

---

## ✨ Features
- 📂 **Bank PDF Upload** – Upload your bank statement in PDF format.  
- 🔍 **Automatic Parsing** – Extracts transactions directly from your bank statement using `pdf-parse` and **custom regex logic**.  
- 🧾 **Structured Transactions** – Each transaction is transformed into a clean JSON format for easy processing.  
- 📊 **Spending Categories** – See how much you spent on different categories like Food, Travel, Shopping, Bills, etc.  
- 📈 **Interactive Dashboard** – Visualize your spends with efficient and easy-to-understand graphs.  
- 🔄 **Comparison** – Compare your spending habits with the previous period to track improvements.  
- 🔒 **Secure** – We do **not store your bank PDFs**. User authentication is handled via **Supabase**, but all financial data is processed securely and stays private.  

---

## 🚧 Current Limitation
- ✅ Currently supports **Kotak Bank** statements only.  
- 🔜 Support for **more banks** is coming soon (ICICI, HDFC, SBI, etc.).  

---

## 🛠️ Tech Stack
- **Frontend:** React.js + Tailwind CSS  
- **Backend:** Node.js + Express.js  
- **Database:** Supabase (for user registration & authentication only)  
- **PDF Parsing:** [pdf-parse](https://www.npmjs.com/package/pdf-parse) + custom regex for transaction extraction  
- **Visualization:** Chart.js / Recharts  

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SatynarayanMaurya/Bank-Statement-Converter.git
   cd Bank-Statement-Converter
   ```
2. Install dependencies for frontend:
   ```bash
   cd frontend
   npm install
   ```
3. Install dependencies for backend:
   ```bash
   cd backend
   npm install
   ```
4. Setup environment variables for frontend :
   ```bash
    VITE_SUPEBASE_URL = 'your_supabase_url';
    VITE_SUPEBASE_KEY = 'your_supabase_api_key'
   ```
5. Start the frontend :
   ```bash
     cd frontend
    npm run dev
   ```
6. Start the backend :
   ```bash
    cd backend
    npm install
    npm start
   ```


## 🖼️ Screenshots

### Sign In
![Sign In Screenshot](https://drive.google.com/uc?export=view&id=1fpsV28BUDfzChtw22bBzky6FPsetLAKx)


### File Upload
![Dashboard Screenshot](https://drive.google.com/uc?export=view&id=11he1smIL1bQwel9l43V_Kjt5UyGQ2AFu)

### Extracted Data
![Schedules Screenshot](https://drive.google.com/uc?export=view&id=1QL8ybrzmMNc3o02bHb7dvX00FRzwIAxe)

### Dashboard
![Users Screenshot](https://drive.google.com/uc?export=view&id=1aY7lqbOiUe9n4k9SQQ7SO4aw24tYsW9M)

### Dashboard
![Settings Screenshot](https://drive.google.com/uc?export=view&id=1ChGrIKd-IuSU3YlQvXaLD8llkJw15Dzy)

---


---

## 🔒 Security & Data Handling  

- **Supabase is only used for user registration and authentication**  
- **We do not store any bank PDFs or financial data**  
- **Transactions are parsed using pdf-parse and custom regex, then converted into a clean JSON format**  
  



