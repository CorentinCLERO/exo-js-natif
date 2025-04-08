const userDatas = {
  name: 'John Doe',
  email: 'john.doe@email.com'
}

function generateToken(user) {
  // Documentation btoa : https://developer.mozilla.org/fr/docs/Web/API/Window/btoa
  return btoa(JSON.stringify(user))
}

function verifyToken(token) {
  return JSON.parse(atob(token))
}

const userDatasToken = generateToken(userDatas)
console.log(userDatasToken)
const userDatasVerification = verifyToken(userDatasToken)
console.log(userDatasVerification)