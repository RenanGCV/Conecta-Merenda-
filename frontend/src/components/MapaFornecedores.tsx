'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface Coordenadas {
  latitude: number;
  longitude: number;
}

interface FornecedorMapa {
  id: string;
  nome: string;
  propriedade: string;
  coordenadas: Coordenadas;
  distancia: number;
  avaliacao: number;
  produtos: string[];
}

interface MapaFornecedoresProps {
  escolaCoordenadas: Coordenadas;
  fornecedores: FornecedorMapa[];
  onFornecedorClick?: (id: string) => void;
}

function MapaFornecedoresComponent({ escolaCoordenadas, fornecedores, onFornecedorClick }: MapaFornecedoresProps) {
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

    const container = document.getElementById('mapa-fornecedores');
    if (!container) return;
    
    if ((container as any)._leaflet_id) {
      return;
    }

    const map = L.map('mapa-fornecedores').setView(
      [escolaCoordenadas.latitude, escolaCoordenadas.longitude],
      11 // Zoom mais afastado pois fornecedores podem estar mais longe
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
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          font-size: 24px;
        ">🏫</div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    // Marcador da escola
    L.marker([escolaCoordenadas.latitude, escolaCoordenadas.longitude], {
      icon: escolaIcon,
    })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong style="color: #0B4F35; font-size: 14px;">🏫 Sua Escola</strong>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">Centro do mapa</p>
        </div>
      `);

    // Ícone customizado para fornecedores (empresas)
    const criarIconeFornecedor = (distancia: number) => {
      const cor = distancia <= 10 ? '#F47C20' : distancia <= 30 ? '#8B5CF6' : '#6B7280';
      return L.divIcon({
        className: 'fornecedor-marker',
        html: `
          <div style="
            background: ${cor};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 3px 6px rgba(0,0,0,0.3);
            font-size: 18px;
          ">🏭</div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
    };

    // Marcadores dos fornecedores
    fornecedores.forEach((fornecedor) => {
      const marker = L.marker(
        [fornecedor.coordenadas.latitude, fornecedor.coordenadas.longitude],
        { icon: criarIconeFornecedor(fornecedor.distancia) }
      ).addTo(map);

      marker.bindPopup(`
        <div style="min-width: 220px; padding: 8px;">
          <strong style="color: #F47C20; font-size: 14px;">🏭 ${fornecedor.nome}</strong>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">${fornecedor.propriedade}</p>
          <div style="display: flex; align-items: center; gap: 4px; margin: 8px 0;">
            <span style="color: #F4A100;">⭐</span>
            <span style="font-size: 12px;">${fornecedor.avaliacao.toFixed(1)}</span>
            <span style="color: #666; font-size: 12px;">• ${fornecedor.distancia.toFixed(1)} km</span>
          </div>
          <p style="font-size: 11px; color: #666;">
            <strong>Produtos:</strong> ${fornecedor.produtos.slice(0, 3).join(', ')}
          </p>
        </div>
      `);

      marker.on('click', () => {
        if (onFornecedorClick) {
          onFornecedorClick(fornecedor.id);
        }
      });
    });

    // Círculos de raio (maiores para fornecedores)
    L.circle([escolaCoordenadas.latitude, escolaCoordenadas.longitude], {
      radius: 10000, // 10km
      color: '#F47C20',
      fillColor: '#F47C20',
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(map).bindTooltip('10 km', { permanent: false });

    L.circle([escolaCoordenadas.latitude, escolaCoordenadas.longitude], {
      radius: 30000, // 30km
      color: '#8B5CF6',
      fillColor: '#8B5CF6',
      fillOpacity: 0.05,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(map).bindTooltip('30 km', { permanent: false });

    return () => {
      map.remove();
    };
  }, [mapReady, L, escolaCoordenadas, fornecedores, onFornecedorClick]);

  if (!mapReady) {
    return (
      <div className="h-full flex items-center justify-center bg-off-white rounded-xl">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-laranja-cenoura border-t-verde-conecta rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display font-bold text-laranja-cenoura">Carregando mapa...</p>
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
      <div id="mapa-fornecedores" className="h-full w-full rounded-xl" />
    </>
  );
}

export const MapaFornecedores = dynamic(() => Promise.resolve(MapaFornecedoresComponent), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-off-white rounded-xl">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-laranja-cenoura border-t-verde-conecta rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display font-bold text-laranja-cenoura">Carregando mapa...</p>
      </div>
    </div>
  ),
});

export default MapaFornecedores;
