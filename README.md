# Employee Management System

A small full-stack web application for managing employee records: create, view, edit and delete
employees, with a photo upload and preview. Data is held in memory only.

## Features

- Create, edit and delete employees, and view an employee's details in a modal
- Form fields: name, department (IT, Finance, Security), active, phone number, email, address, photo
- Photo upload with a preview before saving, and a replace or remove option when editing
- Edit mode is clearly indicated, and the form can be reset or cancelled
- Delete asks for confirmation first
- Validation in the browser and on the server, with clear messages shown next to the fields
- Loading, empty and error states, and a responsive layout

## Tech stack

| Part | Technology |
|---|---|
| Backend | Java 21 (build target), Spring Boot 4.1, Spring Web MVC, Bean Validation, Lombok, Maven Wrapper |
| Frontend | React 19, TypeScript 6, Vite 8, React Router 7, Mantine 9, apisauce |
| Storage | In memory (`ConcurrentHashMap`), lost when the backend restarts |

## Prerequisites

- **JDK 21 or newer**
- **Node.js** 20.19+, 22.13+ or 24+ (the range required by the Vite and ESLint versions used)
- Maven and TypeScript do **not** need to be installed: the Maven Wrapper and the project's own
  dev dependencies are used

**Tested with:** JDK 26 (Temurin), Maven 3.10.0 (via the wrapper) and 3.9.11, Node 22.19.0, npm 10.9.3, macOS.

## Getting started

Run the backend and the frontend in two separate terminals.

### 1. Backend (http://localhost:8080)

```bash
cd backend
./mvnw spring-boot:run        # on Windows: mvnw.cmd spring-boot:run
```

### 2. Frontend (http://localhost:5173)

```bash
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173. In development, Vite forwards every request starting with `/api` to
`http://localhost:8080`, so the browser only talks to one origin and no CORS setup is needed.

Data is kept in memory, so the list starts empty and is cleared whenever the backend restarts.

## Configuration

| Setting | Where | Default |
|---|---|---|
| Backend port | `server.port` (Spring Boot default) | `8080` |
| Photo and request size limits | `backend/src/main/resources/application.yaml` | 2 MB per file, 3 MB per request |
| API base URL for the frontend | `VITE_API_BASE_URL` environment variable | `/api` |
| Backend address used by the dev proxy | `frontend/vite.config.ts` | `http://localhost:8080` |

## API

Base path: `/api/employees`

| Method | Path | Description | Success | Errors |
|---|---|---|---|---|
| `POST` | `/api/employees` | Create an employee (`multipart/form-data`) | `201` and the employee | `400`, `409`, `413` |
| `GET` | `/api/employees` | List all employees, ordered by name | `200` | |
| `GET` | `/api/employees/{id}` | Get one employee | `200` | `400`, `404` |
| `PUT` | `/api/employees/{id}` | Update an employee (`multipart/form-data`) | `200` and the employee | `400`, `404`, `409`, `413` |
| `DELETE` | `/api/employees/{id}` | Delete an employee and their photo | `204` | `400`, `404` |
| `GET` | `/api/employees/{id}/photo` | The employee's photo | `200` (image) | `400`, `404` |

**Create and update requests** are `multipart/form-data` with these parts:

- `employee`: a JSON part (content type `application/json`) with `name`, `department`, `active`,
  `number`, `email` and `address`
- `photo` (optional): the image file
- `removePhoto` (update only, optional): `true` removes the current photo

A new `photo` replaces the current one, `removePhoto=true` removes it, and sending neither keeps it.
If both are sent, the new photo wins.

**Responses** contain `id`, the employee fields and `photoVersion`, which is `null` when the
employee has no photo. Photos are served from `/api/employees/{id}/photo?v={photoVersion}`.

**Errors** use the RFC 9457 (formerly RFC 7807) problem format, with an `errors` map for field messages, for example:

