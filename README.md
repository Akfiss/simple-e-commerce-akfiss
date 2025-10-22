# Simple E-Commerce



This project is a simple RESTful API for an e-commerce application built with Node.js, Express, and Prisma.



## Main Features



* **User Authentication:** User registration and login with JWT (JSON Web Token).

* **Product Management:** CRUD (Create, Read, Update, Delete) operations for products.

* **Category Management:** CRUD operations for product categories.

* **Shopping Cart:** Add, view, and remove items from the shopping cart.

* **Order Management:** Create and view order history.



## Technologies Used



* **Backend:** Node.js, Express.js

* **Database ORM:** Prisma

* **Database:** (According to your Prisma configuration, e.g., PostgreSQL, MySQL, SQLite)

* **Authentication:** bcryptjs for password hashing, jsonwebtoken for token-based authentication.

* **Others:** Cors for Cross-Origin Resource Sharing, Nodemon for development.



## Prerequisites



Before you begin, ensure you have installed:



* [Node.js](https://nodejs.org/en/) (version 14 or higher)

* [npm](https://www.npmjs.com/) (usually installed with Node.js)

* A database (e.g., [PostgreSQL](https://www.postgresql.org/))



## Project Structure

.

├── prisma/

│   ├── migrations/

│   └── schema.prisma

├── src/

│   ├── controllers/

│   │   ├── auth.controller.js

│   │   ├── product.controller.js

│   │   ├── category.controller.js

│   │   ├── cart.controller.js

│   │   └── order.controller.js

│   ├── middleware/

│   │   └── auth.middleware.js

│   ├── routes/

│   │   ├── auth.routes.js

│   │   ├── product.routes.js

│   │   ├── category.routes.js

│   │   ├── cart.routes.js

│   │   └── order.routes.js

│   └── index.js

├── .gitignore

├── package.json

└── README.md

## Usage



1.  **Clone this repository:**



    ```bash

    git clone [https://github.com/akfiss/simple-e-commerce-akfiss.git](https://github.com/akfiss/simple-e-commerce-akfiss.git)

    cd simple-e-commerce-akfiss

    ```



2.  **Install dependencies:**



    ```bash

    npm install

    ```



3.  **Configure your database in `prisma/schema.prisma` and your `.env` file.**



4.  **Run the database migration:**



    ```bash

    npx prisma migrate dev

    ```



5.  **Run the application:**



    * **Development:**

        ```bash

        npm run dev

        ```

    * **Production:**

        ```bash

        npm start

        ```



## Contributing



Contributions are very welcome! If you'd like to contribute, please fork this repository and create a pull request.



## License



This project is licensed under the [MIT License](LICENSE).

