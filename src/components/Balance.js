import React from 'react';
import { Flex, Text, Image } from "rimble-ui";
import styled from 'styled-components'

const Fiat = styled(Text).attrs(()=>({
  fontSize: 4,
  fontWeight: 4
}))``;

const Token = styled(Text).attrs(()=>({
  fontSize: 1,
}))`
  color: var(--secondary-btn-text-color)
`;

const Amount = styled(Flex)`
  flex-direction: column;
  align-items: flex-end;
`;

const tokenDisplay = (amount, symbol = "", maximumFractionDigits = 10) => {
  const locale = localStorage.getItem('i18nextLng')
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits
  });
  return `${formatter.format(amount)} ${symbol}`
};

export  default ({icon, text, amount, currencyDisplay}) => {
  let opacity;
  let fiatAmount;
  let tokenAmount;

  if(isNaN(amount)){
    opacity = 0.25
    fiatAmount = currencyDisplay(0);
    tokenAmount = tokenDisplay(0);
  }else{
    opacity = 1
    fiatAmount = currencyDisplay(amount);
    tokenAmount = tokenDisplay(amount, text, 10);
  }

  return (
    <Flex opacity={opacity} justifyContent={"space-between"} alignItems={"center"} borderBottom={1} borderColor={"#DFDFDF"} mb={3} pb={3}>
      <Flex alignItems={"center"}>
        <Image src={icon} height={"50px"} width={"50px"} mr={3} bg="transparent" />
        <Text>
          {text}
        </Text>
      </Flex>

      <Amount>
        <Fiat>{fiatAmount}</Fiat>
        <Token>{tokenAmount}</Token>
      </Amount>

    </Flex>
  )
};
