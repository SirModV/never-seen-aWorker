USE employee_tracker;

INSERT INTO department (name) VALUES ("Sales"), ("Engineering"), ("Finance");

INSERT INTO role (title, salary, department_id) 
VALUES ("Manager", 80000.00, 1),
("Engineer", 70000.00, 2),
("Accountant", 65000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Mike", "Jones", 1, NULL),
("Lauren", "Hill", 2, 1),
("Ivory", "Johnson", 3, 1);
