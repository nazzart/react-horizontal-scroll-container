import React from "react";
import './App.css';
import HorizontalScroll from './components/scroll/HorizontalScroll.jsx';
import {Box, Typography} from '@mui/material';

function App() {

  const content = [
    {title: "First title", text: "text"},
    {title: "Second title", text: "text"},
    {title: "Second title", text: "text"},
    {title: "Second title", text: "text"},
    {title: "Second title", text: "text"},
    {title: "Second title", text: "text"}
  ];

  return (
    <div className="App">
      <HorizontalScroll itemWidth={{width: { xs: 265, sm: 326, md: 300 }}}>
        {content.map((data, index) => (
            <Box key={index} sx={{
                  display: "flex",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  flexDirection: "column",
                  flexBasis: { xs: "100%", sm: "48%"},
            }}>
              <Typography>
                {data.title}
              </Typography>
              <Typography sx={{ mt: 2 }}>{data.text}</Typography>
            </Box>
        ))}
      </HorizontalScroll>
    </div>
  );
}

export default App;
