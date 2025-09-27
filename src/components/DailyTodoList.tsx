"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const LOCAL_STORAGE_KEY = 'daily_todo_list_content';
const LOCAL_STORAGE_DATE_KEY = 'daily_todo_list_date';

const DailyTodoList: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedDate = localStorage.getItem(LOCAL_STORAGE_DATE_KEY);
    const today = new Date().toDateString();

    if (savedDate === today) {
      const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedContent) {
        setContent(savedContent);
      }
    } else {
      setContent('');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    localStorage.setItem(LOCAL_STORAGE_DATE_KEY, today);
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [content, isEditing]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, content);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8 bg-silver-DEFAULT text-gray-900 overflow-auto">
      <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 text-center font-satisfy">
        Volontés d'aujourd'hui
      </h2>
      <div className="flex-grow relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          readOnly={!isEditing}
          placeholder="Écrivez ici ce que vous voulez faire en ce jour..."
          className={`w-full p-3 sm:p-4 bg-transparent border border-white rounded-lg text-xl sm:text-2xl focus:outline-none font-satisfy text-white`}
          style={{ minHeight: '150px', overflowY: 'hidden' }}
        />
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex space-x-2">
          {isEditing ? (
            <Button 
              onClick={handleSave} 
              className="bg-silver-medium hover:bg-silver-medium-hover text-white hover:text-black
                         w-24 h-12 sm:w-28 sm:h-14 lg:w-32 lg:h-16 relative overflow-hidden 
                         [clip-path:polygon(50%_0%,_100%_100%,_0%_100%)] 
                         [box-shadow:0_0_0_2px_white] 
                         flex items-center justify-center font-satisfy text-xl sm:text-2xl pt-4 sm:pt-6"
            >
              Save
            </Button>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)} 
              className="bg-silver-medium hover:bg-silver-medium-hover text-white hover:text-black
                         w-24 h-12 sm:w-28 sm:h-14 lg:w-32 lg:h-16 relative overflow-hidden 
                         [clip-path:polygon(50%_0%,_100%_100%,_0%_100%)] 
                         [box-shadow:0_0_0_2px_white] 
                         flex items-center justify-center font-satisfy text-xl sm:text-2xl pt-4 sm:pt-6"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTodoList;
