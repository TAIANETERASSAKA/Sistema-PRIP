import { useState } from "react";
function Loginfea() {
const [data, setData] = useState(null);
const [usuario, setUsuario] = useState("");
const [senha, setSenha] = useState("");
async function auth() {
const resp = await fetch("http://localhost:3005/auth", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
username: usuario,
password: senha
})
});
const result = await resp.json();
setData(result);
console.log(result);
}
return (
<div className="App">
<header className="App-header">
<p>
Edit <code>src/App.js</code> and save to reload.
</p>
<label for="user">Usuário:</label>
<input type="text" name="user" id="user" onChange={(e) =>
setUsuario(e.target.value)}></input>
<br />
<label for="passwd">Senha:</label>
<input type="password" name="passwd" id="passwd" onChange={(e) =>
setSenha(e.target.value)}></input>
<button class="btn" onClick={() => auth()}>Login</button>
<br /><br />

{!data && <p>Carregando...</p>}
{data && data.user && (
<div>
<p>Usuário: {data.user.cn}</p>
<p>Email: {data.user.mail}</p>
<p>ID: {data.user.employeeID}</p>
</div>
)}
</header>
</div>
);
}
export default Loginfea;