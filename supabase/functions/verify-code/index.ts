import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface VerifyCodeRequest {
  email: string;
  code: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, code }: VerifyCodeRequest = await req.json();

    if (!email || !code) {
      throw new Error("Email e código são obrigatórios");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check verification code
    const { data: verification, error: verifyError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("code", code)
      .eq("used", false)
      .single();

    if (verifyError || !verification) {
      return new Response(
        JSON.stringify({ error: "Código inválido ou expirado" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if code is expired
    const expiresAt = new Date(verification.expires_at);
    if (expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ error: "Código expirado. Solicite um novo." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Mark code as used
    await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verification.id);

    // Get user info
    const { data: user } = await supabase
      .from("users")
      .select("email, plan, status")
      .eq("email", normalizedEmail)
      .single();

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          email: user?.email,
          plan: user?.plan,
          hasAccess: true,
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error verifying code:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao verificar código";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
