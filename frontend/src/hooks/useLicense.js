import { differenceInDays, parseISO, isValid, addDays, format } from 'date-fns';

/**
 * Hook para controle de licenciamento do Fiscaliza Ambiental
 * @param {string} installationDate - Data de instalação no formato 'YYYY-MM-DD'
 */
export const useLicense = (installationDate) => {
  const TRIAL_PERIOD_DAYS = 90;
  
  // 1. Validar a data de entrada
  const installDate = parseISO(installationDate);
  
  if (!isValid(installDate)) {
    console.error("Erro Crítico: Data de instalação inválida.");
    return { isExpired: true, daysRemaining: 0, error: true };
  }

  // 2. Definir data atual (No futuro, buscar do servidor para evitar alteração no relógio local)
  const today = new Date();
  
  // 3. Calcular data de expiração
  const expirationDate = addDays(installDate, TRIAL_PERIOD_DAYS);
  
  // 4. Calcular dias decorridos e restantes
  const daysUsed = differenceInDays(today, installDate);
  const daysRemaining = differenceInDays(expirationDate, today);
  
  // 5. Lógica de Bloqueio
  // O sistema bloqueia se os dias usados ultrapassarem o limite 
  // ou se a data atual for maior que a data de expiração.
  const isExpired = daysUsed >= TRIAL_PERIOD_DAYS || daysRemaining <= 0;

  return {
    isExpired,
    daysRemaining: Math.max(0, daysRemaining),
    daysUsed,
    expirationDate: format(expirationDate, 'dd/MM/yyyy'),
    status: isExpired ? 'EXPIRADO' : 'ATIVO',
    // Flag para mostrar avisos quando estiver chegando perto (ex: 15 dias)
    showWarning: daysRemaining <= 15 && !isExpired
  };
};