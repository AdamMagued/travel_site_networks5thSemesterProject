# Travel Site Project

A web-based travel planning application built with Node.js, Express, and MongoDB. This application allows users to browse various travel destinations, create accounts, and manage a personal "Want-to-Go" list.

## Features

* **User Authentication**: Secure registration and login system.
* **Session Management**: User sessions handled via `express-session`.
* **Destination Browsing**: Dedicated pages for popular destinations (Paris, Rome, Bali, Santorini, Inca Trail, Annapurna Circuit).
* **Wishlist Management**: Users can add destinations to their personal "Want-to-Go" list.
* **Search Functionality**: Search for specific destinations within the site.
* **Persistent Storage**: User data and wishlists are stored in MongoDB.

## Tech Stack

* **Backend**: Node.js, Express.js (v5)
* **Database**: MongoDB
* **Templating Engine**: EJS
* **Dependencies**: `express-session`, `mongodb`, `ejs`

## Prerequisites

Before running the application, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (Local instance running on port 27017)

## Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/travel-site.git](https://github.com/yourusername/travel-site.git)
    cd travel-site
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start MongoDB**
    Ensure your local MongoDB instance is running. The application connects to:
    * URL: `mongodb://localhost:27017`
    * Database: `myDB`
    * Collection: `myCollection`

4.  **Run the application**
    ```bash
    node app.js
    ```
    *Note: The server will start on port 3000.*

5.  **Access the application**
    Open your browser and visit: `http://localhost:3000`

## Usage

1.  **Register**: Create a new account at `/registration`.
2.  **Login**: Access your account at `/login`.
3.  **Browse**: Explore destinations via the `/home` page.
4.  **Add to Wishlist**: Click the "Add to list" button on any destination page to save it.
5.  **View Wishlist**: Check your saved locations at `/wanttogo`.

## Project Structure

* `app.js`: Main application entry point containing server setup and routes.
* `views/`: EJS templates for the frontend pages.
* `public/`: Static files (CSS, images, JS).
* `package.json`: Project metadata and dependencies.
