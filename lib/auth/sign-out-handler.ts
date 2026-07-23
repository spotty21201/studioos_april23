export type SignOutResult = {
  success: boolean;
  errorMessage: string | null;
};

export function handleSignOutResult(result: {
  error: { message: string } | null;
}): SignOutResult {
  if (result.error) {
    return {
      success: false,
      errorMessage: "Unable to sign out right now. Please try again.",
    };
  }
  return {
    success: true,
    errorMessage: null,
  };
}
