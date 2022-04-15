'use strict';

// Data
const account1 = {
  owner: 'Deepak Kumar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Aman Thapliyal',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Prince Yadav',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Amandeep Saxena',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}₹</div>
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
  labelBalance.textContent = balance + '₹';
  account.balance = balance;
};

const calcDisplaySummary = function (account) {
  const deposits = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = deposits + '₹';

  const withdrawls = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = withdrawls * -1 + '₹';

  const interest = account.movements
    .filter(deposit => deposit > 0)
    .map(deposit => deposit * (account.interestRate / 100))
    .filter(deposit => deposit >= 1)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumInterest.textContent = interest.toFixed(3) + '₹';
};

const updateUI = function (currAcc) {
  calcDisplayBalance(currAcc);
  calcDisplaySummary(currAcc);
  displayMovements(currAcc);
};

// Event Listeners
let acc;
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
    acc.movements.push(loanAmt);
    updateUI(acc);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});
