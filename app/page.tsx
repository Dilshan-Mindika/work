import { redirect } from 'next/navigation';
import { checkEnvironmentVariables } from '@/lib/env-checker';

export default function RootPage() {
  // Use the same env-checker function as middleware for consistency
  const envResult = checkEnvironmentVariables();
  
  // If environment is incomplete, redirect to setup
  if (!envResult.isComplete) {
    redirect('/setup');
  }
  
  // If environment is complete, redirect to default locale
  redirect('/en');
}
