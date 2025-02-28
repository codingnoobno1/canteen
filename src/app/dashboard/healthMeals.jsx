// dashboard/healthMeals.jsx
'use client';

import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useState, useEffect } from 'react';

const mealSchedule = [
  { time: '08:00 AM', type: 'Breakfast' },
  { time: '01:00 PM', type: 'Lunch' },
  { time: '04:30 PM', type: 'Evening Snack' },
  { time: '08:00 PM', type: 'Dinner' },
];

const weeklyMeals = {
  Monday: ['Oats & Fruits', 'Grilled Chicken & Rice', 'Nut Mix', 'Steamed Veggies & Fish'],
  Tuesday: ['Smoothie & Toast', 'Dal & Chapati', 'Fruit Bowl', 'Brown Rice & Paneer'],
  Wednesday: ['Poha & Nuts', 'Chicken Salad', 'Yogurt & Granola', 'Quinoa & Lentils'],
  Thursday: ['Idli & Sambar', 'Vegetable Pulao', 'Roasted Chickpeas', 'Soup & Whole Wheat Bread'],
  Friday: ['Paratha & Yogurt', 'Grilled Fish & Rice', 'Berries & Nuts', 'Grilled Paneer & Veggies'],
  Saturday: ['Scrambled Eggs & Toast', 'Rajma & Rice', 'Protein Shake', 'Khichdi & Curd'],
  Sunday: ['Pancakes & Honey', 'Vegetable Stir Fry', 'Popcorn & Dry Fruits', 'Baked Fish & Salad'],
};

function getNextMeal() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  
  for (let meal of mealSchedule) {
    const [hour, minutes] = meal.time.split(/:| /);
    const mealHour = parseInt(hour, 10) + (meal.time.includes('PM') && hour !== '12' ? 12 : 0);
    const mealMinutes = parseInt(minutes, 10);
    
    if (mealHour > currentHour || (mealHour === currentHour && mealMinutes > currentMinutes)) {
      return meal.type;
    }
  }
  return 'Breakfast'; // Default to next day's breakfast if all meals are passed
}

export default function HealthMeals() {
  const [nextMeal, setNextMeal] = useState(getNextMeal());
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const mealsToday = weeklyMeals[today];

  useEffect(() => {
    const interval = setInterval(() => {
      setNextMeal(getNextMeal());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card sx={{ mt: 3, p: 2, backgroundColor: '#c8e6c9' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#1b5e20' }}>
          Daily Health Meal Plan ({today})
        </Typography>
        <Grid container spacing={2}>
          {mealSchedule.map((meal, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{
                p: 1,
                backgroundColor: meal.type === nextMeal ? '#66bb6a' : '#a5d6a7',
                color: meal.type === nextMeal ? 'white' : 'black',
              }}>
                <CardContent>
                  <Typography variant="h6">{meal.type}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meal.time} - {mealsToday[index]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
