# 02 — Objetivo Final

## Meta principal

Concluir o frontend atual, mantendo o que já existe, mas reorganizando a aplicação para que ela entre em um monorepo sem carregar dívidas estruturais para a próxima etapa.

## Definição de pronto

O frontend será considerado pronto quando cumprir tudo abaixo:

1. Todas as rotas principais estiverem acessíveis.
2. O módulo de responsáveis estiver integrado em rota, menu e fluxo de alunos.
3. Os formulários prioritários estiverem concluídos com validação formal.
4. O responsável continuar opcional no cadastro de aluno.
5. Aluno e responsável exibirem e coletarem seus contatos corretamente.
6. A UI estiver funcional em mobile, tablet e desktop.
7. A camada de dados estiver desacoplada da camada visual.
8. O projeto já estiver organizado para futura migração para `apps/web`.
9. O rodapé obrigatório estiver presente em todo o frontend.
10. O backend futuro puder ser conectado por contratos e adaptadores, sem reescrever as páginas.

## Regras obrigatórias

- Não remover módulos existentes sem ordem explícita.
- Não reconstruir do zero.
- Não manter o módulo de responsáveis invisível.
- Não acoplar componentes visuais ao formato bruto dos mocks.
- Não persistir sentinelas como `none` no domínio final.
- Não deixar formulários críticos sem RHF + Zod.
- Não introduzir `any` nas partes novas.

## Modelo funcional desejado

### Aluno
Deve conter:
- dados pessoais;
- contato do aluno;
- dados administrativos;
- observações;
- vínculo opcional com responsável;
- estrutura pronta para histórico quando backend existir.

### Responsável
Deve conter:
- dados pessoais;
- contato do responsável;
- lista de alunos vinculados;
- ações de vínculo e desvínculo.

### Regra da relação

- um aluno pode não ter responsável;
- um aluno pode ter um responsável principal;
- um responsável pode estar vinculado a vários alunos.

## Resultado estrutural esperado

O frontend deve sair desta etapa com formato compatível com o seguinte destino:

```txt
apps/
  web/
    src/
      pages/
      features/
      services/
      components/
      hooks/
      types/
```
