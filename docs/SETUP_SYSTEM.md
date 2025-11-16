# Application Setup System

## Overview

The application setup system provides a comprehensive way to check and configure environment variables, with step-by-step instructions for setting up all required services. This system helps developers quickly identify missing configuration and provides clear guidance on how to set up each service.

## Features

### 🔍 **Environment Variable Checking**
- **Comprehensive validation** of all required environment variables
- **Real-time status checking** with detailed error messages
- **Categorized organization** by service type (Clerk, Database, Stripe, etc.)
- **Format validation** for API keys and connection strings

### 📋 **Step-by-Step Setup Instructions**
- **Service-specific guides** for each required service
- **Direct links** to service dashboards and documentation
- **Copy-paste ready** environment variable templates
- **Visual progress indicators** for setup completion

### 🎨 **Beautiful UI**
- **Theme-consistent design** that matches your application
- **Responsive layout** that works on all devices
- **Dark mode support** with proper contrast
- **Loading states** and error handling

### 🔄 **Automatic Redirects**
- **Middleware integration** to redirect users when setup is incomplete
- **Production-ready** environment checking
- **Configurable** setup requirements

## Files Created

### 1. **Environment Checker Utility** (`lib/env-checker.ts`)
```typescript
// Main functions:
- checkEnvironmentVariables(): EnvCheckResult
- getSetupInstructions(): SetupInstructions
- validateEnvVariable(name: string): ValidationResult
```

### 2. **Setup Page** (`app/setup/page.tsx`)
- Beautiful, responsive setup interface
- Real-time environment variable status
- Step-by-step setup instructions
- Copy template functionality

### 3. **API Endpoint** (`app/api/setup/env-check/route.ts`)
- RESTful API for environment checking
- Individual variable validation
- Bulk validation support

### 4. **Middleware Integration** (`middleware.ts`)
- Automatic redirect to setup page
- Production environment checking
- Configurable setup requirements

### 5. **Environment Template** (`env.template`)
- Complete template with all required variables
- Detailed comments and examples
- Ready-to-use configuration

## Usage

### 1. **Access Setup Page**
Navigate to `/setup` in your browser to see the setup page.

### 2. **Check Environment Status**
The page will automatically show:
- ✅ **Complete**: All required variables are set
- ❌ **Incomplete**: Missing required variables
- 📊 **Progress**: X/Y variables configured

### 3. **Follow Setup Instructions**
For each incomplete service, follow the step-by-step instructions:
1. Click on service links to open dashboards
2. Copy API keys and secrets
3. Add them to your `.env.local` file
4. Restart your development server
5. Refresh the setup page

### 4. **Copy Environment Template**
Click "Copy Template" to get a ready-to-use `.env.local` template with all required variables.

## Environment Variables

### **Required Variables**

#### **Clerk Authentication**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
```

#### **Database**
```bash
MONGO_URI=mongodb://localhost:27017/your-database
```

#### **Stripe Payments**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### **Lemon Squeezy Payments**
```bash
LEMONSQUEEZY_API_KEY=your_api_key
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
```

#### **Email Services**
```bash
RESEND_API_KEY=re_...
```

#### **Application Settings**
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **Optional Variables**
```bash
POSTHOG_KEY=phc_...
POSTHOG_HOST=https://app.posthog.com
HEALTH_CHECK_TOKEN=your_secure_token
SECURITY_TEST_TOKEN=your_secure_token
CHECK_ENV=true
```

## Setup Instructions by Service

### **1. Clerk Authentication**

1. **Go to [Clerk Dashboard](https://clerk.com)**
2. **Create a new application** or select existing one
3. **Go to 'API Keys' section**
4. **Copy the 'Publishable key'** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
5. **Copy the 'Secret key'** → `CLERK_SECRET_KEY`
6. **Go to 'Webhooks' section**
7. **Create a new webhook** with URL: `https://your-domain.com/api/webhook/clerk`
8. **Copy the 'Signing secret'** → `CLERK_WEBHOOK_SIGNING_SECRET`

### **2. MongoDB Database**

1. **Set up MongoDB** (MongoDB Atlas recommended)
2. **Create a new cluster** or use existing one
3. **Go to 'Database Access'** and create a user
4. **Go to 'Network Access'** and whitelist your IP
5. **Click 'Connect'** and choose 'Connect your application'
6. **Copy the connection string**
7. **Replace `<password>`** with your user password
8. **Replace `<dbname>`** with your database name
9. **Set the complete string** as `MONGO_URI`

### **3. Stripe Payments**

