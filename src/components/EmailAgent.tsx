'use client';

import { useState } from 'react';
import { analyzeSentiment, summarizeEmail, shouldRespondToEmail, pickEmailWriter, generateEmailReply } from '@/lib/api';
import { Toaster } from 'react-hot-toast';

export default function EmailAgent() {
  const [email, setEmail] = useState('');
  const [emailReply, setEmailReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailReply('');

    try {
      // Analyze sentiment and summarize email in parallel
      const [sentimentAnalysis, emailSummary] = await Promise.all([
        analyzeSentiment(email),
        summarizeEmail(email)
      ]);

      const { sentiment } = sentimentAnalysis;
      const { summary } = emailSummary;

      // Make a decision about the email response
      const { respond, category, byWhen, priority } = await shouldRespondToEmail(summary, sentiment);

      if (!respond) {
        setEmailReply('No response needed for this email.');
        return;
      }

      // Pick email writer
      const { tone } = await pickEmailWriter(summary, sentiment);

      // Generate the email response
      await generateEmailReply(tone, summary, setEmailReply);

    } catch (error) {
      console.error('Error:', error);
      setEmailReply('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Paste your email here..."
          className="w-full h-32 p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Analyze Email'}
        </button>
      </form>

      {emailReply && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Response:</h2>
          <div className="p-4 border rounded whitespace-pre-wrap">
            {emailReply}
          </div>
        </div>
      )}
    </div>
  );
}
