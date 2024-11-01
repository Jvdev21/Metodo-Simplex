// Função para gerar os campos da Função Objetivo
document.getElementById('gerarCampos').addEventListener('click', function() {
    const numVariaveis = document.getElementById('variavel').value;
    const containerFuncaoZ = document.getElementById('funcaoZ');

    containerFuncaoZ.innerHTML = '';

    if (numVariaveis > 0) {
        for (let i = 1; i <= numVariaveis; i++) {
            const signo = document.createElement('input');
            signo.type = 'text';
            signo.placeholder = '+/-';
            signo.name = `signo${i}`;
            signo.style.width = '30px';
            containerFuncaoZ.appendChild(signo);

            const coeficiente = document.createElement('input');
            coeficiente.type = 'text';
            coeficiente.placeholder = `Coef ${i}`;
            coeficiente.name = `coeficiente${i}`;
            containerFuncaoZ.appendChild(coeficiente);

            const labelVariavel = document.createElement('span');
            labelVariavel.innerText = `X${i} `;
            containerFuncaoZ.appendChild(labelVariavel);
        }
    } else {
        alert("Por favor, insira um número válido de variáveis.");
    }
});

// Função para limpar os campos gerados na Função Objetivo
document.getElementById('limparCampos').addEventListener('click', function() {
    document.getElementById('funcaoZ').innerHTML = '';
    document.getElementById('variavel').value = '';
});

// Função para gerar uma nova restrição
document.getElementById('gerarRestricao').addEventListener('click', function() {
    const numVariaveis = document.getElementById('numVariavelRestricao').value;
    const containerRestricoes = document.getElementById('restricoes');

    if (numVariaveis > 0) {
        const divRestricao = document.createElement('div');
        divRestricao.classList.add('restricao');

        // Adicionar título da restrição (R1, R2, etc.)
        const numRestricoes = containerRestricoes.children.length + 1;
        const labelRestricao = document.createElement('label');
        labelRestricao.innerText = `R${numRestricoes} = `;
        divRestricao.appendChild(labelRestricao);

        // Gerar coeficientes e variáveis para a restrição
        for (let i = 1; i <= numVariaveis; i++) {
            const signo = document.createElement('input');
            signo.type = 'text';
            signo.placeholder = '+/-';
            signo.name = `signo${i}_restricao${numRestricoes}`;
            signo.style.width = '30px';
            divRestricao.appendChild(signo);

            const coeficiente = document.createElement('input');
            coeficiente.type = 'text';
            coeficiente.placeholder = `Coef ${i}`;
            coeficiente.name = `coeficiente${i}_restricao${numRestricoes}`;
            divRestricao.appendChild(coeficiente);

            const labelVariavel = document.createElement('span');
            labelVariavel.innerText = `X${i} `;
            divRestricao.appendChild(labelVariavel);
        }

        // Espaço para a parte direita da restrição (<=, =, >= e valor)
        const comparacao = document.createElement('input');
        comparacao.type = 'text';
        comparacao.placeholder = '<=, =, >=';
        comparacao.style.width = '40px';
        divRestricao.appendChild(comparacao);

        const valorDireito = document.createElement('input');
        valorDireito.type = 'text';
        valorDireito.placeholder = 'Valor';
        divRestricao.appendChild(valorDireito);

        // Adicionar a restrição ao contêiner
        containerRestricoes.appendChild(divRestricao);
    } else {
        alert("Por favor, insira um número válido de variáveis para as restrições.");
    }
});

// Função para reiniciar e limpar tudo
document.querySelectorAll('.elementosFun').forEach(button => {
    if (button.innerText === 'Reiniciar') {
        button.addEventListener('click', function() {
            // Limpar Função Objetivo
            document.getElementById('funcaoZ').innerHTML = '';
            document.getElementById('variavel').value = '';

            // Limpar restrições
            document.getElementById('restricoes').innerHTML = '';
            document.getElementById('numVariavelRestricao').value = '';
        });
    }
});


