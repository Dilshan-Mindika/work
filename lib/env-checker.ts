import { createLogger } from "@/lib/utils/logger";

const logger = createLogger({ component: "env-checker" });

export interface EnvVariable {
  name: string;
  value: string | undefined;
  required: boolean;
  description: string;
  category: string;
  example?: string;
  isSet: boolean;
}

export interface EnvCheckResult {
  isComplete: boolean;
  totalVariables: number;
  missingVariables: number;
  categories: {
    [key: string]: {
      name: string;
      description: string;
      variables: EnvVariable[];
      isComplete: boolean;
    };
  };
}

/**
 * Environment variables configuration - Essential services only
 */
const ENV_CONFIG = {
  // Clerk Authentication
  CLERK: {
    name: "Clerk Authentication",
    description: "User authentication and management",
    variables: [
      {
        name: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
        description: "Clerk publishable key for frontend authentication",
        example: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        required: true,
      },
      {
        name: "CLERK_SECRET_KEY",
        description: "Clerk secret key for backend operations",
        example: "sk_test_...",
        required: true,
      },
      {
        name: "CLERK_WEBHOOK_SIGNING_SECRET",
        description: "Clerk webhook signing secret for webhook verification",
        example: "whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        required: true,
      },
    ],
  },
  
  // Database
  DATABASE: {
    name: "Database",
    description: "MongoDB connection and configuration",
    variables: [
      {
        name: "MONGO_URI",
        description: "MongoDB connection string",
        example: "mongodb://localhost:27017/your-database-name",
        required: true,
      },
    ],
  },
  
  // Email Services
  EMAIL: {
    name: "Email Services",
    description: "Email sending and notifications",
    variables: [
      {
        name: "RESEND_API_KEY",
        description: "Resend API key for email sending",
        example: "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        required: true,
      },
    ],
  },
};

/**
 * Check environment variables and return detailed results
 */
export function checkEnvironmentVariables(): EnvCheckResult {
  const categories: EnvCheckResult["categories"] = {};
  let totalVariables = 0;
  let missingVariables = 0;
  
  for (const [categoryKey, categoryConfig] of Object.entries(ENV_CONFIG)) {
    const variables: EnvVariable[] = categoryConfig.variables.map((variable) => {
      const value = process.env[variable.name];
      const isSet = !!value && value.trim() !== "";
      
      if (!isSet && variable.required) {
        missingVariables++;
      }
      totalVariables++;
      
      return {
        ...variable,
        value,
        isSet,
        category: categoryKey,
      };
    });
    
    const categoryComplete = variables.every((variable) => !variable.required || variable.isSet);
    
    categories[categoryKey] = {
      name: categoryConfig.name,
      description: categoryConfig.description,
      variables,
      isComplete: categoryComplete,
    };
  }
  
  const isComplete = missingVariables === 0;
  
  logger.info("Environment variables check completed", {
    isComplete,
    totalVariables,
    missingVariables,
    categories: Object.keys(categories),
  });
  
  return {
    isComplete,
    totalVariables,
    missingVariables,
    categories,
  };
}

/**
 * Get setup instructions for missing variables
 */
export function getSetupInstructions(): {
  steps: Array<{
    title: string;
    description: string;
    instructions: string[];
    category: string;
    isRequired: boolean;
  }>;
} {
  const result = checkEnvironmentVariables();
  const steps: Array<{
    title: string;
    description: string;
    instructions: string[];
    category: string;
    isRequired: boolean;
  }> = [];
  
  for (const [categoryKey, category] of Object.entries(result.categories)) {
    if (!category.isComplete) {
      const missingVars = category.variables.filter((variable) => !variable.isSet && variable.required);
      
      if (missingVars.length > 0) {
        let instructions: string[] = [];
        
        switch (categoryKey) {
          case "CLERK":
            instructions = [
              "1. Go to https://clerk.com and sign up/login",
              "2. Create a new application or select existing one",
              "3. Go to 'API Keys' section in your dashboard",
              "4. Copy the 'Publishable key' to NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
              "5. Copy the 'Secret key' to CLERK_SECRET_KEY",
              "6. Go to 'Webhooks' section and create a new webhook",
              "7. Set webhook URL to: https://your-domain.com/api/webhook/clerk",
              "8. Copy the 'Signing secret' to CLERK_WEBHOOK_SIGNING_SECRET",
            ];
            break;
            
          case "DATABASE":
            instructions = [
              "1. Set up a MongoDB database (MongoDB Atlas recommended)",
              "2. Create a new cluster or use existing one",
              "3. Go to 'Database Access' and create a user",
              "4. Go to 'Network Access' and whitelist your IP",
              "5. Click 'Connect' and choose 'Connect your application'",
              "6. Copy the connection string",
              "7. Replace <password> with your user password",
              "8. Replace <dbname> with your database name",
              "9. Set the complete string as MONGO_URI",
            ];
            break;
            
          case "EMAIL":
            instructions = [
              "1. Go to https://resend.com and create an account",
              "2. Go to 'API Keys' section",
              "3. Create a new API key",
              "4. Copy the API key to RESEND_API_KEY",
              "5. Verify your domain in Resend dashboard",
            ];
            break;
            
          default:
            instructions = [
              "Please check the documentation for setup instructions.",
            ];
        }
        
        steps.push({
          title: `Setup ${category.name}`,
          description: category.description,
          instructions,
          category: categoryKey,
          isRequired: true,
        });
      }
    }
  }
  
  return { steps };
}

/**
 * Validate specific environment variable
 */
export function validateEnvVariable(name: string): {
  isValid: boolean;
  message: string;
  suggestions?: string[];
} {
  const value = process.env[name];
  
  if (!value || value.trim() === "") {
    return {
      isValid: false,
      message: `${name} is not set`,
      suggestions: [`Set ${name} in your .env.local file`],
    };
  }
  
  // Basic validation patterns
  const validations: { [key: string]: { pattern: RegExp; message: string } } = {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {
      pattern: /^pk_(test_|live_)[a-zA-Z0-9]{100,}$/,
      message: "Invalid Clerk publishable key format",
    },
    CLERK_SECRET_KEY: {
      pattern: /^sk_(test_|live_)[a-zA-Z0-9]{100,}$/,
      message: "Invalid Clerk secret key format",
    },
    CLERK_WEBHOOK_SIGNING_SECRET: {
      pattern: /^whsec_[a-zA-Z0-9]{50,}$/,
      message: "Invalid Clerk webhook signing secret format",
    },
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
      pattern: /^pk_(test_|live_)[a-zA-Z0-9]{100,}$/,
      message: "Invalid Stripe publishable key format",
    },
    STRIPE_SECRET_KEY: {
      pattern: /^sk_(test_|live_)[a-zA-Z0-9]{100,}$/,
      message: "Invalid Stripe secret key format",
    },
    STRIPE_WEBHOOK_SECRET: {
      pattern: /^whsec_[a-zA-Z0-9]{50,}$/,
      message: "Invalid Stripe webhook signing secret format",
    },
    MONGO_URI: {
      pattern: /^mongodb(\+srv)?:\/\//,
      message: "Invalid MongoDB URI format",
    },
    RESEND_API_KEY: {
      pattern: /^re_[a-zA-Z0-9]{50,}$/,
      message: "Invalid Resend API key format",
    },
  };
  
  const validation = validations[name];
  if (validation && !validation.pattern.test(value)) {
    return {
      isValid: false,
      message: validation.message,
      suggestions: [`Check the format of ${name} in your .env.local file`],
    };
  }
  
  return {
    isValid: true,
    message: `${name} is valid`,
  };
}
