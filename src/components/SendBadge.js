import React from 'react';
import Ruler from "./Ruler";
import Balance from "./Balance";
import cookie from 'react-cookies'
import {CopyToClipboard} from "react-copy-to-clipboard";
import Blockies from 'react-blockies';
import { scroller } from 'react-scroll'
import Badge from './Badge';
import i18n from '../i18n';
import { Card, Text, Flex, Box, Input, Button, OutlineButton, Field } from 'rimble-ui';

export default class SendBadge extends React.Component {
  constructor(props) {
    super(props);

    let toAddress = ""
    if(props.scannerState) toAddress = props.scannerState.toAddress
    if(!toAddress) {
      toAddress = cookie.load('sendBadgeToAddress')
    }else{
      cookie.save('sendBadgeToAddress', toAddress, { path: '/', maxAge: 60 })
      setTimeout(()=>{
        this.scrollToBottom()
      },30)
    }

    this.state = {
      canSend: false,
      toAddress: toAddress
    }
    setTimeout(()=>{
      this.setState({ canSend: this.canSend() })
    },1000)
  }
  componentDidMount = () => {
    window.addEventListener('scroll', this.handleOnScroll.bind(this))
  }
  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleOnScroll.bind(this))
  }
  handleOnScroll = () => {
      this.forceUpdate()
  }
  updateState = async (key, value) => {
    if(key=="toAddress"){
      cookie.save('sendBadgeToAddress', value, { path: '/', maxAge: 60 })
    }
    this.setState({ [key]: value },()=>{
      this.setState({ canSend: this.canSend() })
    });
    if(key=="toAddress"){
      this.setState({fromEns:""})
      setTimeout(()=>{
        this.scrollToBottom()
      },30)
    }
    if(key=="toAddress"&&value.indexOf(".eth")>=0){
      console.log("Attempting to look up ",value)
      let addr = await this.props.ensLookup(value)
      console.log("Resolved:",addr)
      if(addr!="0x0000000000000000000000000000000000000000"){
        this.setState({toAddress:addr,fromEns:value},()=>{
          this.setState({ canSend: this.canSend() })
        })
      }
    }
  };
  scrollToBottom(){
    console.log("scrolling to bottom")
    scroller.scrollTo('theVeryBottom', {
      duration: 500,
      delay: 30,
      smooth: "easeInOutCubic",
    })
  }
  canSend() {
    //console.log("CAN SEND?",this.state.toAddress,this.state.toAddress.length)
    return (this.state.toAddress && this.state.toAddress.length === 42)
  }
  send = async () => {
    let { toAddress, amount } = this.state;
    let {ERC20TOKEN} = this.props


    if(this.state.canSend){

      console.log("SWITCH TO LOADER VIEW...",amount)
      this.props.changeView('loader')
      setTimeout(()=>{window.scrollTo(0,0)},60)

      console.log("web3",this.props.web3)

      cookie.remove('sendBadgeToAddress', { path: '/' })
      this.props.tx(
        this.props.contracts.Badges.transferFrom(this.props.address,this.state.toAddress,this.props.badge.id)
        ,240000,0,0,(receipt)=>{
          if(receipt){

            console.log("SEND BADGE COMPLETE?!?",receipt)
            this.props.goBack();
            window.history.pushState({},"", "/");
            this.props.setReceipt({to:toAddress,from:receipt.from,badge:this.props.badge,result:receipt})
            this.props.changeView("receipt");
            this.props.clearBadges()
          }
        }
      )
      /*this.props.send(toAddress, value, 120000, txData, (result) => {
        if(result && result.transactionHash){
          this.props.goBack();
          window.history.pushState({},"", "/");
          this.props.setReceipt({to:toAddress,from:result.from,amount:parseFloat(amount),message:this.state.message,result:result})
          this.props.changeView("receipt");
        }
      })*/
    }

  };

  render() {
    let { canSend, toAddress } = this.state;
    var h = document.documentElement,
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight';
    var percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    let angle = Math.round(-28 + 75*percent/100)
    return (
      <div>
        <div className="content row" onClick={()=>{
          window.open(this.props.badge.external_url,'_blank')
        }}>
            <Badge large={true} angle={angle} key={"b"+this.props.badge.id} id={this.props.badge.id} image={this.props.badge.image}/>
        </div>
        <div style={{fontSize:14,width:"100%",textAlign:"center"}}>
          {this.props.badge.description}
        </div>
        <Ruler />
        
        <Box mb={4}>
          <Field mb={3} label={i18n.t('send_to_address.to_address')}>
            <Input
              width={1}
              type="text"
              placeholder="0x..."
              value={this.state.toAddress}
              ref={(input) => { this.addressInput = input; }}
              onChange={event => this.updateState('toAddress', event.target.value)}
              required
            />
          </Field>

          <OutlineButton icon={'CenterFocusWeak'} mb={4} width={1} onClick={() => this.props.openScanner({view:'send_badge'})}>
            Scan QR Code
          </OutlineButton>

          { this.state.toAddress && this.state.toAddress.length==42 &&
            <Flex alignItems={'center'} justifyContent={'center'} mb={3}>
              <CopyToClipboard text={toAddress.toLowerCase()}>
                <div style={{cursor:"pointer"}} onClick={() => this.props.changeAlert({type: 'success', message: toAddress.toLowerCase()+' copied to clipboard'})}>
                  <div style={{opacity:0.33}}>{this.state.fromEns}</div>
                  <Blockies seed={toAddress.toLowerCase()} scale={10}/>
                </div>
              </CopyToClipboard>
            </Flex>
          }

          <Button size={'large'} width={1} disabled={canSend === false} onClick={this.send}>
            Send
          </Button>
        </Box>
      </div>
    )
  }
}
