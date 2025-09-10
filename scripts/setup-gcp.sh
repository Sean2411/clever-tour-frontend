#!/bin/bash

# Clever Tour Frontend - GCP Setup Script
# This script helps set up Google Cloud Platform for deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gcloud is installed
check_gcloud() {
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed. Please install it first:"
        echo "https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    print_success "gcloud CLI is installed"
}

# Get project ID
get_project_id() {
    if [ -z "$PROJECT_ID" ]; then
        read -p "Enter your Google Cloud Project ID: " PROJECT_ID
    fi
    
    if [ -z "$PROJECT_ID" ]; then
        print_error "Project ID is required"
        exit 1
    fi
    
    print_status "Using project: $PROJECT_ID"
}

# Enable required APIs
enable_apis() {
    print_status "Enabling required APIs..."
    
    gcloud services enable run.googleapis.com --project=$PROJECT_ID
    gcloud services enable containerregistry.googleapis.com --project=$PROJECT_ID
    gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
    
    print_success "APIs enabled successfully"
}

# Create service account
create_service_account() {
    print_status "Creating service account..."
    
    # Check if service account already exists
    if gcloud iam service-accounts describe github-actions@$PROJECT_ID.iam.gserviceaccount.com --project=$PROJECT_ID &> /dev/null; then
        print_warning "Service account already exists"
    else
        gcloud iam service-accounts create github-actions \
            --display-name="GitHub Actions Service Account" \
            --project=$PROJECT_ID
        print_success "Service account created"
    fi
}

# Grant permissions
grant_permissions() {
    print_status "Granting permissions to service account..."
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
        --role="roles/run.admin"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
        --role="roles/storage.admin"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
        --role="roles/iam.serviceAccountUser"
    
    print_success "Permissions granted"
}

# Create and download service account key
create_service_account_key() {
    print_status "Creating service account key..."
    
    mkdir -p keys
    gcloud iam service-accounts keys create keys/github-actions-key.json \
        --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com \
        --project=$PROJECT_ID
    
    print_success "Service account key created at keys/github-actions-key.json"
}

# Display next steps
show_next_steps() {
    echo ""
    print_success "GCP setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Add the following secrets to your GitHub repository:"
    echo "   - GCP_PROJECT_ID: $PROJECT_ID"
    echo "   - GCP_SA_KEY: (content of keys/github-actions-key.json)"
    echo ""
    echo "2. To add secrets:"
    echo "   - Go to your GitHub repository"
    echo "   - Settings → Secrets and variables → Actions"
    echo "   - Click 'New repository secret'"
    echo ""
    echo "3. Test the deployment by pushing to the main branch"
    echo ""
    print_warning "IMPORTANT: Keep the service account key secure and never commit it to version control!"
}

# Main execution
main() {
    echo "🚀 Clever Tour Frontend - GCP Setup"
    echo "===================================="
    echo ""
    
    check_gcloud
    get_project_id
    enable_apis
    create_service_account
    grant_permissions
    create_service_account_key
    show_next_steps
}

# Run main function
main "$@"
