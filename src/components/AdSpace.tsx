/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Megaphone } from 'lucide-react';

interface AdSpaceProps {
  type: 'top-banner' | 'sidebar' | 'inline' | 'footer-banner';
  className?: string;
}

export default function AdSpace({ type, className = '' }: AdSpaceProps) {
  const getAdDimensions = () => {
    switch (type) {
      case 'top-banner':
        return {
          title: 'Banner Superior (728x90)',
          dimensions: 'max-w-[728px] h-[90px]',
          description: 'Espaço premium para anúncios de alta visibilidade acima do cabeçalho principal.'
        };
      case 'sidebar':
        return {
          title: 'Banner Lateral (300x250)',
          dimensions: 'w-full h-[250px]',
          description: 'Espaço ideal para engajamento contínuo durante a navegação lateral.'
        };
      case 'inline':
        return {
          title: 'Anúncio no Conteúdo (600x120)',
          dimensions: 'w-full h-[120px]',
          description: 'Anúncio nativo posicionado de forma fluida entre parágrafos ou seções.'
        };
      case 'footer-banner':
        return {
          title: 'Banner de Rodapé (970x90)',
          dimensions: 'max-w-[970px] h-[90px]',
          description: 'Espaço horizontal de encerramento, excelente para campanhas de marca.'
        };
    }
  };

  const ad = getAdDimensions();

  return (
    <div 
      className={`relative mx-auto flex flex-col items-center justify-center border border-dashed border-purple-500/30 bg-purple-950/20 text-center rounded-lg p-2 transition-all hover:border-brand-purple/50 ${ad.dimensions} ${className}`}
      id={`ad-space-${type}`}
    >
      <div className="absolute top-1 right-2 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-purple-400/60">
        <Megaphone className="h-2.5 w-2.5" />
        <span>Patrocinado</span>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-1 text-purple-300/80">
        <span className="font-mono text-xs font-semibold tracking-wider text-brand-blue/90">{ad.title}</span>
        <span className="hidden sm:inline text-[10px] text-purple-400/60 max-w-[80%] leading-tight">{ad.description}</span>
      </div>

      {/* Embedded Script simulation comment */}
      <span className="absolute bottom-1 left-2 font-mono text-[8px] text-purple-500/30">
        &lt;ins class="adsbygoogle" style="display:block" data-ad-format="auto"&gt;
      </span>
    </div>
  );
}
