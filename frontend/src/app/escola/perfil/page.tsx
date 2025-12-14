'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building2,
  Phone,
  Mail,
  User,
  Save,
  School,
  Users,
  Calendar,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

interface PerfilEscola {
  nome: string;
  diretor: string;
  email: string;
  telefone: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  coordenadas: {
    latitude: number;
    longitude: number;
  };
  totalAlunos: number;
  turno: string;
}

// Dados mockados da escola no Rio de Janeiro
const DADOS_INICIAIS: PerfilEscola = {
  nome: 'E.M. Professora Maria da Glória',
  diretor: 'Maria Silva',
  email: 'diretora@escola.rj.gov.br',
  telefone: '(21) 3333-4444',
  endereco: {
    logradouro: 'Rua Voluntários da Pátria',
    numero: '450',
    complemento: '',
    bairro: 'Botafogo',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cep: '22270-000',
  },
  coordenadas: {
    latitude: -22.9519,
    longitude: -43.1857,
  },
  totalAlunos: 850,
  turno: 'Integral',
};

export default function PerfilEscolaPage() {
  const [perfil, setPerfil] = useState<PerfilEscola>(DADOS_INICIAIS);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const saved = localStorage.getItem('perfilEscola');
    if (saved) {
      setPerfil(JSON.parse(saved));
    }
  }, []);

  const handleChange = (campo: string, valor: string) => {
    if (campo.includes('.')) {
      const [parent, child] = campo.split('.');
      setPerfil(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PerfilEscola] as object),
          [child]: valor,
        },
      }));
    } else {
      setPerfil(prev => ({
        ...prev,
        [campo]: valor,
      }));
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      // Simular geocodificação do endereço
      // Em produção, usaria API de geocodificação
      const novasCoordenadas = await geocodificarEndereco(perfil.endereco);
      
      const perfilAtualizado = {
        ...perfil,
        coordenadas: novasCoordenadas,
      };
      
      localStorage.setItem('perfilEscola', JSON.stringify(perfilAtualizado));
      setPerfil(perfilAtualizado);
      setEditando(false);
      toast.success('Perfil salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  // Simulação de geocodificação com coordenadas do RJ
  const geocodificarEndereco = async (endereco: PerfilEscola['endereco']) => {
    // Mapeamento de bairros do RJ para coordenadas
    const bairrosRJ: Record<string, { latitude: number; longitude: number }> = {
      'botafogo': { latitude: -22.9519, longitude: -43.1857 },
      'copacabana': { latitude: -22.9711, longitude: -43.1822 },
      'ipanema': { latitude: -22.9838, longitude: -43.2096 },
      'leblon': { latitude: -22.9841, longitude: -43.2247 },
      'tijuca': { latitude: -22.9253, longitude: -43.2358 },
      'centro': { latitude: -22.9068, longitude: -43.1729 },
      'barra da tijuca': { latitude: -23.0000, longitude: -43.3650 },
      'jacarepagua': { latitude: -22.9494, longitude: -43.3588 },
      'meier': { latitude: -22.9022, longitude: -43.2803 },
      'madureira': { latitude: -22.8736, longitude: -43.3389 },
      'campo grande': { latitude: -22.9036, longitude: -43.5614 },
      'santa cruz': { latitude: -22.9136, longitude: -43.6833 },
      'niteroi': { latitude: -22.8833, longitude: -43.1036 },
    };

    const bairroNormalizado = endereco.bairro.toLowerCase();
    const coordenadas = bairrosRJ[bairroNormalizado] || bairrosRJ['botafogo'];
    
    return coordenadas;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-3xl text-verde-conecta">
              👤 Perfil da Escola
            </h1>
            <p className="font-body text-text-muted">
              Gerencie as informações da sua escola
            </p>
          </div>
          {!editando ? (
            <Button onClick={() => setEditando(true)}>
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvar} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Básicas */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="w-5 h-5" />
                Informações da Escola
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome da Escola"
                  value={perfil.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  disabled={!editando}
                  icon={<Building2 className="w-5 h-5" />}
                />
                <Input
                  label="Nome da Diretora"
                  value={perfil.diretor}
                  onChange={(e) => handleChange('diretor', e.target.value)}
                  disabled={!editando}
                  icon={<User className="w-5 h-5" />}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="E-mail"
                  type="email"
                  value={perfil.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!editando}
                  icon={<Mail className="w-5 h-5" />}
                />
                <Input
                  label="Telefone"
                  value={perfil.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  disabled={!editando}
                  icon={<Phone className="w-5 h-5" />}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Total de Alunos"
                  type="number"
                  value={perfil.totalAlunos.toString()}
                  onChange={(e) => handleChange('totalAlunos', e.target.value)}
                  disabled={!editando}
                  icon={<Users className="w-5 h-5" />}
                />
                <Input
                  label="Turno"
                  value={perfil.turno}
                  onChange={(e) => handleChange('turno', e.target.value)}
                  disabled={!editando}
                  icon={<Calendar className="w-5 h-5" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card de Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-off-white rounded-xl border-3 border-verde-conecta flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-verde-conecta mx-auto mb-2" />
                  <p className="font-display font-bold text-verde-conecta">
                    {perfil.endereco.cidade}
                  </p>
                  <p className="font-body text-sm text-text-muted">
                    {perfil.endereco.bairro}
                  </p>
                  <p className="font-body text-xs text-text-muted mt-2">
                    Lat: {perfil.coordenadas.latitude.toFixed(4)}
                  </p>
                  <p className="font-body text-xs text-text-muted">
                    Lng: {perfil.coordenadas.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Endereço Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Logradouro"
                  value={perfil.endereco.logradouro}
                  onChange={(e) => handleChange('endereco.logradouro', e.target.value)}
                  disabled={!editando}
                />
              </div>
              <Input
                label="Número"
                value={perfil.endereco.numero}
                onChange={(e) => handleChange('endereco.numero', e.target.value)}
                disabled={!editando}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Complemento"
                value={perfil.endereco.complemento}
                onChange={(e) => handleChange('endereco.complemento', e.target.value)}
                disabled={!editando}
              />
              <Input
                label="Bairro"
                value={perfil.endereco.bairro}
                onChange={(e) => handleChange('endereco.bairro', e.target.value)}
                disabled={!editando}
              />
              <Input
                label="CEP"
                value={perfil.endereco.cep}
                onChange={(e) => handleChange('endereco.cep', e.target.value)}
                disabled={!editando}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cidade"
                value={perfil.endereco.cidade}
                onChange={(e) => handleChange('endereco.cidade', e.target.value)}
                disabled={!editando}
              />
              <Input
                label="Estado"
                value={perfil.endereco.estado}
                onChange={(e) => handleChange('endereco.estado', e.target.value)}
                disabled={!editando}
              />
            </div>
            
            {editando && (
              <div className="p-4 bg-amarelo-pimentao/10 rounded-xl border-2 border-amarelo-pimentao">
                <p className="font-body text-sm text-text-default">
                  💡 <strong>Dica:</strong> Ao salvar, as coordenadas serão atualizadas automaticamente 
                  com base no bairro informado. Isso ajudará a encontrar produtores mais próximos!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
