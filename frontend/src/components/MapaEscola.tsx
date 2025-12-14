'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface Coordenadas {
  latitude: number;
  longitude: number;
}

interface MapaEscolaProps {
  coordenadas: Coordenadas;
  nomeEscola: string;
  endereco?: string;
}

function MapaEscolaComponent({ coordenadas, nomeEscola, endereco }: MapaEscolaProps) {
  const [L, setL] = useState<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      
      setMapReady(true);
    });
  }, []);

  useEffect(() => {
    if (!mapReady || !L) return;

    const container = document.getElementById('mapa-escola');
    if (!container) return;
    
    if ((container as any)._leaflet_id) {
      return;
    }

    const map = L.map('mapa-escola').setView(
      [coordenadas.latitude, coordenadas.longitude],
      15
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Ícone customizado para a escola
    const escolaIcon = L.divIcon({
      className: 'escola-marker',
      html: `
        <div style="
          background: #0B4F35;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          font-size: 28px;
        ">🏫</div>
      `,
      iconSize: [56, 56],
      iconAnchor: [28, 28],
    });

    // Marcador da escola
    L.marker([coordenadas.latitude, coordenadas.longitude], {
      icon: escolaIcon,
    })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; padding: 12px; min-width: 200px;">
          <strong style="color: #0B4F35; font-size: 16px;">🏫 ${nomeEscola}</strong>
          ${endereco ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">${endereco}</p>` : ''}
        </div>
      `)
      .openPopup();

    // Círculo de área de cobertura
    L.circle([coordenadas.latitude, coordenadas.longitude], {
      radius: 500,
      color: '#0B4F35',
      fillColor: '#9BC53D',
      fillOpacity: 0.15,
      weight: 3,
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [mapReady, L, coordenadas, nomeEscola, endereco]);

  if (!mapReady) {
    return (
      <div className="h-full flex items-center justify-center bg-off-white rounded-xl">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-verde-brocolis border-t-verde-conecta rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display font-bold text-verde-conecta">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
      />
      <div id="mapa-escola" className="h-full w-full rounded-xl" />
    </>
  );
}

export const MapaEscola = dynamic(() => Promise.resolve(MapaEscolaComponent), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-off-white rounded-xl">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-verde-brocolis border-t-verde-conecta rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display font-bold text-verde-conecta">Carregando mapa...</p>
      </div>
    </div>
  ),
});

export default MapaEscola;
