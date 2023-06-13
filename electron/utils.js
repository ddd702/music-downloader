const removePunctuation = (str) => {
  return str.replace(/[.?\/#|$%\^&\*;:{}+=_`'"~<>]/g, '').replace(/\s{2,}/g, ' ')
}

const joinSingersName = (singers) => {
  const singersNames = singers.map((singer) => singer.name)
  return singersNames.join(',')
}
module.exports = {
  removePunctuation,
  joinSingersName
}