```json
{
  "status": 400,
  "title": "Bad Request",
  "detail": "Validation failed",
  "errors": { "email": "Enter a valid email address" }
}
```

## Validation rules

Checked in the browser for quick feedback, and again on the server, which is the source of truth.

| Field | Rule |
|---|---|
| Name | Required, at most 100 characters |
| Department | Required, one of `IT`, `FINANCE`, `SECURITY` |
| Active | Checkbox, new employees default to active |
| Phone number | Required, 7 to 15 digits, with an optional leading `+` and spaces or hyphens as separators |
| Email | Required, valid format, at most 254 characters, unique (case-insensitive) |
| Address | Required, at most 255 characters |
| Photo | Optional, JPEG, PNG or WebP, at most 2 MB |

## Project structure

```
backend/   Spring Boot API
  controller/  HTTP only: routes, request binding and status codes
  service/     Business rules (service interface plus implementation)
  repository/  Storage interface and the in-memory implementation
  mapper/      Request to domain model, and domain model to response
  domain/      Employee and Photo (immutable)
  dto/         Request and response records
  exception/   Exceptions and the global error handler
  util/        Image type detection
frontend/  React app
  api/         API client, error type and the employee API class
  components/  Form, list, card, photo picker and dialogs
  pages/       List, create and edit pages
  types/ utils/ validation/
```

## Assumptions

- "Number" is a phone number: 7 to 15 digits, with an optional leading `+` and spaces or hyphens
- Email addresses are unique, compared case-insensitively, and an employee can keep their own email
  when editing
- Departments are the fixed set IT, Finance and Security
- The form sets new employees to active by default
- Photos are JPEG, PNG or WebP up to 2 MB; SVG is not accepted
- Data is lost when the backend restarts, as the assessment allows
- There is no authentication or authorization, because the assessment does not call for it
- The application has not been deployed; it runs locally

## Implementation notes

- **Layering:** the controller handles HTTP only, the service holds the rules, and the repository
  is an interface.
- **Immutable model:** `Employee` has final fields. An update builds a modified copy and replaces
  the stored one, so request threads never see a half-updated object.
- **Concurrency:** all writes (create, update, delete) share one lock, so the "email is unique"
  check and the save happen as one step, and a delete cannot be undone by an update in flight.
  Concurrent edits of the same employee are last-write-wins, with no version check.
- **Photos** are validated by their file signature, not by the filename or the `Content-Type` the
  client sends. The photo URL carries a version, so a replaced photo is requested under a new URL
  instead of being served from the browser's cache, and unchanged photos are answered with
  `304 Not Modified`.
- **Sorting:** the list is ordered by name, then email, both case-insensitive. There is no pagination
  or search.

## Security notes

- The server validates everything; the client checks are only for usability
- Uploads are limited in size and checked by file signature against an allowlist
- Photos are served with `X-Content-Type-Options: nosniff`
- Error responses never include stack traces or internal details (details are logged on the server)
- CORS is not configured, because in development the browser talks to one origin through the Vite
  proxy. A frontend hosted on a different origin would need an explicit CORS configuration.
- **Out of scope:** authentication and authorization, HTTPS, rate limiting and audit logging. A real
  deployment handling employee data would need all of them.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Port 8080 was already in use` | Stop the other process using it, or start the backend on another port with `./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081` and point the dev proxy in `frontend/vite.config.ts` at it |
| `release version 21 not supported` | The JDK is older than 21, so install JDK 21 or newer |
| A Node version error from Vite, or `EBADENGINE` warnings from npm | Use a Node version from the range in Prerequisites |
| On Windows, `./mvnw` does not run | Use `mvnw.cmd spring-boot:run` |
| The page shows "Something went wrong" or an empty list with an error | The backend is not running, so start it first |
| A photo is rejected | It must be a JPEG, PNG or WebP image of at most 2 MB |

## License

See [LICENSE](LICENSE).