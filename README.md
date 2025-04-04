# Auxiliary Tools – Ape Studio

This repository contains a collection of support tools used by Ape Studio, designed to facilitate systems, support, and authentication flow. Below is the description of each available page.

---

## 📋 Paste Text

**URL:** `https://apestudio.dev/colar`

Simple tool to paste and share text snippets temporarily. Very useful for debugging, logs, or sharing text.

### Features:
- Paste any text;
- Generate a unique link for later access;
- Support for plain or formatted text (JSON, XML, etc.).

---

## ✅ Authentication Success Page

**URL:** `https://apestudio.dev/auth/sucess`

Page for OAuth2 Discord authentication success.

### Features:
- Displays a success message if validated;
- Direct connection to the OAuth2 Bot.

---

## 🚫 Authentication Error Page

**URL:** `https://apestudio.dev/auth/error`

Page for OAuth2 Discord authentication errors.

### Features:
- Displays error messages based on the received query strings;
- Direct connection to the OAuth2 Bot.

---

## 🔍 Protocol Search

**URL:** `https://apestudio.dev/protocolos`

Internal protocol search tool to facilitate ticket query.

### Features:
- Search for ticket transcripts;
- Results with direct redirection to the transcript;
- Direct connection to the Ticket Bot.

---

## 🛠️ Technical Stack

- **Language:** JavaScript  
- **Style:** CSS  
- **Hosting:** SquareCloud  
- **Status:** 🟡 *Semi-functional*, but currently **offline**
- **Development:** 100% developed by me, from interface design to implementation

---

## 🎨 Design

The interface design for these tools was created by me using [Figma](https://figma.com).  
It reflects Ape Studio’s current visual identity and focuses on clarity, usability, and consistency.

---

## 🧪 Running Locally

To run this project locally:

1. Clone the repository;
2. Make the necessary changes to environment/config files (especially URLs if needed);
3. Make sure you have [Node.js](https://nodejs.org/) installed;
4. Run the following commands:

```bash
npm install
npm start

