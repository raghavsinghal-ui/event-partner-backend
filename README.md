# Event Partner Backend

Event Partner is a role-based event management platform that helps organizations create, promote, and manage events while allowing users to discover, register, and participate in them through a streamlined workflow.

Instead of manually creating promotional content, collecting registrations, verifying participants, and handling payments across multiple tools, Event Partner centralizes the entire event lifecycle into a single platform.

## How It Works

```text
Super Admin
    │
    ▼
Creates & Manages Admins
    │
    ▼
Admin Creates Event
    │
    ├── Generate AI Event Post
    ├── Attach Registration Form
    ├── Verify User Credibility
    └── Track Registrations
    │
    ▼
Users Discover Events
    │
    ├── Search Events
    ├── Register
    ├── Submit Forms
    └── Complete Payment
    │
    ▼
Successful Event Participation
```

## Key Problem Solved

Managing events typically requires multiple disconnected tools:

* Event creation platforms
* Registration systems
* Payment gateways
* Marketing tools
* User verification processes

Event Partner combines all of these into a unified backend system with AI-assisted event promotion and secure registration workflows.

## Core Features

### Multi-Level Administration

#### Super Admin

* Create administrators
* Manage platform permissions
* Demote administrators

#### Admin

* Create and manage events
* Generate AI-powered event promotions
* Attach custom registration forms
* Verify user credibility
* Track participant registrations
* Manage event lifecycle

#### User

* Discover events
* Search with partial matching
* Register for events
* Submit registration forms
* Complete event payments

### AI-Powered Event Promotion

Admins can provide event details and automatically generate professional marketing content using Generative AI.

This reduces the effort required to create engaging event descriptions and promotional material.

### Event Registration Workflow

```text
User Signup
     │
     ▼
OTP Verification
     │
     ▼
JWT Authentication
     │
     ▼
Browse Events
     │
     ▼
Register Event
     │
     ▼
Payment Processing
     │
     ▼
Registration Confirmation
```

### Secure Authentication

* OTP Verification
* JWT Authentication
* Access Token Strategy
* Refresh Token Strategy
* Role-Based Access Control

### Event Discovery

* Partial Search
* Pagination
* Event Filtering
* Fast Retrieval

### Payment Processing

Integrated Razorpay payment flow for event registrations.

### User Verification

Administrative verification process helps maintain participant credibility and platform trust.

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT
* OTP Verification

### Payment Gateway

* Razorpay

### AI Integration

* Generative AI API

## Project Structure

```text
controllers/
models/
routes/
middleware/
utils/
config/
```

## Future Improvements

* Swagger API Documentation
* Event Recommendation Engine
* Analytics Dashboard
* Real-Time Notifications
* Cloud Deployment

```
```
# Event Partner Backend

Event Partner is a role-based event management platform that helps organizations create, promote, and manage events while allowing users to discover, register, and participate in them through a streamlined workflow.

Instead of manually creating promotional content, collecting registrations, verifying participants, and handling payments across multiple tools, Event Partner centralizes the entire event lifecycle into a single platform.

## How It Works

```text
Super Admin
    │
    ▼
Creates & Manages Admins
    │
    ▼
Admin Creates Event
    │
    ├── Generate AI Event Post
    ├── Attach Registration Form
    ├── Verify User Credibility
    └── Track Registrations
    │
    ▼
Users Discover Events
    │
    ├── Search Events
    ├── Register
    ├── Submit Forms
    └── Complete Payment
    │
    ▼
Successful Event Participation
```

## Key Problem Solved

Managing events typically requires multiple disconnected tools:

* Event creation platforms
* Registration systems
* Payment gateways
* Marketing tools
* User verification processes

Event Partner combines all of these into a unified backend system with AI-assisted event promotion and secure registration workflows.

## Core Features

### Multi-Level Administration

#### Super Admin

* Create administrators
* Manage platform permissions
* Demote administrators

#### Admin

* Create and manage events
* Generate AI-powered event promotions
* Attach custom registration forms
* Verify user credibility
* Track participant registrations
* Manage event lifecycle

#### User

* Discover events
* Search with partial matching
* Register for events
* Submit registration forms
* Complete event payments

### AI-Powered Event Promotion

Admins can provide event details and automatically generate professional marketing content using Generative AI.

This reduces the effort required to create engaging event descriptions and promotional material.

### Event Registration Workflow

```text
User Signup
     │
     ▼
OTP Verification
     │
     ▼
JWT Authentication
     │
     ▼
Browse Events
     │
     ▼
Register Event
     │
     ▼
Payment Processing
     │
     ▼
Registration Confirmation
```

### Secure Authentication

* OTP Verification
* JWT Authentication
* Access Token Strategy
* Refresh Token Strategy
* Role-Based Access Control

### Event Discovery

* Partial Search
* Pagination
* Event Filtering
* Fast Retrieval

### Payment Processing

Integrated Razorpay payment flow for event registrations.

### User Verification

Administrative verification process helps maintain participant credibility and platform trust.

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT
* OTP Verification

### Payment Gateway

* Razorpay

### AI Integration

* Generative AI API

## Project Structure

```text
controllers/
models/
routes/
middleware/
utils/
config/
```

## Future Improvements

* Swagger API Documentation
* Event Recommendation Engine
* Analytics Dashboard
* Real-Time Notifications
* Cloud Deployment

```
```
