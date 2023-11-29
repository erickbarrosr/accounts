const fs = require("fs");

const inquirer = require("inquirer");
const chalk = require("chalk");

getOperation();

function getOperation() {
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
      } else if (action === "Realizar Depósito") {
      } else if (action === "Realizar Saque") {
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

      getOperation();
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
