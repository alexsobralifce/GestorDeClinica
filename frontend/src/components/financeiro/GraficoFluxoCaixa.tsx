import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GraficoFluxoCaixaProps {
  dados: {
    data: Date;
    entradasAcumuladas: number;
    saidasAcumuladas: number;
    saldo: number;
  }[];
  onClickPonto?: (data: any) => void;
}

export function GraficoFluxoCaixa({ dados, onClickPonto }: GraficoFluxoCaixaProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM', { locale: ptBR });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-4 shadow-xl border-2 border-[#e8e5df]">
          <p className="font-semibold text-[#2b2926] mb-2">
            {format(new Date(payload[0].payload.data), "dd 'de' MMMM", { locale: ptBR })}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-[#2b2926] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Evolução do Fluxo de Caixa
      </h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={dados}
          onClick={onClickPonto}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e5df" />
          
          <XAxis
            dataKey="data"
            tickFormatter={(date) => formatDate(date)}
            stroke="#7a7369"
            style={{ fontSize: '12px', fontFamily: 'var(--font-body)' }}
          />
          
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            stroke="#7a7369"
            style={{ fontSize: '12px', fontFamily: 'var(--font-body)' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            }}
          />
          
          <Line
            type="monotone"
            dataKey="entradasAcumuladas"
            stroke="#4a7c65"
            strokeWidth={3}
            name="Entradas"
            dot={{ fill: '#4a7c65', r: 4 }}
            activeDot={{ r: 6, onClick: onClickPonto }}
          />
          
          <Line
            type="monotone"
            dataKey="saidasAcumuladas"
            stroke="#e85d3f"
            strokeWidth={3}
            name="Saídas"
            dot={{ fill: '#e85d3f', r: 4 }}
            activeDot={{ r: 6 }}
          />
          
          <Line
            type="monotone"
            dataKey="saldo"
            stroke="#6b9dd8"
            strokeWidth={3}
            strokeDasharray="5 5"
            name="Saldo"
            dot={{ fill: '#6b9dd8', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
