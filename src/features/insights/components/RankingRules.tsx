import {
  Medal,
  Minus,
  Swords,
  TrendingDown,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

const scoringRules: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Vitórias',
    description: '+15 pontos por vitória registrada em campeonato oficial.',
    icon: Swords,
  },
  {
    title: 'Medalhas',
    description: '+25 pontos por medalha conquistada (ouro, prata ou bronze).',
    icon: Medal,
  },
  {
    title: 'Consistência',
    description: 'Pontuação extra concedida pela participação contínua e presença em treinos.',
    icon: Trophy,
  },
];

const categoryRules = [
  ['Adulto', 'atletas com 18 anos ou mais.'],
  ['Juvenil', 'atletas entre 14 e 17 anos.'],
  ['Infantil', 'atletas com até 13 anos.'],
] as const;

function ScoringCard({
  title,
  description,
  icon: Icon,
}: (typeof scoringRules)[number]) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </article>
  );
}

export function RankingRules() {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          Como funciona o ranking
        </h2>
        <p className="text-sm text-muted-foreground">
          A pontuação é calculada a partir de vitórias em campeonatos, medalhas
          conquistadas e consistência de participação durante a temporada.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {scoringRules.map((rule) => (
          <ScoringCard key={rule.title} {...rule} />
        ))}
      </div>

      <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <h2 className="mb-3 text-base font-semibold text-foreground">Categorias</h2>
        <ul className="space-y-2 text-sm">
          {categoryRules.map(([title, description]) => (
            <li key={title} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div>
                <span className="font-medium text-foreground">{title}</span>
                <span className="text-muted-foreground"> — {description}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <h2 className="mb-3 text-base font-semibold text-foreground">
          Variação de posição
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          O indicador ao lado da pontuação compara a posição atual com a temporada anterior.
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 text-success">
            <TrendingUp className="h-4 w-4" /> subiu de posição
          </li>
          <li className="flex items-center gap-2 text-destructive">
            <TrendingDown className="h-4 w-4" /> caiu de posição
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <Minus className="h-4 w-4" /> manteve posição
          </li>
        </ul>
      </section>
    </div>
  );
}
