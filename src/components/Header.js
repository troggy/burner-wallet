import React from 'react';
import { Blockie } from "dapparatus";
import burnerloader from '../burnerloader.gif';
import { Button, Icon } from "rimble-ui";
export  default ({openScanner, network, total, ens, address, changeView, view}) => {


  let sendButtonOpacity = 1.0
  if(view==="receive" || view==="send_badge"){
    sendButtonOpacity = 0
  }



  let name = ens
  if(!name){
    name = address.substring(2,8)
  }

  let moneyDisplay
  let blockieDisplay
  if(typeof total == "undefined" || Number.isNaN(total)){
    moneyDisplay = (
      <div className={"money_display__connecting"}>
        Connecting..
      </div>
    )
    blockieDisplay = (
      <img src={burnerloader} class="blockie__loader" alt=""/>
    )
  }else{
    /*moneyDisplay = (
      <div>
        {dollarDisplay(total)}
      </div>
    )*/
    moneyDisplay = (
      <div class="money_display__network">
        {network}
      </div>
    )
    blockieDisplay = (
      <Blockie
          address={address}
          config={{size:6}}>
      </Blockie>
    )
  }

  let scanButtonStyle = {
    opacity:sendButtonOpacity,
    position:"fixed",
    right:20,
    bottom:20,
    zIndex:2,
    cursor:"pointer"
  }

  if(view==="send_to_address"){
    scanButtonStyle.position = "absolute"
    scanButtonStyle.right = -3
    scanButtonStyle.top = 217
    delete scanButtonStyle.bottom
  }

  let bottomRight = (
    <div style={scanButtonStyle}  >
    <Button
      onClick={() => {
        openScanner({view:"send_to_address"})
      }}
      style={{backgroundColor: "white", border: "3px solid black"}}
      color="black"
      borderRadius={"50%"}
      height={"auto"}
      width={"auto"}
      p={0} m={0}
      position={"absolute"}
      bottom={3}
      right={3}
    >
      <Icon name="CenterFocusWeak" size={90} p={3} />
    </Button>
    </div>
  )

  const mainOrExchange = view === "main" || view === "exchange";
  const opacity =mainOrExchange ? 1 :  0.5;
  const blockieLink = mainOrExchange ? 'receive' : 'main';
  let topLeft = (
    <div className={"blockie_container"} onClick={() => changeView(blockieLink)}>
      {blockieDisplay}
      <div class="blockie_container__name">{name}</div>
    </div>);


  let topRight = (
    <div className={"money_display"} >
      {moneyDisplay}
    </div>
  )


  return (
    <div className="header" style={{opacity, zIndex: 5}}>
      {topLeft}
      {topRight}
      {view === "main" ?  bottomRight : null}
    </div>
  )
};
