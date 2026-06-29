---
layout: base.njk
title: Deployment Guide - Mahakama Legal Assistant
description: Step-by-step guides for deploying Mahakama Legal Assistant to various environments including production and staging.
permalink: /deployment/
---

# 🚀 Deployment Guide

This document provides comprehensive information about deploying the Mahakama server to various environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Railway](#railway)
- [Environment Variables](#environment-variables)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)

## Prerequisites

- Node.js 20+
- Docker (for containerized deployments)
- Railway CLI (if deploying to Railway)

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mahakama-api.git
   cd mahakama-api/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

## Deployment Options

### Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Link your project**
   ```bash
   railway link
   ```

4. **Deploy**
   ```bash
   railway up
   ```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for JWT token generation |
| `GEMINI_API_KEY` | No | Google Gemini API key |
| `CHROMA_API_KEY` | No | ChromaDB API key |
| `REDIS_URL` | No | Redis connection URL |

## CI/CD Pipeline

> **Work in Progress**
> 
> We're currently developing our CI/CD pipeline using GitHub Actions. The planned workflow will include:
> 
> 1. Linting and type checking
> 2. Running tests
> 3. Building the application
> 4. Automated deployments

## Monitoring & Logging

> **Work in Progress**
> 
> We're currently developing our monitoring and logging system. The planned features will include:
> 
> - **Logging**: All logs are sent to a centralized logging service
> - **Error Tracking**: Errors are tracked and reported in real-time
> - **Performance Monitoring**: Monitor response times and server health

