// src/pages/Explore/topicImages.js
// Curated, verified Unsplash photo IDs for each category (free-license,
// non-premium, no visible branding). Three per category, cycled across that
// category's subpoints so every card gets a real, topic-appropriate photo.
const unsplash = (id) => `https://images.unsplash.com/${id}?fm=jpg&q=70&w=900&auto=format&fit=crop`;

export const CATEGORY_IMAGES = {
  'understanding-pmos': [
    'photo-1581832097375-e95cc1fcb3d9', // woman reading a book
    'photo-1689023542429-f6a9b1c7b402', // writing in a notebook
    'photo-1652787542567-f86c0b4c0269', // notebook + stethoscope + laptop
  ].map(unsplash),
  'fertility-reproductive-health': [
    'photo-1758272422095-8cdb2ca8a7f1', // thoughtful woman portrait
    'photo-1595875836928-4a21e19e40cd', // pregnant woman, outdoors, clothed
    'photo-1513267000941-598abe7be16f', // couple holding hands
  ].map(unsplash),
  'periods-hormones': [
    'photo-1607185073253-44296286cd82', // menstrual cups, pastel background
    'photo-1603712426309-1a050b0378c8', // menstrual cup in hand
    'photo-1605285303431-2419a0336444', // menstrual cup close-up
  ].map(unsplash),
  'skin-hair-body': [
    'photo-1620916297397-a4a5402a3c6c', // serum dropper on hand
    'photo-1619451427882-6aaaded0cc61', // applying lotion
    'photo-1609357912334-e96886c0212b', // skincare routine portrait
  ].map(unsplash),
  'long-term-health': [
    'photo-1690785884403-2bff26562857', // stethoscope with a heart
    'photo-1556833232-52da3e4bd5d8', // woman walking at sunset
    'photo-1513347884152-6aebf6d85dd2', // woman walking outdoors
  ].map(unsplash),
  'treatment-management': [
    'photo-1631217868264-e5b90bb7e133', // doctor consulting with patient
    'photo-1628771065518-0d82f1938462', // medication pills
    'photo-1587854692152-cbe660dbde88', // medication pills, flat lay
  ].map(unsplash),
  'relationships-sexual-health': [
    'photo-1506014299253-3725319c0f69', // couple holding hands outdoors
    'photo-1564020435666-f67ed5319a32', // couple holding hands, water
    'photo-1484876632310-ddb3b48133cc', // couple holding hands, close-up
  ].map(unsplash),
  'body-image-wellbeing': [
    'photo-1579017308347-e53e0d2fc5e9', // journaling
    'photo-1522075782449-e45a34f1ddfb', // meditating at sunset
    'photo-1548234566-a19d86ac931c', // woman looking in mirror
  ].map(unsplash),
  'lifestyle-nutrition': [
    'photo-1546069901-ba9599a7e63c', // healthy food bowl
    'photo-1544367567-0f2fcb009e0b', // yoga stretch at sunset
    'photo-1658928784381-6f68bbcf92f6', // sleeping peacefully
  ].map(unsplash),
};

export const HERO_IMAGE = unsplash('photo-1581832097375-e95cc1fcb3d9');
