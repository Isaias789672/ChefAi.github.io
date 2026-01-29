import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SendCodeRequest {
  email: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email }: SendCodeRequest = await req.json();

    if (!email || !email.includes("@")) {
      throw new Error("Email inválido");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists and has active subscription
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email, plan, status")
      .eq("email", normalizedEmail)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Email não encontrado. Por favor, adquira um plano." }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (user.status !== "active" || user.plan === "free") {
      return new Response(
        JSON.stringify({ error: "Você não possui um plano ativo." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store code in database
    const { error: insertError } = await supabase
      .from("verification_codes")
      .upsert({
        email: normalizedEmail,
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
      }, {
        onConflict: "email",
      });

    if (insertError) {
      console.error("Error storing code:", insertError);
      throw new Error("Erro ao gerar código de verificação");
    }

    // Send email with code
    const emailResponse = await resend.emails.send({
      from: "ChefAI <noreply@resend.dev>",
      to: [normalizedEmail],
      subject: "Seu código de acesso ChefAI",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
          <div style="max-width: 400px; margin: 0 auto; background-color: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="font-size: 24px; color: #1a1a1a; margin: 0;">ChefAI</h1>
              <p style="color: #666; margin-top: 8px;">Seu assistente culinário inteligente</p>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              Olá! Use o código abaixo para acessar sua conta:
            </p>
            
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <p style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; margin: 0;">
                ${code}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center;">
              Este código expira em <strong>10 minutos</strong>.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Se você não solicitou este código, ignore este email.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Verification email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Código enviado para seu email" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending verification code:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao enviar código";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
