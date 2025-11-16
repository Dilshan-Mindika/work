import { NextRequest, NextResponse } from "next/server";
import { checkEnvironmentVariables, getSetupInstructions, validateEnvVariable } from "@/lib/env-checker";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger({ component: "env-check-api" });

/**
 * GET endpoint to check environment variables status
 * @param req NextRequest object
 * @returns Response with environment variables status
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const variable = searchParams.get("variable");
    
    if (variable) {
      // Validate specific variable
      const validation = validateEnvVariable(variable);
      return NextResponse.json(validation);
    }
    
    // Get overall status
    const envResult = checkEnvironmentVariables();
    const setupInstructions = getSetupInstructions();
    
    logger.info("Environment variables status requested", {
      isComplete: envResult.isComplete,
      missingVariables: envResult.missingVariables,
      totalVariables: envResult.totalVariables,
    });
    
    return NextResponse.json({
      ...envResult,
      setupInstructions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error checking environment variables", error as Error);
    
    return NextResponse.json(
      {
        error: "Failed to check environment variables",
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to validate environment variables
 * @param req NextRequest object
 * @returns Response with validation results
 */
export async function POST(req: NextRequest) {
  try {
    const { variables } = await req.json();
    
    if (!variables || !Array.isArray(variables)) {
      return NextResponse.json(
        { error: "Variables array is required" },
        { status: 400 }
      );
    }
    
    const results = variables.map((variable: string) => ({
      variable,
      ...validateEnvVariable(variable),
    }));
    
    logger.info("Environment variables validation requested", {
      variablesCount: variables.length,
    });
    
    return NextResponse.json({
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error validating environment variables", error as Error);
    
    return NextResponse.json(
      {
        error: "Failed to validate environment variables",
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
