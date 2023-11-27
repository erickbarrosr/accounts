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

      console.log(action);
    })
    .catch((err) => console.log(err));
}
