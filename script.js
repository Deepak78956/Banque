'use strict';

// Data
const account1 = {
  owner: 'Aman Thapliyal',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2020-11-18T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2022-02-27T17:01:17.194Z',
    '2022-03-11T23:36:17.929Z',
    '2022-04-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Deepak Kumar',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2022-04-15T14:43:26.374Z',
    '2022-04-18T18:49:59.371Z',
    '2022-04-19T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-GB',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//functions
const formatDates = function (dateObj, currAcc) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), dateObj);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(currAcc.locale).format(dateObj);
};

const formatNumbers = function (currAcc, num) {
  return new Intl.NumberFormat(currAcc.locale, {
    style: 'currency',
    currency: currAcc.currency,
  }).format(num);
};

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const dateObj = new Date(acc.movementsDates[i]);
    const dispDate = formatDates(dateObj, acc);
    const html = `
      <div class="movements__row">
      
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${dispDate}</div>
        <div class="movements__value">${formatNumbers(acc, mov)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formatNumbers(account, balance);
  account.balance = balance;
};

const calcDisplaySummary = function (account) {
  const deposits = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatNumbers(account, deposits);

  const withdrawls = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatNumbers(account, withdrawls.toFixed(3) * -1);

  const interest = account.movements
    .filter(deposit => deposit > 0)
    .map(deposit => deposit * (account.interestRate / 100))
    .filter(deposit => deposit >= 1)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumInterest.textContent = formatNumbers(account, interest.toFixed(3));
};

const updateUI = function (currAcc) {
  calcDisplayBalance(currAcc);
  calcDisplaySummary(currAcc);
  displayMovements(currAcc);
};

// Event Listeners
let acc;
acc = account1;
updateUI(acc);
document.querySelector('main').style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const userNameInput = inputLoginUsername.value;
  let flag = 0;
  for (let i = 0; i < accounts.length; i++) {
    acc = accounts[i];
    if (acc.userName === userNameInput) {
      flag = 1;
      break;
    }
  }
  if (flag === 0) {
    alert('username not found');
  } else {
    if (Number(inputLoginPin.value) === acc.pin) {
      document.querySelector('main').style.opacity = 100;
      document.querySelector('.welcome').textContent = `Welcome, Mr. ${
        acc.owner.split(' ')[0]
      }`;
      updateUI(acc);
      inputLoginPin.value = '';
      inputLoginUsername.value = '';
      inputLoginPin.blur();
      const now = new Date();
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      labelDate.textContent = new Intl.DateTimeFormat(
        acc.locale,
        options
      ).format(now);
    } else {
      alert('Wrong password');
    }
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferToAcc = inputTransferTo.value;
  const transferAmt = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === transferToAcc);
  if (
    transferAmt > 0 &&
    transferAmt <= acc.balance &&
    receiverAcc?.username !== acc.userName
  ) {
    acc.movements.push(Number(transferAmt) * -1);
    receiverAcc.movements.push(transferAmt);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    acc.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(acc);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    Number(inputClosePin.value) === acc.pin &&
    inputCloseUsername.value === acc.userName
  ) {
    console.log('Delete succesful');
    const index = accounts.findIndex(
      account => account.userName === inputCloseUsername
    );
    accounts.splice(index, 1);
    document.querySelector('main').style.opacity = 0;
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmt = Number(inputLoanAmount.value);
  if (loanAmt > 0 && acc.movements.some(mov => mov >= loanAmt * 0.1)) {
    setTimeout(() => {
      acc.movements.push(loanAmt);
      acc.movementsDates.push(new Date().toISOString());
      updateUI(acc);
    }, 2500);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(acc, !sorted);
  sorted = !sorted;
});
