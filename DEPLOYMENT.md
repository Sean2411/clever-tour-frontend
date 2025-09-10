# Clever Tour Frontend - Deployment Guide

## Overview

This project uses GitHub Actions for CI/CD and deploys to Google Cloud Run with two environments:
- **Development**: Automatically deployed when merging to `main` branch
- **Production**: Deployed when merging to `production` branch or manually triggered

## Environments

### Development Environment
- **Trigger**: Push to `main` branch
- **Service Name**: `clever-tour-frontend-dev`
- **API URL**: `https://api-dev.clever-tour.com`
- **Resources**: 1 CPU, 1GB RAM, max 10 instances

### Production Environment
- **Trigger**: Push to `production` branch OR manual deployment
- **Service Name**: `clever-tour-frontend-prod`
- **API URL**: `https://api.clever-tour.com`
- **Resources**: 2 CPU, 2GB RAM, max 20 instances

## Setup Instructions

### 1. Google Cloud Platform Setup

1. Create a new GCP project or use existing one
2. Enable the following APIs:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

3. Create a Service Account:
   ```bash
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions Service Account"
   ```

4. Grant necessary permissions:
   ```bash
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   ```

5. Create and download service account key:
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GCP_PROJECT_ID` | Your Google Cloud Project ID | `my-project-123` |
| `GCP_SA_KEY` | Service Account JSON key | `{"type": "service_account", ...}` |

### 3. Branch Protection Rules (Recommended)

Set up branch protection rules for the `production` branch:

1. Go to repository → Settings → Branches
2. Add rule for `production` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date
   - Restrict pushes to matching branches

## Deployment Workflows

### Automatic Development Deployment

**Trigger**: Push to `main` branch

**Process**:
1. Code checkout
2. Install dependencies
3. Run linting
4. Build application
5. Build and push Docker image
6. Deploy to Cloud Run (dev environment)
7. Comment deployment URL on PR (if applicable)

### Automatic Production Deployment

**Trigger**: Push to `production` branch

**Process**:
1. Code checkout
2. Install dependencies
3. Run linting
4. Build application
5. Build and push Docker image
6. Deploy to Cloud Run (prod environment)
7. Create GitHub release
8. Comment deployment URL on PR (if applicable)

### Manual Production Deployment

**Trigger**: Manual workflow dispatch

**Process**:
1. Select source branch (main or production)
2. Type "deploy" to confirm
3. Same deployment process as automatic production deployment

## Monitoring and Logs

### View Deployment Logs
1. Go to GitHub repository → Actions tab
2. Click on the specific workflow run
3. View detailed logs for each step

### View Application Logs
```bash
# Development environment
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=clever-tour-frontend-dev" --limit=50

# Production environment
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=clever-tour-frontend-prod" --limit=50
```

### View Service Status
```bash
# Development
gcloud run services describe clever-tour-frontend-dev --region=asia-east1

# Production
gcloud run services describe clever-tour-frontend-prod --region=asia-east1
```

## Environment Variables

The following environment variables are automatically set during deployment:

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXT_PUBLIC_API_URL` | `https://api-dev.clever-tour.com` | `https://api.clever-tour.com` |
| `NODE_ENV` | `production` | `production` |
| `PORT` | `3000` | `3000` |

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify `GCP_SA_KEY` secret is correctly set
   - Check service account permissions

2. **Build Failed**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

3. **Deployment Failed**
   - Check Cloud Run quotas
   - Verify region settings

4. **Application Not Accessible**
   - Check Cloud Run service status
   - Verify environment variables are set correctly

### Rollback Process

To rollback to a previous version:

1. Go to Cloud Run console
2. Select your service
3. Go to "Revisions" tab
4. Click on a previous revision
5. Click "Manage Traffic"
6. Set traffic to 100% for the desired revision

## Security Considerations

1. **Service Account**: Use least privilege principle
2. **Secrets**: Never commit secrets to repository
3. **Network**: Cloud Run services are publicly accessible by default
4. **Updates**: Keep dependencies updated regularly

## Cost Optimization

1. **Development**: Lower resource allocation (1 CPU, 1GB RAM)
2. **Production**: Higher resource allocation (2 CPU, 2GB RAM)
3. **Scaling**: Set appropriate min/max instances
4. **Monitoring**: Use Cloud Monitoring to track usage
