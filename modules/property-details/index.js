/* eslint-disable max-statements */
import { add, format } from "date-fns";
import React, { useEffect, useState } from "react";

import { Button } from "../../components/button";
import RowContainer from "../../components/row-container";
import {
  AccountHeadline, AccountLabel, AccountList, AccountListItem, AccountSection, InfoText, InfoHighlight, Inset
} from "./style";
import axios from 'axios';


const initialAccount = {
  uid: "65156cdc-5cfd-4b34-b626-49c83569f35e",
  deleted: false,
  dateCreated: "2020-12-03T08:55:33.421Z",
  currency: "GBP",
  name: "15 Temple Way",
  bankName: "Residential",
  type: "properties",
  subType: "residential",
  originalPurchasePrice: 250000,
  originalPurchasePriceDate: "2017-09-03",
  recentValuation: { amount: 310000, status: "good" },
  associatedMortgages: [
    {
      name: "HSBC Repayment Mortgage",
      uid: "fb463121-b51a-490d-9f19-d2ea76f05e25",
      currentBalance: -175000,
    },
  ],
  canBeManaged: false,
  postcode: "BS1 2AA",
  lastUpdate: "2020-12-01T08:55:33.421Z",
  updateAfterDays: 30,
};
const get_account_url =  'http://localhost:3333/api/account';


const Detail = ({}) => {
  let mortgage;

  const [account, setAccount] = useState(initialAccount);

  useEffect(() => {
    axios.get(get_account_url).then((response) => {
      console.log(response)
      setAccount(response.data.account);
    });
  }, []);

  function sincePurchase() {
    return account.recentValuation?.amount-account.originalPurchasePrice;
  }

  function sincePurchasePercentage() {
    return ((account.recentValuation.amount-account.originalPurchasePrice)/ account.originalPurchasePrice * 100);
  }

  function annualAppreciation() {
    const noOfYearsSincePurchased = new Date().getFullYear()-account.originalPurchasePriceDate.split('-')[0]
    console.log(noOfYearsSincePurchased,noOfYearsSincePurchased)
    return ((account.recentValuation.amount-account.originalPurchasePrice)/ noOfYearsSincePurchased);
  }


  const lastUpdate = new Date(account.lastUpdate);
  if (account.associatedMortgages.length) {
    mortgage = account.associatedMortgages[0];
  }

  return (
    <Inset>
      <AccountSection>
        <AccountLabel>Estimated Value</AccountLabel>
        <AccountHeadline>
          {new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
          }).format(account.recentValuation.amount)}
        </AccountHeadline>
        <AccountList>
          <AccountListItem><InfoText>
            {`Last updated ${format(lastUpdate, "do MMM yyyy")}`}
          </InfoText></AccountListItem>
          <AccountListItem><InfoText>
            {`Next update ${format(
              add(lastUpdate, { days: account.updateAfterDays }),
              "do MMM yyyy"
            )}`}
          </InfoText></AccountListItem>
        </AccountList>
      </AccountSection>
      <AccountSection>
        <AccountLabel>Property details</AccountLabel>
        <RowContainer>
          <AccountList>
            <AccountListItem><InfoText>{account.name}</InfoText></AccountListItem>
            <AccountListItem><InfoText>{account.bankName}</InfoText></AccountListItem>
            <AccountListItem><InfoText>{account.postcode}</InfoText></AccountListItem>
          </AccountList>
        </RowContainer>
      </AccountSection>
      {<AccountSection>
        <AccountLabel>Valuation Change</AccountLabel>
        <RowContainer>
          <AccountList>
            <AccountListItem>
              <InfoText>{
              `Purchased for
               ${new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP",
                  }).format(account.recentValuation.amount)}
                in
                ${format(lastUpdate, "MMM")}, ${format(lastUpdate, "yyyy")}`}
              </InfoText></AccountListItem>
            <AccountListItem><InfoText>{`Since purchace`}</InfoText>
              <InfoHighlight>{new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
                }).format((sincePurchase()))}
                ({sincePurchasePercentage()}%)
              </InfoHighlight>
            </AccountListItem>
            <AccountListItem><InfoText>{`Annual appreciation`}</InfoText>
            <InfoHighlight>{annualAppreciation()}%</InfoHighlight></AccountListItem>
          </AccountList>
        </RowContainer>
      </AccountSection> }
      {mortgage && (
        <AccountSection>
          <AccountLabel>Mortgage</AccountLabel>
          <RowContainer
            // This is a dummy action
            onClick={() => alert("You have navigated to the mortgage page")}
          >
            <AccountList>
              <AccountListItem><InfoText>
                {new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP",
                }).format(
                  Math.abs(account.associatedMortgages[0].currentBalance)
                )}
              </InfoText></AccountListItem>
              <AccountListItem><InfoText>{account.associatedMortgages[0].name}</InfoText></AccountListItem>
            </AccountList>
          </RowContainer>
        </AccountSection>
      )}
      <Button
        // This is a dummy action
        onClick={() => alert("You have navigated to the edit account page")}
      >
        Edit account
      </Button>
    </Inset>
  );
};

export default Detail;
