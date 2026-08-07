import type { PublicCadastroFormValues } from '../types/public-cadastro.types';

const REQUEST_TIMEOUT_MS = 12_000;

interface PublicCadastroApiResponse {
  ok?: boolean;
  message?: string;
}

class PublicCadastroRequestError extends Error {}

export async function submitPublicCadastro(form: PublicCadastroFormValues): Promise<void> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('/api/public/aluno-cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      signal: controller.signal,
    });

    const body = (await response.json().catch(() => ({}))) as PublicCadastroApiResponse;

    if (!response.ok || !body.ok) {
      throw new PublicCadastroRequestError(
        body.message || 'Não foi possível enviar. Tente novamente.',
      );
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Tempo de resposta excedido. Verifique a conexão e tente novamente.');
    }

    if (error instanceof PublicCadastroRequestError) {
      throw error;
    }

    throw new Error('Falha de rede. Verifique sua conexão e tente novamente.');
  } finally {
    window.clearTimeout(timeoutId);
  }
}