1. **Go to [Stripe Dashboard](https://stripe.com)**
2. **Go to 'Developers' > 'API Keys'**
3. **Copy the 'Publishable key'** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. **Copy the 'Secret key'** → `STRIPE_SECRET_KEY`
5. **Go to 'Developers' > 'Webhooks'**
6. **Click 'Add endpoint'** with URL: `https://your-domain.com/api/webhook/stripe`
7. **Select events**: `checkout.session.completed`, `customer.subscription.updated`, etc.
8. **Copy the 'Signing secret'** → `STRIPE_WEBHOOK_SECRET`

### **4. Lemon Squeezy Payments**

1. **Go to [Lemon Squeezy Dashboard](https://lemonsqueezy.com)**
2. **Go to 'Settings' > 'API'**
3. **Generate a new API key**
4. **Copy the API key** → `LEMONSQUEEZY_API_KEY`
5. **Go to 'Settings' > 'Webhooks'**
6. **Create a new webhook** with URL: `https://your-domain.com/api/webhook/lemonsqueezy`
7. **Copy the webhook secret** → `LEMONSQUEEZY_WEBHOOK_SECRET`

### **5. Email Services (Resend)**

1. **Go to [Resend Dashboard](https://resend.com)**
2. **Go to 'API Keys' section**
3. **Create a new API key**
4. **Copy the API key** → `RESEND_API_KEY`
5. **Verify your domain** in Resend dashboard

## API Usage

### **Check Environment Status**
```bash
GET /api/setup/env-check
```

**Response:**
```json
{
  "isComplete": false,
  "totalVariables": 12,
  "missingVariables": 3,
  "categories": {
    "CLERK": {
      "name": "Clerk Authentication",
      "description": "User authentication and management",
      "variables": [...],
      "isComplete": false
    }
  },
  "setupInstructions": {
    "steps": [...]
  }
}
```

### **Validate Specific Variable**
```bash
GET /api/setup/env-check?variable=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

**Response:**
```json
{
  "isValid": true,
  "message": "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is valid"
}
```

### **Bulk Validation**
```bash
POST /api/setup/env-check
Content-Type: application/json

{
  "variables": ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"]
}
```

## Configuration

### **Enable Environment Checking**
Add to your `.env.local`:
```bash
CHECK_ENV=true
```

### **Production Behavior**
In production (`NODE_ENV=production`), the middleware will automatically:
- Check environment variables on every request
- Redirect to `/setup` if configuration is incomplete
- Allow access to setup page and API endpoints

### **Development Behavior**
In development, environment checking is optional unless `CHECK_ENV=true` is set.

## Customization

### **Adding New Environment Variables**
Edit `lib/env-checker.ts` and add to `ENV_CONFIG`:

```typescript
NEW_SERVICE: {
  name: "New Service",
  description: "Description of the service",
  variables: [
    {
      name: "NEW_SERVICE_API_KEY",
      description: "API key for new service",
      example: "your_api_key_here",
      required: true,
    },
  ],
},
```

### **Custom Validation**
Add validation patterns in `validateEnvVariable()`:

```typescript
NEW_SERVICE_API_KEY: {
  pattern: /^[a-zA-Z0-9]{32,}$/,
  message: "Invalid API key format",
},
```

### **Custom Setup Instructions**
Add instructions in `getSetupInstructions()`:

```typescript
case "NEW_SERVICE":
  instructions = [
    "1. Go to https://newservice.com",
    "2. Create an account",
    "3. Generate API key",
    "4. Copy to NEW_SERVICE_API_KEY",
  ];
  break;
```

## Security Considerations

### **Environment Variable Security**
- ✅ **Never commit** `.env.local` to version control
- ✅ **Use different keys** for development and production
- ✅ **Rotate keys regularly** in production
- ✅ **Use environment-specific** configuration

### **Setup Page Security**
- ✅ **Only accessible** when configuration is incomplete
- ✅ **No sensitive data** exposed in the UI
- ✅ **Validation only** - no actual configuration changes
- ✅ **Production redirects** prevent incomplete deployments

## Troubleshooting

### **Common Issues**

#### **1. Setup Page Not Loading**
- Check if all required UI components are available
- Verify Tailwind CSS is properly configured
- Check browser console for errors

#### **2. Environment Variables Not Detected**
- Restart your development server after adding variables
- Check `.env.local` file is in the project root
- Verify variable names match exactly (case-sensitive)

#### **3. Validation Errors**
- Check API key formats match expected patterns
- Verify connection strings are properly formatted
- Test individual variables using the API endpoint

#### **4. Middleware Redirects**
- Check `CHECK_ENV` environment variable
- Verify middleware configuration
- Test with different `NODE_ENV` values

### **Debug Mode**
Enable debug logging by setting:
```bash
DEBUG=env-checker
```

## Best Practices

### **1. Development Workflow**
1. **Start with setup page** to check configuration
2. **Follow step-by-step instructions** for each service
3. **Test each service** after configuration
4. **Use template** for consistent setup

### **2. Production Deployment**
1. **Verify all variables** are set in production environment
2. **Test setup page** before going live
3. **Monitor environment status** regularly
4. **Keep setup instructions** updated

### **3. Team Collaboration**
1. **Share setup instructions** with team members
2. **Use consistent** environment variable names
3. **Document custom** configurations
4. **Regular setup validation** in CI/CD

## Future Enhancements

### **Planned Features**
- 🔄 **Auto-setup scripts** for common services
- 📊 **Setup analytics** and progress tracking
- 🔐 **Encrypted environment** variable storage
- 🌐 **Multi-environment** configuration support
- 📱 **Mobile-friendly** setup interface
- 🔔 **Setup notifications** and reminders

### **Integration Ideas**
- **CI/CD integration** for automated setup validation
- **Docker support** for containerized environments
- **Cloud provider** integration (AWS, GCP, Azure)
- **Monitoring integration** for setup status alerts

## Conclusion

The application setup system provides a comprehensive, user-friendly way to configure your application environment. With step-by-step instructions, real-time validation, and beautiful UI, developers can quickly get up and running with minimal friction.

The system is designed to be:
- **Easy to use** with clear instructions
- **Comprehensive** with all required services
- **Secure** with proper validation
- **Extensible** for custom requirements
- **Production-ready** with proper error handling

Visit `/setup` to get started! 🚀
