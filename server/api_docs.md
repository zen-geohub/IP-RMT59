# Individual Project API Documentation

### Endpoints :

List of available endpoints.

### user

- `POST /api/register`
- `POST /api/google-login`
- `POST /api/login`

### location data

- `GET /api/places`

### user favorites

- `GET /api/favorites`
- `POST /api/favorites`
- `PATCH /api/favorites/:id`
- `DELETE /api/favorites/:id`

&nbsp;

## 1. POST /api/register

Description:

> Register user

Request:

- body:

```json
{
  "email": "string (required)",
  "password": "string (required)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "profilePicture": "string (optional)"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "profilePicture": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "email": "email must be unique"
}
OR
{
  "email": "Email is required"
}
OR
{
  "password": "Password is required"
}
OR
{
  "email": "Email is required",
  "password": "Password is required"
}
OR
{
  "email": "Email is required",
  "password": "Password is required",
  "firstName": "First name is required",
}
OR
{
  "email": "Email is required",
  "password": "Password is required",
  "firstName": "First name is required",
  "lastName": "Last name is required"
}
```

&nbsp;

## 2. POST /api/google-login

Description:

> Login user using gmail

Request:

- body:

```json
{
  "token": "Google Access Token (required)"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "firstName": "string",
  "lastName": "string",
  "profilePicture": "string"
}
```

&nbsp;

## 3. POST /api/login

Description:

> Login user

Request:

- body:

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "firstName": "string",
  "lastName": "string",
  "profilePicture": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required."
}
OR
{
  "message": "Password is required."
}
OR
{
  "message": "Invalid email/password"
}
```

&nbsp;

## 4. GET /api/places

Description:

> Read data from Gmaps API

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "latitude": "float (required)",
  "longitude": "float (required)"
}
```

_Response (200 - OK)_

```json
{
  "geojson": {
    "type": "FeatureCollection",
    "features": [
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": "Array<latitude, longitude>"
          },
          "properties": {
              "placeId": "string",
              "displayName": "string",
              "formattedAddress": "string",
              "iconBackgroundColor": "string",
              "iconMaskBaseUri": "string",
              "primaryTypeDisplayName": "string",
              "rating": "float"
          }
      },
      ...
    ]
  },
  "response": [
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": "Array<latitude, longitude>"
        },
        "properties": {
            "placeId": "string",
            "displayName": "string",
            "formattedAddress": "string",
            "iconBackgroundColor": "string",
            "iconMaskBaseUri": "string",
            "primaryTypeDisplayName": "string",
            "rating": "float"
        }
    },
    ...
  ]
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Latitude and longitude are required."
}
```

&nbsp;

## 5. GET /api/favorites

Description:

> Read user favorite places

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
    {
        "id": "integer",
        "UserId": "integer",
        "PlaceId": "integer",
        "notes": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "Place": {
            "id": "integer",
            "type": "Feature",
            "properties": {
                "placeId": "string",
                "displayName": "string",
                "formattedAddress": "string",
                "primaryTypeDisplayName": "string",
                "iconMaskBaseUri": "string",
                "iconBackgroundColor": "string",
                "rating": "float"
            },
            "geometry": {
                "type": "Point",
                "coordinates": "Array<latitude, longitude>"
            },
            "createdAt": "string",
            "updatedAt": "string"
        }
    },
    ...
]
```

&nbsp;

## 6. POST /api/favorites

Description:

> Create user favorite places

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "properties": {
      "placeId": "string",
      "displayName": "string",
      "formattedAddress": "string",
      "primaryTypeDisplayName": "string",
      "iconMaskBaseUri": "string",
      "iconBackgroundColor": "string",
      "rating": "float"
  },
  "geometry": {
      "type": "Point",
      "coordinates": "Array<latitude, longitude>"
  }
}
```

_Response (200 - OK)_

```json
{
    "id": "integer",
    "UserId": "integer",
    "PlaceId": "integer",
    "notes": "string",
    "createdAt": "string",
    "updatedAt": "string"
}
```

&nbsp;

## 7. PATCH /api/favorites/:id

Description:

> Update notes user favorite places

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

- body: 

```json
{
  "notes": "string"
}
```

_Response (200 - OK)_

```json
{
    "id": "integer",
    "UserId": "integer",
    "PlaceId": "integer",
    "notes": "string",
    "createdAt": "string",
    "updatedAt": "string"
}
```

_Response (404 - Not Found)_

```json
{
    "message": "Place not found."
}
```

## 8. DELETE /api/favorites/:id

Description:

> Create user favorite places

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
    "message": "Place has been removed from your list."
}
```

_Response (404 - Not Found)_

```json
{
    "message": "Place not found."
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "You are not authorized."
}
OR
{
  "message": "Invalid token."
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized."
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```
