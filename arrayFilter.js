const arrayDatas = ["a", "ab", "b"]

function filter(array, value) {
  const newArray = []
  const arrayLength = array.length
  for (let i = 0; i < arrayLength; i++) {
    if (array[i].includes(value)) newArray.push(array[i])
  }

  return newArray
}

console.log(filter(arrayDatas, 'a'))
console.log(filter(arrayDatas, 'b'))
console.log(filter(arrayDatas, 'C'))