import { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse(`You typed: ${input}`);
    setInput('');
  };

  const getProofread = async () => {
  
  }

  return (
    <div className="p-4 font-sans min-w-[400px] max-w-[600px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className=" py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type something..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <p className="mt-0 text-gray-700">{response}</p>
    </div>
  );
}
