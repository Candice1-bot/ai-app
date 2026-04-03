import { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
type Props = {
   onSubmit: (prompt: string) => void;
};
const ChatInput = ({ onSubmit }: Props) => {
   const [prompt, setPrompt] = useState('');
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim()) return;
      onSubmit(prompt);
      setPrompt(''); // clear after submit
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(e as any); // manually trigger submit
      }
   };
   return (
      <form
         onSubmit={handleSubmit}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
         <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            maxLength={1000}
            className="w-full border-0 focus:outline-none resize-none"
         />
         <Button disabled={!prompt.trim()} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
