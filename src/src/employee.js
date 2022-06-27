const Person = require("./person");

class Employee extends Person {
    constructor(name = "", age = 20, employee_id = "") {
        super(name, age);
        this.employee_id = employee_id;
    }
    toJSON() {
        // const { name, age, employee_id } = this;
        // return { name, age, employee_id };
        return { ...super.toJSON(), employee_id: this.employee_id };
    }
}

module.exports = Employee;
