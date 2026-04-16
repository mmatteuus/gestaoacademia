# Integração Google Sheets como “banco de dados” para aplicação / agente IA

## Objetivo
Usar uma planilha do Google Sheets como armazenamento simples para uma aplicação ou agente IA, com autenticação via OAuth 2.0 e acesso pela Google Sheets API.

---

## Estado atual
A prova de conceito já foi validada com sucesso:

- OAuth configurado no Google Cloud
- `client_id` criado
- `client_secret` criado
- escopos configurados
- `authorization code` trocado por tokens
- escrita na planilha funcionando pela API
- planilha definida para uso na aplicação

---

## Projeto GCP
- **Project ID:** `gemeos-academia`

---

## OAuth Client
- **Client ID:** `654931705791-4h9snv5ug4h6vhegguecn61ta1jep2p2.apps.googleusercontent.com`
- **Redirect URI usado na POC:** `http://localhost:3000/oauth/google/callback`

> Observação: para produção, trocar o redirect URI para a URL real do backend.

---

## Escopos usados
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive.file`

---

## Planilha usada
- **Spreadsheet ID:** `1RKl0S6Bf_vVW_KJgWsY1GwWS1cGL--_rN2TUp3S-LsM`
- **URL:** `https://docs.google.com/spreadsheets/d/1RKl0S6Bf_vVW_KJgWsY1GwWS1cGL--_rN2TUp3S-LsM/edit?gid=0#gid=0`

---

## Tokens obtidos na POC
### Access Token
```text
ya29.a0Aa7MYiq5W5EycyQUWweZbrV3tXXlBiFxiUW_FTYhg1bfdyN4fk5dQaOInF2-yRspcuu5nj2_Xkkeaab_4sJHJRXqkPXKl8rPf50fbb5AlJ-ZQ3L2RNHORrseYWLm8-C4C4xKVFQ3DtChzq-kYgsIVBeOnbDtnH3CIdToFMjx08iqwu7bqYXoLbEGFX9l6XjUW8S062IaCgYKAcsSARESFQHGX2Mis4j7pcjRap0lr5Xi4Zh1jw0206
```

### Refresh Token
```text
1//05jx5hZx8_OyKCgYIARAAGAUSNwF-L9IrB7CyJxTYMpqUWz2EvCGs2JUsA5N4I-Xde6i500t2_ihkhcm3NigJhgd1UZK1cxUdTng
```

> **Importante:** estes tokens foram expostos durante a POC. Para uso real, rotacionar credenciais e gerar novos tokens.

---

## Client Secret
> **Não incluir em documento compartilhável.**
>
> O `client_secret` deve ficar em segredo e ser armazenado com segurança no backend ou em Secret Manager.
>
> Para a demo, ele foi usado manualmente para obter os tokens, mas não deve ser persistido em repositório nem enviado para terceiros.

---

## Fluxo OAuth usado
### 1. Gerar URL de autorização
```text
https://accounts.google.com/o/oauth2/v2/auth?client_id=654931705791-4h9snv5ug4h6vhegguecn61ta1jep2p2.apps.googleusercontent.com&redirect_uri=http://localhost:3000/oauth/google/callback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&access_type=offline&prompt=consent
```

### 2. Usuário autoriza o acesso
O Google redireciona para:
```text
http://localhost:3000/oauth/google/callback?code=...&scope=...
```

### 3. Trocar `code` por tokens
```bash
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=SEU_AUTHORIZATION_CODE" \
  -d "client_id=654931705791-4h9snv5ug4h6vhegguecn61ta1jep2p2.apps.googleusercontent.com" \
  -d "client_secret=SEU_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:3000/oauth/google/callback" \
  -d "grant_type=authorization_code"
```

### 4. Renovar access token com refresh token
```bash
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=654931705791-4h9snv5ug4h6vhegguecn61ta1jep2p2.apps.googleusercontent.com" \
  -d "client_secret=SEU_CLIENT_SECRET" \
  -d "refresh_token=1//05jx5hZx8_OyKCgYIARAAGAUSNwF-L9IrB7CyJxTYMpqUWz2EvCGs2JUsA5N4I-Xde6i500t2_ihkhcm3NigJhgd1UZK1cxUdTng" \
  -d "grant_type=refresh_token"
```

---

## Leitura da planilha
Exemplo de leitura do intervalo `A1:Z20`:

```bash
curl -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
"https://sheets.googleapis.com/v4/spreadsheets/1RKl0S6Bf_vVW_KJgWsY1GwWS1cGL--_rN2TUp3S-LsM/values/A1:Z20"
```

---

## Escrita na planilha
Exemplo de escrita no intervalo `A1:B3`:

```bash
curl -X PUT \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  "https://sheets.googleapis.com/v4/spreadsheets/1RKl0S6Bf_vVW_KJgWsY1GwWS1cGL--_rN2TUp3S-LsM/values/A1:B3?valueInputOption=USER_ENTERED" \
  -d '{"values":[["id","nome"],["1","Mateus"],["2","Demo"]]}'
```

### Resposta obtida na POC
```json
{
  "spreadsheetId": "1RKl0S6Bf_vVW_KJgWsY1GwWS1cGL--_rN2TUp3S-LsM",
  "updatedRange": "'Página1'!A1:B3",
  "updatedRows": 3,
  "updatedColumns": 2,
  "updatedCells": 6
}
```

---

## Modelo recomendado da planilha
Usar a primeira linha como cabeçalho.

Exemplo:
```text
id | nome | email | status | created_at
1  | ...  | ...   | ...    | ...
2  | ...  | ...   | ...    | ...
```

### Convenção sugerida
- linha 1 = nomes das colunas
- cada linha = um registro
- coluna `id` = identificador único
- evitar fórmulas em colunas de dados críticos

---

## Operações mínimas para a aplicação/agente
Implementar estas 4 operações:
- `listRows()`
- `getRowById(id)`
- `insertRow(data)`
- `updateRow(id, data)`

---

## Estrutura lógica sugerida para o agente IA
### Entradas necessárias
- `spreadsheetId`
- `client_id`
- `client_secret` (armazenado em segredo)
- `refresh_token`

### Fluxo operacional
1. Trocar `refresh_token` por `access_token`
2. Ler os dados da planilha
3. Decidir a ação
4. Escrever ou atualizar linhas pela API
5. Registrar logs da execução

---

## Recomendação mínima de segurança
Mesmo sendo demo, para qualquer continuação:
- rotacionar `client_secret`
- gerar novos tokens
- guardar `refresh_token` em Secret Manager
- nunca expor `client_secret` no frontend
- nunca expor `refresh_token` no frontend

---

## Resumo final
A integração foi validada.
Hoje já é possível:
- autenticar no Google
- acessar a planilha
- ler dados
- escrever dados
- usar o Google Sheets como armazenamento simples para uma aplicação ou agente IA

Para virar algo reutilizável:
- mover a troca de token para o backend
- persistir o `refresh_token` com segurança
- criar funções CRUD na aplicação

