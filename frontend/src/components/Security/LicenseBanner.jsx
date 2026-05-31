import React from 'react';
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useLicense } from '../../hooks/useLicense';

const LicenseBanner = ({ installationDate }) => {
  const { showWarning, daysRemaining, isExpired } = useLicense(installationDate);

  // Se já expirou, o TrialGuard já bloqueia tudo, então não precisamos do banner.
  // Se não for para mostrar o aviso (mais de 15 dias), retornamos null.
  if (!showWarning || isExpired) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        <div className="flex flex-1 items-center font-medium text-amber-800">
          <span className="flex p-2 bg-amber-100 rounded-lg mr-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" aria-hidden="true" />
          </span>
          <p className="text-sm">
            <span className="font-bold">Período de Avaliação:</span>
            <span className="ml-1">
              Atenção Engenheiro Márcio, restam apenas <span className="underline decoration-2 font-black">{daysRemaining} dias</span> de licença trial. 
            </span>
          </p>
        </div>
        
        <div className="mt-2 flex-shrink-0 w-full sm:mt-0 sm:w-auto">
          <button
            onClick={() => window.open('https://wa.me/seu-numero', '_blank')}
            className="flex items-center justify-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors uppercase"
          >
            Regularizar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseBanner;