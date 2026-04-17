// ⚠️ ATENÇÃO:
// NUNCA importar mocks diretamente da UI! Use sempre providers/contextos apropriados.
// Somente providers/serviços DEVEM importar isto. A interface deve acessar dados APENAS via providers/hooks.
// Isso prepara o sistema para uso real de APIs e torna o código mais sustentável.
//
// Centralized mock access so pages/components don't import raw mocks directly.
// Later this module can be swapped to fetch from an API without rewriting UI.
export * from '@/mocks/data';
