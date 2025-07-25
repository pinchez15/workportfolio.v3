/**
 * Generate a consistent username from user data
 * Priority: firstName.lastName > username > email_prefix > user_id_fallback
 */
export function generateUsername(userData: {
  first_name?: string;
  last_name?: string;
  username?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
  email_addresses?: Array<{ email_address: string }>;
  id: string;
}): string {
  // Priority 1: firstName.lastName
  if (userData.first_name && userData.last_name) {
    const firstName = userData.first_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const lastName = userData.last_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (firstName && lastName) {
      return `${firstName}.${lastName}`;
    }
  }

  // Priority 2: username from Clerk
  if (userData.username) {
    return userData.username.toLowerCase().replace(/[^a-z0-9._-]/g, '');
  }

  // Priority 3: email prefix (handle both Clerk formats)
  const email = userData.emailAddresses?.[0]?.emailAddress || 
                userData.email_addresses?.[0]?.email_address;
  if (email) {
    const emailPrefix = email.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '');
    if (emailPrefix) {
      return emailPrefix;
    }
  }

  // Priority 4: fallback to user ID prefix
  return `user_${userData.id.slice(0, 8)}`;
}