cont = 0;
function cria_matriz(filas, colunas) {
    matriz = new Array(filas);
    for (i = 0; i < filas; i++) {
        matriz[i] = new Array(colunas);
        for (j = 0; j < colunas; j++) {
            matriz[i][j] = 0;
        }
    }
}

function geraMatrizInputs() {
    var colunas = parseInt(document.getElementById('nd').value);
    var filas = parseInt(document.getElementById('nr').value);
    var fo = '';
    var aux = '';
    var matriz = '';
    var ceros = '';
    for (i = 1; i <= colunas; i++) {
        fo += '<input type="text" value="0" name="' + 'X' + i + '" id="' + 'X' + i + '" onClick="this.select();" required="required" style="text-align:right;" /> X' + i;
        ceros += 'X' + i;
        if (i != colunas) {
            fo += ' + ';
            ceros += ', ';
        }
    }
    document.getElementById('fo').innerHTML = '<p>Função Objetivo:</p>' + fo;
    for (i = 1; i <= filas; i++) {
        for (j = 1; j <= colunas; j++) {
            aux += '<input type="text" value="0" name="' + i + 'X' + j + '" id="' + i + 'X' + j + '" onClick="this.select();" required="required" style="text-align:right;" /> X' + j;
            if (j != colunas) {
                aux += ' + ';
            }
        }
        matriz += aux + ' ≤  <input type="text" value="0" name="' + 'R' + i + '" id="' + 'R' + i + '" onClick="this.select();" required="required"  /><br /><br />';
        aux = '';
    }
    document.getElementById('matriz').innerHTML = '<p>Restrições:</p>' + matriz;
    ceros += ' ≥ 0';
    document.getElementById('ceros').innerHTML = ceros + '<p><input type="button" value="Resolver" id="btIterar" onClick="iterar()" /></p><hr />';
    document.getElementById('nd').readOnly = true;
    document.getElementById('nr').readOnly = true;
}

function gera_matriz() {
    var variaveis = parseInt(document.getElementById('nd').value);
    var restricoes = parseInt(document.getElementById('nr').value);
    cria_matriz(restricoes + 2, variaveis + restricoes + 2);
    matriz[0][0] = 'Z';
    matriz[restricoes + 1][0] = 1;
    matriz[0][variaveis + restricoes + 1] = 'Sol';
    for (i = 1; i <= variaveis; i++) {
        matriz[0][i] = 'X' + i;
    }
    for (i = 1; i <= restricoes; i++) {
        matriz[0][i + variaveis] = 'S' + i;
    }
    for (i = 1; i <= restricoes; i++) {
        for (j = 1; j <= variaveis; j++) {
            matriz[i][j] = document.getElementById(i + 'X' + j).value;
        }
        matriz[i][variaveis + restricoes + 1] = document.getElementById('R' + i).value;
        for (j = 1; j <= restricoes; j++) {
            matriz[i][i + variaveis] = 1;
        }
    }
    for (j = 1; j <= variaveis; j++) {
        matriz[restricoes + 1][j] = (document.getElementById('X' + j).value) * (-1);
    }
    imprime_tabela();
}

function imprime_tabela() {
    var variaveis = parseInt(document.getElementById('nd').value);
    var restricoes = parseInt(document.getElementById('nr').value);
    var filas = restricoes + 2;
    var colunas = variaveis + restricoes + 2;
    var tabela = '<p>Tabela ' + cont + ':</p><table style="text-align:center; border-color:#CCC;" border="1" cellspacing="0" cellpadding="0">';
    for (i = 0; i < filas; i++) {
        tabela += '<tr>';
        for (j = 0; j < colunas; j++) {
            tabela += '<td>' + matriz[i][j] + '</td>';
        }
        tabela += '</tr>';
    }
    tabela += '</table>';
    document.getElementById('tabela').innerHTML += tabela;
    cont++;
}

