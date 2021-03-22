export default function (pseudo = "", action) {
  if (action.type === "savePseudo") {
    return action.pseudo;
  } else if (action.type === "empty-pseudo") {
    console.log('action.',pseudo)
    return "";
  } 
  else if (action.type === "modify-pseudo") {
    return action.newPseudo

  }
  else {
    return pseudo;
  }
}
