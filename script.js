const precos = {
  marmita_p: 14,
  marmita_m: 18,
  marmita_g: 22,
  salada_p: 7,
  salada_m: 10,
  marmita_m_esp: 20,
  marmita_g_esp: 25,
  porcao_p: 10,
  porcao_m: 20,

  // Refrigerantes
  refri_lata: 6,
  refri_600: 8,
  refri_1l: 10,
  refri_taubaina_2l: 10,
  refri_outros_2l: 12,
  refri_coca_2l: 15,
  refri_coca_25l: 18
};

const nomes = {
  marmita_p: "Marmita P - R$14",
  marmita_m: "Marmita M - R$18",
  marmita_g: "Marmita G - R$22",
  salada_p: "Salada P - R$7",
  salada_m: "Salada M - R$10",
  marmita_m_esp: "Marmita M Especial - R$20",
  marmita_g_esp: "Marmita G Especial - R$25",
  porcao_p: "Porção P - R$10",
  porcao_m: "Porção M - R$20",

  // Refrigerantes
  refri_lata: "Refrigerante Lata - R$6",
  refri_600: "Refrigerante 600ml - R$8",
  refri_1l: "Refrigerante 1L - R$10",
  refri_taubaina_2l: "Taubainas 2L - R$10",
  refri_outros_2l: "Outros Refrigerantes 2L - R$12",
  refri_coca_2l: "Coca-Cola 2L - R$15",
  refri_coca_25l: "Coca-Cola 2,5L - R$18"
};

let pedidoAtual = [],
  pedidosPendentes = [],
  rotas = [];

// Adiciona um item único de um select específico
function adicionarItemUnico(selectId) {
  const item = document.getElementById(selectId).value;
  if (!item) return;

  pedidoAtual.push(item);
  const lista = document.getElementById("listaItens");
  const li = document.createElement("li");
  li.textContent = nomes[item];
  lista.appendChild(li);

  // Resetar o select para evitar duplicação acidental
  document.getElementById(selectId).value = "";
}

function finalizarPedido() {
  const endereco = document.getElementById("endereco").value,
    pagamento = document.getElementById("pagamento").value;

  if (!endereco) {
    alert("Digite um endereço!");
    return;
  }
  if (pedidoAtual.length === 0) {
    alert("Adicione pelo menos um item!");
    return;
  }

  pedidosPendentes.push({ endereco, itens: [...pedidoAtual], pagamento });
  pedidoAtual = [];
  document.getElementById("listaItens").innerHTML = "";
  document.getElementById("endereco").value = "";
  atualizarPendentes();
  atualizarRotas();
}

function atualizarPendentes() {
  const container = document.getElementById("pendentes");
  container.innerHTML = "";
  pedidosPendentes.forEach((p, index) => {
    let total = p.itens.reduce((acc, item) => acc + precos[item], 0),
      itensTexto = p.itens.map((i) => nomes[i]).join(" + ");
    container.innerHTML += `<div class="pedido-detalhe">
      <strong>Pedido ${index + 1}</strong><br>
      Endereço: ${p.endereco}<br>
      Itens: ${itensTexto}<br>
      Pagamento: ${p.pagamento}<br>
      Total: R$ ${total.toFixed(2)}
      <button class="small-btn" onclick="excluirPedidoPendente(${index})">Excluir</button>
    </div>`;
  });
  document.getElementById("contadorPendentes").textContent =
    pedidosPendentes.length;
}

function excluirPedidoPendente(index) {
  pedidosPendentes.splice(index, 1);
  atualizarPendentes();
  atualizarRotas();
}

function adicionarRota() {
  const rotaId = rotas.length + 1;
  rotas.push({ id: rotaId, pedidos: [] });
  atualizarRotas();
}

