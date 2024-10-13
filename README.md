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


