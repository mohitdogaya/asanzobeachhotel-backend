# Asanzo Beach Hotel API

Express API for the hotel admin and future public website integration. It uses Sequelize ORM with MySQL (`mysql2` is Sequelize's database driver). The API does not connect to MongoDB.

## Configure

1. Copy `.env.example` to `.env`.
2. Enter the Hostinger MySQL host, port, database, username, and password. For remote access, copy the server hostname shown in hPanel → Remote MySQL; `MYSQL_HOST` is not the database name. Allow the backend server's IP in Hostinger's Remote MySQL settings. Keep the database credentials out of source control.
3. Set a random `JWT_SECRET` with at least 32 characters and set the initial `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
4. Set `API_PUBLIC_URL` to the public backend URL when the admin/website is hosted on another domain. Add the admin and website origins to `CORS_ORIGIN`.

The Sequelize models in `models/` create the hotel tables on startup. Startup also removes the retired `cms_content` and `contact_messages` tables, seeds the first admin, creates the singleton hotel contact record, and inserts three starter FAQs and three starter blog posts only when those tables are empty. Keep `uploads/` on persistent storage because gallery and blog image files are stored there.

## Run

```sh
npm install
npm run dev
```

The server listens on port 4000 by default. `GET /health` reports API health. Set the admin app's `VITE_API_BASE_URL` to the backend URL ending in `/api`.

## Backend structure

- `models/` defines Sequelize models and MySQL table fields.
- `controllers/` handles request validation and API responses by hotel feature.
- `routes/` maps endpoints to controllers and authentication/upload middleware.
- `services/` contains authentication business logic.
- `middleware/` handles authentication and async controller errors.
- `config/db.js` configures Sequelize and synchronizes the models at startup.

## Hotel API routes

Admin routes require `Authorization: Bearer <token>` returned directly by the email/password login unless marked public.

- `POST /api/login` returns a JWT after email and password verification.
- Gallery: `POST /api/addGalleryImage`, `POST /api/getGalleryList`, `GET /api/getGalleryDetails/:id`, `POST /api/updateGalleryImage/:id`, `DELETE /api/deleteGalleryImage/:id`
- Blog: `POST /api/createEditPost`, `POST /api/getPostList`, `POST /api/getPostDetail`, `DELETE /api/deletePost/:id`
- FAQs: `GET /api/faqs`, `GET /api/faqs/:id`, `POST /api/faqs`, `PUT /api/faqs/:id`, `DELETE /api/faqs/:id`
- Hotel contact settings: `GET/PUT /api/contact-details`
- Room inventory: `GET /api/rooms`, `GET /api/rooms/:id`, `POST /api/rooms`, `PUT/DELETE /api/rooms/:id`
- Public integration: `GET /api/public/posts`, `GET /api/public/gallery`, `GET /api/public/faqs`, `GET /api/public/contact-details`, `GET /api/public/rooms`
