import axios from 'axios';
import { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await proofread(input)
      .catch((error) => {
        console.error('Error:', error);
        return 'Error: ' + error.message;
      });
    setResponse(result || 'No response');
    setInput('');
  };

  async function proofread(text: string) {
  setResponse('Loading...');

  try {
    const res = await axios.post('http://localhost:11434/api/generate', {
      model: 'gnokit/improve-grammar',
      prompt: text,
      stream: false,
    });

    console.log('Corrected:', res.data.response);
    return res.data.response;
  } catch (error) {
    console.error('Error:', error);
  }
}

  return (
    <div className="p-4 font-sans flex flex-col items-center justify-between h-screen">
      <p className="p-2 text-gray-700 bg-white rounded w-100 h-70">{response}</p>
      <form onSubmit={handleSubmit}  className='w-100 flex items-center justify-between gap-2'>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
          placeholder="Type something..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
