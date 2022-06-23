class Person {
    gender = "male";
    constructor(name = "", age = 10) {
        this.name = name;
        this.age = age;
    }
    toJSON() {
        return {
            name: this.name,
            age: this.age,
            gender: this.gender,
            data: "abc",
        };
    }
    toString() {
        return JSON.stringify(this, null, 4);
    }
}

module.exports = Person;
