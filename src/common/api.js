const request = async (url, metodo, dados = null) => {
  const cabecalho = {
    "Content-Type": "application/json",
  };

  const opcoes = {
    method: metodo,
    headers: cabecalho
  };

  if (dados) opcoes.body = JSON.stringify(dados);

  try {
    const resposta = await fetch(url, opcoes);

    if (!resposta.ok) throw new Error(`Erro HTTP! Status: ${resposta.status}`);

    return await resposta.json();
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    throw erro;
  }
};

const apiService = {
  get: (url) => request(url, "GET"),
  post: (url, data) => request(url, "POST", data),
  put: (url, data) => request(url, "PUT", data),
  delete: (url) => request(url, "DELETE"),
};

export default apiService;
