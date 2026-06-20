/**
 * Retorna a URL da imagem da bandeira do país de acordo com a API pública e estável FlagCDN.
 * @param countryCode Código do país (ex: 'BR', 'US', 'es') no padrão ISO 3166-1 alpha-2.
 * @returns URL da imagem da bandeira ou null se o código for inválido/vazio.
 */
export function getCountryFlagUrl(countryCode: string | null | undefined): string | null {
  if (!countryCode || typeof countryCode !== 'string') {
    return null;
  }
  return `https://flagcdn.com/w40/${countryCode.trim().toLowerCase()}.png`;
}
