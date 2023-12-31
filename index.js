const fs = require("fs");

const inquirer = require("inquirer");
const chalk = require("chalk");

chooseOperation();

function chooseOperation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Realizar Depósito",
          "Realizar Saque",
          "Finalizar Operações",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      if (action === "Criar Conta") {
        createAccount();
      } else if (action === "Consultar Saldo") {
        checkBalance();
      } else if (action === "Realizar Depósito") {
        makeDeposit();
      } else if (action === "Realizar Saque") {
        makeWithdraw();
      } else {
        if (action === "Finalizar Operações") {
          console.log(chalk.bgYellow.black("Obrigado por usar o Accounts!"));
          process.exit();
        }
      }
    })
    .catch((err) => console.error(err));
}

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir."));

  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para a sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdir("accounts", (err) => {
          if (err) {
            console.error("Error creating directory:", err);
          } else {
            console.log("Directory 'accounts' created successfully!");
          }
        });
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome!")
        );

        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green("Parabéns, a sua conta foi criada!"));

      chooseOperation();
    })
    .catch((err) => console.error(err));
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black("Essa conta não existe, escolha uma conta válida.")
    );
    return false;
  }

  return true;
}

function makeDeposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return makeDeposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja depositar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          addAmount(accountName, amount);

          chooseOperation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.error(err));
}

function addAmount(accountName, amount) {
  const accountData = readAccountData(accountName);

  if (!amount) {
    console.log(chalk.bgRed.black("Erro ao realizar depósito."));
    return makeDeposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.error(err);
    }
  );

  console.log(
    chalk.green(`Foi depositado o valor de R$ ${amount} na sua conta`)
  );
}

function readAccountData(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });

  return JSON.parse(accountJSON);
}

function checkBalance() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return checkBalance();
      }

      const accountData = readAccountData(accountName);

      console.log(
        chalk.bgBlue.black(
          `O saldo da sua conta é de R$ ${accountData.balance}`
        )
      );

      chooseOperation();
    })
    .catch((err) => console.error(err));
}

function makeWithdraw() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return makeWithdraw();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja sacar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          removeAmount(accountName, amount);
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
}

function removeAmount(accountName, amount) {
  const accountData = readAccountData(accountName);

  if (!amount) {
    console.log(chalk.bgRed.black("Erro no saque."));

    return makeWithdraw();
  }

  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black(`Valor indisponível!`));

    return makeWithdraw();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => console.error(err)
  );

  console.log(chalk.green(`Saque no valor de R$ ${amount} realizado!`));

  chooseOperation();
}
