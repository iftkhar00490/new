import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] text-neutral-900 font-sans p-12 flex items-center justify-center">
        <div className="max-w-xl w-full border border-red-200 bg-red-50/50 rounded-lg p-8">
          <h1 className="text-xl font-bold mb-4 font-mono text-red-900">// ERROR_SUPABASE_CREDENTIALS_MISSING</h1>
          <p className="text-red-800 text-xs font-mono leading-relaxed">
            Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables to connect the database.
          </p>
        </div>
      </div>
    );
  }

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: todos, error } = await supabase.from('todos').select()

    if (error) {
      throw error;
    }

    return (
      <div className="min-h-screen bg-[#fbfbfa] text-neutral-900 font-sans p-12 flex items-center justify-center">
        <div className="max-w-xl w-full border border-neutral-200 bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-4 font-mono tracking-tight">// SUPABASE_TODOS_TELEMETRY</h1>
          <p className="text-neutral-500 text-xs mb-6 font-mono">LIVE_QUERY: SELECT * FROM todos;</p>
          
          {todos && todos.length > 0 ? (
            <ul className="divide-y divide-neutral-100 font-mono text-sm">
              {todos.map((todo) => (
                <li key={todo.id} className="py-3 flex items-center justify-between">
                  <span className="font-medium">{todo.name}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-neutral-500 uppercase">
                    ID: {todo.id}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-neutral-400 font-mono text-xs border border-dashed border-neutral-200 rounded">
              No records returned from 'todos' table.
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t border-neutral-100 text-center">
            <a href="/" className="text-xs font-mono text-neutral-400 hover:text-neutral-800 transition-colors">
              &larr; Return to main system terminal
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] text-neutral-900 font-sans p-12 flex items-center justify-center">
        <div className="max-w-xl w-full border border-red-200 bg-red-50/50 rounded-lg p-8">
          <h1 className="text-xl font-bold mb-4 font-mono text-red-900">// ERROR_DB_QUERY_FAILED</h1>
          <p className="text-red-800 text-xs font-mono leading-relaxed">
            {error.message || "An error occurred while querying the todos table."}
          </p>
          <div className="mt-8 pt-4 border-t border-red-100 text-center">
            <a href="/" className="text-xs font-mono text-red-400 hover:text-red-800 transition-colors">
              &larr; Return to main system terminal
            </a>
          </div>
        </div>
      </div>
    );
  }
}
