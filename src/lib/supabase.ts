import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create a custom fetch function with better error handling and retry logic
const customFetch = async (url: string, options: RequestInit = {}) => {
  const maxRetries = 2;
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          // Preserve original headers (including apikey)
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Don't retry if we get a successful response or client errors (4xx)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Only retry on server errors (5xx) or network errors
      if (attempt === maxRetries) {
        return response;
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`Fetch attempt ${attempt + 1} failed:`, error.message);

      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000),
      );
    }
  }

  throw new Error(
    `Connection failed after ${maxRetries + 1} attempts. ${lastError?.message || "Unknown error"}`,
  );
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Connection test function
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error("Supabase error:", error);

  // Handle network/fetch errors
  if (
    error?.name === "AuthRetryableFetchError" ||
    error?.message?.includes("Failed to fetch") ||
    error?.message?.includes("Connection failed")
  ) {
    return "Unable to connect to the server. Please check:\n1. Your internet connection\n2. If Supabase project is active\n3. CORS settings are configured correctly";
  }

  // Handle rate limiting errors
  if (error?.code === "over_email_send_rate_limit") {
    return "Too many requests. Please wait a moment before trying again.";
  }

  // Handle authentication errors
  if (
    error?.code === "invalid_credentials" ||
    error?.message === "Invalid login credentials"
  ) {
    return "Email ou senha inválidos. Por favor, verifique suas credenciais.";
  }

  if (error?.code === "PGRST301") {
    return "Insufficient permissions";
  }

  if (error?.code === "23505") {
    return "This item already exists";
  }

  if (error?.code === "23503") {
    return "Referenced item not found";
  }

  return error?.message || "An unexpected error occurred";
};

// Anti-cheat validation
export const validateGameAction = async (action: string, data: any) => {
  const maxValues = {
    xenocoins_gain: 10000,
    cash_gain: 100,
    pet_stat_change: 10, // Increased from 5 to 10 to accommodate items like Premium Elixir
    item_quantity: 100,
  };

  switch (action) {
    case "currency_gain":
      if (data.amount > maxValues.xenocoins_gain) {
        throw new Error("Invalid currency gain amount");
      }
      break;
    case "pet_stat_update":
      for (const [stat, value] of Object.entries(data.stats)) {
        if (Math.abs(value as number) > maxValues.pet_stat_change) {
          throw new Error(`Invalid stat change for ${stat}`);
        }
      }
      break;
    case "item_add":
      if (data.quantity > maxValues.item_quantity) {
        throw new Error("Invalid item quantity");
      }
      break;
  }

  return true;
};
