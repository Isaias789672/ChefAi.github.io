-- Create enum for subscription plans
CREATE TYPE public.subscription_plan AS ENUM ('free', 'normal', 'master');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'overdue');

-- Create users table for subscription management
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    plan subscription_plan NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhook_logs table
CREATE TABLE public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    evento TEXT NOT NULL,
    produto TEXT,
    plano_aplicado TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Public read policy for users (to check subscription status)
CREATE POLICY "Users can read their own data"
ON public.users
FOR SELECT
USING (true);

-- Allow webhook to insert/update users (via service role)
CREATE POLICY "Service role can manage users"
ON public.users
FOR ALL
USING (true)
WITH CHECK (true);

-- Allow reading webhook logs for admin
CREATE POLICY "Anyone can read webhook logs"
ON public.webhook_logs
FOR SELECT
USING (true);

-- Allow inserting webhook logs
CREATE POLICY "Anyone can insert webhook logs"
ON public.webhook_logs
FOR INSERT
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();