#To install open terminal go to the folder then
## `npm install`

###open .env file and put your value for the env variable.


#To run type on terminal and press enter
## `npm run start:dev`




its structural, but in express we can make any type of structure but internally nestjs uses Express and Express internallly uses Nodejs..

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/89c0cbc9-a206-4995-a565-96972074f6fa/284d0f10-4323-4bee-b08b-f3725fc8f4ff/image.png)

..to need nest cli

npm i -g @nestjs/cli     //globallyy

nest new project-name    //to create project in nestjs

Modules

Controllers

Providers

Middlewares

Pipes

Nesjt Validation 

NestJs Exceptions

Nesjt Guards

Interceptors in NestJs

nest start —watch →  automatically restarts on every change..

npm run start → by default port is on 3000

npm run start:dev = > to watch for changes in files..

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/89c0cbc9-a206-4995-a565-96972074f6fa/aa570da2-639e-49c7-a144-4a10a124573d/image.png)

- **Encapsulation**: Modules encapsulate related logic and can be reused across the application.
- **Dependency Injection**: Modules help manage dependencies between services and controllers in a clean and efficient way.

In **NestJS**, modules are a way to organize and structure your application into different sections, each handling a specific area of functionality. A module is a class marked with the `@Module()` decorator and is used to group related components, such as controllers, services, and providers, into a cohesive unit. Modules help to keep the application modular, maintainable, and scalable.

we have controller, module, service..

app.modules.ts and main.ts

@Modules({

imports:[]

controllers:[]

providers:[]

exports:[]

```
synchronize - Indicates if database schema should be auto-created on every application launch.
Be careful with this option and don't use this in production - otherwise, you can lose production data.
This option is useful during debugging and development. As an alternative to it, you can use CLI and run schema:sync command.
Note that for MongoDB database it does not create a schema, because MongoDB is schemaless. Instead, it syncs just by creating indices.
```

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/89c0cbc9-a206-4995-a565-96972074f6fa/faec61df-4dcd-462d-a74f-24df254d4c8b/image.png)

we dont need to write queries, queries will automatically get executedd…

directly in postgres..

so why TypeORM

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/89c0cbc9-a206-4995-a565-96972074f6fa/2d0adb22-43c5-4855-8bb2-2137219d9b25/image.png)

it will be complex bcz of multiple scenarios, so will use direct ORM.

it basically uses object oriented approach..

it says i will convert class structure  into SQL and will hit directly in database..

for example..

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/89c0cbc9-a206-4995-a565-96972074f6fa/797b7c63-cfab-41e7-80be-5fd559cf6503/image.png)

type is best and stable..

