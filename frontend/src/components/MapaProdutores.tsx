'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Tipos
interface Coordenadas {
  latitude: number;
  longitude: number;
}

interface ProdutorMapa {
  id: string;
  nome: string;
  propriedade: string;
  coordenadas: Coordenadas;
  distancia: number;
  avaliacao: number;
  produtos: string[];
}

interface MapaProdutoresProps {
  escolaCoordenadas: Coordenadas;
  produtores: ProdutorMapa[];
  onProdutorClick?: (id: string) => void;
}

// Dados mockados de produtores no RJ
export const PRODUTORES_RJ: ProdutorMapa[] = [
  {
    id: '1',
    nome: 'João da Roça',
    propriedade: 'Sítio Boa Esperança',
    coordenadas: { latitude: -22.9350, longitude: -43.2100 },
    distancia: 3.2,
    avaliacao: 4.8,
    produtos: ['Alface', 'Tomate', 'Cenoura'],
  },
  {
    id: '2',
    nome: 'Maria Orgânica',
    propriedade: 'Fazenda Verde Vida',
    coordenadas: { latitude: -22.9700, longitude: -43.2200 },
    distancia: 4.5,
    avaliacao: 4.9,
    produtos: ['Couve', 'Brócolis', 'Espinafre'],
  },
  {
    id: '3',
    nome: 'Pedro Frutas',
    propriedade: 'Pomar do Vale',
    coordenadas: { latitude: -22.9200, longitude: -43.1700 },
    distancia: 5.1,
    avaliacao: 4.7,
    produtos: ['Banana', 'Laranja', 'Mamão'],
  },
  {
    id: '4',
    nome: 'Ana Hortifruti',
    propriedade: 'Horta Familiar',
    coordenadas: { latitude: -22.9600, longitude: -43.1500 },
    distancia: 6.3,
    avaliacao: 4.6,
    produtos: ['Pepino', 'Pimentão', 'Abobrinha'],
  },
  {
    id: '5',
    nome: 'Carlos Legumes',
    propriedade: 'Terra Boa',
    coordenadas: { latitude: -22.9000, longitude: -43.2500 },
    distancia: 8.2,
    avaliacao: 4.5,
    produtos: ['Batata', 'Mandioca', 'Inhame'],
  },
  {
    id: '6',
    nome: 'Fernanda Campo',
    propriedade: 'Recanto Natural',
    coordenadas: { latitude: -22.8800, longitude: -43.2800 },
    distancia: 12.5,
    avaliacao: 4.8,
    produtos: ['Ovos Caipira', 'Queijo Fresco', 'Mel'],
  },
  {
    id: '7',
    nome: 'Roberto Orgânicos',
    propriedade: 'Sítio São José',
    coordenadas: { latitude: -22.8500, longitude: -43.3000 },
    distancia: 15.0,
    avaliacao: 4.9,
    produtos: ['Morango', 'Amora', 'Jabuticaba'],
  },
  {
    id: '8',
    nome: 'Lucia Verde',
    propriedade: 'Chácara das Flores',
    coordenadas: { latitude: -22.9800, longitude: -43.3500 },
    distancia: 18.7,
    avaliacao: 4.4,
    produtos: ['Ervas Aromáticas', 'Chás', 'Temperos'],
  },
];

// Componente do mapa que será carregado dinamicamente
function MapaComponent({ escolaCoordenadas, produtores, onProdutorClick }: MapaProdutoresProps) {
  const [L, setL] = useState<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Importar Leaflet apenas no cliente
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      
      // Corrigir ícones do Leaflet
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

    // Limpar mapa existente
    const container = document.getElementById('mapa-produtores');
    if (!container) return;
    
    // Verificar se já existe um mapa
    if ((container as any)._leaflet_id) {
      return;
    }

    // Criar mapa
    const map = L.map('mapa-produtores').setView(
      [escolaCoordenadas.latitude, escolaCoordenadas.longitude],
      13
    );

    // Adicionar tiles
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

    // Ícone customizado para produtores
    const criarIconeProdutor = (distancia: number) => {
      const cor = distancia <= 5 ? '#9BC53D' : distancia <= 10 ? '#F4A100' : '#F47C20';
      return L.divIcon({
        className: 'produtor-marker',
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
          ">🥬</div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
    };

    // Marcadores dos produtores
    produtores.forEach((produtor) => {
      const marker = L.marker(
        [produtor.coordenadas.latitude, produtor.coordenadas.longitude],
        { icon: criarIconeProdutor(produtor.distancia) }
      ).addTo(map);

      marker.bindPopup(`
        <div style="min-width: 200px; padding: 8px;">
          <strong style="color: #0B4F35; font-size: 14px;">🧑‍🌾 ${produtor.nome}</strong>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">${produtor.propriedade}</p>
          <div style="display: flex; align-items: center; gap: 4px; margin: 8px 0;">
            <span style="color: #F4A100;">⭐</span>
            <span style="font-size: 12px;">${produtor.avaliacao.toFixed(1)}</span>
            <span style="color: #666; font-size: 12px;">• ${produtor.distancia.toFixed(1)} km</span>
          </div>
          <p style="font-size: 11px; color: #666;">
            <strong>Produtos:</strong> ${produtor.produtos.slice(0, 3).join(', ')}
          </p>
        </div>
      `);

      marker.on('click', () => {
        if (onProdutorClick) {
          onProdutorClick(produtor.id);
        }
      });
    });

    // Círculos de raio
    L.circle([escolaCoordenadas.latitude, escolaCoordenadas.longitude], {
      radius: 5000, // 5km
      color: '#9BC53D',
      fillColor: '#9BC53D',
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(map).bindTooltip('5 km', { permanent: false });

    L.circle([escolaCoordenadas.latitude, escolaCoordenadas.longitude], {
      radius: 10000, // 10km
      color: '#F4A100',
      fillColor: '#F4A100',
      fillOpacity: 0.05,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(map).bindTooltip('10 km', { permanent: false });

    // Cleanup
    return () => {
      map.remove();
    };
  }, [mapReady, L, escolaCoordenadas, produtores, onProdutorClick]);

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
      <div id="mapa-produtores" className="h-full w-full rounded-xl" />
    </>
  );
}

// Exportar componente com dynamic import para evitar SSR
export const MapaProdutores = dynamic(() => Promise.resolve(MapaComponent), {
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

export default MapaProdutores;
