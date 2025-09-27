"use client";

import React, { useEffect, useState } from 'react';
import DailyCard from '@/components/DailyCard';
import DailyTodoList from '@/components/DailyTodoList';
import CardNavigationButtons from '@/components/CardNavigationButtons';
import BackgroundCarousel from '@/components/BackgroundCarousel';
import { getDayOfYear, isFirstOfMonth, isFirstOfQuarter, isJanuaryFirst } from '@/utils/date';
import { seededShuffle } from '@/utils/shuffle';
import backgroundImages from '../data/backgroundImages.json';
import { cardBackgrounds } from '../data/cardBackgrounds'; // Import des fonds de carte

interface CardData {
  id: number;
  title: string;
  content: string;
  type: 'daily' | 'monthly' | 'quarterly' | 'yearly'; // Ajout du type de carte
}

const LOCAL_STORAGE_CARD_STACK_INDEX_KEY = 'current_card_stack_index';
const LOCAL_STORAGE_DATE_KEY = 'dismissed_cards_date';

const IndexPage = () => {
  const [cardsStack, setCardsStack] = useState<CardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [retriggeredCard, setRetriggeredCard] = useState<CardData | null>(null);

  const today = new Date();

  useEffect(() => {
    const initializeCards = async () => {
      const cards = await import('../data/cards.json');
      const monthlySpecialCards = await import('../data/monthlySpecialCards.json');
      const quarterlySpecialCards = await import('../data/quarterlySpecialCards.json');
      const january1stSpecialCards = await import('../data/january1stSpecialCards.json');

      const cardsData: CardData[] = cards.default.map(card => ({ ...card, type: 'daily' }));
      const monthlySpecialCardsData: CardData[] = monthlySpecialCards.default.map(card => ({ ...card, type: 'monthly' }));
      const quarterlySpecialCardsData: CardData[] = quarterlySpecialCards.default.map(card => ({ ...card, type: 'quarterly' }));
      const january1stSpecialCardsData: CardData[] = january1stSpecialCards.default.map(card => ({ ...card, type: 'yearly' }));

      const todayString = today.toDateString();
      const cardsToDisplayToday: CardData[] = [];

      const getDailyCard = (date: Date): CardData => {
        const cardIndices = Array.from({ length: cardsData.length }, (_, i) => i);
        const shuffledCardIndices = seededShuffle(cardIndices, date.getFullYear());
        const dayOfYear = getDayOfYear(date);
        const dailyCardIndexInShuffledArray = (dayOfYear - 1) % shuffledCardIndices.length;
        const actualCardDataIndex = shuffledCardIndices[dailyCardIndexInShuffledArray];
        return { ...cardsData[actualCardDataIndex], type: 'daily' };
      };

      const getMonthlyCard = (date: Date): CardData | undefined => {
        const currentMonth = date.getMonth();
        return monthlySpecialCardsData[currentMonth];
      };

      const getQuarterlyCard = (date: Date): CardData | undefined => {
        const currentMonth = date.getMonth();
        const quarterIndex = Math.floor(currentMonth / 3);
        return quarterlySpecialCardsData[quarterIndex];
      };

      const getJanuary1stCard = (): CardData | undefined => {
        return january1stSpecialCardsData.length > 0 ? january1stSpecialCardsData[0] : undefined;
      };

      if (isJanuaryFirst(today)) {
        const jan1stCard = getJanuary1stCard();
        if (jan1stCard) cardsToDisplayToday.push(jan1stCard);
        const q1Card = getQuarterlyCard(today);
        if (q1Card) cardsToDisplayToday.push(q1Card);
        const janCard = getMonthlyCard(today);
        if (janCard) cardsToDisplayToday.push(janCard);
        cardsToDisplayToday.push(getDailyCard(today));
      } else if (isFirstOfQuarter(today)) {
        const qCard = getQuarterlyCard(today);
        if (qCard) cardsToDisplayToday.push(qCard);
        const mCard = getMonthlyCard(today);
        if (mCard) cardsToDisplayToday.push(mCard);
        cardsToDisplayToday.push(getDailyCard(today));
      } else if (isFirstOfMonth(today)) {
        const mCard = getMonthlyCard(today);
        if (mCard) cardsToDisplayToday.push(mCard);
        cardsToDisplayToday.push(getDailyCard(today));
      } else {
        cardsToDisplayToday.push(getDailyCard(today));
      }

      setCardsStack(cardsToDisplayToday);

      const savedDate = localStorage.getItem(LOCAL_STORAGE_DATE_KEY);
      if (savedDate === todayString) {
        const savedIndex = localStorage.getItem(LOCAL_STORAGE_CARD_STACK_INDEX_KEY);
        if (savedIndex !== null) {
          setCurrentCardIndex(parseInt(savedIndex, 10));
        }
      } else {
        setCurrentCardIndex(0);
        localStorage.removeItem(LOCAL_STORAGE_CARD_STACK_INDEX_KEY);
      }
      localStorage.setItem(LOCAL_STORAGE_DATE_KEY, todayString);
    };

    initializeCards();
  }, []);

  const handleDismissCard = () => {
    const nextIndex = currentCardIndex + 1;
    if (nextIndex < cardsStack.length) {
      setCurrentCardIndex(nextIndex);
      localStorage.setItem(LOCAL_STORAGE_CARD_STACK_INDEX_KEY, nextIndex.toString());
    } else {
      setCurrentCardIndex(cardsStack.length);
      localStorage.setItem(LOCAL_STORAGE_CARD_STACK_INDEX_KEY, cardsStack.length.toString());
    }
  };

  const getCardBackgroundImage = (cardType: CardData['type']): string | undefined => {
    switch (cardType) {
      case 'daily':
        return cardBackgrounds.daily;
      case 'monthly':
        return cardBackgrounds.monthly; 
      case 'quarterly':
        return cardBackgrounds.quarterly;
      case 'yearly':
        return cardBackgrounds.yearly; // Utilisation de la nouvelle image de fond
      default:
        return undefined;
    }
  };

  const handleShowQuarterly = async () => {
    const quarterlySpecialCards = await import('../data/quarterlySpecialCards.json');
    const quarterlySpecialCardsData: CardData[] = quarterlySpecialCards.default.map(card => ({ ...card, type: 'quarterly' }));
    const currentMonth = today.getMonth();
    const quarterIndex = Math.floor(currentMonth / 3);
    const card = quarterlySpecialCardsData[quarterIndex];
    if (card) {
      setRetriggeredCard(card);
    }
  };

  const handleShowMonthly = async () => {
    const monthlySpecialCards = await import('../data/monthlySpecialCards.json');
    const monthlySpecialCardsData: CardData[] = monthlySpecialCards.default.map(card => ({ ...card, type: 'monthly' }));
    const currentMonth = today.getMonth();
    const card = monthlySpecialCardsData[currentMonth];
    if (card) {
      setRetriggeredCard(card);
    }
  };

  const handleShowDaily = async () => {
    const cards = await import('../data/cards.json');
    const cardsData: CardData[] = cards.default.map(card => ({ ...card, type: 'daily' }));
    const cardIndices = Array.from({ length: cardsData.length }, (_, i) => i);
    const shuffledCardIndices = seededShuffle(cardIndices, today.getFullYear());
    const dayOfYear = getDayOfYear(today);
    const dailyCardIndexInShuffledArray = (dayOfYear - 1) % shuffledCardIndices.length;
    const actualCardDataIndex = shuffledCardIndices[dailyCardIndexInShuffledArray];
    const card = cardsData[actualCardDataIndex];
    if (card) {
      setRetriggeredCard(card);
    }
  };

  const cardToDisplay = cardsStack[currentCardIndex];

  if (cardsStack.length === 0 && !retriggeredCard) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gray-900 text-gray-100 font-satisfy">
        <BackgroundCarousel images={backgroundImages} />
        <div className="relative z-20 text-3xl">Chargement des cartes du jour...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <BackgroundCarousel images={backgroundImages} />

      <div className="relative z-20 flex flex-col flex-grow">
        <CardNavigationButtons
          onShowQuarterly={handleShowQuarterly}
          onShowMonthly={handleShowMonthly}
          onShowDaily={handleShowDaily}
          currentDate={today}
        />

        <div className="flex-grow">
          <DailyTodoList />
        </div>
      </div>

      {retriggeredCard ? (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <DailyCard
            id={retriggeredCard.id}
            title={retriggeredCard.title}
            content={retriggeredCard.content}
            onDismiss={() => setRetriggeredCard(null)}
            backgroundImageUrl={getCardBackgroundImage(retriggeredCard.type)}
          />
        </div>
      ) : (
        cardToDisplay && currentCardIndex < cardsStack.length && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <DailyCard
              id={cardToDisplay.id}
              title={cardToDisplay.title}
              content={cardToDisplay.content}
              onDismiss={handleDismissCard}
              backgroundImageUrl={getCardBackgroundImage(cardToDisplay.type)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default IndexPage;