For integrating with SQL and NoSQL databases, Nest provides the `@nestjs/typeorm` package. [**TypeORM**](https://github.com/typeorm/typeorm) is the most mature Object Relational Mapper (ORM) available for TypeScript. Since it's written in TypeScript, it integrates well with the Nest framework.

`npm install --save @nestjs/typeorm typeorm mysql2`

Once the installation process is complete, we can import the `TypeOrmModule` into the root `AppModule`.

**Warning**

Setting

```
synchronize: true
```

shouldn't be used in production - otherwise you can lose production data.





E-commerce API Documentation
This document provides an overview of the API endpoints for an e-commerce platform, complete with real-life examples.
Table of Contents

User Management
Product Management
Order Management
Review Management

User Management
Admin Signup

Endpoint: POST /users/create
Description: Register a new admin user.
Example:
jsonCopy{
  "username": "sarah_admin",
  "email": "sarah@techstore.com",
  "role": "admin"
}
Sarah, the owner of an online tech store, uses this endpoint to create her admin account.

User Signup

Endpoint: POST /users/create
Description: Register a new regular user.
Example:
jsonCopy{
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user"
}
John, a customer interested in buying tech products, creates his account.

User Signin

Endpoint: POST /users/signin
Description: Authenticate a user and receive a token.
Example:
jsonCopy{
  "email": "john@example.com",
  "password": "securepassword123"
}
John logs into his account to start shopping.

Get User Profile

Endpoint: GET /users/single/{id}
Description: Retrieve a user's profile information.
Example: GET /users/single/3
John views his profile to check his account details.

Get All Users (Admin Only)

Endpoint: GET /users/all
Description: Retrieve a list of all users (admin access required).
Example: Sarah uses this endpoint to view all registered users in her store.

Product Management
Create a New Product (Admin Only)

Endpoint: POST /products/
Description: Add a new product to the store.
Example:
jsonCopy{
  "title": "Ultra HD 4K Smart TV",
  "description": "55-inch Smart TV with AI-powered image processing",
  "price": 799.99,
  "stock": 50,
  "images": [
    "https://techstore.com/images/4k-tv-front.jpg",
    "https://techstore.com/images/4k-tv-side.jpg"
  ],
  "categoryId": 2
}
Sarah adds a new 4K TV to her store's inventory.

Get All Products

Endpoint: GET /products/
Description: Retrieve a list of all available products.
Example: John browses all products in the store to find a new TV.

Update Product Details (Admin Only)

Endpoint: PATCH /products/{id}
Description: Update information for a specific product.
Example:
jsonCopy{
  "title": "Ultra HD 4K Smart TV - 2024 Model",
  "price": 749.99,
  "stock": 75
}
Sarah updates the TV's details with the new model information and adjusted price.

Delete Product (Admin Only)

Endpoint: DELETE /products/{id}
Description: Remove a product from the store.
Example: DELETE /products/15
Sarah removes an discontinued product from the store.

Order Management
Place an Order (Regular User)

Endpoint: POST /orders/
Description: Create a new order for products.
Example:
jsonCopy{
  "shippingAddress": {
    "phone": "+1-555-123-4567",
    "name": "John Doe",
    "address": "123 Tech Street",
    "city": "Silicon Valley",
    "postCode": "94000",
    "state": "CA",
    "country": "USA"
  },
  "orderedProducts": [
    {
      "id": 4,
      "product_unit_price": 749.99,
      "product_quantity": 1
    },
    {
      "id": 7,
      "product_unit_price": 49.99,
      "product_quantity": 2
    }
  ]
}
John places an order for the 4K TV and two HDMI cables.

Update Order Status (Admin Only)

Endpoint: PUT /orders/{id}
Description: Update the status of an order.
Example:
jsonCopy{
  "status": "shipped"
}
Sarah updates John's order status to "shipped" after processing it.

Review Management
Leave a Product Review

Endpoint: POST /reviews/
Description: Submit a review for a purchased product.
Example:
jsonCopy{
  "productId": 4,
  "ratings": 5,
  "comment": "This 4K TV is amazing! The picture quality is stunning, and the smart features are intuitive. Highly recommended!"
}
John leaves a 5-star review for the 4K TV he purchased.

Get All Reviews

Endpoint: GET /reviews/all
Description: Retrieve all product reviews.
Example: Sarah checks all reviews to gauge customer satisfaction.

Get Reviews for a Specific Product

Endpoint: GET /reviews/{productId}
Description: Fetch reviews for a particular product.
Example: GET /reviews/4
A potential customer checks reviews for the 4K TV (product ID 4) before making a purchase decision.

Update Review

Endpoint: PATCH /reviews/{id}
Description: Modify an existing review.
Example:
jsonCopy{
  "productId": 4,
  "ratings": 4,
  "comment": "After using the TV for a month, I still love it. Lowered to 4 stars due to slight lag in the smart interface."
}
John updates his review after extended use of the TV.

Delete Review

Endpoint: DELETE /reviews/{id}
Description: Remove a review.
Example: DELETE /reviews/42
John decides to remove his review for a product he returned.

This documentation provides a comprehensive overview of the e-commerce platform's API endpoints, demonstrating how they might be used in real-world scenarios by both administrators (like Sarah) and customers (like John).

