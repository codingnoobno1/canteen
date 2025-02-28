import React from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTimes = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const MenuPage = () => {
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Canteen Menu Timetable
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              {mealTimes.map((time) => (
                <TableCell key={time} align="center">{time}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((day) => (
              <TableRow key={day}>
                <TableCell>{day}</TableCell>
                {mealTimes.map((time) => (
                  <TableCell key={time} align="center">-</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MenuPage;
