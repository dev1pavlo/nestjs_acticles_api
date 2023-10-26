# About project
This is a simple project with CRUD operations in nest JS
# Used stack
[x] Nest JS 
[x] Typescript
[x] Jest
# How to run project
1) Create and configure .env file in root directory
2) run `npm install`
3) run `npm start`

# Test
To run e2e tests run `npm run test:e2e`

# Auth
 Auth implements with JWT
1) request comes to middleware to set user (middleware applied to all routes)
2) for routes that required auth, guard is used (./src/users/guards/auth-required.guard.ts) need Authorization Bearer token in header
3) to get current user id uses decorator (./src/users/decorators/user.guard.ts)

# Architecture
1) to all routes applied global middleware to set the current user
3) controller - used to handle incoming request
4) service - business logic
5) repository - actions with DB

# Others
1) Validation via `class-validator` library (pipe applied globally in main.ts)
