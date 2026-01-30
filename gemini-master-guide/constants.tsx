
import React from 'react';
import { Step } from './types';

export const STEPS: Step[] = [
  {
    id: 1,
    title: "Tayyorgarlik",
    description: "Sizda aniq savol yoki tahlil qilinishi kerak bo'lgan rasm/fayl tayyor bo'lishi kerak.",
    icon: "📝"
  },
  {
    id: 2,
    title: "Faylni tanlash",
    description: "Pastdagi 'Fayl tanlash' tugmasini bosing va kompyuteringizdan kerakli rasmni yuklang.",
    icon: "📁"
  },
  {
    id: 3,
    title: "Vazifani yozish",
    description: "Matn maydoniga AI nima qilishi kerakligini yozing (masalan: 'Ushbu rasmdagi xatolarni top').",
    icon: "⌨️"
  },
  {
    id: 4,
    title: "Yuborish",
    description: "'Yuborish' tugmasini bosing va Gemini AI javobini kuting.",
    icon: "🚀"
  },
  {
    id: 5,
    title: "Natijani ko'rish",
    description: "AI tahlilini o'qing va kerak bo'lsa qo'shimcha savollar bering.",
    icon: "✨"
  }
];
