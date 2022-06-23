const Person = require("./person");

// extends 繼承類別
class Employee extends Person {
    constructor(name = "", age = 20, employee_id = "") {
        // super --> 呼叫父類別的constructor
        super(name, age);
        this.employee_id = employee_id;
    }
    toJSON() {
        const { name, age, employee_id } = this;
        return { name, age, employee_id };
    }
}

module.exports = Employee;
