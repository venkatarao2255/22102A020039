# 22102A020039
# Backend Projects Repository

This repository contains two backend microservices built using **Node.js** and **Express.js**:

1. **Average Calculator HTTP Microservice**  
2. **Stock Price Aggregation Service with Photo Insertion Feature**

---

## 1. Average Calculator HTTP Microservice

### Overview  
This microservice provides an HTTP API to calculate the average of a list of numbers. It accepts numbers via HTTP POST requests and returns the computed average in JSON format.

### Features  
- Accepts numbers via HTTP POST request  
- Calculates the average of the input numbers  
- Returns the average in JSON response  

### API Endpoints  

- `POST /average`  
  - **Description:** Calculates the average of numbers sent in the request body  
  - **Request Body:** JSON array of numbers  
  - **Response:** JSON object with the average value  
  - **Example:**  
  

### Technologies and Tools Used  
- Node.js  
- Express.js  
- VS Code (Development)  
- Insomnia (API testing)  

### How to Run  
1. Clone the repository  
2. Navigate to the average calculator microservice folder  
3. Install dependencies:
   ```bash

# Stock Price Aggregation Microservice

## Overview  
This microservice aggregates stock price data from multiple sources and serves consolidated stock information via an HTTP API.

## Features  
- Fetches and aggregates stock price data for requested stock symbols  
- Provides a simple REST API to retrieve aggregated stock data  

## API Endpoint  

- `GET /stocks/:symbol`  
  - **Description:** Retrieves aggregated stock price data for the given stock symbol  
  - **Response:** JSON object containing aggregated stock prices and related metadata  
  - **Example Response:**  
    ```json
 

## Technologies and Tools Used  
- Node.js  
- Express.js  
- VS Code (Development)  
- Insomnia (API testing)  

## How to Run  
1. Clone the repository  
2. Navigate to the microservice folder  
3. Install dependencies:  
   ```bash
   npm install

