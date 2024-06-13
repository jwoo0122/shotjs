import axios from "axios";
import arrayLast from "array-last";

const res = await axios.get("https://google.com");
console.log(res.status, res.statusText);
console.log(arrayLast([res.status, res.statusText]));
