import React from "react";
import './App.css';
import HorizontalScroll from './components/scroll/HorizontalScroll.jsx';
import {Typography} from '@mui/material';
import Card from './components/card/Card.jsx';
import Box from '@mui/material/Box';

function App() {

  const content = [
    {title: "Lorem ipsum dolor sit amet", image: "https://via.placeholder.com/500x300/636E72/B2BEC3?text=Placeholder"},
    {title: "Lorem ipsum dolor sit amet", image: "https://via.placeholder.com/500x300/636E72/B2BEC3?text=Placeholder"},
    {title: "Lorem ipsum dolor sit amet", image: "https://via.placeholder.com/500x300/636E72/B2BEC3?text=Placeholder"},
    {title: "Lorem ipsum dolor sit amet", image: "https://via.placeholder.com/500x300/636E72/B2BEC3?text=Placeholder"},
    {title: "Lorem ipsum dolor sit amet", image: "https://via.placeholder.com/500x300/636E72/B2BEC3?text=Placeholder"},
    {title: "Lorem ipsum dolor sit amet", image: "https://via.placeholder.com/500x300/636E72/B2BEC3?text=Placeholder"},
  ];

  return (
    <div className="App">
      <HorizontalScroll itemWidth={{width: { xs: 265, sm: 326, md: 300 }}}>
        {content.map((data, index) => (
            <Card key={index}>
                <img src={data.image} alt={data.title} />
              <Box sx={{padding: "10px 15px"}}>
                <Typography>
                  {data.title}
                </Typography>
                <Typography sx={{ mt: 2 }}>{data.text}</Typography>
              </Box>
            </Card>
        ))}
      </HorizontalScroll>
    </div>
  );
}

export default App;
