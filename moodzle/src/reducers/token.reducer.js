export default function (token = "", action) {
  if (action.type === "addToken") {
    return action.token;
  } else if (action.type === "empty-token") {
    return "";
  } else if (action.type === "deconnexion") {
    return "";
    
  } else {
    return token;
  }
}
