# PMOSense AI – Documentation

## Architecture Overview

PMOSense AI follows a clean, layered MERN architecture:

```
Client (React)  →  REST API (Express)  →  Service Layer  →  Repository Layer  →  MongoDB Atlas
```

- **Controllers**: Handle HTTP request/response only
- **Services**: Business logic layer (pure, reusable)
- **Repositories**: All database operations (Mongoose calls)
- **Models**: Mongoose schemas for MongoDB collections

## Folder Structure Reference

See root `README.md` for the complete directory layout.

## API Documentation

Full API reference will be added after Module 3 backend setup.

## Database Schema Diagrams

Schema relationship diagrams will be added after Module 4.
