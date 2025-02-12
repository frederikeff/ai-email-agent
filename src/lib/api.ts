import { getRunner } from 'langbase';
import { toast } from 'react-hot-toast';
import { Langbase } from 'langbase';
import { NextResponse } from 'next/server';

export const analyzeSentiment = async (email: string) => {
	const response = await fetch('/api/sentiment', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email })
	});

	const sentimentAnalysis = await response.json();
	return sentimentAnalysis;
};

  
  export const summarizeEmail = async (email: string) => {
	const response = await fetch('/api/summarize', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email })
	});

	const summarizedEmail = await response.json();
	return summarizedEmail;
};

  
  export const shouldRespondToEmail = async (summary: string, sentiment: string) => {
	const response = await fetch('/api/respond', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ summary, sentiment })
	});

	const shouldRespond = await response.json();
	return shouldRespond;
};

  
  export const pickEmailWriter = async (summary: string, sentiment: string) => {
	const response = await fetch('/api/pick-email-writer', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ summary, sentiment })
	});

	const writer = await response.json();
	return writer;
};


  export const generateEmailReply = async (
    writer: string, 
    emailSummary: string,
    setEmailReply: (prev: string) => void
) => {
      const response = await fetch('/api/email-writer', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ writer, emailSummary })
      });
  
      if (!response.ok) {
          const error = await response.json();
          toast.error(error);
          return;
      }

      let responseText = ''
  
      if (response.body) {
          const stream = getRunner(response.body);
  
          for await (const chunk of stream) {
              const content = chunk?.choices[0]?.delta?.content || '';
              if (content) {
                responseText += content;
                setEmailReply(responseText); 
              }
          }
      }
  
      return responseText;
  };
  