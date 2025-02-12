import EmailAgent from '@/components/EmailAgent';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Email Agent</h1>
      <EmailAgent />
    </main>
  );
}
