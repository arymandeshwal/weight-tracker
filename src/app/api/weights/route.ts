import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

// Create a Supabase client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('weights')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.WEIGHT_TRACKER_SECRET}`;

  if (authHeader !== expectedAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { who, date, kg } = await req.json();

  if (!who || !date || kg === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('weights')
    .upsert({ who, date, kg }, { onConflict: 'who,date' })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