function atualizarRotas() {
  const container = document.getElementById("rotas");
  container.innerHTML = "";
  rotas.forEach((rota) => {
    const div = document.createElement("div");
    div.className = "rota";
    let html = `<h3>Rota ${rota.id} (<span>${rota.pedidos.length}</span>) 
      <button class="small-btn" onclick="removerRota(${rota.id})">Remover Rota</button></h3>`;
    if (pedidosPendentes.length > 0) {
      html += `<select id="selectRota${rota.id}">
        ${pedidosPendentes
          .map((p, i) => `<option value="${i}">${p.endereco}</option>`)
          .join("")}</select>
        <button onclick="moverPedido(${rota.id})">Adicionar Pedido</button>`;
    }
    rota.pedidos.forEach((p, index) => {
      let totalPedido = p.itens.reduce((acc, item) => acc + precos[item], 0);
      let itensTexto = p.itens.map((i) => nomes[i]).join(" + ");
      html += `<div class="pedido-detalhe">
        <strong>Endereço:</strong> ${p.endereco}<br>
        <strong>Itens:</strong> ${itensTexto}<br>
        <strong>Pagamento:</strong> ${p.pagamento}<br>
        <strong>Total:</strong> R$ ${totalPedido.toFixed(2)}
        <button class="small-btn" onclick="removerPedido(${rota.id},${index})">Remover</button>
        <button class="small-btn" onclick="excluirPedidoRota(${rota.id},${index})">Excluir</button>
      </div>`;
    });
    div.innerHTML = html;
    container.appendChild(div);
  });
}

function moverPedido(rotaId) {
  const select = document.getElementById("selectRota" + rotaId);
  const index = parseInt(select.value);
  if (isNaN(index)) return;
  const pedido = pedidosPendentes.splice(index, 1)[0];
  rotas.find((r) => r.id === rotaId).pedidos.push(pedido);
  atualizarPendentes();
  atualizarRotas();
}

function removerPedido(rotaId, pedidoIndex) {
  const rota = rotas.find((r) => r.id === rotaId);
  const pedido = rota.pedidos.splice(pedidoIndex, 1)[0];
  pedidosPendentes.push(pedido);
  atualizarPendentes();
  atualizarRotas();
}

function excluirPedidoRota(rotaId, pedidoIndex) {
  const rota = rotas.find((r) => r.id === rotaId);
  rota.pedidos.splice(pedidoIndex, 1);
  atualizarRotas();
}

function removerRota(rotaId) {
  const rota = rotas.find((r) => r.id === rotaId);
  pedidosPendentes.push(...rota.pedidos);
  rotas = rotas.filter((r) => r.id !== rotaId);
  atualizarPendentes();
  atualizarRotas();
}

function gerarRelatorio() {
  let totaisPagamento = {},
    totalGeral = 0,
    html = "<h3>Resumo Geral</h3>";
  rotas.forEach((rota) => {
    let totalRota = 0,
      marmitasVendidas = 0,
      enderecos = [];
    rota.pedidos.forEach((p) => {
      let totalPedido = p.itens.reduce((acc, item) => acc + precos[item], 0);
      totalRota += totalPedido;
      totalGeral += totalPedido;
      enderecos.push(p.endereco);
      p.itens.forEach((item) => {
        if (item.startsWith("marmita") || item.startsWith("porcao"))
          marmitasVendidas++;
      });
      if (!totaisPagamento[p.pagamento]) totaisPagamento[p.pagamento] = 0;
      totaisPagamento[p.pagamento] += totalPedido;
    });
    html += `<p><strong>Rota ${rota.id}:</strong><br>
      Endereços: ${enderecos.join(", ")}<br>
      Quantidade de Marmitas: ${marmitasVendidas}<br>
      Total da Rota: R$ ${totalRota.toFixed(2)}</p><hr>`;
  });
  html += `<h3>Total Geral: R$ ${totalGeral.toFixed(2)}</h3>`;
  html += "<h3>Totais por Forma de Pagamento:</h3>";
  for (let forma in totaisPagamento) {
    html += `<p><strong>${forma}:</strong> R$ ${totaisPagamento[
      forma
    ].toFixed(2)}</p>`;
  }
  document.getElementById("relatorio").innerHTML = html;
}