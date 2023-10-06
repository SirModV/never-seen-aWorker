require("dotenv").config();
const inquirer = require("inquirer");
const promisePool = require("../../config/connection");
//coded with help from mini project
const viewDepartments = async () => {
  const [rows] = await promisePool.query("SELECT * FROM department");
  console.table(rows);
};

const viewRoles = async () => {
  const [rows] = await promisePool.query(
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id"
  );
  console.table(rows);
};

const viewEmployees = async () => {
  const sql = `
        SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
        FROM employee e 
        LEFT JOIN role ON e.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee m ON e.manager_id = m.id;
    `;
  const [rows] = await promisePool.query(sql);
  console.table(rows);
};

const addDepartment = async () => {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the new department?",
      validate: (name) => (name ? true : "Please Enter Name"),
    },
  ]);

  await promisePool.query("INSERT INTO department SET ?", answer);
  console.log("Added new department.");
};

const addRole = async () => {
  const departments = await promisePool.query("SELECT * FROM department");
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of the new role?",
      validate: (title) => (title ? true : "Please Enter Title"),
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the new role?",
      validate: (salary) =>
        !isNaN(salary) ? true : "Please enter a valid salary",
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department does this role belong to?",
      choices: departments[0].map((department) => ({
        name: department.name,
        value: department.id,
      })),
    },
  ]);

  await promisePool.query("INSERT INTO role SET ?", answer);
  console.log("Added new role.");
};

const addEmployee = async () => {
  const roles = await promisePool.query("SELECT * FROM role");
  const employees = await promisePool.query("SELECT * FROM employee");

  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the first name of the employee?",
      validate: (name) => (name ? true : "Please Enter Name"),
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the last name of the employee?",
      validate: (name) => (name ? true : "Please Enter Name"),
    },
    {
      type: "list",
      name: "role_id",
      message: "What role does the employee have?",
      choices: roles[0].map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the manager of the employee?",
      choices: employees[0]
        .map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }))
        .concat({ name: "None", value: null }),
    },
  ]);

  await promisePool.query("INSERT INTO employee SET ?", answer);
  console.log("Added new employee.");
};
// coded with help from coding tutor
const updateEmployeeRole = async () => {
  const employees = await promisePool.query("SELECT * FROM employee");
  const roles = await promisePool.query("SELECT * FROM role");

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "employee_id",
      message: "Which employee's role do you want to update?",
      choices: employees[0].map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
    {
      type: "list",
      name: "role_id",
      message: "Which is the new role for the employee?",
      choices: roles[0].map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
  ]);

  await promisePool.query("UPDATE employee SET role_id = ? WHERE id = ?", [
    answer.role_id,
    answer.employee_id,
  ]);
  console.log("Updated employee role.");
};

module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
