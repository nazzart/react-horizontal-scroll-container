import React from 'react';
import Box from '@mui/material/Box';
import styled from '@emotion/styled';

const Wrapper = styled(Box)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.08);
`;

export default function Card(props){
    return(
        <Wrapper {...props}>
            {props.children}
        </Wrapper>
    )
}