function esFin() {
    var objetivo = document.getElementById('objetivo').value;
    var variaveis = parseInt(document.getElementById('nd').value);
    var restricoes = parseInt(document.getElementById('nr').value);
    if (objetivo == 'max') {
        for (j = 1; j <= variaveis; j++) {
            if (matriz[restricoes + 1][j] < 0) {
                return false;
            }
        }
        return true;
    }
    if (objetivo == 'min') {
        for (j = 1; j <= variaveis; j++) {
            if (matriz[restricoes + 1][j] > 0) {
                return false;
            }
        }
        return true;
    }
}

function encontraPivoteJ() {
    var objetivo = document.getElementById('objetivo').value;
    var variaveis = parseInt(document.getElementById('nd').value);
    var restricoes = parseInt(document.getElementById('nr').value);
    var itemFila = matriz[restricoes + 1][1];
    pivoteJ = 1;
    if (objetivo == 'max') {
        for (j = 1; j <= variaveis; j++) {
            if (matriz[restricoes + 1][j] < itemFila && matriz[restricoes + 1][j] != 0) {
                itemFila = matriz[restricoes + 1][j];
                pivoteJ = j;
            }
        }
    }
    if (objetivo == 'min') {
        for (j = 1; j <= variaveis; j++) {
            if (matriz[restricoes + 1][j] > itemFila && matriz[restricoes + 1][j] != 0) {
                itemFila = matriz[restricoes + 1][j];
                pivoteJ = j;
            }
        }
    }
}

function encontraPivoteI() {
    var restricoes = parseInt(document.getElementById('nr').value);
    var variaveis = parseInt(document.getElementById('nd').value);
    var razao = 0;
    var aux = Number.MAX_VALUE;
    pivoteI = 0;
    for (i = 1; i <= restricoes; i++) {
        razao = parseFloat(parseFloat(matriz[i][restricoes + variaveis + 1] / matriz[i][pivoteJ]));
        if (razao > 0 && razao < aux) {
            aux = razao;
            pivoteI = i;
        }
    }
}

function divideFila(i, n) {
    var variaveis = parseInt(document.getElementById('nd').value);
    var restricoes = parseInt(document.getElementById('nr').value);
    var ncolunas = variaveis + restricoes + 2;
    for (j = 0; j < ncolunas; j++) {
        matriz[i][j] = parseFloat(matriz[i][j]) / n;
    }
}

function iterar() {
    document.getElementById('btIterar').disabled = true;
    gera_matriz();
    var variaveis = parseInt(document.getElementById('nd').value);
    var restricoes = parseInt(document.getElementById('nr').value);
    var ncolunas = variaveis + restricoes + 2;
    var itemAux = 0;
    var resposta = '<p>Solução: </p>';
    while (esFin() == false) {
        encontraPivoteJ();
        encontraPivoteI();
        divideFila(pivoteI, matriz[pivoteI][pivoteJ]);
        for (i = 1; i <= (restricoes + 1); i++) {
            itemAux = matriz[i][pivoteJ];
            for (j = 0; j < ncolunas; j++) {
                if (i != pivoteI) {
                    matriz[i][j] = matriz[i][j] - (itemAux * matriz[pivoteI][j]);
                }
            }
        }
        imprime_tabela();
    }
    for (j = 1; j <= variaveis; j++) {
        for (i = 1; i <= restricoes; i++) {
            if (matriz[i][j] == 1) {
                resposta += matriz[0][j] + ' = ' + matriz[i][variaveis + restricoes + 1] + ' <br />';
            }
        }
    }
    resposta += 'Z = ' + matriz[restricoes + 1][variaveis + restricoes + 1].toFixed(2);

    document.getElementById('tabela').innerHTML += resposta + '<p>Fim do processo BB!</p><p><input type="button" value="click para reiniciar" onClick="location.reload()" /></p><hr />';
}
