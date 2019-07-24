//@format
import React from "react";
import { PrimaryButton } from "../components/Buttons";
import { Text, Flex, Box, Field, Input } from "rimble-ui";
import { lockCO2 } from "./utils";

export default class PlantTrees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  send = async () => {
    const {
      plasma,
      defaultPassport,
      metaAccount,
      setReceipt,
      scannerState,
      changeView
    } = this.props;

    const { amount } = this.state;

    console.log(amount);


    changeView("loader");

    let finalReceipt;
    try {
      finalReceipt = await lockCO2(
        plasma,
        defaultPassport,
        amount,
        metaAccount.privateKey
      );
    } catch (err) {
      setReceipt({ type: "error" });
      return;
    }

    setReceipt(
      // NOTE: Receipt needs to be of type "trade" for correct receipt to be
      // displayed. "profit" and "emission" needs to be included.
      Object.assign(finalReceipt, {
        type: "plant",
        profit: 0.2,
        emission: 8
      })
    );
    changeView("receipt");
  };

  canSend() {
    return this.state.amount > 0;
  }

  updateState = async (key, value) => {
    this.setState({ [key]: value },() => {
      this.setState({ canSend: this.canSend() });
    });
  };

  componentDidMount() {
    const { goBack, changeAlert, defaultPassport: passport } = this.props;

    if (!passport) {
      // Sorry.
      goBack();
      setTimeout(
        () => changeAlert({ type: "warning", message: "Select a passport" }),
        100
      );
    }

    this.setState({ canSend: this.canSend() })
    this.amountInput.focus();
  }

  render() {
    const {
      changeAlert,
      goBack,
      metaAccount,
      web3,
      plasma,
      defaultPassport: passport
    } = this.props;

    if (!passport) {
      return null;
    }

    const { receipt } = this.props.scannerState;
    const country = passport.country.fullName;
    const name = passport.data.name;

    return (
      <div>
        <Flex flexDirection="column" mb={3}>
          <Text fontSize={2} textAlign="center">
            You as <strong>{name}</strong>, {`Citizen of the ${country}`}, are
            finalizing a handshake.
          </Text>
        </Flex>

        <Field mb={3} label="How much to spend on trees">
          <Input
            width={1}
            type="number"
            value={this.state.amount}
            ref={(input) => { this.amountInput = input; }}
            onChange={event => this.updateState('amount', event.target.value)}
          />
        </Field>

        <PrimaryButton
          size={"large"}
          width={1}
          disabled={!passport}
          onClick={this.send}
        >
          Plant tree now!
        </PrimaryButton>
        <Text mt={3} fontSize={1} textAlign="center">
          By confirming this action, you agree to spend your Goellars to plant some trees
        </Text>
      </div>
    );
  }
}
