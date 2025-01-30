# AI-Tax-Calculator

![header image](https://github.com/sotostilis1/AI-Tax-Calculator/blob/main/readme-image/AI_Tax_Calculator.png?raw=true)

![Tests](https://github.com/sotostilis1/AI-Tax-Calculator/actions/workflows/ci.yml/badge.svg)

## Table of Contents

1. [Introduction](#introduction)
2. [Key Features](#key-features)
3. [Project Structure](#project-structure)
4. [OpenAI API](#openai-api)
5. [Database Collections](#database-collections)
6. [REST API Documentation](#rest-api-documentation)
7. [.env File Setup](#.env-file-setup)
8. [How to Run](#how-to-run)

## Introduction

The AI Tax Calculator is a full-stack web application built using the FARM stack: FastAPI, React, and MongoDB. It leverages AI for tax calculation based on user input. This project showcases clean architecture, RBAC, and modern CI practices.

## Key Features

- AI-Powered Tax Calculations: Uses OpenAI's GPT models to process inputs and generate tax estimates.
- User Management: Includes user registration, login, logout, and role-based access control.
- Secure Authentication: Implements JWT-based authentication with secure cookie handling. Also the user's password gets encrypted with 'bcrypt' before being saved to the database.
- Chat History Management: Stores user chats to the database, enabling retrieval of past chats. Plus, admins can have full access to all chats for safety purposes.
- Modern UI: A responsive React-based frontend for seamless user experience.
- Dockerized Deployment: Ready for containerized environments with Docker and Docker Compose.
- Continuous Integration: Includes GitHub Actions for automated builds


## Project Structure


The project is composed of :

* [backend](backend): FastAPI backend implementing API endpoints, authentication, and AI integration.
* [frontend](frontend): React-based frontend for user interaction and API communication.
* [docker-compose.yml](docker-compose.yml): Docker Compose files for local development and production environments.
* [.github](.github): GitHub Actions workflows for CI automation.

## OpenAI API

##### 1. OpenAI API Integration


- The OpenAI API key is securely stored in the .env file of the backend.

- When a user provides their Annual Income, Residency, and Tax Classification, the backend sends the following structured prompt to ChatGPT for processing:
```console
    "You are a Tax Advisor based on 3 criteria: Annual income, Residency, Tax classification. Give the owed tax and give advice. My annual income is: {income}€, My residency is in: {residency}, I am: {tax_class}."
```
- The LLM model used is gpt-4o. This prompt ensures ChatGPT focuses on calculating the owed tax based on the provided information and giving advice.

##### 2. Frontend Input Validation:

- To maintain data integrity, the frontend performs validation checks on the user input before sending it to the backend.
  
##### Residency Validation:
 
- A GET request is made to the REST Countries API to validate that the provided residency is an existing country.
```console
try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${residency.trim()}`);

      if (!response.ok) {
        if (response.status === 404) {
          setErrorField("residency");
          setIsResidencyValid(false); // Mark as invalid
          throw new Error("Country not found. Please check the name and try again.");
        } else {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      }
``` 
##### Income Validation:

To ensure that only numeric values are entered (with at most one period for decimals), a regular expression is used:
```console
setIncome(e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))
```

## Database Collections

Database consists of two collections, **chat** and **user**

### user Collection

The **user** collection is responsible for storing user credentials and roles.

#### fields

**_id**: A UUID that uniquely identifies the user. This is auto-generated.

**username**: A unique string representing the user's name. 

**password**: A hashed string representing the user's password, securely stored using bcrypt.

**role**: A string that specifies the user's role. By default, all users are assigned the role "user". The only exception is the admin account, which is created automatically with the role "admin".


**Admin Account**:
At the backend's initialization, an admin account is created automatically with the following credentials:
```console
    Username: admin
    Password: admin
    Role: admin
```
Example
```console
_id: "1ddd9bd9-2bd7-4bcc-840f-39861b3cb3c3"
username: "user1"
password: "$2b$12$M9ZXSSNy5nhUu/PSGOIy/edBU3BySMjOIHLhO
role: "user"
```

### chat Collection

The chats collection stores information about user interactions with the AI tax calculator.

#### fields

**_id**: A UUID that uniquely identifies the chat entry. This is auto-generated.

**user_id**: The UUID of the user who initiated the chat. This acts as a reference to the users collection.

**income**:  A number representing the user's annual income.

**residency**: A string specifying the user's country of residency.

**tax_class**: A string indicating the user's tax classification (e.g., worker, employee, etc.).

**response**: A string containing the AI's response based on the provided data.


Example: 
```console
_id: "3671b7de-aad9-427b-a456-2e8a49dc1c51"
user_id: "78efaa34-6bf8-46ee-ae52-a46b1841e24e"
income: 35000
residency: "Greece"
tax_class: "Civil Servant"
response: "Based on your reported annual income of €35,000 and your  residency in Greece, as a Civil Servant, let's determine your tax obligations  and provide tailored advice. ### Calculation of Owed Tax In Greece, the  personal income tax system for salaried employees and pensioners (which  includes Civil Servants) operates on a progressive scale. Here’s a general  breakdown of how your taxes might be calculated based on 2023 rates: 1.  **Income up to €10,000**: 9% 2. **€10,001 to €20,000**: 22% 3. **€20,001  to €30,000**: 28% 4. **€30,001 to €40,000**"
```

## REST API Documentation

[![Postman Collection](https://img.shields.io/badge/Postman-Collection-orange?logo=postman)](https://github.com/sotostilis1/AI-Tax-Calculator/blob/main/backend/postman/postman_collection.json?raw=true)

The API documentation is available as a Postman collection. You can download it using this [link](https://github.com/sotostilis1/AI-Tax-Calculator/blob/main/backend/postman/postman_collection.json?raw=true).

### Importing the Collection

  1. Download the collection from the link above.
  2. Open Postman and click Import in the top-left corner.
  3. Select the .json file and click Import.
  4. The collection will appear in your workspace, ready to use.

## .env File Setup
```
## Environment Variables

The application requires the following environment variables to be set in a `.env` file:

- **MONGO_URI**: The connection string for your MongoDB database. This is required for the backend to store and retrieve data.

- **JWT_SECRET**: A secret key used to sign and verify JWT tokens for authentication.

- **OPENAI_API_KEY**: Used to communicate with the OpenAI Chat Completions API. If missing, the app will not be able to generate a response.

- **DATABASE_NAME**: The name of the database used in MongoDB. This allows the app to connect to the correct database instance.

```

## How to Run
### Clone the repository:
```console
git clone https://github.com/sotostilis1/AI-Tax-Calculator.git
```

### Run Locally with Docker Compose
#### Dependencies:
```
- Docker
- Docker Compose
```

#### Steps:
1. Go into the root directory
```console
cd AI-Tax-Calculator
```

2. Make .env file for the Backend
 Create a .env file and save the environmental variables inside it
```console
cd backend
```
```console
MONGO_URI= mongodb://mongodb:27017/
JWT_SECRET= YOUR_JWT_SECRET
OPENAI_API_KEY= YOUR_OPENAI_API_KEY
DATABASE_NAME= YOUR_DB_NAME
```

3. Run with docker-compose on the root directory
```console
cd ..
docker-compose up
```
4. Open ```http://localhost:5173/``` to your browser

### Start Development Environment
#### Dependencies:
```
- Python 3.9+
- Node.js and npm
```
#### Steps:
1. Go into the root directory
```console
cd AI-Tax-Calculator
```
2. Make .env file for the Backend
 Create a .env file and save the environmental variables inside it
```console
MONGO_URI= YOUR_MONGO_URI
JWT_SECRET= YOUR_JWT_SECRET
OPENAI_API_KEY= YOUR_OPENAI_API_KEY
DATABASE_NAME= YOUR_DB_NAME
```

3. Activate the Virtual Environment
```console
source venv/bin/activate
```
4. Install backend dependencies
```console
pip install -r requirements.txt
```
5. Run the Backend Server
```console
uvicorn main:app --reload
```

6. Open another terminal, navigate to frontend directory, install dependencies and run
```console
cd ../frontend
npm i && npm run dev
```

7. Open ```http://localhost:5173/``` to your browser
