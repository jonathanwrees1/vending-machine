let sodaList = [];
let candyBarList = [];
let chipsList = [];
let totalArr = [];
let runningLedgerList = document.getElementById('running-ledger-list');
let runningTotal = 0;
let sodaCounter = 0;
let candyBarCounter = 0;
let chipsCounter = 0;
let total = document.getElementById('total');
let soda = document.getElementById('soda-column');
let candyBar = document.getElementById('candy-bar-column');
let chips = document.getElementById('chips-column');
let sodaInventory = document.getElementById('soda-inventory');
let candyBarInventory = document.getElementById('candy-bar-inventory');
let chipsInventory = document.getElementById('chips-inventory');
let transactions = [];

function selectSoda() {
  if (sodaInventory.innerHTML > 0) {
    sodaList.push('Soda' + ': ' + 0.95 + '</br>');
    soda.innerHTML = sodaList.join('');
    runningTotal += 0.95;
    sodaCounter += 1;
    total.innerHTML = 'Total:$ ' + runningTotal.toFixed(2);
    sodaInventory.innerHTML -= 1;
  } else {
    return;
  }
}

function removeSoda() {
  if (sodaInventory.innerHTML < 9) {
    sodaList.pop();
    soda.innerHTML = sodaList.join('');
    runningTotal -= 0.95;
    sodaCounter -= 1;
    total.innerHTML = 'Total:$ ' + runningTotal.toFixed(2);
    sodaInventory.innerHTML -= -1;
  } else {
    return;
  }
}

function selectCandyBar() {
  if (candyBarInventory.innerHTML > 0) {
    candyBarList.push('Candy Bar' + ': ' + 0.6 + '</br>');
    candyBar.innerHTML = candyBarList.join('');
    runningTotal += 0.6;
    candyBarCounter += 1;
    total.innerHTML = 'Total:$ ' + runningTotal.toFixed(2);
    candyBarInventory.innerHTML -= 1;
  } else {
    return;
  }
}

function removeCandyBar() {
  if (candyBarInventory.innerHTML < 12) {
    candyBarList.pop();
    candyBar.innerHTML = candyBarList.join('');
    runningTotal -= 0.6;
    candyBarCounter -= 1;
    total.innerHTML = 'Total:$ ' + runningTotal.toFixed(2);
    candyBarInventory.innerHTML -= -1;
  } else {
    return;
  }
}

function selectChips() {
  if (chipsInventory.innerHTML > 0) {
    chipsList.push('Chips' + ': ' + 0.99 + '</br>');
    chips.innerHTML = chipsList.join('');
    runningTotal += 0.6;
    chipsCounter += 1;
    total.innerHTML = 'Total:$ ' + runningTotal.toFixed(2);
    chipsInventory.innerHTML -= 1;
  } else {
    return;
  }
}

function removeChips() {
  if (chipsInventory.innerHTML < 7) {
    chipsList.pop();
    chips.innerHTML = chipsList.join('');
    runningTotal -= 0.6;
    chipsCounter -= 1;
    total.innerHTML = 'Total:$ ' + runningTotal.toFixed(2);
    chipsInventory.innerHTML -= -1;
  } else {
    return;
  }
}

function confirm() {
  //printing a 'receipt'
  if (total.innerHTML === 'Total:$' || total.innerHTML === 'Total:$ -0.00') {
    return;
  } else {
    let intro = 'You purchased ';
    let currentSodaCounter = '';
    let currentCandyBarCounter = '';
    let currentChipsCounter = '';
    if (sodaCounter === 1) {
      currentSodaCounter = sodaCounter + ' Soda, ';
    } else if (sodaCounter >= 2) {
      currentSodaCounter = sodaCounter + ' Sodas, ';
    } else {
      currentSodaCounter = '';
    }

    if (candyBarCounter === 1) {
      currentCandyBarCounter = candyBarCounter + ' Candy Bar, ';
    } else if (candyBarCounter > 0) {
      currentCandyBarCounter = candyBarCounter + ' Candy Bars, ';
    } else {
      currentCandyBarCounter = '';
    }

    if (chipsCounter === 1) {
      currentChipsCounter = chipsCounter + ' Bag of Chips, ';
    } else if (chipsCounter > 0) {
      currentChipsCounter = chipsCounter + ' Bags of Chips, ';
    } else {
      currentChipsCounter = '';
    }
    let confirmedPurchase =
      intro +
      currentSodaCounter +
      currentCandyBarCounter +
      currentChipsCounter +
      'for a total of $' +
      runningTotal.toFixed(2) +
      ' ***************** ' +
      Date();

    alert(confirmedPurchase);
    runningLedgerList.innerHTML += confirmedPurchase + '<br></br>';

    //info about current inventory
    let currentIventory = {
      Soda: sodaInventory.innerHTML,
      CandyBars: candyBarInventory.innerHTML,
      Chips: chipsInventory.innerHTML,
    };

    ////posting to server
    fetch('http://localhost:3002/vend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: Date.now(),
        Sodas: sodaCounter,
        CandyBars: candyBarCounter,
        Chips: chipsCounter,
        Amount: runningTotal.toFixed(2),
        TodaysDate: Date(),
        _CurrentInventory: currentIventory,
      }),
    }) //server returns the data
      .then((res) => {
        const responseData = res.json();
        return responseData;
      })
      //data is pushed into an array and then sent to local storage
      .then((data) => {
        transactions.push(data);
        localStorage.setItem(
          'TransactionsLedger',
          JSON.stringify(transactions)
        );
        return transactions;
      })
      .catch((error) => console.log('ERROR'));
    console.log(transactions);

    ///resetting everything except inventory for the next customer
    soda.innerHTML = '';
    candyBar.innerHTML = '';
    chips.innerHTML = '';
    runningTotal = 0;
    total.innerHTML = 'Total:$';
    sodaCounter = 0;
    candyBarCounter = 0;
    chipsCounter = 0;
    sodaList = [];
    candyBarList = [];
    chipsList = [];
  }
}

document.getElementById('soda-button').addEventListener('click', selectSoda);
document.getElementById('undo-soda').addEventListener('click', removeSoda);

document
  .getElementById('candy-bar-button')
  .addEventListener('click', selectCandyBar);

document
  .getElementById('undo-candy-bar')
  .addEventListener('click', removeCandyBar);

document.getElementById('chips-button').addEventListener('click', selectChips);
document.getElementById('undo-chips').addEventListener('click', removeChips);

document.getElementById('purchase-button').addEventListener('click', confirm);
