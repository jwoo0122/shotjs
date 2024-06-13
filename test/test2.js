import dedupe from "dedupe";

const a = [1, 2, 2, 3];
const b = dedupe(a);
console.log(b);

//result: [1, 2, 3]
