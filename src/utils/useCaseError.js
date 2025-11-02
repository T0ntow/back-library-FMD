/**
 * @typedef {Object} UseCaseError
 * @property {number} status - Código de status HTTP.
 * @property {string} message - Mensagem de erro.
 * @property {Object.<string, string[]>} errors - Erros detalhados por campo.
 */

/**
 * Cria um objeto padronizado de erro de caso de uso.
 * @param {number} status - Código de status HTTP.
 * @param {string} message - Mensagem de erro principal.
 * @param {Object.<string, string[]>} [fieldErrors={}] - Erros específicos por campo.
 * @returns {UseCaseError}
 */
const createUseCaseError = (status, message, fieldErrors = {}) => {
  return { status, message, errors: fieldErrors };
};

module.exports = { createUseCaseError };
