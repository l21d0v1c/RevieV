"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailyCardProps {
  id: number;
  title: string;
  content: string;
  onDismiss: (id: number) => void;
  backgroundImageUrl?: string; // Nouvelle prop pour l'image de fond
}

const DailyCard: React.FC<DailyCardProps> = ({ id, title, content, onDismiss, backgroundImageUrl }) => {
  return (
    <Card
      className="w-full max-w-sm sm:max-w-md mx-auto text-gray-900 border-silver-dark shadow-lg relative bg-transparent overflow-hidden"
      style={backgroundImageUrl ? { backgroundImage: `url('${backgroundImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Overlay pour améliorer la lisibilité du texte sur l'image de fond */}
      <div className="absolute inset-0 bg-white opacity-5 z-10"></div> 
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDismiss(id)}
        className="absolute top-2 left-2 h-6 w-6 text-gray-600 hover:text-black z-30"
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader className="relative z-20">
        <CardTitle className="text-4xl sm:text-5xl font-bold text-black text-center font-satisfy pt-4">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-20 text-xl sm:text-2xl text-center text-gray-800 p-4 sm:p-6">
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};

export default DailyCard;
