// Given an array of numbers
let numbers = [5, 3, 9, 12, 6];

// Write a function to find and return the largest value
// function findMax(array) {
  //  let newArray = array.sort((a, b) => a - b);
  //  return newArray
//   let result;
//   for (let i = 0; i < array.length; i++) {
//     if (array[i] > array[i + 1]) {
//       result = array[i];
//     }
//   }
//   return result;
// }
// Test the function with the given array of numbers
// let max = findMax(numbers);
// console.log(max); // Output: 12
// !
// Given a string
let message = "Hello World!";

// Write a function to reverse the order of the characters and return the new string
function reverseString(str) {
//   let result = str.split("").reverse().join("")
//   return result
let arr = []

for(let i = 0; i< str.length; i++){
arr.push(str[i])
}
let arrReverse = []
for(let i = str.length - 1 ; i >=0; i--){
    arrReverse.push(str[i])
    }
let newStr = ""
for(let i = 0; i< arrReverse.length; i++){
    newStr += arrReverse[i]
}
console.log(newStr)
return newStr
}

// Test the function with the given string
let reversed = reverseString(message);
console.log(reversed);