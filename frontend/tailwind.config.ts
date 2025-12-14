import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores Institucionais - Manual da Marca
        'verde-conecta': '#0B4F35',
        'creme-papel': '#FFFDF5',
        'verde-merenda': '#9BC53D',
        
        // Cores de Apoio (Os Vegetais)
        'vermelho-tomate': '#E04F38',
        'laranja-cenoura': '#F47C20',
        'verde-brocolis': '#9BC53D',
        'amarelo-pimentao': '#FCCE38',
        
        // Neutras
        'off-white': '#F4F7F5',
        'text-main': '#1A1A1A',
        'text-muted': '#666666',
        'border-light': '#E0E0E0',
      },
      fontFamily: {
        'display': ['Nunito', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'btn': '50px',
        'input': '12px',
      },
      boxShadow: {
        'hard': '4px 4px 0px #0B4F35',
        'hard-hover': '6px 6px 0px #0B4F35',
        'soft': '0 4px 12px rgba(0,0,0,0.05)',
        'card': '0 4px 20px rgba(11, 79, 53, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
