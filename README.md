# Clever Tour Frontend

A modern Next.js application for tour and attraction booking system with integrated payment processing and admin management.

## 🚀 Features

- **Tour Management**: Browse and book tours with detailed information
- **Attraction Booking**: Book individual attractions and experiences
- **Payment Integration**: Stripe payment processing
- **Admin Panel**: Content management for tours and attractions
- **Responsive Design**: Mobile-first design with Chakra UI
- **Multi-environment**: Development and production environments

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.5
- **UI Library**: Chakra UI
- **Styling**: Emotion (CSS-in-JS)
- **Payment**: Stripe
- **Deployment**: Google Cloud Run
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud Platform account
- GitHub repository

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sean2411/clever-tour-frontend.git
   cd clever-tour-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.local.example env.local
   # Edit env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prod` - Run with production API

## 🌍 Environments

### Development Environment
- **URL**: Automatically deployed on push to `main` branch
- **API**: `https://api-dev.clever-tour.com`
- **Resources**: 1 CPU, 1GB RAM

### Production Environment
- **URL**: Deployed on push to `production` branch or manual trigger
- **API**: `https://api.clever-tour.com`
- **Resources**: 2 CPU, 2GB RAM

## 🔄 CI/CD Pipeline

### Automatic Deployments

1. **Development Deployment**
   - **Trigger**: Push to `main` branch
   - **Process**: Build → Test → Deploy to dev environment
   - **Service**: `clever-tour-frontend-dev`

2. **Production Deployment**
   - **Trigger**: Push to `production` branch
   - **Process**: Build → Test → Deploy to prod environment
   - **Service**: `clever-tour-frontend-prod`

### Manual Deployments

You can manually trigger production deployments:

1. Go to GitHub Actions tab
2. Select "Manual Deploy to Production"
3. Choose source branch (main or production)
4. Type "deploy" to confirm
5. Click "Run workflow"

## 🏗️ Deployment Setup

### 1. Google Cloud Platform Setup

Run the setup script to configure GCP:

```bash
./scripts/setup-gcp.sh
```

Or follow the manual setup in [DEPLOYMENT.md](./DEPLOYMENT.md)

### 2. GitHub Secrets

Add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | Your Google Cloud Project ID |
| `GCP_SA_KEY` | Service Account JSON key |

### 3. Branch Protection (Recommended)

Set up branch protection for the `production` branch:
- Require pull request reviews
- Require status checks to pass
- Restrict pushes to matching branches

## 📁 Project Structure

```
├── components/          # Reusable UI components
├── lib/                # Utility libraries
├── pages/              # Next.js pages
│   ├── admin/          # Admin panel pages
│   ├── attractions/    # Attraction pages
│   ├── tours/          # Tour pages
│   └── ...
├── styles/             # Global styles
├── .github/workflows/  # GitHub Actions
├── scripts/            # Setup and utility scripts
└── ...
```

## 🔧 Configuration

### Environment Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXT_PUBLIC_API_URL` | `https://api-dev.clever-tour.com` | `https://api.clever-tour.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe test key | Your Stripe live key |

### API Integration

The application integrates with the Clever Tour backend API:

- **Development**: `https://api-dev.clever-tour.com`
- **Production**: `https://api.clever-tour.com`

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (if available)
npm test
```

## 📊 Monitoring

### Application Logs
```bash
# Development
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=clever-tour-frontend-dev" --limit=50

# Production
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=clever-tour-frontend-prod" --limit=50
```

### Service Status
```bash
# Development
gcloud run services describe clever-tour-frontend-dev --region=asia-east1

# Production
gcloud run services describe clever-tour-frontend-prod --region=asia-east1
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Deployment Failures**
   - Verify GitHub secrets are set correctly
   - Check GCP service account permissions
   - Review Cloud Run quotas

3. **API Connection Issues**
   - Verify API URLs are correct
   - Check network connectivity
   - Review API endpoint availability

### Getting Help

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions
2. Review GitHub Actions logs for deployment issues
3. Check Cloud Run logs for runtime issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- **GitHub Repository**: https://github.com/Sean2411/clever-tour-frontend
- **Development API**: https://api-dev.clever-tour.com
- **Production API**: https://api.clever-tour.com
- **API Documentation**: https://api.clever-tour.com/api-docs/
